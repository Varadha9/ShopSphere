# 🗄️ BookSphere — Supabase Setup Guide

Complete guide to the Supabase backend powering BookSphere — covers database schema, authentication, Row Level Security, and how each table connects to the frontend.

---

## 📋 Table of Contents

- [What Supabase Can Do](#what-supabase-can-do)
- [Project Overview](#project-overview)
- [Environment Setup](#environment-setup)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [Row Level Security (RLS)](#row-level-security)
- [How Frontend Connects](#how-frontend-connects)
- [Data Flow](#data-flow)
- [Running the SQL Setup](#running-the-sql-setup)
- [Verifying Everything Works](#verifying-everything-works)
- [Common Errors & Fixes](#common-errors--fixes)

---

## ⚡ What Supabase Can Do

Supabase is a complete backend platform. Here's everything it provides out of the box:

### 🔐 Authentication
- Email + password login and registration
- OAuth providers (Google, GitHub, Discord etc.)
- Magic link login (passwordless)
- Session management with JWT tokens
- Session persists across browser refreshes
- User metadata storage (e.g. name, isPremium flag)
- Password hashing handled automatically (bcrypt)
- No backend code needed — works directly from frontend

### 🗄️ Database (PostgreSQL)
- Full PostgreSQL database — most powerful open source DB
- Create tables, relationships, indexes via dashboard or SQL
- Visual Table Editor — view, edit, insert rows like a spreadsheet
- SQL Editor — run any SQL query directly in the browser
- Supports all data types: text, numeric, boolean, jsonb, arrays, uuid, timestamps
- Foreign keys and cascading deletes built in
- Auto-generates REST API for every table — no backend needed

### 🔒 Row Level Security (RLS)
- Security rules written in SQL directly on the database
- Each user can only read/write their own rows
- Even if someone steals your API key, they can't access other users' data
- Policies for SELECT, INSERT, UPDATE, DELETE separately

### ⚡ Realtime
- Listen to database changes live in the browser
- New row inserted → your UI updates instantly
- No polling needed — uses WebSockets under the hood
- Useful for: live order status, chat, notifications

### 📦 Storage
- Store files (images, PDFs, videos) like AWS S3
- Access control per file or folder
- Generate public URLs or signed URLs for private files
- Useful for: book cover images, user avatars

### 🚀 Edge Functions
- Run server-side code without managing a server
- Written in TypeScript / Deno
- Useful for: payment webhooks, sending emails, secret API calls

### 📊 Dashboard
- Visual UI to manage everything without writing code
- View all users under Authentication → Users
- Browse and edit table data visually
- Monitor API usage and database health
- Set up RLS policies with a visual editor

### 🆓 Free Tier
- 500 MB database
- 1 GB file storage
- 50,000 monthly active users
- Unlimited API requests
- Perfect for projects like BookSphere

---

## Project Overview

BookSphere uses **Supabase** as its entire backend:

| Service | What it does |
|---------|-------------|
| Supabase Auth | User registration, login, session management |
| Supabase PostgreSQL | Stores books, coupons, orders, wishlists |
| Row Level Security | Each user can only access their own data |
| Supabase JS Client | Frontend talks to DB via `@supabase/supabase-js` |

---

## Environment Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Set a project name, database password, and region
3. Wait for the project to be ready (~2 minutes)

### 2. Get Your API Keys

Go to your project → **Settings** → **API**

| Key | Where to use |
|-----|-------------|
| Project URL | `VITE_SUPABASE_URL` |
| Publishable key (`sb_publishable_...`) | `VITE_SUPABASE_ANON_KEY` |

> ⚠️ Never use the **Secret key** (`sb_secret_...`) in the frontend. Secret keys go only in server-side code.

### 3. Create the `.env` File

```bash
cd frontend
cp .env.example .env
```

Fill in your keys:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_your_key_here
```

### 4. Supabase Client (already set up)

`frontend/src/lib/supabase.js`:

```js
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

This single client instance is imported everywhere in the app.

---

## Authentication

BookSphere uses **Supabase Auth** with email + password.

### How it works

```
User fills form → supabase.auth.signUp() / signInWithPassword()
                        ↓
              Supabase validates credentials
                        ↓
              Returns session (JWT token)
                        ↓
         useStore.jsx picks up session via onAuthStateChange()
                        ↓
              User state set in React store
```

### Auth Methods Used

| Action | Supabase Method |
|--------|----------------|
| Register | `supabase.auth.signUp({ email, password, options: { data: { name, isPremium } } })` |
| Login | `supabase.auth.signInWithPassword({ email, password })` |
| Logout | `supabase.auth.signOut()` |
| Restore session on refresh | `supabase.auth.getSession()` |
| Listen for auth changes | `supabase.auth.onAuthStateChange()` |

### User Metadata

When a user registers, extra data is stored in `user_metadata`:

```js
options: {
  data: {
    name: "Varad",
    isPremium: true   // controls order priority (1 = premium, 10 = standard)
  }
}
```

Read back on login:

```js
session.user.user_metadata?.name
session.user.user_metadata?.isPremium
```

### Where Users Are Stored

- Supabase Dashboard → **Authentication** → **Users**
- Passwords are stored as **bcrypt hashes** — plain text is never saved anywhere
- You can see: email, user ID (uuid), created date, last sign in

---

## Database Schema

Run `supabase_setup.sql` in Supabase → SQL Editor to create all tables.

---

### Table 1: `books`

Stores the full book catalog. Maps to `ArrayList<Book>` in DSA terms.

```sql
create table books (
  id        text primary key,       -- e.g. "p1", "p2"
  name      text not null,          -- "Clean Code"
  price     numeric not null,       -- 549
  category  text not null,          -- "Technology"
  author    text not null,          -- "Robert C. Martin"
  tags      text[] not null,        -- ["programming", "refactoring"]
  rating    numeric not null        -- 4.8
);
```

**Seeded with 12 books** across 4 categories: Technology, Fiction, Non-Fiction, Self-Help.

**Who can access:** Everyone (public read). No login required to browse.

---

### Table 2: `coupons`

Stores discount coupons. Used by the **0/1 Knapsack DP** algorithm to find the best discount combination.

```sql
create table coupons (
  id        text primary key,   -- "c1"
  label     text not null,      -- "BOOK30"
  min_spend numeric not null,   -- 300  (minimum cart value to apply)
  discount  numeric not null    -- 30   (rupees off)
);
```

**Seeded with 4 coupons:**

| Label | Min Spend | Discount |
|-------|-----------|----------|
| BOOK30 | ₹300 | ₹30 off |
| BOOK80 | ₹800 | ₹80 off |
| BOOK150 | ₹1500 | ₹150 off |
| BOOK300 | ₹2500 | ₹300 off |

**Who can access:** Everyone (public read).

---

### Table 3: `orders`

Stores placed orders per user. Maps to `PriorityQueue<Order>` — premium orders (priority=1) always process before standard (priority=10).

```sql
create table orders (
  id         uuid primary key default gen_random_uuid(),
  order_id   text not null,        -- "ORD-1718000000000"
  user_id    uuid references auth.users(id) on delete cascade,
  items      jsonb not null,       -- [{ product: {...}, qty: 2 }]
  total      numeric not null,     -- 1098
  priority   int not null,         -- 1 (premium) or 10 (standard)
  status     text default 'PENDING',  -- "PENDING" | "PROCESSING"
  is_premium boolean default false,
  created_at timestamptz default now()
);
```

**Key design decisions:**
- `items` is stored as `jsonb` — captures the full product snapshot at order time, so even if a book's price changes later, the order history stays accurate
- `on delete cascade` — if a user deletes their account, their orders are automatically removed
- `priority` drives the min-heap sort in the frontend

**Who can access:** Only the owner (`auth.uid() = user_id`).

---

### Table 4: `wishlists`

Stores which books a user has wishlisted. Maps to `HashSet<Book>` — unique book IDs per user.

```sql
create table wishlists (
  user_id  uuid references auth.users(id) on delete cascade,
  book_id  text references books(id) on delete cascade,
  primary key (user_id, book_id)   -- composite key = no duplicates
);
```

**Key design decisions:**
- Composite primary key `(user_id, book_id)` enforces uniqueness — same book can't be wishlisted twice
- `on delete cascade` on both foreign keys — clean removal when user or book is deleted

**Who can access:** Only the owner.

---

## Row Level Security

RLS is enabled on all 4 tables. It means **PostgreSQL itself enforces access rules** — even if someone gets your publishable key, they can only see their own data.

### Policy Summary

| Table | Operation | Rule |
|-------|-----------|------|
| books | SELECT | Anyone |
| coupons | SELECT | Anyone |
| orders | SELECT | `auth.uid() = user_id` |
| orders | INSERT | `auth.uid() = user_id` |
| orders | UPDATE | `auth.uid() = user_id` |
| wishlists | SELECT | `auth.uid() = user_id` |
| wishlists | INSERT | `auth.uid() = user_id` |
| wishlists | DELETE | `auth.uid() = user_id` |

### How `auth.uid()` works

When a logged-in user makes a request, Supabase automatically reads their JWT token and extracts their user ID. The RLS policy compares it to the `user_id` column — no extra code needed in the frontend.

```
Frontend request + JWT token
        ↓
Supabase reads auth.uid() from JWT
        ↓
PostgreSQL checks: auth.uid() = user_id?
        ↓
Yes → returns row | No → row invisible
```

---

## How Frontend Connects

### Loading books and coupons (on app start)

```js
// useStore.jsx — runs once on mount
Promise.all([
  supabase.from("books").select("*"),
  supabase.from("coupons").select("*"),
]).then(([{ data: books }, { data: coupons }]) => {
  dispatch({ type: "SET_CATALOG", payload: books });
  dispatch({ type: "SET_COUPONS", payload: coupons });
});
```

### Loading user data (on login)

```js
// runs after auth session is confirmed
const [{ data: orders }, { data: wishlist }] = await Promise.all([
  supabase.from("orders").select("*").eq("user_id", userId).order("priority"),
  supabase.from("wishlists").select("book_id").eq("user_id", userId),
]);
```

### Saving an order

```js
supabase.from("orders").upsert({
  order_id:   order.orderId,
  user_id:    user.userId,
  items:      order.items,       // jsonb
  total:      order.total,
  priority:   order.priority,
  status:     order.status,
  is_premium: order.isPremium,
}, { onConflict: "order_id" });
```

### Syncing wishlist

```js
// Delete all → re-insert current set
supabase.from("wishlists").delete().eq("user_id", userId).then(() => {
  supabase.from("wishlists").insert(
    bookIds.map(book_id => ({ user_id: userId, book_id }))
  );
});
```

---

## Data Flow

```
App starts
    ↓
supabase.from("books").select("*")   ← books table
supabase.from("coupons").select("*") ← coupons table
    ↓
User logs in
    ↓
supabase.auth.signInWithPassword()
    ↓
onAuthStateChange fires → user set in store
    ↓
Load orders + wishlist from DB for this user
    ↓
User places order
    ↓
Reducer updates state → useEffect fires → saved to orders table
    ↓
User toggles wishlist
    ↓
Reducer updates state → useEffect fires → synced to wishlists table
    ↓
User refreshes browser
    ↓
getSession() restores JWT → user loaded → orders + wishlist fetched again
```

---

## Running the SQL Setup

1. Open [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your **BookSphere** project
3. Left sidebar → **SQL Editor**
4. Click **New query**
5. Open `supabase_setup.sql` from the project root
6. Paste the entire contents into the editor
7. Click **Run** (or press `Ctrl+Enter`)
8. You should see: `Success. No rows returned`

### Verify tables were created

After running, go to **Table Editor** in the left sidebar. You should see:

```
books     → 12 rows
coupons   → 4 rows
orders    → 0 rows (fills up as users place orders)
wishlists → 0 rows (fills up as users wishlist books)
```

---

## Verifying Everything Works

### 1. Check books loaded in app
Start the dev server → open Catalog page → books should appear (loaded from DB, not mockData).

### 2. Check auth
Register a new account → go to Supabase Dashboard → Authentication → Users → your email should appear.

### 3. Check orders persist
Add books to cart → place order → go to Supabase → Table Editor → `orders` → your order row should be there.

### 4. Check wishlist persists
Wishlist a book → refresh the page → wishlist should still be there (loaded from DB on session restore).

### 5. Verify RLS is working
In SQL Editor, run:
```sql
select * from orders;
```
This returns nothing when run as `postgres` role without a user session — RLS is working correctly.

To see all orders as admin:
```sql
select * from orders;  -- run via Supabase SQL editor (bypasses RLS as service role)
```

---

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `relation "books" does not exist` | SQL not run yet | Run `supabase_setup.sql` in SQL Editor |
| `new row violates row-level security` | Inserting without a logged-in user | Make sure user is authenticated before writing |
| `401 Unauthorized` | Wrong or missing API key | Check `.env` has correct `VITE_SUPABASE_ANON_KEY` |
| Books not loading | RLS policy missing | Re-run the SQL — check `public read books` policy exists |
| `duplicate key value violates unique constraint` | Running SQL seed twice | The `ON CONFLICT DO NOTHING` clause handles this safely |
| Wishlist resets on refresh | User not logged in | Wishlist only persists for authenticated users |

---

## Quick Reference

```bash
# Start frontend
cd frontend && npm run dev

# Supabase dashboard
https://supabase.com/dashboard

# Tables
books, coupons, orders, wishlists

# Auth users
Dashboard → Authentication → Users

# Re-run setup (safe, uses ON CONFLICT DO NOTHING)
Dashboard → SQL Editor → paste supabase_setup.sql → Run
```

---

*BookSphere Supabase Docs — schema, auth, RLS, and data flow all in one place.*
