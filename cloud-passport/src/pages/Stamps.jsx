// src/pages/Stamps.jsx
import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { listEvents, listAttendances } from '../graphql/queries';

export default function Stamps() {
  const client = generateClient();
  const [stamps, setStamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStamps() {
      try {
        const { userId } = await getCurrentUser();
        const [eRes, aRes] = await Promise.all([
          client.graphql({ query: listEvents }),
          client.graphql({ query: listAttendances, variables: { filter: { userID: { eq: userId } } } })
        ]);

        const allEvents = eRes.data.listEvents.items;
        const myAtts = aRes.data.listAttendances.items;

        const merged = allEvents.map(event => ({
          ...event,
          collected: myAtts.some(a => a.eventID === event.id),
          date: myAtts.find(a => a.eventID === event.id)?.createdAt || '--/--/--'
        }));
        setStamps(merged);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    loadStamps();
  }, []);

  if (loading) return <div>SYNCING_REWARDS...</div>;

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ borderBottom: '4px solid black', paddingBottom: '10px' }}>[ STAMP_LOG ]</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '20px' }}>
        {stamps.map(s => (
          <div key={s.id} style={{ border: s.collected ? '3px solid black' : '2px dashed #ccc', padding: '10px', textAlign: 'center' }}>
            <img src="/icons/event-default.png" style={{ width: '40px', filter: s.collected ? 'none' : 'grayscale(1)' }} />
            <div style={{ fontSize: '10px', fontWeight: '900' }}>{s.name}</div>
            {s.collected && <img src="/icons/check.png" style={{ width: '15px' }} />}
          </div>
        ))}
      </div>
    </div>
  );
}