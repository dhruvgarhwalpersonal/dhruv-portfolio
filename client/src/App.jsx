import React, { useEffect, useRef, useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import VideoBackground from './components/VideoBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Story from './components/Story';
import Project from './components/Project';
import Skills from './components/Skills';
import Goals from './components/Goals';
import Contact from './components/Contact';

/* ── Custom Alert singleton ─────────────────────────────────────────────── */
export const customAlert = (() => {
  let _show = null;
  return {
    show: (msg) => _show && _show(msg),
    _register: (fn) => { _show = fn; },
  };
})();

function CustomAlertModal() {
  const { currentTheme: t } = useTheme();
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    customAlert._register((m) => setMsg(m));
  }, []);

  if (!msg) return null;

  return (
    <div
      onClick={() => setMsg(null)}
      style={{
        position: 'fixed', inset: 0,
        zIndex: 100002,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: t.card || '#141414',
          border: `1px solid ${t.accent}`,
          borderLeft: `3px solid ${t.accent}`,
          borderRadius: '4px',
          padding: '32px 40px',
          maxWidth: '420px',
          width: '90%',
          boxShadow: `0 20px 60px rgba(0,0,0,0.7)`,
          animation: 'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: t.accent, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
          Notice
        </div>
        <p style={{ color: t.text, fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>{msg}</p>
        <button
          onClick={() => setMsg(null)}
          style={{
            background: t.accent, color: t.bg,
            border: 'none', borderRadius: '2px',
            padding: '10px 28px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px', fontWeight: 700,
            letterSpacing: '2px', textTransform: 'uppercase',
            cursor: 'none',
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}

function Divider() {
  const { currentTheme: t } = useTheme();
  return (
    <div style={{
      height: '1px',
      background: `linear-gradient(90deg, transparent, ${t.border}, transparent)`,
      margin: '0 48px',
      opacity: 0.5,
    }} />
  );
}

function Footer() {
  const { currentTheme: t } = useTheme();
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setVis(e.isIntersecting), { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <footer
      ref={ref}
      style={{
        padding: '32px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: `1px solid ${t.border || '#1a1a1a'}`,
        background: 'transparent',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      {['DHRUV GARHWAL · 2026', 'SRI GANGANAGAR, INDIA', 'BUILT WITH CODE & CONSEQUENCE'].map((txt, i) => (
        <span
          key={txt}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            color: t.text3 || '#333',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            opacity: vis ? 1 : 0,
            transform: vis ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.5s ease ${i * 120}ms, transform 0.5s ease ${i * 120}ms`,
          }}
        >
          {txt}
        </span>
      ))}
      <style>{`@media (max-width: 768px) { footer { padding: 24px !important; justify-content: center !important; text-align: center; } }`}</style>
    </footer>
  );
}

/* ── Custom Cursor ─────────────────────────────────────────────────────────── */
function CustomCursor() {
  const ringRef  = useRef(null);
  const dotRef   = useRef(null);
  const trailRef = useRef(null);
  const pos      = useRef({ x: 0, y: 0 });
  const ring     = useRef({ x: 0, y: 0 });
  const rafRef   = useRef(null);
  const { currentTheme: t } = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty('--cursor-accent', t.accent || '#e8ff47');
    document.documentElement.style.setProperty('--cursor-bg', t.bg || '#0a0a0a');
  }, [t]);

  useEffect(() => {
    const ringEl  = ringRef.current;
    const dotEl   = dotRef.current;
    const trailEl = trailRef.current;
    if (!ringEl || !dotEl || !trailEl) return;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      dotEl.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    };
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.1;
      ring.current.y += (pos.current.y - ring.current.y) * 0.1;
      const tx = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
      ringEl.style.transform  = tx;
      trailEl.style.transform = tx;
      rafRef.current = requestAnimationFrame(animate);
    };

    const onEnter = () => document.body.classList.add('cursor-hover');
    const onLeave = () => document.body.classList.remove('cursor-hover');
    const onDown  = () => document.body.classList.add('cursor-clicking');
    const onUp    = () => document.body.classList.remove('cursor-clicking');

    const attach = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, select, label')
        .forEach(el => {
          el.removeEventListener('mouseenter', onEnter);
          el.removeEventListener('mouseleave', onLeave);
          el.addEventListener('mouseenter', onEnter);
          el.addEventListener('mouseleave', onLeave);
        });
    };
    attach();
    const reattach = setTimeout(attach, 1500);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup',   onUp,   { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      clearTimeout(reattach);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div id="cursor-trail" ref={trailRef} />
      <div id="cursor-ring"  ref={ringRef}  />
      <div id="cursor-dot"   ref={dotRef}   />
    </>
  );
}

/* ── Enhanced ScrollReveal — bidirectional, stagger support ─────────────── */
function ScrollReveal() {
  useEffect(() => {
    const THRESHOLD = 0.12;
    const ROOT_MARGIN = '0px 0px -40px 0px';

    // Standard .reveal elements — bidirectional
    const revealObs = new IntersectionObserver(
      (entries) => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
        // Don't un-reveal on exit for standard reveals (one-shot)
      }),
      { threshold: THRESHOLD, rootMargin: ROOT_MARGIN }
    );

    // Stagger parent containers
    const staggerObs = new IntersectionObserver(
      (entries) => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          // Bidirectional for stagger
          entry.target.classList.remove('visible');
        }
      }),
      { threshold: 0.1, rootMargin: ROOT_MARGIN }
    );

    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
      document.querySelectorAll('.stagger-children').forEach(el => staggerObs.observe(el));
    }, 200);

    return () => {
      clearTimeout(timer);
      revealObs.disconnect();
      staggerObs.disconnect();
    };
  }, []);
  return null;
}

/* ── Theme global styles ─────────────────────────────────────────────────── */
function ThemeGlobalStyle() {
  const { currentTheme: t, mode } = useTheme();

  return (
    <style>{`
      ::selection { background: ${t.accent}33; color: ${t.accent}; }
      ${mode === 'fun' ? `
        section { background: transparent !important; }
        #hero { background: transparent !important; }

        /* Tilt-card apply to all major cards in fun mode */
        #goals [style*="border:"], #goals [style*="border :"],
        #project [style*="border:"],
        #skills [style*="border:"] {
          transform-style: preserve-3d;
        }

        /* ── Fun mode: background glow BEHIND headings (not on text) ── */
        h1, h2 {
          position: relative;
          isolation: isolate;
        }
        h1::before, h2::before {
          content: '';
          position: absolute;
          inset: -40px -60px;
          background: radial-gradient(ellipse 80% 60% at 50% 50%,
            ${t.accent}1a 0%,
            ${t.accent}08 40%,
            transparent 70%
          );
          border-radius: 50%;
          z-index: -1;
          pointer-events: none;
          filter: blur(20px);
          animation: bgGlowPulse 4s ease-in-out infinite;
        }

        /* Subtle ambient glow behind accent-color spans */
        [style*="color: ${t.accent}"],
        [style*='color: ${t.accent}'] {
          position: relative;
          isolation: isolate;
        }
        [style*="color: ${t.accent}"]::before,
        [style*='color: ${t.accent}']::before {
          content: '';
          position: absolute;
          inset: -8px -16px;
          background: radial-gradient(ellipse 100% 100% at 50% 50%,
            ${t.accent}14 0%,
            transparent 70%
          );
          z-index: -1;
          pointer-events: none;
          border-radius: 50%;
          filter: blur(8px);
        }

        @keyframes bgGlowPulse {
          0%,100% { opacity: 0.7; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.08); }
        }
      ` : ''}

      /* Alert modal entry */
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.85); }
        to   { opacity: 1; transform: scale(1); }
      }
    `}</style>
  );
}

/* ── Global guards ───────────────────────────────────────────────────────── */
function GlobalGuards() {
  useEffect(() => {
    const blockContext = (e) => {
      e.preventDefault();
      customAlert.show('🔒 This site is protected. Right-click is disabled.');
    };

    const blockKeys = (e) => {
      const blocked =
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I','i','J','j','C','c'].includes(e.key)) ||
        (e.ctrlKey && ['U','u'].includes(e.key));

      if (blocked) {
        e.preventDefault();
        customAlert.show('🔒 This site is protected. Developer tools are disabled.');
      }
    };

    document.addEventListener('contextmenu', blockContext);
    document.addEventListener('keydown', blockKeys);
    return () => {
      document.removeEventListener('contextmenu', blockContext);
      document.removeEventListener('keydown', blockKeys);
    };
  }, []);
  return null;
}

/* ── Scroll Progress Bar ─────────────────────────────────────────────────── */
function ScrollProgressBar() {
  useEffect(() => {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = docH > 0 ? `${(window.scrollY / docH) * 100}%` : '0%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div id="scroll-progress" />;
}

/* ── Section Nav Rail ────────────────────────────────────────────────────── */
function SectionRail() {
  const sections = ['hero', 'story', 'project', 'skills', 'goals', 'contact'];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = sections.indexOf(e.target.id);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div id="section-rail">
      {sections.map((_, i) => (
        <div key={i} className={`rail-dot ${active === i ? 'active' : ''}`} />
      ))}
    </div>
  );
}

/* ── Grain Overlay ───────────────────────────────────────────────────────── */
function GrainOverlay() {
  return <div id="grain-overlay" aria-hidden="true" />;
}

/* ─────────────────────────────────────────────────────────────────────────────
   UNIFIED RAF ENGINE
   One single requestAnimationFrame loop drives: particles + cursor FX.
   This eliminates multiple competing loops that cause jank.
────────────────────────────────────────────────────────────────────────────── */
const sharedRAF = {
  tasks: new Map(),
  raf: null,
  running: false,
  add(key, fn) { this.tasks.set(key, fn); if (!this.running) this.start(); },
  remove(key) { this.tasks.delete(key); if (this.tasks.size === 0) this.stop(); },
  start() {
    this.running = true;
    const loop = () => {
      this.tasks.forEach(fn => fn());
      if (this.running) this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  },
  stop() { this.running = false; cancelAnimationFrame(this.raf); },
};

/* ── Particle System (optimised: 28 particles, batched strokes) ──────────── */
function ParticleSystem() {
  const canvasRef = useRef(null);
  const { mode, currentTheme: t } = useTheme();
  const stateRef  = useRef({ particles: [], mouse: { x: -9999, y: -9999 } });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const COUNT = 28; // was 55 — halved for perf
    const hex   = t.accent;
    const r     = parseInt(hex.slice(1,3),16);
    const g     = parseInt(hex.slice(3,5),16);
    const b     = parseInt(hex.slice(5,7),16);
    const rgb   = `${r},${g},${b}`;
    const CONNECT_DIST = 90; // was 100

    state.particles = Array.from({ length: COUNT }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r:  Math.random() * 1.5 + 0.5,
      a:  Math.random() * 0.4 + 0.1,
      ph: Math.random() * Math.PI * 2,
    }));

    const tick = () => {
      if (mode !== 'fun') return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { mouse, particles } = state;

      // Batch all lines into one path per opacity level
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.ph += 0.015;
        const pf = Math.sin(p.ph) * 0.25 + 0.75;

        // Mouse repulsion
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const md2 = mdx*mdx + mdy*mdy;
        if (md2 < 14400) { // 120²
          const md = Math.sqrt(md2);
          const force = (120 - md) / 120 * 0.25;
          p.vx += (mdx / md) * force;
          p.vy += (mdy / md) * force;
        }

        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x  += p.vx;
        p.y  += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * pf, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${(p.a * pf).toFixed(2)})`;
        ctx.fill();

        // Connections — only check j > i to avoid double-drawing
        for (let j = i + 1; j < particles.length; j++) {
          const q   = particles[j];
          const dx  = p.x - q.x;
          const dy  = p.y - q.y;
          const d2  = dx*dx + dy*dy;
          if (d2 < CONNECT_DIST * CONNECT_DIST) {
            const alpha = (1 - Math.sqrt(d2) / CONNECT_DIST) * 0.1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${rgb},${alpha.toFixed(2)})`;
            ctx.stroke();
          }
        }
      }
    };

    const onMouseMove = (e) => { state.mouse = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    sharedRAF.add('particles', tick);

    return () => {
      sharedRAF.remove('particles');
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [mode, t.accent]);

  return <canvas ref={canvasRef} id="particle-canvas" aria-hidden="true" />;
}

/* ── Cursor FX — spotlight + 4 ghost trails (unified in sharedRAF) ───────── */
function CursorFX() {
  const spotRef   = useRef(null);
  const ghostsRef = useRef([]);
  const posRef    = useRef({ x: 0, y: 0 });
  const trailsRef = useRef(Array.from({ length: 4 }, () => ({ x: 0, y: 0 })));
  const { currentTheme: t, mode } = useTheme();

  useEffect(() => {
    const onMove = (e) => { posRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove, { passive: true });

    const tick = () => {
      const { x, y } = posRef.current;
      if (spotRef.current) {
        spotRef.current.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      }
      const trails = trailsRef.current;
      trails[0].x += (x - trails[0].x) * 0.2;
      trails[0].y += (y - trails[0].y) * 0.2;
      for (let i = 1; i < trails.length; i++) {
        trails[i].x += (trails[i-1].x - trails[i].x) * 0.18;
        trails[i].y += (trails[i-1].y - trails[i].y) * 0.18;
      }
      ghostsRef.current.forEach((el, i) => {
        if (!el) return;
        el.style.transform = `translate(${trails[i].x}px,${trails[i].y}px) translate(-50%,-50%)`;
        el.style.opacity   = mode === 'fun' ? `${0.15 - i * 0.03}` : '0';
      });
    };

    sharedRAF.add('cursorfx', tick);
    return () => {
      sharedRAF.remove('cursorfx');
      window.removeEventListener('mousemove', onMove);
    };
  }, [mode]);

  const ghostSizes = [16, 11, 7, 4];

  return (
    <>
      <div
        ref={spotRef}
        id="cursor-spotlight"
        style={{ background: `radial-gradient(circle, color-mix(in srgb,${t.accent} 6%,transparent) 0%,transparent 70%)` }}
      />
      {ghostSizes.map((size, i) => (
        <div
          key={i}
          ref={el => { ghostsRef.current[i] = el; }}
          className="cursor-ghost"
          style={{ width: size, height: size, background: t.accent, opacity: 0, filter: `blur(${i}px)` }}
        />
      ))}
    </>
  );
}

/* ── 3D Tilt Cards ───────────────────────────────────────────────────────── */
function TiltCards() {
  const { mode } = useTheme();

  useEffect(() => {
    /* Exclude .project-grid — that card owns its tilt via PaneWrapper RAF.
       Selecting it here would tilt the whole 2-col grid as a flat slab,
       conflicting with the per-panel 3D door system in Project.jsx. */
    const cards = document.querySelectorAll('.tilt-card:not(.project-grid)');
    if (!cards.length) return;
    const cleanup = [];

    cards.forEach(card => {
      let shine = card.querySelector('.tilt-shine');
      if (!shine) {
        shine = document.createElement('div');
        shine.className = 'tilt-shine';
        card.appendChild(shine);
      }

      const onMove = (e) => {
        if (mode !== 'fun' && mode !== 'professional') return;
        /* Pro: subtle ±5°, shine 5%. Fun: expressive ±8°, shine 7% */
        const maxAngle  = mode === 'fun' ? 8  : 5;
        const shineAlpha = mode === 'fun' ? 0.07 : 0.05;
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const rx =  (e.clientY - cy) / (rect.height / 2) * -maxAngle;
        const ry =  (e.clientX - cx) / (rect.width  / 2) *  maxAngle;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
        const px = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
        const py = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
        shine.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,${shineAlpha}) 0%, transparent 65%)`;
        shine.style.opacity = '1';
      };
      const onLeave = () => {
        card.style.transform   = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        card.style.transition  = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
        shine.style.opacity    = '0';
        setTimeout(() => { card.style.transition = ''; }, 500);
      };
      const onEnter = () => { card.style.transition = 'transform 0.1s ease'; };

      card.addEventListener('mousemove',  onMove);
      card.addEventListener('mouseleave', onLeave);
      card.addEventListener('mouseenter', onEnter);
      cleanup.push(() => {
        card.removeEventListener('mousemove',  onMove);
        card.removeEventListener('mouseleave', onLeave);
        card.removeEventListener('mouseenter', onEnter);
        card.style.transform = '';
      });
    });

    return () => cleanup.forEach(fn => fn());
  }, [mode]);

  return null;
}

/* ── Magnetic Buttons ────────────────────────────────────────────────────── */
function MagneticSystem() {
  const { mode } = useTheme();

  useEffect(() => {
    if (mode !== 'fun') return;
    const els = document.querySelectorAll('.magnetic-btn');
    const cleanup = [];

    els.forEach(el => {
      const onMove = (e) => {
        const rect = el.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width  / 2) * 0.3;
        const dy = (e.clientY - rect.top  - rect.height / 2) * 0.3;
        el.style.transform  = `translate(${dx}px,${dy}px)`;
        el.style.transition = 'transform 0.1s ease';
      };
      const onLeave = () => {
        el.style.transform  = 'translate(0,0)';
        el.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
      };
      el.addEventListener('mousemove',  onMove);
      el.addEventListener('mouseleave', onLeave);
      cleanup.push(() => {
        el.removeEventListener('mousemove',  onMove);
        el.removeEventListener('mouseleave', onLeave);
        el.style.transform = '';
      });
    });
    return () => cleanup.forEach(fn => fn());
  }, [mode]);

  return null;
}

/* ── Text Scramble — FIXED: only targets safe plain-text containers ───────── */
function ScrambleSystem() {
  const { mode } = useTheme();
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#';

  useEffect(() => {
    if (mode !== 'fun') return;

    // Only target elements marked with data-scramble — never arbitrary h1/h2
    // which may contain React-managed child nodes (spans, br, strong etc.)
    const targets = document.querySelectorAll('[data-scramble]');
    const timers  = [];

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el   = entry.target;
        const orig = el.dataset.scramble; // original text stored in attr
        if (!orig) return;
        let frame = 0;
        const total = 20;
        const id = setInterval(() => {
          el.textContent = orig.split('').map((ch, i) => {
            if (ch === ' ') return ' ';
            if (frame / total > i / orig.length) return ch;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join('');
          frame++;
          if (frame > total) { el.textContent = orig; clearInterval(id); }
        }, 35);
        timers.push(id);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });

    targets.forEach(el => obs.observe(el));
    return () => { obs.disconnect(); timers.forEach(clearInterval); };
  }, [mode]);

  return null;
}

/* ── Pro-mode entrance animations ────────────────────────────────────────── */
function ProAnimations() {
  const { mode } = useTheme();

  useEffect(() => {
    if (mode !== 'professional') return;

    // Staggered reveal on all .pro-reveal elements
    const els = document.querySelectorAll('.pro-reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('pro-visible');
        } else {
          entry.target.classList.remove('pro-visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    // Small delay so DOM is ready
    const t = setTimeout(() => {
      els.forEach(el => obs.observe(el));
    }, 100);

    return () => { clearTimeout(t); obs.disconnect(); };
  }, [mode]);

  return null;
}

/* ── Body class toggler ───────────────────────────────────────────────────── */
function BodyClassSync() {
  const { mode } = useTheme();
  useEffect(() => {
    document.body.classList.toggle('fun-mode', mode === 'fun');
    document.body.classList.toggle('pro-mode', mode === 'professional');
  }, [mode]);
  return null;
}

function AppInner() {
  return (
    <>
      <ThemeGlobalStyle />
      <GlobalGuards />
      <CustomAlertModal />
      <CustomCursor />
      <ScrollReveal />
      <VideoBackground />

      {/* ── Advanced animation systems ── */}
      <GrainOverlay />
      <ScrollProgressBar />
      <SectionRail />
      <ParticleSystem />
      <CursorFX />
      <TiltCards />
      <MagneticSystem />
      <ScrambleSystem />
      <BodyClassSync />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <Hero />
        <Divider />
        <Story />
        <Divider />
        <Project />
        <Divider />
        <Skills />
        <Divider />
        <Goals />
        <Divider />
        <Contact />
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
