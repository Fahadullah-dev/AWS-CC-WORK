import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import anime from "../utils/anime";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { COLORS, FONTS, WEIGHT, SHADOW } from "../styles/tokens";

const WHY_JOIN = [
  {
    icon: "https://img.icons8.com/fluency/48/cloud.png",
    title: "LEARN CLOUD",
    bg: COLORS.purple,
    textColor: COLORS.white,
    desc: "real AWS skills. the tools companies are literally hiring for rn",
  },
  {
    icon: "https://img.icons8.com/fluency/48/console.png",
    title: "BUILD PROJECTS",
    bg: COLORS.blue,
    textColor: COLORS.white,
    desc: "Team projects, real apps, a portfolio that slaps connect — AWS experts, industry people, and students who are on the same grind",
  },
  {
    icon: "https://img.icons8.com/fluency/48/network.png",
    title: "NETWORK & GROW",
    bg: COLORS.white,
    textColor: COLORS.black,
    desc: "Connect with industry professionals, AWS experts, and like-minded students at Murdoch Dubai.",
  },
];

const JOURNEY = [
  {
    phase: "Phase 01",
    label: "ONBOARDING",
    icon: "https://img.icons8.com/fluency/48/marker.png",
    color: COLORS.purple,
  },
  {
    phase: "Phase 02",
    label: "WORKSHOPS",
    icon: "https://img.icons8.com/fluency/48/books.png",
    color: COLORS.blue,
  },
  {
    phase: "Phase 03",
    label: "BUILDATHON",
    icon: "https://img.icons8.com/fluency/48/lightning-bolt.png",
    color: COLORS.orange,
  },
  {
    phase: "Phase 04",
    label: "SHOWCASE",
    icon: "https://img.icons8.com/fluency/48/trophy.png",
    color: COLORS.black,
  },
];

function scrollReveal(selector, opts = {}) {
  const els = document.querySelectorAll(selector);
  if (!els.length) return () => {};
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        anime({
          targets: e.target,
          opacity: [0, 1],
          translateY: [opts.y ?? 30, 0],
          duration: opts.dur ?? 700,
          easing: "easeOutExpo",
          delay: opts.stagger ? anime.stagger(opts.stagger) : 0,
        });
        obs.unobserve(e.target);
      });
    },
    { threshold: 0.15 },
  );
  els.forEach((el) => {
    el.style.opacity = "0";
    obs.observe(el);
  });
  return () => obs.disconnect();
}

