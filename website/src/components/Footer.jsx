import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const QUICK_LINKS = [
  { to: '/',             label: 'Home'         },
  { to: '/events',       label: 'Events'       },
  { to: '/learning-hub', label: 'Learning Hub' },
  { to: '/team',         label: 'Our Team'     },
  { to: '/contact',      label: 'Contact'      },
]

const SOCIALS = [
  { href: 'https://www.instagram.com/awsclubmurdoch', label: 'Instagram' },
  { href: 'https://www.linkedin.com/company/awsclubmurdoch', label: 'LinkedIn' },
  { href: 'https://github.com/awsclubmurdoch', label: 'GitHub' },
  { href: 'https://discord.gg/awsclubmurdoch', label: 'Discord' },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Top divider accent */}
      <div className={styles.topBar} />

      <div className={`${styles.inner} container`}>
        {/* Brand column */}
        <div className={styles.brand}>
          <Link to="/" className={styles.logo} aria-label="AWS Cloud Club home">
            <span className={styles.logoIcon}>☁</span>
            <span className={styles.logoName}>
              <span className={styles.orange}>AWS</span> Cloud Club
            </span>
          </Link>
          <p className={styles.tagline}>
            The AWS Student Building Group at Murdoch University Dubai. We don't just
            talk about tech — we build things that matter.
          </p>
        </div>

        {/* Quick links */}
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Quick Links</h3>
          <ul className={styles.colList}>
            {QUICK_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={styles.colLink}>→ {label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Socials */}
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Socials</h3>
          <ul className={styles.colList}>
            {SOCIALS.map(({ href, label }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.colLink}
                >
                  → {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} AWS Cloud Club · Murdoch University Dubai</span>
        <span className={styles.muted}>Built by club members, for club members.</span>
      </div>
    </footer>
  )
}
