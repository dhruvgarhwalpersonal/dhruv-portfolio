import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { customAlert } from '../App';

const SOCIAL_LINKS = [
  { label: 'GitHub',     href: 'https://github.com/dhruvgarhwalpersonal',           icon: '⌥' },
  { label: 'Twitter / X',href: 'https://x.com/dhruvgarhwal',                        icon: '✕' },
  { label: 'Instagram',  href: 'https://instagram.com/dhruvgarhwalpersonal',         icon: '◎' },
  { label: 'Discord',    href: 'https://discord.com/users/dhruvgarhwalpersonal',     icon: '⊕' },
];

export default function Contact() {
  const { currentTheme: t, mode } = useTheme();
  const ref = useRef(null);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
      customAlert.show('Copied to clipboard!');
    }).catch(() => {
      customAlert.show('Could not copy — please copy manually: ' + text);
    });
  };

  const btnBase = {
    padding: '16px 32px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    borderRadius: '2px',
    cursor: 'none',
    transition: 'all 0.25s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  };

  return (
    <section
      id="contact"
      style={{ padding: '100px 48px 80px', background: t.bg, transition: 'background 0.6s', position: 'relative', zIndex: 1, overflow: 'hidden' }}
    >
      {/* Big background text */}
      <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(120px, 20vw, 240px)', color: t.border, lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-4px', transition: 'color 0.4s', opacity: 0.5 }}>
        HELLO
      </div>

      <div ref={ref}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: t.accent, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px', transition: 'color 0.4s' }}>
          05 — Let's Connect
        </div>

        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(72px, 12vw, 140px)', lineHeight: 0.88, letterSpacing: '-2px', marginBottom: '40px', color: t.text, transition: 'color 0.4s', textShadow: mode === 'fun' ? `0 0 30px ${t.accent}44, 0 0 80px ${t.accent}22` : 'none' }}>
          SAY<br />
          <span style={{ color: 'transparent', WebkitTextStroke: `1px ${t.accent}` }}>HELLO</span>
        </h2>

        <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: t.text2, maxWidth: '560px', lineHeight: 1.75, marginBottom: '56px', transition: 'color 0.4s' }}>
          {mode === 'fun'
            ? "I'm 18, shipping code, lifting weights, and building my life on purpose. If something here hit different — let's talk."
            : "I'm 18, building in public, and open to conversations about technology, opportunities, or just ideas worth exploring. If something here resonated — reach out."}
        </p>

        {/* Primary CTAs */}
        <div className="contact-buttons" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
          {/* Email Me — opens mail client directly, no browser alert */}
          <a
            href="mailto:dhruvgarhwalpersonal@gmail.com"
            onClick={(e) => {
              // Prevent default browser protocol picker; open directly
              e.preventDefault();
              window.location.href = 'mailto:dhruvgarhwalpersonal@gmail.com';
            }}
            style={{ ...btnBase, background: t.accent, color: t.bg, border: `1px solid ${t.accent}` }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = t.accent; e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            ✉ Email Me
          </a>

          {/* Copy email */}
          <button
            onClick={() => copyToClipboard('dhruvgarhwalpersonal@gmail.com', 'email')}
            style={{ ...btnBase, background: 'transparent', color: copied === 'email' ? t.accent : t.text2, border: `1px solid ${copied === 'email' ? t.accent : t.border}` }}
          >
            {copied === 'email' ? '✓ Copied!' : '⎘ Copy Email'}
          </button>
        </div>

        {/* Social links grid */}
        <div className="social-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '64px' }}>
          {SOCIAL_LINKS.map(({ label, href, icon }) => (
            <div key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                style={{ ...btnBase, width: '100%', justifyContent: 'center', background: 'transparent', color: t.text, border: `1px solid ${t.border}`, padding: '14px 16px' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.text; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <span style={{ fontSize: '16px' }}>{icon}</span>
                <span>{label}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Info row */}
        <div className="contact-info" style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', borderTop: `1px solid ${t.border}`, paddingTop: '40px', transition: 'border-color 0.4s' }}>
          {[
            { label: 'Location', value: 'Sri Ganganagar, India' },
            { label: 'Status',   value: 'Open to Opportunities' },
            { label: 'Response', value: 'Within 24 hours' },
            { label: 'Email',    value: 'dhruvgarhwalpersonal@gmail.com' },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: t.text3, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px', transition: 'color 0.4s' }}>
                {label}
              </div>
              <div style={{ fontSize: '14px', color: t.text, transition: 'color 0.4s', wordBreak: 'break-all' }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .social-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 768px) {
          #contact { padding: 80px 24px 60px !important; }
          .contact-buttons { flex-direction: column; }
          .contact-buttons a, .contact-buttons button { width: 100%; justify-content: center; }
          .social-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .contact-info { gap: 28px !important; }
        }
        @media (max-width: 480px) { .social-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
