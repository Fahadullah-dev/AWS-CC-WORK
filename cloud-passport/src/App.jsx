// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import { supabase } from './lib/supabase';
import './index.css';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--neon-blue)' }}>Loading E-Passport...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* If NOT logged in, show Auth screen. If logged in, send them to Dashboard. */}
        <Route 
          path="/" 
          element={!session ? <Auth onLogin={(user) => setSession({ user })} /> : <Navigate to="/dashboard" />} 
        />
        
        {/* If logged in, show Dashboard. If NOT logged in, kick them back to login. */}
        <Route 
          path="/dashboard" 
          element={session ? <Dashboard user={session.user} /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;