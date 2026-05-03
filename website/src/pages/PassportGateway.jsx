import { useEffect, useMemo, useRef } from "react";
import anime from "../utils/anime";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { COLORS, FONTS, WEIGHT, SHADOW } from "../styles/tokens";
import { PASSPORT_LINKS } from "../config/passportLinks";

const FEATURES = [
  {
    num: "01", title: "CHECK-IN TO EVENTS",
    icon: "https://img.icons8.com/fluency/48/calendar.png",
    body: "Scan your passport QR at workshops, buildathons, and social events to auto-log attendance.",
    iconColor: COLORS.blue,
  },
  {
    num: "02", title: "FARM XP",
    icon: "https://img.icons8.com/fluency/48/lightning-bolt.png",
    body: "Earn XP for deploying your first project, completing cloud labs, and helping others.",
    iconColor: COLORS.orange,
  },
  {
    num: "03", title: "UNLOCK BADGES",
    icon: "https://img.icons8.com/fluency/48/shield.png",
    body: "Collect pixel badges for achievements, display them on your profile, and impress recruiters.",
    iconColor: COLORS.purple,
  },
];

const BADGE_ICONS = [
  { src: "https://img.icons8.com/fluency/48/bucket.png",        label: "S3 Starter" },
  { src: "https://img.icons8.com/fluency/48/lightning-bolt.png", label: "Lambda Runner" },
  { src: "https://img.icons8.com/fluency/48/compass.png",        label: "VPC Navigator" },
  { src: "https://img.icons8.com/fluency/48/globe.png",          label: "CloudFront Speed" },
];

