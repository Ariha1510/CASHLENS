# 💸 CASHCRUSH

> A modern, AI-powered personal finance and expense management application built for students.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)]()
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)]()
[![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite)]()
[![Chart.js](https://img.shields.io/badge/Chart.js-Analytics-FF6384?logo=chartdotjs)]()
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()

CASHCRUSH is a full-featured student expense management platform that helps users track daily spending, manage budgets, analyze financial habits, and achieve savings goals through AI-powered insights, interactive analytics, OCR receipt scanning, and gamification.

---

## ✨ Features

### 💰 Expense Management
- Add, edit, delete, and search expenses
- Categorize transactions
- Sort and filter expenses
- Export transaction history to CSV

### 📊 Smart Analytics
- Interactive Pie & Bar Charts
- Monthly spending trends
- Budget utilization tracking
- Printable reports
- Month-end spending prediction

### 🤖 AI Spending Insights
- Personalized spending recommendations
- Budget risk alerts
- Category-wise expenditure analysis
- Spending habit summaries

### 📸 OCR Receipt Scanner
- Upload receipt images
- Automatically extract:
  - Merchant
  - Amount
  - Purchase Date
- Auto-fill expense forms using **Tesseract.js**

### 🎯 Savings Goals
- Create multiple savings goals
- Track progress visually
- Monitor remaining target amount

### 🔄 Recurring Expenses
Manage subscriptions and recurring payments including:
- Rent
- Netflix
- Gym
- Mobile Recharge
- Other recurring bills

### 🏆 Gamification
Earn badges and maintain spending streaks to encourage healthy financial habits.

### 👤 Authentication
- Secure Email Authentication
- Email Verification
- Protected Routes
- User-specific data using Supabase Authentication

### 📱 Progressive Web App
- Installable on desktop and mobile
- Responsive interface
- Glassmorphism UI
- Dark / Light Theme

---

# 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React 18, Vite, React Router |
| Backend | Supabase |
| Database | PostgreSQL (Supabase) |
| Authentication | Supabase Auth |
| Charts | Chart.js, react-chartjs-2 |
| OCR | Tesseract.js |
| Styling | HTML5, CSS3, Glassmorphism UI |
| Data Export | PapaParse |
| Deployment | Vercel / Netlify *(recommended)* |

---

# 📂 Project Structure

```
CASHCRUSH
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── styles
│   │   └── lib
│   ├── public
│   └── package.json
│
└── README.md
```

---

# 🚀 Getting Started

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Ariha1510/CASHCRUSH.git

cd CASHCRUSH/client
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Supabase

Create a `.env` file inside the `client` directory.

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

---

## 4️⃣ Create Database Tables

Run the SQL schema provided in the **Supabase SQL Editor** (available in `database.sql` in root).

The project uses the following tables:

- profiles
- budgets
- expenses
- savings_goals
- recurring_expenses
- user_badges

---

## 5️⃣ Start Development Server

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

# 🔒 Security

- Row Level Security (RLS)
- Protected Routes
- Secure Authentication
- Environment Variable Configuration
- User-isolated Data Access

---

# 🌱 Future Enhancements

- AI Chat Assistant
- PDF Report Export
- Shared Budgets
- Expense Splitting
- Multi-language Support
- Push Notifications
- Offline Data Synchronization

---

# 👨💻 Author

**Ariha Shree**

GitHub: https://github.com/Ariha1510

---

## ⭐ If you found this project useful, consider giving it a star!
