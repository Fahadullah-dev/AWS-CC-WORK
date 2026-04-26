import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { getUser, listAttendances, listEvents } from '../graphql/queries';
import { updateUser } from '../graphql/mutations';

const client = generateClient();

export default function Passport() {
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrInitializeProfile();
  }, []);

  async function fetchOrInitializeProfile() {
    try {
      // 1. Get current Auth user
      const { userId } = await getCurrentUser();

      // 2. Get Profile from DynamoDB
      const userRes = await client.graphql({
        query: getUser,
        variables: { id: userId }
      });

      if (userRes.data.getUser) {
        setProfile(userRes.data.getUser);
        fetchAttendance(userId);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAttendance(userId) {
    try {
      const attRes = await client.graphql({
        query: listAttendances,
        variables: { filter: { userID: { eq: userId } } }
      });
      setAttendance(attRes.data.listAttendances.items);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  }

  if (loading) return <div className="loading">Syncing with AWS Cloud...</div>;

  return (
    <div className="passport-container">
      <div className="passport-book">
        {/* Left Page: Profile Info */}
        <div className="page left-page">
          <img src={profile?.avatar_url || 'https://via.placeholder.com/150'} alt="Avatar" className="profile-img" />
          <h2>{profile?.full_name}</h2>
          <p className="tier-tag">{profile?.tier} Tier</p>
          <div className="stats">
            <div className="stat-item"><strong>XP:</strong> {profile?.xp}</div>
            <div className="stat-item"><strong>Stamps:</strong> {attendance.length}</div>
          </div>
        </div>

        {/* Right Page: Skill Tree / Stamps */}
        <div className="page right-page">
          <h3>Recent Activity</h3>
          <div className="stamps-grid">
            {attendance.map(att => (
              <div key={att.id} className="stamp-circle">✅</div>
            ))}
            {attendance.length === 0 && <p>No stamps yet. Go scan some QR codes!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}