import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { listEvents, listAttendances } from '../graphql/queries';

const SKILL_ICONS = {
  Compute: '/icons/compute.png',
  Networking: '/icons/network.png',
  Security: '/icons/security.png',
  'AI/ML': '/icons/ai.png'
};

const SKILLS_DATA = {
  Compute: [
    { id: 1, label: 'EC2 Basics' }, { id: 2, label: 'Lambda Lab' }, { id: 3, label: 'Containers 101' }, { id: 4, label: 'EKS Workshop' }, { id: 5, label: 'Compute Master' }
  ],
  Networking: [
    { id: 1, label: 'VPC Basics' }, { id: 2, label: 'VPC Deep' }, { id: 3, label: 'Route 53' }, { id: 4, label: 'CloudFront' }, { id: 5, label: 'Net Master' }
  ],
  Security: [
    { id: 1, label: 'IAM Policy' }, { id: 2, label: 'KMS Encryption' }, { id: 3, label: 'WAF Setup' }, { id: 4, label: 'GuardDuty' }, { id: 5, label: 'Sec Master' }
  ],
  'AI/ML': [
    { id: 1, label: 'SageMaker' }, { id: 2, label: 'Bedrock AI' }, { id: 3, label: 'Rekognition' }, { id: 4, label: 'Lex Bots' }, { id: 5, label: 'AI Master' }
  ]
};

export default function SkillTree({ tracksToShow }) {
  const client = generateClient();
  // Keeps track of how many events the user attended in each category
  const [trackProgress, setTrackProgress] = useState({ Compute: 0, Networking: 0, Security: 0, 'AI/ML': 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSkillProgress(); }, []);

  async function fetchSkillProgress() {
    try {
      const { userId } = await getCurrentUser();
      
      const [eventsRes, attRes] = await Promise.all([
        client.graphql({ query: listEvents }),
        client.graphql({ query: listAttendances, variables: { filter: { userID: { eq: userId } } } })
      ]);

      const allEvents = eventsRes.data.listEvents.items || [];
      const myAttendances = attRes.data.listAttendances.items || [];

      // Calculate track levels
      const currentProgress = { Compute: 0, Networking: 0, Security: 0, 'AI/ML': 0 };

      myAttendances.forEach(att => {
        const event = allEvents.find(e => e.id === att.eventID);
        if (event) {
          // If event.track is "Compute,Security", it splits and increments both
          const tracks = event.track.split(','); 
          tracks.forEach(t => {
            if (currentProgress[t] !== undefined) currentProgress[t] += 1;
          });
        }
      });

      setTrackProgress(currentProgress);
    } catch (err) {
      console.error("Error fetching skill progress:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', fontWeight: '900', color: 'black' }}>CALCULATING_SKILL_NODES...</div>;

  return (
    <div style={{ backgroundColor: 'white', padding: '30px', color: 'black' }}>
      <h2 style={{ 
        marginTop: 0, fontWeight: '900', fontSize: '20px', 
        borderBottom: '4px solid black', paddingBottom: '15px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        [ SKILL_PATH_TERMINAL ]
        <span style={{ fontSize: '12px', backgroundColor: 'black', color: 'white', padding: '2px 10px' }}>
          MAP_V2.1
        </span>
      </h2>

      {tracksToShow.map((trackName) => {
        const level = trackProgress[trackName] || 0; // How many nodes are unlocked

        return (
          <div key={trackName} style={{ marginBottom: '60px', marginTop: '25px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={SKILL_ICONS[trackName]} alt={trackName} style={{ width: '32px', height: '32px', display: 'block' }} />
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '24px', textTransform: 'uppercase' }}>{trackName}</h3>
              </div>
              <span style={{ fontWeight: '900', fontSize: '11px', border: '3px solid black', padding: '4px 10px', backgroundColor: '#f0f0f0' }}>
                SYNC_STATUS: {Math.min(level, 5)}/5
              </span>
            </div>

            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 5px' }}>
              <div style={{ position: 'absolute', top: '25px', left: '0', right: '0', height: '8px', backgroundColor: 'black', zIndex: 1 }}></div>

              {SKILLS_DATA[trackName].map((skill, index) => {
                // Gamification Logic:
                // If index < level -> completed
                // If index === level -> available (next to unlock)
                // If index > level -> locked
                let nodeStatus = 'locked';
                if (index < level) nodeStatus = 'completed';
                else if (index === level) nodeStatus = 'available';

                return (
                  <div key={skill.id} style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '90px' }}>
                    <div style={{
                      width: '50px', height: '50px', margin: '0 auto', border: '4px solid black',
                      backgroundColor: nodeStatus === 'completed' ? '#FF9900' : nodeStatus === 'available' ? 'white' : '#ddd',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '18px',
                      boxShadow: nodeStatus === 'completed' ? '5px 5px 0px black' : 'none',
                      cursor: nodeStatus === 'locked' ? 'not-allowed' : 'pointer',
                      transform: nodeStatus === 'completed' ? 'translate(-2px, -2px)' : 'none',
                    }}>
                      {nodeStatus === 'completed' ? <img src="/icons/check.png" alt="done" style={{ width: '20px' }} /> : skill.id}
                    </div>

                    <div style={{ marginTop: '15px', fontSize: '10px', fontWeight: '900', lineHeight: '1.2', textTransform: 'uppercase', color: nodeStatus === 'locked' ? '#aaa' : 'black' }}>
                      {skill.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: '30px', padding: '20px', border: '3px dashed black', backgroundColor: '#fafafa', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '11px', fontWeight: '900', color: '#888', letterSpacing: '1px' }}>
          &gt;&gt; ACCESS SYSTEM LOGS AT WORKSHOPS TO DEPLOY NODES &lt;&lt;
        </p>
      </div>
    </div>
  );
}