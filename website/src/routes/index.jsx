import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'

import Home from '../pages/Home'
import Events from '../pages/Events'
import LearningHub from '../pages/LearningHub'
import Team from '../pages/Team'
import Contact from '../pages/Contact'
import PassportGateway from '../pages/PassportGateway'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/learning-hub" element={<LearningHub />} />
        <Route path="/team" element={<Team />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/passport-gateway" element={<PassportGateway />} />
      </Route>
    </Routes>
  )
}

