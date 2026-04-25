import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import ErwinCard from './ErwinCard';

/* ── Hero ─────────────────────────────────────────────────────────────────── */
export default function Hero() {
  const { currentTheme: t, mode } = useTheme();
  const nameRef    = useRef(null);
  const sectionRef = useRef(null);
  const [erwinOpacity, setErwinOpacity] = useState(1);

  /* ── Entrance animation ── */
  useEffect(() => {
    const el = nameRef.current;
    if (!el) return;
    el.style.opacity   = '0';
    el.style.transform = 'translateY(40px)';
    const timer = setTimeout(() => {
      el.style.transition = 'opacity 1s ease, transform 1s ease';
      el.style.opacity    = '1';
      el.style.transform  = 'translateY(0)';
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  /* ── Erwin scroll-fade — scoped strictly to hero section visibility ── */
  useEffect(() => {
    if (mode !== 'professional') {
      setErwinOpacity(0);
      return;
    }
    setErwinOpacity(1); // reset when switching to pro

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect    = section.getBoundingClientRect();
      const windowH = window.innerHeight;
      // How many px of the section are currently on screen
      const visible = Math.min(rect.bottom, windowH) - Math.max(rect.top, 0);
      const ratio   = Math.max(0, Math.min(1, visible / windowH));
      // Fade out when less than 50% of viewport is overlapping the hero
      const op = ratio < 0.5 ? parseFloat((ratio / 0.5).toFixed(3)) : 1;
      setErwinOpacity(op);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [mode]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display  : 'flex',
        alignItems: 'center',
        padding  : 'clamp(100px, 15vh, 140px) 48px 80px',
        position : 'relative',
        /* NOTE: overflow must NOT be hidden — ErwinCard (absolute) needs to
           extend to the real bottom edge of the section without clipping    */
        overflow : 'visible',
      }}
    >
      {/* Subtle grid */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(${t.border} 1px, transparent 1px),
            linear-gradient(90deg, ${t.border} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.3,
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          transition: 'all 0.6s',
          pointerEvents: 'none',
        }}
      />

      {/* Fun-mode glow orb */}
      {mode === 'fun' && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px', height: '600px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${t.accent}18 0%, transparent 70%)`,
            animation: 'pulse 4s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Pro-mode ambient floor glow — accent yellow-green under Erwin */}
      {mode === 'professional' && (
        <div
          aria-hidden="true"
          style={{
            position    : 'absolute',
            bottom      : 0,
            left        : '50%',
            transform   : 'translateX(-50%)',
            width       : '500px',
            height      : '200px',
            borderRadius: '50%',
            background  : `radial-gradient(ellipse at 50% 100%,
                            ${t.accent}1a 0%,
                            ${t.accent}0a 55%,
                            transparent 75%)`,
            filter      : 'blur(40px)',
            pointerEvents: 'none',
            zIndex      : 2,
            transition  : 'background 0.5s ease',
          }}
        />
      )}

      {/* Main content */}
      <div
        ref={nameRef}
        style={{ position: 'relative', maxWidth: '1000px', width: '100%', zIndex: 3 }}
      >
        {/* Tag line */}
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: t.accent, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px', transition: 'color 0.4s' }}>
          <span style={{ width: '40px', height: '1px', background: t.accent, display: 'block', transition: 'background 0.4s' }} />
          {mode === 'fun' ? '⚡ Unlocked Mode Active' : 'Available for opportunities · Sri Ganganagar, India'}
        </div>

        {/* Name */}
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(72px, 12vw, 160px)', lineHeight: 0.88, letterSpacing: '-2px', marginBottom: '36px', transition: 'all 0.4s', color: t.text, textShadow: mode === 'fun' ? `0 0 30px ${t.accent}44, 0 0 80px ${t.accent}22` : 'none' }}>
          DHRUV
          <br />
          <span style={{ color: 'transparent', WebkitTextStroke: `1px ${t.text3}`, transition: 'all 0.4s', textShadow: mode === 'fun' ? `0 0 20px ${t.accent}33` : 'none' }}>
            GARHWAL
          </span>
        </h1>

        {/* Description */}
        <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: t.text2, maxWidth: '520px', lineHeight: 1.75, marginBottom: '52px', transition: 'color 0.4s' }}>
          {mode === 'fun' ? (
            <>
              18-year-old builder from Sri Ganganagar. Code is my sandbox. I ship things that{' '}
              <strong style={{ color: t.accent, fontWeight: 500 }}>actually work</strong>. Went to
              Kota, found myself, came back with something better.
            </>
          ) : (
            <>
              Full-stack developer with a{' '}
              <strong style={{ color: t.accent, fontWeight: 500 }}>production app in the wild</strong>.
              Self-taught, obsessively curious, and building systems that matter — starting with my own life.
            </>
          )}
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <a
            href="#project"
            className="magnetic-btn"
            style={{ padding: '15px 36px', background: t.accent, color: t.bg, fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.25s', borderRadius: '2px', display: 'inline-block' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = t.accent; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            See My Work
          </a>
          <a
            href="#contact"
            className="magnetic-btn"
            style={{ padding: '15px 36px', background: 'transparent', color: t.text, fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none', border: `1px solid ${t.border}`, transition: 'all 0.25s', borderRadius: '2px', display: 'inline-block' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.text; }}
          >
            Say Hello
          </a>
        </div>
      </div>

      {/* Stats row — bottom right */}
      <div
        aria-label="Quick stats"
        className="hero-stats"
        style={{ position: 'absolute', right: '48px', bottom: '80px', display: 'flex', flexDirection: 'row', gap: '48px', zIndex: 3 }}
      >
        {[
          { num: '01', label: 'Live Apps' },
          { num: '18', label: 'Years Old' },
          { num: '∞',  label: 'Drive'     },
        ].map(({ num, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '44px', color: t.accent, lineHeight: 1, transition: 'color 0.4s' }}>{num}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: t.text3, letterSpacing: '2px', textTransform: 'uppercase', transition: 'color 0.4s' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', animation: 'bounce 2s ease-in-out infinite', zIndex: 3 }}
      >
        <div style={{ width: '1px', height: '60px', background: `linear-gradient(to bottom, ${t.accent}, transparent)` }} />
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: t.text3, letterSpacing: '3px', textTransform: 'uppercase' }}>scroll</div>
      </div>

      {/* ── ErwinCard — position:absolute inside this section only ──
           Only mounted in pro mode. Opacity drives scroll-fade + pointer cutoff. */}
      {mode === 'professional' && (
        <ErwinCard opacity={erwinOpacity} accent={t.accent} />
      )}

      <style>{`
        @media (max-width: 768px) {
          .hero-stats { display: none !important; }
          #hero { padding: 120px 24px 80px !important; }
        }
      `}</style>
    </section>
  );
}
