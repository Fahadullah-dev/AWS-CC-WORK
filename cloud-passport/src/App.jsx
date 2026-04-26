// src/App.jsx
import React, { useState, useEffect } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth'; // Or wherever your Auth component is located

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in when the app loads
    checkUser();

    // Listen for authentication events (login, logout, signup)
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          checkUser();
          break;
        case 'signedOut':
          setUser(null);
          break;
      }
    });

    return unsubscribe;
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      // User is not logged in
      setUser(null);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0b1120', color: 'white' }}>
        <h2>Loading AWS Passport...☁️</h2>
      </div>
    );
  }

  // If we have a user, show the Dashboard. If not, show the Login page.
  return user ? <Dashboard user={user} /> : <Auth />;
}