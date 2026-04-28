import React, { useState } from 'react';
import { signIn, signUp, confirmSignUp, resendSignUpCode, resetPassword, confirmResetPassword } from 'aws-amplify/auth';

const AVAILABLE_MAJORS = ['AI', 'Computer Science', 'Cybersecurity', 'Business Information Systems', 'Game Dev'];
const AVATAR_PRESETS = [
  "/avatars/pfp1.jpg", "/avatars/pfp2.jpg", "/avatars/pfp3.jpg", "/avatars/pfp4.jpg", "/avatars/pfp5.jpg",
  "/avatars/pfp6.jpg", "/avatars/pfp7.jpg", "/avatars/pfp8.jpg", "/avatars/pfp9.jpg", "/avatars/pfp10.jpg"
];

export default function Auth({ onAuthSuccess }) {
  const [view, setView] = useState('login'); 
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null); 
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [code, setCode] = useState('');
  const [major, setMajor] = useState([]);
  const [year, setYear] = useState(3);
  const [intake, setIntake] = useState('Jan 2026');
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_PRESETS[0]); 

  const toggleMajor = (m) => {
    setMajor(prev => {
      if (prev.includes(m)) return prev.filter(x => x !== m);
      if (prev.length >= 2) { setPopup({ type: 'error', message: "Max 2 majors allowed" }); return prev; }
      return [...prev, m];
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { 
      const { isSignedIn, nextStep } = await signIn({ username: email, password }); 
      if (nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        setPopup({ type: 'error', message: "Identity not verified. Redirecting to verification terminal..." });
        setView('confirm');
      } else if (isSignedIn || nextStep?.signInStep === 'DONE') {
        onAuthSuccess();
      }
    } catch (err) { 
      if (err.name === 'UserNotConfirmedException') {
        setPopup({ type: 'error', message: "Identity not verified. Redirecting to verification terminal..." });
        setView('confirm');
      } else { setPopup({ type: 'error', message: err.message }); }
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (major.length === 0) { setPopup({ type: 'error', message: "Please select at least 1 major." }); return; }
    const isMurdoch = email.endsWith('@student.murdoch.edu.au') || email.endsWith('@murdoch.edu.au');
    if (!isMurdoch) {
      setPopup({ type: 'error', message: "You must use a valid Murdoch University email domain to register." });
      return;
    }
    setLoading(true);
    try {
      await signUp({ username: email, password, options: { userAttributes: { email } } });
      setView('confirm');
    } catch (err) { setPopup({ type: 'error', message: err.message }); }
    setLoading(false);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      await signIn({ username: email, password });
      onAuthSuccess(); 
    } catch (err) { setPopup({ type: 'error', message: err.message }); }
    setLoading(false);
  };

  const handleResendCode = async () => {
    try {
      await resendSignUpCode({ username: email });
      setPopup({ type: 'success', message: "Verification code re-sent to your email!" });
    } catch (err) { setPopup({ type: 'error', message: err.message }); }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword({ username: email });
      setView('reset');
    } catch (err) { setPopup({ type: 'error', message: err.message }); }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
      setPopup({ type: 'success', message: "Password reset successfully. Please login." });
      setView('login');
    } catch (err) { setPopup({ type: 'error', message: err.message }); }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      {popup && (
        <div style={overlayStyle} onClick={() => setPopup(null)}>
          <div style={popupCardStyle} onClick={e => e.stopPropagation()}>
            <div style={{ ...popupHeaderStyle, backgroundColor: popup.type === 'error' ? '#ff57f6' : '#00e87f' }}>
              [ {popup.type === 'error' ? 'SYSTEM_ERROR' : 'SYSTEM_NOTICE'} ]
            </div>
            <div style={popupBodyStyle}>{popup.message}</div>
            <button onClick={() => setPopup(null)} style={popupBtnStyle}>ACKNOWLEDGE</button>
          </div>
        </div>
      )}

      <div style={cardStyle}>
        {view !== 'login' && (
          <button onClick={() => { setView('login'); setShowPassword(false); }} style={backBtnStyle}>❮ BACK</button>
        )}
        
        <div style={headerStyle}>
            {/* REMOVED FILTER */}
            <img src="/icons/brandmark.svg" alt="AWS Student Builder Group" style={{ height: '100px', marginBottom: '20px' }} />
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', letterSpacing: '1px' }}>
                {view === 'login' ? 'LOGIN_TERMINAL' : view === 'signup' ? 'CREATE_PASSPORT' : view === 'confirm' ? 'VERIFY_IDENTITY' : view === 'forgot' ? 'RECOVER_ACCESS' : 'SET_NEW_PASSWORD'}
            </h2>
        </div>

        <div style={{ padding: '30px' }}>
            {view === 'login' && (
            <form onSubmit={handleLogin} style={formStyle}>
                <div style={inputGroup}><label style={labelStyle}>UNIVERSITY_EMAIL</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} /></div>
                <div style={inputGroup}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <label style={labelStyle}>PASSWORD</label>
                        <span onClick={() => setShowPassword(!showPassword)} style={{ fontSize: '10px', fontWeight: '900', cursor: 'pointer', color: '#3ea1f3' }}>{showPassword ? '[HIDE]' : '[SHOW]'}</span>
                    </div>
                    <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
                </div>
                <button type="submit" disabled={loading} style={primaryBtnStyle}>{loading ? 'SYNCING...' : 'ACCESS_PASSPORT'}</button>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '11px', fontWeight: '900' }}>
                    <span style={{ color: '#9b68f6', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setView('forgot')}>FORGOT_PASSWORD?</span>
                    <span style={{ color: '#ff9900', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setView('signup')}>INITIALIZE_NEW_BUILDER</span>
                </div>
            </form>
            )}

            {view === 'forgot' && (
            <form onSubmit={handleForgotPassword} style={formStyle}>
                <p style={{ fontSize: '12px', fontWeight: 'bold' }}>Enter your email to receive a recovery code.</p>
                <div style={inputGroup}><label style={labelStyle}>UNIVERSITY_EMAIL</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} /></div>
                <button type="submit" disabled={loading} style={primaryBtnStyle}>SEND_RECOVERY_CODE</button>
            </form>
            )}

            {view === 'reset' && (
            <form onSubmit={handleResetPassword} style={formStyle}>
                <div style={inputGroup}><label style={labelStyle}>RECOVERY_CODE</label><input type="text" required value={code} onChange={e => setCode(e.target.value)} style={inputStyle} /></div>
                <div style={inputGroup}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <label style={labelStyle}>NEW_PASSWORD</label>
                        <span onClick={() => setShowPassword(!showPassword)} style={{ fontSize: '10px', fontWeight: '900', cursor: 'pointer', color: '#3ea1f3' }}>{showPassword ? '[HIDE]' : '[SHOW]'}</span>
                    </div>
                    <input type={showPassword ? "text" : "password"} required value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle} />
                </div>
                <button type="submit" disabled={loading} style={primaryBtnStyle}>CONFIRM_NEW_PASSWORD</button>
            </form>
            )}

            {view === 'signup' && (
            <form onSubmit={handleSignUp} style={formStyle}>
                <div style={inputGroup}><label style={labelStyle}>MURDOCH_EMAIL (@student.murdoch.edu.au)</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} /></div>
                <div style={inputGroup}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <label style={labelStyle}>SECURE_PASSWORD</label>
                        <span onClick={() => setShowPassword(!showPassword)} style={{ fontSize: '10px', fontWeight: '900', cursor: 'pointer', color: '#3ea1f3' }}>{showPassword ? '[HIDE]' : '[SHOW]'}</span>
                    </div>
                    <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>MAJORS_ARRAY (MAX 2)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {AVAILABLE_MAJORS.map(m => (<div key={m} onClick={() => toggleMajor(m)} style={{ ...pillStyle, background: major.includes(m) ? '#ff9900' : '#f0f0f0' }}>{m}</div>))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}><label style={labelStyle}>YEAR_LVL</label><select value={year} onChange={e => setYear(e.target.value)} style={inputStyle}><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option></select></div>
                    <div style={{ flex: 1 }}><label style={labelStyle}>INTAKE</label><input required type="text" placeholder="e.g. Jan 2026" value={intake} onChange={e => setIntake(e.target.value)} style={inputStyle} /></div>
                </div>
                <div style={{ border: '3px solid black', padding: '15px', backgroundColor: '#f9f9f9' }}>
                    <label style={labelStyle}>SELECT_AVATAR_UNIT</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                        {AVATAR_PRESETS.map(url => (<img key={url} src={url} onClick={() => setAvatarUrl(url)} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', border: avatarUrl === url ? '4px solid #3ea1f3' : '2px solid black', cursor: 'pointer' }} />))}
                    </div>
                </div>
                <button type="submit" disabled={loading} style={primaryBtnStyle}>ISSUE_PASSPORT</button>
            </form>
            )}

            {view === 'confirm' && (
            <form onSubmit={handleConfirm} style={formStyle}>
                <label style={{...labelStyle, textAlign: 'center'}}>ENTER_VERIFICATION_CODE SENT TO EMAIL</label>
                <input type="text" required value={code} onChange={e => setCode(e.target.value)} style={{ ...inputStyle, textAlign: 'center', fontSize: '28px', letterSpacing: '5px' }} />
                <button type="submit" disabled={loading} style={primaryBtnStyle}>CONFIRM_IDENTITY</button>
                <div style={{ textAlign: 'center', marginTop: '10px' }}><span onClick={handleResendCode} style={{ fontSize: '11px', fontWeight: '900', color: '#9b68f6', cursor: 'pointer', textDecoration: 'underline' }}>DIDN'T RECEIVE IT? RESEND CODE</span></div>
            </form>
            )}
        </div>
      </div>
    </div>
  );
}

