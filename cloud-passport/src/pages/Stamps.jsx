import React from 'react';

const STAMPS_DATA = [
  { id: 1, name: 'Genesis', date: '04/20/2026', icon: 'https://img.icons8.com/?size=100&id=46726&format=png&color=000000', collected: true },
  { id: 2, name: 'Cloud-101', date: '04/25/2026', icon: 'https://img.icons8.com/?size=100&id=46757&format=png&color=000000', collected: true },
  { id: 3, name: 'Buildathon', date: '--/--/--', icon: 'https://img.icons8.com/?size=100&id=46704&format=png&color=000000', collected: false },
  { id: 4, name: 'Security', date: '--/--/--', icon: 'https://img.icons8.com/?size=100&id=46732&format=png&color=000000', collected: false },
  { id: 5, name: 'Networker', date: '--/--/--', icon: 'https://img.icons8.com/?size=100&id=46698&format=png&color=000000', collected: false },
  { id: 6, name: 'AI Expert', date: '--/--/--', icon: 'https://img.icons8.com/?size=100&id=103790&format=png&color=000000', collected: false },
];

export default function Stamps() {
  return (
    <div style={{ backgroundColor: 'white', padding: '30px', color: 'black' }}>
      <h2 style={{ 
        marginTop: 0, fontWeight: '900', fontSize: '20px', 
        borderBottom: '4px solid black', paddingBottom: '15px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        [ REWARD_STAMPS_LOG ]
        <span style={{ fontSize: '11px', color: '#666' }}>COLLECTED: 2/12</span>
      </h2>

      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '20px', marginTop: '25px' 
      }}>
        {STAMPS_DATA.map(stamp => (
          <div key={stamp.id} style={{
            border: stamp.collected ? '3px solid black' : '2px dashed #ccc',
            padding: '15px 10px',
            textAlign: 'center',
            backgroundColor: stamp.collected ? '#fff' : '#fafafa',
            boxShadow: stamp.collected ? '4px 4px 0px black' : 'none',
            position: 'relative',
            opacity: stamp.collected ? 1 : 0.6
          }}>
            {/* The Badge Icon */}
            <img 
              src={stamp.icon} 
              alt={stamp.name}
              style={{ 
                width: '40px', height: '40px', marginBottom: '10px',
                filter: stamp.collected ? 'none' : 'grayscale(100%) brightness(1.5)'
              }}
            />
            
            {/* Stamp Label */}
            <div style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: 'black' }}>
              {stamp.name}
            </div>
            
            {/* Unlock Date */}
            <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#888', marginTop: '4px' }}>
              {stamp.date}
            </div>

            {/* Collected Seal */}
            {stamp.collected && (
              <div style={{
                position: 'absolute', top: '-5px', right: '-5px',
                backgroundColor: '#FF9900', border: '2px solid black',
                width: '18px', height: '18px', borderRadius: '50%',
                fontSize: '10px', fontWeight: '900', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Rarity Legend */}
      <div style={{ 
        marginTop: '30px', padding: '15px', border: '3px solid black', 
        backgroundColor: '#6B38FB', color: 'white'
      }}>
        <p style={{ margin: 0, fontSize: '10px', fontWeight: '900', textAlign: 'center', letterSpacing: '1px' }}>
          &gt; TOTAL_REWARDS_UNLOCKED: 250 XP EQUIVALENT &lt;
        </p>
      </div>
    </div>
  );
}