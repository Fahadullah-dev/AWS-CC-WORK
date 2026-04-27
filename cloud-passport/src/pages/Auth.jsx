import React, { useState } from 'react';
import { signIn, signUp, confirmSignUp } from 'aws-amplify/auth';

const AVAILABLE_MAJORS = ['AI', 'Computer Science', 'Cybersecurity', 'Business Information Systems', 'Game Dev'];
const AVATAR_PRESETS = [
  "/avatars/pfp1.jpg", "/avatars/pfp2.jpg", "/avatars/pfp3.jpg", "/avatars/pfp4.jpg", "/avatars/pfp5.jpg",
  "/avatars/pfp6.jpg", "/avatars/pfp7.jpg", "/avatars/pfp8.jpg", "/avatars/pfp9.jpg", "/avatars/pfp10.jpg"
];

// NOTE the onAuthSuccess prop here!
export default function Auth({ onAuthSuccess }) {
  const [view, setView] = useState('login'); 
  const [loading, setLoading] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [major, setMajor] = useState([]);
  const [year, setYear] = useState(3);
  const [intake, setIntake] = useState('Jan 2024');
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_PRESETS[0]); 

  const toggleMajor = (m) => {
    setMajor(prev => {
      if (prev.includes(m)) return prev.filter(x => x !== m);
      if (prev.length >= 2) { alert("Max 2 majors allowed"); return prev; }
      return [...prev, m];
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 200; 
        let width = img.width; let height = img.height;
        if (width > height) { if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } } 
        else { if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        setAvatarUrl(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { 
      await signIn({ username: email, password }); 
      onAuthSuccess(); // Fast Transition!
    } 
    catch (err) { alert(err.message); }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (major.length === 0) { alert("Please select at least 1 major."); return; }
    setLoading(true);
    try {
      const profileData = { full_name: fullName, major, year: parseInt(year), intake, avatar_url: avatarUrl };
      localStorage.setItem('pendingCloudProfile', JSON.stringify(profileData));
      await signUp({ username: email, password, options: { userAttributes: { email } } });
      setView('confirm');
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      await signIn({ username: email, password });
      onAuthSuccess(); // Fast Transition!
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {view !== 'login' && (
          <button onClick={() => setView('login')} style={backBtnStyle}>
            <img src="/icons/camera.png" style={{ width: '12px', transform: 'rotate(180deg)' }} alt="back" /> BACK
          </button>
        )}
        
        <div style={headerStyle}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', letterSpacing: '1px' }}>
                {view === 'login' ? 'LOGIN_TERMINAL' : view === 'signup' ? 'CREATE_PASSPORT' : 'VERIFY_IDENTITY'}
            </h2>
        </div>

        <div style={{ padding: '25px' }}>
            {view === 'login' && (
            <form onSubmit={handleLogin} style={formStyle}>
                <div style={inputGroup}>
                    <label style={labelStyle}>UNIVERSITY_EMAIL</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
                </div>
                <div style={inputGroup}>
                    <label style={labelStyle}>PASSWORD</label>
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
                </div>
                <button type="submit" disabled={loading} style={primaryBtnStyle}>
                    {loading ? 'SYNCING...' : 'ACCESS_PASSPORT'}
                </button>
                <p style={{ textAlign: 'center', fontSize: '12px', fontWeight: '900', marginTop: '15px' }}>
                    NEW_BUILDER? <span style={{ color: '#6B38FB', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setView('signup')}>INITIALIZE_HERE</span>
                </p>
            </form>
            )}

            {view === 'signup' && (
            <form onSubmit={handleSignUp} style={formStyle}>
                <div style={inputGroup}>
                    <label style={labelStyle}>FULL_NAME</label>
                    <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} />
                </div>
                <div style={inputGroup}>
                    <label style={labelStyle}>MURDOCH_EMAIL</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
                </div>
                <div style={inputGroup}>
                    <label style={labelStyle}>SECURE_PASSWORD</label>
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
                </div>
                
                <div>
                  <label style={labelStyle}>MAJORS_ARRAY (MAX 2)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {AVAILABLE_MAJORS.map(m => (
                      <div key={m} onClick={() => toggleMajor(m)} style={{ ...pillStyle, background: major.includes(m) ? '#FF9900' : '#f0f0f0' }}>{m}</div>
                      ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}><label style={labelStyle}>YEAR_LVL</label>
                        <select value={year} onChange={e => setYear(e.target.value)} style={inputStyle}><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option></select>
                    </div>
                    <div style={{ flex: 1 }}><label style={labelStyle}>INTAKE_ID</label><input required type="text" value={intake} onChange={e => setIntake(e.target.value)} style={inputStyle} /></div>
                </div>

                <div style={{ border: '3px solid black', padding: '15px', backgroundColor: '#f9f9f9' }}>
                    <label style={labelStyle}>SELECT_AVATAR_UNIT</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '15px' }}>
                        {AVATAR_PRESETS.map(url => (
                        <img key={url} src={url} onClick={() => setAvatarUrl(url)} 
                        style={{ 
                          width: '100%', aspectRatio: '1/1', objectFit: 'cover',
                          border: avatarUrl === url ? '4px solid #FF9900' : '2px solid black', 
                          cursor: 'pointer', backgroundColor: 'white' 
                        }} />
                        ))}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <label style={uploadBtnStyle}>
                            <img src="/icons/upload.png" style={{ width: '14px', marginRight: '5px', verticalAlign: 'middle' }} alt="upload" />
                            UPLOAD_CUSTOM_ASSET
                            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                        </label>
                    </div>
                </div>
                
                <button type="submit" disabled={loading} style={primaryBtnStyle}>ISSUE_PASSPORT</button>
            </form>
            )}

            {view === 'confirm' && (
            <form onSubmit={handleConfirm} style={formStyle}>
                <label style={{...labelStyle, textAlign: 'center'}}>ENTER_VERIFICATION_CODE</label>
                <input type="text" required value={code} onChange={e => setCode(e.target.value)} style={{ ...inputStyle, textAlign: 'center', fontSize: '28px', letterSpacing: '5px' }} />
                <button type="submit" disabled={loading} style={primaryBtnStyle}>CONFIRM_IDENTITY</button>
            </form>
            )}
        </div>
      </div>
    </div>
  );
}

// STYLES
const containerStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backgroundColor: '#f4f4f4', backgroundImage: 'radial-gradient(#d1d1d1 1px, transparent 1px)', backgroundSize: '20px 20px' };
const cardStyle = { width: '100%', maxWidth: '480px', backgroundColor: 'white', border: '4px solid black', boxShadow: '12px 12px 0px black', position: 'relative', color: 'black' };
const headerStyle = { backgroundColor: '#6B38FB', color: 'white', padding: '20px', borderBottom: '4px solid black', textAlign: 'center' };
const backBtnStyle = { position: 'absolute', top: '22px', left: '15px', background: 'white', border: '2px solid black', color: 'black', fontWeight: '900', fontSize: '10px', padding: '5px 10px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', gap: '5px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '5px' };
const labelStyle = { fontSize: '10px', fontWeight: '900', color: 'black', letterSpacing: '0.5px' };
const inputStyle = { width: '100%', padding: '12px', border: '2px solid black', fontWeight: 'bold', outline: 'none', color: 'black', backgroundColor: 'white' };
const pillStyle = { padding: '6px 12px', border: '2px solid black', fontSize: '11px', fontWeight: '900', cursor: 'pointer', color: 'black' };
const primaryBtnStyle = { padding: '15px', border: '4px solid black', backgroundColor: '#FF9900', color: 'black', fontWeight: '900', fontSize: '14px', cursor: 'pointer', boxShadow: '5px 5px 0px black' };
const uploadBtnStyle = { cursor: 'pointer', border: '2px solid black', backgroundColor: 'white', padding: '8px 15px', fontWeight: '900', fontSize: '11px', boxShadow: '3px 3px 0px black', display: 'inline-block', color: 'black' };