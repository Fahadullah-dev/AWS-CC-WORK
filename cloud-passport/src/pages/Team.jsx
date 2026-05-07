import { useEffect, useState } from "react";
import anime from "../utils/anime";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { COLORS, FONTS, WEIGHT, SHADOW } from "../styles/tokens";

const TEAM = [
  {
    name: "WADIQA BAIG",
    role: "AWS SBG Leader",
    photo: "/team-pictures/wadiqa.png",
    linkedin: "https://www.linkedin.com/in/wadiqa-baig-4706a0249/",
    github: "https://github.com/wadiqabaig",
    isCaptain: true,
    bio: "From an AWS beginner in 2024 to your AWS SBG Leader today! I'm dedicated to helping our community thrive and proving that anyone can achieve their dreams on their own timeline.",
  },
  {
    name: "Fahadullah Ahamedullah",
    role: "Director of Cloud Innovation",
    photo: "/team-pictures/fahad.png",
    linkedin: "https://www.linkedin.com/in/a-fahadullah/",
    github: "https://github.com/Fahadullah-dev",
    isCaptain: false,
  },
  {
    name: "Kamilla Devetiarova",
    role: "Operations Coordinator",
    photo: "/team-pictures/kamilla.png",
    linkedin: "https://www.linkedin.com/in/kamilla-devetiarova-080821321/",
    github: "",
    isCaptain: false,
  },
  {
    name: "Muaaz Ahmed Syed",
    role: "Director of Brand Experience",
    photo: "/team-pictures/muaaz.png",
    linkedin: "https://www.linkedin.com/in/muaaz-syed-4367242b7/",
    github: "https://github.com/Muaaz2007",
    isCaptain: false,
  },
  {
    name: "Mohmedbilal Mohmedaslam Madrawala",
    role: "Events & Logistics Manager",
    photo: "/team-pictures/bilal.png",
    linkedin: "https://www.linkedin.com/in/mohmed-bilal-madrawala-a51065362/",
    github: "",
    isCaptain: false,
  },
  {
    name: "Mohammed Rayaan Parvarz Alam",
    role: "Membership & Outreach Lead",
    photo: "/team-pictures/rayaan.png",
    linkedin: "https://www.linkedin.com/in/mohammed-rayaan-220495280/",
    github: "",
    isCaptain: false,
  },
];

const captain = TEAM.find((m) => m.isCaptain);
const guild = TEAM.filter((m) => !m.isCaptain);
const ROW_ONE = guild.slice(0, 3);
const ROW_TWO = guild.slice(3, 5);

function PhotoOrInitials({ src, name, style: outerStyle = {}, size = "lg" }) {
  const [failed, setFailed] = useState(false);
  const initials = name.slice(0, 2).toUpperCase();
  if (failed)
    return (
      <div
        style={{
          ...outerStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#CCCCCC",
          color: "#555555",
          fontFamily: FONTS.heading,
          fontWeight: WEIGHT.black,
          fontSize: size === "lg" ? "2.2rem" : "1.3rem",
          letterSpacing: "0.05em",
        }}
      >
        {initials}
      </div>
    );
  return (
    <img
      src={src}
      alt={name}
      style={{
        ...outerStyle,
        objectFit: "cover",
        objectPosition: "top center",
        display: "block",
      }}
      onError={() => setFailed(true)}
    />
  );
}

const socialBtnBase = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 16px",
  border: "2px solid #111111",
  boxShadow: "3px 3px 0px #111111",
  fontFamily: FONTS.mono,
  fontSize: "13px",
  fontWeight: WEIGHT.bold,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  textDecoration: "none",
  cursor: "pointer",
  borderRadius: 0,
};

function SocialBtn({ href, bg, label, icon, target = "_blank" }) {
  return (
    <a
      href={href}
      target={target}
      rel="noreferrer"
      style={{ ...socialBtnBase, background: bg, color: "#FFFFFF" }}
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
  );
}

