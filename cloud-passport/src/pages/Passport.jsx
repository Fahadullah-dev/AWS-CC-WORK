import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser, deleteUser as deleteCognitoUser, signOut } from 'aws-amplify/auth';
import { getUser, listAttendances } from '../graphql/queries';
import { createUser, updateUser, deleteUser as deleteDBUser } from '../graphql/mutations';

const AVAILABLE_MAJORS = ['AI', 'CS', 'Cyber', 'BIS', 'Game Dev'];
const AVATAR_PRESETS = [
  "/avatars/pfp1.jpg", "/avatars/pfp2.jpg", "/avatars/pfp3.jpg", "/avatars/pfp4.jpg", "/avatars/pfp5.jpg",
  "/avatars/pfp6.jpg", "/avatars/pfp7.jpg", "/avatars/pfp8.jpg", "/avatars/pfp9.jpg", "/avatars/pfp10.jpg"
];

export default function Passport() {
  const client = generateClient();
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
      setUserId(userId);
      setUserEmail(signInDetails?.loginId);
      
      // PARALLEL FETCHING: Hits DB once for user profile and once for attendance at the same time
      const [userRes, attendanceRes] = await Promise.all([
        client.graphql({ query: getUser, variables: { id: userId } }),
        client.graphql({ query: listAttendances, variables: { filter: { userID: { eq: userId } } } })
      ]);
      
      if (userRes.data.getUser) {
        setProfile(userRes.data.getUser);
        setForm(userRes.data.getUser);
      } else { 
        setIsEditing(true); 
      }
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
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
      const studentID = userEmail.split('@')[0];
      const input = { id: userId, email: userEmail, full_name: form.full_name, major: form.major, year: parseInt(form.year), intake: form.intake, avatar_url: form.avatar_url, member_id: studentID };
      const res = profile ? await client.graphql({ query: updateUser, variables: { input } }) : await client.graphql({ query: createUser, variables: { input: {...input, xp: 0, tier: "Beginner"} } });
      setProfile(profile ? res.data.updateUser : res.data.createUser);
      setIsEditing(false);
    } catch (err) { alert("Save failed: " + err.message); }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("🚨 PERMANENTLY DELETE ACCOUNT?")) return;
    setLoading(true);
    try {
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
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{flex: 1}}><label style={editLabel}>YEAR_LVL</label><select value={form.year} onChange={e => setForm({...form, year: e.target.value})} style={editInput}><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option></select></div>
            <div style={{flex: 1}}><label style={editLabel}>INTAKE_ID</label><input required value={form.intake} onChange={e => setForm({...form, intake: e.target.value})} style={editInput} /></div>
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

  return (
    <div style={{ backgroundColor: 'white', position: 'relative', color: 'black' }}>
      <div style={{ backgroundColor: '#6B38FB', padding: '20px 30px', borderBottom: '4px solid black', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'white', margin: 0, fontSize: '22px', fontWeight: '900', letterSpacing: '2px' }}>BUILDER_E-PASSPORT</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setIsEditing(true)} style={miniBtnStyle}>EDIT</button>
          <button onClick={handleDeleteAccount} style={{ ...miniBtnStyle, backgroundColor: '#ff4d4d', color: 'white' }}>DEL</button>
        </div>
      </div>
      <div style={{ padding: '35px' }}>
        <div style={{ display: 'flex', gap: '30px', marginBottom: '40px', alignItems: 'center' }}>
          <div style={{ border: '4px solid black', padding: '6px', backgroundColor: '#FF9900', boxShadow: '6px 6px 0px black', position: 'relative' }}>
            <img src={profile?.avatar_url} style={{ width: '120px', height: '120px', display: 'block', backgroundColor: 'white', objectFit: 'cover' }} alt="Avatar" />
            <div style={screwStyle({top: '2px', left: '2px'})}></div><div style={screwStyle({top: '2px', right: '2px'})}></div><div style={screwStyle({bottom: '2px', left: '2px'})}></div><div style={screwStyle({bottom: '2px', right: '2px'})}></div>
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '36px', fontWeight: '900', color: 'black', textTransform: 'uppercase', lineHeight: '1' }}>{profile?.full_name}</h1>
            <div style={{ display: 'inline-block', backgroundColor: 'black', color: '#FF9900', padding: '5px 12px', fontWeight: '900', fontSize: '14px', boxShadow: '4px 4px 0px rgba(0,0,0,0.2)', transform: 'rotate(-1deg)' }}>{profile?.tier?.toUpperCase()} BUILDER</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
          <div style={dataBoxStyle}><label style={dataLabelStyle}>STUDENT_ID</label><div style={dataValStyle}>{profile?.member_id}</div></div>
          <div style={dataBoxStyle}><label style={dataLabelStyle}>MAJORS_SPEC</label><div style={dataValStyle}>{profile?.major?.join(' + ')}</div></div>
          <div style={dataBoxStyle}><label style={dataLabelStyle}>CURRENT_STATUS</label><div style={dataValStyle}>YEAR {profile?.year} • {profile?.intake}</div></div>
          <div style={dataBoxStyle}><label style={dataLabelStyle}>SYSTEM_JOIN_DATE</label><div style={dataValStyle}>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '04/27/2026'}</div></div>
        </div>
        <div style={{ border: '4px solid black', padding: '20px', backgroundColor: '#f0f0f0', boxShadow: '6px 6px 0px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: '900', fontSize: '13px' }}><span>&gt; CLOUD_XP_STRENGTH</span><span>{profile?.xp || 0} / 1000 PT</span></div>
          <div style={{ width: '100%', height: '24px', border: '4px solid black', backgroundColor: 'white', overflow: 'hidden' }}><div style={{ width: `${(profile?.xp / 1000) * 100}%`, height: '100%', backgroundColor: '#FF9900', backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)', backgroundSize: '20px 20px' }}></div></div>
        </div>
      </div>
      <div style={{ textAlign: 'center', paddingBottom: '20px', fontSize: '11px', fontWeight: '900', color: '#aaa', letterSpacing: '2px' }}>PROPERTY_OF_AWS_STUDENT_BUILDER_GROUP_DXB</div>
    </div>
  );
}

// STYLES
const screwStyle = (pos) => ({ position: 'absolute', ...pos, width: '4px', height: '4px', background: 'black', borderRadius: '50%' });
const dataBoxStyle = { border: '4px solid black', padding: '15px', backgroundColor: 'white', boxShadow: '6px 6px 0px black' };
const dataLabelStyle = { fontSize: '10px', fontWeight: '900', color: '#888', display: 'block', marginBottom: '6px' };
const dataValStyle = { fontSize: '16px', fontWeight: '900', color: 'black' };
const miniBtnStyle = { border: '3px solid black', backgroundColor: 'white', color: 'black', padding: '4px 12px', fontSize: '12px', fontWeight: '900', cursor: 'pointer', boxShadow: '3px 3px 0px black' };
const editLabel = { display: 'block', fontSize: '12px', fontWeight: '900', color: 'black', marginBottom: '8px' };
const editInput = { width: '100%', padding: '14px', border: '3px solid black', color: 'black', fontWeight: '900', outline: 'none', backgroundColor: 'white' };
const pillStyle = { padding: '8px 16px', border: '3px solid black', fontSize: '12px', fontWeight: '900', cursor: 'pointer', color: 'black' };
const protoBtn = { padding: '16px', border: '4px solid black', fontWeight: '900', cursor: 'pointer', boxShadow: '6px 6px 0px black', color: 'black' };
const uploadBtnStyle = { cursor: 'pointer', border: '3px solid black', backgroundColor: '#eee', color: 'black', padding: '10px 20px', fontWeight: '900', fontSize: '12px', boxShadow: '4px 4px 0px black', display: 'inline-block' };