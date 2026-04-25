import React, { useState, useEffect } from 'react';
import { useTheme, VIDEO_THEMES, THEMES } from '../context/ThemeContext';

const VIDEO_COLORS = [
  { dot: '#9b6dff', label: 'VOID'  },
  { dot: '#3dff8f', label: 'EMRLD' },
  { dot: '#ff4d6d', label: 'ASRA'  },
];

export default function Navbar() {
  const {
    mode, toggleMode,
    activeVideo, switchVideo,
    muted, setMuted,
    currentTheme,
  } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = currentTheme;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navLinks = ['Story', 'Work', 'Skills', 'Goals', 'Contact'];
  const linkHref = (link) => link === 'Work' ? '#project' : `#${link.toLowerCase()}`;

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 48px',
          background: scrolled ? `${t.bg}ee` : `${t.bg}99`,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${t.border}`,
          transition: 'background 0.4s, border-color 0.4s',
        }}
      >
        {/* Logo */}
        <a
          href="#hero"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '22px',
            letterSpacing: '4px',
            color: t.accent,
            transition: 'color 0.4s, text-shadow 0.4s',
            userSelect: 'none',
            textDecoration: 'none',
            textShadow: mode === 'fun'
              ? `0 0 14px ${t.accent}99, 0 0 30px ${t.accent}44`
              : 'none',
          }}
        >
          DG
        </a>

        {/* Desktop nav links */}
        <div className="nav-links-desktop" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {navLinks.map((link) => (
            <a
              key={link}
              href={linkHref(link)}
              style={{
                color: t.text2,
                textDecoration: 'none',
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontFamily: "'JetBrains Mono', monospace",
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = t.accent; }}
              onMouseLeave={e => { e.currentTarget.style.color = t.text2; }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

          {/* ── FUN MODE ONLY: video theme switcher + mute ── */}
          {mode === 'fun' && (
            <>
              <div
                className="nav-video-switcher"
                style={{
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'center',
                  background: `${t.card}cc`,
                  border: `1px solid ${t.border}`,
                  borderRadius: '20px',
                  padding: '5px 10px',
                }}
              >
                {VIDEO_COLORS.map(({ dot, label }, i) => {
                  const isActive = activeVideo === i;
                  return (
                    <button
                      key={i}
                      onClick={() => switchVideo(i)}
                      title={`${label} — ${THEMES[['void','emerald','crimson'][i]].name}`}
                      aria-label={`Switch to ${label} theme`}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: isActive ? `2px solid ${dot}` : '2px solid transparent',
                        background: isActive ? dot : `${dot}33`,
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                        fontSize: '9px',
                        color: isActive ? '#000' : dot,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 'bold',
                        transform: isActive ? 'scale(1.2)' : 'scale(1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setMuted(m => !m)}
                title={muted ? 'Unmute video' : 'Mute video'}
                aria-label={muted ? 'Unmute video' : 'Mute video'}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: `1px solid ${t.border}`,
                  background: t.card,
                  color: t.accent,
                  cursor: 'pointer',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; }}
              >
                {muted ? '🔇' : '🔊'}
              </button>
            </>
          )}

          {/* Mode toggle — both modes */}
          <button
            onClick={toggleMode}
            aria-label={mode === 'fun' ? 'Switch to Professional mode' : 'Switch to Fun mode'}
            style={{
              padding: '8px 20px',
              border: `1px solid ${t.accent}`,
              background: mode === 'fun' ? t.accent : 'transparent',
              color: mode === 'fun' ? t.bg : t.accent,
              fontSize: '11px',
              letterSpacing: '2px',
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderRadius: '2px',
              transition: 'all 0.3s',
              fontWeight: '600',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              if (mode !== 'fun') {
                e.currentTarget.style.background = t.accent;
                e.currentTarget.style.color = t.bg;
              }
            }}
            onMouseLeave={e => {
              if (mode !== 'fun') {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = t.accent;
              }
            }}
          >
            {mode === 'fun' ? '◼ PRO' : '▶ FUN'}
          </button>

          {/* Hamburger — mobile only */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{
              display: 'none',
              flexDirection: 'column',
              gap: '5px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            {[0, 1, 2].map(i => (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: '22px',
                  height: '1px',
                  background: t.accent,
                  transition: 'all 0.3s',
                  transform: menuOpen
                    ? i === 0 ? 'rotate(45deg) translateY(6px)'
                    : i === 1 ? 'scaleX(0)'
                    : 'rotate(-45deg) translateY(-6px)'
                    : 'none',
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className="mobile-menu"
        style={{
          position: 'fixed',
          top: '65px',
          left: 0,
          right: 0,
          zIndex: 999,
          background: `${t.bg}f5`,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${t.border}`,
          padding: menuOpen ? '24px 32px' : '0 32px',
          maxHeight: menuOpen ? '400px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.4s ease, padding 0.4s ease',
        }}
      >
        {navLinks.map((link) => (
          <a
            key={link}
            href={linkHref(link)}
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block',
              color: t.text2,
              textDecoration: 'none',
              fontSize: '13px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontFamily: "'JetBrains Mono', monospace",
              padding: '14px 0',
              borderBottom: `1px solid ${t.border}`,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = t.accent; }}
            onMouseLeave={e => { e.currentTarget.style.color = t.text2; }}
          >
            {link}
          </a>
        ))}

        {/* Video switcher in mobile menu — fun mode only */}
        {mode === 'fun' && (
          <div style={{ paddingTop: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: t.text3, letterSpacing: '2px' }}>THEME:</span>
            {VIDEO_COLORS.map(({ dot, label }, i) => (
              <button
                key={i}
                onClick={() => { switchVideo(i); setMenuOpen(false); }}
                style={{
                  padding: '6px 14px',
                  border: `1px solid ${activeVideo === i ? dot : t.border}`,
                  background: activeVideo === i ? `${dot}22` : 'transparent',
                  color: activeVideo === i ? dot : t.text3,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '10px',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  borderRadius: '2px',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-video-switcher { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </>
  );
}
