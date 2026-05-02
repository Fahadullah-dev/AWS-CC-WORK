import { useEffect, useRef, useState } from "react";
import anime from "../utils/anime";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { COLORS, FONTS, WEIGHT, SHADOW } from "../styles/tokens";

const INSTAGRAM_LINK = "https://www.instagram.com/murdochdubaislt/";
const WHATSAPP_LINK =
  "https://chat.whatsapp.com/E0HRAiTukmBF8KTj68pr3H?mode=gi_t";
const EMAIL_ADDRESS = "34675845@student.murdoch.edu.au";

const MAIL_PIXEL_COLORS = [
  "#FF6B2B",
  "#3D2C8D",
  "#FF6B2B",
  "#3D2C8D",
  "#FF6B2B",
  "#3D2C8D",
  "#FF6B2B",
  "#3D2C8D",
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [envPos, setEnvPos] = useState({ x: 0, y: 0 });

  const sendBtnRef = useRef(null);
  const successRef = useRef(null);
  const tooltipRef = useRef(null);
  const emailRef = useRef(null);
  const envelopeRef = useRef(null);
  const flashRef = useRef(null);
  const checkRef = useRef(null);
  const formCardRef = useRef(null);
  const igRef = useRef(null);
  const waRef = useRef(null);

  const { isMobile, isTablet } = useBreakpoint();

  const C = {
    maxWidth: "1200px",
    marginInline: "auto",
    paddingInline: isMobile ? "16px" : isTablet ? "32px" : "48px",
  };

  useEffect(() => {
    const els = document.querySelectorAll("[data-contact]");
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
    });
    anime({
      targets: "[data-contact]",
      opacity: [0, 1],
      translateY: [16, 0],
      delay: anime.stagger(70),
      duration: 650,
      easing: "easeOutExpo",
    });
  }, []);

  const showTooltip = () => {
    setTooltipVisible(true);
    if (tooltipRef.current) {
      anime({
        targets: tooltipRef.current,
        opacity: [0, 1],
        translateY: [4, 0],
        duration: 200,
        easing: "easeOutQuad",
      });
    }
  };

  const hideTooltip = () => {
    if (tooltipRef.current) {
      anime({
        targets: tooltipRef.current,
        opacity: [1, 0],
        translateY: [0, 4],
        duration: 180,
        easing: "easeInQuad",
        complete: () => setTooltipVisible(false),
      });
    } else {
      setTooltipVisible(false);
    }
  };

  const triggerMailAnimation = (startX, startY) => {
    setEnvPos({ x: startX, y: startY });
    setShowEnvelope(true);

    requestAnimationFrame(() => {
      const env = envelopeRef.current;
      const flash = flashRef.current;
      if (!env || !flash) return;

      anime.set(env, {
        opacity: 1,
        translateX: 0,
        translateY: 0,
        rotate: -5,
        scale: 1,
      });
      anime.set(flash, { opacity: 0 });

      anime({
        targets: flash,
        opacity: [0.35, 0],
        duration: 300,
        delay: 200,
        easing: "easeOutExpo",
      });

      anime({
        targets: ".mail-pixel",
        translateX: () => anime.random(-60, 60),
        translateY: () => anime.random(-60, 60),
        scale: [1, 0],
        opacity: [1, 0],
        duration: 600,
        delay: anime.stagger(40, { start: 200 }),
        easing: "easeOutExpo",
      });

      anime({
        targets: env,
        translateX: [0, window.innerWidth + 100],
        translateY: [0, -window.innerHeight * 0.3],
        rotate: [-5, 15],
        scale: [1, 0.6],
        opacity: [1, 0],
        duration: 1200,
        delay: 200,
        easing: "easeInExpo",
        complete: () => setShowEnvelope(false),
      });

      anime({
        targets: ".speed-line",
        translateX: [-10, -30],
        opacity: [0.6, 0],
        duration: 800,
        delay: 200,
        easing: "easeInExpo",
      });

      setTimeout(() => {
        setStatus("success");
        if (successRef.current) {
          anime.set(successRef.current, {
            opacity: 0,
            translateY: -30,
            scale: 0.95,
          });
          anime({
            targets: successRef.current,
            opacity: [0, 1],
            translateY: [-30, 0],
            scale: [0.95, 1],
            duration: 600,
            easing: "easeOutBack",
          });
        }
        if (checkRef.current) {
          anime.set(checkRef.current, { scale: 0, opacity: 0 });
          anime({
            targets: checkRef.current,
            scale: [0, 1.3, 1],
            opacity: [0, 1],
            duration: 500,
            delay: 200,
            easing: "easeOutBack",
          });
        }
      }, 800);
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    if (sendBtnRef.current) {
      anime({
        targets: sendBtnRef.current,
        scale: [1, 0.95],
        duration: 100,
        easing: "easeInExpo",
      });
    }

    setTimeout(() => {
      let startX = window.innerWidth / 2 - 24;
      let startY = window.innerHeight / 2 - 18;
      if (formCardRef.current) {
        const rect = formCardRef.current.getBoundingClientRect();
        startX = rect.left + rect.width / 2 - 24;
        startY = rect.top + rect.height / 2 - 18;
      }
      triggerMailAnimation(startX, startY);
    }, 200);
  };

  const onReset = () => {
    setForm({ name: "", email: "", message: "" });
    setStatus("idle");
  };

  const hoverIn = (ref) =>
    ref.current &&
    anime({
      targets: ref.current,
      translateY: -3,
      boxShadow: "4px 6px 0px #111111",
      duration: 150,
      easing: "easeOutExpo",
    });
  const hoverOut = (ref) =>
    ref.current &&
    anime({
      targets: ref.current,
      translateY: 0,
      boxShadow: "3px 3px 0px #111111",
      duration: 150,
      easing: "easeOutExpo",
    });

  const socialBtnBase = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 20px",
    border: "2px solid #111111",
    boxShadow: "3px 3px 0px #111111",
    fontFamily: FONTS.mono,
    fontSize: "14px",
    fontWeight: WEIGHT.bold,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    textDecoration: "none",
    cursor: "pointer",
    borderRadius: 0,
    color: "#FFFFFF",
    width: "100%",
    boxSizing: "border-box",
  };

  const s = {
    page: { background: COLORS.bg, paddingBottom: "48px" },

    hero: {
      ...C,
      paddingBlock: "48px 24px",
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
      gap: "24px",
      alignItems: "flex-start",
    },
    heroBadge: {
      display: "inline-block",
      fontFamily: FONTS.mono,
      fontSize: "10px",
      fontWeight: WEIGHT.bold,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: COLORS.black,
      border: `2px solid ${COLORS.black}`,
      padding: "5px 12px",
      marginBottom: "16px",
    },
    heroTitle: {
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: isMobile
        ? "clamp(28px, 8vw, 48px)"
        : "clamp(2rem, 5.5vw, 3.2rem)",
      textTransform: "uppercase",
      color: COLORS.black,
      lineHeight: 1.1,
      letterSpacing: "0.02em",
      marginBottom: "14px",
    },
    heroTitleBox: {
      display: "inline-block",
      color: COLORS.blue,
      border: `3px solid ${COLORS.blue}`,
      padding: "0 0.22em",
      lineHeight: 1.15,
    },
    heroSub: {
      fontFamily: FONTS.mono,
      fontSize: isMobile ? "14px" : "14px",
      color: COLORS.muted,
      maxWidth: "420px",
      lineHeight: 1.8,
      borderLeft: "3px solid #CCCCCC",
      paddingLeft: "14px",
    },
    heroFrame: {
      width: "150px",
      height: "130px",
      border: `3px solid ${COLORS.black}`,
      boxShadow: SHADOW.card,
      background: COLORS.white,
      display: isMobile ? "none" : "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },

    divider: {
      ...C,
      height: 0,
      borderTop: "2px dashed rgba(0,0,0,0.18)",
      marginBottom: "32px",
    },

    layout: {
      ...C,
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "1fr 1.55fr",
      gap: "24px",
      alignItems: "flex-start",
    },

    left: { display: "flex", flexDirection: "column", gap: "14px" },

    baseCard: {
      position: "relative",
      border: `3px solid ${COLORS.black}`,
      background: COLORS.white,
      boxShadow: SHADOW.card,
      padding: "20px",
    },
    baseDecor: {
      position: "absolute",
      top: "-5px",
      left: "-5px",
      width: 14,
      height: 14,
      background: COLORS.blue,
      border: `2px solid ${COLORS.black}`,
    },
    baseHeader: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "12px",
    },
    baseTitle: {
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: "15px",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      color: COLORS.black,
      textAlign: "center",
    },
    metaLabel: {
      fontFamily: FONTS.mono,
      fontSize: "10px",
      fontWeight: WEIGHT.bold,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "#888888",
      marginTop: "10px",
    },
    metaValue: {
      fontFamily: FONTS.mono,
      fontSize: "13px",
      color: COLORS.black,
      lineHeight: 1.5,
    },

    emailRow: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      fontFamily: FONTS.mono,
      fontSize: "13px",
      color: COLORS.orange,
      textDecoration: "none",
      position: "relative",
      cursor: "pointer",
    },
    tooltip: {
      position: "absolute",
      top: "100%",
      left: 0,
      marginTop: "6px",
      background: COLORS.black,
      color: COLORS.white,
      fontFamily: FONTS.mono,
      fontSize: "11px",
      padding: "5px 10px",
      whiteSpace: "nowrap",
      border: `1px solid rgba(255,255,255,0.15)`,
      boxShadow: "2px 2px 0 rgba(0,0,0,0.4)",
      pointerEvents: "none",
      opacity: 0,
      zIndex: 10,
    },

    nodesCard: {
      position: "relative",
      border: `3px solid ${COLORS.black}`,
      background: COLORS.purple,
      boxShadow: SHADOW.card,
      padding: "20px",
    },
    nodesDecor: {
      position: "absolute",
      top: "-5px",
      right: "-5px",
      width: 14,
      height: 14,
      background: COLORS.orange,
      border: `2px solid ${COLORS.black}`,
    },
    nodesHeader: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "10px",
    },
    nodesTitle: {
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: "15px",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      color: COLORS.white,
      textAlign: "center",
    },
    nodesSub: {
      fontFamily: FONTS.mono,
      fontSize: "12px",
      color: "rgba(255,255,255,0.68)",
      lineHeight: 1.65,
      marginBottom: "14px",
    },

    right: { display: "flex", flexDirection: "column", gap: "14px" },

    formCard: {
      border: `3px solid ${COLORS.black}`,
      background: COLORS.white,
      boxShadow: SHADOW.card,
      overflow: "hidden",
    },
    formHeader: {
      background: COLORS.bgDark,
      padding: "10px 14px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      borderBottom: "2px solid rgba(255,255,255,0.08)",
    },
    termDot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
    formTitle: {
      fontFamily: FONTS.mono,
      fontSize: "11px",
      color: "rgba(255,255,255,0.5)",
      letterSpacing: "0.1em",
      marginLeft: "8px",
      textAlign: "center",
    },
    form: {
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
    },
    field: { display: "flex", flexDirection: "column", gap: "6px" },
    fieldLabel: {
      fontFamily: FONTS.mono,
      fontSize: "10px",
      fontWeight: WEIGHT.bold,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: COLORS.muted,
    },
    inputWrap: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      border: "2px solid #DDDDDD",
      padding: "0 12px",
      transition: "border-color 0.15s",
    },
    input: {
      flex: 1,
      border: "none",
      outline: "none",
      fontFamily: FONTS.mono,
      fontSize: "13px",
      color: COLORS.black,
      padding: "10px 0",
      background: "transparent",
    },
    textarea: {
      flex: 1,
      border: "none",
      outline: "none",
      fontFamily: FONTS.mono,
      fontSize: "13px",
      color: COLORS.black,
      padding: "10px 0",
      background: "transparent",
      resize: "vertical",
      minHeight: "90px",
    },
    formFooter: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "10px",
      flexWrap: "wrap",
      marginTop: "4px",
    },
    secureLabel: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      fontFamily: FONTS.mono,
      fontSize: "11px",
      fontWeight: WEIGHT.bold,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: COLORS.orange,
    },
    sendBtn: {
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: "13px",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      background: COLORS.orange,
      color: COLORS.white,
      padding: "11px 20px",
      border: `2px solid ${COLORS.black}`,
      boxShadow: SHADOW.card,
      cursor: "pointer",
      transition: "transform 0.15s, box-shadow 0.15s",
    },

    successCard: {
      border: "2px dashed #BBBBBB",
      background: "#F9F8F3",
      padding: "20px",
      display: "flex",
      alignItems: "flex-start",
      gap: "14px",
    },
    successIcon: {
      width: 48,
      height: 48,
      background: "rgba(255,107,43,0.1)",
      border: `2px solid ${COLORS.orange}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    successTitle: {
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: "14px",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      color: COLORS.black,
      marginBottom: "4px",
    },
    successSub: {
      fontFamily: FONTS.mono,
      fontSize: "12px",
      color: COLORS.muted,
      lineHeight: 1.7,
    },
    resetBtn: {
      marginTop: "10px",
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      background: "transparent",
      color: COLORS.orange,
      border: `2px solid ${COLORS.orange}`,
      padding: "7px 14px",
      cursor: "pointer",
    },
  };

  return (
    <div style={s.page}>
      {/* ── FLASH OVERLAY ── */}
      {showEnvelope && (
        <div
          ref={flashRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "white",
            zIndex: 7776,
            pointerEvents: "none",
            opacity: 0,
          }}
        />
      )}

      {/* ── ENVELOPE ── */}
      {showEnvelope && (
        <>
          {MAIL_PIXEL_COLORS.map((color, i) => (
            <div
              key={i}
              className="mail-pixel"
              style={{
                position: "fixed",
                width: 8,
                height: 8,
                background: color,
                left: envPos.x + 16,
                top: envPos.y + 10,
                zIndex: 7777,
                pointerEvents: "none",
              }}
            />
          ))}
          <svg
            ref={envelopeRef}
            width="48"
            height="36"
            viewBox="0 0 48 36"
            style={{
              position: "fixed",
              left: envPos.x,
              top: envPos.y,
              zIndex: 7777,
              pointerEvents: "none",
              overflow: "visible",
            }}
          >
            <rect x="0" y="0" width="48" height="36" fill="#3D2C8D" />
            <rect x="0" y="0" width="48" height="4" fill="#6C5CE7" />
            <rect x="0" y="0" width="4" height="18" fill="#6C5CE7" />
            <rect x="44" y="0" width="4" height="18" fill="#6C5CE7" />
            <rect x="20" y="12" width="8" height="4" fill="#FF6B2B" />
            <rect x="16" y="8" width="4" height="4" fill="#FF6B2B" />
            <rect x="28" y="8" width="4" height="4" fill="#FF6B2B" />
            <rect
              x="-20"
              y="14"
              width="16"
              height="2"
              fill="#FF6B2B"
              opacity="0.6"
              className="speed-line"
            />
            <rect
              x="-28"
              y="10"
              width="12"
              height="2"
              fill="#FF6B2B"
              opacity="0.4"
              className="speed-line"
            />
            <rect
              x="-24"
              y="18"
              width="10"
              height="2"
              fill="#FF6B2B"
              opacity="0.4"
              className="speed-line"
            />
          </svg>
        </>
      )}

      {/* ── HERO ── */}
      <header style={s.hero}>
        <div>
          <span style={s.heroBadge} data-contact>
            COMM CHANNEL OPEN
          </span>
          <h1 style={s.heroTitle} data-contact>
            PING THE <span style={s.heroTitleBox}>SERVER</span>
          </h1>
          <p style={s.heroSub} data-contact>
            Got questions about AWS, want to partner for an event, or just need
            help deploying your first container? Send us a packet.
          </p>
        </div>
        <div style={s.heroFrame} data-contact aria-hidden>
          <img
            src="https://img.icons8.com/fluency/96/imac.png"
            width={80}
            height={80}
            alt="computer"
            style={{ display: "block" }}
          />
        </div>
      </header>

      <div style={s.divider} data-contact aria-hidden />

      {/* ── LAYOUT ── */}
      <div style={s.layout}>
        {/* LEFT */}
        <div style={s.left}>
          {/* BASE STATION */}
          <div style={s.baseCard} data-contact>
            <div style={s.baseDecor} aria-hidden />
            <div style={s.baseHeader}>
              <img
                src="https://img.icons8.com/fluency/48/marker.png"
                width={18}
                height={18}
                alt=""
                style={{ display: "block" }}
              />
              <span style={s.baseTitle}>BASE STATION</span>
            </div>
            <p style={s.metaLabel}>LOCATION</p>
            <p style={s.metaValue}>Murdoch University Dubai</p>
            <p style={s.metaValue}>Dubai Knowledge Park, Block 18</p>
            <p style={s.metaLabel}>EMAIL</p>
            <div style={{ position: "relative", display: "inline-block" }}>
              <a
                ref={emailRef}
                href={`mailto:${EMAIL_ADDRESS}`}
                style={s.emailRow}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onFocus={showTooltip}
                onBlur={hideTooltip}
              >
                <img
                  src="https://img.icons8.com/fluency/48/email.png"
                  width={14}
                  height={14}
                  alt=""
                  style={{ display: "block", flexShrink: 0 }}
                />
                {EMAIL_ADDRESS}
              </a>
              {tooltipVisible && (
                <div ref={tooltipRef} style={s.tooltip}>
                  Click to open email client
                </div>
              )}
            </div>
          </div>

          {/* NETWORK NODES */}
          <div style={s.nodesCard} data-contact>
            <div style={s.nodesDecor} aria-hidden />
            <div style={s.nodesHeader}>
              <img
                src="https://img.icons8.com/fluency/48/share.png"
                width={18}
                height={18}
                alt=""
                style={{ display: "block" }}
              />
              <span style={s.nodesTitle}>NETWORK NODES</span>
            </div>
            <p style={s.nodesSub}>
              Connect with us directly on our active channels.
            </p>

            {/* Instagram */}
            <a
              ref={igRef}
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...socialBtnBase,
                background: "#E1306C",
                marginBottom: "10px",
              }}
              onMouseEnter={() => hoverIn(igRef)}
              onMouseLeave={() => hoverOut(igRef)}
            >
              <img
                src="https://img.icons8.com/fluency/48/instagram-new.png"
                width={22}
                height={22}
                alt=""
                style={{ display: "block" }}
              />
              <span style={{ flex: 1 }}>INSTAGRAM</span>
              <span
                style={{
                  color: COLORS.orange,
                  fontSize: "18px",
                  lineHeight: 1,
                }}
              >
                &#8594;
              </span>
            </a>

            {/* WhatsApp */}
            <a
              ref={waRef}
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...socialBtnBase, background: "#25D366" }}
              onMouseEnter={() => hoverIn(waRef)}
              onMouseLeave={() => hoverOut(waRef)}
            >
              <img
                src="https://img.icons8.com/fluency/48/whatsapp.png"
                width={22}
                height={22}
                alt=""
                style={{ display: "block" }}
              />
              <span style={{ flex: 1 }}>WHATSAPP GROUP</span>
              <span
                style={{ color: "#FFFFFF", fontSize: "18px", lineHeight: 1 }}
              >
                &#8594;
              </span>
            </a>
          </div>
        </div>

        {/* RIGHT */}
        <div style={s.right}>
          <div ref={formCardRef} style={s.formCard} data-contact>
            <div style={s.formHeader}>
              <span style={{ ...s.termDot, background: "#ff5f56" }} />
              <span style={{ ...s.termDot, background: "#ffbd2e" }} />
              <span style={{ ...s.termDot, background: "#27c93f" }} />
              <span style={s.formTitle}>SEND_PACKET.SH</span>
            </div>

            {status !== "success" ? (
              <form style={s.form} onSubmit={onSubmit}>
                <label style={s.field}>
                  <span style={s.fieldLabel}>PLAYER NAME</span>
                  <div
                    style={s.inputWrap}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = COLORS.purple)
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#DDDDDD")
                    }
                  >
                    <img
                      src="https://img.icons8.com/fluency/48/user.png"
                      width={15}
                      height={15}
                      alt=""
                      style={{ display: "block", flexShrink: 0 }}
                    />
                    <input
                      style={s.input}
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="Enter your full name..."
                      required
                    />
                  </div>
                </label>
                <label style={s.field}>
                  <span style={s.fieldLabel}>COMMS ADDRESS (EMAIL)</span>
                  <div
                    style={s.inputWrap}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = COLORS.purple)
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#DDDDDD")
                    }
                  >
                    <img
                      src="https://img.icons8.com/fluency/48/email.png"
                      width={15}
                      height={15}
                      alt=""
                      style={{ display: "block", flexShrink: 0 }}
                    />
                    <input
                      style={s.input}
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="you@murdoch.edu.au"
                      required
                    />
                  </div>
                </label>
                <label style={s.field}>
                  <span style={s.fieldLabel}>PAYLOAD (MESSAGE)</span>
                  <div
                    style={{ ...s.inputWrap, alignItems: "flex-start" }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = COLORS.purple)
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#DDDDDD")
                    }
                  >
                    <img
                      src="https://img.icons8.com/fluency/48/chat.png"
                      width={15}
                      height={15}
                      alt=""
                      style={{
                        display: "block",
                        flexShrink: 0,
                        marginTop: "12px",
                      }}
                    />
                    <textarea
                      style={s.textarea}
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
                      placeholder="Type your message here..."
                      rows={4}
                      required
                    />
                  </div>
                </label>
                <div style={s.formFooter}>
                  <span style={s.secureLabel}>
                    <img
                      src="https://img.icons8.com/fluency/48/shield.png"
                      width={13}
                      height={13}
                      alt=""
                      style={{ display: "block" }}
                    />
                    SECURE CONNECTION
                  </span>
                  <button
                    ref={sendBtnRef}
                    type="submit"
                    style={s.sendBtn}
                    disabled={status === "sending"}
                    onMouseEnter={(e) => {
                      if (status !== "sending") {
                        e.currentTarget.style.transform =
                          "translate(-2px,-2px)";
                        e.currentTarget.style.boxShadow = "6px 6px 0 #111";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = SHADOW.card;
                    }}
                  >
                    {status === "sending" ? "LAUNCHING..." : "TRANSMIT DATA"}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ padding: "20px" }}>
                <p
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: "13px",
                    color: COLORS.muted,
                  }}
                >
                  Message sent. See confirmation below.
                </p>
              </div>
            )}
          </div>

          {status === "success" && (
            <div ref={successRef} style={s.successCard}>
              <div ref={checkRef} style={s.successIcon}>
                <img
                  src="https://img.icons8.com/fluency/48/checkmark.png"
                  width={22}
                  height={22}
                  alt="Success"
                  style={{ display: "block" }}
                />
              </div>
              <div>
                <h3 style={s.successTitle}>TRANSMISSION SUCCESSFUL</h3>
                <p style={s.successSub}>
                  Your message is in our inbox. We usually reply within 48
                  hours.
                </p>
                <button style={s.resetBtn} onClick={onReset}>
                  ↩ SEND ANOTHER
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
