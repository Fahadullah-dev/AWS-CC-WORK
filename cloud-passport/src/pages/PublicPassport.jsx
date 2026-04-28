import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { listUsers, listAttendances, listEvents } from '../graphql/queries';

const TIER_ICONS = { EXPLORER: '/icons/explorer.svg', BUILDER: '/icons/builder.svg', ARCHITECT: '/icons/architect.svg', PIONEER: '/icons/pioneer.svg' };

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

  if (loading) return <div style={centerStyle}>FETCHING_PUBLIC_RECORDS...</div>;
  if (!profile) return <div style={centerStyle}>[ ERROR 404: BUILDER_NOT_FOUND ]</div>;

  const currentTotalXp = profile?.xp || 0;
  const currentLevel = Math.floor(currentTotalXp / 1000) + 1;
  let currentTier = "EXPLORER"; if (currentLevel >= 21) currentTier = "BUILDER"; if (currentLevel >= 41) currentTier = "ARCHITECT"; if (currentLevel >= 81) currentTier = "PIONEER";

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        
        <div style={{ backgroundColor: '#9b68f6', padding: '15px 25px', borderBottom: '4px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          {/* REMOVED FILTER */}
          <img src="/icons/program-icon.svg" style={{ height: '20px' }} alt="Logo" />
          <h2 style={{ color: 'white', margin: 0, fontSize: '16px', fontWeight: '900', letterSpacing: '2px' }}>PUBLIC_PASSPORT_VIEW</h2>
        </div>

        <div style={{ padding: '30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px', textAlign: 'center' }}>
            <div style={{ border: '4px solid black', padding: '6px', backgroundColor: '#3ea1f3', boxShadow: '6px 6px 0px black', position: 'relative', marginBottom: '20px' }}>
              <img src={profile.avatar_url} style={{ width: '130px', height: '130px', display: 'block', backgroundColor: 'white', objectFit: 'cover' }} alt="Avatar" />
            </div>
            
            <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: '900', color: 'black', textTransform: 'uppercase' }}>{profile.full_name}</h1>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'black', color: 'white', padding: '6px 14px', fontWeight: '900', fontSize: '14px', boxShadow: '4px 4px 0px rgba(0,0,0,0.2)', transform: 'rotate(-2deg)' }}>
              <img src={TIER_ICONS[currentTier]} alt={currentTier} style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
              <span style={{ color: '#00e87f' }}>{currentTier}</span> • LVL {currentLevel}
            </div>
          </div>

          <div style={{ display: 'flex', border: '4px solid black', backgroundColor: '#f0f0f0', boxShadow: '6px 6px 0px rgba(0,0,0,0.1)', marginBottom: '30px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 120px', padding: '20px', textAlign: 'center', borderRight: '4px solid black', backgroundColor: 'white' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#ff9900' }}>{profile.xp}</div>
              <div style={{ fontSize: '11px', fontWeight: '900', color: '#888', letterSpacing: '1px' }}>TOTAL_XP</div>
            </div>
            <div style={{ flex: '1 1 120px', padding: '20px', textAlign: 'center', backgroundColor: 'white' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: 'black' }}>{attendance.length}</div>
              <div style={{ fontSize: '11px', fontWeight: '900', color: '#888', letterSpacing: '1px' }}>EVENTS_CLEARED</div>
            </div>
          </div>

          <div style={{ border: '4px solid black', padding: '20px', backgroundColor: 'white' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: '900', borderBottom: '3px solid black', paddingBottom: '10px' }}>ACTIVITY_LOG</h3>
            {attendance.length === 0 ? (
               <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#999', textAlign: 'center', padding: '10px 0' }}>NO_MISSIONS_LOGGED_YET</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {attendance.map(a => (
                  <div key={a.id} style={{ border: '3px solid black', padding: '8px 12px', fontSize: '12px', fontWeight: '900', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '3px 3px 0px rgba(0,0,0,0.1)' }}>
                    <img src={a.event?.emoji || "/icons/speaker.svg"} style={{ width: '20px', height: '20px', objectFit: 'contain' }} alt="stamp" /> 
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

// AWS BRAND STYLES
const containerStyle = { 
  minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '40px 20px', backgroundColor: '#1a1c21', 
  backgroundImage: `
    linear-gradient(#2d3139 2px, transparent 2px), 
    linear-gradient(90deg, #2d3139 2px, transparent 2px),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Crect x='0' y='0' width='80' height='80' fill='%23ff9900' opacity='0.8'/%3E%3Crect x='200' y='0' width='80' height='80' fill='%23ff9900' opacity='0.8'/%3E%3Crect x='120' y='0' width='40' height='40' fill='%239b68f6' opacity='0.8'/%3E%3Crect x='80' y='40' width='40' height='40' fill='%239b68f6' opacity='0.8'/%3E%3Crect x='160' y='40' width='40' height='40' fill='%239b68f6' opacity='0.8'/%3E%3Crect x='40' y='80' width='40' height='40' fill='%239b68f6' opacity='0.8'/%3E%3Crect x='200' y='80' width='40' height='40' fill='%239b68f6' opacity='0.8'/%3E%3Crect x='120' y='80' width='40' height='40' fill='%23ff57f6' opacity='0.8'/%3E%3Crect x='80' y='120' width='40' height='40' fill='%23ff57f6' opacity='0.8'/%3E%3Crect x='160' y='120' width='40' height='40' fill='%23ff57f6' opacity='0.8'/%3E%3Crect x='0' y='160' width='80' height='80' fill='%23ff9900' opacity='0.8'/%3E%3Crect x='200' y='160' width='80' height='80' fill='%23ff9900' opacity='0.8'/%3E%3Crect x='120' y='200' width='40' height='40' fill='%239b68f6' opacity='0.8'/%3E%3C/svg%3E")
  `, 
  backgroundSize: '40px 40px, 40px 40px, 500px 500px', backgroundPosition: '0 0, 0 0, right 50px', backgroundRepeat: 'repeat, repeat, no-repeat', color: 'black' 
};
const cardStyle = { width: '100%', maxWidth: '500px', backgroundColor: 'white', border: '4px solid white', boxShadow: '12px 12px 0px black', position: 'relative' };
const centerStyle = { textAlign: 'center', marginTop: '100px', fontWeight: '900', color: 'white', fontSize: '18px', letterSpacing: '1px' };