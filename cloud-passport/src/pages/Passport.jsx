import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { getUser } from '../graphql/queries';
import { createUser } from '../graphql/mutations';

// Initialize the AWS GraphQL Client
const client = generateClient();

export default function Passport({ user }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrInitializeProfile();
  }, [user]);

  async function fetchOrInitializeProfile() {
    try {
      // 1. Get the current authenticated user's unique AWS ID
      const { userId, signInDetails } = await getCurrentUser();
      const email = signInDetails?.loginId || 'student@murdoch.edu.au';

      // 2. Try to fetch their profile from the DynamoDB Database
      const userData = await client.graphql({
        query: getUser,
        variables: { id: userId }
      });

      if (userData.data.getUser) {
        // 3a. Profile exists! Set it to state.
        setProfile(userData.data.getUser);
      } else {
        // 3b. Profile DOES NOT exist (first time login). Let's create it!
        const newProfileData = {
          id: userId,
          email: email,
          full_name: "New Cloud Explorer", // They can edit this later
          member_id: `AWS-${Math.floor(1000 + Math.random() * 9000)}`, // Generate random ID
          xp: 0,
          tier: "Beginner",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + userId // Auto-generate cute avatar
        };

        const newProfile = await client.graphql({
          query: createUser,
          variables: { input: newProfileData }
        });

        setProfile(newProfile.data.createUser);
      }
    } catch (error) {
      console.error("Error fetching/creating profile:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: '#64748b' }}>Syncing with AWS... ☁️</div>;
  }

  if (!profile) {
    return <div style={{ color: 'red' }}>Error loading profile.</div>;
  }

  // Calculate XP progress (Assuming 1000 XP is the next tier)
  const xpProgress = (profile.xp / 1000) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Section: Avatar and Tier */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <img 
          src={profile.avatar_url} 
          alt="Avatar" 
          style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#cbd5e1', border: '3px solid #FF9900' }} 
        />
        <div>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', color: '#0f172a' }}>{profile.full_name}</h3>
          <span style={{ background: '#0a0f18', color: '#FF9900', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
            {profile.tier} Tier
          </span>
        </div>
      </div>

      {/* Details Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div style={detailBoxStyle}>
          <span style={detailLabelStyle}>MEMBER ID</span>
          <strong style={{ color: '#0f172a' }}>{profile.member_id}</strong>
        </div>
        <div style={detailBoxStyle}>
          <span style={detailLabelStyle}>UNIVERSITY EMAIL</span>
          <strong style={{ color: '#0f172a', fontSize: '12px', wordBreak: 'break-all' }}>{profile.email}</strong>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div style={{ marginTop: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>Cloud Experience (XP)</span>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#FF9900' }}>{profile.xp} / 1000</span>
        </div>
        <div style={{ width: '100%', background: '#e2e8f0', borderRadius: '10px', height: '12px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${xpProgress}%`, 
            background: 'linear-gradient(90deg, #FF9900 0%, #FFB84D 100%)', 
            height: '100%', 
            borderRadius: '10px',
            transition: 'width 1s ease-in-out'
          }} />
        </div>
      </div>

    </div>
  );
}

// Reusable styles
const detailBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  background: '#f1f5f9',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0'
};

const detailLabelStyle = {
  fontSize: '10px',
  color: '#64748b',
  fontWeight: '900',
  letterSpacing: '0.05em',
  marginBottom: '4px'
};