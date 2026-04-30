import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import anime from 'animejs'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { to: '/',             label: 'Home'         },
  { to: '/events',       label: 'Events'       },
  { to: '/learning-hub', label: 'Learning Hub' },
  { to: '/team',         label: 'Team'         },
  { to: '/contact',      label: 'Contact'      },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const logoRef                   = useRef(null)
  const location                  = useLocation()

  /* Close mobile menu on route change */
  useEffect(() => setMenuOpen(false), [location])

  /* Scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Logo pulse on mount */
  useEffect(() => {
    anime({
      targets: logoRef.current,
      opacity: [0, 1],
      translateX: [-16, 0],
      duration: 700,
      easing: 'easeOutExpo',
    })
  }, [])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={`${styles.nav} container`}>
        {/* Logo */}
        <Link to="/" className={styles.logo} ref={logoRef} aria-label="AWS Cloud Club home">
          <span className={styles.logoIcon}>☁</span>
          <span className={styles.logoText}>
            <span className={styles.logoBrand}>AWS</span>
            <span className={styles.logoSub}> Cloud Club</span>
          </span>
          <span className={styles.logoTag}>Murdoch Dubai</span>
        </Link>

        {/* Desktop links */}
        <ul className={styles.links}>
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <Link
          to="/passport-gateway"
          className={`btn btn--primary ${styles.ctaBtn}`}
          id="nav-join-btn"
        >
          Join →
        </Link>

        {/* Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          id="nav-hamburger"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className={styles.drawer}>
          <ul className={styles.drawerLinks}>
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `${styles.drawerLink} ${isActive ? styles.active : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link to="/passport-gateway" className="btn btn--primary">
            Join the Club →
          </Link>
        </div>
      )}
    </header>
  )
}
