import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';

import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import PublicPassport from './pages/PublicPassport';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f4', color: 'black', fontWeight: '900', fontSize: '20px', backgroundImage: 'radial-gradient(#d1d1d1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        INITIALIZING_NETWORK...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Dashboard user={user} /> : <Auth onAuthSuccess={checkUser} />} 
        />
        <Route path="/admin" element={user ? <Admin user={user} /> : <Navigate to="/" />} />
        <Route path="/builder/:slug" element={<PublicPassport />} />
      </Routes>
    </BrowserRouter>
  );
}