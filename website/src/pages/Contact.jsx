import { useEffect, useMemo, useRef, useState } from 'react'
import anime from 'animejs'
import styles from './Contact.module.css'

const INSTAGRAM_LINK = 'https://www.instagram.com/murdochdubaislt/'
const MEETUP_LINK = 'https://www.meetup.com/aws-cloud-club-at-murdoch-university-dubai/'
const WHATSAPP_LINK =
  'https://wa.me/?text=Hey%20AWS%20Cloud%20Club%20Murdoch%20%E2%80%94%20how%20can%20I%20join%20the%20WhatsApp%20community%3F'
const LINKEDIN_LINK = 'https://www.linkedin.com/company/awsclubmurdoch'

const CONTACT_EMAIL = 'hello@awsclubmurdoch.com'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success

  const fieldRefs = useRef([])
  const sendBtnRef = useRef(null)
  const successRef = useRef(null)

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
  }, [])

  const setFieldRef = (el, idx) => {
    fieldRefs.current[idx] = el
  }

  const socialHoverIn = (el) => {
    if (!el) return
    anime.remove(el)
    anime({
      targets: el,
      translateY: -2,
      scale: 1.04,
      duration: 200,
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
      duration: 240,
      easing: 'easeOutQuad',
    })
  }

  const initOnScroll = () => {
    const els = document.querySelectorAll('[data-io="contact-entrance"]')
    if (!els.length) return

    els.forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(18px)'
    })

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          anime({
            targets: entry.target,
            opacity: [0, 1],
            translateY: [18, 0],
            duration: 700,
            easing: 'easeOutExpo',
          })
          obs.unobserve(entry.target)
        })
      },
      { threshold: 0.2 }
    )

    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }

  useEffect(() => {
    // Form fields: gentle stagger reveal on page load.
    const init = () => {
      const fields = fieldRefs.current.filter(Boolean)
      if (!fields.length) return
      fields.forEach((el) => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(14px)'
      })

      if (reducedMotion) {
        fields.forEach((el) => {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        })
        return
      }

      const tl = anime.timeline({ easing: 'easeOutExpo' })
      tl.add({
        targets: fields,
        opacity: [0, 1],
        translateY: [14, 0],
        delay: anime.stagger(80, { start: 0 }),
        duration: 650,
      })
    }

    const cleanup = initOnScroll()
    init()
    return () => cleanup?.()
  }, [reducedMotion])

  useEffect(() => {
    // Success state: fade/slide in after submit.
    if (status !== 'success') return
    const el = successRef.current
    if (!el) return

    if (reducedMotion) {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
      return
    }

    anime.remove(el)
    anime.set(el, { opacity: 0, translateY: 10 })
    anime({
      targets: el,
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 600,
      easing: 'easeOutExpo',
    })
  }, [status, reducedMotion])

  const onSubmit = (e) => {
    e.preventDefault()
    if (status === 'sending') return

    setStatus('sending')

    // Micro-interaction on click.
    if (sendBtnRef.current && !reducedMotion) {
      anime.remove(sendBtnRef.current)
      anime({
        targets: sendBtnRef.current,
        translateY: 2,
        scale: 0.98,
        duration: 120,
        easing: 'easeOutQuad',
      })
    }

    window.setTimeout(() => setStatus('success'), 700)
  }

  const sendLabel = status === 'sending' ? 'SENDING…' : 'TRANSMIT DATA'
  const successText =
    'This is how it has to look when your message drops successfully in our inbox. We’ll reply within 48 hours.'

  return (
    <div className={styles.page}>
      <div className={`container ${styles.hero}`}>
        <span className="tag">Get in Touch</span>
        <h1 className={styles.heading}>PING THE SERVER</h1>
        <p className={styles.sub}>
          Have a question, collaboration idea, or sponsorship inquiry? Send us a message and we’ll route it to the
          right team.
        </p>
      </div>

      <div className={`container ${styles.layout}`}>
        {/* Left: base station + social nodes */}
        <div className={styles.left} data-io="contact-entrance">
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelIcon} aria-hidden="true">📡</span>
              <span className={styles.panelTitle}>BASE STATION</span>
            </div>

            <div className={styles.panelBody}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Location</span>
                <span className={styles.metaValue}>Murdoch University Dubai</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaValue}>Knowledge Park, Block 18</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaValue}>IT Lab 3 (check events for schedule)</span>
              </div>

              <div className={styles.metaSep} aria-hidden="true" />

              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Email</span>
                <a className={styles.mailLink} href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>

          <div className={styles.panel} style={{ marginTop: '1rem' }} data-io="contact-entrance">
            <div className={styles.panelHeader}>
              <span className={styles.panelIcon} aria-hidden="true">🕸️</span>
              <span className={styles.panelTitle}>NETWORK NODES</span>
            </div>

            <div className={styles.nodeList}>
              <a
                className={styles.nodeLink}
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={(e) => socialHoverIn(e.currentTarget)}
                onMouseLeave={(e) => socialHoverOut(e.currentTarget)}
              >
                Instagram →
              </a>
              <a
                className={styles.nodeLink}
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={(e) => socialHoverIn(e.currentTarget)}
                onMouseLeave={(e) => socialHoverOut(e.currentTarget)}
              >
                WhatsApp Group →
              </a>
              <a
                className={styles.nodeLink}
                href={LINKEDIN_LINK}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={(e) => socialHoverIn(e.currentTarget)}
                onMouseLeave={(e) => socialHoverOut(e.currentTarget)}
              >
                LinkedIn →
              </a>
              <a
                className={styles.nodeLink}
                href={MEETUP_LINK}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={(e) => socialHoverIn(e.currentTarget)}
                onMouseLeave={(e) => socialHoverOut(e.currentTarget)}
              >
                Meetup →
              </a>
            </div>

            <div className={styles.note}>
              <strong>Open to current Murdoch University Dubai students</strong>
            </div>
            <div className={styles.noteSub}>Event registration happens on Meetup.com</div>
          </div>
        </div>

        {/* Right: form */}
        <div className={styles.right} data-io="contact-entrance">
          <div className={styles.formCard}>
            <div className={styles.formTop}>
              <span className={styles.formTitleIcon} aria-hidden="true">📨</span>
              <span className={styles.formTitle}>TRANSMIT DATA</span>
            </div>

            {status !== 'success' ? (
              <form className={styles.form} onSubmit={onSubmit}>
                <label className={styles.field} ref={(el) => setFieldRef(el, 0)} data-anim="contact-form-field">
                  <span className={styles.fieldLabel}>NAME</span>
                  <input
                    className={styles.input}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Enter your full name…"
                    required
                  />
                </label>

                <label className={styles.field} ref={(el) => setFieldRef(el, 1)} data-anim="contact-form-field">
                  <span className={styles.fieldLabel}>EMAIL</span>
                  <input
                    className={styles.input}
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@murdoch.edu.au"
                    required
                  />
                </label>

                <label className={styles.field} ref={(el) => setFieldRef(el, 2)} data-anim="contact-form-field">
                  <span className={styles.fieldLabel}>MESSAGE</span>
                  <textarea
                    className={styles.textarea}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Type your message here…"
                    rows={5}
                    required
                  />
                </label>

                <button
                  ref={sendBtnRef}
                  className={styles.sendBtn}
                  type="submit"
                  onMouseEnter={(e) => {
                    if (reducedMotion) return
                    anime.remove(e.currentTarget)
                    anime({
                      targets: e.currentTarget,
                      translateY: -2,
                      scale: 1.02,
                      duration: 220,
                      easing: 'easeOutQuad',
                    })
                  }}
                  onMouseLeave={(e) => {
                    if (reducedMotion) return
                    anime.remove(e.currentTarget)
                    anime({
                      targets: e.currentTarget,
                      translateY: 0,
                      scale: 1,
                      duration: 240,
                      easing: 'easeOutQuad',
                    })
                  }}
                  disabled={status === 'sending'}
                >
                  {sendLabel}
                </button>

                <div className={styles.secure}>
                  <span className={styles.secureDot} aria-hidden="true" />
                  <span>SECURE CONNECTION</span>
                </div>
              </form>
            ) : (
              <div className={styles.successWrap} ref={successRef}>
                <div className={styles.successHeader}>
                  <span className={styles.successIcon} aria-hidden="true">✅</span>
                  <span className={styles.successTitle}>TRANSMISSION SUCCESSFUL</span>
                </div>
                <p className={styles.successText}>{successText}</p>
                <p className={styles.successSub}>
                  You can send another message anytime. We love people who build and collaborate.
                </p>

                <button
                  className={styles.sendBtn}
                  type="button"
                  onClick={() => {
                    setForm({ name: '', email: '', message: '' })
                    setStatus('idle')
                  }}
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
