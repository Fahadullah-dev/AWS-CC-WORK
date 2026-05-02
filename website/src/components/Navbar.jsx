import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import anime from "../utils/anime";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { COLORS, FONTS, WEIGHT, Z } from "../styles/tokens";

const NAV_LINKS = [
  { label: "HOME", to: "/" },
  { label: "EVENTS", to: "/events" },
  { label: "LEARNING HUB", to: "/hub" },
  { label: "TEAM", to: "/team" },
  { label: "CONTACT", to: "/contact" },
];

const C = { maxWidth: "1200px", marginInline: "auto", paddingInline: "48px" };

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const linksRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const { isMobile } = useBreakpoint();

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  useEffect(() => {
    if (menuOpen) {
      toggleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    anime({
      targets: navRef.current,
      translateY: ["-100%", "0%"],
      opacity: [0, 1],
      duration: 600,
      easing: "easeOutExpo",
    });
    if (!isMobile) {
      anime({
        targets: linksRef.current?.querySelectorAll("[data-nav-link]"),
        opacity: [0, 1],
        translateY: [-8, 0],
        delay: anime.stagger(60, { start: 200 }),
        duration: 500,
        easing: "easeOutExpo",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleOpen = () => {
    if (!mobileMenuRef.current) return;
    mobileMenuRef.current.style.display = "block";
    mobileMenuRef.current.style.overflow = "hidden";
    const h = mobileMenuRef.current.scrollHeight || 320;
    mobileMenuRef.current.style.height = "0px";
    setMenuOpen(true);
    anime({
      targets: mobileMenuRef.current,
      height: h,
      opacity: [0, 1],
      duration: 400,
      easing: "easeOutExpo",
    });
  };

  const toggleClose = () => {
    if (!mobileMenuRef.current) return;
    const h = mobileMenuRef.current.scrollHeight;
    anime({
      targets: mobileMenuRef.current,
      height: [h, 0],
      opacity: [1, 0],
      duration: 300,
      easing: "easeInExpo",
      complete: () => {
        setMenuOpen(false);
        if (mobileMenuRef.current) {
          mobileMenuRef.current.style.display = "none";
          mobileMenuRef.current.style.height = "auto";
        }
      },
    });
  };

  const handleHamburger = () => {
    if (menuOpen) toggleClose();
    else toggleOpen();
  };

  const s = {
    header: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: Z.navbar,
      background: COLORS.black,
      borderBottom: `2px solid ${COLORS.border}`,
      height: "60px",
    },
    inner: {
      ...C,
      paddingInline: isMobile ? "16px" : "48px",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: isMobile ? "14px" : "18px",
      color: COLORS.white,
      textDecoration: "none",
    },
    logoAws: { color: COLORS.white },
    logoDxb: { color: COLORS.orange },
    links: {
      display: isMobile ? "none" : "flex",
      alignItems: "center",
      gap: "28px",
      listStyle: "none",
    },
    link: (active) => ({
      fontFamily: FONTS.mono,
      fontSize: "14px",
      fontWeight: active ? WEIGHT.bold : WEIGHT.regular,
      color: active ? COLORS.orange : COLORS.white,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      textDecoration: "none",
      opacity: active ? 1 : 0.85,
      transition: "color 0.15s",
    }),
    joinBtn: {
      display: isMobile ? "none" : "block",
      background: COLORS.orange,
      color: COLORS.white,
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: "13px",
      padding: "8px 18px",
      border: "none",
      borderRadius: 0,
      cursor: "pointer",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      textDecoration: "none",
      whiteSpace: "nowrap",
    },
    hamburger: {
      display: isMobile ? "flex" : "none",
      alignItems: "center",
      justifyContent: "center",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "4px",
      flexShrink: 0,
    },
    drawer: {
      position: "fixed",
      top: "60px",
      left: 0,
      right: 0,
      background: COLORS.black,
      borderBottom: `2px solid ${COLORS.border}`,
      padding: "20px 16px",
      zIndex: Z.navbar - 1,
      display: "none",
      overflow: "hidden",
    },
    drawerLink: (active) => ({
      display: "block",
      padding: "12px 0",
      borderBottom: `1px solid rgba(255,255,255,0.1)`,
      fontFamily: FONTS.mono,
      fontSize: "16px",
      fontWeight: WEIGHT.regular,
      color: active ? COLORS.orange : COLORS.white,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      textDecoration: "none",
    }),
    drawerJoin: {
      display: "block",
      marginTop: "16px",
      background: COLORS.orange,
      color: COLORS.white,
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: "15px",
      padding: "14px 20px",
      textAlign: "center",
      textTransform: "uppercase",
      textDecoration: "none",
      width: "100%",
      boxSizing: "border-box",
    },
  };

  return (
    <>
      <header ref={navRef} style={s.header}>
        <div style={s.inner}>
          <Link
            to="/"
            id="navbar-logo-target"
            style={s.logo}
            aria-label="AWS Cloud Club home"
          >
            <img
              src="/aws-sbg-logo.png"
              width={22}
              height={22}
              alt=""
              style={{ display: "block" }}
            />
            <span>
              <span style={s.logoAws}>AWS SBG</span>
              <span style={s.logoDxb}> X MURDOCH</span>
            </span>
          </Link>

          <ul ref={linksRef} style={s.links}>
            {NAV_LINKS.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  data-nav-link
                  style={s.link(isActive(to))}
                  onMouseEnter={(e) => {
                    if (!isActive(to))
                      e.currentTarget.style.color = COLORS.orange;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(to))
                      e.currentTarget.style.color = COLORS.white;
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <Link to="/passport-gateway" style={s.joinBtn}>
            JOIN CLUB
          </Link>

          <button
            style={s.hamburger}
            onClick={handleHamburger}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <svg width="24" height="20" viewBox="0 0 24 20">
              <rect x="0" y="0" width="24" height="3" fill="white" />
              <rect x="0" y="8" width="24" height="3" fill="white" />
              <rect x="0" y="16" width="24" height="3" fill="white" />
            </svg>
          </button>
        </div>
      </header>

      <div ref={mobileMenuRef} style={s.drawer}>
        {NAV_LINKS.map(({ label, to }) => (
          <Link key={to} to={to} style={s.drawerLink(isActive(to))}>
            {label}
          </Link>
        ))}
        <Link to="/passport-gateway" style={s.drawerJoin}>
          JOIN THE CLUB
        </Link>
      </div>
    </>
  );
}
