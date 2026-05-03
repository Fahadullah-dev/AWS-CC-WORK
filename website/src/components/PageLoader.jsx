import { useEffect, useRef } from "react";
import anime from "../utils/anime";

const LOADER_PIXELS = [
  { top: "42%", left: "44%", color: "#FF6B2B" },
  { top: "44%", left: "56%", color: "#3D2C8D" },
  { top: "56%", left: "46%", color: "#3D2C8D" },
];

export default function PageLoader() {
  const loaderRef = useRef(null);
  const iconRef = useRef(null);
  const textRef = useRef(null);
  const barFillRef = useRef(null);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    anime.set(loader, { opacity: 0 });
    anime.set(iconRef.current, { scale: 0.5, opacity: 0 });
    anime.set(textRef.current, { opacity: 0, translateY: 8 });
    anime.set(barFillRef.current, { width: "0%" });

    const tl = anime.timeline({ easing: "easeOutExpo" });

    tl.add({
      targets: loader,
      opacity: [0, 1],
      duration: 150,
    })
      .add(
        {
          targets: iconRef.current,
          scale: [0.5, 1.1, 1],
          opacity: [0, 1],
          duration: 400,
          easing: "easeOutBack",
        },
        0,
      )
      .add(
        {
          targets: textRef.current,
          opacity: [0, 1],
          translateY: [8, 0],
          duration: 300,
          delay: 150,
        },
        0,
      )
      .add(
        {
          targets: barFillRef.current,
          width: ["0%", "100%"],
          duration: 500,
          delay: 100,
          easing: "easeInOutExpo",
        },
        0,
      )
      .add(
        {
          targets: ".loader-pixel",
          translateX: () => anime.random(-40, 40),
          translateY: () => anime.random(-40, 40),
          opacity: [1, 0],
          scale: [1, 0],
          duration: 400,
          delay: 500,
          easing: "easeOutExpo",
        },
        0,
      )
      .add(
        {
          targets: loader,
          opacity: [1, 0],
          translateY: [0, -20],
          duration: 300,
          delay: 550,
          easing: "easeInExpo",
        },
        0,
      );
  }, []);

  return (
    <div
      ref={loaderRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#111111",
        zIndex: 8888,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px",
        pointerEvents: "none",
      }}
    >
      {LOADER_PIXELS.map((p, i) => (
        <div
          key={i}
          className="loader-pixel"
          style={{
            position: "absolute",
            width: 6,
            height: 6,
            background: p.color,
            top: p.top,
            left: p.left,
          }}
        />
      ))}

      <img
        ref={iconRef}
        src="/aws-sbg-logo.png"
        width={40}
        height={40}
        alt=""
        style={{ display: "block", imageRendering: "pixelated" }}
      />

      <div
        ref={textRef}
        style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 900,
          fontSize: "20px",
          lineHeight: 1,
          letterSpacing: "0.05em",
        }}
      >
        <span style={{ color: "#FFFFFF" }}>AWS SBG</span>
        <span style={{ color: "#FF6B2B" }}>X MURDOCH</span>
      </div>

      <div
        style={{
          width: "80px",
          height: "3px",
          background: "#222222",
          border: "1px solid #333333",
          overflow: "hidden",
        }}
      >
        <div
          ref={barFillRef}
          style={{ height: "100%", width: "0%", background: "#FF6B2B" }}
        />
      </div>
    </div>
  );
}
