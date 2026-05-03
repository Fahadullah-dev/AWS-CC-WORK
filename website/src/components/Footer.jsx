import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import anime from "../utils/anime";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { COLORS, FONTS, WEIGHT } from "../styles/tokens";

const QUICK_LINKS = [
  { to: "/", label: "About the Club" },
  { to: "/events", label: "Upcoming Events" },
  { to: "/hub", label: "Learning Hub" },
  { to: "/passport-gateway", label: "Join the Club" },
];

const SOCIALS = [
  {
    href: "https://www.instagram.com/murdochdubaislt/",
    label: "INSTAGRAM",
    icon: "https://img.icons8.com/fluency/48/instagram-new.png",
    bg: "#E1306C",
  },
  {
    href: "https://chat.whatsapp.com/E0HRAiTukmBF8KTj68pr3H?mode=gi_t",
    label: "WHATSAPP",
    icon: "https://img.icons8.com/fluency/48/whatsapp.png",
    bg: "#25D366",
  },
];

export default function Footer() {
  const colsRef = useRef(null);
  const { isMobile, isTablet } = useBreakpoint();

  useEffect(() => {
    const els = colsRef.current?.querySelectorAll("[data-footer-col]");
    if (!els?.length) return;
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
    });
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          anime({
            targets: els,
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(80),
            duration: 600,
            easing: "easeOutExpo",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(colsRef.current);
    return () => observer.disconnect();
  }, []);

  const C = {
    maxWidth: "1200px",
    marginInline: "auto",
    paddingInline: isMobile ? "16px" : isTablet ? "32px" : "48px",
  };

  const s = {
    footer: { background: COLORS.black, marginTop: "0" },
    topBar: {
      height: "4px",
      background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.orange})`,
    },
    inner: {
      ...C,
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr 1fr",
      gap: isMobile ? "32px" : "48px",
      paddingTop: "48px",
      paddingBottom: "48px",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "16px",
      textDecoration: "none",
    },
    logoName: {
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: "18px",
      color: COLORS.white,
    },
    tagline: {
      fontFamily: FONTS.mono,
      fontSize: isMobile ? "14px" : "13px",
      color: "rgba(255,255,255,0.55)",
      lineHeight: 1.7,
      maxWidth: "280px",
    },
    colTitle: {
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.bold,
      fontSize: "13px",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: COLORS.white,
      marginBottom: "16px",
    },
    colLink: {
      fontFamily: FONTS.mono,
      fontSize: "13px",
      color: "rgba(255,255,255,0.65)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "10px",
      textDecoration: "none",
      transition: "color 0.15s",
    },
    socialBtn: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 14px",
      border: "2px solid rgba(255,255,255,0.25)",
      boxShadow: "2px 2px 0px rgba(0,0,0,0.4)",
      fontFamily: FONTS.mono,
      fontSize: "12px",
      fontWeight: WEIGHT.bold,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      textDecoration: "none",
      cursor: "pointer",
      borderRadius: 0,
      color: "#FFFFFF",
      marginBottom: "8px",
    },
    bottom: {
      ...C,
      borderTop: "1px solid rgba(255,255,255,0.1)",
      paddingTop: "20px",
      paddingBottom: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "8px",
    },
    bottomText: {
      fontFamily: FONTS.mono,
      fontSize: "11px",
      color: "rgba(255,255,255,0.4)",
    },
  };

  return (
    <footer style={s.footer}>
      <div style={s.topBar} />
      <div ref={colsRef} style={s.inner}>
        <div data-footer-col>
          <Link to="/" style={s.logo}>
            <img
              src="/aws-sbg-logo.png"
              width={22}
              height={22}
              alt=""
              style={{ display: "block" }}
            />
            <span style={s.logoName}>
              <span style={{ color: COLORS.white }}>AWS</span>
              <span style={{ color: COLORS.orange }}> SBG.DXB</span>
            </span>
          </Link>
          <p style={s.tagline}>
            AWS Student Builder Group at Murdoch University Dubai. Building the
            future one pixel at a time, exploring cloud tech, networking, and
            launching real solutions.
          </p>
        </div>

        <div data-footer-col>
          <h3 style={s.colTitle}>QUICK LINKS</h3>
          <ul>
            {QUICK_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  style={s.colLink}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = COLORS.orange)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.65)")
                  }
                >
                  &#8594; {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div data-footer-col>
          <h3 style={s.colTitle}>SOCIALS</h3>
          <ul>
            {SOCIALS.map(({ href, label, icon, bg }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href !== "#" ? "_blank" : undefined}
                  rel="noreferrer"
                  style={{ ...s.socialBtn, background: bg }}
                  onMouseEnter={(e) =>
                    anime({
                      targets: e.currentTarget,
                      translateY: -3,
                      duration: 150,
                      easing: "easeOutExpo",
                    })
                  }
                  onMouseLeave={(e) =>
                    anime({
                      targets: e.currentTarget,
                      translateY: 0,
                      duration: 150,
                      easing: "easeOutExpo",
                    })
                  }
                >
                  <img
                    src={icon}
                    width={18}
                    height={18}
                    alt=""
                    style={{ display: "block" }}
                  />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={s.bottom}>
        <span style={s.bottomText}>
          &#169; {new Date().getFullYear()} AWS Student Builder Group &middot;
          Murdoch Dubai.{" "}
        </span>
        <span style={s.bottomText}></span>
      </div>
    </footer>
  );
}
