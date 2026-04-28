import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser, deleteUser as deleteCognitoUser, signOut } from 'aws-amplify/auth';
import { getUser, listAttendances } from '../graphql/queries';
import { createUser, updateUser, deleteUser as deleteDBUser } from '../graphql/mutations';

const AVAILABLE_MAJORS = ['AI', 'Computer Science', 'Cybersecurity', 'Business Information Systems', 'Game Dev'];
const AVATAR_PRESETS = [
  "/avatars/pfp1.jpg", "/avatars/pfp2.jpg", "/avatars/pfp3.jpg", "/avatars/pfp4.jpg", "/avatars/pfp5.jpg",
  "/avatars/pfp6.jpg", "/avatars/pfp7.jpg", "/avatars/pfp8.jpg", "/avatars/pfp9.jpg", "/avatars/pfp10.jpg"
];

const TIER_ICONS = {
  EXPLORER: '/icons/explorer.png',
  BUILDER: '/icons/builder.png',
  ARCHITECT: '/icons/architect.png',
  PIONEER: '/icons/pioneer.png'
};

export default function Passport() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState(null);
  const [form, setForm] = useState({ full_name: '', major: [], year: 1, intake: '', avatar_url: '' });

  useEffect(() => { fetchProfile(); }, []);

  async function fetchProfile() {
    try {
      const { userId, signInDetails } = await getCurrentUser();
      const client = generateClient();
      setUserId(userId);
      setUserEmail(signInDetails?.loginId);
      
      const [userRes, attendanceRes] = await Promise.all([
        client.graphql({ query: getUser, variables: { id: userId } }),
        client.graphql({ query: listAttendances, variables: { filter: { userID: { eq: userId } } } })
      ]);
      
      if (userRes.data.getUser) {
        setProfile(userRes.data.getUser);
        setForm(userRes.data.getUser);
      } else { setIsEditing(true); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  const toggleMajor = (m) => {
    setForm(prev => prev.major.includes(m) ? { ...prev, major: prev.major.filter(x => x !== m) } : prev.major.length >= 2 ? (alert("Max 2 majors"), prev) : { ...prev, major: [...prev.major, m] });
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
        setForm({...form, avatar_url: canvas.toDataURL('image/jpeg', 0.9)});
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const client = generateClient();
      const studentID = userEmail.split('@')[0];
      const input = { id: userId, email: userEmail, full_name: form.full_name, major: form.major, year: parseInt(form.year), intake: form.intake, avatar_url: form.avatar_url, member_id: studentID };
      const res = profile ? await client.graphql({ query: updateUser, variables: { input } }) : await client.graphql({ query: createUser, variables: { input: {...input, xp: 0, tier: "EXPLORER"} } });
      setProfile(profile ? res.data.updateUser : res.data.createUser);
      setIsEditing(false);
    } catch (err) { alert("Save failed: " + err.message); }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("🚨 PERMANENTLY DELETE ACCOUNT?")) return;
    setLoading(true);
    try {
      const client = generateClient();
      if (profile) await client.graphql({ query: deleteDBUser, variables: { input: { id: profile.id } } });
      await deleteCognitoUser();
      await signOut();
      window.location.reload();
    } catch (err) { alert("Delete failed."); setLoading(false); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontWeight: '900', color: 'black' }}>SYNCING_IDENTITY_SYSTEM...</div>;

  if (isEditing) {
    return (
      <div style={{ backgroundColor: 'white', padding: '30px', color: 'black' }}>
        <h3 style={{ marginTop: 0, fontWeight: '900', borderBottom: '4px solid black', paddingBottom: '10px' }}>[ EDIT_IDENTITY_TERMINAL ]</h3>
        <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginTop: '20px' }}>
          <div><label style={editLabel}>FULL_NAME</label><input required value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} style={editInput} /></div>
          <div>
            <label style={editLabel}>MAJORS_ARRAY (MAX 2)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {AVAILABLE_MAJORS.map(m => (<div key={m} onClick={() => toggleMajor(m)} style={{ ...pillStyle, backgroundColor: form.major.includes(m) ? '#FF9900' : '#eee' }}>{m}</div>))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{flex: '1 1 100px'}}><label style={editLabel}>YEAR_LVL</label><select value={form.year} onChange={e => setForm({...form, year: e.target.value})} style={editInput}><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option></select></div>
            <div style={{flex: '1 1 100px'}}><label style={editLabel}>INTAKE_ID</label><input required value={form.intake} onChange={e => setForm({...form, intake: e.target.value})} style={editInput} /></div>
          </div>
          <div style={{ border: '3px solid black', padding: '15px', backgroundColor: '#f9f9f9' }}>
            <label style={editLabel}>SELECT_AVATAR_UNIT</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '15px' }}>
              {AVATAR_PRESETS.map(url => ( 
                <img key={url} src={url} onClick={() => setForm({...form, avatar_url: url})} 
                style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', border: form.avatar_url === url ? '4px solid #FF9900' : '2px solid black', cursor: 'pointer', backgroundColor: 'white' }} /> 
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
          <div style={{ display: 'flex', gap: '15px' }}>
            <button type="submit" style={{ ...protoBtn, backgroundColor: '#FF9900', flex: 2 }}>SAVE_IDENTITY</button>
            <button type="button" onClick={() => setIsEditing(false)} style={{ ...protoBtn, backgroundColor: 'white', flex: 1 }}>CANCEL</button>
          </div>
        </form>
      </div>
    );
  }

  // --- DYNAMIC LEVEL & TIER CALCULATOR ---
  const currentTotalXp = profile?.xp || 0;
  const currentLevel = Math.floor(currentTotalXp / 1000) + 1;
  const xpTowardsNextLevel = currentTotalXp % 1000;
  
  let currentTier = "EXPLORER";
  if (currentLevel >= 21) currentTier = "BUILDER";
  if (currentLevel >= 41) currentTier = "ARCHITECT";
  if (currentLevel >= 81) currentTier = "PIONEER";

  return (
    <div style={{ backgroundColor: '#fafafa', position: 'relative', color: 'black', border: '10px solid white' }}>
      
      {/* OFFICIAL WATERMARK HEADER */}
      <div style={{ backgroundColor: 'black', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '4px solid #FF9900' }}>
        <h2 style={{ color: 'white', margin: 0, fontSize: '18px', fontWeight: '900', letterSpacing: '3px', textTransform: 'uppercase' }}>OFFICIAL_BUILDER_ID</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setIsEditing(true)} style={miniBtnStyle}>EDIT</button>
          <button onClick={handleDeleteAccount} style={{ ...miniBtnStyle, backgroundColor: '#ff4d4d', color: 'white' }}>DEL</button>
        </div>
      </div>
      
      <div style={{ padding: '25px' }}>
        {/* PREMIUM ID HEADER WITH BARCODE EDGE */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ border: '4px solid black', padding: '6px', backgroundColor: 'white', boxShadow: '6px 6px 0px #ccc', position: 'relative', minWidth: '100px' }}>
            <img src={profile?.avatar_url} style={{ width: '120px', height: '120px', display: 'block', backgroundColor: 'white', objectFit: 'cover' }} alt="Avatar" />
            <div style={screwStyle({top: '4px', left: '4px'})}></div><div style={screwStyle({top: '4px', right: '4px'})}></div><div style={screwStyle({bottom: '4px', left: '4px'})}></div><div style={screwStyle({bottom: '4px', right: '4px'})}></div>
          </div>
          
          <div style={{ flex: 1, textAlign: 'left', minWidth: '200px' }}>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: '900', color: 'black', textTransform: 'uppercase', lineHeight: '1', letterSpacing: '-1px' }}>{profile?.full_name}</h1>
            
            {/* BADGE WITH ICON */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: 'black', color: 'white', padding: '6px 14px', fontWeight: '900', fontSize: '14px', border: '2px solid #FF9900' }}>
              <img src={TIER_ICONS[currentTier]} alt={currentTier} style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
              {currentTier} • LVL {currentLevel}
            </div>
          </div>
        </div>

        {/* BRUTALIST STRUCTURED DATA BLOCKS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          <div style={dataBoxStyle}><label style={dataLabelStyle}>STUDENT_ID</label><div style={dataValStyle}>{profile?.member_id}</div></div>
          <div style={dataBoxStyle}><label style={dataLabelStyle}>MAJORS_SPEC</label><div style={dataValStyle}>{profile?.major?.join(' + ')}</div></div>
          <div style={dataBoxStyle}><label style={dataLabelStyle}>ACADEMIC_COHORT</label><div style={dataValStyle}>YR {profile?.year} • {profile?.intake}</div></div>
          <div style={dataBoxStyle}><label style={dataLabelStyle}>SYS_JOIN_DATE</label><div style={dataValStyle}>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '04/27/2026'}</div></div>
        </div>

        {/* THICK DYNAMIC XP BAR */}
        <div style={{ border: '4px solid black', padding: '15px', backgroundColor: 'white', boxShadow: '4px 4px 0px #ccc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: '900', fontSize: '12px', flexWrap: 'wrap' }}>
            <span style={{ color: '#6B38FB' }}>&gt; XP_STRENGTH (LVL {currentLevel})</span>
            <span>{xpTowardsNextLevel} / 1000 PT</span>
          </div>
          <div style={{ width: '100%', height: '24px', border: '3px solid black', backgroundColor: '#eee', overflow: 'hidden' }}>
            <div style={{ width: `${(xpTowardsNextLevel / 1000) * 100}%`, height: '100%', backgroundColor: '#FF9900', backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)', backgroundSize: '15px 15px' }}></div>
          </div>
        </div>
        
        {/* CSS GENERATED BARCODE */}
        <div style={{ marginTop: '30px', width: '100%', height: '40px', backgroundImage: 'repeating-linear-gradient(90deg, black, black 2px, transparent 2px, transparent 4px, black 4px, black 5px, transparent 5px, transparent 8px, black 8px, black 12px, transparent 12px, transparent 15px)', opacity: 0.8 }}></div>
        <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: '900', letterSpacing: '10px', marginTop: '5px' }}>{profile?.id?.split('-')[0].toUpperCase()}</div>
      </div>
    </div>
  );
}

