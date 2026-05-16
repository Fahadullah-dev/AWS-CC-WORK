import { useEffect, useRef, useState } from "react";
import anime from "../utils/anime";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { getUpcomingEvents, MEETUP_GROUP_URL } from "../services/meetupService";
import { COLORS, FONTS, WEIGHT, SHADOW } from "../styles/tokens";
import {
  CalendarIcon,
  RadarIcon,
} from "../components/PixelIcons";

const INSTAGRAM_LINK = "https://www.instagram.com/murdochdubaislt/";
const WHATSAPP_LINK = "https://chat.whatsapp.com/E0HRAiTukmBF8KTj68pr3H";

// --- PAST EVENTS DATA ---
const PAST_EVENTS = [
  {
    id: "event-01",
    monthLabel: "MAY 2026", 
    dayName: "THU",
    dayNum: "14",
    name: "AWS SBG Launch Day",
    location: "Murdoch University Dubai, Dubai Knowledge Park",
    description: "Our first launch event! We officially launched the AWS Student Builder Group, introduced the E-Passport system, and scanned our very first builders into the network.",
    tags: ["LAUNCH", "NETWORKING", "PASSPORT"],
    images: [
      "/event/event1/IMG_9288%202%20Large.jpeg",
      "/event/event1/IMG_9280.jpg",
      "/event/event1/IMG_9319%20Large.jpeg",
      "/event/event1/IMG_9358.jpg"
    ],
    reelLink: "https://www.instagram.com/murdochdubaislt/reel/DYXDZeDsXML/",
  }
];

const REG_PROTOCOL = [
  {
    badge: "Step 1",
    color: COLORS.orange,
    step: "DISCOVER",
    icon: "https://img.icons8.com/fluency/48/wifi.png",
    desc: ["Follow our insta + join the whatsapp group — that's where drops happen first."],
  },
  {
    badge: "Step 2",
    color: COLORS.purple,
    step: "SECURE SLOT",
    icon: "https://img.icons8.com/external-tal-revivo-color-tal-revivo/48/external-meetup-app-for-hosting-in-person-events-with-similar-interests-logo-color-tal-revivo.png",
    desc: ["Hit the ", { href: MEETUP_GROUP_URL, text: "meetup.com" }, " Link and register — slots are limited, first come first serve."],
  },
  {
    badge: "Step 3",
    color: COLORS.blue,
    step: "EQUIP TICKET",
    icon: "https://img.icons8.com/doodle/96/ticket.png",
    desc: ["Check your email for the confirmation — that is your ticket in, you are good to go."],
  },
  {
    badge: "Step 4",
    color: COLORS.black,
    step: "JOIN RAID",
    icon: "https://img.icons8.com/comic/100/today.png",
    desc: ["Show up, scan in, eat good, build better."],
  },
];

function renderDesc(desc) {
  return desc.map((part, i) =>
    typeof part === "string" ? part : (
      <a key={i} href={part.href} target="_blank" rel="noreferrer"
        style={{ color: COLORS.orange, textDecoration: "underline", fontWeight: WEIGHT.bold }}>
        {part.text}
      </a>
    )
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "TBA";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
  } catch {
    return dateStr;
  }
}

function truncate(str, n) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n) + "..." : str;
}

const MEETUP_ICON = "https://img.icons8.com/external-tal-revivo-color-tal-revivo/48/external-meetup-app-for-hosting-in-person-events-with-similar-interests-logo-color-tal-revivo.png";

