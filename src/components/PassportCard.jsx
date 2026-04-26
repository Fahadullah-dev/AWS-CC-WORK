// src/components/PassportCard.jsx
import React from 'react';

export default function PassportCard() {
  const profile = {
    name: "Wadiqa Baig",
    tier: "Architect",
    xp: 1650,
    avatar: "👩🏻‍💻",
    major: "Computer Science & AI",
    joinDate: "Sept 2024"
  };

  return (
    <div id="downloadable-card" className="glass-panel" style={{ 
        width: '100%', 
        position: 'relative', 
        overflow: 'hidden',
        boxSizing: 'border-box'
    }}>
      <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', background: 'var(--neon-purple)', filter: 'blur(40px)', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--neon-blue)', filter: 'blur(40px)', borderRadius: '50%', zIndex: 0 }}></div>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 5px 0', color: 'var(--aws-orange)' }}>AWS Cloud Club</h2>
        <p style={{ fontSize: '12px', color: '#aaa', margin: '0 0 20px 0' }}>Official E-Passport</p>
        
        <div style={{ fontSize: '64px', margin: '10px 0' }}>{profile.avatar}</div>
        
        <h3 style={{ margin: '10px 0 5px 0' }}>{profile.name}</h3>
        <p style={{ fontSize: '14px', color: 'var(--neon-green)', fontWeight: 'bold' }}>Tier: {profile.tier}</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '10px', color: '#888' }}>MAJOR</span>
            <div style={{ fontSize: '12px' }}>{profile.major}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '10px', color: '#888' }}>TOTAL XP</span>
            <div style={{ fontSize: '14px', color: 'var(--neon-pink)', fontWeight: 'bold' }}>{profile.xp} XP</div>
          </div>
        </div>
      </div>
    </div>
  );
}