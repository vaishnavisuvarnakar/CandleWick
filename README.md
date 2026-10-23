# CandleWick 🕯️

**A private, cozy journal that knows when to listen and when to advise.**

Write freely: no prompts, no streaks, no mood trackers. When you want a reflection, CandleWick first works out what you need (to be heard, to get advice, to celebrate, or to think something through) and responds in that mode. Designed to feel like a quiet study at night with an armchair and a burning candle.

**Live demo:** https://candlewick-beta.vercel.app/ · **Built for:** PromptWars

---

## Why CandleWick

Most journaling apps either just store entries, or answer everything with the same cheerful advice. Many push streaks and progress charts that make people feel guilty and quit, and they ask you to trust a company with your most personal writing. CandleWick takes the opposite approach: one calm blank page, an AI that sometimes chooses *not* to give advice, and no server that could ever see or sell your entries.

## Features

- Free-form two-page notebook with autosave
- **Reflect:** an AI that classifies what you need, then responds accordingly, shown on the facing page with a page-turn animation
- **Weekly reflection:** a brief summary of your last 7 days, in a popup
- Light dashboard: entries per day and "what you needed lately", with no goals and no streaks
- Markdown export, native sharing, and encrypted backup
- Crisis-aware: if an entry suggests serious distress, the AI drops the journaling persona and points to trusted people and local emergency services

---

## 🏛️ Architecture

- **Static SPA:** React 19, TypeScript, Vite, Tailwind CSS v4. Deploys to any static host (Vercel, Cloudflare Pages, GitHub Pages).
- **Zero-server:** no backend, no Express server, no third-party database. Everything runs in the browser.
- **Local persistence:** entries are stored in IndexedDB via Dexie.js.

## 🔒 Privacy & Security

- **Client-side encryption at rest (AES-GCM 256-bit):** your passphrase derives a key via the Web Crypto API using **PBKDF2** (100,000 iterations, SHA-256, random 16-byte salt). Every entry, including its generated reflection, is encrypted with a unique 12-byte IV. There is no recovery backdoor: if you forget your passphrase, entries cannot be decrypted.
- **Bring-your-own-key (BYOK):** the app uses the official `@google/genai` SDK directly from the browser with *your* Gemini API key. By default the key stays in memory and `sessionStorage`; with "Remember my API key on this device", it is encrypted with your passphrase-derived key before storage.
- **No telemetry, analytics, or cookies.** Apart from the Gemini API, the only third-party request is loading fonts from Google Fonts.
- **Validated I/O:** model output is schema-validated with Zod before use, and user text is rendered as text, never HTML.
- **Honest limitation:** entries stay on your device, **except** when you click Reflect: that entry (or the last 7 days, for the weekly reflection) is sent to Google's Gemini API using your own key, so Google's API terms apply to that content. Check the current Gemini API terms for how data is handled on your plan.
- The repo contains no secrets, and the app needs no environment variables.

## 🤖 Two-step AI reflection

1. **Classify (`classifyEntry`):** Gemini returns structured JSON (`responseMimeType: "application/json"`) choosing one mode, validated with Zod and falling back to `listen` on any ambiguity:
   - `listen`: venting, wants to be heard
   - `advise`: asking what to do
   - `celebrate`: good news or milestones
   - `process`: working through conflicting thoughts
   - `concern`: signs of serious distress
2. **Respond (`generateReflection`):** a dedicated system instruction per mode, under 180 words. `listen` offers no advice and no silver linings; `advise` acknowledges first, then gives 2 to 3 gentle options; `celebrate` gives specific cheer; `process` reflects themes and asks one or two questions; `concern` drops the persona, offers calm care and encourages contacting a trusted person or local emergency services, without inventing phone numbers. All modes validate feelings without endorsing harmful beliefs, never flatter, never diagnose, and never claim to be a therapist.
3. **Weekly reflection (`generateWeeklyReflection`):** analyzes entries from the last 7 days (minimum 2) and writes under 220 words on recurring themes, what brought peace, and one gentle thought for the week ahead.

The model name lives in a single constant, so it is easy to update.

## 🧪 Benchmark & evaluation

`src/lib/evals.ts` holds 20 labeled sample entries across all five modes. Run it at `/dev/eval`, via `#dev-eval`, or from the Settings modal. Results from our run:

- Classifier accuracy: **[X/20, XX%]**
- Average classification latency: **[X ms]**
- Average full reflection latency: **[X s]**

## 🎯 How it maps to the judging criteria

| Criterion | How CandleWick addresses it |
|---|---|
| **Security** | Local-first, no server, AES-GCM encryption at rest, BYOK, no secrets in repo, schema-validated model output |
| **Efficiency** | Two small model calls per reflection, a Flash-class model, instant local reads and writes, static CDN hosting |
| **Technology** | Two-step agentic flow (classify, then mode-specific response), structured output, runtime validation, WebCrypto |
| **Performance** | Measured classifier accuracy and latency (see above) |
| **Google technology** | Gemini API via `@google/genai`, built in Google AI Studio, Google Fonts |

## 🎨 Design

- **Palette:** espresso `#1F120C`, mahogany `#3B2016`, rust `#8C3B1E`, burnt orange `#C8621F`, candle amber `#E8A33D`, parchment `#F3E6D0`, ink `#2A1A12`
- **Typography:** Lora (serif) for journal pages and headings, Inter for UI
- Pure-CSS drifting embers (disabled under `prefers-reduced-motion`), an animated SVG candle flame, a flat-vector armchair-and-fireplace illustration, a two-page notebook with a spine shadow, and a 3D page-flip between writing and reflection

## 🚀 Run locally

```bash
git clone https://github.com/[your-username]/CandleWick.git
cd CandleWick
npm install
npm run dev
```

Open the local address, paste your own Gemini API key from [Google AI Studio](https://aistudio.google.com/), and set a passphrase.

## ☁️ Deploy

Import the repo in Vercel and keep the Vite defaults (build `npm run build`, output `dist`). No environment variables needed.

## 📚 Disclosures

- **AI-assisted development:** the app was generated and iterated with Google AI Studio (Gemini), using prompts written with help from Claude (Anthropic), then reviewed and tested by the author.
- **Open-source libraries:** React, TypeScript, Vite, Tailwind CSS, Dexie.js, `@google/genai`, Zod, Recharts, Lucide React (see `package.json` for versions).
- **Fonts:** Lora and Inter via Google Fonts (SIL Open Font License).
- **Illustration:** [created by the author / generated with X, license].

## 🗺️ Roadmap

- Optional end-to-end encrypted sync (ciphertext only) via Firebase
- "Preview what will be sent" before each reflection, with optional name redaction
- Self-hosted fonts and full offline PWA support

## ⚠️ Disclaimer

CandleWick is a reflective journaling tool, not therapy or medical advice. If you are in crisis, please contact a trusted person or your local emergency services.

---

*Made by Vaishnavi Suvarnakar*
