import React from 'react';

export default function Guide() {
  const tiers = [
    { name: 'EXPLORER', level: '1-5', xp: '0 - 1,199 XP', color: '#00e87f', icon: '/icons/explorer.svg' },
    { name: 'BUILDER', level: '6-12', xp: '1,200 - 2,599 XP', color: '#9b68f6', icon: '/icons/builder.svg' },
    { name: 'ARCHITECT', level: '13-19', xp: '2,600 - 3,999 XP', color: '#3ea1f3', icon: '/icons/architect.svg' },
    { name: 'MASTER', level: '20+', xp: '4,000+ XP', color: '#ff57f6', icon: '/icons/master.svg' }
  ];

  return (
    <div style={{ backgroundColor: 'white', padding: '25px', color: 'black', boxSizing: 'border-box' }}>

      <h2 style={{ marginTop: 0, fontWeight: '900', fontSize: '18px', borderBottom: '4px solid black', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/icons/logo.svg" alt="Cloud" style={{ height: '24px', objectFit: 'contain' }} />
        [ SYSTEM DIRECTIVES ]
      </h2>

      <div style={{ backgroundColor: '#fffbe6', border: '3px solid black', padding: '20px', marginBottom: '30px', boxShadow: '6px 6px 0px #ff9900', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-12px', left: '20px', background: 'black', color: 'white', padding: '2px 10px', fontSize: '10px', fontWeight: '900' }}>SYS MSG</div>
        <h3 style={{ margin: '0 0 10px 0', fontWeight: '900', fontSize: '15px', textTransform: 'uppercase' }}>12-Week Battle Pass Protocol</h3>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', lineHeight: '1.6' }}>
          Levels and Tiers reset every trimester! Every <span style={{ color: '#ff9900', fontWeight: '900', backgroundColor: 'black', padding: '2px 6px' }}>200 XP</span> earned unlocks a new Level. Attend official AWS Student Builder Group workshops, scan event projection nodes (QR), and build your technical identity before the season ends!
        </p>
      </div>

      <h3 style={{ fontWeight: '900', fontSize: '15px', marginBottom: '15px', borderBottom: '2px dashed #ccc', paddingBottom: '10px', textTransform: 'uppercase' }}>Trimester Classifications</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {tiers.map((t, i) => (
          <div key={i} style={{ border: '3px solid black', display: 'flex', alignItems: 'stretch', backgroundColor: '#fdfdfd', boxShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}>
            <div style={{ backgroundColor: 'black', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '60px' }}>
              <img src={t.icon} alt={t.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            </div>
            <div style={{ padding: '15px', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontWeight: '900', fontSize: '18px', color: 'black' }}>{t.name}</div>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#666', marginTop: '2px' }}>{t.xp}</div>
              </div>
              <div style={{ backgroundColor: t.color, color: t.name === 'EXPLORER' ? 'black' : 'white', fontWeight: '900', padding: '5px 12px', border: '2px solid black', fontSize: '12px' }}>
                LVL {t.level}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}