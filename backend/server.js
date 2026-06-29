require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || process.env.MONGO_URL;
if (!mongoURI) {
  console.error('❌ ERROR: MONGO_URI (or MONGO_URL) environment variable is not defined!');
  console.error('Please configure MONGO_URI in your environment variables.');
} else {
  mongoose.connect(mongoURI).then(async () => {
    console.log('✅ MongoDB connected');
    // Initialize demo user if not exists
    const demoExists = await User.findOne({ email: 'demo@groww.com' });
    if (!demoExists) {
      const hashedDemoPass = await bcrypt.hash('demo123', 10);
      await new User({
        name: 'Demo User',
        email: 'demo@groww.com',
        password: hashedDemoPass,
      }).save();
      console.log('Demo user created: demo@groww.com / demo123');
    }
  }).catch((err) => console.error('MongoDB connection error:', err));
}

// Mongoose Models
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: String,
  pan: String,
  dob: String,
  gender: String,
  aadhar: String,
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, default: 'Unknown' },
  stockSymbol: { type: String, required: true },
  sector: String,
  type: { type: String, default: 'buy' },
  quantity: { type: Number, required: true },
  executionPrice: { type: Number, required: true },
  buyPrice: Number,
  sellPrice: Number,
  fees: { type: Number, default: 0 },
  currentPrice: Number,
  transactionDate: { type: Date, default: Date.now }
});
const Transaction = mongoose.model('Transaction', TransactionSchema);

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS Configuration ────────────────────────────────────────────────────────
// FRONTEND_URL env variable mein apna Vercel URL set karo (Render Dashboard pe)
const allowedOrigins = [
  process.env.FRONTEND_URL,               // Vercel production URL
  'http://localhost:5173',                 // Local development
  'http://localhost:3000',
].filter(Boolean); // undefined values hata do

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// ──────────────────────────────────────────────────────────────────────────────

app.use(express.json());

// ── Nodemailer transporter setup ──────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: send welcome email
async function sendWelcomeEmail(toEmail, userName) {
  try {
    await transporter.sendMail({
      from: `"InvestIQ 📈" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: '🎉 Welcome to InvestIQ – Your Smart Investment Dashboard!',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#0f0f1a; color:#e2e8f0; max-width:600px; margin:auto; border-radius:16px; overflow:hidden;">
          <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6); padding:40px 32px; text-align:center;">
            <h1 style="margin:0; font-size:2rem; color:#fff;">📈 InvestIQ</h1>
            <p style="margin:8px 0 0; color:rgba(255,255,255,0.85); font-size:1rem;">Smart Investment Tracking Dashboard</p>
          </div>
          <div style="padding:36px 32px;">
            <h2 style="color:#a78bfa; margin-top:0;">Hello ${userName}! 👋</h2>
            <p style="line-height:1.7; color:#cbd5e1;">
              Welcome to <strong style="color:#818cf8;">InvestIQ</strong> – your personal share market investment tracker. 
              We're thrilled to have you on board!
            </p>
            <p style="line-height:1.7; color:#cbd5e1;">You can now:</p>
            <ul style="color:#94a3b8; line-height:2;">
              <li>📊 Track your stock portfolio in real time</li>
              <li>📉 Analyse gains, losses and sector exposure</li>
              <li>🎯 Set and monitor investment goals</li>
              <li>🤖 Get AI-driven investment suggestions</li>
            </ul>
            <div style="text-align:center; margin:32px 0;">
              <a href="http://localhost:5173" style="background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; padding:14px 36px; border-radius:10px; text-decoration:none; font-weight:700; font-size:1rem;">
                Go to Dashboard →
              </a>
            </div>
            <p style="color:#64748b; font-size:0.8rem; text-align:center; margin-top:32px;">
              If you didn't create this account, please ignore this email.
            </p>
          </div>
        </div>
      `,
    });
    console.log(`✅ Welcome email sent to ${toEmail}`);
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    // Don't fail registration if email fails
  }
}
// ─────────────────────────────────────────────────────────────────────────────

// Import routes (we'll create simplified versions)
const authRoutes = express.Router();
const transactionRoutes = express.Router();