function MemberCard({ m }) {
  return (
    <article
      data-team
      style={{
        background: COLORS.white,
        border: `2px solid #DDDDDD`,
        boxShadow: "4px 4px 0px #111111",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) =>
        anime({
          targets: e.currentTarget,
          translateY: -6,
          duration: 200,
          easing: "easeOutQuad",
        })
      }
      onMouseLeave={(e) =>
        anime({
          targets: e.currentTarget,
          translateY: 0,
          duration: 200,
          easing: "easeOutQuad",
        })
      }
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          overflow: "hidden",
          position: "relative",
          background: "#CCCCCC",
        }}
      >
        <PhotoOrInitials
          src={m.photo}
          name={m.name}
          style={{ width: "100%", height: "100%" }}
          size="sm"
        />
      </div>
      <div
        style={{
          padding: "16px",
          background: COLORS.white,
          borderTop: `2px solid #DDDDDD`,
        }}
      >
        <h3
          style={{
            fontFamily: FONTS.heading,
            fontWeight: WEIGHT.black,
            fontSize: "18px",
            color: COLORS.black,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "4px",
          }}
        >
          {m.name}
        </h3>
        <p
          style={{
            fontFamily: FONTS.mono,
            fontSize: "12px",
            color: COLORS.orange,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "12px",
          }}
        >
          {m.role.toUpperCase()}
        </p>
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <SocialBtn
            href={m.linkedin}
            bg="#0A66C2"
            label="LINKEDIN"
            icon="https://img.icons8.com/fluency/48/linkedin.png"
          />
          {m.github && (
            <SocialBtn
              href={m.github}
              bg="#111111"
              label="GITHUB"
              icon="https://img.icons8.com/fluency/48/github.png"
            />
          )}
        </div>
      </div>
    </article>
  );
}

