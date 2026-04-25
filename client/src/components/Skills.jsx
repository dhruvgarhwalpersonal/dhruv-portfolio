import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const skills = [
  { name: 'JavaScript',      level: 65, label: 'Intermediate — Building Production Apps' },
  { name: 'Python',          level: 35, label: 'Learning — Scripting & Automation'       },
  { name: 'HTML / CSS',      level: 75, label: 'Solid — Custom UI Design'                },
  { name: 'Firebase',        level: 60, label: 'Working — Auth + Firestore'              },
  { name: 'Problem Solving', level: 80, label: 'Strong — Competitive + Self-taught'      },
  { name: 'Focus & Grit',    level: 95, label: 'Tested — 23hr grind sessions, real'      },
];

function SkillBar({ name, level, label, theme: t, delay }) {
  const barRef     = useRef(null);
  const sectionRef = useRef(null);
  const [vis, setVis] = useState(false);
  const [numDisplay, setNumDisplay] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const obs = new IntersectionObserver(([entry]) => {
      setVis(entry.isIntersecting);
    }, { threshold: 0.2 });

    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  /* Animate number counter when visible */
  useEffect(() => {
    if (!vis) { setNumDisplay(0); return; }
    const start = Date.now();
    const duration = 1200 + delay;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setNumDisplay(Math.round(eased * level));
      if (progress < 1) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [vis, level, delay]);

  return (
    <div
      ref={sectionRef}
      style={{
        marginBottom: 0,
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '1px', color: t.text, transition: 'color 0.4s', lineHeight: 1.1 }}>
            {name}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: t.text3, letterSpacing: '1px', marginTop: '2px', transition: 'color 0.4s' }}>
            {label}
          </div>
        </div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px',
          color: t.accent, transition: 'color 0.4s', lineHeight: 1,
          textShadow: vis ? `0 0 16px ${t.accent}60` : 'none',
        }}>
          {numDisplay}%
        </div>
      </div>

      <div style={{ height: '2px', background: t.border, borderRadius: '1px', overflow: 'hidden', transition: 'background 0.4s', position: 'relative' }}>
        <div
          ref={barRef}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${t.accent}, ${t.accent2 || t.accent})`,
            borderRadius: '1px',
            width: vis ? `${level}%` : '0%',
            boxShadow: vis ? `0 0 8px ${t.accent}60` : 'none',
            transition: `width ${1.3 + delay / 1000}s cubic-bezier(0.4,0,0.2,1) ${delay * 0.5}ms, box-shadow 0.4s ease`,
            willChange: 'width',
          }}
        />
        {/* Shimmer sweep on bar */}
        {vis && (
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: '30px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            animation: `barShimmer 1.8s ease ${delay}ms forwards`,
            pointerEvents: 'none',
          }} />
        )}
      </div>
    </div>
  );
}

export default function Skills() {
  const { currentTheme: t } = useTheme();
  const titleRef = useRef(null);
  const noteRef  = useRef(null);
  const [titleVis, setTitleVis] = useState(false);
  const [noteVis, setNoteVis]   = useState(false);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setTitleVis(e.isIntersecting), { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = noteRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setNoteVis(e.isIntersecting), { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const noteWords = "These aren't tutorial completions. These numbers reflect real production usage — the messy, debugging-at-midnight, why isn't this working kind. Honest numbers.".split(' ');

  return (
    <section id="skills" style={{ padding: '100px 48px', background: t.bg, transition: 'background 0.6s', position: 'relative', zIndex: 1 }}>

      <div ref={titleRef}>
        {/* Section label */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: t.accent,
          letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px',
          opacity: titleVis ? 1 : 0,
          transform: titleVis ? 'translateX(0)' : 'translateX(-30px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}>
          03 — Skills
        </div>

        {/* Animated heading */}
        <div style={{ marginBottom: '72px', overflow: 'hidden' }}>
          {'TOOLS &'.split('').map((ch, i) => (
            <span key={i} style={{
              display: 'inline-block',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(48px, 7vw, 80px)',
              lineHeight: 1,
              color: t.text,
              opacity: titleVis ? 1 : 0,
              transform: titleVis ? 'translateY(0)' : 'translateY(80%)',
              transition: `opacity 0.5s ease ${i * 35}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 35}ms`,
            }}>
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
          <br />
          {'ABILITIES'.split('').map((ch, i) => (
            <span key={i} style={{
              display: 'inline-block',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(48px, 7vw, 80px)',
              lineHeight: 1,
              color: t.text,
              opacity: titleVis ? 1 : 0,
              transform: titleVis ? 'translateY(0)' : 'translateY(80%)',
              transition: `opacity 0.5s ease ${245 + i * 35}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${245 + i * 35}ms`,
            }}>
              {ch}
            </span>
          ))}
        </div>
      </div>

      <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px 80px', maxWidth: '900px' }}>
        {skills.map((skill, i) => (
          <SkillBar key={skill.name} {...skill} theme={t} delay={i * 90} />
        ))}
      </div>

      {/* Note card */}
      <div
        ref={noteRef}
        style={{
          marginTop: '72px', padding: '32px',
          border: `1px solid ${noteVis ? t.accent + '40' : t.border}`,
          background: t.card, maxWidth: '600px',
          transition: 'all 0.6s ease',
          opacity: noteVis ? 1 : 0,
          transform: noteVis ? 'translateX(0)' : 'translateX(-40px)',
          borderLeft: `3px solid ${t.accent}`,
        }}
      >
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: t.accent,
          letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px',
        }}>
          Note on self-rating
        </div>
        <p style={{ fontSize: '13px', color: t.text2, lineHeight: 1.8 }}>
          {noteWords.map((word, i) => (
            <span key={i} style={{
              display: 'inline-block',
              marginRight: '4px',
              opacity: noteVis ? 1 : 0,
              transform: noteVis ? 'translateY(0)' : 'translateY(10px)',
              transition: `opacity 0.35s ease ${i * 20}ms, transform 0.35s ease ${i * 20}ms`,
            }}>
              {word}
            </span>
          ))}{' '}
          <span style={{ color: t.accent }}>35% Python that I actually use</span>{' '}
          <span style={{
            display: 'inline-block',
            opacity: noteVis ? 1 : 0,
            transition: 'opacity 0.4s ease 0.8s',
          }}>
            than claim 80% I borrowed from Stack Overflow.
          </span>
        </p>
      </div>

      <style>{`
        @keyframes barShimmer {
          from { left: 0%; }
          to   { left: 120%; }
        }
        @media (max-width: 768px) {
          .skills-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          #skills { padding: 80px 24px !important; }
        }
      `}</style>
    </section>
  );
}
