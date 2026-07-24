#  CASHCRUSH

> An AI-powered personal finance companion for students that combines expense tracking, OCR receipt scanning, intelligent budgeting, savings goals, rewards, and analytics to promote smarter financial habits.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)]()
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)]()
[![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite)]()
[![Chart.js](https://img.shields.io/badge/Chart.js-Analytics-FF6384?logo=chartdotjs)]()
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()

CASHCRUSH is a modern Progressive Web App (PWA) built using **React**, **Supabase**, and **PostgreSQL**. It helps students automatically organize expenses, predict overspending, track recurring payments, manage savings goals, earn virtual rewards, and receive personalized financial insights—all through an intuitive, responsive interface.

---

##  Feature Highlights

###  Smart Expense Management
- Add, edit, delete, search, and filter expenses
- Category-based tracking
- Monthly budget management
- CSV import from bank statements
- CSV export

###  OCR Receipt Scanner
- Upload receipt images
- Extract merchant, amount, and purchase date using **Tesseract.js**
- Auto-fill expense forms

###  AI Financial Coach
- Personalized spending insights
- Budget risk alerts
- Month-end expense prediction
- Context-aware responses (e.g., "Can I order pizza?")

###  Analytics Dashboard
- Interactive Pie & Bar Charts
- Monthly trends
- Budget utilization
- Printable reports

###  Savings & Rewards
- Savings Goals
- Recurring Expenses
- Cashback Vault
- Virtual Coins
- Coupon Rewards
- Spending Streaks
- Achievement Badges

###  Modern User Experience
- Progressive Web App (PWA)
- Dark / Light Theme
- Glassmorphism UI
- Responsive Design
- Onboarding Wizard

###  Security
- Supabase Authentication
- Email Verification
- Protected Routes
- Row Level Security (RLS)

#  Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React 18, Vite, React Router |
| Backend | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| OCR | Tesseract.js |
| Charts | Chart.js |
| CSV Parsing | PapaParse |
| Styling | HTML5, CSS3, Glassmorphism UI |
| PWA | Manifest, Service Worker |


##  System Architecture

##  Technical Implementations

### 🔄 Offline Synchronization Queue
Rather than basic static file caching, CASHCRUSH implements a **reactive offline sync engine**:
- **Offline Writes**: Transactions created when offline are stored locally in the browser's `localStorage` queue.
- **Online Sync**: The app listens for the window `online` event. Once internet connectivity is restored, the queue is uploaded to Supabase, and a toast confirms synchronization.

### 🧠 Intelligent Spending Coach
Insights are generated using deterministic rule engines and predictive calculations:
- **Heuristic Advice**: Automatically scans category balances and compares them with budget limits to generate recommendations (e.g. "Can I buy pizza?").
- **Month-End Projections**: Uses the average daily spend from current records to predict month-end totals and flag overspending risks.

### 📊 Bank CSV Import Engine
Allows secure statement parsing:
- **Client-Side Parsing**: Leverages **PapaParse** to read raw bank CSV transaction logs on the client.
- **Heuristic Auto-Categorization**: Scans merchant descriptions and automatically assigns the correct categories before database insertion.

```
                 React + Vite
                      │
                      ▼
               Supabase Backend
        ┌───────────┼───────────┐
        ▼           ▼           ▼
 Authentication  PostgreSQL   Storage
                      │
        ┌─────────────┼──────────────┐
        ▼             ▼              ▼
 Expense Engine   AI Insights   OCR Scanner
        │
        ▼
 Rewards Engine
        │
        ▼
 Dashboard & Reports
```

#  Getting Started

## 1️ Clone the Repository

```bash
git clone https://github.com/Ariha1510/CASHCRUSH.git

cd CASHCRUSH/client
```

---

## 2️ Install Dependencies

```bash
npm install
```

---

## 3️ Configure Supabase

Create a `.env` file inside the `client` directory.

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

---

## 4 Start Development Server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

---

# 📈 Core Modules

- Dashboard
- Expense Tracker
- Budget Manager
- Savings Goals
- Recurring Expenses
- Reports & Analytics
- OCR Receipt Scanner
- AI Spending Insights
- Gamification
- User Profile
- Authentication

---

#  Security

- Row Level Security (RLS)
- Protected Routes
- Secure Authentication
- Environment Variable Configuration
- User-isolated Data Access

---

#  Future Enhancements

- AI Chat Assistant
- PDF Report Export
- Shared Budgets
- Expense Splitting
- Multi-language Support
- Push Notifications
- Offline Data Synchronization

---

##  Why CASHCRUSH?

Unlike traditional expense trackers, CASHCRUSH combines budgeting, AI-powered financial guidance, OCR receipt scanning, savings management, gamification, and a virtual rewards ecosystem into a single platform designed specifically for students.

The application encourages responsible spending through predictive analytics, intelligent alerts, and positive reinforcement instead of simply recording transactions.

---

##  If you found this project useful, consider giving it a star!