// Auth Routes (Global endpoints per requirements)
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) return res.status(400).json({ msg: 'Please enter all fields (Name, Email, Password).' });
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Email already registered. Please Login.' });
    
    // 🔐 Password hash karo — plain text kabhi store mat karo
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name: name || 'User', email, password: hashedPassword });
    await user.save();
    
    sendWelcomeEmail(email, user.name);
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ msg: 'Server error during signup', error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'Email not found! Please check or sign up first.' });
    
    // 🔐 bcrypt se password compare karo (secure way)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Password. Please try again.' });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ msg: 'Login fully successful', token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error during login' });
  }
});

// Update profile uses Authroutes router still
authRoutes.put('/profile', async (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ msg: 'No token' });

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ msg: 'Invalid token' });

    const { name, email, mobile, pan, dob, gender, aadhar } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile !== undefined) user.mobile = mobile;
    if (pan !== undefined) user.pan = pan.toUpperCase();
    if (dob !== undefined) user.dob = dob;
    if (gender !== undefined) user.gender = gender;
    if (aadhar !== undefined) user.aadhar = aadhar;

    await user.save();
    res.json({ msg: 'Profile updated', user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile, pan: user.pan, dob: user.dob, gender: user.gender } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Transaction Routes
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ msg: 'No token, authorization denied' });
    
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(401).json({ msg: 'Token is not valid' });
    
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ msg: 'Token is not valid' });
    
    req.user = { id: userId };
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token error' });
  }
};

transactionRoutes.get('/', authMiddleware, async (req, res) => {
  try {
    const userTransactions = await Transaction.find({ userId: req.user.id }).sort({ transactionDate: -1 });
    // Frontend expects "id" property
    const mapped = userTransactions.map(t => ({ ...t.toObject(), id: t._id }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ msg: 'Server error retrieving transactions' });
  }
});

transactionRoutes.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, symbol, sector, quantity, executionPrice, currentPrice, date, type, fees } = req.body;
    const price = Number(executionPrice) || Number(req.body.buyPrice) || 0;
    
    const newTransaction = new Transaction({
      userId: req.user.id,
      companyName: name || 'Unknown',
      stockSymbol: symbol,
      sector: sector,
      type: type || 'buy',
      quantity: Number(quantity),
      executionPrice: price,
      buyPrice: (!type || type === 'buy') ? price : null,
      sellPrice: type === 'sell' ? price : null,
      fees: Number(fees || 0),
      currentPrice: Number(currentPrice || price),
      transactionDate: date || new Date()
    });
    
    await newTransaction.save();
    res.json({ ...newTransaction.toObject(), id: newTransaction._id });
  } catch (err) {
    res.status(500).json({ msg: 'Server error creating transaction' });
  }
});

transactionRoutes.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ msg: 'Invalid ID' });
    
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    
    if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });
    res.json({ ...transaction.toObject(), id: transaction._id });
  } catch (err) {
    res.status(500).json({ msg: 'Server error updating transaction' });
  }
});

transactionRoutes.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ msg: 'Invalid ID' });
    
    const tx = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!tx) return res.status(404).json({ msg: 'Transaction not found' });
    
    res.json({ msg: 'Transaction removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error deleting transaction' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running!', 
    status: 'OK'
  });
});

// Test endpoint for direct login
app.post('/api/test-login', async (req, res) => {
  const demoUser = await User.findOne({ email: 'demo@groww.com' });
  if (demoUser) {
    const token = jwt.sign({ id: demoUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { id: demoUser._id, name: demoUser.name, email: demoUser.email } 
    });
  } else {
    res.status(404).json({ msg: 'Demo user not found' });
  }
});

