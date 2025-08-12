# 🎮 WGames

*A collection of minimalist, futuristic micro-games — fast rounds, pleasant UI and accessibility first.*

[![License](https://img.shields.io/github/license/DrimoZ/WGames)](./LICENSE)
[![Issues](https://img.shields.io/github/issues/DrimoZ/WGames)](https://github.com/DrimoZ/WGames/issues)
[![Stars](https://img.shields.io/github/stars/DrimoZ/WGames)](https://github.com/DrimoZ/WGames/stargazers)

---

## ✨ Overview

**WGames** is a small suite of lightweight, responsive micro-games designed for short, delightful sessions. Each game is built with modern front-end tools, accessible by design, and small in footprint.

The first (featured) game is **Word Wave** — a daily word-guessing puzzle with multiple modes and a global daily reset at **00:00 UTC**.

---

## 🎯 Features

- Minimalist, futuristic UI designed for clarity and speed  
- Mobile-first, responsive layout — works great on phones and desktops  
- Built with **Vite + React + TypeScript** for fast development and performance  
- Daily puzzles: synchronized globally (UTC midnight reset) — no manual reset  
- Multiple modes: Classic (5 letters), Hard (7 letters), Extreme (9–10 letters)  
- Accessible controls: keyboard + on-screen keyboard, ARIA labels, focus handling  
- Lightweight confetti + polish for wins, modular components for easy extensibility

---

## 🛠 Tech Stack

- **Framework:** React + TypeScript (Vite)
- **Styling:** SCSS modules, CSS variables (design tokens)
- **State:** Local React state + localStorage (per-mode, per-day persistence)
- **Build:** Vite
- **Repo:** GitHub (this project)

---

## 🚀 Quick start

Clone, install, run:

~~~bash
git clone https://github.com/DrimoZ/WGames.git
cd WGames
npm install
npm run dev      # development server (Vite)
npm run build    # production build
~~~

Open the app at `http://localhost:5173` (or the port Vite reports).

---

## 📁 Project structure (high level)

```
src/
├── features/word-wave/ # Word Wave game (components, hooks, utils)
├── shared/ # shared UI (layout, game cards, header)
├── pages/ # pages (home, about, not-found)
├── styles/ # variables.scss, main.scss, app.scss
└── main.tsx # app entry
```

---

## 🎮 Word Wave — quick notes

- **Classic:** 5-letter words, 6 guesses, all previous tries revealed.  
- **Hard:** 7-letter words, 6 guesses, all previous tries revealed.  
- **Extreme:** 9–10 letter words, 6 guesses, only the last attempt is revealed.  
- **Daily reset:** The daily words are deterministic and identical for everyone; they reset automatically at **00:00 UTC**. Users cannot manually reset a day’s puzzle.  
- **Colors:** incorrect = dark grey, present = yellow, correct = green (applied to tiles + on-screen keyboard).  
- State and progress for each mode are persisted in localStorage per day.

---

## ✅ Contributing

Contributions are welcome! Suggested flow:

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/awesome-thing`
3. Make changes, keep commits focused and small
4. Run the app locally and verify behaviour
5. Open a PR with a clear description

Please follow the code style: TypeScript + SCSS modules + modular components. If adding a game, add it under `src/features` and a GameCard under `shared/ui` so it appears on the homepage.

---

## 🧭 Roadmap (short-term)

- Full stats & history (streaks, distribution)
- Global leaderboard (optional / privacy-first)
- More micro-games (mini-arcade)
- Accessibility audit and improvements
- Lightweight analytics opt-in (usage insights, not PII)

---

## 🔒 Privacy

No personal data is collected by default. Local storage is used to store daily game progress and optional local stats. If you have privacy concerns, please contact us or open an issue.

---

## 🧾 License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE).

---

## 📬 Contact

Questions, ideas or issues — email: **drimozbe@gmail.com**  
Repo: https://github.com/DrimoZ/WGames

---

> _“Craft tiny moments of joy — quick games that are beautiful, fair, and easy to pick up.”_