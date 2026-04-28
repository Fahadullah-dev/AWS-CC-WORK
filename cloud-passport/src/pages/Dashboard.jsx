import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import Passport from './Passport';
import Guide from './Guide';
import Checkin from './Checkin';
import Stamps from './Stamps';
import SkillTree from './SkillTree';
import Community from './Community'; // NEW IMPORT

export default function Dashboard({ user }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const userEmail = user?.signInDetails?.loginId || '';
  const isCaptain = ['34675845@student.murdoch.edu.au'].includes(userEmail);

  const pages = [
    { id: 'profile', label: 'IDENTITY', component: <Passport user={user} /> },
    { id: 'network', label: 'NETWORK', component: <Community /> }, // NEW TAB
    { id: 'guide', label: 'GUIDE', component: <Guide /> },
    { id: 'scanner', label: 'SCANNER', component: <Checkin user={user} /> },
    { id: 'stamps', label: 'STAMPS', component: <Stamps user={user} /> },
    { id: 'map1', label: 'SKILLS I', component: <SkillTree tracksToShow={['Compute', 'Networking']} /> },
    { id: 'map2', label: 'SKILLS II', component: <SkillTree tracksToShow={['Security', 'AI/ML']} /> }
  ];

  return (
    <div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#f4f4f4', backgroundImage: 'radial-gradient(#d1d1d1 1px, transparent 1px)', backgroundSize: '20px 20px', padding: '20px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: '"Courier New", Courier, monospace', color: 'black' }}>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '800px', width: '100%' }}>
        {pages.map((p, i) => (
          <button key={p.id} onClick={() => setCurrentIndex(i)}
            style={{ padding: '8px 12px', border: '2px solid black', backgroundColor: currentIndex === i ? '#FF9900' : 'white', color: 'black', boxShadow: currentIndex === i ? 'none' : '3px 3px 0px black', fontWeight: '900', cursor: 'pointer', fontSize: '11px', transform: currentIndex === i ? 'translate(2px, 2px)' : 'none' }}>
            {p.label}
          </button>
        ))}
        {isCaptain && (
          <button onClick={() => navigate('/admin')} style={{ padding: '8px 12px', border: '2px solid black', backgroundColor: 'black', color: '#FF9900', fontWeight: '900', boxShadow: '3px 3px 0px black', cursor: 'pointer', fontSize: '11px' }}>
            COMMAND
          </button>
        )}
        <button onClick={async () => { await signOut(); window.location.reload(); }} style={{ padding: '8px 12px', border: '2px solid black', backgroundColor: '#ef4444', color: 'white', fontWeight: '900', boxShadow: '3px 3px 0px black', cursor: 'pointer', fontSize: '11px' }}>
          LOGOUT
        </button>
      </div>
      
      <div style={{ width: '100%', maxWidth: '650px', backgroundColor: 'white', border: '4px solid black', boxShadow: '8px 8px 0px rgba(0,0,0,1)', overflow: 'hidden' }}>
        {pages[currentIndex].component}
      </div>
    </div>
  );
}