export default function Home() {
  const { isMobile, isTablet } = useBreakpoint();
  const heroTagRef = useRef(null);
  const heroH1Ref = useRef(null);
  const heroSubRef = useRef(null);
  const heroBtnsRef = useRef(null);
  const heroImgRef = useRef(null);
  const robotRef = useRef(null);
  const lineRef = useRef(null);

  const C = {
    maxWidth: "1200px",
    marginInline: "auto",
    paddingInline: isMobile ? "16px" : isTablet ? "32px" : "48px",
  };

  useEffect(() => {
    const tl = anime.timeline({ easing: "easeOutExpo" });
    tl.add({
      targets: heroTagRef.current,
      opacity: [0, 1],
      translateY: [-10, 0],
      duration: 500,
    })
      .add(
        {
          targets: heroH1Ref.current?.querySelectorAll("[data-word]"),
          opacity: [0, 1],
          translateY: [40, 0],
          duration: 700,
          delay: anime.stagger(80),
        },
        "-=200",
      )
      .add(
        {
          targets: heroSubRef.current,
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 600,
        },
        "-=400",
      )
      .add(
        {
          targets: heroBtnsRef.current?.querySelectorAll("a"),
          opacity: [0, 1],
          translateY: [16, 0],
          duration: 600,
          delay: anime.stagger(100),
        },
        "-=350",
      )
      .add(
        {
          targets: heroImgRef.current,
          opacity: [0, 1],
          scale: [0.9, 1],
          duration: 800,
        },
        "-=800",
      );

    anime({
      targets: robotRef.current,
      translateY: [-6, 6],
      direction: "alternate",
      easing: "easeInOutSine",
      duration: 2200,
      loop: true,
    });
  }, []);

  useEffect(() => {
    const cleanWhy = scrollReveal('[data-reveal="why"]', {
      stagger: 120,
      y: 40,
    });
    const cleanSec = scrollReveal('[data-reveal="section"]', {
      y: 24,
      dur: 650,
    });
    const cleanNode = scrollReveal('[data-reveal="node"]', {
      stagger: 150,
      y: 20,
    });
    const cleanCta = scrollReveal('[data-reveal="cta"]', { y: 24 });

    if (!lineRef.current) return;
    lineRef.current.style.width = "0%";
    const lineObs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          anime({
            targets: lineRef.current,
            width: ["0%", "100%"],
            duration: 1200,
            easing: "easeOutExpo",
          });
          lineObs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    lineObs.observe(lineRef.current);
    return () => {
      cleanWhy();
      cleanSec();
      cleanNode();
      cleanCta();
      lineObs.disconnect();
    };
  }, []);

  const s = {
    hero: {
      background: COLORS.bg,
      paddingBlock: "72px 60px",
      position: "relative",
      overflow: "hidden",
    },
    heroBg: {
      position: "absolute",
      inset: 0,
      backgroundImage:
        "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.04) 39px, rgba(0,0,0,0.04) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,0,0,0.04) 39px, rgba(0,0,0,0.04) 40px)",
      pointerEvents: "none",
    },
    heroInner: {
      ...C,
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
      gap: "48px",
      alignItems: "center",
      position: "relative",
    },
    heroTag: {
      display: "inline-block",
      fontFamily: FONTS.mono,
      fontSize: "11px",
      fontWeight: WEIGHT.bold,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: COLORS.black,
      border: `2px solid ${COLORS.black}`,
      padding: "5px 12px",
      marginBottom: "20px",
      opacity: 0,
    },
    heroH1: {
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: isMobile ? "clamp(32px, 9vw, 48px)" : "clamp(40px, 5vw, 72px)",
      lineHeight: 1.05,
      letterSpacing: "-0.01em",
      textTransform: "uppercase",
      marginBottom: "24px",
      color: COLORS.black,
    },
    heroSub: {
      fontFamily: FONTS.mono,
      fontSize: isMobile ? "14px" : "16px",
      color: COLORS.muted,
      lineHeight: 1.8,
      maxWidth: "420px",
      marginBottom: "32px",
      opacity: 0,
    },
    heroBtns: {
      display: "flex",
      gap: "16px",
      flexWrap: "wrap",
      flexDirection: isMobile ? "column" : "row",
    },
    btnPrimary: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: "15px",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      background: COLORS.purple,
      color: COLORS.white,
      padding: isMobile ? "14px 24px" : "13px 26px",
      border: `2px solid ${COLORS.black}`,
      boxShadow: SHADOW.card,
      textDecoration: "none",
      transition: "transform 0.15s, box-shadow 0.15s",
      opacity: 0,
      width: isMobile ? "100%" : "auto",
      boxSizing: "border-box",
    },
    btnOutline: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: "15px",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      background: "transparent",
      color: COLORS.black,
      padding: isMobile ? "14px 24px" : "13px 26px",
      border: `2px solid ${COLORS.black}`,
      boxShadow: SHADOW.card,
      textDecoration: "none",
      transition: "transform 0.15s, box-shadow 0.15s",
      opacity: 0,
      width: isMobile ? "100%" : "auto",
      boxSizing: "border-box",
    },
    heroImgOuter: {
      flexShrink: 0,
      opacity: 0,
      display: isMobile ? "none" : "block",
    },
    heroFrame: {
      width: "200px",
      height: "200px",
      border: `3px solid ${COLORS.black}`,
      boxShadow: SHADOW.card,
      background: COLORS.white,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    heroFrameCorner: {
      position: "absolute",
      top: "-6px",
      right: "-6px",
      width: "12px",
      height: "12px",
      background: COLORS.orange,
      border: `2px solid ${COLORS.black}`,
    },

    termSection: { paddingBlock: "60px", background: COLORS.bg },
    termTitle: {
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: isMobile ? "clamp(24px, 7vw, 36px)" : "clamp(28px, 3vw, 48px)",
      textTransform: "uppercase",
      color: COLORS.black,
      marginBottom: "24px",
    },
    termCard: {
      background: COLORS.bgDark,
      border: `3px solid ${COLORS.black}`,
      boxShadow: SHADOW.card,
      overflow: "hidden",
      backgroundImage: "none",
    },
    termBar: {
      background: "#0D0D1A",
      padding: "10px 16px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      borderBottom: "2px solid rgba(255,255,255,0.08)",
    },
    termDot: { width: 12, height: 12, borderRadius: "50%", flexShrink: 0 },
    termLabel: {
      fontFamily: FONTS.mono,
      fontSize: "11px",
      color: "rgba(255,255,255,0.4)",
      letterSpacing: "0.1em",
      marginLeft: "8px",
    },
    termBody: { padding: isMobile ? "16px" : "24px" },
    termLine: {
      fontFamily: FONTS.mono,
      fontSize: isMobile ? "13px" : "14px",
      color: "rgba(255,255,255,0.78)",
      lineHeight: 1.75,
      marginBottom: "12px",
      display: "flex",
      gap: "8px",
    },
    termPrompt: { color: COLORS.orange, flexShrink: 0 },
    termAccent: { color: COLORS.orange, fontStyle: "italic" },

    whySection: { paddingBlock: "60px", background: COLORS.bg },
    whyHeader: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginBottom: "32px",
    },
    whyTitle: {
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: isMobile ? "clamp(24px, 7vw, 36px)" : "clamp(28px, 3vw, 48px)",
      textTransform: "uppercase",
      color: COLORS.black,
    },
    whyRule: { flex: 1, height: "2px", background: "#CCCCCC" },
    whyGrid: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : isTablet
          ? "repeat(2, 1fr)"
          : "repeat(3, 1fr)",
      border: `3px solid ${COLORS.black}`,
      boxShadow: SHADOW.card,
    },
    whyCard: (bg, textColor, last) => ({
      background: bg,
      padding: "28px",
      borderRight:
        isMobile || (isTablet && last)
          ? "none"
          : last
            ? "none"
            : `3px solid ${COLORS.black}`,
      borderBottom: isMobile ? `3px solid ${COLORS.black}` : "none",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    }),
    cardTitle: (tc) => ({
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: isMobile ? "18px" : "22px",
      textTransform: "uppercase",
      color: tc,
    }),
    cardDesc: (tc) => ({
      fontFamily: FONTS.mono,
      fontSize: isMobile ? "14px" : "16px",
      color: tc === COLORS.white ? "rgba(255,255,255,0.82)" : COLORS.muted,
      lineHeight: 1.7,
    }),

    journeySection: { paddingBlock: "60px", background: "#F0EFE9" },
    journeyMeta: { marginBottom: "40px" },
    journeyBig: (accent) => ({
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: isMobile ? "clamp(32px, 9vw, 48px)" : "clamp(40px, 5vw, 72px)",
      textTransform: "uppercase",
      lineHeight: 1.0,
      color: accent ? COLORS.orange : COLORS.black,
      display: "block",
    }),
    journeySub: {
      fontFamily: FONTS.mono,
      fontSize: isMobile ? "14px" : "13px",
      color: COLORS.muted,
      marginTop: "8px",
    },
    timelineWrap: { position: "relative", paddingTop: "16px" },
    timelineLine: {
      height: "2px",
      background: "#DDDDDD",
      position: "absolute",
      top: "44px",
      left: 0,
      right: 0,
      zIndex: 0,
    },
    timelineProg: { height: "100%", background: COLORS.purple, width: "0%" },
    timelineNodes: {
      display: "grid",
      gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
      gap: "16px",
      position: "relative",
      zIndex: 1,
    },
    node: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
    },
    nodeBox: (color) => ({
      width: "56px",
      height: "56px",
      background: color,
      border: `3px solid ${COLORS.black}`,
      boxShadow: SHADOW.card,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    nodePhase: {
      fontFamily: FONTS.mono,
      fontSize: "11px",
      color: COLORS.muted,
      letterSpacing: "0.06em",
    },
    nodeLabel: {
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.bold,
      fontSize: "13px",
      textTransform: "uppercase",
      color: COLORS.black,
      letterSpacing: "0.04em",
    },

    ctaBanner: {
      background: COLORS.purple,
      paddingBlock: "72px",
      position: "relative",
      overflow: "hidden",
      backgroundImage: "none",
    },
    ctaInner: { ...C, textAlign: "center", position: "relative", zIndex: 1 },
    ctaH2: {
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: isMobile ? "clamp(24px, 7vw, 36px)" : "clamp(28px, 3vw, 48px)",
      textTransform: "uppercase",
      color: COLORS.white,
      marginBottom: "16px",
    },
    ctaSub: {
      fontFamily: FONTS.mono,
      fontSize: isMobile ? "14px" : "16px",
      color: "rgba(255,255,255,0.72)",
      lineHeight: 1.75,
      maxWidth: "500px",
      margin: "0 auto 32px",
    },
    ctaBtns: {
      display: "flex",
      justifyContent: "center",
      gap: "16px",
      flexWrap: "wrap",
      flexDirection: isMobile ? "column" : "row",
      alignItems: "center",
    },
    ctaBtnOrange: {
      display: "inline-block",
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: "15px",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      background: COLORS.orange,
      color: COLORS.white,
      padding: isMobile ? "14px 24px" : "13px 28px",
      border: `2px solid ${COLORS.black}`,
      boxShadow: "4px 4px 0 rgba(0,0,0,0.4)",
      textDecoration: "none",
      transition: "transform 0.15s, box-shadow 0.15s",
      width: isMobile ? "100%" : "auto",
      boxSizing: "border-box",
    },
    ctaBtnOutline: {
      display: "inline-block",
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: "15px",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      background: "transparent",
      color: COLORS.white,
      padding: isMobile ? "14px 24px" : "13px 28px",
      border: "2px solid rgba(255,255,255,0.6)",
      textDecoration: "none",
      transition: "border-color 0.15s",
      width: isMobile ? "100%" : "auto",
      boxSizing: "border-box",
    },
    ctaDecorTL: {
      position: "absolute",
      top: 16,
      left: 16,
      width: 20,
      height: 20,
      background: COLORS.orange,
      border: `2px solid ${COLORS.black}`,
    },
    ctaDecorBR: {
      position: "absolute",
      bottom: 16,
      right: 16,
      width: 20,
      height: 20,
      background: COLORS.orange,
      border: `2px solid ${COLORS.black}`,
    },
  };

  const hoverOn = (e, extra = {}) => {
    Object.assign(e.currentTarget.style, {
      transform: "translate(-2px,-2px)",
      boxShadow: "6px 6px 0 #111",
      ...extra,
    });
  };
  const hoverOff = (e, extra = {}) => {
    Object.assign(e.currentTarget.style, {
      transform: "",
      boxShadow: SHADOW.card,
      ...extra,
    });
  };

  return (
    <>
      {/* ── HERO ── */}
      <section style={s.hero} id="hero">
        <div style={s.heroBg} aria-hidden />
        <div style={s.heroInner}>
          <div>
            <span ref={heroTagRef} style={s.heroTag}>
              AWS STUDENT BUILDER GROUP · MURDOCH UNIVERSITY
            </span>
            <h1 style={s.heroH1} ref={heroH1Ref}>
              <span data-word style={{ display: "block", opacity: 0 }}>
                BUILDING THE
              </span>
              <span
                data-word
                style={{
                  display: "block",
                  opacity: 0,
                  color: COLORS.purpleLight,
                }}
              >
                FUTURE
              </span>
              <span data-word style={{ display: "block", opacity: 0 }}>
                AND UR
              </span>
              <span
                data-word
                style={{ display: "block", opacity: 0, color: COLORS.orange }}
              >
                INVITED
              </span>
            </h1>
            <p style={s.heroSub} ref={heroSubRef}>
              learn cloud, ship real projects, and actually start your tech
              career while you're still in uni. zero experience needed. just
              show up curious ✦
            </p>
            <div style={s.heroBtns} ref={heroBtnsRef}>
              <Link
                to="/passport-gateway"
                style={s.btnPrimary}
                onMouseEnter={(e) => hoverOn(e)}
                onMouseLeave={(e) => hoverOff(e)}
              >
                JOIN THE CLUB
              </Link>
              <Link
                to="/events"
                style={s.btnOutline}
                onMouseEnter={(e) => hoverOn(e)}
                onMouseLeave={(e) => hoverOff(e)}
              >
                &#8594; EXPLORE EVENTS
              </Link>
            </div>
          </div>

          <div style={s.heroImgOuter} ref={heroImgRef}>
            <div style={s.heroFrame}>
              <div style={s.heroFrameCorner} />
              <img
                ref={robotRef}
                src="https://img.icons8.com/fluency/128/robot.png"
                width={120}
                height={120}
                alt="cloud robot mascot"
                style={{ display: "block" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IS THIS CLUB? ── */}
      <section style={s.termSection}>
        <div style={C}>
          <div data-reveal="section">
            <h2 style={s.termTitle}>
              {"< "}WHAT IS THIS CLUB?{" />"}
            </h2>
          </div>
          <div data-reveal="section" style={s.termCard}>
            <div style={s.termBar}>
              <span style={{ ...s.termDot, background: "#ff5f56" }} />
              <span style={{ ...s.termDot, background: "#ffbd2e" }} />
              <span style={{ ...s.termDot, background: "#27c93f" }} />
              <span style={s.termLabel}>TERMINAL &middot; aws-club</span>
            </div>
            <div style={s.termBody}>
              <p style={s.termLine}>
                <span style={s.termPrompt}>&gt;</span>
                <span>
                  AWS Student Builder Group — Murdoch Dubai's official
                  student-led cloud community, backed by AWS. We explore cloud
                  tech, ship real projects, and grow together.
                </span>
              </p>
              <p style={s.termLine}>
                <span style={s.termPrompt}>&gt;</span>
                <span>
                  Open to any Murdoch student . Who wants to build. Workshops.
                  Buildathons. AWS-backed events. Real skills. No experience
                  needed.
                </span>
              </p>
              <p style={s.termLine}>
                <span style={s.termPrompt}>&gt;</span>
                <span>
                  Led by students, supported by AWS. Every event, every project,
                  every connection — built by us, for us.
                </span>
              </p>
              <p style={s.termLine}>
                <span style={s.termPrompt}>&gt;</span>
                <span style={s.termAccent}>
                  Ready to build your future? You're in the right place_
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY JOIN? ── */}
      <section style={s.whySection}>
        <div style={C}>
          <div style={s.whyHeader} data-reveal="section">
            <h2 style={s.whyTitle}>WHY JOIN?</h2>
            <div style={s.whyRule} />
            <img
              src="https://img.icons8.com/fluency/48/user-male.png"
              width={24}
              height={24}
              alt=""
              style={{ display: "block" }}
            />
          </div>
          <div style={s.whyGrid}>
            {WHY_JOIN.map((b, i) => (
              <article
                key={i}
                data-reveal="why"
                style={s.whyCard(b.bg, b.textColor, i === WHY_JOIN.length - 1)}
              >
                <img
                  src={b.icon}
                  width={32}
                  height={32}
                  alt=""
                  style={{ display: "block" }}
                />
                <h3 style={s.cardTitle(b.textColor)}>{b.title}</h3>
                <p style={s.cardDesc(b.textColor)}>{b.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEMESTER JOURNEY ── */}
      <section style={s.journeySection}>
        <div style={C}>
          <div data-reveal="section" style={s.journeyMeta}>
            <span style={s.journeyBig(false)}>THE</span>
            <span style={s.journeyBig(false)}>SEMESTER</span>
            <span style={s.journeyBig(true)}>JOURNEY</span>
            <p style={s.journeySub}>
              Here is what you can expect when you sign up for the ride.
            </p>
          </div>
          <div style={s.timelineWrap}>
            <div style={s.timelineLine}>
              <div ref={lineRef} style={s.timelineProg} />
            </div>
            <div style={s.timelineNodes}>
              {JOURNEY.map((item, i) => (
                <div key={i} data-reveal="node" style={s.node}>
                  <div style={s.nodeBox(item.color)}>
                    <img
                      src={item.icon}
                      width={24}
                      height={24}
                      alt={item.label}
                      style={{ display: "block" }}
                    />
                  </div>
                  <p style={s.nodePhase}>{item.phase}</p>
                  <p style={s.nodeLabel}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={s.ctaBanner}>
        <div style={s.ctaDecorTL} aria-hidden />
        <div style={s.ctaDecorBR} aria-hidden />
        <div style={s.ctaInner} data-reveal="cta">
          <h2 style={s.ctaH2}>READY TO START BUILDING?</h2>
          <p style={s.ctaSub}>
            Join the AWS Student Builder Group Get access to events, the
            learning hub, and a community that's genuinely doing things.
          </p>
          <div style={s.ctaBtns}>
            <Link
              to="/passport-gateway"
              style={s.ctaBtnOrange}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-2px,-2px)";
                e.currentTarget.style.boxShadow = "6px 6px 0 rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "4px 4px 0 rgba(0,0,0,0.4)";
              }}
            >
              JOIN THE CLUB NOW
            </Link>
            <Link
              to="/hub"
              style={s.ctaBtnOutline}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = COLORS.white;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
              }}
            >
              LEARNING HUB
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
