import { useEffect, useRef, useState } from 'react';
import anime from '../utils/anime';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { COLORS, FONTS, WEIGHT, SHADOW } from '../styles/tokens';

const INSTAGRAM_LINK = 'https://www.instagram.com/murdochdubaislt/';
const WHATSAPP_LINK = 'https://chat.whatsapp.com/E0HRAiTukmBF8KTj68pr3H?mode=gi_t';
const MEETUP_LINK = 'https://www.meetup.com/aws-sbg-at-murdoch-university-dubai/';
const EMAIL_ADDRESS = '34675845@student.murdoch.edu.au';

export default function Contact() {
  const { isMobile } = useBreakpoint();

  const badgeRef = useRef(null);
  const illustrationRef = useRef(null);
  const baseStationRef = useRef(null);
  const networkNodesRef = useRef(null);
  const emailCardRef = useRef(null);
  const copyBtnRef = useRef(null);
  const meetupBtnRef = useRef(null);
  const igBtnRef = useRef(null);
  const waBtnRef = useRef(null);

  const [copyState, setCopyState] = useState('idle');

  const C = {
    maxWidth: '1100px',
    marginInline: 'auto',
    paddingInline: isMobile ? '16px' : '48px',
  };

  useEffect(() => {
    if (badgeRef.current) {
      anime({
        targets: badgeRef.current,
        opacity: [1, 0.3, 1, 0.3, 1],
        duration: 800,
        easing: 'linear',
      });
    }

    anime({
      targets: '.contact-word',
      opacity: [0, 1],
      translateY: [30, 0],
      delay: anime.stagger(80),
      duration: 600,
      easing: 'easeOutExpo',
    });

    if (illustrationRef.current) {
      anime({
        targets: illustrationRef.current,
        translateY: [0, -10, 0],
        duration: 700,
        easing: 'easeOutBounce',
        delay: 400,
      });

      anime({
        targets: illustrationRef.current,
        translateY: [-4, 4],
        duration: 2500,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        delay: 1200,
      });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const inView = (ref) => {
        if (!ref.current) return false;
        const r = ref.current.getBoundingClientRect();
        return r.top < window.innerHeight - 60;
      };

      if (inView(baseStationRef) && baseStationRef.current._animated !== true) {
        baseStationRef.current._animated = true;
        anime({
          targets: baseStationRef.current,
          opacity: [0, 1],
          translateX: [-30, 0],
          duration: 700,
          easing: 'easeOutExpo',
        });
      }
      if (inView(networkNodesRef) && networkNodesRef.current._animated !== true) {
        networkNodesRef.current._animated = true;
        anime({
          targets: networkNodesRef.current,
          opacity: [0, 1],
          translateX: [-30, 0],
          duration: 700,
          delay: 150,
          easing: 'easeOutExpo',
        });
      }
      if (inView(emailCardRef) && emailCardRef.current._animated !== true) {
        emailCardRef.current._animated = true;
        anime({
          targets: emailCardRef.current,
          opacity: [0, 1],
          translateX: [30, 0],
          duration: 700,
          easing: 'easeOutExpo',
        });
        anime({
          targets: '.info-row',
          opacity: [0, 1],
          translateX: [20, 0],
          delay: anime.stagger(100),
          duration: 500,
          easing: 'easeOutExpo',
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    setTimeout(handleScroll, 300);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL_ADDRESS);
    setCopyState('copied');
    if (copyBtnRef.current) {
      anime({
        targets: copyBtnRef.current,
        scale: [1, 0.95, 1.05, 1],
        duration: 400,
        easing: 'easeOutElastic',
      });
    }
    setTimeout(() => setCopyState('idle'), 2000);
  };

  const handleCopyMainBtn = () => {
    navigator.clipboard.writeText(EMAIL_ADDRESS);
    setCopyState('copied2');
    if (copyBtnRef.current) {
      anime({
        targets: copyBtnRef.current,
        scale: [1, 0.95, 1.05, 1],
        duration: 400,
        easing: 'easeOutElastic',
      });
    }
    setTimeout(() => setCopyState('idle'), 2000);
  };

  const hoverBtn = (ref, enter) => {
    if (!ref.current) return;
    anime({
      targets: ref.current,
      translateY: enter ? -3 : 0,
      boxShadow: enter ? '4px 6px 0px #111' : '3px 3px 0px #111',
      duration: 150,
      easing: 'easeOutExpo',
    });
  };

  const socialBtn = () => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 18px',
    background: COLORS.orange,
    border: '2px solid #111',
    boxShadow: '3px 3px 0px #111',
    color: COLORS.white,
    fontFamily: FONTS.mono,
    fontWeight: WEIGHT.bold,
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    textDecoration: 'none',
    cursor: 'pointer',
    marginBottom: '10px',
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: 0,
  });

  return (
    <div style={{ background: COLORS.bg, paddingBottom: '64px' }}>

      {/* ── HERO ── */}
      <header style={{ ...C, paddingBlock: '48px 0' }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: '32px',
        }}>
          {/* LEFT */}
          <div style={{ flex: '0 0 55%', maxWidth: isMobile ? '100%' : '55%' }}>
            <span
              ref={badgeRef}
              className="contact-word"
              style={{
                display: 'inline-block',
                border: '1px solid #111',
                fontFamily: FONTS.mono,
                fontSize: '11px',
                padding: '3px 8px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '16px',
                color: COLORS.black,
              }}
            >
              COMM CHANNEL OPEN
            </span>

            <h1
              className="contact-word"
              style={{
                fontFamily: FONTS.heading,
                fontWeight: WEIGHT.black,
                fontSize: 'clamp(36px, 5vw, 64px)',
                textTransform: 'uppercase',
                color: COLORS.black,
                lineHeight: 1.1,
                marginBottom: '20px',
                margin: '0 0 20px 0',
              }}
            >
              PING THE{' '}
              <span
                style={{
                  color: '#4A90D9',
                  border: '2px solid #4A90D9',
                  padding: '2px 12px',
                  display: 'inline-block',
                }}
              >
                SERVER
              </span>
            </h1>

            <div
              className="contact-word"
              style={{
                borderLeft: '3px solid #111',
                paddingLeft: '16px',
              }}
            >
              <p style={{
                fontFamily: FONTS.mono,
                fontSize: '15px',
                lineHeight: 1.7,
                color: COLORS.black,
                maxWidth: '420px',
                margin: 0,
              }}>
                Got questions about AWS, want to partner for an event, or just need help? Send us a packet.
              </p>
            </div>
          </div>

          {/* RIGHT — Illustration */}
          <div
            ref={illustrationRef}
            className="contact-word"
            style={{
              border: '3px solid #111',
              boxShadow: '5px 5px 0px #111',
              background: '#111111',
              padding: '0',
              overflow: 'hidden',
              width: '100%',
              maxWidth: isMobile ? '200px' : '280px',
              aspectRatio: '1/1',
              alignSelf: isMobile ? 'center' : 'auto',
              marginInline: isMobile ? 'auto' : '0',
              flexShrink: 0,
            }}
          >
            <img
              src="/pixel-clock.png"
              alt="AWS SBG pixel clock"
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain', padding: '12px', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </header>

      {/* ── DASHED DIVIDER ── */}
      <div style={{ ...C, paddingBlock: '0' }}>
        <div style={{
          borderTop: '2px dashed #111',
          position: 'relative',
          margin: '48px 0',
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            border: '2px solid #111',
            background: COLORS.bg,
            position: 'absolute',
            left: '50%',
            top: '-6px',
            transform: 'translateX(-50%)',
          }} />
        </div>
      </div>

      {/* ── MAIN TWO COLUMNS ── */}
      <div style={{
        ...C,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '24px',
        alignItems: 'flex-start',
      }}>

        {/* LEFT COLUMN */}
        <div style={{ flex: isMobile ? '1' : '0 0 35%', display: 'flex', flexDirection: 'column', gap: '0' }}>

          {/* CARD 1 — BASE STATION */}
          <div
            ref={baseStationRef}
            style={{
              background: COLORS.white,
              border: '2px solid #111',
              boxShadow: '4px 4px 0px #111',
              padding: '24px',
              position: 'relative',
              marginBottom: '16px',
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-6px',
              left: '-6px',
              width: '12px',
              height: '12px',
              background: '#4A90D9',
            }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '0' }}>
              <svg width="20" height="24" viewBox="0 0 20 24" style={{ flexShrink: 0, marginTop: '4px' }}>
                <rect x="6" y="0" width="8" height="8" fill={COLORS.orange} />
                <rect x="4" y="2" width="12" height="6" fill={COLORS.orange} />
                <rect x="8" y="8" width="4" height="6" fill={COLORS.orange} />
                <rect x="6" y="14" width="8" height="4" fill={COLORS.orange} />
                <rect x="4" y="10" width="12" height="6" fill={COLORS.orange} opacity="0.6" />
              </svg>
              <div>
                <h2 style={{
                  fontFamily: FONTS.heading,
                  fontWeight: WEIGHT.black,
                  fontSize: '28px',
                  textTransform: 'uppercase',
                  color: COLORS.black,
                  margin: 0,
                  lineHeight: 1.1,
                }}>
                  BASE<br />STATION
                </h2>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #ddd', margin: '16px 0' }} />

            <p style={{ fontFamily: FONTS.mono, fontWeight: WEIGHT.bold, fontSize: '12px', color: COLORS.black, marginBottom: '4px', margin: '0 0 4px 0' }}>LOCATION:</p>
            <p style={{ fontFamily: FONTS.mono, fontSize: '13px', color: COLORS.muted, margin: '0 0 2px 0' }}>Murdoch University Dubai</p>
            <p style={{ fontFamily: FONTS.mono, fontSize: '13px', color: COLORS.muted, margin: '0 0 12px 0' }}>Dubai Knowledge Park, Block 18</p>
          </div>

          {/* CARD 2 — NETWORK NODES */}
          <div
            ref={networkNodesRef}
            style={{
              background: COLORS.purple,
              border: '2px solid #111',
              boxShadow: '4px 4px 0px #111',
              padding: '24px',
              position: 'relative',
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              width: '12px',
              height: '12px',
              background: COLORS.orange,
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
                <rect x="8" y="0" width="4" height="4" fill="white" />
                <rect x="0" y="14" width="4" height="4" fill="white" />
                <rect x="16" y="14" width="4" height="4" fill="white" />
                <rect x="9" y="4" width="2" height="6" fill="white" opacity="0.6" />
                <rect x="2" y="10" width="8" height="2" fill="white" opacity="0.6" />
                <rect x="10" y="10" width="8" height="2" fill="white" opacity="0.6" />
              </svg>
              <h2 style={{
                fontFamily: FONTS.heading,
                fontWeight: WEIGHT.black,
                fontSize: '26px',
                textTransform: 'uppercase',
                color: COLORS.white,
                margin: 0,
                lineHeight: 1.1,
              }}>
                NETWORK<br />NODES
              </h2>
            </div>

            <p style={{
              color: COLORS.white,
              fontFamily: FONTS.mono,
              fontSize: '13px',
              opacity: 0.85,
              marginBottom: '20px',
              margin: '0 0 20px 0',
              lineHeight: 1.5,
            }}>
              Connect with us directly on our active channels.
            </p>

            <a
              ref={meetupBtnRef}
              href={MEETUP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={socialBtn()}
              onMouseEnter={() => hoverBtn(meetupBtnRef, true)}
              onMouseLeave={() => hoverBtn(meetupBtnRef, false)}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/96/external-meetup-app-for-hosting-in-person-events-with-similar-interests-logo-color-tal-revivo.png" width={18} height={18} alt="" style={{ display: 'block' }} />
                MEETUP
              </span>
              <span>&#8594;</span>
            </a>

            <a
              ref={igBtnRef}
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={socialBtn()}
              onMouseEnter={() => hoverBtn(igBtnRef, true)}
              onMouseLeave={() => hoverBtn(igBtnRef, false)}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="https://img.icons8.com/fluency/48/instagram-new.png" width={18} height={18} alt="" style={{ display: 'block' }} />
                INSTAGRAM
              </span>
              <span>&#8594;</span>
            </a>

            <a
              ref={waBtnRef}
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...socialBtn(), marginBottom: '0' }}
              onMouseEnter={() => hoverBtn(waBtnRef, true)}
              onMouseLeave={() => hoverBtn(waBtnRef, false)}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="https://img.icons8.com/fluency/48/whatsapp.png" width={18} height={18} alt="" style={{ display: 'block' }} />
                WHATSAPP GROUP
              </span>
              <span>&#8594;</span>
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div ref={emailCardRef} style={{ flex: 1, border: '2px solid #111', boxShadow: '4px 4px 0px #111', overflow: 'hidden' }}>

          {/* Header bar */}
          <div style={{
            background: COLORS.bgDark,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28CA41' }} />
            </div>
            <span style={{
              fontFamily: FONTS.mono,
              fontSize: '12px',
              color: COLORS.white,
              marginLeft: '8px',
              letterSpacing: '0.08em',
            }}>
              CONTACT.SH
            </span>
          </div>

          {/* Card body */}
          <div style={{ background: COLORS.white, padding: '32px' }}>

            {/* Envelope icon */}
            <div style={{
              width: '52px',
              height: '52px',
              border: '2px solid #111',
              padding: '10px',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}>
              <svg width="32" height="24" viewBox="0 0 32 24">
                <rect x="0" y="0" width="32" height="24" fill="none" stroke="#FF6B2B" strokeWidth="2" />
                <rect x="0" y="0" width="14" height="10" fill="#FF6B2B" opacity="0.3" />
                <rect x="18" y="0" width="14" height="10" fill="#FF6B2B" opacity="0.3" />
                <rect x="12" y="6" width="8" height="6" fill="#FF6B2B" />
                <rect x="0" y="0" width="2" height="24" fill="#FF6B2B" opacity="0.4" />
                <rect x="30" y="0" width="2" height="24" fill="#FF6B2B" opacity="0.4" />
              </svg>
            </div>

            <h2 style={{
              fontFamily: FONTS.heading,
              fontWeight: WEIGHT.black,
              fontSize: 'clamp(28px, 4vw, 48px)',
              textTransform: 'uppercase',
              textAlign: 'center',
              color: COLORS.black,
              lineHeight: 1.1,
              marginBottom: '12px',
              margin: '0 0 12px 0',
            }}>
              DROP AN EMAIL
            </h2>

            <p style={{
              fontFamily: FONTS.mono,
              fontSize: '13px',
              color: COLORS.muted,
              textAlign: 'center',
              marginBottom: '24px',
              margin: '0 0 24px 0',
              lineHeight: 1.5,
            }}>
              It's the fastest way. Guarantee a reply within 48 hours.
            </p>

            {/* Email display box */}
            <div style={{
              border: '2px solid #111',
              padding: '16px',
              textAlign: 'center',
              marginBottom: '16px',
              background: COLORS.bg,
            }}>
              <span style={{
                color: COLORS.orange,
                fontFamily: FONTS.mono,
                fontWeight: WEIGHT.bold,
                fontSize: 'clamp(13px, 2vw, 18px)',
                wordBreak: 'break-all',
              }}>
                {EMAIL_ADDRESS}
              </span>
            </div>

            {/* Open in mail client button */}
            <a
              href={`mailto:${EMAIL_ADDRESS}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '14px',
                background: COLORS.purple,
                color: COLORS.white,
                border: '2px solid #111',
                boxShadow: '3px 3px 0px #111',
                fontFamily: FONTS.mono,
                fontWeight: WEIGHT.bold,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                textDecoration: 'none',
                cursor: 'pointer',
                marginBottom: '10px',
                boxSizing: 'border-box',
                borderRadius: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16">
                <rect x="0" y="6" width="12" height="4" fill="white" />
                <rect x="8" y="2" width="4" height="4" fill="white" />
                <rect x="8" y="10" width="4" height="4" fill="white" />
                <rect x="12" y="4" width="4" height="8" fill="white" />
              </svg>
              OPEN IN MAIL CLIENT
            </a>

            {/* Copy email address button */}
            <button
              ref={copyBtnRef}
              onClick={handleCopyMainBtn}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '14px',
                background: copyState === 'copied2' ? '#F0FFF0' : COLORS.white,
                color: copyState === 'copied2' ? '#28CA41' : COLORS.black,
                border: '2px solid #111',
                boxShadow: '3px 3px 0px #111',
                fontFamily: FONTS.mono,
                fontWeight: WEIGHT.bold,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                boxSizing: 'border-box',
                borderRadius: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16">
                <rect x="4" y="0" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" />
                <rect x="0" y="4" width="12" height="12" fill={COLORS.white} stroke="currentColor" strokeWidth="2" />
              </svg>
              {copyState === 'copied2' ? '✓ COPIED!' : 'COPY EMAIL ADDRESS'}
            </button>

            {/* Dashed divider */}
            <div style={{ borderTop: '1px dashed #ccc', margin: '24px 0', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: '-3px', width: '6px', height: '6px', background: '#ccc' }} />
              <div style={{ position: 'absolute', right: 0, top: '-3px', width: '6px', height: '6px', background: '#ccc' }} />
            </div>

            {/* Info rows */}
            {[
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <rect x="1" y="1" width="16" height="16" fill="none" stroke="#111" strokeWidth="2" />
                    <rect x="8" y="4" width="2" height="6" fill="#111" />
                    <rect x="8" y="8" width="4" height="2" fill="#111" />
                  </svg>
                ),
                label: 'RESPONSE TIME',
                value: 'Within 48 hours',
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <rect x="1" y="3" width="16" height="14" fill="none" stroke="#111" strokeWidth="2" />
                    <rect x="1" y="3" width="16" height="4" fill="#111" opacity="0.15" />
                    <rect x="4" y="0" width="2" height="6" fill="#111" />
                    <rect x="12" y="0" width="2" height="6" fill="#111" />
                    <rect x="4" y="10" width="2" height="2" fill="#111" />
                    <rect x="8" y="10" width="2" height="2" fill="#111" />
                    <rect x="12" y="10" width="2" height="2" fill="#111" />
                  </svg>
                ),
                label: 'AVAILABILITY',
                value: 'Mon – Fri · 9AM – 6PM GST',
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <rect x="3" y="1" width="12" height="14" fill="none" stroke="#111" strokeWidth="2" />
                    <rect x="6" y="4" width="6" height="2" fill="#111" opacity="0.5" />
                    <rect x="6" y="8" width="6" height="2" fill="#111" opacity="0.5" />
                    <rect x="6" y="12" width="4" height="2" fill="#111" opacity="0.5" />
                    <rect x="5" y="15" width="8" height="4" fill={COLORS.bg} stroke="#111" strokeWidth="1.5" />
                    <rect x="7" y="16" width="4" height="2" fill="#111" opacity="0.4" />
                  </svg>
                ),
                label: 'STUDENT ONLY',
                value: 'Open to Murdoch University Dubai students',
              },
            ].map((row, i) => (
              <div
                key={i}
                className="info-row"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '12px 0',
                  borderBottom: i < 2 ? '1px dashed #eee' : 'none',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  border: '2px solid #111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {row.icon}
                </div>
                <div>
                  <p style={{ fontFamily: FONTS.mono, fontSize: '11px', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 2px 0' }}>{row.label}</p>
                  <p style={{ fontFamily: FONTS.mono, fontSize: '13px', color: COLORS.black, margin: 0 }}>{row.value}</p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}
