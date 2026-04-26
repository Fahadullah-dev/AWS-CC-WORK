import React, { useState } from 'react';
import Passport from './Passport';
import Checkin from './Checkin';
import Stamps from './Stamps';
import SkillTree from './SkillTree';
import { signOut } from 'aws-amplify/auth';

export default function Dashboard({ user }) {
  const [currentIndex, setCurrentIndex] = useState(0);

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
      backgroundColor: '#f4f4f4', // Off-white like the prototype
      backgroundImage: 'radial-gradient(#d1d1d1 1px, transparent 1px)', // Subtle grid dots
      backgroundSize: '20px 20px',
      padding: '40px 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      fontFamily: '"Courier New", Courier, monospace' // Terminal vibe
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
              boxShadow: currentIndex === i ? 'none' : '4px 4px 0px black',
              fontWeight: '900', cursor: 'pointer',
              transform: currentIndex === i ? 'translate(2px, 2px)' : 'none'
            }}
          >
            {p.label}
          </button>
        ))}
        <button 
          onClick={() => signOut()}
          style={{ padding: '10px 20px', border: '2px solid black', backgroundColor: '#ef4444', color: 'white', fontWeight: '900', boxShadow: '4px 4px 0px black', cursor: 'pointer' }}
        >
          LOGOUT
        </button>
      </div>

      {/* Main Container - The "Passport Board" */}
      <div style={{ 
        width: '100%', 
        maxWidth: '650px', // Increased from 550px
        backgroundColor: 'white', 
        border: '4px solid black', // Thicker border
        boxShadow: '12px 12px 0px rgba(0,0,0,1)', // Deeper shadow
        padding: '0px', 
        overflow: 'hidden'
      }}>
        {pages[currentIndex].component}
      </div>
    </div>
  );
}