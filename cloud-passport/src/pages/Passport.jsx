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

const TIER_ICONS = {
  EXPLORER: '/icons/explorer.svg',
  BUILDER: '/icons/builder.svg',
  ARCHITECT: '/icons/architect.svg',
  MASTER: '/icons/master.svg'
};

export default function Passport({ onTerminated }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState(null);
  const [form, setForm] = useState({ full_name: '', major: [], year: 1, intake: '', avatar_url: '' });
  
  const [isTerminated, setIsTerminated] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState(null);

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
        let userData = userRes.data.getUser;
        
        if (userData.major) {
          userData.major = userData.major.map(m => {
            if (m === 'Computer Science') return 'CS';
            if (m === 'Cybersecurity') return 'Cyber';
            if (m === 'Business Information Systems') return 'BIS';
            return m;
          });
        }

        setProfile(userData);
        setForm(userData);
      } else { 
        setIsTerminated(true);
        if (onTerminated) onTerminated();
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  const toggleMajor = (m) => {
    setForm(prev => {
      const currentMajors = prev.major || [];
      const isSelected = currentMajors.includes(m);
      if (isSelected) {
        if (currentMajors.length <= 1) {
          setErrorPopup("AT LEAST 1 MAJOR IS REQUIRED.");
          return prev;
        }
        return { ...prev, major: currentMajors.filter(x => x !== m) };
      }
      if (currentMajors.length >= 2) { 
        setErrorPopup("MAXIMUM 2 MAJORS ALLOWED PER PASSPORT."); 
        return prev; 
      }
      return { ...prev, major: [...currentMajors, m] };
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
    } catch (err) { setErrorPopup("SAVE FAILED: " + err.message); }
    setLoading(false);
  };

  const executeDelete = async () => {
    setShowDeletePopup(false);
    setLoading(true);
    try {
      const client = generateClient();
      if (profile) await client.graphql({ query: deleteDBUser, variables: { input: { id: profile.id } } });
      await deleteCognitoUser();
      await signOut();
      window.location.reload();
    } catch (err) { 
      setErrorPopup("Delete failed. " + err.message); 
      setLoading(false); 
    }
  };

  const getIntakeParts = (intakeStr) => {
    if (!intakeStr) return ['Jan', '2026'];
    const parts = intakeStr.split(' ');
    return [parts[0] || 'Jan', parts[1] || '2026'];
  };

  const [iMonth, iYear] = getIntakeParts(form.intake);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontWeight: '900', color: 'black' }}>SYNCING IDENTITY SYSTEM...</div>;

  if (isTerminated) {
    return (
      <div style={{ backgroundColor: '#1a1c21', padding: '40px 20px', color: 'white', textAlign: 'center', border: '4px solid #ff57f6', boxSizing: 'border-box' }}>
        <h2 style={{ color: '#ff57f6', fontWeight: '900', fontSize: '22px', letterSpacing: '1px', textTransform: 'uppercase' }}>[ ACCESS REVOKED ]</h2>
        <p style={{ fontWeight: 'bold', lineHeight: '1.6', margin: '20px 0', fontSize: '14px' }}>
          Your builder identity has been permanently deleting from the AWS Student Builder Group registry. 
        </p>
        <p style={{ fontWeight: 'bold', lineHeight: '1.6', margin: '20px 0', fontSize: '14px' }}>
          Please send an email to <br/>
          <a href="mailto:34675845@student.murdoch.edu.au" style={{ color: '#00e87f', textDecoration: 'underline', wordBreak: 'break-all' }}>34675845@student.murdoch.edu.au</a>
        </p>
        <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '30px' }}>ERROR CODE: GHOST RECORD DETECTED</p>
        <button onClick={async () => { await signOut(); window.location.reload(); }} style={{ padding: '15px 20px', backgroundColor: '#ff57f6', color: 'white', fontWeight: '900', border: 'none', cursor: 'pointer', width: '100%' }}>
          SEVER CONNECTION
        </button>
      </div>
    );
  }

  // --- NEW LEVEL LOGIC: 1 Level = 200 XP ---
  const currentTotalXp = profile?.xp || 0;
  const currentLevel = Math.floor(currentTotalXp / 200) + 1;
  const xpTowardsNextLevel = currentTotalXp % 200;
  
  let currentTier = "EXPLORER";
  if (currentLevel >= 6) currentTier = "BUILDER";
  if (currentLevel >= 13) currentTier = "ARCHITECT";
  if (currentLevel >= 20) currentTier = "MASTER";

  return (
    <div style={{ backgroundColor: '#fafafa', position: 'relative', color: 'black', border: '8px solid white', boxSizing: 'border-box' }}>
      
      {errorPopup && (
        <div style={overlayStyle} onClick={() => setErrorPopup(null)}>
          <div style={{...popupCardStyle, boxShadow: '12px 12px 0px #ef4444'}} onClick={e => e.stopPropagation()}>
            <div style={{ ...popupHeaderStyle, backgroundColor: '#ef4444' }}>
              [ SYSTEM ERROR ]
            </div>
            <div style={popupBodyStyle}>{errorPopup}</div>
            <button onClick={() => setErrorPopup(null)} style={{...popupBtnStyle, backgroundColor: 'black', color: 'white', width: '100%'}}>ACKNOWLEDGE</button>
          </div>
        </div>
      )}

      {showDeletePopup && (
        <div style={overlayStyle} onClick={() => setShowDeletePopup(false)}>
          <div style={popupCardStyle} onClick={e => e.stopPropagation()}>
            <div style={{ ...popupHeaderStyle, backgroundColor: '#ef4444' }}>
              [ SYSTEM WARNING ]
            </div>
            <div style={popupBodyStyle}>
              <h3 style={{ margin: '0 0 10px 0', color: '#ef4444', fontSize: '18px', fontWeight: '900' }}>CRITICAL ACTION</h3>
              <p style={{ margin: 0 }}>You are about to permanently delete your builder identity. <strong>All XP, stamps, and networking data will be lost forever.</strong></p>
            </div>
            <div style={{ display: 'flex' }}>
              <button onClick={executeDelete} style={{ ...popupBtnStyle, backgroundColor: '#fff', color: 'black', borderRight: '4px solid black' }}>DELETE ACCOUNT</button>
              <button onClick={() => setShowDeletePopup(false)} style={{ ...popupBtnStyle, backgroundColor: '#ef4444', color: 'white' }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {isEditing ? (
         <div style={{ padding: '25px', boxSizing: 'border-box' }}>
         <h3 style={{ marginTop: 0, fontWeight: '900', fontSize: '18px', borderBottom: '4px solid black', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
           <img src="/icons/logo.svg" alt="Cloud" style={{ height: '24px', objectFit: 'contain' }} />
           [ EDIT IDENTITY ]
         </h3>
         <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
           <div><label style={editLabel}>FULL NAME</label><input required value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} style={editInput} /></div>
           <div>
             <label style={editLabel}>MAJORS (MAX 2)</label>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
               {AVAILABLE_MAJORS.map(m => {
                 const isSelected = (form.major || []).includes(m);
                 return (
                   <div key={m} onClick={() => toggleMajor(m)} style={{ ...pillStyle, backgroundColor: isSelected ? '#ff9900' : '#eee', border: isSelected ? '3px solid black' : '3px solid transparent' }}>
                     {m}
                   </div>
                 );
               })}
             </div>
           </div>
           <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
             <div style={{flex: '1 1 100px'}}><label style={editLabel}>YEAR LEVEL</label><select value={form.year} onChange={e => setForm({...form, year: e.target.value})} style={editInput}><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option></select></div>
             
             <div style={{flex: '1 1 150px'}}>
               <label style={editLabel}>FIRST INTAKE</label>
               <div style={{ display: 'flex', gap: '5px' }}>
                 <select value={iMonth} onChange={e => setForm({...form, intake: `${e.target.value} ${iYear}`})} style={editInput}>
                   <option value="Jan">Jan</option><option value="May">May</option><option value="Sep">Sep</option>
                 </select>
                 <select value={iYear} onChange={e => setForm({...form, intake: `${iMonth} ${e.target.value}`})} style={editInput}>
                   {Array.from({length: 11}, (_, i) => 2020 + i).map(y => <option key={y} value={y}>{y}</option>)}
                 </select>
               </div>
             </div>

           </div>
           <div style={{ border: '3px solid black', padding: '15px', backgroundColor: '#f9f9f9' }}>
             <label style={editLabel}>SELECT AVATAR</label>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '15px' }}>
               {AVATAR_PRESETS.map(url => ( 
                 <img key={url} src={url} onClick={() => setForm({...form, avatar_url: url})} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', border: form.avatar_url === url ? '4px solid #3ea1f3' : '2px solid black', cursor: 'pointer', backgroundColor: 'white' }} /> 
               ))}
             </div>
             <div style={{ textAlign: 'center' }}>
                 <label style={uploadBtnStyle}>
                   <img src="/icons/upload.png" style={{ width: '30px', marginRight: '5px', verticalAlign: 'middle' }} alt="upload" />
                   UPLOAD CUSTOM ASSET
                   <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                 </label>
             </div>
           </div>
           <div style={{ display: 'flex', gap: '10px' }}>
             <button type="submit" style={{ ...protoBtn, backgroundColor: '#3ea1f3', color: 'white', flex: 2 }}>SAVE IDENTITY</button>
             <button type="button" onClick={() => setIsEditing(false)} style={{ ...protoBtn, backgroundColor: 'white', flex: 1 }}>CANCEL</button>
           </div>
         </form>
       </div>
      ) : (
        <>
          <div style={{ backgroundColor: '#1a1c21', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '4px solid #ff9900' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/icons/logo.svg" style={{ height: '20px', objectFit: 'contain' }} alt="Logo" />
              <h2 style={{ color: 'white', margin: 0, fontSize: '14px', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>OFFICIAL BUILDER ID</h2>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setIsEditing(true)} style={{...miniBtnStyle, backgroundColor: '#3ea1f3', border: '2px solid white'}}>EDIT PROFILE</button>
              <button onClick={() => setShowDeletePopup(true)} style={{ ...miniBtnStyle, backgroundColor: '#ef4444', border: '2px solid white' }}>DELETE IDENTITY</button>
            </div>
          </div>
          
          <div style={{ padding: '20px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ border: '4px solid black', padding: '6px', backgroundColor: 'white', boxShadow: '4px 4px 0px #3ea1f3', position: 'relative', minWidth: '100px' }}>
                <img src={profile?.avatar_url} style={{ width: '100px', height: '100px', display: 'block', backgroundColor: 'white', objectFit: 'cover' }} alt="Avatar" />
                <div style={screwStyle({top: '4px', left: '4px'})}></div><div style={screwStyle({top: '4px', right: '4px'})}></div><div style={screwStyle({bottom: '4px', left: '4px'})}></div><div style={screwStyle({bottom: '4px', right: '4px'})}></div>
              </div>
              
              <div style={{ flex: 1, textAlign: 'left', minWidth: '150px' }}>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '26px', fontWeight: '900', color: 'black', textTransform: 'uppercase', lineHeight: '1', wordWrap: 'break-word' }}>{profile?.full_name}</h1>
                
                <div style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', backgroundColor: 'black', color: 'white', padding: '6px 12px', fontWeight: '900', fontSize: '12px', border: '2px solid #00e87f' }}>
                  <img src={TIER_ICONS[currentTier]} alt={currentTier} style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                  <span style={{ color: '#00e87f' }}>{currentTier}</span>
                  <span style={{ color: 'white' }}>• LVL {currentLevel}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '25px' }}>
              <div style={dataBoxStyle}><label style={dataLabelStyle}>STUDENT ID</label><div style={dataValStyle}>{profile?.member_id}</div></div>
              <div style={dataBoxStyle}><label style={dataLabelStyle}>MAJORS</label><div style={dataValStyle}>{profile?.major?.join(' + ')}</div></div>
              <div style={dataBoxStyle}><label style={dataLabelStyle}>ACADEMIC COHORT</label><div style={dataValStyle}>YR {profile?.year} • {profile?.intake}</div></div>
              <div style={dataBoxStyle}><label style={dataLabelStyle}>JOIN DATE</label><div style={dataValStyle}>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '04/27/2026'}</div></div>
            </div>

            <div style={{ border: '3px solid black', padding: '15px', backgroundColor: 'white', boxShadow: '4px 4px 0px #ccc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: '900', fontSize: '11px', flexWrap: 'wrap' }}>
                <span style={{ color: '#9b68f6' }}>&gt; XP STRENGTH (LVL {currentLevel})</span>
                <span>{xpTowardsNextLevel} / 200 PT</span>
              </div>
              <div style={{ width: '100%', height: '20px', border: '3px solid black', backgroundColor: '#eee', overflow: 'hidden' }}>
                <div style={{ width: `${(xpTowardsNextLevel / 200) * 100}%`, height: '100%', backgroundColor: '#ff9900', backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)', backgroundSize: '15px 15px' }}></div>
              </div>
            </div>
            
            <div style={{ marginTop: '25px', width: '100%', height: '30px', backgroundImage: 'repeating-linear-gradient(90deg, black, black 2px, transparent 2px, transparent 4px, black 4px, black 5px, transparent 5px, transparent 8px, black 8px, black 12px, transparent 12px, transparent 15px)', opacity: 0.8 }}></div>
            <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: '900', letterSpacing: '8px', marginTop: '5px', wordWrap: 'break-word' }}>{profile?.id?.split('-')[0].toUpperCase()}</div>
            <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '9px', fontWeight: '900', color: '#888', letterSpacing: '1px' }}>PROPERTY OF AWS STUDENT BUILDER GROUP</div>
          </div>
        </>
      )}
    </div>
  );
}

