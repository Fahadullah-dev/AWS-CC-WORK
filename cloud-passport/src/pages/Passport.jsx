import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { getUser, listAttendances } from '../graphql/queries';
import { createUser, updateUser } from '../graphql/mutations';

const client = generateClient();

const AVAILABLE_MAJORS = ['AI', 'Computer Science', 'Cybersecurity', 'BIS'];
const AVATAR_PRESETS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ffdfbf",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Molly&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver&backgroundColor=d1d4f9",
];

export default function Passport() {
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  const [form, setForm] = useState({
    full_name: '', major: [], year: 1, intake: 'Jan 2026', avatar_url: AVATAR_PRESETS[0]
  });

  useEffect(() => {
    fetchOrInitializeProfile();
  }, []);

  async function fetchOrInitializeProfile() {
    try {
      const { userId, signInDetails } = await getCurrentUser();
      setUserId(userId);
      setUserEmail(signInDetails?.loginId);

      let fetchedProfile = null;
      try {
        const userRes = await client.graphql({ query: getUser, variables: { id: userId } });
        fetchedProfile = userRes.data.getUser;
      } catch (e) {
        console.warn("User not found in DB yet, triggering onboarding...");
      }

      // THE FIX: If no profile is found, FORCE the edit screen to open
      if (fetchedProfile) {
        setProfile(fetchedProfile);
        
        // Safely map values to the edit form in case they want to edit later
        setForm({
          full_name: fetchedProfile.full_name || '',
          major: fetchedProfile.major || [],
          year: fetchedProfile.year || 1,
          intake: fetchedProfile.intake || 'Jan 2026',
          avatar_url: fetchedProfile.avatar_url || AVATAR_PRESETS[0]
        });

        fetchAttendance(userId);
      } else {
        setIsEditing(true); 
      }
    } catch (err) {
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAttendance(uid) {
    try {
      const attRes = await client.graphql({ query: listAttendances, variables: { filter: { userID: { eq: uid } } } });
      setAttendance(attRes.data.listAttendances.items);
    } catch (e) {
      console.error("Could not fetch attendance");
    }
  }

  const toggleMajor = (major) => {
    setForm(prev => {
      const newMajors = prev.major.includes(major) 
        ? prev.major.filter(m => m !== major) 
        : [...prev.major, major];
      return { ...prev, major: newMajors };
    });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!profile) {
        const newProfileData = {
          id: userId,
          email: userEmail,
          full_name: form.full_name,
          major: form.major,
          year: parseInt(form.year),
          intake: form.intake,
          member_id: `AWS-${Math.floor(1000 + Math.random() * 9000)}`,
          xp: 0,
          tier: "Beginner",
          avatar_url: form.avatar_url
        };
        const res = await client.graphql({ query: createUser, variables: { input: newProfileData } });
        setProfile(res.data.createUser);
      } else {
        const updateData = {
          id: profile.id,
          full_name: form.full_name,
          major: form.major,
          year: parseInt(form.year),
          intake: form.intake,
          avatar_url: form.avatar_url
        };
        const res = await client.graphql({ query: updateUser, variables: { input: updateData } });
        setProfile(res.data.updateUser);
      }
      setIsEditing(false);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Error saving profile. Check console for details.");
    }
    setLoading(false);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Syncing Data...</div>;

  // ==========================================
  // EDIT / ONBOARDING VIEW
  // ==========================================
  if (isEditing) {
    return (
      <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', color: '#0f172a' }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>{profile ? 'Edit Passport' : 'Complete Your Profile'}</h2>
        <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={labelStyle}>Full Name</label>
            <input required type="text" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Majors (Select all that apply)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {AVAILABLE_MAJORS.map(m => (
                <div 
                  key={m} onClick={() => toggleMajor(m)}
                  style={{ ...pillStyle, background: form.major.includes(m) ? '#FF9900' : '#e2e8f0', color: form.major.includes(m) ? 'white' : 'black' }}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Year</label>
              <select value={form.year} onChange={e => setForm({...form, year: e.target.value})} style={inputStyle}>
                <option value={1}>Year 1</option><option value={2}>Year 2</option>
                <option value={3}>Year 3</option><option value={4}>Year 4</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Intake Trimester</label>
              <input required type="text" placeholder="e.g. Jan 2026" value={form.intake} onChange={e => setForm({...form, intake: e.target.value})} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Choose an Avatar</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              {AVATAR_PRESETS.map(url => (
                <img 
                  key={url} src={url} onClick={() => setForm({...form, avatar_url: url})} 
                  style={{ width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', border: form.avatar_url === url ? '3px solid #FF9900' : '2px solid transparent' }} 
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" style={{ flex: 2, background: '#FF9900', color: '#111', padding: '12px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              Save Profile
            </button>
            {profile && (
              <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, background: '#e2e8f0', color: '#0f172a', padding: '12px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  // ==========================================
  // NORMAL PASSPORT VIEW
  // ==========================================
  return (
    <div style={{ padding: '0px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', background: 'white', borderRadius: '12px' }}>
        
        {/* Main ID Card */}
        <div style={{ background: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <img src={profile?.avatar_url} style={{ width: '70px', height: '70px', borderRadius: '50%', border: '3px solid #FF9900' }} alt="Avatar" />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>{profile?.full_name}</h3>
            <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
              <span style={{ background: '#000', color: '#FF9900', fontSize: '11px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '12px' }}>
                {profile?.tier} Tier
              </span>
              <button onClick={() => setIsEditing(true)} style={{ background: '#e2e8f0', border: 'none', borderRadius: '12px', padding: '3px 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                ✏️ Edit
              </button>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <div style={dataBoxStyle}>
            <span style={dataLabelStyle}>MEMBER ID</span>
            <span style={dataValStyle}>{profile?.member_id}</span>
          </div>
          <div style={dataBoxStyle}>
            <span style={dataLabelStyle}>UNIVERSITY EMAIL</span>
            <span style={{...dataValStyle, fontSize: '11px', wordBreak: 'break-all'}}>{profile?.email}</span>
          </div>
          <div style={dataBoxStyle}>
            <span style={dataLabelStyle}>MAJORS</span>
            <span style={dataValStyle}>{profile?.major?.join(', ') || 'N/A'}</span>
          </div>
          <div style={dataBoxStyle}>
            <span style={dataLabelStyle}>STATUS</span>
            <span style={dataValStyle}>Year {profile?.year} • Since {profile?.intake}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Cloud Experience (XP)</span>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#FF9900' }}>{profile?.xp || 0} / 1000</span>
           </div>
           <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${(profile?.xp / 1000) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #FF9900, #ffb84d)', borderRadius: '10px' }}></div>
           </div>
        </div>

      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '5px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' };
const pillStyle = { padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' };
const dataBoxStyle = { background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' };
const dataLabelStyle = { fontSize: '10px', color: '#64748b', fontWeight: '900', display: 'block', marginBottom: '4px' };
const dataValStyle = { fontSize: '13px', fontWeight: 'bold', color: '#0f172a' };