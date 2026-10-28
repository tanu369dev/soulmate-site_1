# Kismet – dating website prototype

A fully working front-end prototype: animated landing page + a mini app with swipe cards,
matches, chat, games, filters, profile editor, premium and safety tools.
Plain HTML, CSS and JavaScript. **No install and no build step.**

## Folder
```
kismet/
├── index.html      page structure
├── css/styles.css  all design + animation
├── js/app.js       all behaviour and demo data
└── README.md
```

## Run it on your computer
Double-click `index.html`, or in VS Code use the "Live Server" extension.

## Put it on GitHub
1. Create an empty repository on github.com (for example `kismet-dating-site`).
2. In a terminal, inside this folder:
```
git init
git add .
git commit -m "Kismet dating website prototype"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/kismet-dating-site.git
git push -u origin main
```

## Deploy on Vercel
1. Go to vercel.com and sign in with GitHub.
2. Click **Add New → Project** and import `kismet-dating-site`.
3. Framework Preset: **Other**. Leave Build Command and Output Directory empty. Click **Deploy**.
4. Every later `git push` redeploys the site automatically.

## What to replace before a real launch
- Profiles are demo data at the top of `js/app.js` (`PEOPLE`). Portraits are generated SVGs. Swap `art()` for real photos.
- Stats, prices and plans are placeholders.
- Chat replies are scripted. Real chat, accounts, matching and payments need a backend (for example Supabase or Firebase).
- Data is saved in the browser (`localStorage`). Use "Start again" in Discover to reset the deck.

## Feature list
Swipe deck (drag, buttons, keyboard) · like / pass / super like · rewind · boost timer · match celebration with confetti ·
photo cycling · compatibility score · shared-interest highlights · prompts and anthem · verified badge and verification flow ·
filters (age, distance, intent, verified) · daily picks · likes-you with Gold unlock · chat with typing indicator, reactions
and icebreaker chips · video-date invite · flip-card icebreakers · would-you-rather · compatibility quiz · date spinner ·
profile editor with live preview and strength meter · incognito / distance / receipts settings · report and block ·
safety centre · pricing plans · light and dark theme · responsive mobile layout with bottom tabs · reduced-motion support.
