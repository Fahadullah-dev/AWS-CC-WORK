import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { signOut } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { listEvents, listAttendances } from '../graphql/queries'; 
import { createEvent, deleteEvent, updateEvent, deleteUser as deleteDBUser } from '../graphql/mutations';
import Passport from './Passport';

const CAPTAIN_EMAILS = ['34675845@student.murdoch.edu.au'];

const CUSTOM_LIST_USERS = `
  query ListUsers {
    listUsers(limit: 1000) {
      items {
        id full_name email major intake member_id xp tier createdAt archives
      }
    }
  }
`;
const CUSTOM_UPDATE_USER = `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) { id archives }
  }
`;
const RAW_DELETE_ATTENDANCE = `
  mutation DeleteAttendance($input: DeleteAttendanceInput!) {
    deleteAttendance(input: $input) { id }
  }
`;

export default function Admin({ user }) {
  const [activeTab, setActiveTab] = useState('IDENTITY');
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({ member_id: '', full_name: '', email: '', major: '', intake: '', attendance: '', joined: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'joined', direction: 'descending' });
  const [form, setForm] = useState({ id: null, name: '', track: 'Compute', xp_reward: 150, unlocked_skills: '', emoji: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const [pointsToAdd, setPointsToAdd] = useState(100);
  const [resetTrimesterName, setResetTrimesterName] = useState('');

  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrEvent, setQrEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const rotateRef = useRef(null);
  const countRef = useRef(null);

  const userEmail = user?.signInDetails?.loginId || '';
  const isGroupLeader = CAPTAIN_EMAILS.includes(userEmail);

  useEffect(() => { if (isGroupLeader) fetchData(); }, [isGroupLeader]);

  async function fetchData() {
    setLoading(true);
    try {
      const client = generateClient();
      const [eventsRes, usersRes, attRes] = await Promise.all([
        client.graphql({ query: listEvents }),
        client.graphql({ query: CUSTOM_LIST_USERS }),
        client.graphql({ query: listAttendances, variables: { limit: 10000 } })
      ]);
      setEvents(eventsRes.data.listEvents.items || []);
      setUsers(usersRes.data.listUsers.items || []);
      setAttendances(attRes.data.listAttendances.items || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  // --- FULL ARCHIVE & RESET ENGINE ---
  async function handleResetAllXP() {
    if(!resetTrimesterName) return alert("SYSTEM HALTED: Enter a Trimester Name (e.g. 'Jan 2026') to store the archive before resetting.");
    if(!window.confirm(`⚠️ EXTREME DANGER: Did you download the CSV export first? This will archive all records as "${resetTrimesterName}" and WIPE all current XP and Stamps to 0.`)) return;
    if(!window.confirm("🚨 CRITICAL OVERRIDE: Are you ABSOLUTELY sure? This cannot be undone.")) return;
    
    setProcessing(true);
    try {
      const client = generateClient();

      // 1. Snapshot and Update Users
      for (const u of users) {
        const userAtts = attendances.filter(a => a.userID === u.id);
        
        let totalSkills = new Set();
        const pastStamps = userAtts.map(a => {
            const ev = events.find(e => e.id === a.eventID);
            if(ev?.unlocked_skills) ev.unlocked_skills.forEach(s => totalSkills.add(s.trim()));
            return { name: ev?.name || 'Unknown', emoji: ev?.emoji || '', date: a.createdAt };
        });

        const currentArchives = u.archives ? JSON.parse(u.archives) : [];
        currentArchives.push({
            trimester: resetTrimesterName,
            xp: u.xp || 0,
            tier: u.tier || 'EXPLORER',
            eventsCount: userAtts.length,
            skillsCount: totalSkills.size,
            stamps: pastStamps
        });

        await client.graphql({
            query: CUSTOM_UPDATE_USER,
            variables: { 
              input: { 
                id: u.id, 
                xp: 0, 
                tier: "EXPLORER", 
                archives: JSON.stringify(currentArchives) 
              } 
            }
        });
      }

      // 2. Wipe all Attendances
      for (const a of attendances) {
        await client.graphql({ query: RAW_DELETE_ATTENDANCE, variables: { input: { id: a.id } } });
      }

      // 3. WIPE ALL EVENTS (This clears the Stamp Board for everyone!)
      for (const e of events) {
        await client.graphql({ query: deleteEvent, variables: { input: { id: e.id } } });
      }

      alert(`SUCCESS: System completely wiped. Trimester [${resetTrimesterName}] safely archived in the cloud.`);
      setResetTrimesterName('');
      await fetchData();
    } catch (err) { 
      alert("ERROR: System reset sequence failed mid-execution."); 
      console.error(err); 
    }
    setProcessing(false);
  }

  const downloadCSV = () => {
    const headers = "STUDENT ID,FULL NAME,EMAIL,MAJORS,INTAKE,JOINED,ATTENDANCE COUNT,TOTAL XP\n";
    const rows = processedRoster.map(u => {
      const userAtts = attendances.filter(a => a.userID === u.id).length;
      const safeAttendance = `${userAtts} of ${events.length}`; 
      return `${u.member_id},"${u.full_name}",${u.email},"${u.major?.join(' + ')}",${u.intake},${new Date(u.createdAt).toLocaleDateString()},"${safeAttendance}",${u.xp || 0}`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AWS_Student_Builder_Group_Roster_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  const handleStampUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 150;
        let width = img.width; let height = img.height;
        if (width > height) { if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } } else { if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        setForm(f => ({...f, emoji: canvas.toDataURL('image/png', 0.8)}));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  async function handleSaveEvent(e) {
    e.preventDefault();
    setProcessing(true);
    try {
      const client = generateClient();
      const skillsArray = form.unlocked_skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
      const input = { name: form.name, track: form.track, xp_reward: form.xp_reward, unlocked_skills: skillsArray, emoji: form.emoji || '' };
      if (isEditing) await client.graphql({ query: updateEvent, variables: { input: { id: form.id, ...input } } });
      else await client.graphql({ query: createEvent, variables: { input } });
      await fetchData(); cancelEdit();
    } catch (err) { alert("Error saving event."); console.error(err); } 
    finally { setProcessing(false); }
  }

  async function handleDeleteEvent(id) {
    if(!window.confirm("WARNING: Proceed?")) return;
    setProcessing(true);
    try {
      const client = generateClient();
      await client.graphql({ query: deleteEvent, variables: { input: { id } } });
      await fetchData();
    } catch (err) { alert("Error deleting event."); }
    setProcessing(false);
  }

  async function handleDeleteUser(userId, userName) {
    if(!window.confirm(`WARNING: Permanently delete the profile for [${userName}]?`)) return;
    setProcessing(true);
    try {
      const client = generateClient();
      await client.graphql({ query: deleteDBUser, variables: { input: { id: userId } } });
      await fetchData(); 
    } catch (err) { alert("Error deleting builder profile."); console.error(err); }
    setProcessing(false);
  }

  async function addXpManually(targetUser) {
    if(!pointsToAdd || pointsToAdd <= 0) return alert("ENTER A VALID XP AMOUNT");
    setProcessing(true);
    try {
      const client = generateClient();
      const newXp = (targetUser.xp || 0) + parseInt(pointsToAdd);
      let newTier = "EXPLORER";
      if (newXp >= 1200) newTier = "BUILDER";
      if (newXp >= 2600) newTier = "ARCHITECT";
      if (newXp >= 4000) newTier = "MASTER";

      await client.graphql({ query: CUSTOM_UPDATE_USER, variables: { input: { id: targetUser.id, xp: newXp, tier: newTier } } });
      alert(`SUCCESS: Added ${pointsToAdd} XP to ${targetUser.full_name}`);
      await fetchData();
    } catch (err) { alert("OVERRIDE FAILED."); } finally { setProcessing(false); }
  }

  function startEdit(event) {
    setForm({ id: event.id, name: event.name, track: event.track, xp_reward: event.xp_reward, unlocked_skills: event.unlocked_skills ? event.unlocked_skills.join(', ') : '', emoji: event.emoji || '' });
    setIsEditing(true); window.scrollTo(0, 0);
  }

  function cancelEdit() {
    setForm({ id: null, name: '', track: 'Compute', xp_reward: 150, unlocked_skills: '', emoji: '' });
    setIsEditing(false);
  }

  useEffect(() => {
    if (!qrEvent) return;
    doGenerate(qrEvent);
    rotateRef.current = setInterval(() => { doGenerate(qrEvent); setTimeLeft(15); }, 15000);
    countRef.current = setInterval(() => { setTimeLeft(t => (t <= 1 ? 15 : t - 1)); }, 1000);
    return () => { clearInterval(rotateRef.current); clearInterval(countRef.current); };
  }, [qrEvent?.id]);

  async function doGenerate(event) {
    try {
      const token = JSON.stringify({ eventId: event.id, timestamp: Date.now() });
      const dataUrl = await QRCode.toDataURL(token, { width: 300, margin: 2, color: { dark: '#000000', light: '#FFFFFF' }});
      setQrDataUrl(dataUrl);
    } catch (err) { console.error(err); }
  }

  function openQR(event) { setQrEvent(event); setTimeLeft(15); }
  function closeQR() { clearInterval(rotateRef.current); clearInterval(countRef.current); setQrEvent(null); setQrDataUrl(''); }

  const handleFilterChange = (e, column) => { setFilters(prev => ({ ...prev, [column]: e.target.value })); };
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
    setSortConfig({ key, direction });
  };
  const getSortIndicator = (key) => { if (sortConfig.key === key) return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'; return ' ↕'; };

  const uniqueIntakes = [...new Set(users.map(u => u.intake))].filter(Boolean);
  const uniqueMajors = [...new Set(users.flatMap(u => u.major || []))].filter(Boolean);

  const filteredUsers = users.filter(u => {
    const userAtts = attendances.filter(a => a.userID === u.id).length;
    const attString = `${userAtts}/${events.length}`;
    const joinedString = new Date(u.createdAt).toLocaleDateString();
    const matchMajor = filters.major ? (u.major || []).includes(filters.major) : true;
    const matchIntake = filters.intake ? u.intake === filters.intake : true;

    return (
      (u.member_id || '').toLowerCase().includes(filters.member_id.toLowerCase()) &&
      (u.full_name || '').toLowerCase().includes(filters.full_name.toLowerCase()) &&
      (u.email || '').toLowerCase().includes(filters.email.toLowerCase()) &&
      matchMajor && matchIntake && attString.includes(filters.attendance) && joinedString.includes(filters.joined)
    );
  });

  const processedRoster = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aVal = a[sortConfig.key]; let bVal = b[sortConfig.key];

    if (sortConfig.key === 'attendance') { aVal = attendances.filter(att => att.userID === a.id).length; bVal = attendances.filter(att => att.userID === b.id).length; } 
    else if (sortConfig.key === 'major') { aVal = a.major?.join(', ') || ''; bVal = b.major?.join(', ') || ''; } 
    else if (sortConfig.key === 'joined') { aVal = new Date(a.createdAt).getTime(); bVal = new Date(b.createdAt).getTime(); } 
    else { aVal = aVal || ''; bVal = bVal || ''; }

    if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  if (!isGroupLeader) return <div style={containerStyle}>ACCESS DENIED</div>;
  const sortedLeaderboard = [...users].sort((a, b) => (b.xp || 0) - (a.xp || 0));

  const adminTabs = [
    { id: 'IDENTITY', color: '#9b68f6' },
    { id: 'EVENTS', color: '#3ea1f3' },
    { id: 'ROSTER', color: '#00e87f' },
    { id: 'LEADERBOARD', color: '#ff9900' },
    { id: 'MANUAL XP', color: '#ff57f6' }
  ];

  return (
    <div style={containerStyle}>
      <img src="/icons/logo2.png" alt="AWS Student Builder Group" style={{ height: '90px', marginBottom: '25px', objectFit: 'contain', maxWidth: '100%' }} />
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '800px', width: '100%' }}>
        {adminTabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ 
              padding: '8px 12px', border: '2px solid white', 
              backgroundColor: activeTab === t.id ? t.color : 'white', 
              color: activeTab === t.id ? 'white' : 'black', 
              boxShadow: activeTab === t.id ? 'none' : `3px 3px 0px ${t.color}`, 
              fontWeight: '900', cursor: 'pointer', fontSize: '11px', 
              transform: activeTab === t.id ? 'translate(2px, 2px)' : 'none' 
            }}>
            {t.id}
          </button>
        ))}
        <button onClick={async () => { await signOut(); window.location.reload(); }} style={{ padding: '8px 12px', border: '2px solid white', backgroundColor: 'black', color: 'white', fontWeight: '900', boxShadow: '3px 3px 0px white', cursor: 'pointer', fontSize: '11px' }}>
          LOGOUT
        </button>
      </div>

      <div style={{ width: '100%', maxWidth: '1000px', backgroundColor: 'white', border: '4px solid white', boxShadow: '8px 8px 0px black', overflow: 'hidden', color: 'black', boxSizing: 'border-box' }}>
        
        {activeTab === 'IDENTITY' && <Passport user={user} />}

        {activeTab !== 'IDENTITY' && (
          <div style={{ padding: '20px', overflowX: 'auto', color: 'black', boxSizing: 'border-box' }}>
            {loading ? ( <div style={{ padding: '40px', textAlign: 'center', fontWeight: '900' }}>SYNCING SYSTEM...</div> ) : (
              <>
                {activeTab === 'EVENTS' && (
                  <div>
                    <div style={{ border: '4px solid black', padding: '20px', backgroundColor: isEditing ? '#f8f9fa' : '#f9f9f9', marginBottom: '30px', boxShadow: '6px 6px 0px #3ea1f3', boxSizing: 'border-box' }}>
                      <h3 style={{ margin: '0 0 5px 0', fontWeight: '900', textTransform: 'uppercase' }}>{isEditing ? 'EDIT EVENT' : 'CREATE EVENT'}</h3>
                      <p style={{ margin: '0 0 15px 0', fontSize: '11px', fontWeight: 'bold', color: '#666' }}>Deploy a new workshop or mission to generate a scanable QR code for attendees.</p>

                      <form onSubmit={handleSaveEvent} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input placeholder="EVENT NAME" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required style={inputStyle} />
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <select value={form.track} onChange={e => setForm(f => ({ ...f, track: e.target.value }))} style={{...inputStyle, flex: '1 1 120px'}}>
                            {['General', 'Compute', 'Networking', 'Security', 'AI/ML'].map(t => <option key={t}>{t}</option>)}
                          </select>
                          <input type="number" placeholder="XP REWARD" value={form.xp_reward} onChange={e => setForm(f => ({ ...f, xp_reward: Number(e.target.value) }))} style={{ ...inputStyle, flex: '1 1 100px' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '10px', fontWeight: '900', display: 'block', marginBottom: '5px' }}>SKILLS UNLOCKED (COMMA SEPARATED)</label>
                          <input placeholder="e.g. EC2 Basics, Lambda Lab" value={form.unlocked_skills} onChange={e => setForm(f => ({ ...f, unlocked_skills: e.target.value }))} style={inputStyle} />
                        </div>
                        <div style={{ padding: '15px', border: '3px dashed black', backgroundColor: 'white' }}>
                          <label style={{ fontSize: '10px', fontWeight: '900', display: 'block', marginBottom: '10px' }}>CUSTOM STAMP ICON (OPTIONAL)</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                            <div style={{ width: '50px', height: '50px', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eee' }}>
                              {form.emoji ? <img src={form.emoji} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} alt="Stamp" /> : <span style={{fontSize: '10px', fontWeight: 'bold'}}>NONE</span>}
                            </div>
                            <label style={{ cursor: 'pointer', border: '2px solid black', backgroundColor: '#00e87f', padding: '8px 15px', fontWeight: '900', fontSize: '11px', boxShadow: '3px 3px 0px black', color: 'black' }}>
                              UPLOAD STAMP IMAGE
                              <input type="file" accept="image/*" onChange={handleStampUpload} style={{ display: 'none' }} />
                            </label>
                            {form.emoji && <button type="button" onClick={() => setForm(f => ({...f, emoji: ''}))} style={{ border: '2px solid black', background: 'white', padding: '8px 12px', fontWeight: '900', cursor: 'pointer' }}>CLEAR</button>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                          <button type="submit" disabled={processing} style={{ ...protoBtn, backgroundColor: '#000', color: '#fff', flex: 2 }}>{processing ? 'UPLOADING...' : 'SAVE EVENT'}</button>
                          {isEditing && <button type="button" onClick={cancelEdit} style={{ ...protoBtn, backgroundColor: '#fff', color: '#000', flex: 1 }}>CANCEL</button>}
                        </div>
                      </form>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {events.map(event => (
                        <div key={event.id} style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '15px', border: '3px solid black', boxShadow: '4px 4px 0px rgba(0,0,0,0.1)', flexWrap: 'wrap' }}>
                          <img src={event.emoji || "/icons/speaker.svg"} style={{ width: '35px', height: '35px', objectFit: 'contain', marginRight: '15px' }} alt="Event" />
                          <div style={{ flex: 1, minWidth: '150px' }}>
                            <div style={{ fontWeight: '900', fontSize: '15px', textTransform: 'uppercase', wordWrap: 'break-word' }}>{event.name}</div>
                            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#666' }}>{event.track} • {event.xp_reward} XP</div>
                          </div>
                          <div style={{ display: 'flex', gap: '5px', marginTop: '10px', width: '100%' }}>
                            <button onClick={() => openQR(event)} style={{ border: '3px solid black', background: '#3ea1f3', color: 'white', padding: '6px 10px', fontWeight: '900', cursor: 'pointer', fontSize: '11px', flex: 1 }}>QR</button>
                            <button onClick={() => startEdit(event)} style={{ border: '3px solid black', background: 'white', color: 'black', padding: '6px 10px', fontWeight: '900', cursor: 'pointer', fontSize: '11px', flex: 1 }}>EDIT</button>
                            <button onClick={() => handleDeleteEvent(event.id)} style={{ border: '3px solid black', background: '#ef4444', color: 'white', padding: '6px 10px', fontWeight: '900', cursor: 'pointer', fontSize: '11px', flex: 1 }}>DEL</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'ROSTER' && (
                  <div>
                    <div style={{ border: '4px solid #ef4444', backgroundColor: '#fff5f5', padding: '15px', marginBottom: '20px', display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ fontSize: '10px', fontWeight: '900', color: '#ef4444', marginBottom: '5px', display: 'block' }}>ARCHIVE TRIMESTER NAME (e.g., Jan 2026)</label>
                        <input value={resetTrimesterName} onChange={e => setResetTrimesterName(e.target.value)} placeholder="Enter name to archive..." style={{ ...inputStyle, border: '3px solid #ef4444' }} />
                      </div>
                      <button onClick={handleResetAllXP} disabled={processing} style={{ ...protoBtn, backgroundColor: '#ef4444', color: 'white', padding: '12px 20px' }}>
                        {processing ? 'PURGING...' : 'END OF TRIMESTER RESET'}
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                      <button onClick={downloadCSV} style={{ ...protoBtn, backgroundColor: '#ff9900', color: 'black', padding: '10px' }}>
                        <img src="/icons/upload.png" style={{ width: '12px', transform: 'rotate(180deg)', marginRight: '8px' }} alt="Download" />
                        EXPORT CSV
                      </button>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={tableStyle}>
                        <thead>
                          <tr style={{ backgroundColor: '#3ea1f3', color: 'white' }}>
                            <th style={{...thStyle, cursor: 'pointer'}} onClick={() => requestSort('member_id')}>STUDENT ID{getSortIndicator('member_id')}</th>
                            <th style={{...thStyle, cursor: 'pointer'}} onClick={() => requestSort('full_name')}>FULL NAME{getSortIndicator('full_name')}</th>
                            <th style={{...thStyle, cursor: 'pointer'}} onClick={() => requestSort('email')}>EMAIL{getSortIndicator('email')}</th>
                            <th style={{...thStyle, cursor: 'pointer'}} onClick={() => requestSort('major')}>MAJORS{getSortIndicator('major')}</th>
                            <th style={{...thStyle, cursor: 'pointer'}} onClick={() => requestSort('intake')}>FIRST INTAKE{getSortIndicator('intake')}</th>
                            <th style={{...thStyle, cursor: 'pointer'}} onClick={() => requestSort('attendance')}>ATTENDANCE{getSortIndicator('attendance')}</th>
                            <th style={{...thStyle, cursor: 'pointer'}} onClick={() => requestSort('joined')}>JOINED{getSortIndicator('joined')}</th>
                            <th style={thStyle}>ACTION</th>
                          </tr>
                          <tr style={{ backgroundColor: '#fffbe6' }}>
                            <th style={{ padding: '5px', border: '3px solid black' }}><input placeholder="Filter..." value={filters.member_id} onChange={e => handleFilterChange(e, 'member_id')} style={filterInputStyle} /></th>
                            <th style={{ padding: '5px', border: '3px solid black' }}><input placeholder="Filter..." value={filters.full_name} onChange={e => handleFilterChange(e, 'full_name')} style={filterInputStyle} /></th>
                            <th style={{ padding: '5px', border: '3px solid black' }}><input placeholder="Filter..." value={filters.email} onChange={e => handleFilterChange(e, 'email')} style={filterInputStyle} /></th>
                            <th style={{ padding: '5px', border: '3px solid black' }}><select value={filters.major} onChange={e => handleFilterChange(e, 'major')} style={filterInputStyle}><option value="">All</option>{uniqueMajors.map(m => <option key={m} value={m}>{m}</option>)}</select></th>
                            <th style={{ padding: '5px', border: '3px solid black' }}><select value={filters.intake} onChange={e => handleFilterChange(e, 'intake')} style={filterInputStyle}><option value="">All</option>{uniqueIntakes.map(i => <option key={i} value={i}>{i}</option>)}</select></th>
                            <th style={{ padding: '5px', border: '3px solid black' }}><input placeholder="Filter..." value={filters.attendance} onChange={e => handleFilterChange(e, 'attendance')} style={filterInputStyle} /></th>
                            <th style={{ padding: '5px', border: '3px solid black' }}><input placeholder="Filter..." value={filters.joined} onChange={e => handleFilterChange(e, 'joined')} style={filterInputStyle} /></th>
                            <th style={{ padding: '5px', border: '3px solid black', backgroundColor: '#eee' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {processedRoster.map((u, i) => {
                            const userAtts = attendances.filter(a => a.userID === u.id).length;
                            return (
                              <tr key={u.id} style={{ backgroundColor: i % 2 === 0 ? 'white' : '#f9f9f9' }}>
                                <td style={tdStyle}>{u.member_id}</td><td style={tdStyle}><strong>{u.full_name}</strong></td><td style={tdStyle}>{u.email}</td><td style={tdStyle}>{u.major?.join(', ')}</td><td style={tdStyle}>{u.intake}</td>
                                <td style={{ ...tdStyle, fontWeight: '900', textAlign: 'center' }}>{userAtts} / {events.length}</td><td style={tdStyle}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td style={{ ...tdStyle, textAlign: 'center' }}><button onClick={() => handleDeleteUser(u.id, u.full_name)} disabled={processing} style={{ backgroundColor: '#ef4444', color: 'white', border: '2px solid black', padding: '4px 8px', fontWeight: '900', cursor: 'pointer', fontSize: '10px' }}>DEL</button></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'LEADERBOARD' && (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                      <thead><tr style={{ backgroundColor: '#9b68f6', color: 'white' }}><th style={thStyle}>RANK</th><th style={thStyle}>ID</th><th style={thStyle}>BUILDER</th><th style={thStyle}>ACADEMIC YR</th><th style={thStyle}>TIER & LVL</th><th style={thStyle}>ATTENDANCE</th><th style={thStyle}>XP</th></tr></thead>
                      <tbody>
                        {sortedLeaderboard.map((u, i) => {
                          const userAtts = attendances.filter(a => a.userID === u.id).length;
                          const level = Math.floor((u.xp || 0)/200) + 1; 
                          const userXp = u.xp || 0;

                          return (
                            <tr key={u.id}>
                              <td style={{ ...tdStyle, fontWeight: '900', textAlign: 'center' }}>
                                {i === 0 && userXp > 0 ? <img src="/icons/first.png" alt="1st" style={{ width: '20px', verticalAlign: 'middle' }} /> :
                                 i === 1 && userXp > 0 ? <img src="/icons/second.png" alt="2nd" style={{ width: '20px', verticalAlign: 'middle' }} /> :
                                 i === 2 && userXp > 0 ? <img src="/icons/third.png" alt="3rd" style={{ width: '20px', verticalAlign: 'middle' }} /> : 
                                 `#${i + 1}`}
                              </td>
                              <td style={tdStyle}>{u.member_id}</td>
                              <td style={tdStyle}><strong>{u.full_name}</strong></td><td style={tdStyle}>YR {u.year}</td><td style={tdStyle}>{u.tier?.toUpperCase()} • LVL {level}</td>
                              <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 'bold' }}>{userAtts} Events</td><td style={{ ...tdStyle, fontWeight: '900', color: '#9b68f6' }}>{userXp} PT</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'MANUAL XP' && (
                  <div>
                    <h3 style={{ marginTop: 0, fontWeight: '900', borderBottom: '4px solid black', paddingBottom: '10px', textTransform: 'uppercase' }}>[ MANUAL XP OVERRIDE ]</h3>
                    <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#666', marginBottom: '20px' }}>Issue manual XP for quiz winners, special events, or bonus tasks.</p>
                    
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                      <input placeholder="SEARCH STUDENT NAME..." value={filters.full_name} onChange={e => handleFilterChange(e, 'full_name')} style={{ ...inputStyle, flex: 1, minWidth: '200px' }} />
                      <input type="number" placeholder="XP AMOUNT" value={pointsToAdd} onChange={e => setPointsToAdd(e.target.value)} style={{ ...inputStyle, width: '120px' }} />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto' }}>
                      {users.filter(u => u.full_name?.toLowerCase().includes(filters.full_name.toLowerCase())).map(u => (
                        <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '3px solid black', backgroundColor: '#f9f9f9', flexWrap: 'wrap', gap: '10px' }}>
                          <div>
                            <div style={{ fontWeight: '900', fontSize: '14px', textTransform: 'uppercase' }}>
                              {u.full_name} <span style={{ color: '#888', fontSize: '12px' }}>({u.member_id})</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#666', fontWeight: 'bold', marginTop: '4px' }}>CURRENT: <span style={{color: '#9b68f6'}}>{u.xp || 0} XP</span> • {u.major?.join(' + ')}</div>
                          </div>
                          <button onClick={() => addXpManually(u)} disabled={processing} style={{ backgroundColor: '#ff9900', color: 'black', border: '3px solid black', fontWeight: '900', cursor: 'pointer', padding: '10px 20px', boxShadow: '4px 4px 0px black', fontSize: '11px' }}>
                            {processing ? 'SYNCING...' : `GIVE +${pointsToAdd || 0} XP`}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      {qrEvent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={closeQR}>
          <div style={{ background: 'white', padding: '30px', border: '6px solid black', boxShadow: '15px 15px 0px #00e87f', textAlign: 'center', width: '90%', maxWidth: '400px', boxSizing: 'border-box' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '20px', fontWeight: '900', color: 'black', textTransform: 'uppercase', marginBottom: '20px', wordWrap: 'break-word' }}>{qrEvent.name}</div>
            {qrDataUrl ? <img src={qrDataUrl} alt="QR code" style={{ width: '100%', maxWidth: '280px', margin: '0 auto', display: 'block', border: '4px solid black', padding: '10px', boxSizing: 'border-box' }} /> : <div>GENERATING...</div>}
            
            <div style={{ fontSize: '14px', fontWeight: '900', color: '#ff9900', marginTop: '20px' }}>
              REFRESHING IN: {timeLeft}s
            </div>

            <button onClick={closeQR} style={{ ...protoBtn, width: '100%', marginTop: '25px', backgroundColor: 'black', color: 'white' }}>CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
}

const containerStyle = { minHeight: '100vh', padding: '5% 15px', color: 'black', backgroundColor: '#1a1c21', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box',
  backgroundImage: `url("/icons/background.png")`, 
  backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed'
};
const tableStyle = { width: '100%', borderCollapse: 'collapse', border: '4px solid black', minWidth: '600px' };
const thStyle = { padding: '10px', border: '3px solid black', textAlign: 'left', fontWeight: '900', fontSize: '11px', letterSpacing: '1px' };
const tdStyle = { padding: '10px', border: '2px solid black', fontSize: '11px', color: 'black' };
const inputStyle = { padding: '12px', border: '3px solid black', fontSize: '12px', fontWeight: '900', width: '100%', boxSizing: 'border-box', outline: 'none' };
const filterInputStyle = { width: '100%', padding: '6px', fontSize: '11px', border: '2px solid black', boxSizing: 'border-box', outline: 'none', fontWeight: 'bold' };
const protoBtn = { padding: '12px', border: '4px solid black', fontWeight: '900', cursor: 'pointer', boxShadow: '4px 4px 0px black', fontSize: '12px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center' };