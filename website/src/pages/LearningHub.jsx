import { useEffect } from 'react'
import anime from 'animejs'
import styles from './LearningHub.module.css'

const SERVICES = [
  {
    icon: '🪣',
    name: 'S3 (Storage)',
    desc: 'Store files (images, PDFs, app assets) reliably and cheaply — like your cloud hard drive.',
    tone: 'purple',
  },
  {
    icon: '🌐',
    name: 'CloudFront (CDN)',
    desc: 'Deliver content faster by caching it close to users around the world.',
    tone: 'teal',
  },
  {
    icon: '⚡',
    name: 'Lambda (Serverless)',
    desc: 'Run code without managing servers. Great for APIs, automations, and event-driven apps.',
    tone: 'orange',
  },
  {
    icon: '🧭',
    name: 'IAM (Access)',
    desc: 'Control who can do what in AWS. The “permissions system” behind secure cloud accounts.',
    tone: 'blue',
  },
  {
    icon: '🗄',
    name: 'DynamoDB (NoSQL)',
    desc: 'A fast database for apps that need scale without babysitting servers.',
    tone: 'purple',
  },
  {
    icon: '🧱',
    name: 'VPC (Networking)',
    desc: 'Your private network in AWS — subnets, routing, and secure connectivity.',
    tone: 'teal',
  },
]

const ROADMAP = [
  {
    badge: 'M1',
    title: 'Cloud Foundations',
    desc: 'Learn basic cloud concepts, pricing models, and shared responsibility.',
  },
  {
    badge: 'M2',
    title: 'Core AWS Services',
    desc: 'Get comfortable with IAM, S3, EC2, VPC, and CloudWatch.',
  },
  {
    badge: 'M3',
    title: 'Build a Mini Project',
    desc: 'Host a static site, deploy an API, or automate a workflow.',
  },
  {
    badge: 'M4',
    title: 'Certification Prep',
    desc: 'Follow a structured study plan and practice with timed questions.',
  },
]

const CERTS = [
  {
    title: 'Start here: Cloud Practitioner (CLF-C02)',
    desc: 'Best first cert if you are brand new to AWS. Learn services, billing, and core concepts.',
    meta: ['Foundational', '90 mins', '$100 USD', 'Passing score: 700/1000'],
  },
  {
    title: 'Next: Solutions Architect Associate (SAA-C03)',
    desc: 'Designing on AWS: architectures, tradeoffs, and best practices. Most valuable early-career cert.',
    meta: ['Associate', '130 mins', '$150 USD', 'Passing score: 720/1000'],
  },
  {
    title: 'Then specialize',
    desc: 'Pick a direction: DevOps, Security, Data, Machine Learning, or Professional level.',
    meta: ['Pro/Specialty', '180 mins', '$300 USD', 'Passing score varies'],
  },
]

