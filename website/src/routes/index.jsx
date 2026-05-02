import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import Home            from '../pages/Home'
import Events          from '../pages/Events'
import Hub             from '../pages/Hub'
import Team            from '../pages/Team'
import Contact         from '../pages/Contact'
import PassportGateway from '../pages/PassportGateway'

export default function AppRoutes() {
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
    </Routes>
  )
}
