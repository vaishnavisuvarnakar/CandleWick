# CandleWick 🕯️

A private, cozy journaling app with client-side encryption and gentle AI reflections. Designed to feel like a quiet study at night with an armchair and a burning candle.

---

## 🏛️ Architecture & Client-Only Design

- **Static Single-Page Application (SPA):** Built with React 19, TypeScript, and Vite. Designed to be deployed effortlessly to static hosting platforms such as Vercel, Cloudflare Pages, or GitHub Pages.
- **Zero-Server Architecture:** There is no backend, no Express server, and no third-party database. Everything runs directly inside your browser.
- **Local Persistence via IndexedDB (Dexie.js):** All journal entries are stored inside browser-managed IndexedDB tables. Data never leaves your device unless you choose to export it.

---

## 🔒 Privacy & Cryptography Design

- **Client-Side Encryption at Rest (AES-GCM 256-bit):**
  - Your master passphrase derives a high-security cryptographic key using the Web Crypto API (`crypto.subtle`) via **PBKDF2** with **100,000 iterations**, SHA-256, and a cryptographically random 16-byte salt.
  - Every single journal entry, including writing text and generated reflection analysis, is encrypted using **AES-GCM** with a unique 12-byte initialization vector (IV) per entry.
  - No master key or recovery backdoor exists. If the passphrase is forgotten, encrypted entries cannot be decrypted.
- **Bring-Your-Own-Key (BYOK) AI Reflections:**
  - Uses the official `@google/genai` TypeScript SDK directly from the client.
  - The model name is strictly maintained in a single constant (`gemini-3.8-flash`).
  - By default, your Gemini API key is retained only in memory and `sessionStorage`.
  - When you enable *"Remember my API key on this device"*, the key is encrypted at rest using your passphrase-derived AES-GCM key before touching storage.
  - **No telemetry, tracking, or analytics:** No cookies, trackers, or telemetry scripts are included.

---

## 🤖 Two-Step AI Reflection Flow

1. **Step 1: Emotional Classifier (`classifyEntry`)**
   - Evaluates the user's entry using structured JSON output (`responseMimeType: "application/json"`).
   - Classifies the writing into one of five distinct modes:
     - `listen`: Venting, wanting to be heard, not asking for answers.
     - `advise`: Explicitly or implicitly asking what to do.
     - `celebrate`: Good news, milestones, or achievements.
     - `process`: Working through conflicting thoughts or questions.
     - `concern`: Signs of serious crisis or distress.
   - Validated at runtime using **Zod** schema parsing, falling back smoothly to `listen` on any schema ambiguity.

2. **Step 2: Mode-Specific Reflection (`generateReflection`)**
   - Applies dedicated system instructions per mode:
     - `listen`: Reflects back feeling with warm care; no advice, no toxic positivity or silver linings.
     - `advise`: Acknowledges first, then offers 2–3 gentle, concrete suggestions framed as possibilities.
     - `celebrate`: Specific, genuine cheer for the accomplishments shared.
     - `process`: Identifies underlying themes and asks one or two open-ended questions.
     - `concern`: Drops the journaling persona; offers calm care, safety guidance, and encouragement to connect with local emergency services or a trusted loved one (without fabricating numbers).
   - All reflections are kept under 180 words with plain, warm human language.

3. **Weekly Fireside Reflection (`generateWeeklyReflection`)**
   - Analyzes entries from the past 7 days (requiring at least 2 entries).
   - Produces a concise synthesis (under 220 words) detailing recurring themes, what brought peace, and one gentle thought for the week ahead.

---

## 🎨 Design & Aesthetic Elements

- **Palette:**
  - Espresso background (`#1F120C`)
  - Deep Mahogany (`#3B2016`)
  - Warm Rust (`#8C3B1E`)
  - Burnt Orange (`#C8621F`)
  - Candle Amber Glow (`#E8A33D`)
  - Ruled Parchment paper (`#F3E6D0`)
  - Soft Ink typography (`#2A1A12`)
- **Typography:**
  - **Lora** (Serif) loaded from Google Fonts for introspective journal pages, reflections, and headings.
  - **Inter** (Sans-serif) for clean, accessible navigation and controls.
- **Animations & Visual Details:**
  - Pure CSS slow-drifting ember and dust-mote particles in warm oranges (automatically disabled under `prefers-reduced-motion`).
  - Animated SVG candle flame with organic flicker.
  - Custom flat-vector SVG illustration of a cozy armchair beside a lit fireplace with a sleeping kitten.
  - Two-page notebook spread on desktop with central spine shadow and lined ruled parchment.
  - 3D page flip animation (`rotateY`) transitioning between reflection states.

---

## 🧪 Benchmark & Evaluation (/dev/eval)

CandleWick contains a benchmark suite located in `/src/lib/evals.ts` comprising 20 labeled test entries across all 5 emotional modes.
You can run live classifier benchmarks at any time via:
- Navigating to `/dev/eval` or appending `#dev-eval` in the address bar.
- Or clicking the **Dev / Benchmark Evaluator** link in the Settings modal.
The suite outputs real-time accuracy percentages, confusion matrices, and latency (in milliseconds).

---

## 📚 Open-Source Libraries Used

- [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) & [Tailwind CSS v4](https://tailwindcss.com/)
- [Dexie.js](https://dexie.org/) — Reactive IndexedDB wrapper
- [@google/genai](https://www.npmjs.com/package/@google/genai) — Official Google Gen AI SDK
- [Zod](https://zod.dev/) — Schema validation
- [Recharts](https://recharts.org/) — Composable chart primitives
- [Lucide React](https://lucide.dev/) — Clean, cozy icons