// Real-time stock price API
app.get('/api/stock-price/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const upperSymbol = symbol.toUpperCase();

  // Fallback mock prices (used when Yahoo API is unavailable)
  const mockPrices = {
    'RELIANCE': 2840, 'TCS': 3180, 'HDFC': 1760, 'INFY': 1510,
    'SBIN': 810, 'NIFTY50': 24500, 'SENSEX': 80750,
    'HDFCBANK': 1640, 'ICICIBANK': 1250, 'WIPRO': 260,
    'BHARTIARTL': 1920, 'ITC': 435, 'MARUTI': 12500
  };

  const sendMockData = (sym) => {
    const price = mockPrices[sym] || 1000;
    res.json({
      symbol: sym,
      currentPrice: price,
      previousClose: parseFloat((price * 0.98).toFixed(2)),
      change: parseFloat((price * 0.02).toFixed(2)),
      changePercent: '2.00',
      currency: 'INR',
      marketState: 'CLOSED',
      note: 'Mock data - Live API unavailable'
    });
  };

  try {
    // Map symbols to correct Yahoo Finance tickers
    const symbolMap = {
      'NIFTY50': '^NSEI',
      'SENSEX':  '^BSESN'
    };

    let yahooTicker = symbolMap[upperSymbol] || `${upperSymbol}.NS`;

    // Use Yahoo Finance v7 quote API — simple and reliable
    const response = await axios.get('https://query1.finance.yahoo.com/v7/finance/quote', {
      params: { symbols: yahooTicker },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      timeout: 6000
    });

    const quotes = response.data?.quoteResponse?.result;
    if (quotes && quotes.length > 0) {
      const q = quotes[0];
      const currentPrice  = q.regularMarketPrice   || q.ask || 0;
      const previousClose = q.regularMarketPreviousClose || currentPrice;
      const change        = currentPrice - previousClose;
      const changePercent = previousClose > 0
        ? ((change / previousClose) * 100).toFixed(2)
        : '0.00';

      return res.json({
        symbol: symbol,
        currentPrice,
        previousClose,
        change: parseFloat(change.toFixed(2)),
        changePercent,
        currency: q.currency || 'INR',
        marketState: q.marketState || 'CLOSED'
      });
    }

    sendMockData(upperSymbol);
  } catch (error) {
    console.error(`Stock price API error for ${symbol}:`, error.message);
    sendMockData(upperSymbol);
  }
});

// Real AI Suggestions via Google Gemini
app.get('/api/ai/suggestions', authMiddleware, async (req, res) => {
  try {
    const userTransactions = await Transaction.find({ userId: req.user.id });
    
    const tradeDataStr = userTransactions.length === 0 
      ? 'The user has 0 transactions. Tell them to start exploring.' 
      : JSON.stringify(userTransactions.map(t => ({ 
          symbol: t.stockSymbol, 
          action: t.type.toUpperCase(), 
          price: t.executionPrice, 
          qty: t.quantity, 
          date: new Date(t.transactionDate).toLocaleDateString() 
        })));

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Gemini API key is not configured.");

    const prompt = `You are an AI Trading Agent. Follow these 3 steps exactly:
    1️⃣ Read Trading History: Look at exactly what the user bought, for how much, and when.
    2️⃣ Calculate Profit/Loss: Estimate net returns based on market trends for those symbols.
    3️⃣ Give Suggestion: Provide a direct action tag (Example: 'Hold', 'Sell', 'Buy more', 'Avoid over diversification').
    
    User Trade History: ${tradeDataStr}
    
    Format your response as a pure JSON array containing exactly 3 objects. Do not include markdown formatting or json wrappers.
    Schema:
    [
      {
        "type": "risk" | "performance" | "health" | "suggestion",
        "title": "One of: [Hold, Sell, Buy more, Avoid over diversification, or similar distinct command]",
        "message": "1 short sentence explaining why based on the history and PnL.",
        "color": "var(--primary)" // or var(--warning), var(--danger), var(--accent)
      }
    ]`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.5, topP: 0.8, topK: 40 }
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    let resultText = response.data.candidates[0].content.parts[0].text;
    resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedInsights = JSON.parse(resultText);

    res.json({ insights: parsedInsights });

  } catch (error) {
    console.error("AI Generation Error:", error?.response?.data || error.message);
    
    // Fallback Mock Data to keep UI looking premium during Quota limits
    const fallbacks = [
      {
        type: 'performance',
        title: 'Portfolio Diversification',
        message: 'Your current asset spread is healthy. Consider maintaining this balance to mitigate sector-specific risks.',
        color: 'var(--primary)'
      },
      {
        type: 'health',
        title: 'Strategic Holding',
        message: 'Historical data suggests that mid-term holding in current sectors yields optimal returns. Avoid frequent shuffling.',
        color: 'var(--accent)'
      },
      {
        type: 'suggestion',
        title: 'Tactical Rebalancing',
        message: 'Reviewing stop-loss targets for high-growth stocks helps protect against sudden market volatility.',
        color: 'var(--warning)'
      }
    ];

    res.json({ insights: fallbacks });
  }
});

