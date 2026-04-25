import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const VIDEO_SRCS = [
  '/videos/video2.mp4',   // slot 0 — void/purple
  '/videos/video3.mp4',   // slot 1 — emerald/green  (new green video)
  '/videos/video0.mp4',   // slot 2 — crimson
];

export default function VideoBackground() {
  const { mode, activeVideo, muted, videoRefsObj, setVideoRef, currentTheme: t } = useTheme();

  useEffect(() => {
    Object.values(videoRefsObj.current).forEach(v => {
      if (v) v.muted = muted;
    });
  }, [muted, videoRefsObj]);

  useEffect(() => {
    Object.entries(videoRefsObj.current).forEach(([idxStr, v]) => {
      if (!v) return;
      const idx = Number(idxStr);
      if (mode === 'fun' && idx === activeVideo) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [mode, activeVideo, videoRefsObj]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        willChange: 'opacity',
        transform: 'translateZ(0)',
      }}
    >
      {/* ── Layer 1: Deep background grid (large cells, very dim) ─────────── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
        `,
        backgroundSize: '120px 120px',
        maskImage: 'radial-gradient(ellipse 120% 100% at 50% 50%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 120% 100% at 50% 50%, black 30%, transparent 100%)',
      }} />

      {/* ── Layer 2: Mid grid (medium cells, slightly brighter) ───────────── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 40%, black 0%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 40%, black 0%, transparent 80%)',
      }} />

      {/* ── Layer 3: Fine foreground grid — accent tint from current theme ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(${t.accent}18 1px, transparent 1px),
          linear-gradient(90deg, ${t.accent}18 1px, transparent 1px)
        `,
        backgroundSize: '12px 12px',
        maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 70%)',
        transition: 'background-image 0.6s ease',
      }} />

      {/* ── Videos (fun mode only) ───────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: mode === 'fun' ? 1 : 0,
          transition: 'opacity 0.9s ease',
        }}
      >
        {VIDEO_SRCS.map((src, i) => (
          <video
            key={i}
            ref={setVideoRef(i)}
            src={src}
            loop
            playsInline
            muted={muted}
            preload="metadata"
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: activeVideo === i ? 0.40 : 0,
              filter: `saturate(1.6) contrast(1.05) brightness(1.0)`,
              transition: 'opacity 0.9s ease, filter 0.6s ease',
              willChange: 'opacity',
            }}
          />
        ))}
      </div>

      {/* ── Overlay — flat, same value top to bottom ─────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
