# 💸 CASHLENS

> An intelligent personal finance companion for students that combines expense tracking, OCR receipt scanning, predictive budgeting, savings goals, rewards, and analytics to promote smarter financial habits.

🌐 [Live Demo](https://cashlens.vercel.app) • 📄 [Database Schema](file:///d:/CASHLENS/database.sql) • ⭐ Star this repository

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)]()
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)]()
[![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white)]()
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-F024B6?logo=framer&logoColor=white)]()
[![Chart.js](https://img.shields.io/badge/Chart.js-Analytics-FF6384?logo=chartdotjs&logoColor=white)]()
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()

---

## 🚀 Why CASHLENS?

Unlike traditional, tedious budget trackers, **CASHLENS** is built specifically for students. It combines rule-based predictive budgeting, local WebAssembly OCR receipt scanning, virtual cashback rewards, and interactive analytics to make financial discipline gamified, educational, and secure.

---

## 📊 Key Statistics & Scope

- **Authentication**: Supabase Auth (JWT protected)
- **Database**: PostgreSQL with Row-Level Security (RLS)
- **PWA Status**: 100% installable offline-capable web application
- **OCR Engine**: Client-side Tesseract.js (no image uploads)
- **Chart Analytics**: Interactive Category and Trend charts
- **Aesthetic Backdrop**: Framer Motion dynamic aurora blobs with custom grid & analytics watermark graphics.

---

## ✨ Features

### 🏠 Interactive Dashboard & Empty States
- **Aesthetic Greeting Hero**: Dynamically greets the user (e.g. `Good Evening, Ariha 👋`) with monthly remaining budget status.
- **Unified Empty Onboarding State**: Welcoming layout for first-time sign-ins featuring interactive checklist guides and AI Coaching prompts across both dark and light modes.
- **Sleek Navbar**: Solid dark-themed responsive navigation banner housing custom logo assets, active link indication, notifications, profile status, and quick theme toggle.

### 🖼️ Premium Visual Engine
- **Animated Splash Screen**: Features a 5-second entry splash loader with app branding, taglines, and progress indicators.
- **Aurora Background**: Implements dynamic Framer Motion background blobs layered with glowing financial grids, line graphs, and subtle Rupee (`₹`) symbols integrated into the backdrop for both light and dark themes.

### 📝 Expense & Budget Management
- **Transactions & Wallets**: Track category budgets, cash/bank/UPI accounts, transfers, recurring expenses, and EMIs.
- **Statement Importer**: Import bank statement CSV files with automatic categorization heuristics.
- **Merchant & Payment Fields**: Track specific vendors (e.g. Swiggy, Amazon) and modes (UPI, Cards, Cash).

### 📷 OCR Receipt Scanning
- Snap bill photos to instantly extract merchant names, transaction dates, and total payable amounts using local client-side WebAssembly OCR.

### 🧠 Intelligent Budget Coach
- **Heuristic Advice**: Real-time spending suggestions (e.g., pizza affordability analysis).
- **Projections**: Predicts month-end totals based on average daily spending trends.
- **Budget Thresholds**: Warns users at 60% and 90% budget utilization.

### 🎁 Gamification & Rewards
- **Cashback Vault**: Accumulate virtual coins through healthy savings habits.
- **Achievement Badges**: Unlock milestones (e.g., Budget Guard, Savings Master).
- **Coupon Vouchers**: Claim virtual student deals (e.g. Domino's coupons).

### ⚙️ Account Management
- **Streamlined Deletion**: Renamed settings section to **ACCOUNT**, offering single-click profile termination with custom forms prompting for deletion reasons.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router, Framer Motion, Lucide Icons
- **Backend & Auth**: Supabase, PostgreSQL
- **Data & Charts**: Chart.js, PapaParse, Tesseract.js
- **Styling**: Vanilla CSS, Neon Glassmorphism UI

---

## 📂 Project Structure

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

## 🔄 System Flow

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

## 🔬 Technical Implementations

### 1. Offline Synchronization Queue
- **Offline Writes**: Transactions created when offline are stored locally in the browser's `localStorage` queue.
- **Online Sync**: Uses the browser's window `online` event listener to upload pending changes to Supabase once connectivity returns.

### 2. Secure Data Isolation
- Enforces strict PostgreSQL **Row-Level Security (RLS)**. No user can read, insert, or write rows belonging to another authenticated session ID.

---

## 📦 Getting Started

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
Deploy the generated `dist/` directory to **Vercel** or **Netlify** with automatic SSL/HTTPS.

---

## 🤝 Acknowledgements

- **Supabase** for DB infrastructure & Auth.
- **Tesseract.js** for client-side OCR.
- **Chart.js** for interactive analytics.
- **PapaParse** for statement CSV parsing.
- **Framer Motion** for premium interactive animations.