// Persistent Chatbot AI Endpoint
app.post('/api/chat', authMiddleware, async (req, res) => {
  try {
    const { message, history } = req.body;
    const userTransactions = await Transaction.find({ userId: req.user.id });
    
    // Construct portfolio context
    const portfolioContext = userTransactions.length === 0 
      ? 'The user currently has no investments in their portfolio.' 
      : 'User Portfolio: ' + JSON.stringify(userTransactions.map(t => ({ 
          symbol: t.stockSymbol, 
          action: t.type, 
          qty: t.quantity, 
          price: t.executionPrice 
        })));

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Gemini API key is not configured.");

    const systemPrompt = `You are InvestIQ AI, an experienced and highly professional stock market advisor.
    CRITICAL INSTRUCTION: You MUST ONLY answer questions related to the stock market, shares, mutual funds, investments, trading, and finance.
    If the user asks ANYTHING unrelated to the financial markets (e.g., general knowledge, coding, weather, personal chat), you MUST politely refuse to answer and state that you are exclusively a stock market advisor.
    Your goal is to help the user manage their portfolio, minimize losses, and make data-driven investment decisions.
    Be concise, professional, and direct.
    
    Current User Context:
    ${portfolioContext}
    
    User Query: ${message}`;

    // Convert history format to Gemini format if needed, but for simplicity we can just send the system prompt + history as part of contents
    const contents = [];
    if (history && history.length > 0) {
      history.forEach(msg => {
        contents.push({ role: msg.sender === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] });
      });
    }
    contents.push({ role: 'user', parts: [{ text: systemPrompt }] });

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        contents,
        generationConfig: { temperature: 0.7, topP: 0.9 }
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const resultText = response.data.candidates[0].content.parts[0].text;
    res.json({ response: resultText });
  } catch (error) {
    const apiError = error?.response?.data?.error;
    console.error("Chat API Error:", apiError || error.message);
    
    if (apiError && apiError.code === 429) {
      // Rate limit hit
      res.status(429).json({ error: "I'm thinking too fast! Google Gemini API rate limit reached. Please wait a few seconds and try again. ⏱️" });
    } else {
      res.status(500).json({ error: "Failed to connect to Google Gemini AI. Please check your API key or try again later." });
    }
  }
});

// Portfolio Growth Data

app.get('/api/portfolio/growth', authMiddleware, async (req, res) => {
  try {
    const { period } = req.query;
    const generateData = (days) => {
      let data = [];
      let baseValue = 50000;
      let marketBase = 18000;
      for (let i = 0; i < days; i++) {
        baseValue += (Math.random() - 0.45) * 1000;
        marketBase += (Math.random() - 0.48) * 200;
        data.push({
          date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          value: Math.round(baseValue),
          market: Math.round(marketBase)
        });
      }
      return data;
    };
    const days = period === '1D' ? 2 : period === '1W' ? 7 : period === '1M' ? 30 : 365;
    res.json(generateData(days));
  } catch (err) {
    res.status(500).json({ msg: 'Error generating growth data' });
  }
});