export default function PassportGateway() {
  const statusRef   = useRef(null);
  const heroH1Ref   = useRef(null);
  const heroSubRef  = useRef(null);
  const heroBtnsRef = useRef(null);
  const cardRef     = useRef(null);
  const { isMobile, isTablet } = useBreakpoint();

  const C = {
    maxWidth: "1200px",
    marginInline: "auto",
    paddingInline: isMobile ? "16px" : isTablet ? "32px" : "48px",
  };

  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
    [],
  );

  useEffect(() => {
    if (reducedMotion) return;
    anime({ targets: statusRef.current, opacity: [1, 0.55, 1], duration: 520, easing: "easeInOutSine", loop: 2 });

    const tl = anime.timeline({ easing: "easeOutExpo" });
    tl.add({
      targets: heroH1Ref.current?.querySelectorAll("[data-hw]"),
      opacity: [0, 1], translateY: [26, 0], duration: 720, delay: anime.stagger(85),
    })
    .add({ targets: heroSubRef.current, opacity: [0, 1], translateY: [14, 0], duration: 640 }, "-=420")
    .add({ targets: heroBtnsRef.current?.querySelectorAll("a"), opacity: [0, 1], translateY: [12, 0], duration: 560, delay: anime.stagger(110) }, "-=380");

    anime({ targets: cardRef.current, translateY: [-6, 6], direction: "alternate", easing: "easeInOutSine", duration: 2400, loop: true });
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const cards = document.querySelectorAll('[data-io="how-card"]');
    cards.forEach((el) => { el.style.opacity = "0"; el.style.transform = "translateY(18px)"; });
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const all = Array.from(document.querySelectorAll('[data-io="how-card"]'));
          const idx = all.indexOf(e.target);
          anime({ targets: e.target, opacity: [0, 1], translateY: [18, 0], duration: 650, easing: "easeOutExpo", delay: idx * 120 });
          obs.unobserve(e.target);
        });
      },
      { threshold: 0.2 },
    );
    cards.forEach((el) => obs.observe(el));

    const ctaEl = document.querySelector('[data-io="final-cta"]');
    if (ctaEl) {
      ctaEl.style.opacity = "0";
      ctaEl.style.transform = "translateY(18px)";
      const ctaObs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            anime({ targets: ctaEl, opacity: [0, 1], translateY: [18, 0], duration: 720, easing: "easeOutExpo" });
            ctaObs.disconnect();
          }
        },
        { threshold: 0.3 },
      );
      ctaObs.observe(ctaEl);
    }
    return () => obs.disconnect();
  }, [reducedMotion]);

  const s = {
    page: { background: COLORS.bg, paddingBottom: 0 },

    hero: {
      ...C,
      paddingBlock: "56px 48px",
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
      gap: "48px",
      alignItems: "center",
    },
    status: {
      display: "inline-block", fontFamily: FONTS.mono, fontSize: "11px",
      fontWeight: WEIGHT.bold, letterSpacing: "0.14em", textTransform: "uppercase",
      color: COLORS.black, border: `2px solid ${COLORS.black}`,
      padding: "5px 12px", marginBottom: "20px",
    },
    h1: {
      fontFamily: FONTS.heading, fontWeight: WEIGHT.black,
      fontSize: isMobile ? "clamp(2rem, 9vw, 3rem)" : "clamp(2.4rem, 6vw, 4rem)",
      textTransform: "uppercase", lineHeight: 1.0,
      letterSpacing: "-0.01em", marginBottom: "24px",
    },
    h1Black:  { display: "block", color: COLORS.black },
    h1Purple: { display: "block", color: COLORS.purple },
    heroSub: {
      borderLeft: `4px solid ${COLORS.orange}`, paddingLeft: "16px",
      fontFamily: FONTS.mono, fontSize: isMobile ? "14px" : "14px",
      color: COLORS.muted, lineHeight: 1.8, maxWidth: "420px", marginBottom: "32px", opacity: 0,
    },
    heroBtns: {
      display: "flex", gap: "16px", flexWrap: "wrap",
      flexDirection: isMobile ? "column" : "row",
    },
    ctaPrimary: {
      display: "inline-flex", alignItems: "center", gap: "10px",
      fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: "14px",
      textTransform: "uppercase", letterSpacing: "0.06em",
      background: COLORS.purple, color: COLORS.white,
      padding: "13px 24px", border: `2px solid ${COLORS.black}`,
      boxShadow: SHADOW.card, textDecoration: "none",
      transition: "transform 0.15s, box-shadow 0.15s", opacity: 0,
      width: isMobile ? "100%" : "auto", boxSizing: "border-box",
      justifyContent: isMobile ? "center" : "flex-start",
    },
    ctaSecondary: {
      display: "inline-flex", alignItems: "center", gap: "10px",
      fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: "14px",
      textTransform: "uppercase", letterSpacing: "0.06em",
      background: "transparent", color: COLORS.black,
      padding: "13px 24px", border: `2px solid ${COLORS.black}`,
      boxShadow: SHADOW.card, textDecoration: "none",
      transition: "transform 0.15s, box-shadow 0.15s", opacity: 0,
      width: isMobile ? "100%" : "auto", boxSizing: "border-box",
      justifyContent: isMobile ? "center" : "flex-start",
    },
    cardWrap: { flexShrink: 0, display: isMobile ? "none" : "block" },
    passportCard: {
      width: "240px", background: COLORS.purple,
      border: `3px solid ${COLORS.black}`, boxShadow: SHADOW.card,
      padding: "20px", position: "relative",
    },
    cardTop: { display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" },
    cardAvatar: { width: "52px", height: "52px", background: "rgba(255,255,255,0.12)", border: `2px solid rgba(255,255,255,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    cardName: { fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: "15px", textTransform: "uppercase", color: COLORS.white, letterSpacing: "0.04em" },
    cardRole: { fontFamily: FONTS.mono, fontSize: "10px", color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "2px" },
    cardTier: { fontFamily: FONTS.mono, fontSize: "10px", fontWeight: WEIGHT.bold, color: COLORS.orange, textTransform: "uppercase", letterSpacing: "0.08em", marginLeft: "auto", whiteSpace: "nowrap" },
    xpLabel: { display: "flex", justifyContent: "space-between", fontFamily: FONTS.mono, fontSize: "10px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" },
    xpVal:  { color: COLORS.orange },
    xpBar:  { height: "6px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" },
    xpFill: { height: "100%", background: COLORS.orange, width: "42%" },
    badges: { display: "flex", gap: "8px", marginTop: "14px" },
    badge:  { width: "32px", height: "32px", background: "rgba(255,255,255,0.1)", border: `2px solid rgba(255,255,255,0.2)`, display: "flex", alignItems: "center", justifyContent: "center" },
    cardCorner: { position: "absolute", bottom: 0, right: 0, width: 16, height: 16, background: COLORS.orange },

    divider: { ...C, height: 0, borderTop: "2px dashed rgba(0,0,0,0.18)", marginBlock: "0" },

    how: { ...C, paddingBlock: "56px" },
    howH2: { fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: isMobile ? "clamp(22px, 6vw, 36px)" : "clamp(1.8rem, 4.5vw, 2.8rem)", textTransform: "uppercase", textAlign: "center", color: COLORS.black, marginBottom: "12px" },
    howSub: { fontFamily: FONTS.mono, fontSize: isMobile ? "14px" : "13px", color: COLORS.muted, textAlign: "center", lineHeight: 1.8, maxWidth: "460px", margin: "0 auto 40px" },
    howGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
      border: `3px solid ${COLORS.black}`, boxShadow: SHADOW.card,
    },
    howCard: (last) => ({
      background: COLORS.white, padding: "28px",
      borderRight: isMobile ? "none" : last ? "none" : `3px solid ${COLORS.black}`,
      borderBottom: isMobile && !last ? `3px solid ${COLORS.black}` : "none",
      position: "relative", display: "flex", flexDirection: "column", gap: "14px",
    }),
    howNum: { position: "absolute", top: "12px", right: "12px", fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: "2rem", color: "rgba(0,0,0,0.06)", lineHeight: 1 },
    howIconBox: (color) => ({ width: "52px", height: "52px", background: color, border: `3px solid ${COLORS.black}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }),
    howTitle: { fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: "15px", textTransform: "uppercase", color: COLORS.black, letterSpacing: "0.04em" },
    howBody:  { fontFamily: FONTS.mono, fontSize: "13px", color: COLORS.muted, lineHeight: 1.7 },

    finalWrap: { background: COLORS.bgDark, paddingBlock: "72px", backgroundImage: "none" },
    finalInner: { ...C, textAlign: "center" },
    finalH2: { fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: isMobile ? "clamp(22px, 6vw, 36px)" : "clamp(1.8rem, 4.5vw, 2.8rem)", textTransform: "uppercase", color: COLORS.white, marginBottom: "16px", borderTop: `3px solid ${COLORS.orange}`, paddingTop: "24px", display: "inline-block" },
    finalSub: { fontFamily: FONTS.mono, fontSize: isMobile ? "14px" : "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: "440px", margin: "0 auto 28px" },
    finalBtn: { display: "inline-flex", fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: "15px", textTransform: "uppercase", letterSpacing: "0.06em", background: COLORS.purple, color: COLORS.white, padding: "14px 32px", border: `2px solid ${COLORS.white}`, boxShadow: "4px 4px 0 rgba(255,255,255,0.2)", textDecoration: "none", transition: "transform 0.15s, box-shadow 0.15s" },
  };

  return (
    <div style={s.page}>
      <section style={s.hero}>
        <div>
          <span ref={statusRef} style={s.status}>SYSTEM ACCESS: RESTRICTED</span>
          <h1 ref={heroH1Ref} style={s.h1}>
            <span style={s.h1Black}>
              <span data-hw style={{ opacity: 0, display: "inline-block", marginRight: "0.2em" }}>CLAIM</span>
              <span data-hw style={{ opacity: 0, display: "inline-block" }}>YOUR</span>
            </span>
            <span style={s.h1Purple}>
              <span data-hw style={{ opacity: 0, display: "inline-block", marginRight: "0.2em" }}>BUILDER</span>
              <span data-hw style={{ opacity: 0, display: "inline-block" }}>PASSPORT</span>
            </span>
          </h1>
          <div ref={heroSubRef} style={s.heroSub}>
            Your official ID for the AWS Student Builder Group. Track your progress, earn XP for attending events, unlock exclusive badges, and level up your cloud skills as you build.
          </div>
          <div ref={heroBtnsRef} style={s.heroBtns}>
            <a
              href={PASSPORT_LINKS.initialize} style={s.ctaPrimary}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-2px,-2px)"; e.currentTarget.style.boxShadow = "6px 6px 0 #111"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = SHADOW.card; }}
            >
              <img src="https://img.icons8.com/fluency/48/id-verified.png" width={18} height={18} alt="" style={{ display: "block" }} />
              INITIALIZE PASSPORT
            </a>
          </div>
        </div>

        <div ref={cardRef} style={s.cardWrap} aria-hidden>
          <div style={s.passportCard}>
            <div style={s.cardTop}>
              <div style={s.cardAvatar}>
                <img src="https://img.icons8.com/fluency/48/developer.png" width={36} height={36} alt="Player" style={{ display: "block" }} />
              </div>
              <div>
                <div style={s.cardName}>PLAYER ONE</div>
                <div style={s.cardRole}>NOVICE BUILDER</div>
              </div>
              <div style={s.cardTier}>TIER: ALPHA</div>
            </div>
            <div style={s.xpLabel}>
              <span>XP</span>
              <span style={s.xpVal}>420 / 1000</span>
            </div>
            <div style={s.xpBar}><div style={s.xpFill} /></div>
            <div style={s.badges}>
              {BADGE_ICONS.map((b) => (
                <div key={b.label} style={s.badge} title={b.label}>
                  <img src={b.src} width={18} height={18} alt={b.label} style={{ display: "block" }} />
                </div>
              ))}
            </div>
            <div style={s.cardCorner} />
          </div>
        </div>
      </section>

      <div style={s.divider} aria-hidden />

      <section style={s.how}>
        <h2 style={s.howH2}>HOW THE SYSTEM WORKS</h2>
        <p style={s.howSub}>This isn't just a mailing list. It's a game. Participate, learn, and prove your skills to the server.</p>
        <div style={s.howGrid} data-io="how-grid">
          {FEATURES.map((f, i) => (
            <article key={f.num} data-io="how-card" style={s.howCard(i === FEATURES.length - 1)}>
              <span style={s.howNum}>{f.num}</span>
              <div style={s.howIconBox(f.iconColor)}>
                <img src={f.icon} width={28} height={28} alt={f.title} style={{ display: "block" }} />
              </div>
              <h3 style={s.howTitle}>{f.title}</h3>
              <p style={s.howBody}>{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={s.finalWrap}>
        <div style={s.finalInner} data-io="final-cta">
          <h2 style={s.finalH2}>READY TO BEGIN YOUR JOURNEY?</h2>
          <p style={s.finalSub}>Creating a passport takes 30 seconds. You just need your university email.</p>
          <a
            href={PASSPORT_LINKS.create} style={s.finalBtn}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-2px,-2px)"; e.currentTarget.style.boxShadow = "6px 6px 0 rgba(255,255,255,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "4px 4px 0 rgba(255,255,255,0.2)"; }}
          >
            CREATE MY PASSPORT
          </a>
        </div>
      </section>
    </div>
  );
}
