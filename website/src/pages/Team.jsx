import { useEffect, useMemo, useRef } from 'react'
import anime from 'animejs'
import styles from './Team.module.css'

const CLUB_CAPTAIN = {
  name: 'WADIQIA',
  role: 'Club Captain',
  linkedinUrl: 'https://www.linkedin.com/in/wadiqia/',
  githubUrl: null,
  avatarSeed: 'wadiqia',
}

const TEAM_MEMBERS = [
  {
    name: 'FAHAD',
    role: 'Core Lead',
    linkedinUrl: 'https://www.linkedin.com/in/fahad/',
    githubUrl: null,
    avatarSeed: 'fahad',
  },
  {
    name: 'MUAQAZ',
    role: 'Backend Lead',
    linkedinUrl: 'https://www.linkedin.com/in/muaqaz/',
    githubUrl: null,
    avatarSeed: 'muaqaz',
  },
  {
    name: 'BILAL',
    role: 'Frontend Lead',
    linkedinUrl: 'https://www.linkedin.com/in/bilal/',
    githubUrl: null,
    avatarSeed: 'bilal',
  },
  {
    name: 'RAYYAN',
    role: 'Community Lead',
    linkedinUrl: 'https://www.linkedin.com/in/rayyan/',
    githubUrl: null,
    avatarSeed: 'rayyan',
  },
  {
    name: 'KAMILLA',
    role: 'Learning Hub Lead',
    linkedinUrl: 'https://www.linkedin.com/in/kamilla/',
    githubUrl: null,
    avatarSeed: 'kamilla',
  },
]

function getAvatarUrl(seed) {
  // Deterministic "photo-like" avatar so cards always render even without local images.
  // (You can later swap these with real member photos.)
  return `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(seed)}&backgroundColor=bab0ff`
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.socialSvg}>
      <path
        fill="currentColor"
        d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.5 1 4.98 2.12 4.98 3.5ZM.5 24h4V7.5h-4V24Zm8.5 0h4v-8.1c0-1.94.7-3.2 2.46-3.2 1.32 0 2.07.92 2.41 1.8.13.33.15.8.15 1.27V24h4v-9.06c0-2.46-.52-4.3-2.63-5.31-1.22-.6-2.6-.52-3.61.28-.82.66-1.2 1.4-1.39 1.84V7.5h-4V24Z"
      />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.socialSvg}>
      <path
        fill="currentColor"
        d="M12 .5C5.73.5.7 5.6.7 12c0 5.1 3.29 9.43 7.86 10.96.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.72-3.88-1.58-3.88-1.58-.52-1.35-1.28-1.71-1.28-1.71-1.05-.73.08-.72.08-.72 1.16.08 1.77 1.23 1.77 1.23 1.03 1.79 2.7 1.27 3.36.97.1-.76.4-1.27.72-1.56-2.55-.3-5.24-1.31-5.24-5.84 0-1.29.45-2.34 1.18-3.17-.12-.31-.51-1.55.11-3.23 0 0 .96-.32 3.14 1.2.91-.26 1.88-.38 2.85-.38.97 0 1.94.13 2.85.38 2.18-1.52 3.14-1.2 3.14-1.2.62 1.68.23 2.92.11 3.23.73.83 1.18 1.88 1.18 3.17 0 4.54-2.69 5.53-5.25 5.83.41.37.77 1.1.77 2.23 0 1.61-.02 2.9-.02 3.29 0 .31.2.67.8.56 4.56-1.53 7.85-5.86 7.85-10.96C23.3 5.6 18.27.5 12 .5Z"
      />
    </svg>
  )
}