// AWS STUDENT BUILDER GROUP STYLES
const containerStyle = { 
  minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', backgroundColor: '#1a1c21', 
  backgroundImage: `
    linear-gradient(#2d3139 2px, transparent 2px), 
    linear-gradient(90deg, #2d3139 2px, transparent 2px),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Crect x='0' y='0' width='80' height='80' fill='%23ff9900' opacity='0.8'/%3E%3Crect x='200' y='0' width='80' height='80' fill='%23ff9900' opacity='0.8'/%3E%3Crect x='120' y='0' width='40' height='40' fill='%239b68f6' opacity='0.8'/%3E%3Crect x='80' y='40' width='40' height='40' fill='%239b68f6' opacity='0.8'/%3E%3Crect x='160' y='40' width='40' height='40' fill='%239b68f6' opacity='0.8'/%3E%3Crect x='40' y='80' width='40' height='40' fill='%239b68f6' opacity='0.8'/%3E%3Crect x='200' y='80' width='40' height='40' fill='%239b68f6' opacity='0.8'/%3E%3Crect x='120' y='80' width='40' height='40' fill='%23ff57f6' opacity='0.8'/%3E%3Crect x='80' y='120' width='40' height='40' fill='%23ff57f6' opacity='0.8'/%3E%3Crect x='160' y='120' width='40' height='40' fill='%23ff57f6' opacity='0.8'/%3E%3Crect x='0' y='160' width='80' height='80' fill='%23ff9900' opacity='0.8'/%3E%3Crect x='200' y='160' width='80' height='80' fill='%23ff9900' opacity='0.8'/%3E%3Crect x='120' y='200' width='40' height='40' fill='%239b68f6' opacity='0.8'/%3E%3C/svg%3E")
  `, 
  backgroundSize: '40px 40px, 40px 40px, 500px 500px', backgroundPosition: '0 0, 0 0, right 50px', backgroundRepeat: 'repeat, repeat, no-repeat', color: 'black' 
};
const cardStyle = { width: '100%', maxWidth: '480px', backgroundColor: 'white', border: '4px solid white', boxShadow: '12px 12px 0px black', position: 'relative', color: 'black' };
const headerStyle = { backgroundColor: '#1a1c21', color: 'white', padding: '30px 20px', borderBottom: '4px solid white', textAlign: 'center' };
const backBtnStyle = { position: 'absolute', top: '22px', left: '15px', background: 'white', border: '2px solid black', color: 'black', fontWeight: '900', fontSize: '10px', padding: '5px 10px', cursor: 'pointer', zIndex: 10 };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '5px' };
const labelStyle = { fontSize: '10px', fontWeight: '900', color: 'black', letterSpacing: '0.5px' };
const inputStyle = { width: '100%', padding: '12px', border: '2px solid black', fontWeight: 'bold', outline: 'none', color: 'black', backgroundColor: 'white' };
const pillStyle = { padding: '6px 12px', border: '2px solid black', fontSize: '11px', fontWeight: '900', cursor: 'pointer', color: 'black' };
const primaryBtnStyle = { padding: '15px', border: '4px solid black', backgroundColor: '#3ea1f3', color: 'white', fontWeight: '900', fontSize: '14px', cursor: 'pointer', boxShadow: '5px 5px 0px black' };
const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' };
const popupCardStyle = { backgroundColor: 'white', border: '4px solid black', boxShadow: '12px 12px 0px #ff9900', width: '100%', maxWidth: '400px', textAlign: 'center', overflow: 'hidden' };
const popupHeaderStyle = { color: 'white', padding: '15px', borderBottom: '4px solid black', fontWeight: '900', fontSize: '16px', letterSpacing: '2px' };
const popupBodyStyle = { padding: '30px 20px', fontWeight: 'bold', fontSize: '14px', color: 'black', lineHeight: '1.5' };
const popupBtnStyle = { width: '100%', padding: '15px', backgroundColor: 'black', color: 'white', fontWeight: '900', border: 'none', borderTop: '4px solid black', cursor: 'pointer', fontSize: '14px', letterSpacing: '1px' };