import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const LIVE_URL = 'https://protocol.home.kg/';

const features = [
  'Per-user cloud storage with Firebase Auth + Firestore — full login system with session management',
  'Habit OS with scheduling, streaks, and smart reminders — a real system, not just a checklist',
  'AI-powered quote engine via Python script using Anthropic API — generates 200+ themed quotes per run',
  'Custom smartFill bezier chart plugin for beautiful data visualization',
  'Entrance exam tracker, calendar, onboarding, admin API, keyboard shortcuts — production-grade',
  'Firestore document size management with intelligent trimming to stay under limits',
];

const techStack = ['Vanilla JS', 'Firebase Auth', 'Firestore', 'Chart.js', 'Python', 'Anthropic API', 'HTML/CSS'];

/* ─── 3D Pane / Door — right panel mockup wrapper ───────────────────────── */
function PaneWrapper({ children, isFun, isPro, cardVis, accent }) {
  const wrapRef  = useRef(null);
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);

  /* 3D is active in BOTH fun and pro modes */
  const is3D = isFun || isPro;

  /* Door swings open once card is visible (both modes) */
  useEffect(() => {
    if (!is3D || !cardVis) return;
    const id = setTimeout(() => setOpen(true), 400);
    return () => clearTimeout(id);
  }, [is3D, cardVis]);

  /* Reset open state when 3D is no longer active */
  useEffect(() => {
    if (!is3D) setOpen(false);
  }, [is3D]);

  /* Mouse-parallax tilt — active in both modes once door is open.
     Fun: stronger tilt (±8°). Pro: subtler tilt (±4°) — stays refined. */
  useEffect(() => {
    if (!is3D || !open) return;
    const wrap  = wrapRef.current;
    const panel = panelRef.current;
    if (!wrap || !panel) return;

    const maxRX = isFun ? 6  : 3;   /* fun = expressive, pro = subtle */
    const maxRY = isFun ? 8  : 4;

    let raf = null;
    let targetRX = 0, targetRY = 0;
    let currentRX = 0, currentRY = 0;

    const onMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      targetRX   = ((e.clientY - cy) / (rect.height / 2)) * -maxRX;
      targetRY   = ((e.clientX - cx) / (rect.width  / 2)) *  maxRY;
    };

    const onLeave = () => { targetRX = 0; targetRY = 0; };

    const tick = () => {
      currentRX += (targetRX - currentRX) * 0.08;
      currentRY += (targetRY - currentRY) * 0.08;
      panel.style.transform =
        `perspective(1000px) rotateX(${currentRX}deg) rotateY(${currentRY}deg) scale3d(1.01,1.01,1.01)`;
      raf = requestAnimationFrame(tick);
    };

    wrap.addEventListener('mousemove',  onMove, { passive: true });
    wrap.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      wrap.removeEventListener('mousemove',  onMove);
      wrap.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
      if (panel) panel.style.transform = '';
    };
  }, [is3D, isFun, open]);

  return (
    /* Outer perspective container */
    <div
      ref={wrapRef}
      style={{
        width: '100%', maxWidth: '360px',
        perspective: '1000px',
        perspectiveOrigin: '50% 50%',
        /* Sit the whole thing so the door swings from the left hinge */
        transformStyle: 'preserve-3d',
        position: 'relative',
      }}
    >
      {/* Hinge shadow — appears as door opens (both fun + pro) */}
      {is3D && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0, top: '10%', bottom: '10%',
            width: '6px',
            background: `linear-gradient(90deg, ${accent}30, transparent)`,
            borderRadius: '3px 0 0 3px',
            opacity: open ? 1 : 0,
            transition: 'opacity 0.6s ease 0.5s',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />
      )}

      {/* The panel that tilts / door-opens */}
      <div
        ref={panelRef}
        style={{
          width: '100%',
          border: `1px solid`,
          borderColor: 'inherit',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
          transformOrigin: 'left center',
          /* Door swing — same mechanic, spring for fun, smooth for pro */
          transform: is3D
            ? open
              ? 'perspective(1000px) rotateY(0deg)'
              : 'perspective(1000px) rotateY(-90deg)'
            : undefined,
          transition: is3D
            ? open
              ? isFun
                ? 'transform 0.85s cubic-bezier(0.34,1.1,0.64,1), box-shadow 0.6s ease'
                : 'transform 1.0s cubic-bezier(0.16,1,0.3,1), box-shadow 0.6s ease'
              : 'transform 0.4s ease'
            : undefined,
          boxShadow: is3D && open
            ? `0 32px 80px ${accent}25, 0 0 0 1px ${accent}20`
            : `0 24px 60px ${accent}15`,
          /* Entry animation (non-3D fallback) */
          opacity: cardVis ? 1 : 0,
          ...(is3D ? {} : {
            transition: 'opacity 0.7s ease 0.3s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s, border-color 0.4s, box-shadow 0.4s',
            transform: cardVis ? 'translateX(0) translateY(0)' : 'translateX(40px) translateY(20px)',
          }),
        }}
      >
        {/* Scanlines — fun mode ONLY, too noisy for pro */}
        {isFun && (
          <div
            aria-hidden="true"
            className="proj-scanlines"
            style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', borderRadius: '8px' }}
          />
        )}

        {/* Shine layer — both fun and pro for 3D depth */}
        {is3D && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(135deg, ${accent}08 0%, transparent 50%, ${accent}04 100%)`,
              pointerEvents: 'none',
              zIndex: 19,
              borderRadius: '8px',
              opacity: open ? 1 : 0,
              transition: 'opacity 0.6s ease 0.7s',
            }}
          />
        )}

        {children}
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function Project() {
  const { currentTheme: t, mode } = useTheme();
  const isFun = mode === 'fun';
  const isPro = mode === 'professional';
  const titleRef    = useRef(null);
  const cardRef     = useRef(null);  // entry animation + visible grid shell
  const tiltWrapRef = useRef(null);  // outer perspective wrapper — RAF tilt
  const shineRef    = useRef(null);  // cursor-tracking shine overlay
  const [titleVis, setTitleVis] = useState(false);
  const [cardVis,  setCardVis]  = useState(false);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setTitleVis(e.isIntersecting), { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setCardVis(e.isIntersecting), { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── Outer card tilt RAF — runs in both fun and pro modes ──────────────
     tiltWrapRef is the event surface + tilt target.
     cardRef sits inside it and handles only entry animation.
     No CSS transition on transform for tiltWrapRef — RAF owns it exclusively.
     Fun: ±8°. Pro: ±5° (subtle but present).
  ─────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const wrap = tiltWrapRef.current;
    if (!wrap) return;

    const MAX = isFun ? 8 : isPro ? 5 : 0;
    if (MAX === 0) return; // no tilt in other modes

    const LERP       = 0.08;
    const target     = { rx: 0, ry: 0 };
    const current    = { rx: 0, ry: 0 };
    let hovering     = false;
    let raf          = null;

    const tick = () => {
      const trx = hovering ? target.rx : 0;
      const try_ = hovering ? target.ry : 0;
      current.rx += (trx  - current.rx) * LERP;
      current.ry += (try_ - current.ry) * LERP;

      wrap.style.transform =
        `perspective(1200px) rotateX(${current.rx}deg) rotateY(${current.ry}deg) scale3d(1.01,1.01,1.01)`;

      /* Dynamic shadow — shifts opposite to tilt for depth illusion */
      const shadowX = current.ry * 2;
      const shadowY = current.rx * -2;
      const shadowBlur = 40 + Math.abs(current.rx) * 3 + Math.abs(current.ry) * 3;
      if (cardRef.current) {
        cardRef.current.style.boxShadow =
          hovering
          ? `${shadowX}px ${shadowY}px ${shadowBlur}px ${t.accent}25, 0 0 0 1px ${t.accent}15`
          : `0 30px 80px ${t.accent}10`;
      }

      if (!hovering && Math.abs(current.rx) < 0.03 && Math.abs(current.ry) < 0.03) {
        current.rx = 0; current.ry = 0;
        wrap.style.transform = '';
        cancelAnimationFrame(raf);
        raf = null;
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    const startRAF = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const onEnter = () => { hovering = true;  startRAF(); if (shineRef.current) shineRef.current.style.opacity = '1'; };
    const onLeave = () => { hovering = false; startRAF(); if (shineRef.current) shineRef.current.style.opacity = '0'; };
    const onMove  = (e) => {
      const rect = wrap.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      target.rx  = ((e.clientY - cy) / (rect.height / 2)) * -MAX;
      target.ry  = ((e.clientX - cx) / (rect.width  / 2)) *  MAX;
      /* Shine follows cursor */
      if (shineRef.current) {
        const px = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
        const py = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
        const alpha = isFun ? 0.09 : 0.06;
        shineRef.current.style.background =
          `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,${alpha}) 0%, transparent 55%)`;
      }
    };

    wrap.addEventListener('mouseenter', onEnter);
    wrap.addEventListener('mouseleave', onLeave);
    wrap.addEventListener('mousemove',  onMove, { passive: true });

    return () => {
      wrap.removeEventListener('mouseenter', onEnter);
      wrap.removeEventListener('mouseleave', onLeave);
      wrap.removeEventListener('mousemove',  onMove);
      cancelAnimationFrame(raf);
      wrap.style.transform = '';
    };
  }, [isFun, isPro]);

  const descWords = "A full-stack productivity and habit-tracking web app with per-user cloud sync, intelligent scheduling, and a quote engine. Built because I needed a system I'd actually use — so I built one from scratch.".split(' ');

  return (
    <section
      id="project"
      style={{
        padding: '100px 48px',
        background: t.bg,
        transition: 'background 0.6s',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* ── Section heading ─────────────────────────────────────────────── */}
      <div ref={titleRef}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px', color: t.accent,
          letterSpacing: '3px', textTransform: 'uppercase',
          marginBottom: '12px',
          opacity:    titleVis ? 1 : 0,
          transform:  titleVis ? 'translateX(0)' : 'translateX(-30px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}>
          02 — Work
        </div>

        <div style={{ marginBottom: '64px', overflow: 'hidden' }}>
          {/* "WHAT I" — letters fly up */}
          {'WHAT I'.split('').map((ch, i) => (
            <span key={i} style={{
              display: 'inline-block',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(48px, 7vw, 80px)',
              lineHeight: 1, color: t.text,
              opacity:    titleVis ? 1 : 0,
              transform:  titleVis ? 'translateY(0) rotate(0)' : 'translateY(80%) rotate(-3deg)',
              transition: `opacity 0.55s ease ${i * 40}ms, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 40}ms`,
            }}>
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
          <br />
          {'BUILT'.split('').map((ch, i) => (
            <span key={i} style={{
              display: 'inline-block',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(48px, 7vw, 80px)',
              lineHeight: 1, color: t.text,
              opacity:    titleVis ? 1 : 0,
              transform:  titleVis ? 'translateY(0) rotate(0)' : 'translateY(80%) rotate(3deg)',
              transition: `opacity 0.55s ease ${240 + i * 40}ms, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${240 + i * 40}ms`,
            }}>
              {ch}
            </span>
          ))}
        </div>
      </div>

      {/* ── Card grid outer: tilt surface ────────────────────────────────── */}
      <div
        ref={tiltWrapRef}
        className="project-grid"
        style={{
          perspective: (isFun || isPro) ? '1200px' : 'none',
          transformStyle: 'preserve-3d',
          willChange: (isFun || isPro) ? 'transform' : 'auto',
        }}
      >
      {/* Entry-animation shell */}
      <div
        ref={cardRef}
        style={{
          border: `1px solid ${t.border}`,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          overflow: 'hidden',
          position: 'relative',
          opacity:    cardVis ? 1 : 0,
          transform:  cardVis ? 'translateY(0)' : 'translateY(50px)',
          boxShadow:  cardVis ? `0 30px 80px ${t.accent}10` : 'none',
          transitionProperty: 'opacity, transform, border-color',
          transitionDuration: '0.75s',
          transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
          transition: 'border-color 0.4s, opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Cursor-tracking shine overlay — 3D tilt depth hint */}
        {(isFun || isPro) && (
          <div
            ref={shineRef}
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              pointerEvents: 'none',
              zIndex: 50,
              opacity: 0,
              transition: 'opacity 0.3s ease',
              borderRadius: 'inherit',
            }}
          />
        )}
        {/* ── Left panel ───────────────────────────────────────────────── */}
        <div style={{ padding: '64px', background: t.card, transition: 'background 0.4s' }}>

          {/* Badge */}
          <div style={{
            display: 'inline-block',
            padding: '4px 14px',
            background: `${t.accent}18`,
            border: `1px solid ${t.accent}40`,
            color: t.accent,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
            marginBottom: '24px', borderRadius: '2px',
            opacity:    cardVis ? 1 : 0,
            transform:  cardVis ? 'translateX(0)' : 'translateX(-20px)',
            transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
          }}>
            Featured Project · 2026
          </div>

          {/* ── FIX: PROTOCOL on ONE line — no <br/>, nowrap container ── */}
          <div style={{
            marginBottom: '24px',
            lineHeight: 0.9,
            whiteSpace: 'nowrap',   /* keeps all 8 letters on one line */
            overflow: 'hidden',
          }}>
            {'PROTOCOL'.split('').map((ch, i) => (
              <span key={i} style={{
                display: 'inline-block',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(48px, 6vw, 72px)',
                letterSpacing: '-1px',
                color: t.text,
                opacity:    cardVis ? 1 : 0,
                transform:  cardVis ? 'translateX(0)' : 'translateX(-60px)',
                transition: `opacity 0.5s ease ${0.2 + i * 0.045}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.045}s`,
                /* fun mode: letter glow stagger */
                textShadow: isFun && cardVis
                  ? `0 0 ${12 + i * 4}px ${t.accent}${30 + i * 5 < 99 ? (30 + i * 5).toString(16) : 'ff'}`
                  : 'none',
              }}>
                {ch}
              </span>
            ))}
          </div>

          {/* Description — word by word */}
          <p style={{ fontSize: '14px', color: t.text2, lineHeight: 1.8, marginBottom: '28px' }}>
            {descWords.map((word, i) => (
              <span key={i} style={{
                display: 'inline-block', marginRight: '4px',
                opacity:    cardVis ? 1 : 0,
                transform:  cardVis ? 'translateY(0)' : 'translateY(12px)',
                transition: `opacity 0.35s ease ${0.4 + i * 0.022}s, transform 0.35s ease ${0.4 + i * 0.022}s`,
              }}>
                {word}
              </span>
            ))}
          </p>

          {/* Tech tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
            {techStack.map((tech, i) => (
              <span
                key={tech}
                style={{
                  padding: '4px 12px',
                  border: `1px solid ${t.border}`,
                  color: t.text2,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px', letterSpacing: '1px', borderRadius: '2px',
                  opacity:    cardVis ? 1 : 0,
                  transform:  cardVis ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
                  transitionDelay: `${0.6 + i * 0.055}s`,
                  transitionProperty: 'opacity, transform, border-color, color',
                  transition: `opacity 0.4s ease ${0.6 + i * 0.055}s, transform 0.4s cubic-bezier(0.16,1,0.3,1) ${0.6 + i * 0.055}s, border-color 0.25s, color 0.25s`,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border;  e.currentTarget.style.color = t.text2; }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
            {features.map((f, i) => (
              <div key={i} style={{
                display: 'flex', gap: '12px', alignItems: 'flex-start',
                opacity:    cardVis ? 1 : 0,
                transform:  cardVis ? 'translateX(0)' : 'translateX(-20px)',
                transition: `opacity 0.5s ease ${0.8 + i * 0.075}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${0.8 + i * 0.075}s`,
              }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: t.accent, marginTop: '6px', flexShrink: 0,
                  boxShadow: `0 0 6px ${t.accent}60`,
                }} />
                <span style={{ fontSize: '13px', color: t.text2, lineHeight: 1.6 }}>{f}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a
              href={LIVE_URL} target="_blank" rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 32px', background: t.accent, color: t.bg,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: '2px',
                transition: 'all 0.25s',
                boxShadow: `0 0 20px ${t.accent}30`,
                opacity: cardVis ? 1 : 0,
                transitionDelay: `${0.8 + features.length * 0.075}s`,
                transitionProperty: 'opacity, background, transform, box-shadow',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 30px ${t.accent}50`; }}
              onMouseLeave={e => { e.currentTarget.style.background = t.accent; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 0 20px ${t.accent}30`; }}
            >
              <span style={{ fontSize: '14px' }}>↗</span> Live App
            </a>
            <a
              href="#contact"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 32px', background: 'transparent', color: t.text,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase',
                textDecoration: 'none', border: `1px solid ${t.border}`, borderRadius: '2px',
                transition: 'all 0.25s',
                opacity: cardVis ? 1 : 0,
                transitionDelay: `${0.9 + features.length * 0.075}s`,
                transitionProperty: 'opacity, border-color, color',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = t.border;  e.currentTarget.style.color = t.text; }}
            >
              Get In Touch
            </a>
          </div>
        </div>

        {/* ── Right panel — 3D pane / door ────────────────────────────── */}
        <div style={{
          background: t.bg2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '48px',
          position: 'relative', overflow: 'hidden',
          transition: 'background 0.4s',
          /* Give perspective to the column so the door has depth */
          perspective: (isFun || isPro) ? '1200px' : 'none',
          perspectiveOrigin: '50% 50%',
        }}>
          {/* Glow orb background */}
          <div style={{
            position: 'absolute',
            width: '300px', height: '300px', borderRadius: '50%',
            background: `radial-gradient(circle, ${t.accent}20 0%, transparent 70%)`,
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            animation: 'glowPulse 3s ease-in-out infinite',
            pointerEvents: 'none',
          }} />

          {/* Fun-mode corner label only — pro stays clean */}
          {isFun && (
            <div style={{
              position: 'absolute', top: '16px', right: '16px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px', letterSpacing: '2px', color: t.accent,
              textTransform: 'uppercase', opacity: 0.6,
              zIndex: 30,
            }}>
              3D · LIVE
            </div>
          )}

          {/* ── PaneWrapper handles door swing + parallax tilt ── */}
          <PaneWrapper isFun={isFun} isPro={isPro} cardVis={cardVis} accent={t.accent}>
            {/* Title bar */}
            <div style={{
              background: t.bg, padding: '10px 16px',
              display: 'flex', alignItems: 'center', gap: '8px',
              borderBottom: `1px solid ${t.border}`,
            }}>
              {['#ff5f57','#ffbd2e','#28ca42'].map(c => (
                <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
              ))}
              <div style={{
                marginLeft: '8px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px', color: t.text3, letterSpacing: '1px',
              }}>
                protocol.home.kg · v2.0
              </div>
            </div>

            {/* Body */}
            <div style={{ background: t.card, display: 'flex' }}>
              {/* Sidebar icons */}
              <div style={{
                width: '44px', background: t.bg,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', padding: '16px 0', gap: '16px',
                borderRight: `1px solid ${t.border}`,
              }}>
                {['🏠','🌱','📅','📊','🎯','⚙️'].map((icon, i) => (
                  <div key={icon} style={{ fontSize: '14px', opacity: i === 0 ? 1 : 0.4 }}>{icon}</div>
                ))}
              </div>

              {/* Main content */}
              <div style={{ flex: 1, padding: '20px 16px' }}>
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '16px', letterSpacing: '2px',
                  color: t.text, marginBottom: '4px',
                }}>
                  GOOD MORNING, DHRUV
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '9px', color: t.text3, letterSpacing: '1px',
                  marginBottom: '16px',
                }}>
                  FRI · 24 APRIL 2026
                </div>

                {[
                  { text: 'Morning workout — 45 min',   done: true  },
                  { text: 'Python — Chapter 8: OOP',    done: true  },
                  { text: 'Class 12 Maths — Integrals', done: false },
                  { text: 'Read — 30 pages',            done: false },
                  { text: 'Polaris Prep — 1hr',         warn: true  },
                ].map(({ text, done, warn }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: done ? '#47ffb4' : warn ? t.accent : t.border,
                      flexShrink: 0,
                    }} />
                    <div style={{
                      fontSize: '11px',
                      color: done ? t.text3 : t.text2,
                      textDecoration: done ? 'line-through' : 'none',
                    }}>
                      {text}
                    </div>
                  </div>
                ))}

                {/* Progress bar */}
                <div style={{ marginTop: '12px' }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '9px', color: t.text3, letterSpacing: '1px', marginBottom: '6px',
                  }}>
                    TODAY'S PROTOCOL — 40%
                  </div>
                  <div style={{ height: '3px', background: t.border, borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      width: cardVis ? '40%' : '0%', height: '100%',
                      background: t.accent, borderRadius: '2px',
                      transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1) 0.8s, background 0.4s',
                    }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer bar */}
            <div style={{
              background: t.bg, borderTop: `1px solid ${t.border}`,
              padding: '8px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px', color: t.text3, letterSpacing: '1px',
              }}>🟢 LIVE</span>
              <a
                href={LIVE_URL} target="_blank" rel="noreferrer"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '9px', color: t.accent, letterSpacing: '1px',
                  textDecoration: 'none', transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.7'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                protocol.home.kg ↗
              </a>
            </div>
          </PaneWrapper>
        </div>
      </div>{/* /entry-animation shell */}
      </div>{/* /tiltWrapRef outer */}

      <style>{`
        /* Glow pulse for the background orb */
        @keyframes glowPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1);   opacity: 0.6; }
          50%       { transform: translate(-50%, -50%) scale(1.3); opacity: 1;   }
        }

        /* Scanlines — thin repeating horizontal lines for CRT / fun mode feel */
        .proj-scanlines {
          background: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 3px,
            rgba(0,0,0,0.06) 3px,
            rgba(0,0,0,0.06) 4px
          );
          animation: scanSlide 8s linear infinite;
        }
        @keyframes scanSlide {
          from { background-position: 0 0; }
          to   { background-position: 0 100px; }
        }

        /* Responsive */
        @media (max-width: 900px) {
          .project-grid { width: 100%; }
          .project-grid > div { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          #project { padding: 80px 24px !important; }
          .project-grid > div > div:nth-child(2) { padding: 32px 24px !important; }
          .project-grid > div > div:last-child  { min-height: 400px; padding: 32px 24px !important; }
        }
      `}</style>
    </section>
  );
}
