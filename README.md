# 💸 CASHCRUSH | Student Expenditure Management

CASHCRUSH is a gamified, feature-rich personal finance tracker designed for students. Built with a serverless React frontend directly integrated with Supabase, it provides visual statistics, automatic alerts, OCR receipt scanning, streaks, and printable analytics.

---

## 🌟 Key Features

1. **Secure Authentication**: Register and login securely using email verification powered by Supabase Auth.
2. **Onboarding Setup Wizard**: Sets up target monthly budget ceilings and currency preferences (`₹`, `$`, `€`, `£`) on the first launch.
3. **Advanced Expenditure CRUD**: Categorize daily transactions, sort by date/amount, search descriptions, and export logs to CSV.
4. **Explainable AI Spending Coach**: Offers automatic heuristic advice (e.g. food expenditure percentage checks) to keep your allowance safe.
5. **Linear Month-End Predictor**: Projects current daily spending velocity to calculate your month-end total and warn you of high budget risk.
6. **Receipt Scanning OCR**: Upload receipt photos directly to parse merchants, amounts, and dates using **Tesseract.js** to auto-fill the forms.
7. **Savings Target Goals**: Define goals (e.g. buy a laptop, emergency fund) and feed savings increments with graphical progress.
8. **Recurring Payments Tracker**: Register daily, weekly, monthly, and yearly subscriptions (e.g. Netflix, hostel rent).
9. **Gamification Hub**: Earn streaks and unlock badges like "7-Day Saver" or "Savings Master" for keeping to budgets.
10. **Printable Analytics Reports**: Interactive pie and bar trend graphs powered by Chart.js, with custom layouts optimized for printing to PDF.
11. **Responsive Glassmorphic UI**: High-fidelity dark mode styling and progressive web app (PWA) manifest configurations.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18, React Router v6, Vite
- **Styling**: Vanilla CSS with custom glassmorphic properties and custom theme toggle
- **Charts**: Chart.js / `react-chartjs-2`
- **OCR Engine**: `Tesseract.js`
- **Database & Auth**: Supabase DB (`@supabase/supabase-js`)

---

## 🚀 Setup & Installation

### 1. Database Configuration
Go to your Supabase Project console, open the **SQL Editor**, and execute the schema:

```sql
create table profiles (
    id uuid primary key references auth.users(id),
    name text,
    currency varchar(10) default '₹',
    onboarded boolean default false,
    created_at timestamp default now()
);

create table budgets (
    id bigint generated always as identity primary key,
    user_id uuid references auth.users(id) on delete cascade,
    monthly_budget numeric default 8000
);

create table expenses (
    id bigint generated always as identity primary key,
    user_id uuid references auth.users(id) on delete cascade,
    title text,
    amount numeric,
    category text,
    expense_date date,
    description text,
    created_at timestamp default now()
);

create table savings_goals (
    id bigint generated always as identity primary key,
    user_id uuid references auth.users(id) on delete cascade,
    title text not null,
    target_amount numeric not null,
    saved_amount numeric default 0,
    target_date date,
    created_at timestamp default now()
);

create table recurring_expenses (
    id bigint generated always as identity primary key,
    user_id uuid references auth.users(id) on delete cascade,
    title text not null,
    amount numeric not null,
    category text not null,
    frequency text not null,
    next_due_date date not null,
    created_at timestamp default now()
);

create table user_badges (
    id bigint generated always as identity primary key,
    user_id uuid references auth.users(id) on delete cascade,
    badge_name text not null,
    description text not null,
    unlocked_at timestamp default now()
);
```

### 2. Environment Configuration
Create a `.env` file in the `client/` folder:

```env
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run Locally

```bash
cd client
npm install
npm run dev
```
