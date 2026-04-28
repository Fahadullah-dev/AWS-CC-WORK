import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import Passport from './Passport';
import Guide from './Guide';
import Checkin from './Checkin';
import Stamps from './Stamps';
import SkillTree from './SkillTree';
import Community from './Community';

export default function Dashboard({ user }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const userEmail = user?.signInDetails?.loginId || '';
  const isGroupLeader = ['34675845@student.murdoch.edu.au'].includes(userEmail);

  const pages = [
    { id: 'profile', label: 'IDENTITY', component: <Passport user={user} />, color: '#9b68f6' },
    { id: 'network', label: 'NETWORK', component: <Community />, color: '#3ea1f3' },
    { id: 'guide', label: 'GUIDE', component: <Guide />, color: '#00e87f' },
    { id: 'scanner', label: 'SCANNER', component: <Checkin user={user} />, color: '#ff9900' },
    { id: 'stamps', label: 'STAMPS', component: <Stamps user={user} />, color: '#ff57f6' },
    { id: 'map1', label: 'SKILLS I', component: <SkillTree tracksToShow={['Compute', 'Networking']} />, color: '#3ea1f3' },
    { id: 'map2', label: 'SKILLS II', component: <SkillTree tracksToShow={['Security', 'AI/ML']} />, color: '#9b68f6' }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '40px 20px', backgroundColor: '#1a1c21', fontFamily: '"Courier New", Courier, monospace', color: 'white',
      backgroundImage: `
        linear-gradient(#2d3139 2px, transparent 2px), 
        linear-gradient(90deg, #2d3139 2px, transparent 2px),
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Crect x='0' y='0' width='80' height='80' fill='%23ff9900' opacity='0.8'/%3E%3Crect x='200' y='0' width='80' height='80' fill='%23ff9900' opacity='0.8'/%3E%3Crect x='120' y='0' width='40' height='40' fill='%239b68f6' opacity='0.8'/%3E%3Crect x='80' y='40' width='40' height='40' fill='%239b68f6' opacity='0.8'/%3E%3Crect x='160' y='40' width='40' height='40' fill='%239b68f6' opacity='0.8'/%3E%3Crect x='40' y='80' width='40' height='40' fill='%239b68f6' opacity='0.8'/%3E%3Crect x='200' y='80' width='40' height='40' fill='%239b68f6' opacity='0.8'/%3E%3Crect x='120' y='80' width='40' height='40' fill='%23ff57f6' opacity='0.8'/%3E%3Crect x='80' y='120' width='40' height='40' fill='%23ff57f6' opacity='0.8'/%3E%3Crect x='160' y='120' width='40' height='40' fill='%23ff57f6' opacity='0.8'/%3E%3Crect x='0' y='160' width='80' height='80' fill='%23ff9900' opacity='0.8'/%3E%3Crect x='200' y='160' width='80' height='80' fill='%23ff9900' opacity='0.8'/%3E%3Crect x='120' y='200' width='40' height='40' fill='%239b68f6' opacity='0.8'/%3E%3C/svg%3E")
      `, 
      backgroundSize: '40px 40px, 40px 40px, 500px 500px', backgroundPosition: '0 0, 0 0, right 50px', backgroundRepeat: 'repeat, repeat, no-repeat'
    }}>
      
      {/* REMOVED FILTER */}
      <img 
        src="/icons/brandmark.svg" 
        alt="AWS Student Builder Group" 
        style={{ height: '100px', marginBottom: '30px' }} 
      />

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '800px', width: '100%' }}>
        {pages.map((p, i) => (
          <button key={p.id} onClick={() => setCurrentIndex(i)}
            style={{ 
              padding: '8px 12px', border: '2px solid white', 
              backgroundColor: currentIndex === i ? p.color : 'white', 
              color: currentIndex === i ? 'white' : 'black', 
              boxShadow: currentIndex === i ? 'none' : `3px 3px 0px ${p.color}`, 
              fontWeight: '900', cursor: 'pointer', fontSize: '11px', 
              transform: currentIndex === i ? 'translate(2px, 2px)' : 'none' 
            }}>
            {p.label}
          </button>
        ))}
        {isGroupLeader && (
          <button onClick={() => navigate('/admin')} style={{ padding: '8px 12px', border: '2px solid white', backgroundColor: 'black', color: '#00e87f', fontWeight: '900', boxShadow: '3px 3px 0px #00e87f', cursor: 'pointer', fontSize: '11px' }}>
            COMMAND_CENTER
          </button>
        )}
        <button onClick={async () => { await signOut(); window.location.reload(); }} style={{ padding: '8px 12px', border: '2px solid white', backgroundColor: '#ff57f6', color: 'white', fontWeight: '900', boxShadow: '3px 3px 0px white', cursor: 'pointer', fontSize: '11px' }}>
          LOGOUT
        </button>
      </div>
      
      <div style={{ width: '100%', maxWidth: '650px', backgroundColor: 'white', border: '4px solid white', boxShadow: '8px 8px 0px black', overflow: 'hidden', color: 'black' }}>
        {pages[currentIndex].component}
      </div>
    </div>
  );
}