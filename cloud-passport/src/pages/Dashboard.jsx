import React, { useState } from 'react';
import Passport from './Passport';
import Checkin from './Checkin';
import Stamps from './Stamps';
import SkillTree from './SkillTree';
import { signOut } from 'aws-amplify/auth';

export default function Dashboard({ user }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Define our pages in order
  const pages = [
    { id: 'profile', label: 'Identity Profile', component: <Passport user={user} /> },
    { id: 'scanner', label: 'QR Scanner', component: <Checkin user={user} /> },
    { id: 'stamps', label: 'Entry Stamps', component: <Stamps user={user} /> },
    { id: 'map1', label: 'Skill Tree (I)', component: <SkillTree tracksToShow={['Compute', 'Networking']} /> },
    { id: 'map2', label: 'Skill Tree (II)', component: <SkillTree tracksToShow={['Security', 'AI/ML']} /> }
  ];

  const next = () => setCurrentIndex(i => Math.min(i + 1, pages.length - 1));
  const prev = () => setCurrentIndex(i => Math.max(i - 1, 0));

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      padding: '40px 20px', minHeight: '100vh', width: '100%',
      background: '#0b1120', overflowY: 'auto'
    }}>
      
      {/* Top Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '800px' }}>
        {pages.map((p, i) => (
          <button 
            key={p.id} 
            className={currentIndex === i ? "btn-glow" : "btn-outline"} 
            onClick={() => setCurrentIndex(i)}
          >
            {p.label}
          </button>
        ))}
        <button 
          className="btn-outline" 
          style={{ borderColor: '#ff4444', color: '#ff4444', background: 'rgba(255, 68, 68, 0.05)' }}
          onClick={() => signOut()}
        >
          Logout
        </button>
      </div>

      {/* Main Card Container */}
      <div style={{ 
        width: '100%', maxWidth: '600px', background: 'white', 
        borderRadius: '16px', padding: '30px', 
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)', 
        minHeight: '550px', position: 'relative' 
      }}>
        
        {/* Render the active component */}
        {pages[currentIndex].component}

      </div>

      {/* Bottom Pagination Arrows */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '600px', marginTop: '25px' }}>
        <button onClick={prev} disabled={currentIndex === 0} style={{ ...navBtnStyle, opacity: currentIndex === 0 ? 0.3 : 1 }}>
          ❮ Previous
        </button>
        
        <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 'bold' }}>
          Page {currentIndex + 1} of {pages.length}
        </span>
        
        <button onClick={next} disabled={currentIndex === pages.length - 1} style={{ ...navBtnStyle, opacity: currentIndex === pages.length - 1 ? 0.3 : 1 }}>
          Next ❯
        </button>
      </div>

    </div>
  );
}

const navBtnStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  border: '1px solid rgba(255,255,255,0.2)',
  padding: '10px 20px',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: '0.2s'
};