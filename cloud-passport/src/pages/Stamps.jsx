import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { listEvents, listAttendances } from '../graphql/queries';

export default function Stamps() {
  const [stamps, setStamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStamps() {
      try {
        const client = generateClient();
        const { userId } = await getCurrentUser();
        const [eRes, aRes] = await Promise.all([
          client.graphql({ query: listEvents }),
          client.graphql({ query: listAttendances, variables: { filter: { userID: { eq: userId } } } })
        ]);

        const allEvents = eRes.data.listEvents.items;
        const myAtts = aRes.data.listAttendances.items;

        const merged = allEvents.map(event => ({
          ...event,
          collected: myAtts.some(a => a.eventID === event.id)
        }));
        setStamps(merged);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    loadStamps();
  }, []);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', fontWeight: '900', color: 'black' }}>SYNCING REWARDS...</div>;

  return (
    <div style={{ backgroundColor: 'white', padding: '25px', color: 'black', boxSizing: 'border-box' }}>
      <h2 style={{ marginTop: 0, fontWeight: '900', fontSize: '18px', borderBottom: '4px solid black', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/icons/logo.svg" alt="Cloud" style={{ height: '24px', objectFit: 'contain' }} />
          [ STAMP LOG ]
        </h2>

      <div style={{ marginBottom: '30px', marginTop: '20px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '900', backgroundColor: 'black', color: 'white', display: 'inline-block', padding: '5px 15px', marginBottom: '15px' }}>
          ALL MISSION BADGES
        </h3>
        
        {stamps.length === 0 ? (
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#999' }}>NO DATA FOUND</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px' }}>
            {stamps.map(s => (
              <div key={s.id} style={{ border: s.collected ? '3px solid black' : '2px dashed #ccc', padding: '10px 5px', textAlign: 'center', backgroundColor: s.collected ? 'white' : '#f9f9f9', position: 'relative' }}>
                <img src={s.emoji || "/icons/speaker.svg"} style={{ width: '35px', height: '35px', objectFit: 'contain', marginBottom: '8px', filter: s.collected ? 'none' : 'grayscale(1) opacity(0.2)' }} alt="stamp" />
                <div style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', wordWrap: 'break-word' }}>{s.name}</div>
                {s.collected && (
                  <div style={{ position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#FF9900', border: '2px solid black', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0px black' }}>
                    <img src="/icons/check.png" style={{ width: '10px' }} alt="check" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}