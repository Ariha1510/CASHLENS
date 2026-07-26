# <img src="client/src/assets/logo.png" width="38" align="center" style="vertical-align: middle; margin-right: 8px;" /> CASHLENS

> **Spend Smart. Save Smarter.** — An intelligent personal finance companion for students that combines expense tracking, OCR receipt scanning, predictive budgeting, savings goals, rewards, and analytics to promote smarter financial habits.

 **[Live Deployment Demo](https://cashlens.vercel.app)** • 📄 **[Database Schema](file:///d:/CASHLENS/database.sql)** • ⭐ **Star this repository**

---

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Framer_Motion-Animations-F024B6?logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Chart.js-Analytics-FF6384?logo=chartdotjs&logoColor=white" alt="Chart.js" />
  <img src="https://img.shields.io/badge/PWA-Ready-5A0FC8" alt="PWA Ready" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

---

##  The Problem

Many students struggle to understand where their allowance goes each month. Traditional expense trackers simply record transactions but rarely help users improve their financial habits.

**CASHLENS** bridges that gap by combining interactive budgeting, OCR receipt scanning, predictive insights, gamified rewards, and a smart financial assistant into one seamless, premium-grade platform.

---

##  Key Modules

| Module | Metric / Stack | Purpose |
| :--- | :--- | :--- |
| **Modules** | 12+ Core Features | Complete personal finance suite |
| **Authentication** | Supabase Auth (JWT) | Secure token-based user isolation |
| **OCR Engine** | Tesseract.js (WASM) | Client-side text extraction (no uploads) |
| **AI Advisor** | Heuristic spend analysis | Real-time budgeting suggestions |
| **Charts** | Chart.js | Interactive Category and Trend charts |
| **Database** | PostgreSQL | Row-Level Security (RLS) data confinement |
| **Mobile Responsive**| 100% Mobile Ready | Sleek, adaptive layout for smartphones |

---

##  Skim-Ready Feature Highlights

###  Onboarding & Dashboard
* **Dynamic Welcome Hero**: Greets the user dynamically (e.g. `Good Evening, Ariha 👋`) with monthly remaining budget status.
* **Unified Onboarding empty state**: Step-by-step guides, interactive checklists, and AI Coaching prompts across both dark and light modes.
* **Sleek Navbar**: Solid dark-themed sticky navbar integrating app logo assets, notifications drawer, and a quick theme toggle.

###  OCR Receipt Scanning
* **Local WebAssembly Scan**: Take photos of receipts to instantly extract vendor, date, and transaction totals completely client-side.

###  Spend Projections & AI Coach
* **Month-End Forecast**: Automatically predicts total month-end spending based on current daily averages.
* **Threshold Alerts**: Color-coded warnings trigger at 60% and 90% budget utilization.

###  Gamification & Rewards
* **Cashback Vault**: Earn and accumulate virtual coins by practicing positive savings habits.
* **Achievements**: Unlock milestones like *Budget Guard* and *Savings Master*.
* **Vouchers**: Claim student deals (e.g., Domino's coupons) using saved coins.

###  CSV Statement Importer
* **Instant Import**: Upload bank statement CSV/Excel files with automatic category heuristics detection.

---

##  Tech Stack

* **Frontend**: React 18, Vite, React Router, Framer Motion, Lucide Icons
* **Backend & Database**: Supabase (Backend-as-a-Service), PostgreSQL
* **Data Processing**: Chart.js (Data Visualizations), PapaParse (CSV Parsing), Tesseract.js (WASM OCR)
* **Styling**: Vanilla CSS, Neon Glassmorphism design tokens

---

##  Project Structure

```text
client/                         # React Frontend
    assets/                     # Static media, logo, and fintech backgrounds
    components/                 # Reusable widgets (AIChatbot, AuroraBackground, Navbar, etc.)
    pages/                      # Core screens (Dashboard, Expenses, Reports, Profile, Login)
    lib/                        # Supabase client instance
    styles/                     # Glassmorphism design system tokens
database.sql                    # PostgreSQL DB schema with RLS policies
```

---

##  System Flow

```text
User Action
    │
    ▼
React + Vite UI
    │
    ▼
Supabase Authentication
    │
    ▼
PostgreSQL Database
    │
    ├─ RLS Policies (User Isolation)
    │
    ▼
Core Modules
    ├── Heuristic Spend Coach
    ├── WebAssembly OCR Scanner
    ├── CSV Import Engine
    ├── Framer Motion Aurora Engine
    └── Gamified Cashback Vault
```

---

##  Portfolio Highlights

- **Offline Synchronization Queue**: Transactions created when offline are stored locally in the browser's `localStorage` queue. Once internet connectivity returns, it automatically uploads pending transactions.
- **Secure Row-Level Security (RLS)**: Enforces strict PostgreSQL RLS policies at the database layer. No user can read, insert, or write rows belonging to another authenticated session ID.

---

##  Roadmap & Future Scope

- [ ] **Open Banking API Integration**: Direct link to live bank accounts for real-time transaction syncing.
- [ ] **Push Notifications**: Instant budget alerts on mobile devices.
- [ ] **Expense Splitting**: Easy bill splitting with college peers.
- [ ] **Interactive Chatbot**: AI chat interface powered by LLM agents.
- [ ] **PDF Statement Reports**: Download summary reports for parental allowances.
- [ ] **Multi-currency support**: Seamless currency conversion.

---

##  Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Ariha1510/CASHLENS.git
cd CASHLENS/client
npm install
```

### 2. Configure Environment
Create a `.env` file in the `client` directory:
```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 3. Run Locally
```bash
npm run dev
```

### 4. Build & Deploy
```bash
npm run build
```

---

##  Acknowledgements

- **Supabase** for DB infrastructure & Auth.
- **Tesseract.js** for client-side OCR.
- **Chart.js** for interactive analytics.
- **PapaParse** for statement CSV parsing.
- **Framer Motion** for premium interactive animations.
