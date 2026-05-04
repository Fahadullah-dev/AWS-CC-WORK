import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import Passport from './Passport';
import Guide from './Guide';
import Checkin from './Checkin';
import Stamps from './Stamps';
import SkillTree from './SkillTree';
import Community from './Community';
import Admin from './Admin';
import Archive from './Archive';

// 🛑 CUSTOM QUERY: Forces Amplify to fetch the new 'archives' field
const CUSTOM_GET_USER = `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      archives
    }
  }
`;

export default function Dashboard({ user }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTerminated, setIsTerminated] = useState(false);
  const [hasArchives, setHasArchives] = useState(false);
  const navigate = useNavigate();

  const userEmail = user?.signInDetails?.loginId || '';
  const isGroupLeader = ['34675845@student.murdoch.edu.au'].includes(userEmail);

  useEffect(() => {
    async function checkArchives() {
      if(isGroupLeader) return; 
      try {
        // USING THE CUSTOM QUERY HERE
        const res = await generateClient().graphql({ query: CUSTOM_GET_USER, variables: { id: user.userId } });
        if (res.data.getUser?.archives) {
          const parsed = JSON.parse(res.data.getUser.archives);
          if (parsed.length > 0) setHasArchives(true);
        }
      } catch (err) { console.error(err); }
    }
    checkArchives();
  }, [user.userId, isGroupLeader]);

  if (isGroupLeader) return <Admin user={user} />;

  let pages = [
    { id: 'profile', label: 'IDENTITY', component: <Passport user={user} onTerminated={() => setIsTerminated(true)} />, color: '#9b68f6' },
    { id: 'network', label: 'NETWORK', component: <Community />, color: '#3ea1f3' },
    { id: 'guide', label: 'GUIDE', component: <Guide />, color: '#00e87f' },
    { id: 'scanner', label: 'SCANNER', component: <Checkin user={user} />, color: '#ff9900' },
    { id: 'stamps', label: 'STAMPS', component: <Stamps user={user} />, color: '#ff57f6' },
    { id: 'skills', label: 'SKILLS', component: <SkillTree tracksToShow={['Compute', 'Networking', 'Security', 'AI/ML', 'General']} />, color: '#3ea1f3' }
  ];

  if (hasArchives) {
    pages.push({ id: 'archive', label: 'ARCHIVE', component: <Archive />, color: '#666' });
  }

  return (
    <div style={{ 
      minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '5% 15px', backgroundColor: '#1a1c21', fontFamily: '"Courier New", Courier, monospace', color: 'white', boxSizing: 'border-box',
      backgroundImage: `url("/icons/background.png")`, 
      backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed'
    }}>
      
      <img src="/icons/logo2.png" alt="AWS Student Builder Group" style={{ height: '90px', marginBottom: '25px', objectFit: 'contain', maxWidth: '100%' }} />

      {!isTerminated && (
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
          <button onClick={async () => { await signOut(); window.location.reload(); }} style={{ padding: '8px 12px', border: '2px solid white', backgroundColor: '#ff57f6', color: 'white', fontWeight: '900', boxShadow: '3px 3px 0px white', cursor: 'pointer', fontSize: '11px' }}>
            LOGOUT
          </button>
        </div>
      )}
      
      <div style={{ width: '100%', maxWidth: '650px', backgroundColor: 'white', border: '4px solid white', boxShadow: '8px 8px 0px black', overflow: 'hidden', color: 'black', boxSizing: 'border-box' }}>
        {isTerminated ? pages[0].component : pages[currentIndex].component}
      </div>
    </div>
  );
}