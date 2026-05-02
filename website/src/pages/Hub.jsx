import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import anime from "../utils/anime";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { COLORS, FONTS, WEIGHT, SHADOW } from "../styles/tokens";

const SERVICES = [
  { name: "COMPUTE",    awsName: "EC2 / Lambda",                border: COLORS.orange, url: "https://aws.amazon.com/ec2/" },
  { name: "STORAGE",    awsName: "S3 / EBS",                    border: COLORS.blue,   url: "https://aws.amazon.com/s3/" },
  { name: "DATABASES",  awsName: "RDS / DynamoDB",              border: COLORS.purple, url: "https://aws.amazon.com/rds/" },
  { name: "NETWORKING", awsName: "VPC / Route 53",              border: "#27c93f",     url: "https://aws.amazon.com/vpc/" },
  { name: "SECURITY",   awsName: "IAM / GuardDuty",             border: COLORS.orange, url: "https://aws.amazon.com/iam/" },
  { name: "AI / ML",    awsName: "SageMaker / Rekognition",     border: COLORS.blue,   url: "https://aws.amazon.com/machine-learning/" },
  { name: "DEVOPS",     awsName: "CodePipeline / CloudFormation",border: COLORS.purple, url: "https://aws.amazon.com/devops/" },
  { name: "CONTAINERS", awsName: "ECS / EKS",                   border: "#27c93f",     url: "https://aws.amazon.com/containers/" },
];

const ROADMAP = [
  {
    stage: "STAGE 1: BEGINNER", bg: COLORS.orange, text: COLORS.white, align: "left",
    certs: [
      { name: "AWS Cloud Practitioner (CLF-C02)", url: "https://aws.amazon.com/certification/certified-cloud-practitioner/" },
      { name: "AWS Solutions Architect – Associate", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" },
    ],
    learnMore: "https://aws.amazon.com/certification/",
  },
  {
    stage: "STAGE 2: INTERMEDIATE", bg: COLORS.white, text: COLORS.black, align: "right", bordered: true,
    certs: [
      { name: "AWS SysOps Administrator – Associate", url: "https://aws.amazon.com/certification/certified-sysops-admin-associate/" },
      { name: "AWS Developer – Associate", url: "https://aws.amazon.com/certification/certified-developer-associate/" },
    ],
    learnMore: "https://aws.amazon.com/certification/",
  },
  {
    stage: "STAGE 3: ADVANCED", bg: "transparent", text: COLORS.orange, align: "left", outlined: true,
    certs: [
      { name: "AWS Solutions Architect – Professional", url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/" },
      { name: "Specialty certifications", url: "https://aws.amazon.com/certification/specialty/" },
    ],
    learnMore: "https://aws.amazon.com/certification/",
  },
];

const CERT_LEVELS = [
  { label: "FOUNDATIONAL", color: "#27c93f",    desc: "Cloud Practitioner — No experience required. Covers core services, billing, and security basics.", url: "https://aws.amazon.com/certification/certified-cloud-practitioner/" },
  { label: "ASSOCIATE",    color: COLORS.blue,   desc: "Solutions Architect, Developer, SysOps — Practical knowledge of designing and operating on AWS.", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" },
  { label: "PROFESSIONAL", color: COLORS.purple, desc: "SA Pro, DevOps Pro — Advanced architecture and complex deployments. 2+ years recommended.", url: "https://aws.amazon.com/certification/certified-solutions-architect-professional/" },
  { label: "SPECIALTY",    color: COLORS.orange, desc: "Security, ML, Data Analytics, Networking — Deep expertise in a focused domain.", url: "https://aws.amazon.com/certification/specialty/" },
];

function scrollReveal(selector, opts = {}) {
  const els = document.querySelectorAll(selector);
  if (!els.length) return () => {};
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        anime({ targets: e.target, opacity: [0, 1], translateY: [opts.y ?? 24, 0], duration: opts.dur ?? 700, easing: "easeOutExpo", delay: opts.stagger ? anime.stagger(opts.stagger) : 0 });
        obs.unobserve(e.target);
      });
    },
    { threshold: 0.15 },
  );
  els.forEach((el) => { el.style.opacity = "0"; obs.observe(el); });
  return () => obs.disconnect();
}

