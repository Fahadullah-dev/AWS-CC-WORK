import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { listUsers, listAttendances, listEvents } from '../graphql/queries';

const TIER_ICONS = { EXPLORER: '/icons/explorer.svg', BUILDER: '/icons/builder.svg', ARCHITECT: '/icons/architect.svg', MASTER: '/icons/master.svg' };

export default function PublicPassport() {
  const { slug } = useParams(); 
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPublicData(); }, [slug]);

  async function loadPublicData() {
    try {
      const client = generateClient();
      const userRes = await client.graphql({ query: listUsers, variables: { filter: { public_slug: { eq: slug } } } });
      const userData = userRes.data.listUsers.items[0];
      if (!userData) { setLoading(false); return; }
      setProfile(userData);
      const [attRes, eventsRes] = await Promise.all([ client.graphql({ query: listAttendances, variables: { filter: { userID: { eq: userData.id } } } }), client.graphql({ query: listEvents }) ]);
      const myAtt = attRes.data.listAttendances.items;
      const allEvents = eventsRes.data.listEvents.items;
      const enrichedAttendance = myAtt.map(a => { const eventInfo = allEvents.find(e => e.id === a.eventID); return { ...a, event: eventInfo }; });
      setAttendance(enrichedAttendance);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  if (loading) return <div style={centerStyle}>FETCHING PUBLIC RECORDS...</div>;
  if (!profile) return <div style={centerStyle}>[ ERROR 404: BUILDER NOT FOUND ]</div>;

  const currentTotalXp = profile?.xp || 0;
  const currentLevel = Math.floor(currentTotalXp / 1000) + 1;
  let currentTier = "EXPLORER"; if (currentLevel >= 21) currentTier = "BUILDER"; if (currentLevel >= 41) currentTier = "ARCHITECT"; if (currentLevel >= 81) currentTier = "MASTER";

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        
        <div style={{ backgroundColor: '#9b68f6', padding: '15px 20px', borderBottom: '4px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <img src="/icons/logo.svg" style={{ height: '20px', objectFit: 'contain' }} alt="Logo" />
          <h2 style={{ color: 'white', margin: 0, fontSize: '14px', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>PUBLIC PASSPORT VIEW</h2>
        </div>

        <div style={{ padding: '25px', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px', textAlign: 'center' }}>
            <div style={{ border: '4px solid black', padding: '6px', backgroundColor: '#3ea1f3', boxShadow: '6px 6px 0px black', position: 'relative', marginBottom: '20px' }}>
              <img src={profile.avatar_url} style={{ width: '110px', height: '110px', display: 'block', backgroundColor: 'white', objectFit: 'cover' }} alt="Avatar" />
            </div>
            
            <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: '900', color: 'black', textTransform: 'uppercase', wordWrap: 'break-word', maxWidth: '100%' }}>{profile.full_name}</h1>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'black', color: 'white', padding: '6px 14px', fontWeight: '900', fontSize: '12px', boxShadow: '4px 4px 0px rgba(0,0,0,0.2)', transform: 'rotate(-2deg)' }}>
              <img src={TIER_ICONS[currentTier]} alt={currentTier} style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
              <span style={{ color: '#00e87f' }}>{currentTier}</span> • LVL {currentLevel}
            </div>
          </div>

          <div style={{ display: 'flex', border: '4px solid black', backgroundColor: '#f0f0f0', boxShadow: '6px 6px 0px rgba(0,0,0,0.1)', marginBottom: '30px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 120px', padding: '15px', textAlign: 'center', borderRight: '4px solid black', backgroundColor: 'white' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#ff9900' }}>{profile.xp}</div>
              <div style={{ fontSize: '10px', fontWeight: '900', color: '#888', letterSpacing: '1px' }}>TOTAL XP</div>
            </div>
            <div style={{ flex: '1 1 120px', padding: '15px', textAlign: 'center', backgroundColor: 'white' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: 'black' }}>{attendance.length}</div>
              <div style={{ fontSize: '10px', fontWeight: '900', color: '#888', letterSpacing: '1px' }}>EVENTS CLEARED</div>
            </div>
          </div>

          <div style={{ border: '4px solid black', padding: '20px', backgroundColor: 'white' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '13px', fontWeight: '900', borderBottom: '3px solid black', paddingBottom: '10px' }}>ACTIVITY LOG</h3>
            {attendance.length === 0 ? (
               <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#999', textAlign: 'center', padding: '10px 0' }}>NO MISSIONS LOGGED YET</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {attendance.map(a => (
                  <div key={a.id} style={{ border: '3px solid black', padding: '6px 10px', fontSize: '11px', fontWeight: '900', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '3px 3px 0px rgba(0,0,0,0.1)' }}>
                    <img src={a.event?.emoji || "/icons/speaker.svg"} style={{ width: '16px', height: '16px', objectFit: 'contain' }} alt="stamp" /> 
                    {a.event?.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const containerStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '5% 15px', backgroundColor: '#1a1c21', color: 'black', boxSizing: 'border-box',
  backgroundImage: `url("/icons/background.png")`, 
  backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed'
};
const cardStyle = { width: '100%', maxWidth: '500px', backgroundColor: 'white', border: '4px solid white', boxShadow: '12px 12px 0px black', position: 'relative', boxSizing: 'border-box' };
const centerStyle = { textAlign: 'center', marginTop: '100px', fontWeight: '900', color: 'white', fontSize: '16px', letterSpacing: '1px' };