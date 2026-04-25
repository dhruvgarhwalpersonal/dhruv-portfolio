import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const goals = [
  {
    num: '01',
    icon: '📚',
    title: 'CLASS 12 — 100%',
    text: (accent) => (
      <>
        Not 90. Not 95. <span style={{ color: accent, fontWeight: 500 }}>100%</span>. I know what
        I'm capable of when I'm locked in. First month at JEE coaching — I was top of 300.
        That version of me comes back, but for the right thing this time.
      </>
    ),
  },
  {
    num: '02',
    icon: '🐍',
    title: 'PYTHON — ADVANCED',
    text: (accent) => (
      <>
        From beginner to advanced this year. Already using Anthropic's API via Python
        (see: Protocol's quote engine). Next: data structures, algorithms, and building
        real tools. Not just tutorials — <span style={{ color: accent, fontWeight: 500 }}>actual projects</span>.
      </>
    ),
  },
  {
    num: '03',
    icon: '💪',
    title: '56kg → 70kg MUSCLE',
    text: (accent) => (
      <>
        Physical health matters. I returned from Kota at 56kg and 5'10½". Target:{' '}
        <span style={{ color: accent, fontWeight: 500 }}>70kg, mostly muscle</span>.
        Building the system, tracking the habit. Protocol holds me accountable.
      </>
    ),
  },
  {
    num: '04',
    icon: '🎯',
    title: 'POLARIS SCHOOL OF TECH',
    text: (accent) => (
      <>
        The final target. Crack the entrance exam. Get into{' '}
        <span style={{ color: accent, fontWeight: 500 }}>Polaris School of Technology</span>.
        Everything this year — the studying, the coding, the discipline — points here.
      </>
    ),
  },
];

/*
  Each card tumbles in from a unique 3D angle matching its grid position:
    01 top-left  → pitches forward + rolls left  + slides from left
    02 top-right → pitches forward + rolls right + slides from right
    03 bot-left  → pitches back   + rolls left   + slides from left
    04 bot-right → pitches back   + rolls right  + slides from right
*/
const ENTRY = [
  { rx:  24, ry: -16, tx: -24 },
  { rx:  24, ry:  16, tx:  24 },
  { rx: -20, ry: -16, tx: -24 },
  { rx: -20, ry:  16, tx:  24 },
];

function GoalCard({ num, icon, title, text, theme: t, index }) {
  /*
    TWO-LAYER architecture — zero CSS/RAF conflict:

    outerRef → CSS transition target for ENTRANCE only.
               After the card lands, outer is never touched again.
               All transforms on it reset to identity permanently.

    innerRef → RAF tilt target for HOVER only.
               Never has a CSS transition on `transform`.
               RAF starts on mouseenter, self-stops when idle after mouseleave.

    shineRef → specular highlight div, background+opacity driven by RAF/events.
  */
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const shineRef = useRef(null);

  const rafRef   = useRef(null);
  const hovering = useRef(false);
  const target   = useRef({ rx: 0, ry: 0 });
  const current  = useRef({ rx: 0, ry: 0 });

  /* ── ENTRANCE: 3D tumble on scroll ──────────────────────────────────── */
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const { rx, ry, tx } = ENTRY[index] || { rx: 20, ry: 0, tx: 0 };
    const staggerDelay = index * 110;

    /* Initial 3D state — no transition, fully hidden */
    outer.style.transition = 'none';
    outer.style.opacity    = '0';
    outer.style.transform  =
      `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateX(${tx}px) translateY(64px) scale(0.90)`;

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();

      setTimeout(() => {
        /*
          Spring easing: cubic-bezier(0.22, 1, 0.36, 1)
          Fast deceleration with a touch of overshoot — feels heavy landing.
          0.9s = weighted, not snappy.
        */
        outer.style.transition =
          'opacity 0.7s ease, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)';
        outer.style.opacity   = '1';
        outer.style.transform =
          'perspective(1000px) rotateX(0deg) rotateY(0deg) translateX(0px) translateY(0px) scale(1)';
      }, staggerDelay);

    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    obs.observe(outer);
    return () => obs.disconnect();
  }, [index]);

  /* ── HOVER: mouse-parallax tilt on innerRef via RAF ─────────────────
     Completely separate from entrance:
     - Different DOM node (inner, not outer)
     - No CSS transition on `transform` for inner — RAF owns it exclusively
     - Self-stopping: when not hovered and values < 0.04, RAF cancels itself
  ─────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    const shine = shineRef.current;
    if (!outer || !inner || !shine) return;

    const LERP   = 0.09;
    const MAX_RX = 9;
    const MAX_RY = 11;

    const tick = () => {
      const trx = hovering.current ? target.current.rx : 0;
      const try_ = hovering.current ? target.current.ry : 0;

      current.current.rx += (trx  - current.current.rx) * LERP;
      current.current.ry += (try_ - current.current.ry) * LERP;

      inner.style.transform =
        `perspective(900px) rotateX(${current.current.rx}deg) rotateY(${current.current.ry}deg) scale3d(1.025, 1.025, 1.025) translateZ(8px)`;

      /* Self-stop: flat and idle → kill RAF, reset */
      if (
        !hovering.current &&
        Math.abs(current.current.rx) < 0.04 &&
        Math.abs(current.current.ry) < 0.04
      ) {
        current.current = { rx: 0, ry: 0 };
        inner.style.transform = '';
        shine.style.opacity = '0';
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const startRAF = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };

    const onEnter = () => {
      hovering.current = true;
      inner.style.borderColor = t.accent;
      inner.style.background  = t.card;
      inner.style.boxShadow   = `0 20px 56px ${t.accent}22, 0 0 0 1px ${t.accent}30`;
      startRAF();
    };

    const onMove = (e) => {
      const rect = outer.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      target.current.rx = ((e.clientY - cy) / (rect.height / 2)) * -MAX_RX;
      target.current.ry = ((e.clientX - cx) / (rect.width  / 2)) *  MAX_RY;

      /* Shine tracks cursor */
      const px = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const py = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      shine.style.background =
        `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.09) 0%, transparent 58%)`;
      shine.style.opacity = '1';
    };

    const onLeave = () => {
      hovering.current = false;
      inner.style.borderColor = t.border;
      inner.style.background  = t.bg;
      inner.style.boxShadow   = 'none';
      /* RAF keeps running to lerp back to identity, then self-stops */
      startRAF();
    };

    outer.addEventListener('mouseenter', onEnter);
    outer.addEventListener('mousemove',  onMove, { passive: true });
    outer.addEventListener('mouseleave', onLeave);

    return () => {
      outer.removeEventListener('mouseenter', onEnter);
      outer.removeEventListener('mousemove',  onMove);
      outer.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [t]);

  return (
    /*
      OUTER — entrance animation wrapper.
      perspective here so rotateX/Y in entrance look correct in 3D space.
      After entrance completes, outer sits at identity transform permanently.
    */
    <div
      ref={outerRef}
      style={{
        position: 'relative',
        willChange: 'transform, opacity',
      }}
    >
      {/*
        INNER — hover tilt target.
        `transform` is 100% owned by the hover RAF.
        CSS transition here covers ONLY non-transform properties.
        transformStyle: preserve-3d lets translateZ on children work.
      */}
      <div
        ref={innerRef}
        style={{
          background: t.bg,
          border: `1px solid ${t.border}`,
          padding: '40px',
          position: 'relative',
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          transition: 'border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease',
          cursor: 'default',
        }}
      >
        {/* Specular shine — RAF writes background, CSS transitions opacity */}
        <div
          ref={shineRef}
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            opacity: 0,
            pointerEvents: 'none',
            zIndex: 10,
            borderRadius: 'inherit',
            transition: 'opacity 0.35s ease',
          }}
        />

        {/* Corner number — translateZ floats it above card face */}
        <div style={{
          position: 'absolute', top: '24px', right: '28px',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '72px', lineHeight: 1,
          color: t.border, userSelect: 'none',
          letterSpacing: '-2px',
          transform: 'translateZ(14px)',
          transition: 'color 0.4s',
        }}>
          {num}
        </div>

        {/* Icon */}
        <div style={{
          fontSize: '32px', marginBottom: '20px',
          display: 'inline-block',
          transform: 'translateZ(10px)',
        }}>
          {icon}
        </div>

        {/* Title */}
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '24px', letterSpacing: '1px',
          color: t.text, marginBottom: '16px',
          transform: 'translateZ(6px)',
          transition: 'color 0.4s',
        }}>
          {title}
        </div>

        {/* Body text */}
        <p style={{
          fontSize: '14px', color: t.text2,
          lineHeight: 1.85, position: 'relative',
          zIndex: 1, transition: 'color 0.4s',
        }}>
          {text(t.accent)}
        </p>
      </div>
    </div>
  );
}

export default function Goals() {
  const { currentTheme: t } = useTheme();

  return (
    <section
      id="goals"
      style={{
        padding: '100px 48px',
        background: t.bg2,
        transition: 'background 0.6s',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '11px', color: t.accent,
        letterSpacing: '3px', textTransform: 'uppercase',
        marginBottom: '12px', transition: 'color 0.4s',
      }}>
        04 — 2026 Targets
      </div>

      <h2 style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 'clamp(48px, 7vw, 80px)',
        lineHeight: 1, marginBottom: '64px',
        color: t.text, transition: 'color 0.4s',
      }}>
        THIS YEAR'S<br />PROTOCOL
      </h2>

      <div
        className="goals-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2px',
        }}
      >
        {goals.map((goal, i) => (
          <GoalCard key={goal.num} {...goal} theme={t} index={i} />
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .goals-grid { grid-template-columns: 1fr !important; }
          #goals { padding: 80px 24px !important; }
        }
      `}</style>
    </section>
  );
}
