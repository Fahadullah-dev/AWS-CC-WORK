import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import anime from 'animejs'
import styles from './Home.module.css'
import { COLORS, FONTS, TYPOGRAPHY, SPACING, SHAPE } from '../styles/tokens'

/* ── "Why Join?" cards data (matches reference: 3 cards) ── */
const WHY_JOIN = [
  {
    icon: '☁',
    title: 'Learn Cloud',
    color: 'purple',
    desc: 'Get hands-on with AWS services. From S3 to Lambda, learn by doing — not by reading slides.',
  },
  {
    icon: '⚙',
    title: 'Build Projects',
    color: 'accent',
    desc: 'Ship real software. Club projects become portfolio pieces that speak louder than grades.',
  },
  {
    icon: '🌐',
    title: 'Network & Grow',
    color: 'blue',
    desc: 'Connect with AWS professionals, club alumni, and fellow builders across the region.',
  },
]

/* ── Semester timeline data ── */
const JOURNEY = [
  { phase: 'Phase 1', label: 'Onboarding',  icon: '📍' },
  { phase: 'Phase 2', label: 'Workshops',   icon: '📚' },
  { phase: 'Phase 3', label: 'Buildathon',  icon: '⚡' },
  { phase: 'Phase 4', label: 'Showcase',    icon: '🏆' },
]

/* ── Scroll-into-view hook ── */
function useScrollReveal(selector, options = {}) {
  useEffect(() => {
    const targets = document.querySelectorAll(selector)
    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target,
              opacity:    [0, 1],
              translateY: [options.y ?? 30, 0],
              duration:   options.duration ?? 700,
              easing:     'easeOutExpo',
              delay:      options.stagger
                ? anime.stagger(options.stagger, { start: 0 })
                : 0,
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    targets.forEach((t) => {
      t.style.opacity = '0'
      observer.observe(t)
    })
    return () => observer.disconnect()
  }, [selector, options.y, options.duration, options.stagger])
}

