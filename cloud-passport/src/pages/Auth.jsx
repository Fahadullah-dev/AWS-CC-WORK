// src/pages/Auth.jsx
import React, { useState } from 'react';
import { signIn, signUp, confirmSignUp, resetPassword, confirmResetPassword } from 'aws-amplify/auth';

export default function Auth() {
  // 'login' | 'signup' | 'confirm_signup' | 'forgot_password' | 'reset_password'
  const [view, setView] = useState('login'); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const checkEmailRestriction = () => {
    if (!email.toLowerCase().endsWith('@student.murdoch.edu.au')) {
      setError('Access denied. You must use a valid @student.murdoch.edu.au email address.');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!checkEmailRestriction()) return;
    setLoading(true);
    try {
      await signIn({ username: email, password });
      // App.jsx will automatically detect the login and redirect!
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (!checkEmailRestriction()) return;
    setLoading(true);
    try {
      await signUp({
        username: email,
        password,
        options: { userAttributes: { email: email } }
      });
      setView('confirm_signup');
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const handleConfirmSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await confirmSignUp({ username: email, confirmationCode });
      await signIn({ username: email, password }); // Auto login after verify
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!checkEmailRestriction()) return;
    setLoading(true);
    try {
      await resetPassword({ username: email });
      setView('reset_password'); // Move to code entry screen
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await confirmResetPassword({ username: email, confirmationCode, newPassword: password });
      setView('login'); // Send back to login with new password
      setError('Password successfully reset! Please sign in.'); // Show success message
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0b1120', padding: '20px' }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', color: 'white', textAlign: 'center' }}>
        
        <div style={{ fontSize: '50px', marginBottom: '10px' }}>☁️</div>
        <h2 style={{ color: '#FF9900', margin: '0 0 5px 0' }}>AWS CLOUD CLUB</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '30px' }}>E-PASSPORT SYSTEM</p>

        {error && (
          <div style={{ background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {/* VIEW: LOGIN */}
        {view === 'login' && (
          <form onSubmit={handleLogin} style={formStyle}>
            <input type="email" placeholder="Student Email (@student.murdoch.edu.au)" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
            <button type="submit" disabled={loading} style={buttonStyle}>{loading ? 'Processing...' : 'Sign In'}</button>
            <div style={{ marginTop: '15px', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8', cursor: 'pointer' }} onClick={() => setView('forgot_password')}>Forgot Password?</span>
              <span style={{ color: '#FF9900', cursor: 'pointer' }} onClick={() => setView('signup')}>Create Passport</span>
            </div>
          </form>
        )}

        {/* VIEW: SIGN UP */}
        {view === 'signup' && (
          <form onSubmit={handleSignUp} style={formStyle}>
            <input type="email" placeholder="Student Email (@student.murdoch.edu.au)" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
            <input type="password" placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
            <button type="submit" disabled={loading} style={buttonStyle}>{loading ? 'Processing...' : 'Create Passport'}</button>
            <p style={{ marginTop: '15px', fontSize: '13px', color: '#94a3b8', cursor: 'pointer' }} onClick={() => setView('login')}>Already have a passport? Sign In</p>
          </form>
        )}

        {/* VIEW: CONFIRM SIGN UP (OTP) */}
        {view === 'confirm_signup' && (
          <form onSubmit={handleConfirmSignUp} style={formStyle}>
            <p style={{ fontSize: '14px', color: '#cbd5e1' }}>We sent a verification code to <b>{email}</b>.</p>
            <input type="text" placeholder="6-Digit Code" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} style={inputStyle} required />
            <button type="submit" disabled={loading} style={buttonStyle}>{loading ? 'Verifying...' : 'Verify & Login'}</button>
          </form>
        )}

        {/* VIEW: REQUEST PASSWORD RESET */}
        {view === 'forgot_password' && (
          <form onSubmit={handleForgotPassword} style={formStyle}>
            <p style={{ fontSize: '14px', color: '#cbd5e1' }}>Enter your email to receive a reset code.</p>
            <input type="email" placeholder="Student Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
            <button type="submit" disabled={loading} style={buttonStyle}>{loading ? 'Sending...' : 'Send Reset Code'}</button>
            <p style={{ marginTop: '15px', fontSize: '13px', color: '#94a3b8', cursor: 'pointer' }} onClick={() => setView('login')}>Back to Login</p>
          </form>
        )}

        {/* VIEW: CONFIRM PASSWORD RESET (OTP + New Password) */}
        {view === 'reset_password' && (
          <form onSubmit={handleConfirmReset} style={formStyle}>
            <p style={{ fontSize: '14px', color: '#cbd5e1' }}>Enter the code sent to your email and your new password.</p>
            <input type="text" placeholder="6-Digit Code" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} style={inputStyle} required />
            <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
            <button type="submit" disabled={loading} style={buttonStyle}>{loading ? 'Resetting...' : 'Save New Password'}</button>
          </form>
        )}

      </div>
    </div>
  );
}

// Reusable inline styles
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: 'white', outline: 'none', fontSize: '14px' };
const buttonStyle = { padding: '12px', borderRadius: '6px', border: 'none', background: '#FF9900', color: '#111', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginTop: '10px' };