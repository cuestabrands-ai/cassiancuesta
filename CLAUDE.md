# Cassian's Genius App — Claude Code Context

## Who this is for
This is a personal learning app for Cassian Cuesta, age 6, IQ ~150, 2e (twice exceptional).
Built by his father RC (cuestabrands@gmail.com) using Claude Code + Cowork.

## Cassian's Profile
- **Math:** Year 2+ level — treat as 8–10 year old for numbers, patterns, arithmetic
- **Chess:** Beginner — needs clear, simple language
- **Reading:** Age-appropriate (6 years old)
- **Languages:** English primary, learning Spanish + Arabic
- **Interests:** Big numbers, primes, patterns, Numberblocks, chess, piano, Bitcoin/economics, robotics
- **2e notes:** Gifted intellectually, age-level emotionally. Short focus bursts (8–12 min). Hyperfocus on math. Never talk down to him — he notices.

## Project Structure
| File | Purpose |
|------|---------|
| `index.html` | Home screen (Apple-style grid of 8 app cards) |
| `numberblocks.html` | Number explorer — TurboWarp-style Numberblocks character, clubs, EXP mode |
| `chess.html` | Chess: Piece School + Puzzles + Play vs Human/Cosmo (minimax AI) |
| `games.html` | Math games (Number Quest, Speed Math, Pattern Wizard) |
| `cosmo.html` | COSMO AI tutor — Claude Haiku via Cloudflare Worker |
| `bitcoin.html` | Bitcoin/economics learn cards |
| `puzzles.html` | Math puzzles |
| `jokes.html` | Smart jokes |
| `books.html` | 100 Cool Things interactive flipbook library (TC-08) |
| `learning-path.html` | Learning progress tracker |
| `focus.html` | Focus & Flow Trainer — Pomodoro adapted for 2e kids (TC-10) |
| `sw.js` | Service worker — offline-first PWA |
| `manifest.json` | PWA manifest |
| `cosmo-hints.js` | Shared utility: calls COSMO AI hint via Cloudflare Worker |
| `cassian-profile.js` | Adaptive learning profile — per-domain difficulty levels (TC-11) |
| `CLAUDE.md` | This file |
| `TC_SPECS.md` | All Task Cards (TC-01 through TC-11) — feed one at a time to Claude Code |

## Design System
- **Background:** `#0a0a1a` (very dark navy)
- **Cards:** `rgba(255,255,255,0.06)` glass + `backdrop-filter: blur(20px)`
- **Borders:** `1px solid rgba(255,255,255,0.08)`
- **Hover border:** `rgba(255,255,255,0.18)`
- **Accent teal:** `#00d4ff`
- **Accent purple:** `#8b5cf6` / `#5533DD`
- **Font:** `system-ui` / SF Pro feel — or Nunito from Google Fonts
- **All pages are single HTML files** — CSS and JS inline, no build step, no npm

## Bottom Nav (required on ALL pages)
```html
<nav class="app-nav">
  <a href="index.html" class="nav-btn"><span class="nav-icon">🏠</span><span class="nav-label">Home</span></a>
  <a href="numberblocks.html" class="nav-btn"><span class="nav-icon">🔢</span><span class="nav-label">Numbers</span></a>
  <a href="games.html" class="nav-btn"><span class="nav-icon">🎮</span><span class="nav-label">Games</span></a>
  <a href="chess.html" class="nav-btn"><span class="nav-icon">♟️</span><span class="nav-label">Chess</span></a>
  <a href="cosmo.html" class="nav-btn"><span class="nav-icon">🤖</span><span class="nav-label">Cosmo</span></a>
</nav>
```
Add `.active` class to the button matching the current page.

## Required on ALL pages
```html
<!-- In <head> -->
<link rel="manifest" href="/manifest.json">

<!-- Before </body> -->
<script>if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');</script>
```

## localStorage Keys (do not conflict between pages)
| Key | Used by | Purpose |
|-----|---------|---------|
| `cassian_profile` | cassian-profile.js | Per-domain difficulty levels |
| `cosmo_worker_url` | cosmo.html, cosmo-hints.js | Cloudflare Worker URL for COSMO AI |
| `cosmo_journal` | cosmo.html | Daily learning journal entries |
| `chess_game` | chess.html | Chess game state |
| `games_diff_${name}` | games.html | Per-game difficulty (legacy — TC-11 replaces this) |
| `books_seen` | books.html | Set of flipped book cards |
| `focus_sessions` | focus.html | Focus session history |
| `xp_total` | index.html | Total XP across all activities |
| `nb_n` | numberblocks.html | Last viewed number |

## Conventions
- No external CSS/JS dependencies — everything inline OR from `https://cdnjs.cloudflare.com`
- No API keys in frontend — all AI calls go through Cloudflare Worker at `cosmo_worker_url`
- Adaptive difficulty: use `CassianProfile.get(domain)` / `CassianProfile.recordResult(domain, result)` from `cassian-profile.js` — not raw localStorage
- Trilingual support: English primary, Spanish + Arabic toggleable
- iPad-first layout (768px viewport), also works on phone

## AI (COSMO) Integration
- Worker URL stored in `localStorage('cosmo_worker_url')`
- POST to `{workerUrl}/chat` with body: `{ messages, system, model: "claude-haiku-4-5-20251001", max_tokens: 1024 }`
- If no Worker URL is set, all AI features silently hide — app works fully offline without AI
- Shared hint utility: `cosmo-hints.js` exposes `getCosmoHint(contextString)` — returns text or null

## TC Priority Order (for Claude Code)
1. **TC-09** — CLAUDE.md ✅ Done
2. **TC-01** — chess.html full game (most requested)
3. **TC-11** — cassian-profile.js adaptive profile ✅ Done
4. **TC-02** — cosmo.html AI tutor
5. **TC-10** — focus.html Focus & Flow Trainer
6. **TC-07** — nav consistency pass (quick win)
7. **TC-06** — sw.js cache update (quick win)
8. **TC-03** — cosmo-hints.js intelligence layer ✅ Done
9. **TC-04** — games.html adaptive difficulty
10. **TC-05** — index.html Apple redesign
11. **TC-08** — books.html flipbook library

Full TC specs are in `TC_SPECS.md`.