export default function Home() {
  /* Hero animation refs */
  const heroTagRef    = useRef(null)
  const heroH1Ref     = useRef(null)
  const heroSubRef    = useRef(null)
  const heroBtnsRef   = useRef(null)
  const heroImgRef    = useRef(null)
  const timelineRef   = useRef(null)

  /* ── Hero entrance (stagger on mount) ── */
  useEffect(() => {
    const tl = anime.timeline({ easing: 'easeOutExpo' })

    tl.add({ targets: heroTagRef.current,
              opacity: [0, 1], translateY: [-10, 0], duration: 500 })
      .add({ targets: heroH1Ref.current.querySelectorAll('.hero-word'),
              opacity: [0, 1], translateY: [40, 0],
              duration: 700, delay: anime.stagger(80) }, '-=200')
      .add({ targets: heroSubRef.current,
              opacity: [0, 1], translateY: [20, 0], duration: 600 }, '-=400')
      .add({ targets: heroBtnsRef.current.querySelectorAll('a'),
              opacity: [0, 1], translateY: [16, 0],
              duration: 600, delay: anime.stagger(100) }, '-=350')
      .add({ targets: heroImgRef.current,
              opacity: [0, 1], scale: [0.9, 1], duration: 800 }, '-=800')
  }, [])

  /* ── Scroll-based reveals ── */
  useScrollReveal('[data-reveal="why-join-card"]', { stagger: 120, y: 40 })
  useScrollReveal('[data-reveal="section"]', { y: 24, duration: 650 })
  useScrollReveal('[data-reveal="journey-node"]', { stagger: 150, y: 20 })

  /* ── Timeline line draw on scroll ── */
  useEffect(() => {
    const line = document.querySelector('[data-reveal="timeline-line"]')
    if (!line) return
    line.style.width = '0%'
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          anime({
            targets: line,
            width: ['0%', '100%'],
            duration: 1200,
            easing: 'easeOutExpo',
          })
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(line)
    return () => observer.disconnect()
  }, [])

  /* ── Helpers: split heading text into spans ── */
  const heroLines = [
    { text: 'BUILD THE',  accent: false },
    { text: 'FUTURE',     accent: false },
    { text: 'ONE PIXEL',  accent: false },
    { text: 'AT A TIME_', accent: true  },
  ]

  return (
    <>
      {/* ════════════════════════════════════════
          1. HERO
      ════════════════════════════════════════ */}
      <section className={styles.hero} id="hero">
        {/* Background glow */}
        <div className={styles.heroBg} aria-hidden="true">
          <div className={styles.glow1} />
          <div className={styles.glow2} />
          <div className={styles.grid}  />
        </div>

        <div className={`container ${styles.heroInner}`}>
          {/* Text side */}
          <div className={styles.heroText}>
            <span ref={heroTagRef} className="tag" style={{ opacity: 0 }}>
              AWS Cloud Club · Murdoch Dubai
            </span>

            <h1 className={styles.heroH1} ref={heroH1Ref}>
              {heroLines.map(({ text, accent }, i) => (
                <span
                  key={i}
                  className={`hero-word ${accent ? styles.accentLine : ''}`}
                  style={{ display: 'block', opacity: 0 }}
                >
                  {text}
                </span>
              ))}
            </h1>

            <p className={styles.heroSub} ref={heroSubRef} style={{ opacity: 0 }}>
              A community of builders, cloud enthusiasts, and coders at Murdoch
              University Dubai. Build real projects, earn your Cloud Passport, and
              launch your tech career.
            </p>

            <div className={styles.heroBtns} ref={heroBtnsRef}>
              <Link
                to="/passport-gateway"
                className="btn btn--primary"
                id="hero-join-btn"
                style={{ opacity: 0 }}
              >
                JOIN THE CLUB
              </Link>
              <Link
                to="/events"
                className="btn btn--outline"
                id="hero-events-btn"
                style={{ opacity: 0 }}
              >
                → EXPLORE EVENTS
              </Link>
            </div>
          </div>

          {/* Mascot / image side */}
          <div className={styles.heroImg} ref={heroImgRef} style={{ opacity: 0 }}>
            <div className={styles.heroImgFrame}>
              <div className={styles.heroImgCorner} />
              <span className={styles.heroRobot} role="img" aria-label="cloud robot mascot">
                🤖
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          2. WHAT WE DO
      ════════════════════════════════════════ */}
      <section className={`section ${styles.whatWeDo}`} id="what-we-do">
        <div className="container">
          <div className={styles.sectionTitleWrap} data-reveal="section">
            <h2 className={styles.sectionTitle}>
              {'< '}WHAT IS THIS CLUB?{' />'}
            </h2>
          </div>

          <div data-reveal="section" className={styles.whatWeDoCard}>
            {/* Terminal title bar */}
            <div className={styles.terminalBar}>
              <span className={styles.dot} style={{ background: '#ff5f56' }} />
              <span className={styles.dot} style={{ background: '#ffbd2e' }} />
              <span className={styles.dot} style={{ background: '#27c93f' }} />
              <span className={styles.terminalTitle}>aws-cloud-club — zsh</span>
            </div>

            <div className={styles.terminalBody}>
              <p className={styles.terminalLine}>
                <span className={styles.prompt}>&gt; </span>
                The AWS Student Building Group is an official university community
                dedicated to giving students hands-on experience with cloud
                computing and modern tech stacks.
              </p>
              <p className={styles.terminalLine}>
                <span className={styles.prompt}>&gt; </span>
                We don't just talk about tech. We deploy, we break things, and we
                build solutions.
              </p>
              <p className={`${styles.terminalLine} ${styles.promptAccent}`}>
                <span>&gt; </span>
                <em>Zero prior experience required. Just curiosity_</em>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          3. WHY JOIN?
      ════════════════════════════════════════ */}
      <section className={`section ${styles.whyJoin}`} id="why-join">
        <div className="container">
          <div className={styles.whyJoinHeader} data-reveal="section">
            <h2 className={styles.whyJoinTitle}>WHY JOIN?</h2>
            <div className={styles.whyJoinRule} aria-hidden="true" />
          </div>

          <div className={styles.whyJoinGrid}>
            {WHY_JOIN.map((b, i) => (
              <article
                key={i}
                data-reveal="why-join-card"
                className={`${styles.whyJoinCard} ${styles[`card--${b.color}`]}`}
                style={{ opacity: 0 }}
              >
                <div className={styles.cardIcon}>{b.icon}</div>
                <h3 className={styles.cardTitle}>{b.title}</h3>
                <p className={styles.cardDesc}>{b.desc}</p>
                <div className={styles.cardCorner} aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          4. SEMESTER JOURNEY (TIMELINE)
      ════════════════════════════════════════ */}
      <section className={`section ${styles.journey}`} id="semester-journey">
        <div className="container">
          <div data-reveal="section" className={styles.journeyMeta}>
            <h2 className={styles.journeyH2}>THE SEMESTER</h2>
            <div className={styles.journeyHighlight}>JOURNEY</div>
            <p className={styles.journeySub}>
              Here is what you can expect when you sign up for the ride.
            </p>
          </div>

          <div className={styles.timelineWrap} ref={timelineRef}>
            {/* The animated line */}
            <div className={styles.timelineLine}>
              <div
                data-reveal="timeline-line"
                className={styles.timelineProgress}
                style={{ width: '0%' }}
              />
            </div>

            {/* Nodes */}
            <div className={styles.timelineNodes}>
              {JOURNEY.map((item, i) => (
                <div
                  key={i}
                  data-reveal="journey-node"
                  className={styles.timelineNode}
                  style={{ opacity: 0 }}
                >
                  <div className={styles.nodeCircle}>
                    <span>{item.icon}</span>
                  </div>
                  <p className={styles.nodePhase}>{item.phase}</p>
                  <p className={styles.nodeLabel}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          5. FINAL CTA BANNER
      ════════════════════════════════════════ */}
      <section className={styles.ctaBanner} id="final-cta">
        <div className={styles.ctaBg} aria-hidden="true">
          <div className={styles.ctaGlow1} />
          <div className={styles.ctaGlow2} />
          <div className={styles.ctaDiamond} />
        </div>

        <div className={`container ${styles.ctaInner}`} data-reveal="section">
          <h2 className={styles.ctaHeading}>READY TO START BUILDING?</h2>
          <p className={styles.ctaSub}>
            Join the club today and get access to our exclusive learning hub,
            upcoming events, and a community of builders.
          </p>
          <div className={styles.ctaButtons}>
            <Link to="/passport-gateway" className="btn btn--accent" id="final-cta-join-btn">
              JOIN THE CLUB NOW
            </Link>
            <Link
              to="/learning-hub"
              className="btn btn--outline"
              id="final-cta-hub-btn"
            >
              LEARNING HUB
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
