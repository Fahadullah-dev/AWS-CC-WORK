import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { listEvents, listUsers } from '../graphql/queries'; 
import { createEvent, deleteEvent, updateEvent } from '../graphql/mutations';

const CAPTAIN_EMAILS = [
  '34675845@student.murdoch.edu.au'
];

export default function Admin({ user }) {
  const client = generateClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('EVENTS');
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Event Form State
  const [form, setForm] = useState({ id: null, name: '', track: 'Compute', xp_reward: 150, unlocked_skills: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  // QR State
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrEvent, setQrEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const rotateRef = useRef(null);
  const countRef = useRef(null);

  const userEmail = user?.signInDetails?.loginId || '';
  const isCaptain = CAPTAIN_EMAILS.includes(userEmail);

  useEffect(() => {
    if (isCaptain) {
      fetchData();
    }
  }, [isCaptain]);

  async function fetchData() {
    setLoading(true);
    try {
      const [eventsRes, usersRes] = await Promise.all([
        client.graphql({ query: listEvents }),
        client.graphql({ query: listUsers })
      ]);
      setEvents(eventsRes.data.listEvents.items || []);
      setUsers(usersRes.data.listUsers.items || []);
    } catch (err) { console.error("Error fetching data", err); }
    setLoading(false);
  }

  // --- QR LOGIC ---
  useEffect(() => {
    if (!qrEvent) return;
    doGenerate(qrEvent);
    rotateRef.current = setInterval(() => { doGenerate(qrEvent); setTimeLeft(15); }, 15000);
    countRef.current = setInterval(() => { setTimeLeft(t => (t <= 1 ? 15 : t - 1)); }, 1000);
    return () => { clearInterval(rotateRef.current); clearInterval(countRef.current); };
  }, [qrEvent?.id]);

  async function doGenerate(event) {
    const token = JSON.stringify({ eventId: event.id, timestamp: Date.now() });
    try {
      const dataUrl = await QRCode.toDataURL(token, { width: 300, margin: 2, color: { dark: '#000000', light: '#FFFFFF' }});
      setQrDataUrl(dataUrl);
    } catch (err) { console.error("Error generating QR:", err); }
  }

  function openQR(event) { setQrEvent(event); setTimeLeft(15); }
  function closeQR() { clearInterval(rotateRef.current); clearInterval(countRef.current); setQrEvent(null); setQrDataUrl(''); }

  // --- EVENT MANAGEMENT LOGIC ---
  async function handleSaveEvent(e) {
    e.preventDefault();
    setProcessing(true);
    try {
      // Clean up the comma-separated skills into a neat array
      const skillsArray = form.unlocked_skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
      
      const input = { 
        name: form.name, track: form.track, xp_reward: form.xp_reward, 
        unlocked_skills: skillsArray 
      };

      if (isEditing) {
        await client.graphql({ query: updateEvent, variables: { input: { id: form.id, ...input } } });
      } else {
        await client.graphql({ query: createEvent, variables: { input } });
      }
      
      await fetchData();
      cancelEdit();
    } catch (err) { alert("Error saving event."); console.error(err); } 
    finally { setProcessing(false); }
  }

  async function handleDeleteEvent(id) {
    if(!window.confirm("WARNING: Deleting this event will remove it from the system forever. Proceed?")) return;
    setProcessing(true);
    try {
      await client.graphql({ query: deleteEvent, variables: { input: { id } } });
      await fetchData();
    } catch (err) { alert("Error deleting event."); }
    setProcessing(false);
  }

  function startEdit(event) {
    setForm({
      id: event.id, name: event.name, track: event.track, 
      xp_reward: event.xp_reward, 
      unlocked_skills: event.unlocked_skills ? event.unlocked_skills.join(', ') : ''
    });
    setIsEditing(true);
    window.scrollTo(0, 0);
  }

  function cancelEdit() {
    setForm({ id: null, name: '', track: 'Compute', xp_reward: 150, unlocked_skills: '' });
    setIsEditing(false);
  }

  if (!isCaptain) return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}><h2 style={{ margin: 0, fontWeight: '900' }}>[ ACCESS_DENIED ]</h2><button onClick={() => navigate('/')} style={miniBtnStyle}>❮ DASHBOARD</button></div>
        <div style={{ padding: '30px', fontWeight: 'bold' }}>UNAUTHORIZED_EMAIL: {userEmail}</div>
      </div>
    </div>
  );

  const sortedLeaderboard = [...users].sort((a, b) => (b.xp || 0) - (a.xp || 0));

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        
        <div style={headerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900', letterSpacing: '2px' }}>[ SYSTEM_ADMIN_OVERRIDE ]</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ background: '#FF9900', color: 'black', padding: '4px 10px', fontSize: '12px', fontWeight: '900', border: '2px solid black' }}>CAPTAIN</span>
              <button onClick={() => navigate('/')} style={miniBtnStyle}>
                <img src="/icons/camera.png" style={{ width: '10px', transform: 'rotate(180deg)', marginRight: '4px' }} alt="back" />
                DASHBOARD
              </button>
            </div>
          </div>
          <div style={{ fontSize: '11px', marginTop: '5px', fontWeight: 'bold' }}>TOTAL REGISTERED BUILDERS: {users.length}</div>
        </div>

        <div style={{ display: 'flex', borderBottom: '4px solid black' }}>
          {['EVENTS', 'ROSTER', 'LEADERBOARD'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ flex: 1, padding: '15px', fontWeight: '900', fontSize: '14px', cursor: 'pointer', backgroundColor: activeTab === tab ? 'white' : '#ddd', border: 'none', borderRight: '4px solid black', borderBottom: activeTab === tab ? 'none' : '4px solid black', color: 'black', outline: 'none' }}>
              {tab}
            </button>
          ))}
        </div>

        <div style={{ padding: '20px', overflowX: 'auto', color: 'black' }}>
          
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', fontWeight: '900' }}>SYNCING_WITH_DATABASES...</div>
          ) : (
            <>
              {/* --- EVENTS TAB --- */}
              {activeTab === 'EVENTS' && (
                <div>
                  <div style={{ border: '4px solid black', padding: '20px', backgroundColor: isEditing ? '#fff3e0' : '#f9f9f9', marginBottom: '30px', boxShadow: '6px 6px 0px black' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontWeight: '900', textTransform: 'uppercase' }}>
                      {isEditing ? 'EDIT_EVENT_PARAMETERS' : 'DEPLOY_NEW_EVENT'}
                    </h3>
                    <form onSubmit={handleSaveEvent} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <input placeholder="EVENT_NAME" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required style={inputStyle} />
                      
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <select value={form.track} onChange={e => setForm(f => ({ ...f, track: e.target.value }))} style={inputStyle}>
                          {['General', 'Compute', 'Networking', 'Security', 'AI/ML'].map(t => <option key={t}>{t}</option>)}
                        </select>
                        <input type="number" placeholder="XP_REWARD" value={form.xp_reward} onChange={e => setForm(f => ({ ...f, xp_reward: Number(e.target.value) }))} style={{ ...inputStyle, width: '150px' }} />
                      </div>
                      
                      {/* Multi-Skill input array */}
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: '900', display: 'block', marginBottom: '5px' }}>SKILLS_UNLOCKED (COMMA SEPARATED)</label>
                        <input placeholder="e.g. EC2 Basics, Lambda Lab, Containers 101" value={form.unlocked_skills} onChange={e => setForm(f => ({ ...f, unlocked_skills: e.target.value }))} style={inputStyle} />
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="submit" disabled={processing} style={{ ...protoBtn, backgroundColor: '#000', color: '#fff', flex: 2 }}>
                          {processing ? 'UPLOADING...' : isEditing ? 'UPDATE_EVENT' : 'INITIALIZE_EVENT'}
                        </button>
                        {isEditing && (
                          <button type="button" onClick={cancelEdit} style={{ ...protoBtn, backgroundColor: '#fff', color: '#000', flex: 1 }}>CANCEL</button>
                        )}
                      </div>
                    </form>
                  </div>

                  <h3 style={{ fontWeight: '900', textTransform: 'uppercase' }}>ACTIVE_EVENTS ({events.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {events.map(event => (
                      <div key={event.id} style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '15px', border: '3px solid black', boxShadow: '4px 4px 0px rgba(0,0,0,0.1)', flexWrap: 'wrap' }}>
                        <img src="/icons/event-default.png" style={{ width: '32px', marginRight: '15px' }} alt="Event" />
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <div style={{ fontWeight: '900', fontSize: '18px', textTransform: 'uppercase' }}>{event.name}</div>
                          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>{event.track} • {event.xp_reward} XP</div>
                          {event.unlocked_skills && event.unlocked_skills.length > 0 && (
                            <div style={{ fontSize: '10px', fontWeight: '900', color: '#FF9900', marginTop: '5px' }}>
                              UNLOCKS: {event.unlocked_skills.join(', ')}
                            </div>
                          )}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                          <button onClick={() => openQR(event)} style={{ border: '3px solid black', background: '#FF9900', color: 'black', padding: '8px 12px', fontWeight: '900', cursor: 'pointer' }}>PROJECTOR</button>
                          <button onClick={() => startEdit(event)} style={{ border: '3px solid black', background: 'white', color: 'black', padding: '8px 12px', fontWeight: '900', cursor: 'pointer' }}>EDIT</button>
                          <button onClick={() => handleDeleteEvent(event.id)} style={{ border: '3px solid black', background: '#ef4444', color: 'white', padding: '8px 12px', fontWeight: '900', cursor: 'pointer' }}>DEL</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- ROSTER TAB --- */}
              {activeTab === 'ROSTER' && (
                <table style={tableStyle}>
                  <thead><tr style={{ backgroundColor: '#FF9900', color: 'black' }}><th style={thStyle}>STUDENT_ID</th><th style={thStyle}>FULL_NAME</th><th style={thStyle}>EMAIL</th><th style={thStyle}>MAJORS</th><th style={thStyle}>INTAKE</th><th style={thStyle}>JOINED</th></tr></thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.id} style={{ backgroundColor: i % 2 === 0 ? 'white' : '#f9f9f9' }}>
                        <td style={tdStyle}>{u.member_id}</td><td style={tdStyle}><strong>{u.full_name}</strong></td><td style={tdStyle}>{u.email}</td><td style={tdStyle}>{u.major?.join(', ')}</td><td style={tdStyle}>{u.intake}</td><td style={tdStyle}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* --- LEADERBOARD TAB --- */}
              {activeTab === 'LEADERBOARD' && (
                <table style={tableStyle}>
                  <thead><tr style={{ backgroundColor: '#6B38FB', color: 'white' }}><th style={thStyle}>RANK</th><th style={thStyle}>BUILDER_NAME</th><th style={thStyle}>TIER</th><th style={thStyle}>CLOUD_XP</th></tr></thead>
                  <tbody>
                    {sortedLeaderboard.map((u, i) => (
                      <tr key={u.id} style={{ backgroundColor: i === 0 ? '#fff3e0' : i % 2 === 0 ? 'white' : '#f9f9f9' }}>
                        <td style={{ ...tdStyle, fontSize: '18px', fontWeight: '900', textAlign: 'center' }}>
                          {i === 0 ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}><img src="/icons/crown.png" style={{ width: '24px' }} alt="Rank 1" /> 1</span> : i + 1}
                        </td>
                        <td style={tdStyle}><strong>{u.full_name}</strong></td>
                        <td style={tdStyle}><span style={{ backgroundColor: 'black', color: '#FF9900', padding: '3px 8px', fontSize: '10px', fontWeight: 'bold' }}>{u.tier?.toUpperCase()}</span></td>
                        <td style={{ ...tdStyle, fontWeight: '900', color: '#6B38FB' }}>{u.xp} PT</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>

      {qrEvent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={closeQR}>
          <div style={{ background: 'white', padding: '30px', border: '6px solid black', boxShadow: '15px 15px 0px #FF9900', textAlign: 'center', width: '90%', maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
              <img src="/icons/event-default.png" style={{ width: '28px' }} alt="Event" />
              <div style={{ fontSize: '24px', fontWeight: '900', color: 'black', textTransform: 'uppercase' }}>{qrEvent.name}</div>
            </div>
            
            <div style={{ fontSize: '12px', color: '#dc2626', fontWeight: '900', marginBottom: '20px', letterSpacing: '1px' }}>ROTATING EVERY 15s • NO SCREENSHOTS</div>

            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR code" style={{ width: '100%', maxWidth: '280px', margin: '0 auto', display: 'block', border: '4px solid black', padding: '10px', backgroundColor: 'white' }} />
            ) : (
              <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: '900' }}>GENERATING_HASH...</div>
            )}

            <div style={{ marginTop: '20px', fontSize: '14px', fontWeight: '900', color: 'black' }}>
              REFRESHES IN {timeLeft}s
              <div style={{ height: '10px', border: '3px solid black', background: 'white', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${(timeLeft / 15) * 100}%`, height: '100%', background: '#6B38FB', transition: 'width 1s linear' }} />
              </div>
            </div>

            <button onClick={closeQR} style={{ ...protoBtn, width: '100%', marginTop: '25px', backgroundColor: 'black', color: 'white' }}>CLOSE_PROJECTOR</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MANDATORY STYLING VARIABLES (Do Not Delete) ──
const containerStyle = { minHeight: '100vh', padding: '40px 20px', color: 'black', backgroundColor: '#f4f4f4', backgroundImage: 'radial-gradient(#d1d1d1 1px, transparent 1px)', backgroundSize: '20px 20px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' };
const cardStyle = { width: '100%', maxWidth: '1000px', backgroundColor: 'white', border: '4px solid black', boxShadow: '12px 12px 0px black', overflow: 'hidden' };
const headerStyle = { backgroundColor: 'black', color: 'white', padding: '25px', borderBottom: '4px solid black', textAlign: 'left' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', border: '4px solid black' };
const thStyle = { padding: '12px', border: '3px solid black', textAlign: 'left', fontWeight: '900', fontSize: '12px', letterSpacing: '1px' };
const tdStyle = { padding: '12px', border: '2px solid black', fontSize: '13px', color: 'black' };
const inputStyle = { padding: '14px', border: '3px solid black', fontSize: '14px', fontWeight: '900', width: '100%', boxSizing: 'border-box', outline: 'none' };
const protoBtn = { padding: '14px', border: '4px solid black', fontWeight: '900', cursor: 'pointer', boxShadow: '4px 4px 0px black', fontSize: '14px', textTransform: 'uppercase' };
const miniBtnStyle = { border: '2px solid white', backgroundColor: 'transparent', color: 'white', padding: '6px 12px', fontSize: '12px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center' };