import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { generateClient } from 'aws-amplify/api';
import { listEvents } from '../graphql/queries';
import { createEvent } from '../graphql/mutations';

// Initialize the AWS GraphQL Client
const client = generateClient();

const CAPTAIN_EMAILS = [
  '34675845@student.murdoch.edu.au', // ← replace with real captain email
  '35044384@student.murdoch.edu.au'
];

export default function Admin({ user }) {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ name: '', track: 'General', xp_reward: 150, emoji: '☁️' });
  const [creating, setCreating] = useState(false);
  
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrEvent, setQrEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);

  const rotateRef = useRef(null);
  const countRef = useRef(null);

  // Extract email from AWS Cognito user object
  const userEmail = user?.signInDetails?.loginId || '';
  const isCaptain = CAPTAIN_EMAILS.includes(userEmail);

  // ── Fetch Events from DynamoDB ──
  useEffect(() => {
    if (isCaptain) fetchEvents();
  }, [isCaptain]);

  async function fetchEvents() {
    try {
      const res = await client.graphql({ query: listEvents });
      // DynamoDB returns arrays inside `items`
      setEvents(res.data.listEvents.items || []);
    } catch (err) {
      console.error("Error fetching events", err);
    }
  }

  // ── Auto-rotate QR every 15 seconds while modal open ──
  useEffect(() => {
    if (!qrEvent) return;

    doGenerate(qrEvent);

    rotateRef.current = setInterval(() => {
      doGenerate(qrEvent);
      setTimeLeft(15);
    }, 15000);

    countRef.current = setInterval(() => {
      setTimeLeft(t => (t <= 1 ? 15 : t - 1));
    }, 1000);

    return () => {
      clearInterval(rotateRef.current);
      clearInterval(countRef.current);
    };
  }, [qrEvent?.id]);

  async function doGenerate(event) {
    // We generate a JSON string containing the Event ID and current time.
    // Checkin.jsx will read this and ensure it's not older than 15 seconds!
    const token = JSON.stringify({ 
      eventId: event.id, 
      timestamp: Date.now() 
    });

    try {
      const dataUrl = await QRCode.toDataURL(token, {
        width: 300, margin: 2,
        color: { dark: '#0D1321', light: '#FFFFFF' }
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error("Error generating QR:", err);
    }
  }

  function openQR(event) {
    setQrEvent(event);
    setTimeLeft(15);
  }

  function closeQR() {
    clearInterval(rotateRef.current);
    clearInterval(countRef.current);
    setQrEvent(null);
    setQrDataUrl('');
  }

  if (!isCaptain) return (
    <div className="page-wrap">
      <div className="page-header"><h2 style={{ color: '#0f172a', fontWeight: '900' }}>Admin</h2></div>
      <div className="muted">Only captains can access this. Your email ({userEmail}) is not authorized.</div>
    </div>
  );

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    try {
      // Save directly to AWS DynamoDB using the GraphQL Mutation
      await client.graphql({
        query: createEvent,
        variables: { 
          input: {
            name: form.name,
            track: form.track,
            xp_reward: form.xp_reward,
            emoji: form.emoji
          } 
        }
      });
      
      await fetchEvents();
      setForm({ name: '', track: 'General', xp_reward: 150, emoji: '☁️' });
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Error creating event. Check console.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="page-wrap" style={{ color: '#0f172a' }}>
      <div className="page-header">
        <h2 style={{ color: '#0f172a', fontWeight: '900' }}>admin panel</h2>
        <span className="badge-captain" style={{ background: '#FF9900', color: '#111', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>captain</span>
      </div>

      {/* create event form */}
      <div className="admin-section" style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 15px 0' }}>create event</h3>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input placeholder="Event Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required style={inputStyle} />
            <input placeholder="Emoji (☁️)" value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} style={{ ...inputStyle, width: '80px' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select value={form.track} onChange={e => setForm(f => ({ ...f, track: e.target.value }))} style={inputStyle}>
              {['General', 'Compute', 'Networking', 'Security', 'AI/ML'].map(t => <option key={t}>{t}</option>)}
            </select>
            <input type="number" placeholder="XP reward" value={form.xp_reward} onChange={e => setForm(f => ({ ...f, xp_reward: Number(e.target.value) }))} style={{ ...inputStyle, width: '100px' }} />
          </div>
          <button type="submit" disabled={creating} style={{ background: '#0f172a', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
            {creating ? 'Saving to AWS...' : 'Create Event'}
          </button>
        </form>
      </div>

      {/* events list */}
      <div className="admin-section">
        <h3>events ({events.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {events.map(event => (
            <div key={event.id} style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '24px', marginRight: '15px' }}>{event.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{event.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{event.track} · {event.xp_reward} XP</div>
              </div>
              <button onClick={() => openQR(event)} style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                📷 Show QR
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* rotating QR modal */}
      {qrEvent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={closeQR}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', textAlign: 'center', width: '90%', maxWidth: '350px' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '5px' }}>{qrEvent.emoji} {qrEvent.name}</div>
            <div style={{ fontSize: '12px', color: '#dc2626', fontWeight: 'bold', marginBottom: '20px' }}>ROTATING EVERY 15s · NO SCREENSHOTS</div>

            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR code" style={{ width: '100%', maxWidth: '250px', margin: '0 auto', display: 'block', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            ) : (
              <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Generating via AWS...</div>
            )}

            {/* countdown bar */}
            <div style={{ marginTop: '20px', fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>
              Refreshes in {timeLeft}s
              <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '10px', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${(timeLeft / 15) * 100}%`, height: '100%', background: '#FF9900', transition: 'width 1s linear' }} />
              </div>
            </div>

            <button onClick={closeQR} style={{ background: '#0f172a', color: 'white', width: '100%', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '25px', cursor: 'pointer' }}>Close Modal</button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', width: '100%', boxSizing: 'border-box' };