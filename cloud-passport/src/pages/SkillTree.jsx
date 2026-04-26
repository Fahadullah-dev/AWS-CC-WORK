import React from 'react';

const SKILL_ICONS = {
  Compute: 'https://img.icons8.com/?size=100&id=46757&format=png&color=000000',
  Networking: 'https://img.icons8.com/?size=100&id=46698&format=png&color=000000',
  Security: 'https://img.icons8.com/?size=100&id=46732&format=png&color=000000',
  'AI/ML': 'https://img.icons8.com/?size=100&id=103790&format=png&color=000000'
};

const SKILLS_DATA = {
  Compute: [
    { id: 1, label: 'EC2 Basics', status: 'completed' },
    { id: 2, label: 'Lambda Lab', status: 'available' },
    { id: 3, label: 'Containers 101', status: 'locked' },
    { id: 4, label: 'EKS Workshop', status: 'locked' },
    { id: 5, label: 'Compute Master', status: 'locked' },
  ],
  Networking: [
    { id: 1, label: 'VPC Basics', status: 'completed' },
    { id: 2, label: 'VPC Deep', status: 'locked' },
    { id: 3, label: 'Route 53', status: 'locked' },
    { id: 4, label: 'CloudFront', status: 'locked' },
    { id: 5, label: 'Net Master', status: 'locked' },
  ],
  Security: [
    { id: 1, label: 'IAM Policy', status: 'locked' },
    { id: 2, label: 'KMS Encryption', status: 'locked' },
    { id: 3, label: 'WAF Setup', status: 'locked' },
    { id: 4, label: 'GuardDuty', status: 'locked' },
    { id: 5, label: 'Sec Master', status: 'locked' },
  ],
  'AI/ML': [
    { id: 1, label: 'SageMaker', status: 'locked' },
    { id: 2, label: 'Bedrock AI', status: 'locked' },
    { id: 3, label: 'Rekognition', status: 'locked' },
    { id: 4, label: 'Lex Bots', status: 'locked' },
    { id: 5, label: 'AI Master', status: 'locked' },
  ]
};

export default function SkillTree({ tracksToShow }) {
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

      {tracksToShow.map((trackName) => (
        <div key={trackName} style={{ marginBottom: '60px', marginTop: '25px' }}>
          
          {/* Track Header with Custom Icons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src={SKILL_ICONS[trackName]} 
                alt={trackName} 
                style={{ width: '32px', height: '32px', display: 'block' }} 
              />
              <h3 style={{ margin: 0, fontWeight: '900', fontSize: '24px', textTransform: 'uppercase' }}>
                {trackName}
              </h3>
            </div>
            <span style={{ fontWeight: '900', fontSize: '11px', border: '3px solid black', padding: '4px 10px', backgroundColor: '#f0f0f0' }}>
              SYNC_STATUS: 1/5
            </span>
          </div>

          {/* The Path Container */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 5px' }}>
            
            {/* The Thick Connecting Pipe */}
            <div style={{ 
              position: 'absolute', top: '25px', left: '0', right: '0', 
              height: '8px', backgroundColor: 'black',
              zIndex: 1
            }}></div>

            {SKILLS_DATA[trackName].map((skill) => (
              <div key={skill.id} style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '90px' }}>
                
                {/* Skill Node */}
                <div style={{
                  width: '50px', height: '50px', margin: '0 auto',
                  border: '4px solid black',
                  backgroundColor: skill.status === 'completed' ? '#FF9900' : skill.status === 'available' ? 'white' : '#ddd',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '900', fontSize: '18px',
                  boxShadow: skill.status === 'completed' ? '5px 5px 0px black' : 'none',
                  cursor: skill.status === 'locked' ? 'not-allowed' : 'pointer',
                  transform: skill.status === 'completed' ? 'translate(-2px, -2px)' : 'none',
                }}>
                  {skill.status === 'completed' ? '✓' : skill.id}
                </div>

                {/* Skill Label */}
                <div style={{ 
                  marginTop: '15px', fontSize: '10px', fontWeight: '900', 
                  lineHeight: '1.2', textTransform: 'uppercase',
                  color: skill.status === 'locked' ? '#aaa' : 'black'
                }}>
                  {skill.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ 
        marginTop: '30px', padding: '20px', border: '3px dashed black', 
        backgroundColor: '#fafafa', textAlign: 'center' 
      }}>
        <p style={{ margin: 0, fontSize: '11px', fontWeight: '900', color: '#888', letterSpacing: '1px' }}>
          &gt;&gt; ACCESS SYSTEM LOGS AT WORKSHOPS TO DEPLOY NODES &lt;&lt;
        </p>
      </div>
    </div>
  );
}