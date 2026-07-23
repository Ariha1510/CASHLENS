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

# 📸 Screenshots

> Add screenshots of:

- Dashboard
- Expense Management
- Reports
- OCR Scanner
- Savings Goals
- Mobile View

---

# 🌱 Future Enhancements & Feature Roadmap

## 🥇 Tier 1 — Features that make it feel like a real product

### 1. AI Financial Assistant ⭐⭐⭐⭐⭐
Instead of just showing AI insights, add a chatbot.
Examples:
> "Why did I spend so much this month?"
> "How can I save ₹1000?"
> "Show me my biggest expenses."
> "Compare this month with last month."
Use an LLM with your own spending data to generate personalized responses.

### 2. Financial Health Score ⭐⭐⭐⭐⭐
Create a score out of 100.
Example:
```text
Financial Health
82 / 100
★★★★★
Excellent
```
Factors:
* Stayed under budget
* Savings progress
* Spending consistency
* Emergency savings
* Number of impulse purchases

### 3. AI Receipt Categorization ⭐⭐⭐⭐⭐
After OCR extracts receipt text:
```
Starbucks
₹280
Latte
```
Automatically classify it as:
```
Food & Drinks
```

### 4. Smart Budget Recommendations ⭐⭐⭐⭐⭐
Show recommended budgets:
```
Recommended Budget
Food ₹2500
Travel ₹1000
Shopping ₹800
Savings ₹2000
```
Based on the user's spending history.

### 5. Monthly Financial Report ⭐⭐⭐⭐⭐
Automatically generate a report summary and allow export as PDF.

---

## 🥈 Tier 2 — Features inspired by modern finance apps
- **Savings Challenges**: e.g., "No Coffee Challenge (7 days)" to earn app points.
- **Smart Notifications**: e.g., "You've spent 80% of your food budget. Avoid ordering online this week."
- **Spending Heatmap**: GitHub-style contribution graph representing daily expenditure intensity.
- **Daily Spending Timeline**: Hourly breakdown of logged expenditures.
- **Voice Expense Entry**: Natural speech processing, e.g., "Spent 250 rupees on groceries."

---

## 🥉 Tier 3 — Collaborative features
- **Shared Budgets**: Multiple members contributing to a single budget pool.
- **Expense Splitting**: Splitwise-style splits among friends.
- **Group Trip Budget**: Tracking trip expenses collectively.

---

## 🗺️ Tier 4 — Data and visualization
- **Sankey Diagram**: Visualizing money flow from income to categories.
- **Spending Forecast**: Predict the next 30 days based on current trends.
- **Category Trends**: Month-over-month category percentage change.
- **Net Savings Graph**: Plotting Income, Expenses, and Savings together over time.

---

## 🚀 Tier 5 — Premium-quality polish
- **Offline Mode**: Cache new expenses locally and auto-sync when online.
- **Theme Customization**: Accent palettes like Emerald, Ocean, Purple, and Sunset.
- **Personalized Dashboard**: Drag-and-drop widget reordering.
- **Achievements Hub**: Trophies for savers (e.g. 30-Day Streak).
- **Smart Natural Search**: Natural query filtering (e.g. "Food last month").
- **Testing & E2E**: Unit testing with Vitest/RTL, and E2E validation with Playwright/Cypress.

---

# 👨💻 Author

**Ariha Shree**

GitHub: https://github.com/Ariha1510

---

## ⭐ If you found this project useful, consider giving it a star!