export default function LearningHub() {
  useEffect(() => {
    const init = (selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(18px)'
      })
    }

    init('[data-anim="hero"]')
    init('[data-anim="section"]')
    init('[data-anim="service"]')
    init('[data-anim="roadmap-node"]')
    init('[data-anim="cert-card"]')
    init('[data-anim="stat"]')
    init('[data-anim="cta"]')

    const line = document.querySelector('[data-anim="roadmap-line"]')
    if (line) {
      line.style.transformOrigin = 'top'
      line.style.transform = 'scaleY(0)'
    }

    const tl = anime.timeline({ easing: 'easeOutExpo' })
    tl.add({
      targets: '[data-anim="hero"]',
      opacity: [0, 1],
      translateY: [18, 0],
      delay: anime.stagger(90),
      duration: 700,
    }).add(
      {
        targets: '[data-anim="section"]',
        opacity: [0, 1],
        translateY: [18, 0],
        delay: anime.stagger(80),
        duration: 650,
      },
      '-=300'
    )

    // Roadmap: node-by-node reveal + line draw on scroll
    const roadmapWrap = document.querySelector('[data-io="roadmap"]')
    if (roadmapWrap) {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          anime({
            targets: '[data-anim="roadmap-line"]',
            scaleY: [0, 1],
            duration: 900,
            easing: 'easeOutExpo',
          })
          anime({
            targets: '[data-anim="roadmap-node"]',
            opacity: [0, 1],
            translateY: [18, 0],
            delay: anime.stagger(140),
            duration: 700,
            easing: 'easeOutExpo',
          })
          obs.disconnect()
        },
        { threshold: 0.25 }
      )
      obs.observe(roadmapWrap)
    }

    // Services: stagger by row on scroll
    const servicesWrap = document.querySelector('[data-io="services"]')
    if (servicesWrap) {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          anime({
            targets: '[data-anim="service"]',
            opacity: [0, 1],
            translateY: [18, 0],
            delay: anime.stagger(90),
            duration: 650,
            easing: 'easeOutExpo',
          })
          obs.disconnect()
        },
        { threshold: 0.2 }
      )
      obs.observe(servicesWrap)
    }

    // Stats: fade + count-up on scroll
    const statsWrap = document.querySelector('[data-io="stats"]')
    if (statsWrap) {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return

          anime({
            targets: '[data-anim="stat"]',
            opacity: [0, 1],
            translateY: [12, 0],
            delay: anime.stagger(110),
            duration: 650,
            easing: 'easeOutExpo',
          })

          document.querySelectorAll('[data-count]').forEach((el) => {
            const to = Number(el.getAttribute('data-count'))
            if (!Number.isFinite(to)) return
            const suffix = el.getAttribute('data-suffix') ?? ''

            const obj = { v: 0 }
            anime.remove(obj)
            anime({
              targets: obj,
              v: to,
              round: 1,
              duration: 900,
              easing: 'easeOutCubic',
              update: () => {
                el.textContent = `${obj.v}${suffix}`
              },
            })
          })

          obs.disconnect()
        },
        { threshold: 0.25 }
      )
      obs.observe(statsWrap)
    }
  }, [])

  return (
    <div className={styles.page}>
      {/* HERO */}
      <header className={`container ${styles.hero}`}>
        <div className={styles.heroLeft} data-anim="hero">
          <h1 className={styles.heroTitle}>CLOUD LEARNING HUB</h1>
          <p className={styles.heroSub}>
            A structured guide to go from “new to cloud” to shipping real AWS projects — with a clear roadmap,
            service explanations, certification guidance, and exam essentials.
          </p>
        </div>
        <div className={styles.heroRight} data-anim="hero" aria-hidden="true">
          <div className={styles.heroFrame}>
            <span className={styles.heroArt}>🧑‍💻</span>
          </div>
        </div>
      </header>

      {/* WHAT IS CLOUD */}
      <section className={`container ${styles.block}`} aria-label="What is cloud computing" data-anim="section">
        <h2 className={styles.blockTitle}>WHAT IS CLOUD COMPUTING?</h2>
        <p className={styles.blockSub}>
          Cloud computing means renting compute, storage, and services on-demand — so you can build and scale without
          owning physical servers.
        </p>

        <div className={styles.compareGrid}>
          <article className={styles.compareCard}>
            <h3 className={styles.compareTitle}>THE OLD WAY</h3>
            <p className={styles.compareDesc}>
              Buy servers, maintain hardware, upgrade capacity, and pay upfront even when traffic is low.
            </p>
          </article>
          <article className={`${styles.compareCard} ${styles.compareAccent}`}>
            <h3 className={styles.compareTitle}>THE CLOUD WAY</h3>
            <p className={styles.compareDesc}>
              Spin up what you need, pay only for usage, scale globally, and focus on building instead of maintaining.
            </p>
          </article>
        </div>
      </section>

      {/* AWS + STATS */}
      <section className={styles.awsSection} aria-label="What is AWS">
        <div className={`container ${styles.awsInner}`} data-anim="section">
          <div className={styles.awsCopy}>
            <h2 className={styles.awsTitle}>WHAT IS AWS?</h2>
            <p className={styles.awsSub}>
              Amazon Web Services is a collection of cloud services (compute, storage, networking, databases, AI, and
              more) used by startups, enterprises, and governments worldwide.
            </p>
          </div>

          <div className={styles.statsGrid} data-io="stats">
            <article className={styles.statCard} data-anim="stat">
              <div className={styles.statValue} data-count="33" data-suffix="+" aria-label="33 plus Regions">0+</div>
              <div className={styles.statLabel}>Regions</div>
            </article>
            <article className={styles.statCard} data-anim="stat">
              <div className={styles.statValue} data-count="105" data-suffix="+" aria-label="105 plus Availability Zones">0+</div>
              <div className={styles.statLabel}>Availability Zones</div>
            </article>
            <article className={styles.statCard} data-anim="stat">
              <div className={styles.statValue} data-count="200" data-suffix="+" aria-label="200 plus Services">0+</div>
              <div className={styles.statLabel}>Services</div>
            </article>
            <article className={styles.statCard} data-anim="stat">
              <div className={styles.statValue} data-count="1" data-suffix="M+" aria-label="Millions of customers">0M+</div>
              <div className={styles.statLabel}>Customers</div>
            </article>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className={`container ${styles.block}`} aria-label="AWS services you should learn">
        <h2 className={styles.blockTitle} data-anim="section">WHAT YOU CAN LEARN</h2>
        <p className={styles.blockSub} data-anim="section">
          These services show up everywhere in beginner projects and certification exams. Learn them in plain English,
          then practice by building small real apps.
        </p>

        <div className={styles.servicesGrid} data-io="services">
          {SERVICES.map((s) => (
            <article
              key={s.name}
              className={`${styles.serviceCard} ${styles[`tone__${s.tone}`]}`}
              data-anim="service"
            >
              <div className={styles.serviceTop}>
                <span className={styles.serviceIcon} aria-hidden="true">{s.icon}</span>
                <h3 className={styles.serviceName}>{s.name}</h3>
              </div>
              <p className={styles.serviceDesc}>{s.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ROADMAP */}
      <section className={`container ${styles.block}`} aria-label="Beginner roadmap">
        <div className={styles.roadmapHeader} data-anim="section">
          <h2 className={styles.roadmapTitle}>THE LEARNING ROADMAP</h2>
        </div>

        <div className={styles.roadmapWrap} data-io="roadmap">
          <div className={styles.roadmapLine} data-anim="roadmap-line" aria-hidden="true" />
          <div className={styles.roadmapNodes}>
            {ROADMAP.map((n) => (
              <article key={n.badge} className={styles.roadmapNode} data-anim="roadmap-node">
                <div className={styles.nodeBadge}>{n.badge}</div>
                <div className={styles.nodeBody}>
                  <h3 className={styles.nodeTitle}>{n.title}</h3>
                  <p className={styles.nodeDesc}>{n.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CERT GUIDANCE */}
      <section className={styles.certSection} aria-label="Certification guidance">
        <div className={`container ${styles.certInner}`}>
          <header className={styles.certHeader} data-anim="section">
            <h2 className={styles.certTitle}>BADGES & CERTIFICATIONS</h2>
            <p className={styles.certSub}>
              Certifications are optional — but they provide a structured target and proof of skill. Here’s a clean
              starting path.
            </p>
          </header>

          <div className={styles.certGrid}>
            {CERTS.map((c) => (
              <article key={c.title} className={styles.certCard} data-anim="cert-card">
                <h3 className={styles.certCardTitle}>{c.title}</h3>
                <p className={styles.certCardDesc}>{c.desc}</p>
                <ul className={styles.certMeta}>
                  {c.meta.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className={styles.examGrid} data-anim="section">
            <article className={styles.examCard}>
              <h3 className={styles.examTitle}>HOW EXAMS WORK</h3>
              <ul className={styles.examList}>
                <li><strong>Format:</strong> Multiple choice + multiple response</li>
                <li><strong>Delivery:</strong> Test center or online proctored</li>
                <li><strong>Scoring:</strong> Scaled score (100–1000). Passing score depends on the exam.</li>
                <li><strong>Retakes:</strong> You can retry after the waiting period if needed</li>
              </ul>
            </article>
            <article className={`${styles.examCard} ${styles.examAccent}`}>
              <h3 className={styles.examTitle}>EXAM INVESTMENT</h3>
              <ul className={styles.examList}>
                <li><strong>Cloud Practitioner:</strong> $100 USD</li>
                <li><strong>Associate:</strong> $150 USD</li>
                <li><strong>Professional/Specialty:</strong> $300 USD</li>
                <li><strong>Tip:</strong> Build projects while studying — it sticks faster</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* CAREER VALUE + CTA */}
      <section className={`container ${styles.career}`} aria-label="Career value" data-anim="section">
        <h2 className={styles.careerTitle}>WHY AWS CERTS MATTER</h2>
        <p className={styles.careerSub}>
          Certifications help you learn systematically, speak the language of architecture, and prove baseline skill to
          internships and entry-level roles. The real value comes when you pair cert knowledge with a visible project
          portfolio.
        </p>
      </section>

      <section className={`container ${styles.cta}`} aria-label="Ready to build" data-anim="cta">
        <h2 className={styles.ctaTitle}>READY TO BUILD YOUR SKILLS?</h2>
        <p className={styles.ctaSub}>
          Start with the roadmap, pick a service, and ship a tiny project this week. Momentum beats perfection.
        </p>
        <div className={styles.ctaBtns}>
          <a
            href="https://passport.awsclubmurdoch.com/join"
            target="_blank"
            rel="noreferrer"
            className="btn btn--accent"
          >
            JOIN THE CLUB
          </a>
          <a
            href="https://www.meetup.com/aws-cloud-club-at-murdoch-university-dubai/"
            target="_blank"
            rel="noreferrer"
            className="btn btn--outline"
          >
            VIEW MEETUP
          </a>
        </div>
      </section>
    </div>
  )
}
