# Signal — AI Investment Research Terminal

A personal investment research dashboard powered by Claude and live RSS feeds. Built to surface non-consensus intelligence faster than a Bloomberg terminal.

![Stack](https://img.shields.io/badge/React-19-blue) ![Stack](https://img.shields.io/badge/Vite-7-purple) ![Stack](https://img.shields.io/badge/Claude-Sonnet_4-orange) ![Stack](https://img.shields.io/badge/Deployed-Vercel-black)

---

## Features

### Portfolio Tracker
Track open positions with live P&L, cost basis, and 1-day price changes. Click any position to pull a full AI-generated intelligence brief on that stock.

### Market Intelligence (per stock)
For each holding, the app fetches live headlines across 12+ RSS feeds and sends them to Claude alongside the ticker. Claude returns structured analysis with:
- Direct vs. indirect factor classification
- Sentiment tagging (positive / neutral / negative)
- Linked sources for every finding

### Daily Trend Analyser
Scans curated niche feeds (Doomberg, Epsilon Theory, The Diff, Reddit investing communities, Hacker News, Reuters, CNBC, BBC) and identifies one contrarian macro theme per session — the kind of signal that doesn't appear in mainstream financial media yet.

### Interests Watchlist
Monitor up to 12 custom macro / thematic areas (geopolitical risk, AI infrastructure, energy transition, etc.). Each card fetches live news and asks Claude to surface the 4 most investment-relevant developments from the last 7–30 days.

### Ask Roy
An AI analyst modelled on a Bridgewater-style generalist — sceptical, macro-aware, direct. Roy fetches live Google News results for your question before answering, so responses reflect current events rather than training data alone. Roy explicitly flags uncertainty when he lacks current information.

---

## Architecture

```
Browser (React)
    │
    ├── Google News RSS (7d / 30d search window)
    ├── 12 named RSS feeds (via /api/rss serverless proxy)
    │
    └── /api/claude  (Vercel serverless function)
            │
            └── Anthropic API  ← ANTHROPIC_API_KEY (server-side only)
```

**Key decisions:**
- **API key never touches the browser.** All Claude calls go through a Vercel serverless function (`/api/claude.js`) that reads `ANTHROPIC_API_KEY` from environment variables server-side.
- **Optional password gate.** Set `SITE_PASSWORD` in Vercel env vars to protect the deployment behind a session password checked server-side.
- **No database.** Portfolio positions and caches live in `localStorage`. Fast, zero-ops, privacy-preserving.
- **RSS proxied server-side.** A second serverless function (`/api/rss.js`) proxies all RSS fetches to avoid browser CORS restrictions and keep feed URLs off the client.
- **1-hour caching with version busting.** A `CACHE_VERSION` constant in the client invalidates stale caches on deploy.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 19, Vite 7 |
| Charts | Recharts |
| AI | Anthropic Claude Sonnet 4 (`claude-sonnet-4-20250514`) |
| News | Google News RSS + 12 curated feeds |
| Hosting | Vercel (serverless functions for API proxy) |

---

## Running Locally

```bash
npm install
```

Create a `.env.local` file:

```
ANTHROPIC_API_KEY=sk-ant-...
# SITE_PASSWORD=optional
```

```bash
npm run dev
```

The dev server runs on `http://localhost:5173`. The Vite dev server does not run the Vercel serverless functions — for local testing of the API proxy, use `vercel dev` instead.

---

## Deploying to Vercel

1. Push to GitHub and import the repo in [vercel.com](https://vercel.com)
2. Set `ANTHROPIC_API_KEY` (and optionally `SITE_PASSWORD`) as environment variables
3. Deploy — Vercel auto-detects the `/api` folder and deploys the functions

---

## Project Structure

```
├── src/
│   └── App.jsx          # All UI components and client-side logic (~3000 lines)
├── api/
│   ├── claude.js        # Serverless proxy — forwards requests to Anthropic API
│   └── rss.js           # Serverless proxy — fetches RSS feeds server-side
├── public/
├── vite.config.js
└── vercel.json
```