export default function Team() {
  const captainRef = useRef(null)
  const memberCardRefs = useRef([])

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
  }, [])

  const setMemberRef = (el, idx) => {
    memberCardRefs.current[idx] = el
  }

  const hoverLift = (el) => {
    if (!el) return
    anime.remove(el)
    anime({
      targets: el,
      translateY: -6,
      duration: 220,
      easing: 'easeOutQuad',
    })
  }

  const hoverDrop = (el) => {
    if (!el) return
    anime.remove(el)
    anime({
      targets: el,
      translateY: 0,
      duration: 240,
      easing: 'easeOutQuad',
    })
  }

  useEffect(() => {
    const captainEl = captainRef.current
    const memberEls = memberCardRefs.current.filter(Boolean)
    if (!captainEl || memberEls.length === 0) return

    if (reducedMotion) {
      anime.set([captainEl, ...memberEls], { opacity: 1, translateY: 0 })
      return
    }

    // Initial states for consistent reveals on refresh.
    anime.set(captainEl, { opacity: 0, translateY: 18 })
    anime.set(memberEls, { opacity: 0, translateY: 18 })

    const DESKTOP_COLS = 3
    const tl = anime.timeline({ easing: 'easeOutExpo' })

    tl.add({
      targets: captainEl,
      opacity: [0, 1],
      translateY: [18, 0],
      duration: 720,
    })

    tl.add(
      {
        targets: memberEls,
        opacity: [0, 1],
        translateY: [18, 0],
        duration: 650,
        delay: (_el, i) => {
          const row = Math.floor(i / DESKTOP_COLS)
          const col = i % DESKTOP_COLS
          return row * 120 + col * 55
        },
      },
      '-=320'
    )
  }, [reducedMotion])

  return (
    <div className={styles.page}>
      <div className={`container ${styles.top}`}>
        <span className="tag tag--accent">Meet the Builders</span>
        <h1 className={styles.heading}>Our Team</h1>
        <p className={styles.sub}>
          The people behind the projects, learning sessions, and community energy. Real profiles with real
          links coming soon.
        </p>
      </div>

      <section className={`container ${styles.captainSection}`} aria-label="Featured Club Captain">
        <div
          className={styles.captainCard}
          ref={captainRef}
          onMouseEnter={(e) => hoverLift(e.currentTarget)}
          onMouseLeave={(e) => hoverDrop(e.currentTarget)}
        >
          <div className={styles.captainInner}>
            <div className={styles.captainMedia} aria-hidden="true">
              <div className={styles.photoFrame}>
                <img
                  className={styles.captainPhoto}
                  src={getAvatarUrl(CLUB_CAPTAIN.avatarSeed)}
                  alt={CLUB_CAPTAIN.name}
                />
              </div>
            </div>

            <div className={styles.captainBody}>
              <div className={styles.captainPill}>CLUB CAPTAIN</div>
              <div className={styles.captainName}>{CLUB_CAPTAIN.name}</div>
              <div className={styles.captainRole}>{CLUB_CAPTAIN.role}</div>

              <div className={styles.socialRow}>
                <a
                  className={styles.socialIcon}
                  href={CLUB_CAPTAIN.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${CLUB_CAPTAIN.name} LinkedIn`}
                >
                  <LinkedInIcon />
                </a>
                {CLUB_CAPTAIN.githubUrl ? (
                  <a
                    className={styles.socialIcon}
                    href={CLUB_CAPTAIN.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${CLUB_CAPTAIN.name} GitHub`}
                  >
                    <GitHubIcon />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`container ${styles.guildSection}`} aria-label="Core Guild">
        <div className={styles.guildHeader}>
          <h2 className={styles.guildTitle}>THE CORE GUILD</h2>
          <div className={styles.guildRule} aria-hidden="true" />
        </div>

        <div className={styles.grid} role="list">
          {TEAM_MEMBERS.map((m, idx) => (
            <article
              key={m.name}
              className={styles.memberCard}
              ref={(el) => setMemberRef(el, idx)}
              onMouseEnter={(e) => hoverLift(e.currentTarget)}
              onMouseLeave={(e) => hoverDrop(e.currentTarget)}
              role="listitem"
            >
              <div className={styles.memberMedia} aria-hidden="true">
                <div className={styles.photoFrameSmall}>
                  <img className={styles.memberPhoto} src={getAvatarUrl(m.avatarSeed)} alt={m.name} />
                </div>
              </div>

              <div className={styles.memberBody}>
                <div className={styles.memberName}>{m.name}</div>
                <div className={styles.memberRole}>{m.role}</div>

                <div className={styles.socialRow}>
                  <a
                    className={styles.socialIcon}
                    href={m.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${m.name} LinkedIn`}
                  >
                    <LinkedInIcon />
                  </a>
                  {m.githubUrl ? (
                    <a
                      className={styles.socialIcon}
                      href={m.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${m.name} GitHub`}
                    >
                      <GitHubIcon />
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
