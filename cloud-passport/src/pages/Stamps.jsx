import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { listEvents, listAttendances } from '../graphql/queries';

const client = generateClient();

const TRACK_COLORS = {
  Compute:    { bg: 'rgba(255,153,0,0.1)',  border: 'rgba(255,153,0,0.4)',  text: '#C87000' },
  Networking: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.4)', text: '#2563EB' },
  Security:   { bg: 'rgba(29,158,117,0.1)', border: 'rgba(29,158,117,0.4)', text: '#0F6E56' },
  'AI/ML':    { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.4)', text: '#7C3AED' },
  General:    { bg: 'rgba(136,135,128,0.1)',border: 'rgba(136,135,128,0.4)',text: '#5F5E5A' },
};

export default function Stamps() {
  const [attendedEventIds, setAttendedEventIds] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStampsData();
  }, []);

  async function fetchStampsData() {
    try {
      const { userId } = await getCurrentUser();
      
      // Fetch all events
      const eventsRes = await client.graphql({ query: listEvents });
      setEvents(eventsRes.data.listEvents.items || []);

      // Fetch user's attendances
      const attendancesRes = await client.graphql({
        query: listAttendances,
        variables: { filter: { userID: { eq: userId } } }
      });
      
      const ids = (attendancesRes.data.listAttendances.items || []).map(a => a.eventID);
      setAttendedEventIds(ids);
    } catch (err) {
      console.error("Error fetching stamps:", err);
    } finally {
      setLoading(false);
    }
  }

  const earnedCount = events.filter(e => attendedEventIds.includes(e.id)).length;

  if (loading) return <div style={{ color: '#64748b', textAlign: 'center', marginTop: '20px' }}>Loading stamps...</div>;

  return (
    <div className="page-wrap" style={{ color: '#0f172a' }}>
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#0f172a', fontWeight: '900', marginTop: 0, marginBottom: '5px' }}>Visa Stamps</h2>
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>{earnedCount} / {events.length} EARNED</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '15px' }}>
        {events.map(event => {
          const earned = attendedEventIds.includes(event.id);
          const colors = TRACK_COLORS[event.track] || TRACK_COLORS.General;
          
          return (
            <div
              key={event.id}
              style={{
                background: earned ? colors.bg : 'transparent',
                border: earned ? `2px solid ${colors.border}` : '1px dashed #cbd5e1',
                borderRadius: '8px',
                padding: '15px 10px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '30px', opacity: earned ? 1 : 0.2, marginBottom: '8px' }}>
                {event.emoji}
              </div>
              <div style={{ color: earned ? colors.text : '#94a3b8', fontSize: '11px', fontWeight: 'bold', lineHeight: '1.2' }}>
                {event.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}