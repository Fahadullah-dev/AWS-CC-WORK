import { useEffect, useMemo, useRef } from 'react'
import anime from 'animejs'
import styles from './Events.module.css'

const INSTAGRAM_LINK = 'https://www.instagram.com/murdochdubaislt/'
const MEETUP_LINK =
  'https://www.meetup.com/aws-cloud-club-at-murdoch-university-dubai/'
const WHATSAPP_LINK = 'https://wa.me/?text=Hey%20AWS%20Cloud%20Club%20Murdoch%20%E2%80%94%20how%20can%20I%20join%20the%20WhatsApp%20community%3F'

// Update these in-place as events are announced.
const NEXT_RAID = {
  dateBadge: 'OCT 24',
  label: 'NEXT AVAILABLE RAID',
  title: 'DEPLOY YOUR FIRST SERVER',
  meta: { type: 'Workshop', dateTime: 'TBA · 6:00 PM', venue: 'Murdoch University Dubai' },
  description:
    'Get your first deployment under your belt. We’ll walk through the basics and ship something real together.',
  bullets: [
    'Beginner-friendly, hands-on session',
    'Bring a laptop (or pair with a teammate)',
    'Earn a Cloud Passport stamp for attending',
  ],
  registerUrl: MEETUP_LINK,
}

const REG_PROTOCOL = [
  { badge: 'M1', step: 'DISCOVER', desc: 'Watch Instagram + WhatsApp for the next drop.' },
  { badge: 'M2', step: 'SECURE SLOT', desc: 'Register on Meetup to lock your seat.' },
  { badge: 'M3', step: 'EQUIP TICKET', desc: 'Check your confirmation + event details.' },
  { badge: 'M4', step: 'JOIN RAID', desc: 'Show up, build, and earn your stamp.' },
]

const UPCOMING_EVENTS = [
  {
    name: 'S3 + CloudFront Masterclass',
    type: 'Workshop',
    dateTime: 'TBA · 6:00 PM',
    venue: 'Murdoch University Dubai',
    description:
      'Host and accelerate a real website with S3 and CloudFront. Learn best-practice caching and deployment.',
    registerUrl: MEETUP_LINK,
    tone: 'purple',
  },
  {
    name: 'Serverless Micro-Hack',
    type: 'Build Session',
    dateTime: 'TBA · 6:30 PM',
    venue: 'Murdoch University Dubai',
    description:
      'Ship a tiny serverless app end-to-end. Pair up, build fast, and demo your solution.',
    registerUrl: MEETUP_LINK,
    tone: 'blue',
  },
]

const PAST_EVENTS = [
  {
    name: 'Cloud 101: The Kickoff',
    type: 'Session',
    dateTime: 'Past event',
    venue: 'Murdoch University Dubai',
    registerUrl: MEETUP_LINK,
    tone: 'image',
  },
  {
    name: 'Game Dev on AWS',
    type: 'Workshop',
    dateTime: 'Past event',
    venue: 'Murdoch University Dubai',
    registerUrl: MEETUP_LINK,
    tone: 'purple',
  },
  {
    name: 'End of Year Buildathon',
    type: 'Buildathon',
    dateTime: 'Past event',
    venue: 'Murdoch University Dubai',
    registerUrl: MEETUP_LINK,
    tone: 'orange',
  },
]

