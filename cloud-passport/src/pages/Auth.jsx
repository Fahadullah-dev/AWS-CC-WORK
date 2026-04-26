// src/pages/Auth.jsx
import React, { useState } from 'react';
import { signIn, signUp } from '../lib/supabase';

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const inputStyle = {
    width: '100%',
    padding: '14px',
    marginBottom: '15px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: 'white',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  };

  async function submit(e) {
    e.preventDefault();
    setError('');
    
    // Fahad's Murdoch Student Gatekeeper
    if (mode === 'signup' && !email.endsWith('@student.murdoch.edu.au')) {
      setError('Only Murdoch student emails allowed (@student.murdoch.edu.au)');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password, name);
        if (error) throw error;
        setDone(true);
      } else {
        const { data, error } = await signIn(email, password);
        if (error) throw error;
        onLogin(data.user);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>✉️</div>
          <h2 style={{ color: 'var(--neon-green)', margin: '0 0 10px 0' }}>Check your email!</h2>
          <p style={{ color: '#aaa', marginBottom: '20px' }}>Click the confirmation link we sent, then come back here to log in.</p>
          <button className="btn-glow" style={{ width: '100%' }} onClick={() => { setDone(false); setMode('login'); }}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '40px 30px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>☁️</div>
          <h2 style={{ margin: 0, color: 'var(--neon-blue)', fontSize: '28px' }}>AWS Cloud Club</h2>
          <p style={{ margin: 0, color: 'var(--neon-purple)', letterSpacing: '2px', fontSize: '12px', textTransform: 'uppercase' }}>E-Passport Access</p>
        </div>

        <form onSubmit={submit}>
          {mode === 'signup' && (
            <input
              style={inputStyle}
              placeholder="Full Name (e.g. John Doe)"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          )}
          <input
            style={inputStyle}
            type="email"
            placeholder="Student Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          
          {error && (
            <div style={{ background: 'rgba(255, 86, 233, 0.1)', border: '1px solid var(--neon-pink)', color: 'var(--neon-pink)', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-glow" style={{ width: '100%', marginBottom: '15px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Authenticating...' : mode === 'login' ? 'Login to Passport' : 'Create E-Passport'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <button 
            style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }} 
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
          >
            {mode === 'login' ? "Don't have a passport? Sign up" : 'Already have a passport? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}