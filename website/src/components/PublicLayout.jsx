import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { COLORS, FONTS, SPACING } from '../styles/tokens'

export default function PublicLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh', fontFamily: FONTS.mono }}>
      <Navbar />
      <main style={{ paddingTop: SPACING.navbar }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
