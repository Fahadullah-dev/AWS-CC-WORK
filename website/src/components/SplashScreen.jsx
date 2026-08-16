import { useEffect, useRef } from "react";
import anime from "../utils/anime";

const PIXELS = [
  { top: "30%", left: "18%", color: "#FF6B2B" },
  { top: "25%", right: "20%", color: "#3D2C8D" },
  { top: "65%", left: "22%", color: "#3D2C8D" },
  { top: "68%", right: "18%", color: "#FF6B2B" },
];

export default function SplashScreen({ onComplete }) {
  const wrapRef = useRef(null);
  const logoAwsRef = useRef(null);
  const logoSbgRef = useRef(null);
  const logoDxbRef = useRef(null);
  const taglineRef = useRef(null);
  const barFillRef = useRef(null);
  const logoBlockRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const logoAws = logoAwsRef.current;
    const logoSbg = logoSbgRef.current;
    const logoDxb = logoDxbRef.current;
    const tagline = taglineRef.current;
    const barFill = barFillRef.current;
    const logoBlock = logoBlockRef.current;

    if (!wrap) {
      onComplete();
      return;
    }

    const safeComplete = () => {
      if (wrap) wrap.style.display = "none";
      onComplete();
    };

    const fallback = setTimeout(safeComplete, 2600);

    try {
      const tl = anime.timeline({ easing: "easeOutExpo" });

      tl.add({
        targets: logoAws,
        opacity: [0, 1],
        translateX: [-40, 0],
        duration: 500,
      })
        .add(
          {
            targets: logoSbg,
            opacity: [0, 1],
            translateX: [40, 0],
            duration: 500,
          },
          100,
        )
        .add(
          {
            targets: logoDxb,
            opacity: [0, 1],
            scale: [0.5, 1],
            duration: 400,
            easing: "easeOutBack",
          },
          300,
        )
        .add(
          {
            targets: ".splash-pixel",
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            delay: anime.stagger(100, { start: 200 }),
            duration: 800,
            easing: "easeOutBack",
          },
          200,
        )
        .add(
          {
            targets: tagline,
            opacity: [0, 1],
            translateY: [10, 0],
            duration: 400,
            easing: "easeOutExpo",
          },
          600,
        )
        .add(
          {
            targets: barFill,
            width: ["0%", "100%"],
            duration: 600,
            easing: "easeInOutExpo",
          },
          700,
        )
        .add({
          targets: logoBlock,
          translateX: () => {
            const target = document.getElementById("navbar-logo-target");
            if (!target) return 0;
            const rect = target.getBoundingClientRect();
            return rect.left + rect.width / 2 - window.innerWidth / 2;
          },
          translateY: () => {
            const target = document.getElementById("navbar-logo-target");
            if (!target) return 0;
            const rect = target.getBoundingClientRect();
            return rect.top + rect.height / 2 - window.innerHeight / 2;
          },
          scale: [1, 0.35],
          duration: 700,
          easing: "easeInExpo",
          delay: 1200,
        })
        .add({
          targets: wrap,
          opacity: [1, 0],
          duration: 400,
          easing: "easeInExpo",
          delay: 200,
          complete: () => {
            clearTimeout(fallback);
            safeComplete();
          },
        });
    } catch {
      clearTimeout(fallback);
      safeComplete();
    }

    return () => clearTimeout(fallback);
  }, [onComplete]);

  const isMobile = window.innerWidth < 768;

  return (
    <div
      ref={wrapRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#111111",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {PIXELS.map((p, i) => (
        <div
          key={i}
          className="splash-pixel"
          style={{
            position: "absolute",
            width: 8,
            height: 8,
            background: p.color,
            top: p.top,
            left: p.left,
            right: p.right,
            opacity: 0,
          }}
        />
      ))}

      <div
        ref={logoBlockRef}
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 0,
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 900,
          fontSize: isMobile ? "32px" : "48px",
          letterSpacing: "0.05em",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        <span ref={logoAwsRef} style={{ color: "#FFFFFF", opacity: 0 }}>
          AWS&nbsp;
        </span>
        <span ref={logoSbgRef} style={{ color: "#FFFFFF", opacity: 0 }}>
          SBG
        </span>
        <span ref={logoDxbRef} style={{ color: "#FF6B2B", opacity: 0 }}>
          .DXB
        </span>
      </div>

      <p
        ref={taglineRef}
        style={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: "13px",
          color: "#6B6B6B",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginTop: "16px",
          opacity: 0,
        }}
      >
        AWS STUDENT BUILDER GROUP. MURDOCH
      </p>

      <div
        style={{
          width: "120px",
          height: "2px",
          background: "#222222",
          border: "1px solid #333333",
          marginTop: "20px",
          overflow: "hidden",
        }}
      >
        <div
          ref={barFillRef}
          style={{
            height: "100%",
            width: "0%",
            background: "#FF6B2B",
          }}
        />
      </div>
    </div>
  );
}
