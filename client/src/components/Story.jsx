import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';

const ACTS = [
  {
    year: 'ACT I — 2020',
    heading: 'BORN TO CHASE',
    icon: '🌱',
    side: 'right',
    highlight: 'driven way',
    text: "I grew up competitive. Not in a toxic way — in a driven way. The kind of kid who genuinely loved learning when the subject was alive. Top of class. Curious. Hungry. Sri Ganganagar made me scrappy.",
  },
  {
    year: 'ACT II — 2023',
    heading: 'KOTA: THE SYSTEM',
    icon: '⚙️',
    side: 'left',
    highlight: 'Top of 300 students',
    text: "I enrolled in JEE coaching in Kota. First month? Top of 300 students. Then the system wore me down — not intellectually, but spiritually. I wasn't broken by difficulty. I was broken by pointlessness.",
  },
  {
    year: 'ACT III — 2024',
    heading: 'FINDING CODE',
    icon: '💻',
    side: 'right',
    highlight: 'programming',
    text: "I came back and discovered something I actually gave a damn about — programming. Built Protocol from scratch. Full auth system. Cloud sync. An AI quote engine. In months. That's what happens when you care.",
  },
  {
    year: 'ACT IV — 2025',
    heading: 'NOW: LOCKED IN',
    icon: '🔒',
    side: 'left',
    highlight: 'Building real things',
    text: "I'm 18. Class 12. Cracking entrance exams. Training my body. Building real things. Every system I build teaches me something about systems in general — including myself.",
  },
  {
    year: 'THE LESSON',
    heading: 'WHAT KOTA ACTUALLY TAUGHT ME',
    icon: '🎯',
    side: 'right',
    highlight: 'working smart on the right thing',
    full: true,
    text: "Most people think Kota is about JEE. For me it was a masterclass in human psychology — specifically mine. I learned that I can achieve extreme focus when I care about something. I learned the difference between working hard and working smart on the right thing. Now I'm redirecting that same obsessive energy — into code, into fitness, into building a life I actually designed.",
  },
];

function highlightText(text, highlight, accent) {
  if (!highlight || !text.includes(highlight)) return text;
  return text.split(highlight).map((part, i, arr) =>
    i < arr.length - 1 ? (
      <React.Fragment key={i}>
        {part}
        <strong style={{ color: accent, fontWeight: 500 }}>{highlight}</strong>
      </React.Fragment>
    ) : part
  );
}

/* Split heading into animated chars */
function AnimHeading({ text, visible, accent, color, size = '26px', delay = 0 }) {
  return (
    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: size, letterSpacing: '1px', color, marginBottom: '14px', transition: 'color 0.3s', whiteSpace: 'nowrap', overflow: 'hidden' }}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(100%)',
            transition: `opacity 0.5s ease ${delay + i * 22}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay + i * 22}ms`,
            willChange: 'opacity, transform',
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </div>
  );
}

/* Animated paragraph — words fade in */
function AnimParagraph({ text, highlight, accent, visible, color, delay = 0 }) {
  const words = text.split(' ');
  let wordIdx = 0;

  if (!highlight || !text.includes(highlight)) {
    return (
      <p style={{ fontSize: '14px', color, lineHeight: 1.85 }}>
        {words.map((word, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(12px)',
              transition: `opacity 0.4s ease ${delay + i * 18}ms, transform 0.4s ease ${delay + i * 18}ms`,
              marginRight: '4px',
              willChange: 'opacity, transform',
            }}
          >
            {word}
          </span>
        ))}
      </p>
    );
  }

  const parts = text.split(highlight);
  const allWords = [];
  parts.forEach((part, pi) => {
    part.split(' ').filter(Boolean).forEach(w => allWords.push({ word: w, hi: false }));
    if (pi < parts.length - 1) {
      highlight.split(' ').filter(Boolean).forEach(w => allWords.push({ word: w, hi: true }));
    }
  });

  return (
    <p style={{ fontSize: '14px', color, lineHeight: 1.85 }}>
      {allWords.map((item, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: `opacity 0.4s ease ${delay + i * 18}ms, transform 0.4s ease ${delay + i * 18}ms`,
            marginRight: '4px',
            color: item.hi ? accent : 'inherit',
            fontWeight: item.hi ? 500 : 'inherit',
            willChange: 'opacity, transform',
          }}
        >
          {item.word}
        </span>
      ))}
    </p>
  );
}

