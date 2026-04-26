// src/pages/Passport.jsx
import { useState, useEffect, useRef } from 'react';
import { getProfile, getUserAttendance, getTierProgress, updateProfile, uploadAvatar } from '../lib/supabase';
import html2canvas from 'html2canvas';

export default function Passport({ user }) {
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const shareRef = useRef();

  useEffect(() => {
    getProfile(user.id).then(({ data }) => {
      setProfile(data);
      setNewName(data?.full_name || '');
      setNewSlug(data?.public_slug || '');
    });
    getUserAttendance(user.id).then(({ data }) => setAttendance(data || []));
  }, [user.id]);

  async function saveProfile() {
    setSaving(true);
    await updateProfile(user.id, { full_name: newName, public_slug: newSlug });
    setProfile(p => ({ ...p, full_name: newName, public_slug: newSlug }));
    setEditing(false);
    setSaving(false);
  }

  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadAvatar(user.id, file);
    setProfile(p => ({ ...p, avatar_url: url }));
  }

  async function shareCard() {
    setSharing(true);
    const canvas = await html2canvas(shareRef.current, { 
      backgroundColor: '#ffffff', 
      scale: 3,
      useCORS: true 
    });
    const link = document.createElement('a');
    link.download = `${profile.full_name.replace(/\s+/g, '-')}-passport.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setSharing(false);
  }

  if (!profile) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff9900' }}>
      <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>☁️ SYNCING IDENTITY...</span>
    </div>
  );

  const tp = getTierProgress(profile.xp);
  const streak = calcStreak(attendance);
  const publicUrl = `${window.location.origin}/passport/${profile.public_slug}`;

  return (
    <div style={{ padding: '0px' }}>
      {/* OFFICIAL IDENTITY CARD CONTAINER */}
      <div style={{
        background: '#ffffff', 
        borderRadius: '8px', 
        padding: '20px', 
        color: '#0f172a',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
      }}>
        {/* Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #f8fafc', paddingBottom: '12px' }}>
          <div style={{ fontSize: '24px' }}>☁️</div>
          <div>
            <div style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#64748b', textTransform: 'uppercase', fontWeight: '800' }}>AWS Cloud Club</div>
            <div style={{ fontSize: '16px', fontWeight: '900', color: '#ff9900', letterSpacing: '0.05em' }}>E-PASSPORT</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '11px', padding: '4px 10px', borderRadius: '20px', background: tp.color + '15', color: tp.color, fontWeight: '800', border: `1px solid ${tp.color}30` }}>
            {tp.icon} {profile.tier.toUpperCase()}
          </div>
        </div>

        {/* Identity Section */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.full_name}`}
              alt="avatar"
              style={{ width: '85px', height: '85px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
            />
            <label style={{ position: 'absolute', bottom: '-6px', right: '-6px', background: '#ff9900', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              ✏️
              <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <input style={{ padding: '5px 8px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }} value={newName} onChange={e => setNewName(e.target.value)} />
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={saveProfile} style={{ background: '#ff9900', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>Save</button>
                  <button onClick={() => setEditing(false)} style={{ background: '#f1f5f9', border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '11px' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '800', letterSpacing: '0.05em' }}>NAME / NOM</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', marginBottom: '8px' }}>{profile.full_name.toUpperCase()}</div>
                <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '800', letterSpacing: '0.05em' }}>MEMBER ID / NO. DE MEMBRE</div>
                <div style={{ fontSize: '12px', color: '#475569', fontFamily: 'monospace', fontWeight: 'bold' }}>{profile.member_id}</div>
                <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', color: '#ff9900', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', marginTop: '5px', padding: 0 }}>MODIFY DATA ❯</button>
              </>
            )}
          </div>
        </div>

        {/* XP Progress */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '5px', fontWeight: '800', color: '#64748b' }}>
            <span>{profile.xp} XP EARNED</span>
            <span>{tp.nextXP ? `${tp.nextXP - profile.xp} TO NEXT LEVEL` : 'MAX LEVEL'}</span>
          </div>
          <div style={{ background: '#f1f5f9', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${tp.pct}%`, background: tp.color, borderRadius: '99px' }} />
          </div>
        </div>

        {/* Stats Summary */}
        <div style={{ display: 'flex', borderTop: '1px solid #f1f5f9', paddingTop: '12px', textAlign: 'center' }}>
          <div style={{ flex: 1, borderRight: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '20px', fontWeight: '900' }}>{attendance.length}</div>
            <div style={{ fontSize: '8px', color: '#94a3b8', fontWeight: '800' }}>STAMPS</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '20px', fontWeight: '900' }}>{streak}</div>
            <div style={{ fontSize: '8px', color: '#94a3b8', fontWeight: '800' }}>STREAK {streak >= 3 ? '🔥' : ''}</div>
          </div>
        </div>
      </div>

      {/* Share Actions */}
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={shareCard} 
          disabled={sharing} 
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: '#0f172a', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '6px', 
            fontWeight: '800', 
            fontSize: '12px', 
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
          }}
        >
          {sharing ? 'GENERATING...' : '📥 DOWNLOAD SHAREABLE PASSPORT'}
        </button>
        <div style={{ marginTop: '12px', fontSize: '10px', color: '#94a3b8', textAlign: 'center' }}>
          PUBLIC URL: <a href={publicUrl} target="_blank" style={{ color: '#ff9900', textDecoration: 'none' }}>{profile.public_slug}</a>
        </div>
      </div>

      {/* HIDDEN PREVIEW FOR DOWNLOAD (High Quality) */}
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <div ref={shareRef} style={{ width: '400px', padding: '30px', background: '#ffffff', color: '#0f172a', borderRadius: '0px' }}>
           {/* This replicates the card UI above but formatted for a clean PNG export */}
           <div style={{ border: '2px solid #0f172a', padding: '20px' }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '15px' }}>AWS CLOUD CLUB · DUBAI</div>
              <div style={{ fontSize: '28px', fontWeight: '900', marginBottom: '20px' }}>{profile.full_name.toUpperCase()}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <div>
                  <div style={{ fontSize: '9px', color: '#999' }}>TIER</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: tp.color }}>{profile.tier}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '9px', color: '#999' }}>TOTAL XP</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{profile.xp}</div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function calcStreak(attendance) {
  if (!attendance.length) return 0;
  let streak = 0;
  for (const a of attendance) {
    if (a) streak++;
    else break;
  }
  return streak;
}