export default function Team() {
  const { isMobile, isTablet } = useBreakpoint();

  const C = {
    maxWidth: "1200px",
    marginInline: "auto",
    paddingInline: isMobile ? "16px" : isTablet ? "32px" : "48px",
  };

  useEffect(() => {
    const els = document.querySelectorAll("[data-team]");
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
    });
    anime({
      targets: "[data-team]",
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(80),
      duration: 700,
      easing: "easeOutExpo",
    });
  }, []);

  const s = {
    page: { background: COLORS.bg, paddingBottom: 0 },

    hero: {
      ...C,
      paddingBlock: "48px 24px",
      textAlign: "center",
      position: "relative",
    },
    heroDecorL: {
      position: "absolute",
      top: "48px",
      left: isMobile ? "16px" : "48px",
      width: 14,
      height: 14,
      background: COLORS.purple,
      border: `2px solid ${COLORS.black}`,
    },
    heroDecorR: {
      position: "absolute",
      top: "56px",
      right: isMobile ? "16px" : "48px",
      width: 10,
      height: 10,
      background: COLORS.orange,
      border: `2px solid ${COLORS.black}`,
    },
    heroTitle: {
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: isMobile ? "clamp(32px, 9vw, 48px)" : "clamp(40px, 5vw, 64px)",
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      color: COLORS.black,
      lineHeight: 1.05,
    },
    heroTitleBox: {
      display: "inline-block",
      color: COLORS.orange,
      border: `4px solid ${COLORS.orange}`,
      padding: "0 0.2em",
      lineHeight: 1.15,
    },
    heroSub: {
      fontFamily: FONTS.mono,
      fontSize: isMobile ? "14px" : "16px",
      color: COLORS.muted,
      maxWidth: "520px",
      margin: "12px auto 0",
      lineHeight: 1.8,
    },
    heroDivider: {
      height: 0,
      borderTop: "2px dashed rgba(0,0,0,0.18)",
      margin: "24px 0 0",
    },

    captainSection: { ...C, paddingBlock: "32px 40px" },
    captainLabel: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      fontFamily: FONTS.mono,
      fontSize: "11px",
      fontWeight: WEIGHT.bold,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: COLORS.black,
      marginBottom: "12px",
    },
    captainCard: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "240px 1fr",
      background: COLORS.purple,
      border: `3px solid ${COLORS.black}`,
      boxShadow: SHADOW.card,
      overflow: "hidden",
    },
    captainBody: {
      padding: isMobile ? "20px" : "28px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      position: "relative",
    },
    playerBadge: {
      position: "absolute",
      top: "12px",
      right: "12px",
      fontFamily: FONTS.mono,
      fontSize: "10px",
      fontWeight: WEIGHT.bold,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      background: COLORS.orange,
      color: COLORS.white,
      padding: "4px 10px",
      border: `2px solid ${COLORS.black}`,
    },
    captainName: {
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: isMobile
        ? "clamp(1.4rem, 6vw, 2rem)"
        : "clamp(1.6rem, 3vw, 2.4rem)",
      textTransform: "uppercase",
      color: COLORS.white,
      letterSpacing: "0.04em",
      marginTop: "24px",
    },
    captainRole: {
      fontFamily: FONTS.mono,
      fontSize: "11px",
      fontWeight: WEIGHT.bold,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: COLORS.orange,
    },
    captainBio: {
      fontFamily: FONTS.mono,
      fontSize: isMobile ? "14px" : "13px",
      color: "rgba(255,255,255,0.78)",
      lineHeight: 1.75,
      maxWidth: "480px",
    },
    captainBtns: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      marginTop: "4px",
    },

    guildSection: { ...C, paddingBlock: "0 0", paddingBottom: "80px" },
    guildHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "12px",
      marginBottom: "20px",
    },
    guildRule: { flex: 1, height: "2px", background: "#CCCCCC" },
    guildTitle: {
      fontFamily: FONTS.heading,
      fontWeight: WEIGHT.black,
      fontSize: isMobile ? "22px" : "clamp(1.4rem, 4vw, 2rem)",
      textTransform: "uppercase",
      color: COLORS.black,
      whiteSpace: "nowrap",
      letterSpacing: "0.04em",
    },

    guildOuter: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      width: "100%",
      maxWidth: "1100px",
      margin: "0 auto",
      padding: "0 24px",
      boxSizing: "border-box",
    },
    guildRow: (count) => ({
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: "24px",
      width: "100%",
      justifyContent: "center",
    }),
    cardWrap: (count) => ({
      flex: isMobile ? "0 0 100%" : "0 0 calc(33.333% - 16px)",
      maxWidth: isMobile ? "100%" : "calc(33.333% - 16px)",
      minWidth: 0,
    }),
  };

  return (
    <div style={s.page}>
      <header style={{ position: "relative" }}>
        <div style={s.hero}>
          <div style={s.heroDecorL} aria-hidden />
          <div style={s.heroDecorR} aria-hidden />
          <h1 style={s.heroTitle} data-team>
            MEET THE <span style={s.heroTitleBox}>BUILDERS</span>
          </h1>
          <p style={s.heroSub} data-team>
            The core team behind AWS Student Builder Group · Murdoch Dubai.
            Passionate about cloud tech, community building, and shipping cool
            projects.
          </p>
        </div>
        <div style={{ ...C, ...s.heroDivider }} data-team aria-hidden />
      </header>

      {/* ── CLUB CAPTAIN ── */}
      <section style={s.captainSection}>
        <div style={s.captainLabel} data-team>
          <img
            src="https://img.icons8.com/fluency/48/star.png"
            width={16}
            height={16}
            alt=""
            style={{ display: "block" }}
          />
          GROUP LEADER
        </div>
        <article style={s.captainCard} data-team>
          <div
            style={{
              borderRight: isMobile ? "none" : `3px solid ${COLORS.black}`,
              borderBottom: isMobile ? `3px solid ${COLORS.black}` : "none",
              overflow: "hidden",
              minHeight: isMobile ? "200px" : "240px",
            }}
          >
            <PhotoOrInitials
              src={captain.photo}
              name={captain.name}
              style={{
                width: isMobile ? "100%" : "240px",
                height: "100%",
                minHeight: isMobile ? "200px" : "240px",
              }}
              size="lg"
            />
          </div>
          <div style={s.captainBody}>
            <span style={s.playerBadge}>PLAYER 1</span>
            <h2 style={s.captainName}>{captain.name}</h2>
            <p style={s.captainRole}>{captain.role.toUpperCase()}</p>
            <p style={s.captainBio}>{captain.bio}</p>
            <div style={s.captainBtns}>
              <SocialBtn
                href={captain.linkedin}
                bg="#0A66C2"
                label="LINKEDIN"
                icon="https://img.icons8.com/fluency/48/linkedin.png"
              />
              {captain.github && (
                <SocialBtn
                  href={captain.github}
                  bg="#111111"
                  label="GITHUB"
                  icon="https://img.icons8.com/fluency/48/github.png"
                />
              )}
            </div>
          </div>
        </article>
      </section>

      {/* ── CORE GUILD ── */}
      <section style={s.guildSection}>
        <div style={s.guildHeader} data-team>
          <div style={s.guildRule} />
          <h2 style={s.guildTitle}>THE CORE GUILD</h2>
          <img
            src="https://img.icons8.com/fluency/48/user-male.png"
            width={22}
            height={22}
            alt=""
            style={{ display: "block" }}
          />
        </div>
        <div style={s.guildOuter}>
          <div style={s.guildRow()}>
            {ROW_ONE.map((m) => (
              <div key={m.name} style={s.cardWrap()}>
                <MemberCard m={m} />
              </div>
            ))}
          </div>
          <div style={s.guildRow()}>
            {ROW_TWO.map((m) => (
              <div key={m.name} style={s.cardWrap()}>
                <MemberCard m={m} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
