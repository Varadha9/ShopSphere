# 🔧 BookSphere — Backend Documentation

BookSphere uses **Supabase** as its entire backend. No custom server, no Node.js, no Express — just Supabase + React.

---

## 📋 Table of Contents

- [Backend Overview](#backend-overview)
- [Why Supabase as Backend](#why-supabase-as-backend)
- [Backend Architecture](#backend-architecture)
- [Database Tables](#database-tables)
- [Authentication Backend](#authentication-backend)
- [Row Level Security](#row-level-security)
- [REST API](#rest-api)
- [JWT Flow](#jwt-flow)
- [Google OAuth Backend](#google-oauth-backend)
- [Data Persistence Layer](#data-persistence-layer)
- [Deployment](#deployment)

---

## Backend Overview

| Service | Technology | Purpose |
|---------|-----------|---------|
| Database | PostgreSQL (via Supabase) | Store books, coupons, orders, wishlists, cart, recently viewed |
| Authentication | Supabase Auth | Email/password + Google OAuth + JWT |
| REST API | Supabase Auto-generated | CRUD on all tables |
| Security | Row Level Security (RLS) | Per-user data isolation |
| Hosting | Supabase Cloud | Free tier, managed infrastructure |

---

## Why Supabase as Backend

Traditional backend stack would require:
```
Node.js / Express  →  REST API
Passport.js        →  Auth
PostgreSQL         →  Database
JWT library        →  Token management
bcrypt             →  Password hashing
Deployment server  →  Hosting
```

Supabase replaces ALL of that:
```
Supabase Auth      →  Auth + JWT + bcrypt (built in)
Supabase DB        →  PostgreSQL (managed)
Supabase API       →  Auto-generated REST API
Supabase RLS       →  Security policies in SQL
Supabase Cloud     →  Hosted, no server management
```

**Result:** Zero backend code written. Everything handled by Supabase.

---

## Backend Architecture

```
React Frontend
      │
      │  HTTPS requests
      ▼
Supabase JS Client (@supabase/supabase-js)
      │
      ├── supabase.auth.*          → Supabase Auth Service
      │         │
      │         ├── signUp()       → Creates user in auth.users
      │         ├── signIn()       → Returns JWT token
      │         ├── signOut()      → Invalidates session
      │         ├── getSession()   → Reads JWT from localStorage
      │         └── onAuthStateChange() → Listens for auth events
      │
      └── supabase.from("table")   → Supabase REST API
                │
                ├── .select()      → GET request
                ├── .insert()      → POST request
                ├── .upsert()      → POST with conflict handling
                ├── .update()      → PATCH request
                └── .delete()      → DELETE request
                        │
                        ▼
                PostgreSQL Database
                (with RLS policies enforced)
```

---

## Database Tables

BookSphere has 6 tables in PostgreSQL:

### `books` — Book Catalog
```sql
create table books (
  id        text primary key,
  name      text not null,
  price     numeric not null,
  category  text not null,
  author    text not null,
  tags      text[] not null,
  rating    numeric not null
);
```
- Public read — no login required
- Seeded with 12 books
- `tags` is a PostgreSQL array — supports multi-tag indexing

---

### `coupons` — Discount Coupons
```sql
create table coupons (
  id        text primary key,
  label     text not null,
  min_spend numeric not null,
  discount  numeric not null
);
```
- Public read — no login required
- Fed into the 0/1 Knapsack DP algorithm in frontend
- 4 coupons seeded: BOOK30, BOOK80, BOOK150, BOOK300

---

### `orders` — Order History
```sql
create table orders (
  id         uuid primary key default gen_random_uuid(),
  order_id   text unique not null,
  user_id    uuid references auth.users(id) on delete cascade,
  items      jsonb not null,
  total      numeric not null,
  priority   int not null,
  status     text default 'PENDING',
  is_premium boolean default false,
  created_at timestamptz default now()
);
```
- Private — user sees only their own orders
- `items` stored as `jsonb` — full product snapshot at order time
- `priority` — 1 for premium, 10 for standard
- `status` — PENDING → PROCESSING → DELIVERED
- `unique` constraint on `order_id` prevents duplicates

---

### `wishlists` — Saved Books
```sql
create table wishlists (
  user_id  uuid references auth.users(id) on delete cascade,
  book_id  text references books(id) on delete cascade,
  primary key (user_id, book_id)
);
```
- Private — user sees only their own wishlist
- Composite primary key prevents duplicate wishlist entries
- Maps to `HashSet<Book>` in DSA terms

---

### `carts` — Persistent Cart
```sql
create table carts (
  user_id  uuid references auth.users(id) on delete cascade,
  book_id  text references books(id) on delete cascade,
  qty      int not null default 1,
  primary key (user_id, book_id)
);
```
- Private — user sees only their own cart
- Cart persists across browser sessions
- Maps to `ArrayList<CartItem>` in DSA terms

---

### `recently_viewed` — View History
```sql
create table recently_viewed (
  user_id   uuid references auth.users(id) on delete cascade,
  book_id   text references books(id) on delete cascade,
  viewed_at timestamptz default now(),
  primary key (user_id, book_id)
);
```
- Private — user sees only their own history
- Ordered by `viewed_at` descending — most recent first
- Max 5 records loaded (sliding window)
- Maps to `LinkedList<Book>` in DSA terms

---

## Authentication Backend

Supabase Auth handles everything:

### Email / Password
```
Register → supabase.auth.signUp()
              ↓
         Supabase hashes password with bcrypt
              ↓
         Stores user in auth.users table
              ↓
         Returns JWT session token

Login    → supabase.auth.signInWithPassword()
              ↓
         Supabase verifies bcrypt hash
              ↓
         Returns JWT + refresh token
              ↓
         Stored in browser localStorage automatically
```

### Google OAuth
```
Click Google → supabase.auth.signInWithOAuth({ provider: "google" })
                    ↓
              Redirect to Google consent screen
                    ↓
              Google returns auth code to Supabase callback URL
              https://[project].supabase.co/auth/v1/callback
                    ↓
              Supabase exchanges code for Google tokens
                    ↓
              Creates/updates user in auth.users
                    ↓
              Returns JWT to frontend
                    ↓
              onAuthStateChange fires → user logged in
```

### User Metadata
Extra fields stored in JWT payload:
```js
{
  name: "Varad",
  isPremium: true   // controls order queue priority
}
```

---

## Row Level Security

RLS policies run inside PostgreSQL — the database itself enforces access control:

```
Frontend sends request + JWT token
          ↓
Supabase extracts auth.uid() from JWT
          ↓
PostgreSQL checks RLS policy:
  "SELECT * FROM orders WHERE auth.uid() = user_id"
          ↓
Only rows matching the user's ID are returned
```

### All Policies

| Table | Action | Who |
|-------|--------|-----|
| books | SELECT | Everyone |
| coupons | SELECT | Everyone |
| orders | SELECT | Owner only |
| orders | INSERT | Owner only |
| orders | UPDATE | Owner only |
| wishlists | SELECT | Owner only |
| wishlists | INSERT | Owner only |
| wishlists | DELETE | Owner only |
| carts | SELECT | Owner only |
| carts | INSERT | Owner only |
| carts | UPDATE | Owner only |
| carts | DELETE | Owner only |
| recently_viewed | SELECT | Owner only |
| recently_viewed | INSERT | Owner only |
| recently_viewed | UPDATE | Owner only |
| recently_viewed | DELETE | Owner only |

---

## REST API

Supabase auto-generates a REST API for every table. No routes to write.

### Examples

```js
// GET all books
supabase.from("books").select("*")

// GET user's orders sorted by priority
supabase.from("orders")
  .select("*")
  .eq("user_id", userId)
  .order("priority")

// INSERT new order
supabase.from("orders").upsert({
  order_id, user_id, items, total, priority, status, is_premium
}, { onConflict: "order_id" })

// DELETE wishlist entry
supabase.from("wishlists")
  .delete()
  .eq("user_id", userId)
  .eq("book_id", bookId)
```

All requests automatically include the JWT token from localStorage — no manual header setup needed.

---

## JWT Flow

```
1. User logs in
        ↓
2. Supabase returns:
   - access_token (JWT, expires in 1 hour)
   - refresh_token (long-lived)
        ↓
3. Supabase JS client stores both in localStorage
        ↓
4. Every supabase.from() call sends JWT in Authorization header
        ↓
5. When access_token expires → Supabase auto-refreshes using refresh_token
        ↓
6. User refreshes page → getSession() reads JWT from localStorage → user restored
        ↓
7. User logs out → supabase.auth.signOut() → tokens deleted from localStorage
```

JWT contains:
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "user_metadata": {
    "name": "Varad",
    "isPremium": false
  },
  "exp": 1234567890
}
```

---

## Google OAuth Backend

### Setup Required
1. Google Cloud Console → Create OAuth 2.0 Client
2. Authorized redirect URI:
```
https://[project-id].supabase.co/auth/v1/callback
```
3. Supabase Dashboard → Authentication → Providers → Google → paste Client ID + Secret

### Flow
```
Frontend → Google → Supabase callback → JWT → Frontend
```

Supabase acts as the OAuth middleman — handles the token exchange, creates the user, and returns a standard JWT just like email login.

---

## Data Persistence Layer

Every user action that changes data is synced to Supabase:

| Action | Supabase Operation |
|--------|-------------------|
| Add to cart | `carts` upsert |
| Remove from cart | `carts` delete |
| Place order | `orders` insert |
| Process order | `orders` update (status) |
| Toggle wishlist | `wishlists` insert/delete |
| View book | `recently_viewed` upsert |
| Login | Load cart + orders + wishlist + recently_viewed |
| Logout | Clear all local state |

---

## Deployment

BookSphere is deployed on **Vercel** (frontend) + **Supabase Cloud** (backend).

| Layer | Platform | URL |
|-------|----------|-----|
| Frontend | Vercel | https://booksphere-dun.vercel.app |
| Backend | Supabase Cloud | https://vckpdkzsfeeibldxippd.supabase.co |

### Environment Variables (Vercel)
```
VITE_SUPABASE_URL=https://vckpdkzsfeeibldxippd.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

### Supabase URL Configuration (for OAuth)
```
Site URL:      https://booksphere-dun.vercel.app
Redirect URLs: https://booksphere-dun.vercel.app/**
```

---

*BookSphere Backend — powered entirely by Supabase. Zero custom server code.*
