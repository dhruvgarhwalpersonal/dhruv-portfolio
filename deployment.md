# How to Deploy Your Portfolio on Vercel
## Free Live Website — Step by Step Guide for Dhruv

---

## WHAT YOU WILL GET AT THE END
A live website like:
`dhruv.vercel.app` or `dhruvgarhwal.vercel.app`
— accessible by anyone in the world, for free, forever.

---

## STEP 1 — Create a GitHub Account (if you don't have one)

1. Go to **github.com**
2. Click **Sign Up**
3. Username → use `dhruvgarhwalpersonal` (same as your other socials)
4. Email → `dhruvgarhwalpersonal@gmail.com`
5. Complete signup and verify email

---

## STEP 2 — Create a New Repository on GitHub

1. After login, click the **+** icon (top right) → **New repository**
2. Repository name → `portfolio` (or `dhruv-portfolio`)
3. Set it to **Public**
4. Do NOT check "Add README"
5. Click **Create repository**
6. Copy the repository URL shown — looks like:
   `https://github.com/dhruvgarhwalpersonal/portfolio.git`

---

## STEP 3 — Push Your Portfolio Files to GitHub

Open terminal in your portfolio folder (where you ran npm install).

Run these commands ONE BY ONE:

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "my portfolio first upload"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/dhruvgarhwalpersonal/portfolio.git
```

```bash
git push -u origin main
```

If it asks for GitHub login — enter your username and password.

✅ Done — your files are now on GitHub.

---

## STEP 4 — Create a Vercel Account

1. Go to **vercel.com**
2. Click **Sign Up**
3. Choose **Continue with GitHub** — this connects Vercel to your GitHub automatically
4. Authorize Vercel when it asks

---

## STEP 5 — Import Your Project on Vercel

1. After login you will see the Vercel dashboard
2. Click **Add New** → **Project**
3. You will see your GitHub repos listed
4. Find `portfolio` and click **Import**

---

## STEP 6 — Configure the Build Settings

Vercel is smart — it will auto-detect this is a Vite + React project.

You will see a screen with settings. Verify these are correct:

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

If they are already correct → do nothing. If not → set them manually.

---

## STEP 7 — Deploy

1. Click the big **Deploy** button
2. Wait 1-3 minutes
3. Vercel will build your project automatically
4. When done you will see confetti 🎉 and a link like:
   `https://portfolio-dhruvgarhwalpersonal.vercel.app`

Click the link — your portfolio is LIVE. ✅

---

## STEP 8 — Get a Better URL (Optional but Recommended)

The default URL looks messy. To get a cleaner one:

1. Go to your project on Vercel dashboard
2. Click **Settings** → **Domains**
3. Type your preferred domain → `dhruvgarhwal.vercel.app`
4. Click **Add**
5. If available it will be set instantly — free.

---

## STEP 9 — How to Update Your Site in Future

Whenever you make changes to your portfolio:

Open terminal in portfolio folder and run:

```bash
git add .
git commit -m "updated portfolio"
git push
```

That's it. Vercel will automatically detect the push and redeploy your site in 1-2 minutes. No extra steps needed.

---

## COMMON ERRORS AND FIXES

**Error: Build failed**
- Most likely a TypeScript error in the code
- Run `npm run build` locally first
- Fix any errors shown, then push again

**Error: git push asks for password and fails**
- GitHub no longer accepts passwords
- Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Generate new token
- Use that token as your password

**Error: White screen on live site**
- Open Vercel dashboard → your project → Deployments → click latest → check logs
- Share the error with me and I will fix it

**Error: Module not found**
- Run `npm install` again locally
- Then push again

---

## SUMMARY — COMMANDS IN ORDER

```bash
git init
git add .
git commit -m "my portfolio first upload"
git branch -M main
git remote add origin https://github.com/dhruvgarhwalpersonal/portfolio.git
git push -u origin main
```
Then on vercel.com → import → deploy → done.

---

## AFTER DEPLOYMENT — ADD YOUR LIVE URL EVERYWHERE

Once live, add your Vercel URL to:
- Your Twitter/X bio
- Your GitHub profile README
- Your Discord bio
- Your portfolio Contact section

---

*Your portfolio will be live 24/7, loads fast, and auto-updates every time you push to GitHub. Zero cost. Zero maintenance.*
