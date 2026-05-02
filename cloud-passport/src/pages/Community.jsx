import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { listUsers } from '../graphql/queries';
import html2canvas from 'html2canvas';

const TIER_ICONS = {
  EXPLORER: '/icons/explorer.svg',
  BUILDER: '/icons/builder.svg',
  ARCHITECT: '/icons/architect.svg',
  MASTER: '/icons/master.svg'
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
    const canvas = await html2canvas(element, { scale: 3 }); 
    const data = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = data;
    link.download = `AWS_Builder_Badge_${myProfile?.full_name?.replace(' ', '_')}.png`;
    link.click();
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', fontWeight: '900', color: 'black' }}>SYNCING NETWORK...</div>;

  const currentTotalXp = myProfile?.xp || 0;
  const currentLevel = Math.floor(currentTotalXp / 1000) + 1;
  const filteredUsers = users.filter(u => u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()));

  const myRank = myProfile ? users.findIndex(u => u.id === myProfile.id) + 1 : '-';
  const totalUsers = users.length;

  let currentTier = "EXPLORER";
  if (currentLevel >= 21) currentTier = "BUILDER";
  if (currentLevel >= 41) currentTier = "ARCHITECT";
  if (currentLevel >= 81) currentTier = "MASTER";

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', color: 'black', boxSizing: 'border-box' }}>
      <h2 style={{ marginTop: 0, fontWeight: '900', fontSize: '20px', borderBottom: '4px solid black', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/icons/logo.svg" alt="Cloud" style={{ height: '24px', objectFit: 'contain' }} />
        [ NETWORK & SHOWCASE ]
      </h2>

      {myProfile && (
        <div style={{ marginBottom: '40px', backgroundColor: '#f9f9f9', padding: '15px', border: '3px dashed #ccc', boxSizing: 'border-box' }}>
          {/* COLOR CHANGED TO BLACK */}
          <h3 style={{ margin: '0 0 15px 0', fontWeight: '900', fontSize: '13px', color: 'black' }}>&gt; EXPORT TO LINKEDIN</h3>
          
          <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '10px' }}>
            <div id="linkedin-passport-card" style={{ 
              backgroundColor: '#1a1c21', color: 'white', border: '4px solid #333', 
              padding: '20px 20px 65px 20px', width: '400px', height: '270px', margin: '0 auto', 
              position: 'relative', overflow: 'hidden', boxSizing: 'border-box',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', backgroundImage: 'linear-gradient(90deg, #3ea1f3, #9b68f6)' }}></div>
              <img src="/icons/aws-white.png" style={{ position: 'absolute', top: '18px', right: '15px', width: '40px', objectFit: 'contain', zIndex: 10 }} alt="AWS" />
              <img src="/icons/purple-banner.png" style={{ position: 'absolute', bottom: '0', left: '0', width: '60%', height: 'auto', display: 'block', zIndex: 10 }} alt="AWS SBG Banner" />
              <div style={{ position: 'absolute', bottom: '60px', right: '15px', opacity: 0.1, pointerEvents: 'none' }}>
                 <img src="/icons/logo.svg" style={{width: '120px', objectFit: 'contain'}} alt="watermark"/>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', position: 'relative', zIndex: 2 }}>
                <img src={myProfile.avatar_url} style={{ width: '65px', height: '65px', border: '3px solid #ff9900', objectFit: 'cover', flexShrink: 0 }} alt="PFP" />
                <div style={{ flex: 1, minWidth: 0, paddingRight: '55px' }}>
                  <div style={{ fontWeight: '900', fontSize: '24px', textTransform: 'uppercase', lineHeight: '1.1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{myProfile.full_name}</div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#00e87f', marginTop: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>{myProfile.major?.join(' + ')}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #444', borderBottom: '1px solid #444', padding: '12px 0', position: 'relative', zIndex: 2 }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: '#ff9900' }}>{currentTotalXp}</div>
                  <div style={{ fontSize: '9px', fontWeight: '900', letterSpacing: '1px', color: '#888' }}>TOTAL XP</div>
                </div>
                <div style={{ width: '1px', backgroundColor: '#444' }}></div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: 'white' }}>LVL {currentLevel}</div>
                  <div style={{ fontSize: '9px', fontWeight: '900', letterSpacing: '1px', color: '#888' }}>BUILDER LVL</div>
                </div>
                <div style={{ width: '1px', backgroundColor: '#444' }}></div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: '#3ea1f3' }}>{myRank}/{totalUsers}</div>
                  <div style={{ fontSize: '9px', fontWeight: '900', letterSpacing: '1px', color: '#888' }}>GLOBAL RANK</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', position: 'relative', zIndex: 2 }}>
                <img src={TIER_ICONS[currentTier]} style={{ width: '16px', height: '16px' }} alt="Tier" />
                <div style={{ fontSize: '12px', fontWeight: '900', color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {currentTier} TIER
                </div>
              </div>
            </div>
          </div>

          <button onClick={downloadCard} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', maxWidth: '400px', margin: '15px auto 0 auto', padding: '12px', backgroundColor: '#3ea1f3', color: 'white', border: '3px solid black', fontWeight: '900', cursor: 'pointer', boxShadow: '4px 4px 0px black', fontSize: '11px' }}>
            <img src="/icons/download.png" style={{ width: '30px' }} alt="Download" />
            DOWNLOAD BADGE FOR LINKEDIN
          </button>
        </div>
      )}

      {/* SEARCH BAR & TITLE ADJUSTED HERE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid black', paddingBottom: '10px', marginBottom: '15px', flexWrap: 'nowrap', gap: '10px' }}>
        <h3 style={{ margin: 0, fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>MURDOCH LEADERBOARD</h3>
        <div style={{ flex: 1, maxWidth: '200px', display: 'flex', justifyContent: 'flex-end' }}>
          <input type="text" placeholder="SEARCH BUILDER..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', border: '3px solid black', padding: '6px 10px', fontSize: '10px', fontWeight: '900', outline: 'none', boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', fontWeight: 'bold', color: '#999' }}>NO BUILDERS FOUND</div>
        ) : (
          filteredUsers.map((u, i) => {
            let bgColor = 'white'; let rankColor = 'black'; 
            let icon = `#${i + 1}`;
            
            if (searchQuery === '') {
              if (i === 0) { bgColor = '#fffbe6'; rankColor = '#ff9900'; icon = <img src="/icons/first.png" alt="1st" style={{ width: '20px' }} />; }
              else if (i === 1) { bgColor = '#f8f9fa'; rankColor = '#94a3b8'; icon = <img src="/icons/second.png" alt="2nd" style={{ width: '20px' }} />; }
              else if (i === 2) { bgColor = '#fff5f0'; rankColor = '#b45309'; icon = <img src="/icons/third.png" alt="3rd" style={{ width: '20px' }} />; }
            }

            return (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', padding: '10px', backgroundColor: bgColor, border: '2px solid black', boxShadow: i === 0 && searchQuery === '' ? '4px 4px 0px #3ea1f3' : '3px 3px 0px rgba(0,0,0,0.1)' }}>
                <div style={{ width: '30px', fontWeight: '900', fontSize: i < 3 && searchQuery === '' ? '16px' : '12px', color: rankColor, textAlign: 'center' }}>
                  {icon}
                </div>
                <img src={u.avatar_url || '/icons/speaker.svg'} style={{ width: '32px', height: '32px', border: '2px solid black', objectFit: 'cover', margin: '0 10px' }} alt="Avatar" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '11px', wordWrap: 'break-word' }}>{u.full_name}</div>
                  <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#666' }}>{u.major?.join(' + ')}</div>
                </div>
                <div style={{ fontWeight: '900', fontSize: '11px', color: '#9b68f6', backgroundColor: '#f0f0f0', padding: '4px 6px', border: '1px solid black' }}>
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