function TimelineItem({ act, theme: t, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        // Show when entering, hide when leaving
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 80);
        } else {
          setVisible(false);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  const slideX = act.side === 'left' ? '-80px' : '80px';
  const cardStyle = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateX(0) translateY(0)' : `translateX(${slideX}) translateY(20px)`,
    transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 60}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 60}ms`,
    willChange: 'opacity, transform',
  };

  if (act.full) {
    return (
      <div ref={ref} className="timeline-item" style={{ ...cardStyle, position: 'relative' }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div style={{
          background: hovered ? t.bg2 : t.card,
          border: `1px solid ${hovered ? t.accent : t.border}`,
          borderLeft: `3px solid ${t.accent}`,
          padding: '40px 48px', borderRadius: '2px',
          transition: 'all 0.35s ease',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered ? `0 20px 60px ${t.accent}18` : 'none',
          position: 'relative', overflow: 'hidden',
        }}>
          {hovered && <ShimmerOverlay accent={t.accent} />}

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <span style={{ fontSize: '28px', transition: 'transform 0.3s', transform: hovered ? 'rotate(10deg) scale(1.2)' : 'none', display: 'inline-block' }}>{act.icon}</span>
            <div>
              <YearTag text={act.year} visible={visible} accent={t.accent} />
              <AnimHeading text={act.heading} visible={visible} color={t.text} size="30px" delay={200} />
            </div>
          </div>

          <AnimParagraph text={act.text} highlight={act.highlight} accent={t.accent} visible={visible} color={t.text2} delay={300} />
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="timeline-item" style={{ ...cardStyle, position: 'relative' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ position: 'relative', width: '100%' }}>
        <div className="timeline-dot" style={{
          borderColor: hovered ? t.accent : t.border,
          background: hovered ? t.accent : t.bg,
          boxShadow: hovered ? `0 0 0 6px ${t.accent}22` : 'none',
          transition: 'all 0.35s ease',
        }} />
        <div style={{
          background: hovered ? t.bg2 : t.card,
          border: `1px solid ${hovered ? t.accent : t.border}`,
          borderLeft: `3px solid ${hovered ? t.accent : t.border}`,
          padding: '32px 36px', borderRadius: '2px',
          transition: 'all 0.35s ease',
          transform: hovered ? 'translateX(6px) translateY(-2px)' : 'translateX(0)',
          boxShadow: hovered ? `0 12px 40px ${t.accent}15` : 'none',
          position: 'relative', overflow: 'hidden',
        }}>
          {hovered && <ShimmerOverlay accent={t.accent} />}

          <YearTag text={act.year} visible={visible} accent={t.accent} icon={act.icon} hovered={hovered} />
          <AnimHeading text={act.heading} visible={visible} color={t.text} delay={120} />
          <AnimParagraph text={act.text} highlight={act.highlight} accent={t.accent} visible={visible} color={t.text2} delay={200} />

          {/* Bottom progress bar */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
            background: `linear-gradient(90deg, ${t.accent}, ${t.accent2 || t.accent})`,
            transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.4s ease',
          }} />
        </div>
      </div>
    </div>
  );
}

function YearTag({ text, visible, accent, icon, hovered }) {
  return (
    <div style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: accent,
      letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px',
      display: 'flex', alignItems: 'center', gap: '10px',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(-20px)',
      transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
    }}>
      {icon && <span style={{ transition: 'transform 0.3s', transform: hovered ? 'rotate(10deg) scale(1.2)' : 'none', display: 'inline-block' }}>{icon}</span>}
      {text}
    </div>
  );
}

function ShimmerOverlay({ accent }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `linear-gradient(105deg, transparent 40%, ${accent}08 50%, transparent 60%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.6s ease infinite',
      pointerEvents: 'none',
    }} />
  );
}

/* Animated section title letters */
function SectionTitle({ text, visible, color, size }) {
  return (
    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: size, lineHeight: 1, color, overflow: 'hidden' }}>
      {text.split('').map((ch, i) => (
        <span key={i} style={{
          display: 'inline-block',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(110%)',
          transition: `opacity 0.6s ease ${i * 30}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 30}ms`,
          willChange: 'opacity, transform',
        }}>
          {ch === ' ' ? '\u00A0' : ch === '\n' ? <br /> : ch}
        </span>
      ))}
    </div>
  );
}

export default function Story() {
  const { currentTheme: t } = useTheme();
  const lineRef = useRef(null);
  const titleRef = useRef(null);
  const [lineAnim, setLineAnim] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const lineEl = lineRef.current;
    if (!lineEl) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setLineAnim(true); obs.disconnect(); }
    }, { threshold: 0.05 });
    obs.observe(lineEl);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      setTitleVisible(entry.isIntersecting);
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="story" style={{ padding: '100px 48px', background: t.bg2, transition: 'background 0.6s', position: 'relative', zIndex: 1 }}>

      <div ref={titleRef}>
        {/* Section label */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: t.accent,
          letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px',
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? 'translateX(0)' : 'translateX(-30px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}>
          01 — Origin
        </div>

        {/* THE STORY animated letters */}
        <div style={{ marginBottom: '80px' }}>
          {'THE'.split('').map((ch, i) => (
            <span key={i} style={{
              display: 'inline-block',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(48px, 7vw, 80px)',
              lineHeight: 1,
              color: t.text,
              opacity: titleVisible ? 1 : 0,
              transform: titleVisible ? 'translateY(0) rotate(0deg)' : 'translateY(60px) rotate(-5deg)',
              transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms`,
            }}>{ch}</span>
          ))}
          <br />
          {'STORY'.split('').map((ch, i) => (
            <span key={i} style={{
              display: 'inline-block',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(48px, 7vw, 80px)',
              lineHeight: 1,
              color: t.text,
              opacity: titleVisible ? 1 : 0,
              transform: titleVisible ? 'translateY(0) rotate(0deg)' : 'translateY(60px) rotate(5deg)',
              transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${180 + i * 60}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${180 + i * 60}ms`,
            }}>{ch}</span>
          ))}
        </div>
      </div>

      <div className="timeline-container" ref={lineRef} style={{ maxWidth: '780px', margin: '0 auto' }}>
        <div className={`timeline-line ${lineAnim ? 'animated' : ''}`} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {ACTS.map((act, i) => (
            <TimelineItem key={act.heading} act={act} theme={t} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @media (max-width: 768px) {
          #story { padding: 80px 24px !important; }
          .timeline-container { padding-left: 36px !important; }
          .timeline-dot { left: -33px !important; }
        }
      `}</style>
    </section>
  );
}
