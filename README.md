# Dhruv Garhwal — Portfolio v2

Full-stack MERN portfolio with 3D character model, custom cursor, timeline story, video backgrounds, and scroll animations.

## Project Structure

```
portfolio/
├── client/
│   ├── public/
│   │   ├── index.html
│   │   ├── models/
│   │   │   └── character.glb    ← 3D character model (included)
│   │   └── videos/              ← PUT YOUR VIDEOS HERE
│   │       ├── video0.mp4       (ASRA  — crimson theme)
│   │       ├── video1.mp4       (VER   — glacier theme)
│   │       └── video2.mp4       (ASGA  — void theme)
│   └── src/
│       ├── components/
│       │   ├── VideoBackground.jsx
│       │   ├── Navbar.jsx
│       │   ├── Hero.jsx          ← Three.js GLB model viewer
│       │   ├── Story.jsx         ← Animated timeline
│       │   ├── Project.jsx
│       │   ├── Skills.jsx
│       │   ├── Goals.jsx
│       │   └── Contact.jsx
│       ├── context/ThemeContext.jsx
│       ├── App.jsx               ← CustomCursor + ScrollReveal
│       ├── index.jsx
│       └── index.css             ← All cursor/animation styles
└── server/
    ├── routes/portfolio.js
    ├── middleware/errorHandler.js
    ├── index.js
    └── .env.example
```

## Setup

```bash
# Install
npm install
npm run install:all

# Dev
npm run dev       # React :3000 + Express :5000

# Production
npm run build
npm start
```

## New in v2

| Feature | Detail |
|---|---|
| **3D character** | GLB model in hero, mouse-parallax tilt, float animation, scroll shrink |
| **Custom cursor** | Ring + dot + glow trail; morphs to square on hover, shrinks on click |
| **Timeline story** | Vertical animated line grows on scroll; cards slide in from alternating sides |
| **Scroll animations** | `.reveal` class system — fade-up, slide-left, slide-right, scale variants |
| **Brighter video** | Opacity 0.40, brightness 1.25, vignette reduced to 0.30 |
| **Sri Ganganagar** | All "Delhi" references updated |