export default function Hub() {
  const { isMobile, isTablet } = useBreakpoint();

  const C = {
    maxWidth: "1200px",
    marginInline: "auto",
    paddingInline: isMobile ? "16px" : isTablet ? "32px" : "48px",
  };

  useEffect(() => {
    const c1 = scrollReveal('[data-hub="hero"]',    { y: 20 });
    const c2 = scrollReveal('[data-hub="section"]', { y: 24 });
    const c3 = scrollReveal('[data-hub="tag"]',     { stagger: 60, y: 16 });
    const c4 = scrollReveal('[data-hub="stage"]',   { stagger: 100, y: 20 });
    const connObs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        anime({ targets: ".roadmap-connector", width: ["0%", "100%"], opacity: [0, 1], duration: 800, delay: anime.stagger(200), easing: "easeOutExpo" });
        connObs.disconnect();
      },
      { threshold: 0.2 },
    );
    const firstConn = document.querySelector(".roadmap-connector");
    if (firstConn) connObs.observe(firstConn);
    const c5 = scrollReveal('[data-hub="level"]',   { stagger: 80, y: 16 });
    const c6 = scrollReveal('[data-hub="cta"]',     { y: 20 });
    return () => { c1(); c2(); c3(); c4(); c5(); c6(); connObs.disconnect(); };
  }, []);

  const s = {
    page: { background: COLORS.bg, paddingBottom: 0 },

    hero: {
      ...C,
      paddingBlock: "48px 32px",
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
      gap: "32px",
      alignItems: "center",
    },
    heroBadge: {
      display: "inline-block", fontFamily: FONTS.mono, fontSize: "11px",
      fontWeight: WEIGHT.bold, letterSpacing: "0.12em", textTransform: "uppercase",
      color: COLORS.purple, border: `2px solid ${COLORS.purple}`,
      padding: "5px 12px", marginBottom: "16px",
    },
    heroTitle: {
      fontFamily: FONTS.heading, fontWeight: WEIGHT.black,
      fontSize: isMobile ? "clamp(28px, 8vw, 48px)" : "clamp(2rem, 5.5vw, 3.2rem)",
      textTransform: "uppercase", letterSpacing: "0.04em",
      color: COLORS.black, lineHeight: 1.05, marginBottom: "12px",
    },
    heroSub: {
      fontFamily: FONTS.mono, fontSize: isMobile ? "14px" : "14px",
      color: COLORS.muted, maxWidth: "460px", lineHeight: 1.8,
    },
    heroFrame: {
      width: "150px", height: "130px", border: `3px solid ${COLORS.black}`,
      boxShadow: SHADOW.card, background: COLORS.white,
      display: isMobile ? "none" : "flex",
      alignItems: "center", justifyContent: "center", flexShrink: 0,
    },

    section: { ...C, paddingBlock: "48px" },
    sectionTitle: {
      fontFamily: FONTS.heading, fontWeight: WEIGHT.black,
      fontSize: isMobile ? "clamp(22px, 6vw, 36px)" : "clamp(1.5rem, 4vw, 2.2rem)",
      textTransform: "uppercase", color: COLORS.black,
      textAlign: "center", marginBottom: "10px", letterSpacing: "0.04em",
    },
    sectionSub: {
      fontFamily: FONTS.mono, fontSize: isMobile ? "14px" : "13px",
      color: COLORS.muted, lineHeight: 1.8, maxWidth: "540px",
      margin: "0 auto 28px", textAlign: "center",
    },

    compareGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      border: `3px solid ${COLORS.black}`, boxShadow: SHADOW.card,
    },
    compareCard: (last) => ({
      background: COLORS.bgDark, padding: "28px",
      borderRight: isMobile ? "none" : last ? "none" : `3px solid ${COLORS.black}`,
      borderBottom: isMobile && !last ? `3px solid ${COLORS.black}` : "none",
      display: "flex", flexDirection: "column", gap: "12px",
    }),
    compareTitle: {
      fontFamily: FONTS.heading, fontWeight: WEIGHT.black,
      fontSize: "15px", textTransform: "uppercase",
      color: COLORS.white, letterSpacing: "0.04em",
    },
    compareDesc: { fontFamily: FONTS.mono, fontSize: "13px", color: "rgba(255,255,255,0.68)", lineHeight: 1.7, flex: 1 },
    compareLink: { fontFamily: FONTS.mono, fontSize: "12px", fontWeight: WEIGHT.bold, letterSpacing: "0.08em", color: COLORS.orange, textDecoration: "none", textTransform: "uppercase" },

    awsSection: { background: COLORS.bgDark, paddingBlock: "56px", backgroundImage: "none" },
    awsInner: {
      ...C,
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: isMobile ? "24px" : "48px",
      alignItems: "center",
    },
    awsTitle: {
      fontFamily: FONTS.heading, fontWeight: WEIGHT.black,
      fontSize: isMobile ? "clamp(22px, 6vw, 36px)" : "clamp(1.6rem, 4vw, 2.4rem)",
      textTransform: "uppercase", color: COLORS.white,
      marginBottom: "16px", letterSpacing: "0.04em",
    },
    awsSub: { fontFamily: FONTS.mono, fontSize: isMobile ? "14px" : "13px", color: "rgba(255,255,255,0.68)", lineHeight: 1.8 },
    statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
    statBox: {
      background: "rgba(255,255,255,0.05)", border: "2px solid rgba(255,255,255,0.1)",
      padding: "16px", display: "flex", flexDirection: "column", gap: "4px",
    },
    statNum: { fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: "1.5rem", color: COLORS.orange },
    statLbl: { fontFamily: FONTS.mono, fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" },

    tagsGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
      gap: "10px", marginTop: "8px",
    },
    tag: (border) => ({
      padding: "12px 14px", background: COLORS.white,
      border: `2px solid #DDDDDD`, borderLeft: `4px solid ${border}`,
      display: "flex", flexDirection: "column", gap: "3px",
      textDecoration: "none",
      transition: "transform 0.15s, box-shadow 0.15s",
    }),
    tagName: { fontFamily: FONTS.heading, fontWeight: WEIGHT.bold, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em", color: COLORS.black },
    tagAws: { fontFamily: FONTS.mono, fontSize: "11px", color: COLORS.muted },
    tagArrow: { fontFamily: FONTS.mono, fontSize: "11px", color: COLORS.orange, fontWeight: WEIGHT.bold, marginTop: "4px" },

    roadmapSection: { ...C, paddingBlock: "48px" },
    roadmapTitleWrap: { display: "inline-block", border: `3px solid ${COLORS.black}`, padding: "10px 20px", boxShadow: SHADOW.card, background: COLORS.white, marginBottom: "28px" },
    roadmapTitleText: { fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: "clamp(1.2rem, 3vw, 1.8rem)", textTransform: "uppercase", color: COLORS.black, letterSpacing: "0.04em" },
    roadmapStages: { display: "flex", flexDirection: "column", gap: "0" },
    connector: (fromAlign) => ({
      display: isMobile ? "none" : "flex",
      alignItems: "center",
      maxWidth: "520px",
      marginLeft: fromAlign === "right" ? "auto" : "0",
      height: "32px",
      overflow: "hidden",
    }),
    connectorLine: {
      flex: 1,
      borderTop: "2px dashed #111111",
      overflow: "hidden",
    },
    connectorArrow: {
      fontFamily: FONTS.mono,
      fontSize: "18px",
      color: COLORS.orange,
      lineHeight: 1,
      flexShrink: 0,
    },
    stage: (st) => ({
      padding: "20px 24px", maxWidth: isMobile ? "100%" : "520px",
      marginLeft: !isMobile && st.align === "right" ? "auto" : "0",
      background: st.bg,
      border: st.outlined ? `3px solid ${COLORS.orange}` : `3px solid ${COLORS.black}`,
      boxShadow: SHADOW.card,
    }),
    stageTitle: (tc) => ({ fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: "14px", textTransform: "uppercase", color: tc, letterSpacing: "0.06em", marginBottom: "10px" }),
    stageCertLink: (tc) => ({
      fontFamily: FONTS.mono, fontSize: "12px",
      color: tc === COLORS.white ? "rgba(255,255,255,0.82)" : COLORS.muted,
      lineHeight: 1.6, textDecoration: "none", display: "block",
      transition: "color 0.15s",
    }),
    stageLearnMore: (tc) => ({
      display: "inline-flex", alignItems: "center", gap: "6px",
      fontFamily: FONTS.mono, fontSize: "11px", fontWeight: WEIGHT.bold,
      letterSpacing: "0.08em", textTransform: "uppercase",
      color: tc === COLORS.white ? "rgba(255,255,255,0.9)" : COLORS.orange,
      textDecoration: "none", marginTop: "12px",
      borderTop: tc === COLORS.white ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.1)",
      paddingTop: "10px",
      transition: "opacity 0.15s",
    }),

    certSection: { ...C, paddingBlock: "0 48px" },
    certGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      border: `3px solid ${COLORS.black}`, boxShadow: SHADOW.card,
    },
    certCard: (last) => ({
      background: COLORS.white, padding: "28px",
      borderRight: isMobile ? "none" : last ? "none" : `3px solid ${COLORS.black}`,
      borderBottom: isMobile && !last ? `3px solid ${COLORS.black}` : "none",
      display: "flex", flexDirection: "column", gap: "10px",
    }),
    certTitle: { fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: "15px", textTransform: "uppercase", color: COLORS.black, letterSpacing: "0.04em" },
    certDesc: { fontFamily: FONTS.mono, fontSize: "12px", color: COLORS.muted, lineHeight: 1.7 },

    levelsSection: { background: COLORS.bgDark, paddingBlock: "56px", backgroundImage: "none" },
    levelsTitle: { fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: isMobile ? "clamp(22px, 6vw, 36px)" : "clamp(1.4rem, 3.5vw, 2rem)", textTransform: "uppercase", color: COLORS.white, textAlign: "center", marginBottom: "24px", letterSpacing: "0.04em" },
    levelRow: { display: "flex", alignItems: "flex-start", gap: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", padding: "14px 16px", marginBottom: "8px", flexWrap: "wrap" },
    levelBadge: (color) => ({ fontFamily: FONTS.mono, fontSize: "10px", fontWeight: WEIGHT.bold, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.white, background: color, padding: "4px 10px", whiteSpace: "nowrap", flexShrink: 0, display: "inline-block" }),
    levelDesc: { fontFamily: FONTS.mono, fontSize: isMobile ? "14px" : "13px", color: "rgba(255,255,255,0.68)", lineHeight: 1.65, flex: 1 },
    levelExamLink: {
      display: "inline-flex", alignItems: "center", gap: "4px",
      fontFamily: FONTS.mono, fontSize: "11px", fontWeight: WEIGHT.bold,
      letterSpacing: "0.08em", textTransform: "uppercase",
      color: COLORS.orange, textDecoration: "none",
      flexShrink: 0, alignSelf: "center",
      whiteSpace: "nowrap",
    },

    examSection: {
      ...C,
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: "24px", paddingBlock: "48px",
    },
    examLeft: { background: "#F0EFE9", border: `3px solid ${COLORS.black}`, padding: "24px", display: "flex", flexDirection: "column", gap: "16px" },
    examRight: { border: `3px solid ${COLORS.black}`, boxShadow: SHADOW.card, background: COLORS.white, overflow: "hidden", display: "flex", flexDirection: "column" },
    examTitle: { fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: "16px", textTransform: "uppercase", color: COLORS.black, padding: "14px 20px", borderBottom: `3px solid ${COLORS.black}`, letterSpacing: "0.06em" },
    examBlock: { display: "flex", flexDirection: "column", gap: "4px" },
    examLabel: { fontFamily: FONTS.mono, fontSize: "10px", fontWeight: WEIGHT.bold, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888888" },
    examText: { fontFamily: FONTS.mono, fontSize: "13px", color: "#333333", lineHeight: 1.65 },
    priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "2px solid #EEEEEE" },
    priceLabel: { fontFamily: FONTS.mono, fontSize: "12px", fontWeight: WEIGHT.bold, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.muted },
    priceValue: { fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: "1rem", color: COLORS.black },
    priceTip: { display: "flex", alignItems: "flex-start", gap: "8px", background: COLORS.orange, padding: "12px 20px", fontFamily: FONTS.mono, fontSize: "12px", color: COLORS.white, lineHeight: 1.5 },

    ctaBanner: { background: COLORS.orange, paddingBlock: "64px", backgroundImage: "none" },
    ctaInner: { ...C, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" },
    ctaTitle: { fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: isMobile ? "clamp(22px, 6vw, 36px)" : "clamp(1.8rem, 4.5vw, 2.8rem)", textTransform: "uppercase", color: COLORS.black, letterSpacing: "0.04em" },
    ctaSub: { fontFamily: FONTS.mono, fontSize: isMobile ? "14px" : "13px", color: "rgba(0,0,0,0.68)", lineHeight: 1.75, maxWidth: "460px" },
    ctaBtns: { display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginTop: "8px", flexDirection: isMobile ? "column" : "row", alignItems: "center" },
    ctaBtnDark: {
      display: "inline-block", background: COLORS.black, color: COLORS.white,
      fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: "13px",
      textTransform: "uppercase", letterSpacing: "0.08em", padding: "13px 24px",
      border: `2px solid ${COLORS.black}`, boxShadow: "4px 4px 0 rgba(0,0,0,0.25)",
      textDecoration: "none", transition: "transform 0.15s",
      width: isMobile ? "100%" : "auto", boxSizing: "border-box",
    },
    ctaBtnOut: {
      display: "inline-block", background: "transparent", color: COLORS.black,
      fontFamily: FONTS.heading, fontWeight: WEIGHT.black, fontSize: "13px",
      textTransform: "uppercase", letterSpacing: "0.08em", padding: "13px 24px",
      border: `2px solid ${COLORS.black}`, textDecoration: "none", transition: "background 0.15s",
      width: isMobile ? "100%" : "auto", boxSizing: "border-box",
    },
  };

  return (
    <div style={s.page}>
      {/* ── HERO ── */}
      <header style={s.hero}>
        <div>
          <span style={s.heroBadge} data-hub="hero">STRUCTURED LEARNING</span>
          <h1 style={s.heroTitle} data-hub="hero">CLOUD LEARNING HUB</h1>
          <p style={s.heroSub} data-hub="hero">
            Not sure where to start with AWS? we got u The Cloud Learning Hub
            takes you from zero to certified — step by step, no stress.
          </p>
        </div>
        <div style={s.heroFrame} data-hub="hero" aria-hidden>
          <img src="https://img.icons8.com/fluency/96/cloud-development.png" width={80} height={80} alt="" style={{ display: "block" }} />
        </div>
      </header>

      {/* ── WHAT IS CLOUD COMPUTING? ── */}
      <section style={s.section}>
        <h2 style={s.sectionTitle} data-hub="section">WHAT IS CLOUD COMPUTING?</h2>
        <p style={s.sectionSub} data-hub="section">
          Simply put: it is using someone else's computer over the internet. Instead of buying servers, you rent power, storage, and databases on a pay-as-you-go basis.
        </p>
        <div style={s.compareGrid} data-hub="section">
          <div style={s.compareCard(false)}>
            <h3 style={s.compareTitle}>THE OLD WAY</h3>
            <p style={s.compareDesc}>buy hardware, wait months, pay for stuff u don't use</p>
            <a href="#roadmap" style={s.compareLink}>LEARN MORE &#8594;</a>
          </div>
          <div style={s.compareCard(true)}>
            <img src="https://img.icons8.com/material/480/amazon-web-services.png" width={58} height={58} alt="" style={{ display: "block", marginBottom: "4px" }} />
            <h3 style={s.compareTitle}>THE CLOUD WAY</h3>
            <p style={s.compareDesc}>Spin up what you need, pay per second, scale globally in minutes, zero hardware headaches.</p>
            <a href="https://aws.amazon.com/getting-started/" target="_blank" rel="noreferrer" style={s.compareLink}>AWS WALKTHROUGH &#8594;</a>
          </div>
        </div>
      </section>

      {/* ── WHAT IS AWS? ── */}
      <section style={s.awsSection}>
        <div style={s.awsInner} data-hub="section">
          <div>
            <h2 style={s.awsTitle}>WHAT IS AWS?</h2>
            <p style={s.awsSub}>
              AWS is the world's most comprehensive cloud platform, offering 200+ fully featured services from data centers globally — the building blocks for every cloud solution.
            </p>
          </div>
          <div style={s.statsGrid}>
            {[["33+", "Regions"], ["200+", "Services"], ["Millions", "Users"], ["#1", "Cloud Platform"]].map(([n, l]) => (
              <div key={l} style={s.statBox}>
                <span style={s.statNum}>{n}</span>
                <span style={s.statLbl}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU CAN LEARN ── */}
      <section style={s.section}>
        <h2 style={s.sectionTitle} data-hub="section">WHAT YOU CAN LEARN</h2>
        <p style={s.sectionSub} data-hub="section">
          The core pillars of cloud infrastructure you will explore in our workshops.
        </p>
        <div style={s.tagsGrid}>
          {SERVICES.map((sv) => (
            <a
              key={sv.name}
              href={sv.url}
              target="_blank"
              rel="noreferrer"
              data-hub="tag"
              style={s.tag(sv.border)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-2px,-2px)";
                e.currentTarget.style.boxShadow = "3px 3px 0 #111";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <span style={s.tagName}>{sv.name}</span>
              <span style={s.tagAws}>{sv.awsName}</span>
              <span style={s.tagArrow}>↗ AWS DOCS</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── LEARNING ROADMAP ── */}
      <section style={s.roadmapSection} id="roadmap">
        <div data-hub="section">
          <div style={s.roadmapTitleWrap}>
            <span style={s.roadmapTitleText}>THE LEARNING ROADMAP</span>
          </div>
        </div>
        <div style={s.roadmapStages}>
          {ROADMAP.map((st, idx) => (
            <React.Fragment key={st.stage}>
              <div data-hub="stage" style={s.stage(st)}>
                <h3 style={s.stageTitle(st.text)}>{st.stage}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                  {st.certs.map((c) => (
                    <li key={c.name}>
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        style={s.stageCertLink(st.text)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = st.text === COLORS.white ? "#FFFFFF" : COLORS.orange;
                          e.currentTarget.style.transform = "translateX(4px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = st.text === COLORS.white ? "rgba(255,255,255,0.82)" : COLORS.muted;
                          e.currentTarget.style.transform = "";
                        }}
                      >
                        &#8594; {c.name}
                      </a>
                    </li>
                  ))}
                </ul>
                <a
                  href={st.learnMore}
                  target="_blank"
                  rel="noreferrer"
                  style={s.stageLearnMore(st.text)}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  ↗ LEARN MORE
                </a>
              </div>
              {idx < ROADMAP.length - 1 && (
                <div
                  className="roadmap-connector"
                  style={{
                    ...s.connector(st.align),
                    opacity: 0,
                  }}
                >
                  {st.align === "left" ? (
                    <>
                      <div style={s.connectorLine} />
                      <span style={s.connectorArrow}>&#8594;</span>
                    </>
                  ) : (
                    <>
                      <span style={s.connectorArrow}>&#8592;</span>
                      <div style={s.connectorLine} />
                    </>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── BADGES & CERTIFICATIONS ── */}
      <section style={s.certSection}>
        <h2 style={s.sectionTitle} data-hub="section">BADGES & CERTIFICATIONS</h2>
        <p style={s.sectionSub} data-hub="section">
          Validate your skills. Earning credentials proves your expertise to employers and helps you stand out in the tech industry.
        </p>
        <div style={s.certGrid} data-hub="section">
          <div style={s.certCard(false)}>
            <img src="https://img.icons8.com/fluency/48/badge.png" width={28} height={28} alt="" style={{ display: "block" }} />
            <h3 style={s.certTitle}>AWS TRAINING BADGES</h3>
            <p style={s.certDesc}>Complete free digital courses on AWS Skill Builder to earn shareable badges that prove foundational knowledge.</p>
          </div>
          <div style={s.certCard(true)}>
            <img src="https://img.icons8.com/fluency/48/medal.png" width={28} height={28} alt="" style={{ display: "block" }} />
            <h3 style={s.certTitle}>AWS CERTIFICATIONS</h3>
            <p style={s.certDesc}>Industry-recognized exams from Foundational to Specialty. Each proves hands-on AWS expertise to employers worldwide.</p>
          </div>
        </div>
      </section>

      {/* ── CERT LEVELS ── */}
      <section style={s.levelsSection}>
        <div style={C}>
          <h2 style={s.levelsTitle} data-hub="section">CERTIFICATION LEVELS OVERVIEW</h2>
          {CERT_LEVELS.map((lv) => (
            <div key={lv.label} data-hub="level" style={s.levelRow}>
              <span style={s.levelBadge(lv.color)}>{lv.label}</span>
              <p style={s.levelDesc}>{lv.desc}</p>
              <a
                href={lv.url}
                target="_blank"
                rel="noreferrer"
                style={s.levelExamLink}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                VIEW EXAM &#8594;
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW EXAMS WORK + EXAM INVESTMENT ── */}
      <section style={s.examSection} data-hub="section">
        <div style={s.examLeft}>
          <h2 style={s.examTitle}>HOW EXAMS WORK</h2>
          {[
            ["PEARSON VUE", "All AWS exams are administered through Pearson VUE — either at a test center or online proctored."],
            ["ONLINE OR IN-PERSON", "Take it from home with a webcam, or visit a Pearson VUE testing center near you."],
            ["QUESTION FORMATS", "Multiple choice, multiple response, ordering, and matching. Scaled score 100–1000, most require 700+."],
          ].map(([l, t]) => (
            <div key={l} style={s.examBlock}>
              <p style={s.examLabel}>{l}</p>
              <p style={s.examText}>{t}</p>
            </div>
          ))}
        </div>
        <div style={s.examRight}>
          <h2 style={s.examTitle}>EXAM INVESTMENT</h2>
          {[["FOUNDATIONAL", "$100 USD"], ["ASSOCIATE", "$150 USD"], ["PROFESSIONAL", "$300 USD"]].map(([l, v]) => (
            <div key={l} style={s.priceRow}>
              <span style={s.priceLabel}>{l}</span>
              <span style={s.priceValue}>{v}</span>
            </div>
          ))}
          <div style={s.priceTip}>
            <img src="https://img.icons8.com/fluency/48/info.png" width={14} height={14} alt="" style={{ display: "block", flexShrink: 0 }} />
            <span>Build projects while studying — knowledge sticks 3x faster.</span>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={s.ctaBanner} data-hub="cta">
        <div style={s.ctaInner}>
          <h2 style={s.ctaTitle}>READY TO BUILD YOUR SKILLS?</h2>
          <p style={s.ctaSub}>Follow the learning roadmap, earn your certifications, and build real projects that matter.</p>
          <div style={s.ctaBtns}>
            <Link to="/events" style={s.ctaBtnDark} onMouseEnter={(e) => (e.currentTarget.style.transform = "translate(-2px,-2px)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "")}>
              VIEW WORKSHOPS
            </Link>
            <Link to="/passport-gateway" style={s.ctaBtnOut} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.08)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              JOIN THE CLUB
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
