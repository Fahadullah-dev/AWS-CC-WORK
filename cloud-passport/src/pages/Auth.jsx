import React, { useState } from 'react';
import { signIn, signUp, confirmSignUp, resendSignUpCode, resetPassword, confirmResetPassword, getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { createUser } from '../graphql/mutations';

const AVAILABLE_MAJORS = ['AI', 'CS', 'Cyber', 'BIS', 'Game Dev'];
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
  const [fullName, setFullName] = useState(''); 
  const [major, setMajor] = useState([]);
  const [year, setYear] = useState(3);
  
  const [intakeMonth, setIntakeMonth] = useState('Jan');
  const [intakeYear, setIntakeYear] = useState('2026');
  
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_PRESETS[0]); 

  const toggleMajor = (m) => {
    setMajor(prev => {
      const isSelected = prev.includes(m);
      if (isSelected) return prev.filter(x => x !== m);
      if (prev.length >= 2) { setPopup({ type: 'error', message: "MAXIMUM 2 MAJORS ALLOWED PER PASSPORT." }); return prev; }
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
      
      try {
        const { userId } = await getCurrentUser();
        const client = generateClient();
        const studentID = email.split('@')[0];

        await client.graphql({
          query: createUser,
          variables: {
            input: {
              id: userId,
              email: email,
              full_name: fullName || studentID,
              major: major.length > 0 ? major : ['General'],
              year: parseInt(year),
              intake: `${intakeMonth} ${intakeYear}`,
              avatar_url: avatarUrl,
              member_id: studentID,
              xp: 0,
              tier: "EXPLORER"
            }
          }
        });
      } catch (dbError) {
        console.error("Profile sync error:", dbError);
      }

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
            <div style={{ ...popupHeaderStyle, backgroundColor: popup.type === 'error' ? '#ef4444' : '#00e87f' }}>
              [ {popup.type === 'error' ? 'SYSTEM ERROR' : 'SYSTEM NOTICE'} ]
            </div>
            <div style={popupBodyStyle}>{popup.message}</div>
            <button onClick={() => setPopup(null)} style={{...popupBtnStyle, backgroundColor: 'black', color: 'white'}}>ACKNOWLEDGE</button>
          </div>
        </div>
      )}

      <div style={cardStyle}>
        {view !== 'login' && (
          <button onClick={() => { setView('login'); setShowPassword(false); }} style={backBtnStyle}>❮ BACK</button>
        )}
        
        <div style={headerStyle}>
            <img src="/icons/logo2.png" alt="AWS Student Builder Group" style={{ height: '70px', marginBottom: '20px', objectFit: 'contain', maxWidth: '100%' }} />
            <h2 style={{ margin: '0', fontSize: '20px', fontWeight: '900', letterSpacing: '1px' }}>
                {view === 'login' ? 'LOGIN TERMINAL' : view === 'signup' ? 'CREATE PASSPORT' : view === 'confirm' ? 'VERIFY IDENTITY' : view === 'forgot' ? 'RECOVER ACCESS' : 'SET NEW PASSWORD'}
            </h2>
        </div>

        <div style={{ padding: '25px' }}>
            {view === 'login' && (
            <form onSubmit={handleLogin} style={formStyle}>
                <div style={inputGroup}><label style={labelStyle}>UNIVERSITY EMAIL</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} /></div>
                <div style={inputGroup}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <label style={labelStyle}>PASSWORD</label>
                        <span onClick={() => setShowPassword(!showPassword)} style={{ fontSize: '10px', fontWeight: '900', cursor: 'pointer', color: '#3ea1f3' }}>{showPassword ? '[HIDE]' : '[SHOW]'}</span>
                    </div>
                    <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
                </div>
                <button type="submit" disabled={loading} style={primaryBtnStyle}>{loading ? 'SYNCING...' : 'ACCESS PASSPORT'}</button>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '11px', fontWeight: '900' }}>
                    <span style={{ color: '#9b68f6', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setView('forgot')}>FORGOT PASSWORD?</span>
                    <span style={{ color: '#ff9900', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setView('signup')}>INITIALIZE NEW BUILDER</span>
                </div>
            </form>
            )}

            {view === 'forgot' && (
            <form onSubmit={handleForgotPassword} style={formStyle}>
                <p style={{ fontSize: '12px', fontWeight: 'bold' }}>Enter your email to receive a recovery code.</p>
                <div style={inputGroup}><label style={labelStyle}>UNIVERSITY EMAIL</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} /></div>
                <button type="submit" disabled={loading} style={primaryBtnStyle}>SEND RECOVERY CODE</button>
            </form>
            )}

            {view === 'reset' && (
            <form onSubmit={handleResetPassword} style={formStyle}>
                <div style={inputGroup}><label style={labelStyle}>RECOVERY CODE</label><input type="text" required value={code} onChange={e => setCode(e.target.value)} style={inputStyle} /></div>
                <div style={inputGroup}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <label style={labelStyle}>NEW PASSWORD</label>
                        <span onClick={() => setShowPassword(!showPassword)} style={{ fontSize: '10px', fontWeight: '900', cursor: 'pointer', color: '#3ea1f3' }}>{showPassword ? '[HIDE]' : '[SHOW]'}</span>
                    </div>
                    <input type={showPassword ? "text" : "password"} required value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle} />
                </div>
                <button type="submit" disabled={loading} style={primaryBtnStyle}>CONFIRM NEW PASSWORD</button>
            </form>
            )}

            {view === 'signup' && (
            <form onSubmit={handleSignUp} style={formStyle}>
                <div style={inputGroup}><label style={labelStyle}>FULL NAME</label><input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} /></div>
                
                <div style={inputGroup}><label style={labelStyle}>MURDOCH EMAIL (@student.murdoch.edu.au)</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} /></div>
                <div style={inputGroup}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <label style={labelStyle}>SECURE PASSWORD</label>
                        <span onClick={() => setShowPassword(!showPassword)} style={{ fontSize: '10px', fontWeight: '900', cursor: 'pointer', color: '#3ea1f3' }}>{showPassword ? '[HIDE]' : '[SHOW]'}</span>
                    </div>
                    <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>MAJORS (MAX 2)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {AVAILABLE_MAJORS.map(m => {
                        const isSelected = major.includes(m);
                        return (
                          <div key={m} onClick={() => toggleMajor(m)} style={{ ...pillStyle, backgroundColor: isSelected ? '#ff9900' : '#f0f0f0', border: isSelected ? '3px solid black' : '3px solid transparent' }}>
                            {m}
                          </div>
                        )
                      })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>YEAR LEVEL</label>
                      <select value={year} onChange={e => setYear(e.target.value)} style={inputStyle}>
                        <option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option>
                      </select>
                    </div>
                    <div style={{ flex: 1.5 }}>
                      <label style={labelStyle}>FIRST INTAKE</label>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <select value={intakeMonth} onChange={e => setIntakeMonth(e.target.value)} style={inputStyle}>
                          <option value="Jan">Jan</option><option value="May">May</option><option value="Sep">Sep</option>
                        </select>
                        <select value={intakeYear} onChange={e => setIntakeYear(e.target.value)} style={inputStyle}>
                          {Array.from({length: 11}, (_, i) => 2020 + i).map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                    </div>
                </div>
                <div style={{ border: '3px solid black', padding: '15px', backgroundColor: '#f9f9f9' }}>
                    <label style={labelStyle}>SELECT AVATAR</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                        {AVATAR_PRESETS.map(url => (<img key={url} src={url} onClick={() => setAvatarUrl(url)} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', border: avatarUrl === url ? '4px solid #3ea1f3' : '2px solid black', cursor: 'pointer' }} />))}
                    </div>
                </div>
                <button type="submit" disabled={loading} style={primaryBtnStyle}>ISSUE PASSPORT</button>
            </form>
            )}

            {view === 'confirm' && (
            <form onSubmit={handleConfirm} style={formStyle}>
                <label style={{...labelStyle, textAlign: 'center'}}>ENTER VERIFICATION CODE SENT TO EMAIL</label>
                <input type="text" required value={code} onChange={e => setCode(e.target.value)} style={{ ...inputStyle, textAlign: 'center', fontSize: '28px', letterSpacing: '5px' }} />
                <button type="submit" disabled={loading} style={primaryBtnStyle}>CONFIRM IDENTITY</button>
                <div style={{ textAlign: 'center', marginTop: '10px' }}><span onClick={handleResendCode} style={{ fontSize: '11px', fontWeight: '900', color: '#9b68f6', cursor: 'pointer', textDecoration: 'underline' }}>DIDN'T RECEIVE IT? RESEND CODE</span></div>
            </form>
            )}
        </div>
      </div>
    </div>
  );
}

const containerStyle = { 
  minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5% 15px', backgroundColor: '#1a1c21', 
  backgroundImage: `url("/icons/background.png")`, 
  backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed', color: 'black', boxSizing: 'border-box' 
};
const cardStyle = { width: '100%', maxWidth: '480px', backgroundColor: 'white', border: '4px solid white', boxShadow: '12px 12px 0px black', position: 'relative', color: 'black', boxSizing: 'border-box' };
const headerStyle = { backgroundColor: '#1a1c21', color: 'white', padding: '30px 20px', borderBottom: '4px solid white', textAlign: 'center' };
const backBtnStyle = { position: 'absolute', top: '22px', left: '15px', background: 'white', border: '2px solid black', color: 'black', fontWeight: '900', fontSize: '10px', padding: '5px 10px', cursor: 'pointer', zIndex: 10 };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '5px' };
const labelStyle = { fontSize: '10px', fontWeight: '900', color: 'black', letterSpacing: '0.5px' };
const inputStyle = { width: '100%', padding: '12px', border: '2px solid black', fontWeight: 'bold', outline: 'none', color: 'black', backgroundColor: 'white', boxSizing: 'border-box' };
const pillStyle = { padding: '6px 12px', border: '2px solid black', fontSize: '11px', fontWeight: '900', cursor: 'pointer', color: 'black' };
const primaryBtnStyle = { padding: '15px', border: '4px solid black', backgroundColor: '#3ea1f3', color: 'white', fontWeight: '900', fontSize: '14px', cursor: 'pointer', boxShadow: '5px 5px 0px black', width: '100%' };
const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' };
const popupCardStyle = { backgroundColor: 'white', border: '4px solid black', width: '100%', maxWidth: '400px', textAlign: 'center', overflow: 'hidden' };
const popupHeaderStyle = { color: 'white', padding: '15px', borderBottom: '4px solid black', fontWeight: '900', fontSize: '16px', letterSpacing: '2px' };
const popupBodyStyle = { padding: '20px', fontWeight: 'bold', fontSize: '14px', color: 'black', lineHeight: '1.5', textTransform: 'uppercase' }; 
const popupBtnStyle = { width: '100%', padding: '15px', backgroundColor: 'black', color: 'white', fontWeight: '900', border: 'none', borderTop: '4px solid black', cursor: 'pointer', fontSize: '14px', letterSpacing: '1px' };