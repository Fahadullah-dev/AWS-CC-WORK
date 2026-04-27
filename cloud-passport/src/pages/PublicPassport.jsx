import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { listUsers, listAttendances, listEvents } from '../graphql/queries';

export default function PublicPassport() {
  const client = generateClient();
  const { slug } = useParams(); 
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPublicData(); }, [slug]);

  async function loadPublicData() {
    try {
      const userRes = await client.graphql({ query: listUsers, variables: { filter: { public_slug: { eq: slug } } } });
      const userData = userRes.data.listUsers.items[0];
      if (!userData) { setLoading(false); return; }
      setProfile(userData);

      const [attRes, eventsRes] = await Promise.all([
        client.graphql({ query: listAttendances, variables: { filter: { userID: { eq: userData.id } } } }),
        client.graphql({ query: listEvents })
      ]);

      const myAtt = attRes.data.listAttendances.items;
      const allEvents = eventsRes.data.listEvents.items;

      const enrichedAttendance = myAtt.map(a => {
        const eventInfo = allEvents.find(e => e.id === a.eventID);
        return { ...a, event: eventInfo };
      });
      setAttendance(enrichedAttendance);
    } catch (err) { console.error("Error loading public passport:", err); } 
    finally { setLoading(false); }
  }

  if (loading) return <div style={centerStyle}>FETCHING_PUBLIC_RECORDS...</div>;
  if (!profile) return <div style={centerStyle}>[ ERROR 404: BUILDER_NOT_FOUND ]</div>;

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        
        {/* Header Strip */}
        <div style={{ backgroundColor: '#6B38FB', padding: '15px 25px', borderBottom: '4px solid black', textAlign: 'center' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '16px', fontWeight: '900', letterSpacing: '2px' }}>PUBLIC_PASSPORT_VIEW</h2>
        </div>

        <div style={{ padding: '30px' }}>
          
          {/* Identity Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px', textAlign: 'center' }}>
            <div style={{ border: '4px solid black', padding: '6px', backgroundColor: '#FF9900', boxShadow: '6px 6px 0px black', position: 'relative', marginBottom: '20px' }}>
              <img src={profile.avatar_url} style={{ width: '130px', height: '130px', display: 'block', backgroundColor: 'white', objectFit: 'cover' }} alt="Avatar" />
              <div style={screwStyle({top: '2px', left: '2px'})}></div><div style={screwStyle({top: '2px', right: '2px'})}></div>
              <div style={screwStyle({bottom: '2px', left: '2px'})}></div><div style={screwStyle({bottom: '2px', right: '2px'})}></div>
            </div>
            
            <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: '900', color: 'black', textTransform: 'uppercase' }}>
              {profile.full_name}
            </h1>
            <div style={{ display: 'inline-block', backgroundColor: 'black', color: '#FF9900', padding: '6px 14px', fontWeight: '900', fontSize: '14px', boxShadow: '4px 4px 0px rgba(0,0,0,0.2)', transform: 'rotate(-2deg)' }}>
              {profile.tier?.toUpperCase() || 'BEGINNER'} BUILDER
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'flex', border: '4px solid black', backgroundColor: '#f0f0f0', boxShadow: '6px 6px 0px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
            <div style={{ flex: 1, padding: '20px', textAlign: 'center', borderRight: '4px solid black', backgroundColor: 'white' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#6B38FB' }}>{profile.xp}</div>
              <div style={{ fontSize: '11px', fontWeight: '900', color: '#888', letterSpacing: '1px' }}>TOTAL_XP</div>
            </div>
            <div style={{ flex: 1, padding: '20px', textAlign: 'center', backgroundColor: 'white' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: 'black' }}>{attendance.length}</div>
              <div style={{ fontSize: '11px', fontWeight: '900', color: '#888', letterSpacing: '1px' }}>EVENTS_CLEARED</div>
            </div>
          </div>

          {/* Stamps List */}
          <div style={{ border: '4px solid black', padding: '20px', backgroundColor: 'white' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: '900', borderBottom: '3px solid black', paddingBottom: '10px' }}>ACTIVITY_LOG</h3>
            
            {attendance.length === 0 ? (
               <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#999', textAlign: 'center', padding: '10px 0' }}>NO_MISSIONS_LOGGED_YET</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {attendance.map(a => (
                  <div key={a.id} style={{ border: '3px solid black', padding: '8px 12px', fontSize: '12px', fontWeight: '900', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '3px 3px 0px rgba(0,0,0,0.1)' }}>
                    <span style={{ fontSize: '16px' }}>{a.event?.emoji}</span> {a.event?.name}
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

// STYLES
const containerStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', backgroundColor: '#f4f4f4', backgroundImage: 'radial-gradient(#d1d1d1 1px, transparent 1px)', backgroundSize: '20px 20px', color: 'black' };
const cardStyle = { width: '100%', maxWidth: '500px', backgroundColor: 'white', border: '4px solid black', boxShadow: '12px 12px 0px black', position: 'relative' };
const centerStyle = { textAlign: 'center', marginTop: '100px', fontWeight: '900', color: 'black', fontSize: '18px', letterSpacing: '1px' };
const screwStyle = (pos) => ({ position: 'absolute', ...pos, width: '5px', height: '5px', background: 'black', borderRadius: '50%' });