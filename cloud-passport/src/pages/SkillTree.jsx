import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { listEvents, listAttendances } from '../graphql/queries';

const SKILL_ICONS = { Compute: '/icons/compute.png', Networking: '/icons/network.png', Security: '/icons/security.png', 'AI/ML': '/icons/ai.png' };

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

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', fontWeight: '900', color: 'black' }}>GENERATING_MAP...</div>;

  return (
    <div style={{ backgroundColor: 'white', padding: '30px', color: 'black' }}>
      <h2 style={{ marginTop: 0, fontWeight: '900', fontSize: '20px', borderBottom: '4px solid black', paddingBottom: '15px' }}>[ OPEN_WORLD_SKILLS ]</h2>

      {tracksToShow.map((trackName) => {
        const skillsInThisTrack = availableSkills[trackName] || [];
        if (skillsInThisTrack.length === 0) return null; 

        const unlockedCount = skillsInThisTrack.filter(s => unlockedSkillNames.has(s)).length;

        return (
          <div key={trackName} style={{ marginBottom: '50px', marginTop: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={SKILL_ICONS[trackName] || '/icons/cloud-icon.png'} alt={trackName} style={{ width: '32px', height: '32px' }} />
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '20px', textTransform: 'uppercase' }}>{trackName}</h3>
              </div>
              <span style={{ fontWeight: '900', fontSize: '11px', border: '3px solid black', padding: '4px 10px', backgroundColor: '#f0f0f0' }}>UNLOCKED: {unlockedCount}/{skillsInThisTrack.length}</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '15px', backgroundColor: '#fafafa', border: '2px dashed #ccc' }}>
              {skillsInThisTrack.map((skillName) => {
                const isUnlocked = unlockedSkillNames.has(skillName);
                return (
                  <div key={skillName} style={{ 
                    flex: '1 1 100px', minWidth: '100px', border: isUnlocked ? '3px solid black' : '2px dashed #aaa',
                    backgroundColor: isUnlocked ? '#FF9900' : 'white', padding: '15px 10px', textAlign: 'center',
                    boxShadow: isUnlocked ? '4px 4px 0px black' : 'none', transform: isUnlocked ? 'translate(-2px, -2px)' : 'none', transition: '0.2s'
                  }}>
                    {isUnlocked ? <img src="/icons/check.png" alt="done" style={{ width: '24px', marginBottom: '5px' }} /> : <div style={{ width: '24px', height: '24px', border: '2px solid #ccc', borderRadius: '50%', margin: '0 auto 5px auto' }} />}
                    <div style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: isUnlocked ? 'black' : '#888' }}>{skillName}</div>
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