// Market News Proxy API
app.get('/api/market-news', async (req, res) => {
  try {
    const query = req.query.q || 'India stock market NSE BSE Nifty Sensex';
    const apiKey = process.env.GNEWS_API_KEY;

    if (apiKey) {
      const response = await axios.get(
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=in&max=12&apikey=${apiKey}`
      );
      const articles = (response.data.articles || []).map(a => ({
        title: a.title,
        description: a.description,
        url: a.url,
        image: a.image,
        publishedAt: a.publishedAt,
        source: a.source?.name || 'Market News'
      }));
      return res.json({ articles });
    }

    // Fallback curated news when no API key
    const fallback = [
      { title: 'Nifty 50 surges past 24,500; IT and banking stocks lead rally', description: 'Indian benchmark indices closed higher on Friday, driven by strong buying in IT and banking sectors amid positive global cues.', url: 'https://economictimes.indiatimes.com/markets', image: null, publishedAt: new Date().toISOString(), source: 'Economic Times' },
      { title: 'Sensex jumps 600 points; RIL, HDFC Bank among top gainers', description: 'The BSE Sensex gained over 600 points in early trade today, with Reliance Industries and HDFC Bank emerging as major contributors to the upward movement.', url: 'https://www.livemint.com/market', image: null, publishedAt: new Date(Date.now() - 3600000).toISOString(), source: 'Live Mint' },
      { title: 'RBI keeps repo rate unchanged at 6.5%; markets react positively', description: 'The Reserve Bank of India maintained the repo rate at 6.5% in its latest monetary policy meeting, citing controlled inflation and stable growth outlook.', url: 'https://www.moneycontrol.com', image: null, publishedAt: new Date(Date.now() - 7200000).toISOString(), source: 'Moneycontrol' },
      { title: 'FII inflows surge: Foreign investors pump ₹8,500 crore into Indian equities', description: 'Foreign Institutional Investors showed renewed confidence in Indian markets, purchasing equities worth ₹8,500 crore in a single session.', url: 'https://www.business-standard.com/markets', image: null, publishedAt: new Date(Date.now() - 10800000).toISOString(), source: 'Business Standard' },
      { title: 'Midcap index outperforms large caps; pharma and FMCG stocks shine', description: 'The BSE Midcap index rose 1.2%, outperforming the benchmark Sensex, as pharmaceutical and FMCG companies reported robust quarterly earnings.', url: 'https://economictimes.indiatimes.com/markets/stocks', image: null, publishedAt: new Date(Date.now() - 14400000).toISOString(), source: 'Economic Times' },
      { title: 'Infosys Q4 results beat estimates; shares climb 4% post earnings', description: 'Infosys reported better-than-expected Q4 FY25 results with net profit rising 12% YoY. The stock surged 4% in intraday trade on the NSE.', url: 'https://www.nseindia.com', image: null, publishedAt: new Date(Date.now() - 18000000).toISOString(), source: 'NSE India' },
      { title: 'Global markets: Dow Jones, S&P 500 hit record highs overnight', description: 'US markets closed at record highs after strong jobs data, providing positive tailwinds for Asian and Indian markets in early trade.', url: 'https://www.reuters.com/markets', image: null, publishedAt: new Date(Date.now() - 21600000).toISOString(), source: 'Reuters' },
      { title: 'Auto sector on a roll: Maruti Suzuki sales up 18% MoM in May 2025', description: 'Maruti Suzuki India reported an 18% month-on-month increase in total vehicle sales for May 2025, driven by strong demand for SUVs and compact cars.', url: 'https://www.business-standard.com', image: null, publishedAt: new Date(Date.now() - 25200000).toISOString(), source: 'Business Standard' },
      { title: 'Gold prices soften as dollar strengthens; equity markets gain', description: 'Gold futures declined as the US dollar gained strength, redirecting investor interest towards equities, particularly in emerging markets like India.', url: 'https://economictimes.indiatimes.com', image: null, publishedAt: new Date(Date.now() - 28800000).toISOString(), source: 'Economic Times' },
      { title: 'TCS, Wipro see large block deals; institutions accumulate at lower levels', description: 'Large block deals were recorded in TCS and Wipro shares on the NSE, suggesting institutional accumulation ahead of Q1 results season.', url: 'https://www.livemint.com', image: null, publishedAt: new Date(Date.now() - 32400000).toISOString(), source: 'Live Mint' },
      { title: 'IPO market heats up: 5 new issues to open for subscription this week', description: 'This week will see five new IPO subscriptions opening, with analysts estimating high oversubscription given the current bullish market sentiment.', url: 'https://www.moneycontrol.com/ipo', image: null, publishedAt: new Date(Date.now() - 36000000).toISOString(), source: 'Moneycontrol' },
      { title: 'Crude oil slides to $78/barrel; energy stocks under pressure globally', description: 'Brent crude oil fell to $78 per barrel amid weak demand data from China, putting pressure on global energy stocks and Indian oil marketing companies.', url: 'https://www.reuters.com/business/energy', image: null, publishedAt: new Date(Date.now() - 39600000).toISOString(), source: 'Reuters' },
    ];
    res.json({ articles: fallback, note: 'Set GNEWS_API_KEY in .env for live news' });
  } catch (error) {
    console.error('News API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch news', articles: [] });
  }
});

// Routes
app.get('/', (req, res) => {
  res.send('InvestIQ Backend API is running successfully! 📈');
});
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// 404 catch-all
app.use((req, res) => {
  console.log(`❌ 404: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('MongoDB connection initializing...');
  console.log('Available endpoints:');
  console.log('  POST /api/signup');
  console.log('  POST /api/login');
  console.log('  POST /api/test-login (JWT bypass)');
  console.log('  GET, POST /api/transactions');
  console.log('  PUT, DELETE /api/transactions/:id');
  console.log('  GET /api/ai/suggestions');
});
