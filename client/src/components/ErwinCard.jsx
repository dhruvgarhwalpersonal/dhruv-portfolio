import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

/* ── Per-character data ─────────────────────────────────────────────────── */
const CHARACTERS = [
  {
    id        : 0,
    name      : 'Erwin',
    imageLeft : '56%',
    image     : '/image/image0.png',
    audio : '/audio/erwin.mp3',
    total : 63,   // FIX: was missing — caused totalProg = NaN
    lyrics: [
      { time:  0.24, text: 'Everything that you thought had meaning...' },
      { time:  2.24, text: 'Every hope, dream, or moment of happiness...' },
      { time:  5.76, text: 'None of it matters as you lie bleeding out on the battlefield.' },
      { time:  9.76, text: 'None of it changes what a speeding rock does to a body.' },
      { time: 13.00, text: 'We all die.' },
      { time: 16.08, text: 'Does that mean our lives are meaningless?' },
      { time: 19.12, text: 'Does that mean that there was no point in our being born?' },
      { time: 23.76, text: 'Would you say that of our slain comrades?' },
      { time: 26.64, text: 'What about their lives? Were they meaningless?' },
      { time: 32.08, text: 'They were not.' },
      { time: 33.68, text: 'Their memory serves as an example to us all.' },
      { time: 37.12, text: 'The courageous fallen. The anguished fallen.' },
      { time: 39.68, text: 'Their lives have meaning because we the living refuse to forget them.' },
      { time: 44.80, text: 'And as we ride to certain death, we trust our successors to do the same for us.' },
      { time: 50.24, text: 'Because my soldiers do not buckle or yield when faced with the cruelty of this world.' },
      { time: 56.32, text: 'My soldiers push forward.' },
      { time: 58.48, text: 'My soldiers scream out.' },
      { time: 60.80, text: 'My soldiers rage.' },
    ],
  },
  {
    id        : 1,
    name      : 'Thorfinn',
    imageLeft : '52%',
    image     : '/image/image1.png',
    audio : '/audio/audio1.mp3',
    total : 29,
    lyrics: [
      { time:  0.04, text: 'Do you want a sword, Thoran?' },
      { time:  3.12, text: 'A sword is a tool meant to kill. Why do you need it?' },
      { time:  6.36, text: 'Whose life do you intend to take?' },
      { time:  8.40, text: 'Enemies? Your enemies — who are they?' },
      { time: 13.44, text: 'Bad guys?' },
      { time: 14.64, text: 'Listen to me, my son.' },
      { time: 18.28, text: "You don't have enemies." },
      { time: 21.52, text: 'The truth is that nobody has them.' },
      { time: 24.36, text: 'Nobody in this entire world deserves to get hurt.' },
    ],
  },
  {
    id        : 2,
    name      : 'Krishna',
    imageLeft : '51%',
    image     : '/image/image2.png',
    audio : '/audio/audio2.mp3',
    total : 115,
    lyrics: [
      { time:   1.04, text: 'इस युद्ध में तो हार ही हार है।' },
      { time:   3.12, text: 'केशव, मैं जीत भी गया तो क्या जीतूंगा?' },
      { time:   7.20, text: 'मेरे तो हाथ कांप रहे हैं, केशव।' },
      { time:  10.72, text: 'क्या है धर्म का मार्ग? युद्ध, पार्थ?' },
      { time:  14.88, text: 'अपने ही परिजनों और मित्रों के विरुद्ध?' },
      { time:  17.12, text: 'मात्र अपना गांडीव उठाओ, अर्जुन।' },
      { time:  19.76, text: 'इन सांसारिक बंधनों के पार देखो।' },
      { time:  22.56, text: 'मुझे तो केवल मृत्यु दिखाई देती है, वासुदेव।' },
      { time:  24.32, text: 'असंख्य, अगणित शव — अपने हाथों से।' },
      { time:  29.04, text: 'अपने ही परिवार का वध?' },
      { time:  31.04, text: 'वो परिवार जो चौसर के एक खेल में इतना डूब गया' },
      { time:  34.08, text: 'कि भरी राजसभा में अपनी ही कुलवधू का चीरहरण नहीं रोक पाए।' },
      { time:  37.76, text: 'तब कहां थे तुम्हारे पितामह और गुरु?' },
      { time:  40.48, text: 'वो अपने कर्तव्यों से बंधे थे, केशव।' },
      { time:  44.64, text: 'जैसे तुम अपने कर्तव्यों से — योद्धा के कर्तव्यों से।' },
      { time:  51.20, text: 'आपकी ये गूढ़ बातें मेरी समझ से परे हैं।' },
      { time:  53.52, text: 'मैं अब भी इस युद्ध में अपनी कुल और संबंधों के आगे कुछ नहीं देख पा रहा।' },
      { time:  59.12, text: 'मैं जानता हूं जो आप कहते हैं वही सत्य है।' },
      { time:  61.20, text: 'सत्य देखना चाहते हो, अर्जुन? तो देखो।' },
      { time:  66.24, text: 'कर्म करो, पार्थ। शस्त्र उठाओ।' },
      { time:  69.04, text: 'ये मत देखो कि तुम्हारे समक्ष कौन है।' },
      { time:  72.16, text: 'ये देखो कि तुम्हारे साथ कौन है।' },
      { time:  74.88, text: 'चाहे अपनों से ही क्यों ना लड़ना पड़े।' },
      { time:  79.52, text: 'ये पृथ्वी और इस पर चलता जीवन —' },
      { time:  85.84, text: 'सब में धर्म भी है।' },
      { time:  94.24, text: 'क्योंकि उस युद्ध में मारने वाला भी है और मरने वाला भी।' },
      { time: 104.48, text: 'यही प्रथम सत्य है। और यही अंतिम सत्य।' },
    ],
  },
];

