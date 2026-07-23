
-- PostgreSQL Supabase Database Schema for CASHCRUSH
-- Paste this script directly in the Supabase SQL Editor

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    currency VARCHAR(10) DEFAULT '₹',
    onboarded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Budgets Table
CREATE TABLE IF NOT EXISTS budgets (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    monthly_budget NUMERIC DEFAULT 8000
);

-- 3. Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    category TEXT NOT NULL,
    expense_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Savings Goals Table
CREATE TABLE IF NOT EXISTS savings_goals (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    target_amount NUMERIC NOT NULL,
    saved_amount NUMERIC DEFAULT 0,
    target_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Recurring Expenses Table
CREATE TABLE IF NOT EXISTS recurring_expenses (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    category TEXT NOT NULL,
    frequency TEXT NOT NULL,
    next_due_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. User Badges Table
CREATE TABLE IF NOT EXISTS user_badges (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    badge_name TEXT NOT NULL,
    description TEXT NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- Row Level Security (RLS) Policies
-- ----------------------------------------------------

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Budgets Policies
CREATE POLICY "Users can view their own budget" ON budgets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budget" ON budgets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budget" ON budgets
    FOR UPDATE USING (auth.uid() = user_id);

-- Expenses Policies
CREATE POLICY "Users can view their own expenses" ON expenses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expenses" ON expenses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" ON expenses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" ON expenses
    FOR DELETE USING (auth.uid() = user_id);

-- Savings Goals Policies
CREATE POLICY "Users can manage their own savings goals" ON savings_goals
    FOR ALL USING (auth.uid() = user_id);

-- Recurring Expenses Policies
CREATE POLICY "Users can manage their own recurring expenses" ON recurring_expenses
    FOR ALL USING (auth.uid() = user_id);

-- User Badges Policies
CREATE POLICY "Users can manage their own badges" ON user_badges
    FOR ALL USING (auth.uid() = user_id);
