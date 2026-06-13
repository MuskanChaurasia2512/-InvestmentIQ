import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import axios from 'axios';

const Chatbot = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there! 👋 I am your InvestIQ AI advisor. How can I help you manage your portfolio and minimize losses today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { sender: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Exclude the initial greeting from history to save tokens and keep it clean
      const historyToSent = newMessages.slice(1, -1);
      
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: userMessage.text,
        history: historyToSent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages([...newMessages, { sender: 'bot', text: response.data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { sender: 'bot', text: error.response?.data?.error || 'Oops, something went wrong connecting to the server.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="chatbot-fab"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 900,
          transition: 'transform 0.3s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageSquare color="white" size={28} />
      </button>

      {/* Chat Window */}
      <div className="chatbot-window" style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '350px',
        height: '500px',
        background: 'var(--glass)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        display: isOpen ? 'flex' : 'none',
        flexDirection: 'column',
        zIndex: 900, // Z-index is 900. Modals typically have 1000+, so this automatically goes behind popups
        overflow: 'hidden',
        animation: 'slideUp 0.3s ease-out'
      }}>
        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .chat-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .chat-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .chat-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
        `}</style>

        {/* Header */}
        <div style={{
          padding: '1.25rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981'
            }}></div>
            <h3 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>InvestIQ Advisor</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="chat-scrollbar" style={{
          flex: 1,
          padding: '1rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              background: msg.sender === 'user' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.08)',
              padding: '0.75rem 1rem',
              borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              maxWidth: '85%',
              color: 'white',
              fontSize: '0.9rem',
              lineHeight: 1.4
            }}>
              {msg.text}
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.08)', padding: '0.75rem 1rem', borderRadius: '16px 16px 16px 4px' }}>
              <Loader2 size={18} color="white" className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} style={{
          padding: '1rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '0.5rem',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your portfolio..."
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '0.5rem 1rem',
              color: 'white',
              outline: 'none',
              fontSize: '0.9rem'
            }}
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            style={{
              background: 'var(--primary)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer',
              opacity: (!input.trim() || loading) ? 0.5 : 1
            }}
          >
            <Send size={16} color="white" style={{ marginLeft: '-2px' }} />
          </button>
        </form>
      </div>
    </>
  );
};

export default Chatbot;
