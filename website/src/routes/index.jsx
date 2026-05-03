import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import Home            from '../pages/Home'
import Events          from '../pages/Events'
import Hub             from '../pages/Hub'
import Team            from '../pages/Team'
import Contact         from '../pages/Contact'
import PassportGateway from '../pages/PassportGateway'

// Passport pages
import Auth             from '../pages/Auth'
import Dashboard        from '../pages/Dashboard'
import Admin            from '../pages/Admin'
import PublicPassport   from '../pages/PublicPassport'

export default function AppRoutes({ user, checkUser }) {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/"                  element={<Home />} />
        <Route path="/events"            element={<Events />} />
        <Route path="/hub"               element={<Hub />} />
        <Route path="/learning-hub"      element={<Hub />} />
        <Route path="/team"              element={<Team />} />
        <Route path="/contact"           element={<Contact />} />
        <Route path="/passport-gateway"  element={<PassportGateway />} />
      </Route>

      {/* Passport routes */}
      <Route path="/auth"          element={<Auth onAuthSuccess={checkUser} />} />
      <Route path="/dashboard"     element={user ? <Dashboard user={user} /> : <Navigate to="/auth" />} />
      <Route path="/admin"         element={user ? <Admin user={user} />     : <Navigate to="/auth" />} />
      <Route path="/builder/:slug" element={<PublicPassport />} />
    </Routes>
  )
}