require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const nodemailer = require('nodemailer');

const mongoose = require('mongoose');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('✅ MongoDB connected');
  // Initialize demo user if not exists
  const demoExists = await User.findOne({ email: 'demo@groww.com' });
  if (!demoExists) {
    await new User({
      name: 'Demo User',
      email: 'demo@groww.com',
      password: 'demo123',
    }).save();
    console.log('Demo user created: demo@groww.com / demo123');
  }
}).catch((err) => console.error('MongoDB connection error:', err));

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

// Middleware
app.use(cors());
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

// Auth Routes
authRoutes.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    
    user = new User({ name, email, password });
    await user.save();
    
    sendWelcomeEmail(email, name);
    res.json({ token: 'token_' + user._id, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

authRoutes.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });
    
    res.json({ token: 'token_' + user._id, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update profile
authRoutes.put('/profile', async (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ msg: 'No token' });

    const token = authHeader.replace('Bearer ', '');
    const userId = token.replace('token_', '');
    
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
    const userId = token.replace('token_', '');
    
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
    const token = 'token_' + demoUser._id;
    res.json({ 
      token, 
      user: { id: demoUser._id, name: demoUser.name, email: demoUser.email } 
    });
  } else {
    res.status(400).json({ msg: 'Demo user not found' });
  }
});

// Real-time stock price API
app.get('/api/stock-price/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    // Using Yahoo Finance API (free)
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS`);
    
    if (response.data.chart.result && response.data.chart.result.length > 0) {
      const result = response.data.chart.result[0];
      const currentPrice = result.meta.regularMarketPrice;
      const previousClose = result.meta.chartPreviousClose;
      
      res.json({
        symbol: symbol,
        currentPrice: currentPrice,
        previousClose: previousClose,
        change: currentPrice - previousClose,
        changePercent: ((currentPrice - previousClose) / previousClose * 100).toFixed(2),
        currency: result.meta.currency,
        marketState: result.meta.marketState
      });
    } else {
      // Fallback to mock data if API fails
      const mockPrices = {
        'RELIANCE': 2800,
        'TCS': 3200,
        'HDFC': 1750,
        'INFY': 1500,
        'SBIN': 600
      };
      
      const price = mockPrices[symbol.toUpperCase()] || 1000;
      res.json({
        symbol: symbol,
        currentPrice: price,
        previousClose: price * 0.98,
        change: price * 0.02,
        changePercent: '2.00',
        currency: 'INR',
        marketState: 'CLOSED',
        note: 'Mock data - API unavailable'
      });
    }
  } catch (error) {
    console.error('Stock price API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch stock price' });
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
    res.json({ 
      insights: [{
        type: 'risk',
        title: 'AI Unavailable',
        message: 'Temporarily unable to connect to Gemini API.',
        color: 'var(--danger)'
      }] 
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('MongoDB connection initializing...');
  console.log('Available endpoints:');
  console.log('  POST /api/auth/register');
  console.log('  POST /api/auth/login');
  console.log('  POST /api/test-login (direct login bypass)');
  console.log('  GET, POST /api/transactions');
  console.log('  PUT, DELETE /api/transactions/:id');
  console.log('  GET /api/ai/suggestions');
});
