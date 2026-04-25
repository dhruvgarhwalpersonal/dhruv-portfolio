const express = require('express');
const router  = express.Router();

// ── GET /api/portfolio ───────────────────────────────────────────────────────
router.get('/', (_req, res) => {
  res.json({
    name:         'Dhruv Garhwal',
    title:        'Full-Stack Developer',
    location:     'Delhi, India',
    status:       'Open to Opportunities',
    responseTime: 'Within 24 hours',
    email:        'dhruvgarhwalpersonal@gmail.com',
    github:       'https://github.com/dhruvgarhwalpersonal',
    twitter:      'https://x.com/dhruvgarhwal',
    instagram:    'https://instagram.com/dhruvgarhwalpersonal',
    discord:      'dhruvgarhwalpersonal',

    stats: [
      { num: '1',  label: 'Live App'  },
      { num: '18', label: 'Years Old' },
      { num: '∞',  label: 'Drive'     },
    ],

    skills: [
      { name: 'JavaScript',     level: 65, label: 'Intermediate — Building Production Apps' },
      { name: 'Python',         level: 35, label: 'Learning — Scripting & Automation'       },
      { name: 'HTML / CSS',     level: 75, label: 'Solid — Custom UI Design'                },
      { name: 'Firebase',       level: 60, label: 'Working — Auth + Firestore'              },
      { name: 'Problem Solving',level: 80, label: 'Strong — Competitive + Self-taught'      },
      { name: 'Focus & Grit',   level: 95, label: 'Tested — 23hr grind sessions, real'      },
    ],

    videos: [
      { id: 0, label: 'ASRA', theme: 'crimson', src: '/videos/video0.mp4' },
      { id: 1, label: 'VER',  theme: 'glacier', src: '/videos/video1.mp4' },
      { id: 2, label: 'ASGA', theme: 'void',    src: '/videos/video2.mp4' },
    ],

    project: {
      name:        'PROTOCOL',
      year:        2026,
      liveUrl:     'https://protocol.home.kg/',
      description: "A full-stack productivity and habit-tracking web app with per-user cloud sync, intelligent scheduling, and a quote engine. Built because I needed a system I'd actually use — so I built one from scratch.",
      techStack:   ['Vanilla JS', 'Firebase Auth', 'Firestore', 'Chart.js', 'Python', 'Anthropic API', 'HTML/CSS'],
      features: [
        'Per-user cloud storage with Firebase Auth + Firestore — full login system with session management',
        'Habit OS with scheduling, streaks, and smart reminders — a real system, not just a checklist',
        'AI-powered quote engine via Python script using Anthropic API — generates 200+ themed quotes per run',
        'Custom smartFill bezier chart plugin for beautiful data visualization',
        'Entrance exam tracker, calendar, onboarding, admin API, keyboard shortcuts — production-grade',
        'Firestore document size management with intelligent trimming to stay under limits',
      ],
    },

    story: [
      { act: 'ACT I — THE AMBITION',  heading: 'BORN TO CHASE',    highlight: 'driven way',
        text: "I grew up competitive. Not in a toxic way — in a driven way. The kind of kid who genuinely loved learning when the subject was alive. Top of class. Curious. Hungry." },
      { act: 'ACT II — THE DETOUR',   heading: 'KOTA: THE SYSTEM', highlight: 'Top of 300 students',
        text: "I enrolled in JEE coaching in Kota. First month? Top of 300 students. Then the system wore me down — not intellectually, but spiritually. I wasn't broken by difficulty. I was broken by pointlessness." },
      { act: 'ACT III — THE PIVOT',   heading: 'FINDING CODE',     highlight: 'programming',
        text: "I came back to Delhi and discovered something I actually gave a damn about — programming. Built Protocol from scratch. Full auth system. Cloud sync. An AI quote engine. In months. That's what happens when you care." },
      { act: 'ACT IV — THE BUILD',    heading: 'NOW: LOCKED IN',   highlight: 'Building real things',
        text: "I'm 18. Class 12. Cracking entrance exams. Training my body. Building real things. Every system I build teaches me something about systems in general — including myself." },
    ],

    goals: [
      { num: '01', icon: '📚', title: 'CLASS 12 — 100%',        highlight: '100%',
        text: "Not 90. Not 95. 100%. I know what I'm capable of when I'm locked in. First month at JEE coaching — I was top of 300. That version of me comes back, but for the right thing this time." },
      { num: '02', icon: '🐍', title: 'PYTHON — ADVANCED',      highlight: 'actual projects',
        text: "From beginner to advanced this year. Already using Anthropic's API via Python (see: Protocol's quote engine). Next: data structures, algorithms, and building real tools. Not just tutorials — actual projects." },
      { num: '03', icon: '💪', title: '56kg → 70kg MUSCLE',     highlight: '70kg, mostly muscle',
        text: "Physical health matters. I returned from Kota at 56kg and 5'10½\". Target: 70kg, mostly muscle. Building the system, tracking the habit. Protocol holds me accountable." },
      { num: '04', icon: '🎯', title: 'POLARIS SCHOOL OF TECH', highlight: 'Polaris School of Technology',
        text: "The final target. Crack the entrance exam. Get into Polaris School of Technology. Everything this year — the studying, the coding, the discipline — points here." },
    ],
  });
});

// ── POST /api/contact ────────────────────────────────────────────────────────
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email, and message are required' });
  }
  console.log(`📬 New contact from ${name} <${email}>: ${message}`);
  res.json({ success: true, message: 'Message received!' });
});

module.exports = router;