export default function Events() {
  const socialIgRef = useRef(null)
  const socialWaRef = useRef(null)
  const socialMeetupRef = useRef(null)

  const hasUpcoming = useMemo(() => UPCOMING_EVENTS.length > 0, [])
  const hasPast = useMemo(() => PAST_EVENTS.length > 0, [])

  useEffect(() => {
    // Initial states (so reveals look consistent even on refresh)
    const init = (selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(18px)'
      })
    }

    init('[data-anim="hero"]')
    init('[data-anim="raid"]')
    init('[data-anim="protocol-step"]')
    init('[data-anim="upcoming-card"]')
    init('[data-anim="past-card"]')
    init('[data-anim="empty"]')
    init('[data-anim="social"]')

    const tl = anime.timeline({ easing: 'easeOutExpo' })

    tl.add({
      targets: '[data-anim="hero"]',
      opacity: [0, 1],
      translateY: [18, 0],
      delay: anime.stagger(80),
      duration: 650,
    })

    tl.add(
      {
        targets: '[data-anim="raid"]',
        opacity: [0, 1],
        translateY: [18, 0],
        duration: 650,
      },
      '-=250'
    )

    tl.add(
      {
        targets: '[data-anim="protocol-step"]',
        opacity: [0, 1],
        translateY: [18, 0],
        delay: anime.stagger(90),
        duration: 650,
      },
      '-=350'
    )

    if (hasUpcoming) {
      tl.add(
        {
          targets: '[data-anim="upcoming-card"]',
          opacity: [0, 1],
          translateY: [18, 0],
          delay: anime.stagger(90),
          duration: 650,
        },
        '-=350'
      )
    } else {
      tl.add(
        {
          targets: '[data-anim="empty"]',
          opacity: [0, 1],
          translateY: [12, 0],
          duration: 600,
        },
        '-=350'
      )
    }

    if (hasPast) {
      tl.add(
        {
          targets: '[data-anim="past-card"]',
          opacity: [0, 1],
          translateY: [18, 0],
          delay: anime.stagger(70),
          duration: 600,
        },
        '-=420'
      )
    }

    tl.add(
      {
        targets: '[data-anim="social"]',
        opacity: [0, 1],
        translateY: [18, 0],
        duration: 650,
      },
      '-=350'
    )
  }, [hasUpcoming, hasPast])

  const socialHoverIn = (el) => {
    if (!el) return
    anime.remove(el)
    anime({
      targets: el,
      translateY: -2,
      scale: 1.03,
      duration: 220,
      easing: 'easeOutQuad',
    })
  }

  const socialHoverOut = (el) => {
    if (!el) return
    anime.remove(el)
    anime({
      targets: el,
      translateY: 0,
      scale: 1,
      duration: 260,
      easing: 'easeOutQuad',
    })
  }

  return (
    <div className={styles.page}>
      <header className={`container ${styles.hero}`}>
        <div className={styles.heroTop} data-anim="hero">
          <h1 className={styles.heroTitle}>
            ACTIVE <span className={styles.heroTitleAccent}>QUESTS</span>
          </h1>
          <p className={styles.heroSub}>
            Scan our upcoming drops, hackathons, and guest speaker sessions. Build, learn, and level up
            your skills with real hands-on experience.
          </p>
        </div>

        <div className={styles.rule} aria-hidden="true" data-anim="hero" />
        <p className={styles.note} data-anim="hero">
          <span className={styles.noteDot} aria-hidden="true" />
          <strong>Note:</strong> Registration happens on{' '}
          <a href={MEETUP_LINK} target="_blank" rel="noreferrer" className={styles.inlineLink}>
            Meetup.com
          </a>
        </p>
      </header>

      <section className={`container ${styles.raidSection}`} aria-label="Next available raid" data-anim="raid">
        <div className={styles.raidHeader}>
          <h2 className={styles.raidLabel}>{NEXT_RAID.label}</h2>
          <span className={styles.raidPill}>{NEXT_RAID.meta.type}</span>
        </div>

        <article className={styles.raidCard}>
          <div className={styles.raidVisual} aria-hidden="true">
            <div className={styles.dateBadge}>{NEXT_RAID.dateBadge}</div>
            <div className={styles.serverRack}>
              <div className={styles.rackTop}>
                <span className={styles.rackText}>SERVER PRIME — 80%</span>
              </div>
              <div className={styles.rackBody}>
                <div className={styles.rackRow} />
                <div className={styles.rackRow} />
                <div className={styles.rackRow} />
                <div className={styles.rackRow} />
                <div className={styles.rackRow} />
              </div>
            </div>
          </div>

          <div className={styles.raidMain}>
            <h3 className={styles.raidTitle}>{NEXT_RAID.title}</h3>
            <p className={styles.raidDesc}>{NEXT_RAID.description}</p>

            <ul className={styles.raidFacts}>
              <li>
                <span className={styles.factIcon} aria-hidden="true">⏱</span>
                <span>{NEXT_RAID.meta.dateTime}</span>
              </li>
              <li>
                <span className={styles.factIcon} aria-hidden="true">📍</span>
                <span>{NEXT_RAID.meta.venue}</span>
              </li>
            </ul>

            <ul className={styles.raidBullets}>
              {NEXT_RAID.bullets.map((b) => (
                <li key={b}>
                  <span className={styles.bulletDot} aria-hidden="true" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className={styles.raidActions}>
              <a
                href={NEXT_RAID.registerUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.raidCta}
              >
                SIGN UP ON MEETUP
              </a>
              <p className={styles.raidNote}>Registration happens on Meetup.com</p>
            </div>
          </div>
        </article>
      </section>

      <section className={styles.protocolSection} aria-label="Quest registration protocol">
        <div className={`container ${styles.protocolInner}`}>
          <header className={styles.protocolHeader}>
            <h2 className={styles.protocolTitle}>QUEST REGISTRATION PROTOCOL</h2>
            <p className={styles.protocolSub}>
              We announce drops on Instagram and WhatsApp. To secure your spot, register on Meetup.
            </p>
          </header>

          <div className={styles.protocolGrid}>
            {REG_PROTOCOL.map((s) => (
              <article key={s.badge} className={styles.protocolStep} data-anim="protocol-step">
                <div className={styles.stepBadge}>{s.badge}</div>
                <h3 className={styles.stepTitle}>{s.step}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`container ${styles.section}`} aria-label="Upcoming events">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>UPCOMING QUESTS</h2>
          <div className={styles.sectionRule} aria-hidden="true" />
        </div>

        {UPCOMING_EVENTS.length === 0 ? (
          <div className={styles.empty} data-anim="empty">
            <div className={styles.emptyBox}>
              <h3 className={styles.emptyTitle}>No upcoming events yet.</h3>
              <p className={styles.emptySub}>
                Follow us to be the first to catch the next drop.
              </p>
              <div className={styles.emptyLinks}>
                <a
                  href={INSTAGRAM_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.emptyLink}
                >
                  Instagram →
                </a>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.emptyLink}
                >
                  WhatsApp →
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.upcomingGrid}>
            {UPCOMING_EVENTS.map((ev) => (
              <article
                key={ev.name}
                className={`${styles.questCard} ${styles[`tone__${ev.tone}`]}`}
                data-anim="upcoming-card"
              >
                <div className={styles.questMedia} aria-hidden="true">
                  <div className={styles.questMediaInner}>
                    <span className={styles.questGlyph}>⚔</span>
                    <span className={styles.questMediaLabel}>{ev.type}</span>
                  </div>
                </div>

                <div className={styles.questBody}>
                  <h3 className={styles.cardTitle}>{ev.name}</h3>
                  <p className={styles.cardDesc}>{ev.description}</p>

                  <p className={styles.questMeta}>
                    <span>⏱ {ev.dateTime}</span>
                    <span>📍 {ev.venue}</span>
                  </p>

                  <a
                    href={ev.registerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.registerBtn}
                  >
                    REGISTER
                  </a>
                </div>
              </article>
            ))}

            <article
              className={`${styles.questCard} ${styles.tone__ghost}`}
              aria-label="More loading"
              data-anim="upcoming-card"
            >
              <div className={styles.moreLoading}>
                <div className={styles.moreBox} aria-hidden="true">
                  <span className={styles.moreGlyph}>⌛</span>
                </div>
                <p className={styles.moreText}>MORE LOADING...</p>
                <a
                  href={MEETUP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.moreLink}
                >
                  View on Meetup →
                </a>
              </div>
            </article>
          </div>
        )}
      </section>

      <section className={`container ${styles.section}`} aria-label="Past events">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>PAST EVENTS</h2>
          <div className={styles.sectionRule} aria-hidden="true" />
        </div>

        <div className={styles.pastGrid}>
          {PAST_EVENTS.map((ev) => (
            <article
              key={ev.name}
              className={`${styles.pastCard} ${styles[`pastTone__${ev.tone}`]}`}
              data-anim="past-card"
            >
              <div className={styles.pastTop}>
                <span className={styles.pastPill}>{ev.type}</span>
              </div>
              <h3 className={styles.pastTitle}>{ev.name}</h3>
              <p className={styles.pastMeta}>
                <span>📍 {ev.venue}</span>
                <span>⏱ {ev.dateTime}</span>
              </p>
              <a
                href={ev.registerUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.pastLink}
              >
                View on Meetup →
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.socialStrip} aria-label="Social links">
        <div className={`container ${styles.socialInner}`} data-anim="social">
          <div className={styles.socialCopy}>
            <h2 className={styles.socialTitle}>
              DON&apos;T MISS
              <span className={styles.socialAccent}> A SINGLE</span>
              <br />
              <span className={styles.socialAccent}>DROP</span>
            </h2>
            <p className={styles.socialSub}>
              Join our community. Follow us on Instagram and message us on WhatsApp to get notified the
              second a new event goes live.
            </p>
          </div>

          <div className={styles.socialBtns}>
            <a
              ref={socialIgRef}
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className={styles.socialBtn}
              onMouseEnter={() => socialHoverIn(socialIgRef.current)}
              onMouseLeave={() => socialHoverOut(socialIgRef.current)}
            >
              Instagram
            </a>
            <a
              ref={socialWaRef}
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className={styles.socialBtnAlt}
              onMouseEnter={() => socialHoverIn(socialWaRef.current)}
              onMouseLeave={() => socialHoverOut(socialWaRef.current)}
            >
              WhatsApp
            </a>
            <a
              ref={socialMeetupRef}
              href={MEETUP_LINK}
              target="_blank"
              rel="noreferrer"
              className={styles.socialBtnAlt2}
              onMouseEnter={() => socialHoverIn(socialMeetupRef.current)}
              onMouseLeave={() => socialHoverOut(socialMeetupRef.current)}
            >
              Meetup
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
