import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';

// === WEBSITE COMPONENTS ===
import PublicLayout from './components/PublicLayout';
import Home from './pages/Home';
import Events from './pages/Events';
import Hub from './pages/Hub';
import Team from './pages/Team';
import Contact from './pages/Contact';
import PassportGateway from './pages/PassportGateway';

// === E-PASSPORT COMPONENTS ===
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (isChecking) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#1a1c21', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: '900', fontFamily: '"Courier New", Courier, monospace', letterSpacing: '2px' }}>
        INITIALIZING SYSTEM...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* === WEBSITE ROUTES (Wrapped in Navbar/Footer) === */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/learningHub" element={<Hub />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/passport-gateway" element={<PassportGateway />} />
        </Route>

        {/* === E-PASSPORT ROUTE (No Navbar, Full Screen, Independent) === */}
        <Route path="/epassport" element={
          isAuthenticated ? (
            <Dashboard user={user} />
          ) : (
            <Auth onAuthSuccess={checkAuth} />
          )
        } />

        {/* Fallback for unknown URLs */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}