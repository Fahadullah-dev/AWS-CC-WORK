import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { listEvents, listAttendances } from '../graphql/queries';

const SKILL_ICONS = { Compute: '/icons/compute.png', Networking: '/icons/network.png', Security: '/icons/security.png', 'AI/ML': '/icons/ai.png', General: '/icons/logo.svg' };

export default function SkillTree({ tracksToShow }) {
  const [loading, setLoading] = useState(true);
  const [availableSkills, setAvailableSkills] = useState({}); 
  const [unlockedSkillNames, setUnlockedSkillNames] = useState(new Set());

  useEffect(() => { fetchSkillProgress(); }, []);

  async function fetchSkillProgress() {
    try {
      const client = generateClient();
      const { userId } = await getCurrentUser();
      
      const [eventsRes, attRes] = await Promise.all([
        client.graphql({ query: listEvents }),
        client.graphql({ query: listAttendances, variables: { filter: { userID: { eq: userId } } } })
      ]);

      const allEvents = eventsRes.data.listEvents.items || [];
      const myAttendances = attRes.data.listAttendances.items || [];

      // Build the Open World Map
      const dynamicMap = { Compute: [], Networking: [], Security: [], 'AI/ML': [], General: [] };
      allEvents.forEach(e => {
        if (dynamicMap[e.track] && e.unlocked_skills) {
          e.unlocked_skills.forEach(skill => {
            const cleanSkill = skill.trim();
            if (cleanSkill && !dynamicMap[e.track].includes(cleanSkill)) dynamicMap[e.track].push(cleanSkill);
          });
        }
      });
      setAvailableSkills(dynamicMap);

      // Map Unlocked Skills
      const unlockedSet = new Set();
      myAttendances.forEach(att => {
        const eventInfo = allEvents.find(e => e.id === att.eventID);
        if (eventInfo && eventInfo.unlocked_skills) {
          eventInfo.unlocked_skills.forEach(skill => unlockedSet.add(skill.trim()));
        }
      });
      setUnlockedSkillNames(unlockedSet);

    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', fontWeight: '900', color: 'black' }}>GENERATING MAP...</div>;

  return (
    <div style={{ backgroundColor: 'white', padding: '25px', color: 'black', boxSizing: 'border-box' }}>
      <h2 style={{ marginTop: 0, fontWeight: '900', fontSize: '18px', borderBottom: '4px solid black', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/icons/logo.svg" alt="Cloud" style={{ height: '24px', objectFit: 'contain' }} />
          [ OPEN WORLD SKILLS ]
        </h2>
        
      {tracksToShow.map((trackName) => {
        const skillsInThisTrack = availableSkills[trackName] || [];
        if (skillsInThisTrack.length === 0) return null; 

        const unlockedCount = skillsInThisTrack.filter(s => unlockedSkillNames.has(s)).length;

        return (
          <div key={trackName} style={{ marginBottom: '40px', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={SKILL_ICONS[trackName] || '/icons/logo.svg'} alt={trackName} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '16px', textTransform: 'uppercase' }}>{trackName}</h3>
              </div>
              <span style={{ fontWeight: '900', fontSize: '10px', border: '2px solid black', padding: '4px 8px', backgroundColor: '#f0f0f0' }}>UNLOCKED: {unlockedCount}/{skillsInThisTrack.length}</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '15px', backgroundColor: '#fafafa', border: '2px dashed #ccc' }}>
              {skillsInThisTrack.map((skillName) => {
                const isUnlocked = unlockedSkillNames.has(skillName);
                return (
                  <div key={skillName} style={{ 
                    flex: '1 1 90px', minWidth: '90px', border: isUnlocked ? '3px solid black' : '2px dashed #aaa',
                    backgroundColor: isUnlocked ? '#FF9900' : 'white', padding: '12px 8px', textAlign: 'center',
                    boxShadow: isUnlocked ? '3px 3px 0px black' : 'none', transform: isUnlocked ? 'translate(-2px, -2px)' : 'none', transition: '0.2s'
                  }}>
                    {isUnlocked ? <img src="/icons/check.png" alt="done" style={{ width: '20px', marginBottom: '5px' }} /> : <div style={{ width: '20px', height: '20px', border: '2px solid #ccc', borderRadius: '50%', margin: '0 auto 5px auto' }} />}
                    <div style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', color: isUnlocked ? 'black' : '#888', wordWrap: 'break-word' }}>{skillName}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}