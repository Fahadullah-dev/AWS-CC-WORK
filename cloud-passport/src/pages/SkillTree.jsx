import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { listEvents, listAttendances } from '../graphql/queries';

const client = generateClient();

const ALL_TRACKS = [
  { name: 'Compute',    icon: '☁️',  color: '#FF9900', events: ['EC2 Basics', 'Lambda Lab', 'Containers 101', 'EKS Workshop', 'Compute Master'] },
  { name: 'Networking', icon: '🌐',  color: '#3B82F6', events: ['VPC Basics', 'VPC Deep Dive', 'Route 53 Lab', 'CloudFront CDN', 'Net Master'] },
  { name: 'Security',   icon: '🔐',  color: '#1D9E75', events: ['IAM Basics', 'SCPs & Policies', 'GuardDuty Lab', 'Shield WAF', 'Sec Master'] },
  { name: 'AI/ML',      icon: '🤖',  color: '#A855F7', events: ['AI/ML Intro', 'SageMaker Lab', 'Bedrock Workshop', 'AI Master'] },
];

export default function SkillTree({ tracksToShow }) {
  const [attendedEventNames, setAttendedEventNames] = useState([]);
  const visibleTracks = ALL_TRACKS.filter(t => tracksToShow.includes(t.name));

  useEffect(() => {
    fetchSkillData();
  }, []);

  async function fetchSkillData() {
    try {
      const { userId } = await getCurrentUser();
      
      // 1. Get all attendances for the user
      const attRes = await client.graphql({
        query: listAttendances,
        variables: { filter: { userID: { eq: userId } } }
      });
      const attendedIds = attRes.data.listAttendances.items.map(a => a.eventID);

      // 2. Get all events
      const eventsRes = await client.graphql({ query: listEvents });
      const allEvents = eventsRes.data.listEvents.items;

      // 3. Map attended IDs to their actual Event Names
      const names = attendedIds.map(id => {
        const found = allEvents.find(e => e.id === id);
        return found ? found.name : null;
      }).filter(Boolean);

      setAttendedEventNames(names);
    } catch (err) {
      console.error("Error fetching skill tree:", err);
    }
  }

  return (
    <div className="page-wrap" style={{ padding: '0px' }}>
      <div className="tracks">
        {visibleTracks.map(track => {
          const completed = track.events.filter(e => attendedEventNames.includes(e));
          const pct = Math.round((completed.length / track.events.length) * 100);
          
          return (
            <div key={track.name} style={{ marginBottom: '35px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '24px', marginRight: '10px' }}>{track.icon}</span>
                <span style={{ fontWeight: '900', color: '#0f172a', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {track.name}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>
                  {completed.length}/{track.events.length}
                </span>
              </div>

              <div style={{ background: '#f1f5f9', borderRadius: '99px', height: '8px', marginBottom: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, background: track.color, height: '100%', borderRadius: '99px', transition: 'width 0.5s ease' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                {track.events.map((evt, i) => {
                  const done = attendedEventNames.includes(evt);
                  
                  return (
                    <div key={evt} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                      {i > 0 && (
                        <div style={{ position: 'absolute', top: '15px', left: '-50%', right: '50%', height: '2px', background: done ? track.color : '#e2e8f0', zIndex: 1 }} />
                      )}
                      
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        border: `2px solid ${done ? track.color : '#cbd5e1'}`,
                        background: done ? `${track.color}15` : '#ffffff',
                        color: done ? track.color : '#cbd5e1',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: '900', zIndex: 2,
                        boxShadow: done ? `0 0 10px ${track.color}30` : 'none'
                      }}>
                        {done ? '✓' : i + 1}
                      </div>
                      
                      <div style={{ fontSize: '10px', color: done ? '#0f172a' : '#94a3b8', marginTop: '8px', textAlign: 'center', fontWeight: done ? '800' : '600', lineHeight: '1.2' }}>
                        {evt.split(' ').slice(0, 2).join(' ')}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {pct === 100 && (
                <div style={{ marginTop: '15px', textAlign: 'center', color: track.color, fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}>
                  🏆 {track.name} Mastery Complete
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}