const screwStyle = (pos) => ({ position: 'absolute', ...pos, width: '4px', height: '4px', background: 'black', borderRadius: '50%' });

const dataBoxStyle = { border: '3px solid black', padding: '12px', backgroundColor: 'white', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' };
const dataLabelStyle = { fontSize: '9px', fontWeight: '900', color: '#888', display: 'block', marginBottom: '6px', borderBottom: '2px solid #eee', paddingBottom: '4px' };
const dataValStyle = { fontSize: '12px', fontWeight: '900', color: 'black', wordWrap: 'break-word' };

const miniBtnStyle = { backgroundColor: 'transparent', color: 'white', padding: '6px 10px', fontSize: '10px', fontWeight: '900', cursor: 'pointer' };
const editLabel = { display: 'block', fontSize: '11px', fontWeight: '900', color: 'black', marginBottom: '8px' };
const editInput = { width: '100%', padding: '12px', border: '3px solid black', color: 'black', fontWeight: '900', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' };
const pillStyle = { padding: '8px 14px', border: '3px solid black', fontSize: '11px', fontWeight: '900', cursor: 'pointer', color: 'black' };
const protoBtn = { padding: '14px', border: '4px solid black', fontWeight: '900', cursor: 'pointer', boxShadow: '4px 4px 0px black', color: 'black', width: '100%' };
const uploadBtnStyle = { cursor: 'pointer', border: '3px solid black', backgroundColor: '#eee', color: 'black', padding: '10px 15px', fontWeight: '900', fontSize: '11px', boxShadow: '4px 4px 0px black', display: 'inline-block' };

const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' };
const popupCardStyle = { backgroundColor: 'white', border: '4px solid black', boxShadow: '12px 12px 0px #ef4444', width: '100%', maxWidth: '400px', textAlign: 'center', overflow: 'hidden' };
const popupHeaderStyle = { color: 'white', padding: '15px', borderBottom: '4px solid black', fontWeight: '900', fontSize: '16px', letterSpacing: '2px' };

const popupBodyStyle = { padding: '20px', fontWeight: 'bold', fontSize: '13px', color: 'black', lineHeight: '1.5' }; 
const popupBtnStyle = { flex: 1, padding: '15px', fontWeight: '900', border: 'none', borderTop: '4px solid black', cursor: 'pointer', fontSize: '14px', letterSpacing: '1px' };