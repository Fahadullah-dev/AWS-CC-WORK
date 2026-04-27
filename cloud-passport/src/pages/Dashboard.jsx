import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import Passport from './Passport';
import Checkin from './Checkin';
import Stamps from './Stamps';
import SkillTree from './SkillTree';

export default function Dashboard({ user }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Check if current user is a captain
  const userEmail = user?.signInDetails?.loginId || '';
  const isCaptain = ['34675845@student.murdoch.edu.au'].includes(userEmail);

  const pages = [
    { id: 'profile', label: 'IDENTITY', component: <Passport user={user} /> },
    { id: 'scanner', label: 'SCANNER', component: <Checkin user={user} /> },
    { id: 'stamps', label: 'STAMPS', component: <Stamps user={user} /> },
    { id: 'map1', label: 'SKILLS I', component: <SkillTree tracksToShow={['Compute', 'Networking']} /> },
    { id: 'map2', label: 'SKILLS II', component: <SkillTree tracksToShow={['Security', 'AI/ML']} /> }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', width: '100%', 
      backgroundColor: '#f4f4f4',
      backgroundImage: 'radial-gradient(#d1d1d1 1px, transparent 1px)', 
      backgroundSize: '20px 20px',
      padding: '40px 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      fontFamily: '"Courier New", Courier, monospace',
      color: 'black'
    }}>
      
      {/* Prototype-style Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {pages.map((p, i) => (
          <button 
            key={p.id} 
            onClick={() => setCurrentIndex(i)}
            style={{
              padding: '10px 20px',
              border: '2px solid black',
              backgroundColor: currentIndex === i ? '#FF9900' : 'white',
              color: 'black',
              boxShadow: currentIndex === i ? 'none' : '4px 4px 0px black',
              fontWeight: '900', cursor: 'pointer',
              transform: currentIndex === i ? 'translate(2px, 2px)' : 'none'
            }}
          >
            {p.label}
          </button>
        ))}
        
        {/* HIDDEN CAPTAIN BUTTON */}
        {isCaptain && (
          <button 
            onClick={() => navigate('/admin')}
            style={{ padding: '10px 20px', border: '2px solid black', backgroundColor: 'black', color: '#FF9900', fontWeight: '900', boxShadow: '4px 4px 0px black', cursor: 'pointer' }}
          >
            COMMAND_CENTER
          </button>
        )}

        <button 
          onClick={async () => {
            await signOut();
            window.location.reload();
          }}
          style={{ padding: '10px 20px', border: '2px solid black', backgroundColor: '#ef4444', color: 'white', fontWeight: '900', boxShadow: '4px 4px 0px black', cursor: 'pointer' }}
        >
          LOGOUT
        </button>
      </div>
      
      
      {/* Main Container - The "Passport Board" */}
      <div style={{ 
        width: '100%', 
        maxWidth: '650px', 
        backgroundColor: 'white', 
        border: '4px solid black', 
        boxShadow: '12px 12px 0px rgba(0,0,0,1)', 
        padding: '0px', 
        overflow: 'hidden'
      }}>
        {pages[currentIndex].component}
      </div>
    </div>
  );
}