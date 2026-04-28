import React from 'react';

export default function Guide() {
  const tiers = [
    { name: 'EXPLORER', level: '1-20', xp: '0 - 20,000 XP', color: '#ccc', icon: '/icons/explorer.png' },
    { name: 'BUILDER', level: '21-40', xp: '21,000 - 40,000 XP', color: '#10b981', icon: '/icons/builder.png' },
    { name: 'ARCHITECT', level: '41-80', xp: '41,000 - 80,000 XP', color: '#3b82f6', icon: '/icons/architect.png' },
    { name: 'PIONEER', level: '81-100+', xp: '81,000+ XP', color: '#6B38FB', icon: '/icons/pioneer.png' }
  ];

  return (
    <div style={{ backgroundColor: 'white', padding: '30px', color: 'black' }}>
      <h2 style={{ marginTop: 0, fontWeight: '900', fontSize: '20px', borderBottom: '4px solid black', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/icons/cloud-icon.png" alt="Cloud" style={{ width: '24px' }} />
        [ SYSTEM_DIRECTIVES ]
      </h2>

      <div style={{ backgroundColor: '#fffbe6', border: '3px solid black', padding: '20px', marginBottom: '30px', boxShadow: '6px 6px 0px #FF9900', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-12px', left: '20px', background: 'black', color: 'white', padding: '2px 10px', fontSize: '10px', fontWeight: '900' }}>SYS_MSG</div>
        <h3 style={{ margin: '0 0 10px 0', fontWeight: '900', fontSize: '16px', textTransform: 'uppercase' }}>XP Leveling Protocol</h3>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', lineHeight: '1.6' }}>
          Every <span style={{ color: '#FF9900', fontWeight: '900', backgroundColor: 'black', padding: '2px 6px' }}>1,000 XP</span> earned unlocks a new Level. Attend official AWS Cloud Club workshops, scan event projection nodes (QR), and build your technical identity.
        </p>
      </div>

      <h3 style={{ fontWeight: '900', fontSize: '16px', marginBottom: '15px', borderBottom: '2px dashed #ccc', paddingBottom: '10px' }}>TIER_CLASSIFICATIONS</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {tiers.map((t, i) => (
          <div key={i} style={{ border: '3px solid black', display: 'flex', alignItems: 'stretch', backgroundColor: '#fdfdfd', boxShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>
            
            {/* INCREASED ICON SIZE HERE */}
            <div style={{ backgroundColor: 'black', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '70px' }}>
              <img src={t.icon} alt={t.name} style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
            </div>

            <div style={{ padding: '15px', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: '900', fontSize: '20px', color: 'black' }}>{t.name}</div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginTop: '2px' }}>{t.xp}</div>
              </div>
              <div style={{ backgroundColor: t.color, color: 'white', fontWeight: '900', padding: '5px 15px', border: '2px solid black', fontSize: '14px' }}>
                LVL {t.level}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}