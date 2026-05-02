import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import html2canvas from 'html2canvas';

// 🛑 CUSTOM QUERY: Pulls identity info AND archives
const CUSTOM_GET_USER_ARCHIVE = `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      full_name
      major
      avatar_url
      archives
    }
  }
`;

const TIER_ICONS = { EXPLORER: '/icons/explorer.svg', BUILDER: '/icons/builder.svg', ARCHITECT: '/icons/architect.svg', MASTER: '/icons/master.svg' };

export default function Archive() {
  const [profile, setProfile] = useState(null);
  const [archives, setArchives] = useState([]);
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArchive() {
      try {
        const client = generateClient();
        const { userId } = await getCurrentUser();
        // USING CUSTOM QUERY HERE
        const userRes = await client.graphql({ query: CUSTOM_GET_USER_ARCHIVE, variables: { id: userId } });
        
        const userData = userRes.data.getUser;
        setProfile(userData);

        if (userData?.archives) {
          const parsed = JSON.parse(userData.archives);
          const sorted = parsed.reverse();
          setArchives(sorted);
          if (sorted.length > 0) setSelectedArchive(sorted[0]);
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    loadArchive();
  }, []);

  const downloadCard = async () => {
    const element = document.getElementById('archive-passport-card');
    const canvas = await html2canvas(element, { scale: 3 }); 
    const data = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = data;
    link.download = `AWS_Legacy_${selectedArchive.trimester.replace(' ', '_')}.png`;
    link.click();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }).toUpperCase();
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', fontWeight: '900', color: 'black' }}>ACCESSING ARCHIVES...</div>;
  if (archives.length === 0) return <div style={{ padding: '50px', textAlign: 'center', fontWeight: '900', color: 'black' }}>NO LEGACY RECORDS FOUND.</div>;

  const currentLevel = Math.floor((selectedArchive?.xp || 0) / 200) + 1;

  return (
    <div style={{ backgroundColor: 'white', padding: '25px', color: 'black', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid black', paddingBottom: '15px', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ margin: 0, fontWeight: '900', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/icons/logo.svg" alt="Cloud" style={{ height: '24px', objectFit: 'contain' }} />
          [ LEGACY ARCHIVE ]
        </h2>
        <select 
          style={{ padding: '8px 12px', border: '3px solid black', fontWeight: '900', outline: 'none', backgroundColor: '#f0f0f0', cursor: 'pointer' }}
          onChange={(e) => setSelectedArchive(archives[e.target.value])}
        >
          {archives.map((arc, i) => (
            <option key={i} value={i}>{arc.trimester.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {selectedArchive && (
        <>
          <div style={{ marginBottom: '40px', backgroundColor: '#f9f9f9', padding: '15px', border: '3px dashed #ccc', boxSizing: 'border-box' }}>
            <h3 style={{ margin: '0 0 15px 0', fontWeight: '900', fontSize: '13px', color: 'black' }}>&gt; EXPORT LEGACY BADGE</h3>
            
            <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '10px' }}>
              <div id="archive-passport-card" style={{ 
                backgroundColor: '#1a1c21', color: 'white', border: '4px solid #333', 
                padding: '20px 20px 65px 20px', width: '400px', height: '270px', margin: '0 auto', 
                position: 'relative', overflow: 'hidden', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', backgroundImage: 'linear-gradient(90deg, #ff9900, #ff57f6)' }}></div>
                <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'black', color: '#ff9900', padding: '4px 8px', fontSize: '10px', fontWeight: '900', border: '1px solid #ff9900' }}>LEGACY: {selectedArchive.trimester.toUpperCase()}</div>
                <img src="/icons/purple-banner.png" style={{ position: 'absolute', bottom: '0', left: '0', width: '60%', height: 'auto', display: 'block', zIndex: 10, filter: 'grayscale(0.5)' }} alt="Banner" />

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', position: 'relative', zIndex: 2, marginTop: '15px' }}>
                  <img src={profile.avatar_url} style={{ width: '65px', height: '65px', border: '3px solid #666', objectFit: 'cover', flexShrink: 0, filter: 'grayscale(0.8)' }} alt="PFP" />
                  <div style={{ flex: 1, minWidth: 0, paddingRight: '55px' }}>
                    <div style={{ fontWeight: '900', fontSize: '24px', textTransform: 'uppercase', lineHeight: '1.1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.full_name}</div>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#888', marginTop: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>{profile.major?.join(' + ')}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #444', borderBottom: '1px solid #444', padding: '12px 0', position: 'relative', zIndex: 2 }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '20px', fontWeight: '900', color: '#ff9900' }}>{selectedArchive.xp}</div>
                    <div style={{ fontSize: '9px', fontWeight: '900', letterSpacing: '1px', color: '#888' }}>FINAL XP</div>
                  </div>
                  <div style={{ width: '1px', backgroundColor: '#444' }}></div>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '20px', fontWeight: '900', color: 'white' }}>LVL {currentLevel}</div>
                    <div style={{ fontSize: '9px', fontWeight: '900', letterSpacing: '1px', color: '#888' }}>FINAL LVL</div>
                  </div>
                  <div style={{ width: '1px', backgroundColor: '#444' }}></div>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '20px', fontWeight: '900', color: '#3ea1f3' }}>{selectedArchive.eventsCount || 0}</div>
                    <div style={{ fontSize: '9px', fontWeight: '900', letterSpacing: '1px', color: '#888' }}>EVENTS ATTENDED</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', position: 'relative', zIndex: 2 }}>
                  <img src={TIER_ICONS[selectedArchive.tier] || TIER_ICONS.EXPLORER} style={{ width: '16px', height: '16px', filter: 'grayscale(0.5)' }} alt="Tier" />
                  <div style={{ fontSize: '12px', fontWeight: '900', color: '#ccc', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    ACHIEVED {selectedArchive.tier} TIER
                  </div>
                </div>
              </div>
            </div>

            <button onClick={downloadCard} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', maxWidth: '400px', margin: '15px auto 0 auto', padding: '12px', backgroundColor: 'black', color: 'white', border: '3px solid #666', fontWeight: '900', cursor: 'pointer', boxShadow: '4px 4px 0px #666', fontSize: '11px' }}>
              <img src="/icons/download.png" style={{ width: '20px', filter: 'invert(1)' }} alt="Download" />
              DOWNLOAD LEGACY BADGE
            </button>
          </div>

          <h3 style={{ fontSize: '13px', fontWeight: '900', backgroundColor: '#666', color: 'white', display: 'inline-block', padding: '5px 15px', marginBottom: '15px' }}>
            LEGACY STAMPS SECURED
          </h3>
          
          {(!selectedArchive.stamps || selectedArchive.stamps.length === 0) ? (
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#999' }}>NO STAMPS LOGGED THIS TRIMESTER.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '15px' }}>
              {selectedArchive.stamps.map((s, idx) => (
                <div key={idx} style={{ border: '3px solid #666', padding: '15px 5px', textAlign: 'center', backgroundColor: '#f0f0f0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={s.emoji || "/icons/speaker.svg"} style={{ width: '40px', height: '40px', objectFit: 'contain', marginBottom: '8px', filter: 'grayscale(1)' }} alt="stamp" />
                  <div style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', wordWrap: 'break-word', color: '#333' }}>{s.name}</div>
                  <div style={{ fontSize: '9px', color: '#888', marginTop: '8px', fontWeight: 'bold', borderTop: '2px dotted #ccc', paddingTop: '6px', width: '100%' }}>
                    ACQUIRED:<br/><span style={{ color: 'black' }}>{formatDate(s.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}