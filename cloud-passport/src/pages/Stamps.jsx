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

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', fontWeight: '900', color: 'black' }}>SYNCING_REWARDS...</div>;

  const coreStamps = stamps.filter(s => s.track !== 'General');
  const generalStamps = stamps.filter(s => s.track === 'General');

  const StampGrid = ({ data, title }) => (
    <div style={{ marginBottom: '30px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: '900', backgroundColor: 'black', color: 'white', display: 'inline-block', padding: '5px 15px', marginBottom: '15px' }}>{title}</h3>
      {data.length === 0 ? (
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#999' }}>NO_DATA_FOUND</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '15px' }}>
          {data.map(s => (
            <div key={s.id} style={{ border: s.collected ? '3px solid black' : '2px dashed #ccc', padding: '15px 5px', textAlign: 'center', backgroundColor: s.collected ? 'white' : '#f9f9f9', position: 'relative' }}>
              <img src={s.emoji || "/icons/event-default.png"} style={{ width: '45px', height: '45px', objectFit: 'contain', marginBottom: '10px', filter: s.collected ? 'none' : 'grayscale(1) opacity(0.2)' }} alt="stamp" />
              <div style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>{s.name}</div>
              {s.collected && (
                <div style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#FF9900', border: '2px solid black', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0px black' }}>
                  <img src="/icons/check.png" style={{ width: '12px' }} alt="check" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: '30px', backgroundColor: 'white', color: 'black' }}>
      <h2 style={{ borderBottom: '4px solid black', paddingBottom: '10px', marginTop: 0, fontWeight: '900' }}>[ STAMP_LOG ]</h2>
      <StampGrid data={coreStamps} title="CORE_TRACK_MISSIONS" />
      <StampGrid data={generalStamps} title="GENERAL_OPERATIONS (Hackathons, Speakers)" />
    </div>
  );
}