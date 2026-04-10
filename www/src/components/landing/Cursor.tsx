"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useMotionValue(-100);
  const trailY = useMotionValue(-100);

  const springX = useSpring(trailX, { stiffness: 80, damping: 18, mass: 0.5 });
  const springY = useSpring(trailY, { stiffness: 80, damping: 18, mass: 0.5 });

  const scaleRef = useRef(1);
  const cursorScale = useMotionValue(1);
  const trailScale = useMotionValue(1);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);
    };

    const enterEl = () => {
      cursorScale.set(6.5);
      trailScale.set(2);
    };
    const leaveEl = () => {
      cursorScale.set(1);
      trailScale.set(1);
    };

    const addListeners = () => {
      document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
        el.addEventListener("mouseenter", enterEl);
        el.addEventListener("mouseleave", leaveEl);
      });
    };

    window.addEventListener("mousemove", move);

    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    addListeners();

    return () => {
      window.removeEventListener("mousemove", move);
      observer.disconnect();
    };
  }, [cursorX, cursorY, trailX, trailY, cursorScale, trailScale]);

  return (
    <>
      {/* Dot cursor */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          scale: cursorScale,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#c2f13c",
        }}
      />
      {/* Trail ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998]"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          scale: trailScale,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1px solid rgba(194,241,60,0.35)",
        }}
      />
    </>
  );
}
