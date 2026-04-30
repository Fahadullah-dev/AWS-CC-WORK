import { useEffect, useMemo, useRef } from 'react'
import anime from 'animejs'
import styles from './PassportGateway.module.css'
import { PASSPORT_LINKS } from '../config/passportLinks'

const FEATURES = [
  {
    num: '01',
    title: 'CHECK-IN TO EVENTS',
    icon: '📅',
    body:
      'Scan your passport QR at workshops, buildathons, and social events to auto-log attendance.',
  },
  {
    num: '02',
    title: 'FARM XP',
    icon: '⚡',
    body:
      'Earn XP for deploying your first project, completing cloud labs, and helping others on Discord.',
  },
  {
    num: '03',
    title: 'UNLOCK BADGES',
    icon: '🛡️',
    body:
      'Collect pixel badges for achievements, display them on your profile, and impress recruiters.',
  },
]

function useInViewReveal(targetSelector, onEnter) {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll(targetSelector))
    if (!targets.length) return

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          onEnter(entry.target)
          obs.unobserve(entry.target)
        })
      },
      { threshold: 0.22 }
    )

    targets.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [targetSelector, onEnter])
}

export default function PassportGateway() {
  const statusRef = useRef(null)
  const heroH1Ref = useRef(null)
  const heroSubRef = useRef(null)
  const heroBtnsRef = useRef(null)
  const cardRef = useRef(null)

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
  }, [])

  useEffect(() => {
    if (reducedMotion) return

    // Status badge: subtle flicker/pulse (1–2 cycles)
    anime.remove(statusRef.current)
    anime({
      targets: statusRef.current,
      opacity: [1, 0.65, 1],
      duration: 520,
      easing: 'easeInOutSine',
      loop: 2,
    })

    // Hero heading: stagger reveal word-by-word
    const words = heroH1Ref.current?.querySelectorAll('[data-hero-word]')
    const btns = heroBtnsRef.current?.querySelectorAll('a')

    const tl = anime.timeline({ easing: 'easeOutExpo' })

    tl.add({
      targets: words,
      opacity: [0, 1],
      translateY: [26, 0],
      duration: 720,
      delay: anime.stagger(85),
    })
      .add(
        {
          targets: heroSubRef.current,
          opacity: [0, 1],
          translateY: [14, 0],
          duration: 640,
        },
        '-=420'
      )
      .add(
        {
          targets: btns,
          opacity: [0, 1],
          translateY: [12, 0],
          duration: 560,
          delay: anime.stagger(110),
        },
        '-=380'
      )

    // Passport card mockup: gentle float loop
    anime.remove(cardRef.current)
    anime({
      targets: cardRef.current,
      translateY: [-6, 6],
      direction: 'alternate',
      easing: 'easeInOutSine',
      duration: 2400,
      loop: true,
    })
  }, [reducedMotion])

  useEffect(() => {
    if (!reducedMotion) return
    document.querySelectorAll('[data-io="how-card"]').forEach((el) => {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
    document.querySelectorAll('[data-io="final-cta"]').forEach((el) => {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
  }, [reducedMotion])

  useInViewReveal('[data-io="how-card"]', (el) => {
    if (reducedMotion) {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
      return
    }

    const group = el.closest('[data-io="how-grid"]')
    const all = group ? Array.from(group.querySelectorAll('[data-io="how-card"]')) : [el]
    const idx = all.indexOf(el)

    anime.set(el, { opacity: 0, translateY: 18 })
    anime({
      targets: el,
      opacity: [0, 1],
      translateY: [18, 0],
      duration: 650,
      easing: 'easeOutExpo',
      delay: Math.max(0, idx) * 120,
    })

    const numEl = el.querySelector('[data-io="num"]')
    if (numEl) {
      anime.remove(numEl)
      anime.set(numEl, { scale: 0.9, opacity: 0 })
      anime({
        targets: numEl,
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 420,
        easing: 'easeOutBack',
        delay: Math.max(0, idx) * 120 + 160,
      })
    }
  })

  useInViewReveal('[data-io="final-cta"]', (el) => {
    if (reducedMotion) {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
      return
    }
    anime.set(el, { opacity: 0, translateY: 18 })
    anime({
      targets: el,
      opacity: [0, 1],
      translateY: [18, 0],
      duration: 720,
      easing: 'easeOutExpo',
    })
  })

  const headlineWords = ['CLAIM', 'YOUR']
  const headlineAccentWords = ['BUILDER', 'PASSPORT']

  return (
    <div className={styles.page}>
      {/* HERO */}
      <section className={`container ${styles.hero}`}>
        <div className={styles.heroLeft}>
          <span ref={statusRef} className={styles.status} aria-label="System access status">
            SYSTEM ACCESS: RESTRICTED
          </span>

          <h1 ref={heroH1Ref} className={styles.h1}>
            <span className={styles.h1Line}>
              {headlineWords.map((w, i) => (
                <span key={i} data-hero-word className={styles.h1Word} style={{ opacity: 0 }}>
                  {w}
                </span>
              ))}
            </span>
            <span className={`${styles.h1Line} ${styles.h1Accent}`}>
              {headlineAccentWords.map((w, i) => (
                <span key={i} data-hero-word className={styles.h1Word} style={{ opacity: 0 }}>
                  {w}
                </span>
              ))}
            </span>
          </h1>

          <div className={styles.heroSubWrap} ref={heroSubRef} style={{ opacity: 0 }}>
            <p className={styles.heroSub}>
              Your official ID for the AWS Student Builder Group. Track your progress, earn XP for attending events,
              unlock exclusive badges, and level up your cloud skills as you build.
            </p>
          </div>

          <div ref={heroBtnsRef} className={styles.heroBtns}>
            <a
              href={PASSPORT_LINKS.initialize}
              className={styles.ctaPrimary}
              onClick={(e) => {
                e.preventDefault()
                window.open(PASSPORT_LINKS.initialize, '_self')
              }}
              style={{ opacity: 0 }}
            >
              <span className={styles.ctaIcon} aria-hidden="true">🪪</span>
              INITIALIZE PASSPORT
            </a>
            <a
              href={PASSPORT_LINKS.terminal}
              className={styles.ctaSecondary}
              onClick={(e) => {
                e.preventDefault()
                window.open(PASSPORT_LINKS.terminal, '_self')
              }}
              style={{ opacity: 0 }}
            >
              <span className={styles.ctaIcon} aria-hidden="true">⌘</span>
              ACCESS TERMINAL
            </a>
          </div>
        </div>

        <div className={styles.heroRight} aria-hidden="true">
          <div className={styles.cardWrap} ref={cardRef}>
            <div className={styles.passportCard}>
              <div className={styles.cardTop}>
                <div className={styles.cardAvatar}>🧑‍💻</div>
                <div className={styles.cardMeta}>
                  <div className={styles.cardName}>PLAYER ONE</div>
                  <div className={styles.cardRole}>BUILDER</div>
                </div>
                <div className={styles.cardTier}>TIER: ALPHA</div>
              </div>

              <div className={styles.cardXP}>
                <div className={styles.cardXPLabel}>
                  <span>XP</span>
                  <span className={styles.cardXPValue}>420 / 1000</span>
                </div>
                <div className={styles.cardXPBar}>
                  <div className={styles.cardXPFill} style={{ width: '42%' }} />
                </div>
              </div>

              <div className={styles.cardBadges}>
                <span className={styles.badge} title="S3 Starter">🪣</span>
                <span className={styles.badge} title="Lambda Runner">⚡</span>
                <span className={styles.badge} title="VPC Navigator">🧭</span>
                <span className={styles.badge} title="CloudFront Speed">🌐</span>
              </div>

              <div className={styles.cardCorner} />
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className={`container ${styles.divider}`} aria-hidden="true" />

      {/* HOW IT WORKS */}
      <section className={`container ${styles.how}`}>
        <h2 className={styles.howH2}>HOW THE SYSTEM WORKS</h2>
        <p className={styles.howSub}>
          This isn&apos;t just a mailing list. It&apos;s a game. Participate, learn, and prove your skills to the server.
        </p>

        <div className={styles.howGrid} data-io="how-grid">
          {FEATURES.map((f) => (
            <article key={f.num} className={styles.howCard} data-io="how-card">
              <div className={styles.howNum} data-io="num">{f.num}</div>
              <div className={styles.howIcon} aria-hidden="true">{f.icon}</div>
              <h3 className={styles.howTitle}>{f.title}</h3>
              <p className={styles.howBody}>{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.finalWrap}>
        <div className={`container ${styles.final}`} data-io="final-cta">
          <h2 className={styles.finalH2}>READY TO BEGIN YOUR JOURNEY?</h2>
          <p className={styles.finalSub}>
            Creating a passport takes 30 seconds. You just need your university email.
          </p>
          <a
            href={PASSPORT_LINKS.create}
            className={styles.finalBtn}
            onClick={(e) => {
              e.preventDefault()
              window.open(PASSPORT_LINKS.create, '_self')
            }}
            onMouseEnter={(e) => {
              if (reducedMotion) return
              anime.remove(e.currentTarget)
              anime({
                targets: e.currentTarget,
                scale: 1.04,
                duration: 240,
                easing: 'easeOutQuad',
              })
            }}
            onMouseLeave={(e) => {
              if (reducedMotion) return
              anime.remove(e.currentTarget)
              anime({
                targets: e.currentTarget,
                scale: 1,
                duration: 260,
                easing: 'easeOutQuad',
              })
            }}
          >
            CREATE MY PASSPORT
          </a>
        </div>
      </section>
    </div>
  )
}