// STYLES
const screwStyle = (pos) => ({ position: 'absolute', ...pos, width: '4px', height: '4px', background: 'black', borderRadius: '50%' });
const dataBoxStyle = { border: '3px solid black', padding: '15px', backgroundColor: 'white' };
const dataLabelStyle = { fontSize: '10px', fontWeight: '900', color: '#888', display: 'block', marginBottom: '8px', borderBottom: '2px solid #eee', paddingBottom: '4px' };
const dataValStyle = { fontSize: '14px', fontWeight: '900', color: 'black' };
const miniBtnStyle = { border: '2px solid white', backgroundColor: 'transparent', color: 'white', padding: '4px 12px', fontSize: '12px', fontWeight: '900', cursor: 'pointer' };
const editLabel = { display: 'block', fontSize: '12px', fontWeight: '900', color: 'black', marginBottom: '8px' };
const editInput = { width: '100%', padding: '14px', border: '3px solid black', color: 'black', fontWeight: '900', outline: 'none', backgroundColor: 'white' };
const pillStyle = { padding: '8px 16px', border: '3px solid black', fontSize: '12px', fontWeight: '900', cursor: 'pointer', color: 'black' };
const protoBtn = { padding: '16px', border: '4px solid black', fontWeight: '900', cursor: 'pointer', boxShadow: '6px 6px 0px black', color: 'black' };
const uploadBtnStyle = { cursor: 'pointer', border: '3px solid black', backgroundColor: '#eee', color: 'black', padding: '10px 20px', fontWeight: '900', fontSize: '12px', boxShadow: '4px 4px 0px black', display: 'inline-block' };