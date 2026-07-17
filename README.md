# Srujana Challuri — Editorial Portfolio

A modern, editorial-style personal portfolio built with **Vite + React** and a
hand-crafted CSS design system (warm "paper" palette, serif display type,
numbered sections, hairline rules). Fully responsive, light/dark aware, and with
reduced-motion support.

This is a **new, standalone repo** — it does not touch any existing portfolio.

## Run locally

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Editing content

All text lives in one place: **`src/data/portfolio.js`**.
Update your bio, experience, projects, skills, and education there — no need to
touch the components.

- `profile` — name, roles, intro, email, social links
- `stats` — the four headline numbers
- `about` — bio paragraphs + focus areas
- `experience` — roles (newest first)
- `projects` — selected work cards
- `skills` — grouped skill columns
- `education` — degrees

> **Note:** update the GitHub link in `profile.socials` (currently a placeholder)
> and confirm the LinkedIn URL.

## Structure

```
src/
  data/portfolio.js     ← all content
  components/            ← Nav, Hero, Stats, About, Experience,
                            Projects, Skills, Education, Contact
  index.css             ← design system + all styles
  useReveal.js          ← scroll-reveal animation hook
  App.jsx  main.jsx
```

## Deploy

The `dist/` output is a static site — deploy to Vercel, Netlify, GitHub Pages,
or any static host. (Hosting to be decided.)

## Fonts

Fraunces (serif display), Inter (sans), and JetBrains Mono (labels) are loaded
from Google Fonts in `index.html`.
