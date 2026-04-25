import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

const ThemeContext = createContext(null);

export const THEMES = {
  // ── PRO MODE THEMES — one per character, colours pulled from their image ──

  pro_erwin: {                        // Erwin — blonde, brown leather, warm amber
    bg: '#0a0a0a',
    bg2: '#111',
    card: '#141414',
    border: '#222',
    accent: '#e8ff47',
    accent2: '#47ffb4',
    text: '#f0f0f0',
    text2: '#888',
    text3: '#555',
    name: 'ERWIN',
  },
  pro_thorfinn: {                     // Thorfinn — dark hair, blue-grey tunic, steel blue
    bg: '#050810',
    bg2: '#080d18',
    card: '#0d1422',
    border: '#1a2540',
    accent: '#7ab3d4',
    accent2: '#aed4e8',
    text: '#e8f2f8',
    text2: '#5a8aaa',
    text3: '#2a4a62',
    name: 'THORFINN',
  },
  pro_krishna: {                      // Krishna — blue skin, saffron robes, divine gold
    bg: '#0a0800',
    bg2: '#120f00',
    card: '#1c1600',
    border: '#3a2e00',
    accent: '#f5a623',
    accent2: '#ffd166',
    text: '#fff8e8',
    text2: '#b87c1a',
    text3: '#6e4800',
    name: 'KRISHNA',
  },

  // ── FUN MODE THEMES ───────────────────────────────────────────────────────
  void: {
    bg: '#07050f',
    bg2: '#0d0a18',
    card: '#130f22',
    border: '#251a3d',
    accent: '#9b6dff',
    accent2: '#4db8ff',
    text: '#ede8ff',
    text2: '#7a68aa',
    text3: '#4a3a70',
    name: 'VOID SEQUENCE',
  },
  emerald: {
    bg: '#030d07',
    bg2: '#061409',
    card: '#0a1e0e',
    border: '#1a3d24',
    accent: '#3dff8f',
    accent2: '#a8ff78',
    text: '#e8ffe8',
    text2: '#5ca870',
    text3: '#2d6640',
    name: 'EMERALD ASCENT',
  },
  crimson: {
    bg: '#0d0508',
    bg2: '#130a0c',
    card: '#1a0d10',
    border: '#3a1520',
    accent: '#ff4d6d',
    accent2: '#ffb347',
    text: '#ffe8ec',
    text2: '#c47b8a',
    text3: '#7a4050',
    name: 'CRIMSON AWAKENING',
  },
};

// Fun mode: slot 0=void/purple, slot 1=emerald/green, slot 2=crimson/red
export const VIDEO_THEMES = ['void', 'emerald', 'crimson'];
// Pro mode: slot 0=pro_erwin, slot 1=pro_thorfinn, slot 2=pro_krishna
export const PRO_THEMES   = ['pro_erwin', 'pro_thorfinn', 'pro_krishna'];

export function ThemeProvider({ children }) {
  const [mode,        setMode]        = useState('professional');
  const [activeVideo, setActiveVideo] = useState(0);
  const [activePro,   setActivePro]   = useState(0);   // syncs with ErwinCard character
  const [muted,       setMuted]       = useState(true);

  const videoRefsObj = useRef({ 0: null, 1: null, 2: null });

  const setVideoRef = useCallback((idx) => (el) => {
    videoRefsObj.current[idx] = el;
  }, []);

  const currentTheme = mode === 'professional'
    ? THEMES[PRO_THEMES[activePro]]
    : THEMES[VIDEO_THEMES[activeVideo]];

  const switchVideo = useCallback((idx) => setActiveVideo(idx), []);
  // switchPro is called by ErwinCard when user switches characters
  const switchPro   = useCallback((idx) => setActivePro(idx),   []);

  const toggleMode = useCallback(() => {
    setMode(m => {
      const next = m === 'professional' ? 'fun' : 'professional';
      if (next === 'professional') {
        Object.values(videoRefsObj.current).forEach(v => v && v.pause());
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{
      mode,
      toggleMode,
      activeVideo,
      switchVideo,
      activePro,
      switchPro,
      muted,
      setMuted,
      currentTheme,
      videoRefsObj,
      setVideoRef,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
};
