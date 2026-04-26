import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { listUsers, listAttendances, listEvents } from '../graphql/queries';

const client = generateClient();

export default function PublicPassport() {
  const { slug } = useParams(); // This gets the "public_slug" from the URL
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublicData();
  }, [slug]);

  async function loadPublicData() {
    try {
      // 1. Find the user by their public slug
      const userRes = await client.graphql({
        query: listUsers,
        variables: { filter: { public_slug: { eq: slug } } }
      });

      const userData = userRes.data.listUsers.items[0];
      if (!userData) { setLoading(false); return; }
      setProfile(userData);

      // 2. Fetch their stamps (attendances) and event details
      const [attRes, eventsRes] = await Promise.all([
        client.graphql({ query: listAttendances, variables: { filter: { userID: { eq: userData.id } } } }),
        client.graphql({ query: listEvents })
      ]);

      const myAtt = attRes.data.listAttendances.items;
      const allEvents = eventsRes.data.listEvents.items;

      // Link them together so we have emojis/names
      const enrichedAttendance = myAtt.map(a => {
        const eventInfo = allEvents.find(e => e.id === a.eventID);
        return { ...a, event: eventInfo };
      });

      setAttendance(enrichedAttendance);
    } catch (err) {
      console.error("Error loading public passport:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={centerStyle}>Loading cloud credentials...</div>;
  if (!profile) return <div style={centerStyle}>Passport not found. 🔍</div>;

  return (
    <div style={{ background: '#0b1120', minHeight: '100vh', padding: '40px 20px', color: 'white' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', background: '#1e293b', borderRadius: '16px', padding: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
        
        {/* Identity Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src={profile.avatar_url} style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #FF9900', marginBottom: '15px' }} />
          <h1 style={{ margin: 0, fontSize: '24px' }}>{profile.full_name}</h1>
          <div style={{ color: '#FF9900', fontWeight: 'bold', fontSize: '14px', marginTop: '5px' }}>{profile.tier} Tier</div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', justifyContent: 'space-around', background: '#0f172a', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{profile.xp}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>XP EARNED</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{attendance.length}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>EVENTS</div>
          </div>
        </div>

        {/* Stamps List */}
        <h3 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '15px' }}>LATEST ENTRIES</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {attendance.map(a => (
            <div key={a.id} style={{ background: '#334155', padding: '6px 12px', borderRadius: '20px', fontSize: '12px' }}>
              {a.event?.emoji} {a.event?.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const centerStyle = { textAlign: 'center', marginTop: '100px', color: '#94a3b8', fontFamily: 'sans-serif' };