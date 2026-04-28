import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { listUsers } from '../graphql/queries';
import html2canvas from 'html2canvas';

const TIER_ICONS = {
  EXPLORER: '/icons/explorer.png',
  BUILDER: '/icons/builder.png',
  ARCHITECT: '/icons/architect.png',
  PIONEER: '/icons/pioneer.png'
};

export default function Community() {
  const [users, setUsers] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const client = generateClient();
        const { userId } = await getCurrentUser();
        const res = await client.graphql({ query: listUsers });
        
        const allUsers = res.data.listUsers.items || [];
        setUsers(allUsers.sort((a, b) => (b.xp || 0) - (a.xp || 0)));
        setMyProfile(allUsers.find(u => u.id === userId));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    loadData();
  }, []);

  const downloadCard = async () => {
    const element = document.getElementById('linkedin-passport-card');
    const canvas = await html2canvas(element, { scale: 3 }); // High Res for LinkedIn
    const data = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = data;
    link.download = `AWS_Builder_Badge_${myProfile?.full_name?.replace(' ', '_')}.png`;
    link.click();
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', fontWeight: '900', color: 'black' }}>SYNCING_NETWORK...</div>;

  const currentTotalXp = myProfile?.xp || 0;
  const currentLevel = Math.floor(currentTotalXp / 1000) + 1;
  const filteredUsers = users.filter(u => u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()));

  // --- ADD THIS SMART TIER CALCULATOR ---
  let currentTier = "EXPLORER";
  if (currentLevel >= 21) currentTier = "BUILDER";
  if (currentLevel >= 41) currentTier = "ARCHITECT";
  if (currentLevel >= 81) currentTier = "PIONEER";

  return (
    <div style={{ backgroundColor: 'white', padding: '30px', color: 'black' }}>
      <h2 style={{ marginTop: 0, fontWeight: '900', fontSize: '20px', borderBottom: '4px solid black', paddingBottom: '15px' }}>
        [ NETWORK & SHOWCASE ]
      </h2>

      {/* PREMIUM DARK-MODE LINKEDIN CARD */}
      {myProfile && (
        <div style={{ marginBottom: '50px', backgroundColor: '#f9f9f9', padding: '20px', border: '3px dashed #ccc' }}>
          <h3 style={{ margin: '0 0 15px 0', fontWeight: '900', fontSize: '14px', color: '#6B38FB' }}>&gt; EXPORT_TO_LINKEDIN</h3>
          
          <div id="linkedin-passport-card" style={{ backgroundColor: '#111', color: 'white', border: '4px solid #333', padding: '25px', width: '100%', maxWidth: '380px', margin: '0 auto 20px auto', position: 'relative', overflow: 'hidden' }}>
            {/* Top Accent Bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', backgroundImage: 'linear-gradient(90deg, #FF9900, #6B38FB)' }}></div>
            
            {/* Background watermark */}
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.05, transform: 'scale(2)' }}>
               <img src="/icons/cloud-icon.png" style={{width: '150px'}} alt="watermark"/>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', position: 'relative', zIndex: 2 }}>
              <img src={myProfile.avatar_url} style={{ width: '70px', height: '70px', border: '3px solid #FF9900', objectFit: 'cover' }} alt="PFP" />
              <div>
                <div style={{ fontWeight: '900', fontSize: '20px', textTransform: 'uppercase', lineHeight: '1.1' }}>{myProfile.full_name}</div>
                <div style={{ fontSize: '10px', fontWeight: '900', color: '#aaa', marginTop: '6px', letterSpacing: '1px' }}>AWS CLOUD CLUB DXB</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #444', borderBottom: '1px solid #444', padding: '15px 0', position: 'relative', zIndex: 2 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#FF9900' }}>{currentTotalXp}</div>
                <div style={{ fontSize: '9px', fontWeight: '900', letterSpacing: '1px', color: '#888' }}>TOTAL_XP</div>
              </div>
              <div style={{ width: '1px', backgroundColor: '#444' }}></div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: '900', color: 'white' }}>LVL {currentLevel}</div>
                <div style={{ fontSize: '9px', fontWeight: '900', letterSpacing: '1px', color: '#888' }}>BUILDER_LVL</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '15px', position: 'relative', zIndex: 2 }}>
              <img src={TIER_ICONS[currentTier]} style={{ width: '18px', height: '18px', filter: 'drop-shadow(0px 0px 4px rgba(255,255,255,0.3))' }} alt="Tier" />
              <div style={{ fontSize: '14px', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '2px' }}>
                {currentTier} TIER
              </div>
            </div>
          </div>

          <button onClick={downloadCard} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', maxWidth: '380px', margin: '0 auto', padding: '14px', backgroundColor: '#0A66C2', color: 'white', border: '3px solid black', fontWeight: '900', cursor: 'pointer', boxShadow: '4px 4px 0px black' }}>
            <img src="/icons/upload.png" style={{ width: '14px', filter: 'invert(1)', transform: 'rotate(180deg)' }} alt="Download" />
            DOWNLOAD BADGE FOR LINKEDIN
          </button>
        </div>
      )}

      {/* SEARCH AND LEADERBOARD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '3px solid black', paddingBottom: '10px', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, fontWeight: '900', fontSize: '16px' }}>GLOBAL_LEADERBOARD</h3>
        <input 
          type="text" 
          placeholder="Search Builder..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ border: '2px solid black', padding: '6px 10px', fontSize: '12px', fontWeight: 'bold', outline: 'none', width: '150px' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', fontWeight: 'bold', color: '#999' }}>NO BUILDERS FOUND</div>
        ) : (
          filteredUsers.map((u, i) => {
            // "Podium" styling for the top 3
            let bgColor = 'white';
            let rankColor = 'black';
            let icon = `#${i + 1}`;
            
            // Only apply podium if we aren't searching (so absolute ranks stay true)
            if (searchQuery === '') {
              if (i === 0) { bgColor = '#fffbe6'; rankColor = '#FF9900'; icon = '🥇'; }
              else if (i === 1) { bgColor = '#f8f9fa'; rankColor = '#94a3b8'; icon = '🥈'; }
              else if (i === 2) { bgColor = '#fff5f0'; rankColor = '#b45309'; icon = '🥉'; }
            }

            return (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: bgColor, border: '2px solid black', boxShadow: i === 0 && searchQuery === '' ? '4px 4px 0px #FF9900' : '3px 3px 0px rgba(0,0,0,0.1)' }}>
                <div style={{ width: '35px', fontWeight: '900', fontSize: i < 3 && searchQuery === '' ? '20px' : '14px', color: rankColor, textAlign: 'center' }}>
                  {icon}
                </div>
                <img src={u.avatar_url || '/icons/event-default.png'} style={{ width: '36px', height: '36px', border: '2px solid black', objectFit: 'cover', margin: '0 15px' }} alt="Avatar" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '13px' }}>{u.full_name}</div>
                  <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#666' }}>{u.major?.join(' + ')}</div>
                </div>
                <div style={{ fontWeight: '900', fontSize: '14px', color: '#6B38FB', backgroundColor: '#f0f0f0', padding: '4px 8px', border: '1px solid black' }}>
                  {u.xp || 0} XP
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}