"use client";

import { useEffect, useState, useRef, useCallback } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const lastUpdateRef = useRef<number>(0);
  const throttleDelay = 16; // ~60fps

  const updateMousePosition = useCallback((e: MouseEvent) => {
    const now = Date.now();
    if (now - lastUpdateRef.current < throttleDelay) return;
    lastUpdateRef.current = now;

    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseDown = useCallback(() => setIsClicking(true), []);
  const handleMouseUp = useCallback(() => setIsClicking(false), []);

  useEffect(() => {
    document.addEventListener("mousemove", updateMousePosition, {
      passive: true,
    });
    document.addEventListener("mousedown", handleMouseDown, { passive: true });
    document.addEventListener("mouseup", handleMouseUp, { passive: true });

    return () => {
      document.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [updateMousePosition, handleMouseDown, handleMouseUp]);

  return (
    <div
      className={`custom-cursor ${isClicking ? "clicking" : ""}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  );
}