/* ── Helpers ────────────────────────────────────────────────────────────── */
function getLyricIndex(t, lyrics) {
  let idx = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (t >= lyrics[i].time) idx = i;
    else break;
  }
  return idx;
}

function fmt(s) {
  if (!isFinite(s) || s < 0) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

/* ── Component ──────────────────────────────────────────────────────────── */
export default function ErwinCard({ opacity = 1, accent = '#e8ff47' }) {
  const { switchPro } = useTheme();
  const [activeIdx,  setActiveIdx]  = useState(0);
  // animPhase: null | { dir: 'left'|'right', phase: 'exit'|'enter' }
  const [animPhase,  setAnimPhase]  = useState(null);
  const [mouseX,     setMouseX]     = useState(-1);

  const [entered,    setEntered]    = useState(false);
  const [lyricIdx,   setLyricIdx]   = useState(-1);
  const [lyricKey,   setLyricKey]   = useState(0);
  const [lyricVis,   setLyricVis]   = useState(false);
  const [lineProg,   setLineProg]   = useState(0);
  const [totalProg,  setTotalProg]  = useState(0);
  const [elapsed,    setElapsed]    = useState(0);

  const audioRef     = useRef(null);
  const imgRef       = useRef(null);
  const canvasRef    = useRef(null);
  const wrapperRef   = useRef(null);
  const glowRef      = useRef(null);
  const isHovered    = useRef(false);
  const rafRef       = useRef(null);
  const switchingRef = useRef(false);
  // Keep activeIdx readable inside RAF without stale closures
  const activeIdxRef = useRef(0);
  useEffect(() => { activeIdxRef.current = activeIdx; }, [activeIdx]);

  const activeChar = CHARACTERS[activeIdx];

  /* entrance */
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 300);
    return () => clearTimeout(t);
  }, []);

  /* keyboard */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goPrev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  /* cursor X */
  useEffect(() => {
    const onMove  = (e) => setMouseX(e.clientX / window.innerWidth);
    const onLeave = ()  => setMouseX(-1);
    window.addEventListener('mousemove',  onMove,  { passive: true });
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  /* ── Audio helpers ── */
  const killAudio = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.src = '';
    audioRef.current = null;
  }, []);

  /* FIX: always creates a fresh Audio object for the given char */
  const spawnAudio = useCallback((char) => {
    killAudio();
    const a = new Audio(char.audio);
    a.loop   = true;
    a.volume = 1;
    audioRef.current = a;
    return a;
  }, [killAudio]);

  /* ── RAF loop ── */
  const stopLoop = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  }, []);

  const startLoop = useCallback((char) => {
    if (rafRef.current) return;
    const tick = () => {
      const a = audioRef.current;
      if (a && !a.paused) {
        const ct    = a.currentTime;
        const total = char.total;
        setElapsed(ct);
        setTotalProg(total > 0 ? Math.min(1, ct / total) : 0); // FIX: guard NaN
        const idx = getLyricIndex(ct, char.lyrics);
        setLyricIdx(prev => {
          if (prev !== idx) setLyricKey(k => k + 1);
          return idx;
        });
        if (idx >= 0) {
          const start = char.lyrics[idx].time;
          const end   = char.lyrics[idx + 1] ? char.lyrics[idx + 1].time : start + 4;
          setLineProg(Math.min(1, (ct - start) / (end - start)));
        } else {
          setLineProg(0);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => () => { stopLoop(); killAudio(); }, [stopLoop, killAudio]);

  /* canvas hit detection */
  useEffect(() => {
    canvasRef.current = null;
    const img = imgRef.current;
    if (!img) return;
    const build = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      canvasRef.current = c;
    };
    if (img.complete && img.naturalWidth) build();
    else img.addEventListener('load', build, { once: true });
  }, [activeIdx]);

  const isOpaqueAt = useCallback((cx, cy) => {
    const c = canvasRef.current, img = imgRef.current;
    if (!c || !img) return false;
    const r  = img.getBoundingClientRect();
    const px = Math.floor((cx - r.left) * (img.naturalWidth  / r.width));
    const py = Math.floor((cy - r.top)  * (img.naturalHeight / r.height));
    if (px < 0 || py < 0 || px >= c.width || py >= c.height) return false;
    try { return c.getContext('2d').getImageData(px, py, 1, 1).data[3] > 30; }
    catch { return false; }
  }, [activeIdx]); // eslint-disable-line

  /* ── Hover ── */
  const activate = useCallback(() => {
    if (isHovered.current || switchingRef.current) return;
    isHovered.current = true;
    setLyricVis(true);
    const char = CHARACTERS[activeIdxRef.current];
    /* FIX: spawn fresh audio for current char if missing */
    if (!audioRef.current) spawnAudio(char);
    const a = audioRef.current;
    if (a.paused) a.play().catch(() => {});
    startLoop(char);
    if (imgRef.current) {
      imgRef.current.style.filter    = 'brightness(1.15)';
      imgRef.current.style.transform = 'scale(1.03)';
    }
    if (glowRef.current) glowRef.current.style.opacity = '1';
  }, [spawnAudio, startLoop]);

  const deactivate = useCallback(() => {
    if (!isHovered.current) return;
    isHovered.current = false;
    if (audioRef.current) audioRef.current.pause();
    stopLoop();
    setLyricVis(false);
    setLyricIdx(-1);
    setElapsed(0);
    setTotalProg(0);
    setLineProg(0);
    if (imgRef.current) {
      imgRef.current.style.filter    = 'brightness(0.88)';
      imgRef.current.style.transform = 'scale(1)';
    }
    if (glowRef.current) glowRef.current.style.opacity = '0';
  }, [stopLoop]);

  const handleMouseMove  = useCallback(e => isOpaqueAt(e.clientX, e.clientY) ? activate() : deactivate(), [isOpaqueAt, activate, deactivate]);
  const handleMouseLeave = useCallback(() => deactivate(), [deactivate]);

  /* opacity sync */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    el.style.opacity       = String(opacity);
    el.style.pointerEvents = opacity < 0.05 ? 'none' : 'auto';
    if (opacity < 0.05 && isHovered.current) deactivate();
  }, [opacity, deactivate]);

  /* ── Character switch ─────────────────────────────────────────────────
     FIX 1: Kill old audio IMMEDIATELY — no gap, no overlap.
     FIX 2: Pre-spawn next char's Audio object right away.
     FIX 3: Two-phase animation (exit → swap → enter) works in all directions
             including 3→1 (wrap-around) because direction is computed as
             nextIdx > activeIdx, with a special wrap check.
  ──────────────────────────────────────────────────────────────────────── */
  const switchTo = useCallback((nextIdx) => {
    if (nextIdx === activeIdx || switchingRef.current) return;
    switchingRef.current = true;

    /* Determine visual direction — handle wrap-around correctly */
    const n = CHARACTERS.length;
    let dir;
    if (nextIdx === (activeIdx + 1) % n) dir = 'left';       // forward
    else if (nextIdx === (activeIdx + n - 1) % n) dir = 'right'; // backward
    else dir = nextIdx > activeIdx ? 'left' : 'right';

    /* 1. Kill current audio IMMEDIATELY */
    stopLoop();
    killAudio();
    isHovered.current = false;
    setLyricVis(false);
    setLyricIdx(-1);
    setElapsed(0);
    setTotalProg(0);
    setLineProg(0);
    if (glowRef.current) glowRef.current.style.opacity = '0';

    /* 2. Pre-load next char audio (not playing yet) */
    spawnAudio(CHARACTERS[nextIdx]);

    /* 3. Start exit phase */
    setAnimPhase({ dir, phase: 'exit' });

    setTimeout(() => {
      /* 4. Swap character */
      setActiveIdx(nextIdx);
      activeIdxRef.current = nextIdx;
      switchPro(nextIdx);   // sync pro-mode theme to this character

      /* 5. Start enter phase */
      setAnimPhase({ dir, phase: 'enter' });

      setTimeout(() => {
        setAnimPhase(null);
        switchingRef.current = false;
      }, 450);
    }, 280);
  }, [activeIdx, stopLoop, killAudio, spawnAudio, switchPro]);

  const goPrev = useCallback(() => switchTo((activeIdx + CHARACTERS.length - 1) % CHARACTERS.length), [switchTo, activeIdx]);
  const goNext = useCallback(() => switchTo((activeIdx + 1) % CHARACTERS.length), [switchTo, activeIdx]);

  /* ── Derived ── */
  const char      = activeChar;
  const lyric     = lyricIdx >= 0 ? char.lyrics[lyricIdx].text : '';
  const prevLyric = lyricIdx > 0  ? char.lyrics[lyricIdx - 1].text : '';
  const nextLyric = lyricIdx >= 0 && lyricIdx < char.lyrics.length - 1 ? char.lyrics[lyricIdx + 1].text : '';

  /* ── Image transition styles — directional slide with 3D hint ── */
  const getImgStyle = () => {
    if (!animPhase) {
      return {
        opacity   : 1,
        transform : 'translateX(0) scale(1)',
        filter    : 'brightness(0.88)',
        transition: 'filter 0.3s ease',
      };
    }
    const { dir, phase } = animPhase;
    if (phase === 'exit') {
      const tx = dir === 'left' ? '-90px' : '90px';
      const ry = dir === 'left' ? '10deg' : '-10deg';
      return {
        opacity   : 0,
        transform : `translateX(${tx}) scale(0.90) rotateY(${ry})`,
        filter    : 'brightness(0.3) blur(3px)',
        transition: 'opacity 0.28s ease, transform 0.28s cubic-bezier(0.55,0,1,0.45), filter 0.28s ease',
      };
    }
    /* enter: CSS @keyframes handles the start-offscreen → center movement */
    return {
      animation: dir === 'left'
        ? 'slideInFromRight 0.45s cubic-bezier(0.16,1,0.3,1) both'
        : 'slideInFromLeft  0.45s cubic-bezier(0.16,1,0.3,1) both',
    };
  };

  return (
    <>
      {/* ── LYRICS PANEL ─────────────────────────────────────────────── */}
      <div
        aria-live="polite"
        style={{
          position     : 'absolute',
          top          : '38%',
          right        : '3%',
          width        : '370px',
          zIndex       : 20,
          pointerEvents: 'none',
          opacity      : lyricVis ? 1 : 0,
          transform    : lyricVis ? 'translateY(0)' : 'translateY(-10px)',
          transition   : 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <div style={{
          background    : 'rgba(4,4,3,0.90)',
          border        : `1px solid ${accent}28`,
          borderTop     : `1px solid ${accent}77`,
          borderRadius  : '3px',
          backdropFilter: 'blur(18px)',
          overflow      : 'hidden',
          boxShadow     : `0 0 30px ${accent}12, 0 0 60px ${accent}08, inset 0 1px 0 ${accent}22`,
        }}>
          <div style={{ height:'2px', background:`linear-gradient(90deg, transparent, ${accent}dd 40%, ${accent} 50%, ${accent}dd 60%, transparent)`, boxShadow:`0 0 14px ${accent}cc, 0 0 28px ${accent}66` }} />

          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 14px 6px', borderBottom:`1px solid ${accent}10` }}>
            <div style={{ display:'flex', alignItems:'flex-end', gap:'3px', height:'14px' }}>
              {[8,14,6,12,9].map((h,i) => (
                <div key={i} style={{ width:'3px', borderRadius:'2px', background:accent, boxShadow:`0 0 5px ${accent}`, height:`${h}px`, animation:lyricVis ? `eq${i} ${0.35+i*0.08}s ease-in-out infinite alternate` : 'none' }} />
              ))}
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:'7px', letterSpacing:'3px', color:`${accent}66`, textTransform:'uppercase', marginLeft:'6px', alignSelf:'center' }}>{char.name}'s Speech</span>
            </div>
            <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:'7px', letterSpacing:'2px', color:`${accent}44` }}>{String(Math.max(0, lyricIdx + 1)).padStart(2,'0')} / {String(char.lyrics.length).padStart(2,'0')}</span>
          </div>

          <div style={{ padding:'6px 14px 2px', fontFamily:"'JetBrains Mono', monospace", fontSize:'8px', letterSpacing:'1.2px', color:`${accent}22`, textTransform:'uppercase', textAlign:'center', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis', minHeight:'20px', lineHeight:1.5 }}>{prevLyric}</div>

          <div key={lyricKey} style={{ padding:'9px 14px 7px', textAlign:'center', animation:'erwinIn 0.45s cubic-bezier(0.16,1,0.3,1) both' }}>
            <p style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:'12px', letterSpacing:'1.8px', lineHeight:1.7, color:accent, textTransform:'uppercase', fontWeight:600, margin:0, textShadow:`0 0 8px ${accent}, 0 0 20px ${accent}cc, 0 0 40px ${accent}66` }}>{lyric}</p>
          </div>

          <div style={{ padding:'2px 14px 7px', fontFamily:"'JetBrains Mono', monospace", fontSize:'8px', letterSpacing:'1.2px', color:`${accent}16`, textTransform:'uppercase', textAlign:'center', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis', minHeight:'20px', lineHeight:1.5 }}>{nextLyric}</div>

          <div style={{ height:'1px', margin:'0 14px', background:`${accent}12` }} />

          <div style={{ padding:'10px 14px 12px' }}>
            <div style={{ marginBottom:'8px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:'7px', color:`${accent}44`, letterSpacing:'1.5px', textTransform:'uppercase' }}>Line</span>
                <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:'7px', color:`${accent}44` }}>{Math.round(lineProg*100)}%</span>
              </div>
              <div style={{ height:'2px', background:`${accent}15`, borderRadius:'2px', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${lineProg*100}%`, background:`linear-gradient(90deg, ${accent}88, ${accent})`, boxShadow:`0 0 8px ${accent}cc`, transition:'width 0.1s linear', borderRadius:'2px' }} />
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:'7px', color:`${accent}55`, minWidth:'26px' }}>{fmt(elapsed)}</span>
              <div style={{ flex:1, height:'4px', background:`${accent}12`, borderRadius:'4px', position:'relative', overflow:'visible' }}>
                <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${totalProg*100}%`, background:`linear-gradient(90deg, ${accent}88, ${accent}ff)`, borderRadius:'4px', boxShadow:`0 0 10px ${accent}cc, 0 0 20px ${accent}55`, transition:'width 0.1s linear' }} />
                <div style={{ position:'absolute', top:'50%', left:`${totalProg*100}%`, transform:'translate(-50%,-50%)', width:'10px', height:'10px', borderRadius:'50%', background:accent, boxShadow:`0 0 10px ${accent}, 0 0 22px ${accent}bb`, border:'1px solid rgba(255,255,255,0.25)', transition:'left 0.1s linear' }} />
              </div>
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:'7px', color:`${accent}44`, minWidth:'26px', textAlign:'right' }}>{fmt(char.total)}</span>
            </div>

            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:'3px', marginTop:'10px' }}>
              {char.lyrics.map((_,i) => {
                const past = i < lyricIdx, cur = i === lyricIdx;
                return (
                  <div key={i} style={{ height:cur?'4px':'3px', width:cur?'18px':past?'5px':'4px', borderRadius:'3px', background:cur?accent:past?`${accent}50`:`${accent}15`, boxShadow:cur?`0 0 8px ${accent}, 0 0 16px ${accent}77`:'none', transition:'all 0.35s cubic-bezier(0.16,1,0.3,1)' }} />
                );
              })}
            </div>
          </div>

          <div style={{ height:'1px', background:`linear-gradient(90deg, transparent, ${accent}33 40%, ${accent}33 60%, transparent)` }} />
        </div>
      </div>

      {/* ── CHARACTER FIGURE + SWITCHER ──────────────────────────────── */}
      <div
        ref={wrapperRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position      : 'absolute',
          bottom        : 0,
          left          : char.imageLeft,
          transform     : 'translateX(-50%)',
          height        : '84vh',
          width         : 'auto',
          zIndex        : 10,
          display       : 'flex',
          flexDirection : 'column',
          alignItems    : 'center',
          justifyContent: 'flex-end',
          pointerEvents : 'auto',
          cursor        : 'none',
          opacity       : entered ? opacity : 0,
          translate     : entered ? '0 0' : '0 40px',
          transition    : entered
            ? 'opacity 1.2s cubic-bezier(0.22,1,0.36,1), translate 1.2s cubic-bezier(0.22,1,0.36,1)'
            : 'none',
        }}
      >
        {/* GLOW */}
        <div ref={glowRef} aria-hidden="true" style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', height:'100%', pointerEvents:'none', zIndex:0, opacity:0, transition:'opacity 0.65s ease' }}>
          <div style={{ position:'absolute', bottom:'12%', left:'50%', transform:'translateX(-50%)', width:'100px', height:'50%', background:`radial-gradient(ellipse at 50% 55%, ${accent}ff 0%, ${accent}cc 12%, ${accent}55 30%, transparent 60%)`, filter:'blur(18px)' }} />
          <div style={{ position:'absolute', bottom:'18%', left:'50%', transform:'translateX(-50%)', width:'260px', height:'55%', background:`radial-gradient(ellipse at 50% 60%, ${accent}88 0%, ${accent}44 25%, ${accent}18 50%, transparent 70%)`, filter:'blur(36px)' }} />
          <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', width:'130px', height:'100%', background:`linear-gradient(to top, ${accent}99 0%, ${accent}55 20%, ${accent}22 48%, ${accent}08 70%, transparent 100%)`, filter:'blur(32px)' }} />
          <div style={{ position:'absolute', bottom:'-40px', left:'50%', transform:'translateX(-50%)', width:'480px', height:'70%', background:`radial-gradient(ellipse at 50% 80%, ${accent}44 0%, ${accent}18 30%, ${accent}06 55%, transparent 72%)`, filter:'blur(55px)' }} />
          <div style={{ position:'absolute', bottom:'-35px', left:'50%', transform:'translateX(-50%)', width:'280px', height:'55px', borderRadius:'50%', background:`radial-gradient(ellipse, ${accent}bb 0%, ${accent}55 35%, transparent 72%)`, filter:'blur(14px)' }} />
        </div>

        {/* Character image */}
        <img
          ref={imgRef}
          key={`char-${activeIdx}`}
          src={char.image}
          alt=""
          aria-hidden="true"
          draggable={false}
          crossOrigin="anonymous"
          style={{
            height         : '84vh',
            maxWidth       : 'none',
            width          : 'auto',
            display        : 'block',
            objectFit      : 'contain',
            objectPosition : 'bottom',
            userSelect     : 'none',
            transformOrigin: 'bottom center',
            pointerEvents  : 'none',
            position       : 'relative',
            zIndex         : 1,
            ...getImgStyle(),
          }}
        />

        {/* Dots */}
        <div style={{
          position:'absolute', bottom:'22px', left:'50%', transform:'translateX(-50%)',
          display:'flex', alignItems:'center', gap:'6px', zIndex:15, pointerEvents:'auto', cursor:'default',
        }}>
          {CHARACTERS.map((c,i) => (
            <button
              key={i}
              onClick={() => switchTo(i)}
              title={c.name}
              style={{ width:i===activeIdx?'22px':'7px', height:'7px', borderRadius:'4px', background:i===activeIdx?accent:`${accent}30`, border:'none', cursor:'pointer', padding:0, transition:'all 0.35s cubic-bezier(0.16,1,0.3,1)', boxShadow:i===activeIdx?`0 0 8px ${accent}, 0 0 16px ${accent}66`:'none' }}
            />
          ))}
        </div>
      </div>

      {/* LEFT arrow */}
      <div onClick={goPrev} style={{ position:'fixed', left:0, top:0, width:'72px', height:'100vh', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', opacity:mouseX>=0&&mouseX<0.12?1:0, transition:'opacity 0.3s ease', pointerEvents:mouseX>=0&&mouseX<0.12?'auto':'none' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'36px', height:'52px', borderRadius:'3px', background:'rgba(0,0,0,0.18)', backdropFilter:'blur(6px)', border:`1px solid ${accent}18`, color:`${accent}bb`, fontSize:'18px', fontFamily:"'JetBrains Mono', monospace", userSelect:'none', transition:'background 0.2s, border-color 0.2s, color 0.2s' }}
          onMouseEnter={e=>{ e.currentTarget.style.background='rgba(0,0,0,0.35)'; e.currentTarget.style.borderColor=`${accent}44`; e.currentTarget.style.color=accent; }}
          onMouseLeave={e=>{ e.currentTarget.style.background='rgba(0,0,0,0.18)'; e.currentTarget.style.borderColor=`${accent}18`; e.currentTarget.style.color=`${accent}bb`; }}
        >‹</div>
      </div>

      {/* RIGHT arrow */}
      <div onClick={goNext} style={{ position:'fixed', right:0, top:0, width:'72px', height:'100vh', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', opacity:mouseX>0.88?1:0, transition:'opacity 0.3s ease', pointerEvents:mouseX>0.88?'auto':'none' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'36px', height:'52px', borderRadius:'3px', background:'rgba(0,0,0,0.18)', backdropFilter:'blur(6px)', border:`1px solid ${accent}18`, color:`${accent}bb`, fontSize:'18px', fontFamily:"'JetBrains Mono', monospace", userSelect:'none', transition:'background 0.2s, border-color 0.2s, color 0.2s' }}
          onMouseEnter={e=>{ e.currentTarget.style.background='rgba(0,0,0,0.35)'; e.currentTarget.style.borderColor=`${accent}44`; e.currentTarget.style.color=accent; }}
          onMouseLeave={e=>{ e.currentTarget.style.background='rgba(0,0,0,0.18)'; e.currentTarget.style.borderColor=`${accent}18`; e.currentTarget.style.color=`${accent}bb`; }}
        >›</div>
      </div>

      <style>{`
        @keyframes erwinIn {
          from { opacity:0; transform:translateY(12px) scale(0.96); filter:blur(4px); }
          to   { opacity:1; transform:translateY(0) scale(1); filter:blur(0); }
        }
        /* Directional photo transitions — work in infinite loop both ways */
        @keyframes slideInFromRight {
          from { opacity:0; transform:translateX(110px) scale(0.88) rotateY(-12deg); filter:brightness(0.3) blur(4px); }
          to   { opacity:1; transform:translateX(0) scale(1) rotateY(0deg);          filter:brightness(0.88) blur(0); }
        }
        @keyframes slideInFromLeft {
          from { opacity:0; transform:translateX(-110px) scale(0.88) rotateY(12deg); filter:brightness(0.3) blur(4px); }
          to   { opacity:1; transform:translateX(0) scale(1) rotateY(0deg);          filter:brightness(0.88) blur(0); }
        }
        @keyframes eq0 { from{height:8px}  to{height:4px}  }
        @keyframes eq1 { from{height:14px} to{height:6px}  }
        @keyframes eq2 { from{height:6px}  to{height:14px} }
        @keyframes eq3 { from{height:12px} to{height:4px}  }
        @keyframes eq4 { from{height:9px}  to{height:13px} }
        @media (max-width:900px) { .erwin-wrap { display:none !important; } }
      `}</style>
    </>
  );
}