// --- IMAGE SLIDER COMPONENT ---
function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  if (!images || images.length === 0) return <div style={{ width: '100%', height: '100%', backgroundColor: '#eee' }}></div>;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', border: `3px solid ${COLORS.black}`, boxSizing: 'border-box' }}>
      <img src={images[currentIndex]} alt="Event slide" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      
      {images.length > 1 && (
        <>
          <button onClick={prevSlide} style={{ position: 'absolute', top: '50%', left: '5px', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', width: '25px', height: '25px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            &#10094;
          </button>
          <button onClick={nextSlide} style={{ position: 'absolute', top: '50%', right: '5px', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', width: '25px', height: '25px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            &#10095;
          </button>
          <div style={{ position: 'absolute', bottom: '5px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px' }}>
            {images.map((_, i) => (
              <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: i === currentIndex ? 'white' : 'rgba(255,255,255,0.4)' }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Events() {
  const [apiEvents, setApiEvents] = useState(null);
  const igBtnRef = useRef(null);
  const waBtnRef = useRef(null);
  const meetupBtnRef = useRef(null);
  const { isMobile, isTablet } = useBreakpoint();

  const C = {
    maxWidth: "1200px",
    marginInline: "auto",
    paddingInline: isMobile ? "16px" : isTablet ? "32px" : "48px",
  };

  useEffect(() => {
    getUpcomingEvents().then((data) => setApiEvents(data));
  }, []);

  useEffect(() => {
    if (apiEvents === null) {
      anime({
        targets: ".skeleton-card",
        opacity: [0.3, 1, 0.3],
        duration: 1200,
        loop: true,
        easing: "easeInOutSine",
      });
      return;
    }
    const sel = [
      '[data-ev="hero"]',
      '[data-ev="step"]',
      '[data-ev="card"]',
      '[data-ev="past-card"]',
      '[data-ev="social"]',
    ];
    sel.forEach((s) =>
      document.querySelectorAll(s).forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(18px)";
      }),
    );
    anime
      .timeline({ easing: "easeOutExpo" })
      .add({
        targets: '[data-ev="hero"]',
        opacity: [0, 1],
        translateY: [18, 0],
        delay: anime.stagger(80),
        duration: 650,
      })
      .add(
        {
          targets: '[data-ev="step"]',
          opacity: [0, 1],
          translateY: [18, 0],
          delay: anime.stagger(90),
          duration: 650,
        },
        "-=350",
      )
      .add(
        {
          targets: '[data-ev="card"]',
          opacity: [0, 1],
          translateY: [18, 0],
          delay: anime.stagger(80),
          duration: 650,
        },
        "-=350",
      )
      .add(
        {
          targets: '[data-ev="past-card"]',
          opacity: [0, 1],
          translateY: [18, 0],
          delay: anime.stagger(100),
          duration: 650,
        },
        "-=400",
      )
      .add(
        {
          targets: '[data-ev="social"]',
          opacity: [0, 1],
          translateY: [18, 0],
          duration: 650,
        },
        "-=300",
      );
  }, [apiEvents]);

  const hoverIn = (ref) => {
    if (ref.current) anime({ targets: ref.current, translateY: -3, duration: 200, easing: "easeOutQuad" });
  };
  const hoverOut = (ref) => {
    if (ref.current) anime({ targets: ref.current, translateY: 0, duration: 240, easing: "easeOutQuad" });
  };

  const loading = apiEvents === null;
  const hasEvents = !loading && apiEvents.length > 0;
  const upcomingQuests = hasEvents ? apiEvents : []; 

  const s = {
    page: { background: COLORS.bg, paddingBottom: 0 },

    hero: { paddingBlock: "48px 24px" },
    heroDecor: {
      width: 14, height: 14, background: COLORS.purple,
      border: `2px solid ${COLORS.black}`, marginBottom: "16px",
    },
    heroTitle: {
      fontFamily: FONTS.heading, fontWeight: WEIGHT.black,
      fontSize: isMobile ? "clamp(32px, 9vw, 48px)" : "clamp(40px, 5vw, 72px)",
      textTransform: "uppercase", letterSpacing: "0.02em", color: COLORS.black,
      marginBottom: "12px", lineHeight: 1.05,
    },
    heroTitleBox: { display: "inline-block", color: COLORS.orange, border: `4px solid ${COLORS.orange}`, padding: "0 0.2em", lineHeight: 1.15 },
    heroSub: { fontFamily: FONTS.mono, fontSize: isMobile ? "14px" : "16px", color: COLORS.muted, lineHeight: 1.8, maxWidth: "520px", marginBottom: "20px" },
    heroRule: { height: 0, borderTop: "2px dashed rgba(0,0,0,0.15)", marginTop: "8px" },

    protocolSection: { background: "#F0EFE9", paddingBlock: "56px", backgroundImage: "none" },
    protocolTitle: { fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: isMobile ? "clamp(24px, 7vw, 36px)" : "clamp(28px, 3vw, 48px)", textTransform: "uppercase", color: COLORS.black, textAlign: "center", marginBottom: "12px" },
    protocolSub: { fontFamily: FONTS.mono, fontSize: isMobile ? "14px" : "13px", color: COLORS.muted, textAlign: "center", lineHeight: 1.8, maxWidth: "520px", margin: "0 auto 36px" },
    protocolGrid: { display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", border: `3px solid ${COLORS.black}`, boxShadow: SHADOW.card },
    stepCard: (last) => ({
      background: COLORS.white, padding: "24px", borderRight: last ? "none" : `3px solid ${COLORS.black}`,
      display: "flex", flexDirection: "column", gap: "12px", position: "relative",
    }),
    stepBadge: (color) => ({ display: "inline-block", fontFamily: FONTS.mono, fontSize: "10px", fontWeight: WEIGHT.bold, letterSpacing: "0.1em", textTransform: "uppercase", background: color, color: COLORS.white, padding: "3px 8px" }),
    stepTitle: { fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: "15px", textTransform: "uppercase", color: COLORS.black },
    stepDesc: { fontFamily: FONTS.mono, fontSize: isMobile ? "14px" : "12px", color: COLORS.muted, lineHeight: 1.7 },

    upcomingSection: { paddingBlock: "48px" },
    sectionHeader: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" },
    sectionTitle: { fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: isMobile ? "22px" : "clamp(1.4rem, 3.5vw, 2rem)", textTransform: "uppercase", color: COLORS.black },
    sectionRule: { flex: 1, height: "2px", background: "#CCCCCC" },
    questGrid: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)", border: `3px solid ${COLORS.black}`, boxShadow: SHADOW.card },
    questCard: (last) => ({
      background: COLORS.white, borderRight: isMobile || isTablet ? "none" : last ? "none" : `3px solid ${COLORS.black}`,
      borderBottom: (isMobile || isTablet) ? `3px solid ${COLORS.black}` : "none", display: "flex", flexDirection: "column", overflow: "hidden",
    }),
    questThumb: (color) => ({ background: color, padding: "20px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderBottom: `3px solid ${COLORS.black}`, minHeight: "90px" }),
    typeBadge: { fontFamily: FONTS.mono, fontSize: "10px", fontWeight: WEIGHT.bold, letterSpacing: "0.1em", textTransform: "uppercase", background: COLORS.white, color: COLORS.black, padding: "3px 8px", border: `2px solid ${COLORS.black}` },
    dateBadgeSm: { fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: "22px", color: "rgba(255,255,255,0.5)" },
    questBody: { padding: "20px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 },
    questName: { fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: isMobile ? "18px" : "15px", textTransform: "uppercase", color: COLORS.black },
    questDesc: { fontFamily: FONTS.mono, fontSize: isMobile ? "14px" : "12px", color: COLORS.muted, lineHeight: 1.7, flex: 1 },
    questActions: { display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" },
    btnRsvp: { display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: FONTS.mono, fontSize: "11px", fontWeight: WEIGHT.bold, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.white, background: "#ED1C40", border: `2px solid ${COLORS.black}`, padding: "6px 12px", textDecoration: "none", cursor: "pointer" },
    rsvpSoon: { fontFamily: FONTS.mono, fontSize: "11px", color: "#AAAAAA", textTransform: "uppercase", letterSpacing: "0.08em", border: "2px dashed #CCCCCC", padding: "6px 12px" },
    ghostThumb: { background: "#F0EFE9", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `3px solid ${COLORS.black}`, minHeight: "90px" },

    skeletonCard: { background: COLORS.skeleton, border: `2px solid ${COLORS.black}`, height: "280px" },
    skeletonGrid: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: "0", border: `3px solid ${COLORS.black}`, boxShadow: SHADOW.card },

    socialStrip: { background: COLORS.bgDark, paddingBlock: "64px", backgroundImage: "none" },
    socialInner: { ...C, textAlign: "center" },
    socialIconWrap: { display: "flex", justifyContent: "center", marginBottom: "16px" },
    socialTitle: { fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: isMobile ? "clamp(24px, 7vw, 36px)" : "clamp(28px, 3vw, 48px)", textTransform: "uppercase", color: COLORS.white, marginBottom: "12px" },
    socialSub: { fontFamily: FONTS.mono, fontSize: isMobile ? "14px" : "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, maxWidth: "460px", margin: "0 auto 28px" },
    socialBtns: { display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", flexDirection: isMobile ? "column" : "row", alignItems: "center" },
    socialBtn: { display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: FONTS.heading, fontWeight: WEIGHT.bold, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em", background: "#E1306C", color: COLORS.white, padding: "12px 22px", border: `2px solid ${COLORS.black}`, boxShadow: SHADOW.card, textDecoration: "none", transition: "transform 0.15s", width: isMobile ? "100%" : "auto", justifyContent: isMobile ? "center" : "flex-start", boxSizing: "border-box" },
    socialBtnWa: { display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: FONTS.heading, fontWeight: WEIGHT.bold, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em", background: "#25D366", color: COLORS.white, padding: "12px 22px", border: `2px solid ${COLORS.black}`, boxShadow: SHADOW.card, textDecoration: "none", transition: "transform 0.15s", width: isMobile ? "100%" : "auto", justifyContent: isMobile ? "center" : "flex-start", boxSizing: "border-box" },
    socialBtnMeetup: { display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: FONTS.heading, fontWeight: WEIGHT.bold, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em", background: "#ED1C40", color: COLORS.white, padding: "12px 22px", border: `2px solid ${COLORS.black}`, boxShadow: SHADOW.card, textDecoration: "none", transition: "transform 0.15s", width: isMobile ? "100%" : "auto", justifyContent: isMobile ? "center" : "flex-start", boxSizing: "border-box" },
  };

  return (
    <div style={s.page}>
      {/* ── HERO ── */}
      <header style={{ ...C, ...s.hero }}>
        <div style={s.heroDecor} data-ev="hero" aria-hidden />
        <div data-ev="hero">
          <h1 style={s.heroTitle}>
            ACTIVE <span style={s.heroTitleBox}>QUESTS</span>
          </h1>
        </div>
        <p style={s.heroSub} data-ev="hero">
          What's live right now? Workshops, buildathons, and community meetups. Find your next event, lock in your spot, and stack those AWS skills, no cap.
        </p>
        <div style={s.heroRule} data-ev="hero" aria-hidden />
      </header>

      {/* ── QUEST REGISTRATION PROTOCOL ── */}
      <section style={s.protocolSection}>
        <div style={C}>
          <h2 style={s.protocolTitle} data-ev="hero">
            QUEST REGISTRATION PROTOCOL
          </h2>
          <p style={s.protocolSub} data-ev="hero">
            We use Instagram and WhatsApp to announce drops. We use{" "}
            <a href={MEETUP_GROUP_URL} target="_blank" rel="noreferrer"
              style={{ color: COLORS.orange, textDecoration: "underline", fontWeight: WEIGHT.bold }}>
              Meetup
            </a>{" "}
            to secure your slot. No RSVP = No Entry.
          </p>
          <div style={s.protocolGrid}>
            {REG_PROTOCOL.map((step, i) => (
              <article
                key={step.step}
                data-ev="step"
                style={s.stepCard(i === REG_PROTOCOL.length - 1)}
              >
                <span style={s.stepBadge(step.color)}>{step.badge}</span>
                <img
                  src={step.icon}
                  width={28}
                  height={28}
                  alt={step.step}
                  style={{ display: "block" }}
                />
                <h3 style={s.stepTitle}>{step.step}</h3>
                <p style={s.stepDesc}>{renderDesc(step.desc)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPCOMING QUESTS ── */}
      <section style={{ ...C, ...s.upcomingSection }}>
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>UPCOMING QUESTS</h2>
          <div style={s.sectionRule} />
        </div>

        {loading && (
          <div style={s.skeletonGrid}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton-card" style={{ ...s.skeletonCard, borderRight: i < 2 && !isMobile ? `2px solid ${COLORS.black}` : "none" }} />
            ))}
          </div>
        )}

        {!loading && (
          <div style={s.questGrid}>
            {upcomingQuests.map((ev, i) => {
              const isLast = i === upcomingQuests.length - 1;
              return (
                <article key={ev.name || i} data-ev="card" style={s.questCard(isLast)}>
                  <div style={s.questThumb(COLORS.purple)}>
                    <span style={s.typeBadge}>EVENT</span>
                    <span style={s.dateBadgeSm}>{formatDate(ev.local_date)}</span>
                  </div>
                  <div style={s.questBody}>
                    <h3 style={s.questName}>{ev.name}</h3>
                    <p style={s.questDesc}>{truncate(ev.description, 100)}</p>
                    <div style={s.questActions}>
                      <a href={ev.link} target="_blank" rel="noreferrer" style={s.btnRsvp}>
                        <img src={MEETUP_ICON} width={14} height={14} alt="" style={{ display: "block" }} />
                        RSVP
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}

            {upcomingQuests.length === 0 && [0, 1, 2].map((i) => (
              <article key={i} data-ev="card" style={{
                background: COLORS.bg, border: `3px dashed #CCCCCC`, display: "flex", flexDirection: "column",
                overflow: "hidden", borderRight: i < 2 && !isMobile ? `3px dashed #CCCCCC` : "none",
              }}>
                <div style={s.ghostThumb}><CalendarIcon /></div>
                <div style={s.questBody}>
                  <h3 style={{ ...s.questName }}>COMING SOON</h3>
                  <p style={s.questDesc}>Quest loading...</p>
                  <div style={s.questActions}>
                    <span style={s.rsvpSoon}>RSVP OPENS SOON</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ── COMPLETED RAIDS (EDITORIAL LAYOUT) ── */}
      <section style={{ ...C, paddingBottom: "64px" }}>
        {PAST_EVENTS.map((event, idx) => (
          <div key={event.id} data-ev="past-card" style={{ marginBottom: "40px" }}>
            
            {/* MONTH HEADER */}
            <div style={{ display: 'inline-block', backgroundColor: '#1e1e1e', color: 'white', padding: '6px 16px', fontFamily: FONTS.mono, fontWeight: WEIGHT.bold, fontSize: '12px', letterSpacing: '0.1em' }}>
              {event.monthLabel}
            </div>
            <div style={{ height: '2px', backgroundColor: '#1e1e1e', width: '100%', marginBottom: '24px' }}></div>

            {/* EVENT ROW */}
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '20px' : '30px', alignItems: 'flex-start' }}>
              
              {/* DATE COLUMN */}
              <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: isMobile ? 'baseline' : 'center', gap: isMobile ? '10px' : '0', width: isMobile ? '100%' : '60px', flexShrink: 0 }}>
                <span style={{ fontFamily: FONTS.mono, fontSize: '13px', fontWeight: WEIGHT.bold, color: '#666', letterSpacing: '0.05em' }}>{event.dayName}</span>
                <span style={{ fontFamily: FONTS.heading, fontSize: '38px', fontWeight: WEIGHT.black, color: '#111', lineHeight: '1' }}>{event.dayNum}</span>
              </div>

              {/* IMAGE SLIDER */}
              <div style={{ width: isMobile ? '100%' : '320px', height: '200px', flexShrink: 0 }}>
                <ImageSlider images={event.images} />
              </div>

              {/* CONTENT */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
                  {/* ADDED color: COLORS.black to fix the invisible text! */}
                  <h3 style={{ fontFamily: FONTS.heading, fontSize: isMobile ? '20px' : '24px', fontWeight: WEIGHT.black, textTransform: 'uppercase', color: COLORS.black, margin: '0 0 8px 0', lineHeight: '1.2' }}>
                    {event.name}
                  </h3>
                  <a href={event.reelLink || event.link || INSTAGRAM_LINK} target="_blank" rel="noreferrer" style={{ color: '#E1306C', textDecoration: 'none', fontSize: '24px', lineHeight: '1', fontWeight: 'bold' }}>
                    &#8599;
                  </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <img src="https://img.icons8.com/fluency/48/marker.png" width={14} height={14} alt="pin" />
                  <span style={{ fontFamily: FONTS.mono, fontSize: '12px', color: '#666', fontWeight: 'bold' }}>{event.location}</span>
                </div>

                <p style={{ fontFamily: FONTS.mono, fontSize: '13px', color: '#444', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                  {event.description}
                </p>

                {/* TAGS & BUTTONS ROW */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: 'auto' }}>
                  {event.tags.map(tag => (
                    <span key={tag} style={{ border: '1px solid #ccc', padding: '4px 10px', fontSize: '10px', fontFamily: FONTS.mono, fontWeight: 'bold', color: '#666', backgroundColor: '#fafafa' }}>
                      {tag}
                    </span>
                  ))}
                  
                  {/* INSTAGRAM REEL BUTTON */}
                  {event.reelLink && (
                    <a href={event.reelLink} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginLeft: isMobile ? '0' : 'auto', marginTop: isMobile ? '10px' : '0', backgroundColor: '#E1306C', color: 'white', padding: '6px 12px', textDecoration: 'none', fontFamily: FONTS.mono, fontSize: '10px', fontWeight: 'bold', border: '2px solid black', boxShadow: '2px 2px 0px black' }}>
                      <img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-reel.png" width={14} height={14} alt="Reel" />
                      VIEW REEL
                    </a>
                  )}
                </div>
              </div>
            </div>

            {idx !== PAST_EVENTS.length - 1 && (
              <div style={{ width: '100%', height: '1px', borderBottom: '1px dashed #ccc', marginTop: '40px' }}></div>
            )}
          </div>
        ))}
      </section>

      {/* ── NEVER MISS A DROP ── */}
      <section style={s.socialStrip} data-ev="social">
        <div style={s.socialInner}>
          <div style={s.socialIconWrap}>
            <img src="https://img.icons8.com/fluency/48/cloud.png" width={36} height={36} alt="" style={{ display: "block" }} />
          </div>
          <h2 style={s.socialTitle}>NEVER MISS A DROP</h2>
          <div style={s.socialBtns}>
            <a ref={igBtnRef} href={INSTAGRAM_LINK} target="_blank" rel="noreferrer" style={s.socialBtn} onMouseEnter={() => hoverIn(igBtnRef)} onMouseLeave={() => hoverOut(igBtnRef)}>
              <img src="https://img.icons8.com/fluency/48/instagram-new.png" width={20} height={20} alt="" style={{ display: "block" }} />
              FOLLOW ON INSTAGRAM
            </a>
            <a ref={waBtnRef} href={WHATSAPP_LINK} target="_blank" rel="noreferrer" style={s.socialBtnWa} onMouseEnter={() => hoverIn(waBtnRef)} onMouseLeave={() => hoverOut(waBtnRef)}>
              <img src="https://img.icons8.com/fluency/48/whatsapp.png" width={20} height={20} alt="" style={{ display: "block" }} />
              JOIN WHATSAPP
            </a>
            <a ref={meetupBtnRef} href={MEETUP_GROUP_URL} target="_blank" rel="noreferrer" style={s.socialBtnMeetup} onMouseEnter={() => hoverIn(meetupBtnRef)} onMouseLeave={() => hoverOut(meetupBtnRef)}>
              <img src={MEETUP_ICON} width={20} height={20} alt="" style={{ display: "block" }} />
              VIEW ON MEETUP
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}