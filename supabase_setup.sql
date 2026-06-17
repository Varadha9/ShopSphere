-- ============================================================
-- BookSphere — Supabase Schema Setup
-- Run this entire file in Supabase → SQL Editor
-- ============================================================

-- 1. BOOKS (ArrayList<Book>)
create table if not exists books (
  id        text primary key,
  name      text not null,
  price     numeric not null,
  category  text not null,
  author    text not null,
  tags      text[] not null,
  rating    numeric not null
);

-- 2. COUPONS (Knapsack DP inputs)
create table if not exists coupons (
  id        text primary key,
  label     text not null,
  min_spend numeric not null,
  discount  numeric not null
);

-- 3. ORDERS (PriorityQueue<Order>)
create table if not exists orders (
  id         uuid primary key default gen_random_uuid(),
  order_id   text not null,
  user_id    uuid references auth.users(id) on delete cascade,
  items      jsonb not null,
  total      numeric not null,
  priority   int not null,
  status     text not null default 'PENDING',
  is_premium boolean not null default false,
  created_at timestamptz default now()
);

-- 4. WISHLIST (HashSet<Book>)
create table if not exists wishlists (
  user_id  uuid references auth.users(id) on delete cascade,
  book_id  text references books(id) on delete cascade,
  primary key (user_id, book_id)
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table books      enable row level security;
alter table coupons    enable row level security;
alter table orders     enable row level security;
alter table wishlists  enable row level security;

-- Books & Coupons: anyone can read
create policy "public read books"   on books   for select using (true);
create policy "public read coupons" on coupons for select using (true);

-- Orders: user sees only their own
create policy "own orders select" on orders for select using (auth.uid() = user_id);
create policy "own orders insert" on orders for insert with check (auth.uid() = user_id);
create policy "own orders update" on orders for update using (auth.uid() = user_id);

-- Wishlist: user sees only their own
create policy "own wishlist select" on wishlists for select using (auth.uid() = user_id);
create policy "own wishlist insert" on wishlists for insert with check (auth.uid() = user_id);
create policy "own wishlist delete" on wishlists for delete using (auth.uid() = user_id);

-- ============================================================
-- Seed: Books
-- ============================================================
insert into books (id, name, price, category, author, tags, rating) values
  ('p1',  'The Pragmatic Programmer',    599,  'Technology',  'Hunt & Thomas',        array['programming','software','engineering'],        4.9),
  ('p2',  'Clean Code',                  549,  'Technology',  'Robert C. Martin',     array['programming','refactoring','engineering'],     4.8),
  ('p3',  'Dune',                        399,  'Fiction',     'Frank Herbert',        array['scifi','fiction','classic'],                  4.9),
  ('p4',  '1984',                        299,  'Fiction',     'George Orwell',        array['dystopia','fiction','classic'],               4.8),
  ('p5',  'Sapiens',                     449,  'Non-Fiction', 'Yuval Noah Harari',    array['history','nonfiction','science'],             4.7),
  ('p6',  'Atomic Habits',               499,  'Self-Help',   'James Clear',          array['selfhelp','habits','productivity'],           4.8),
  ('p7',  'Introduction to Algorithms',  899,  'Technology',  'CLRS',                 array['algorithms','programming','engineering'],      4.7),
  ('p8',  'The Alchemist',               249,  'Fiction',     'Paulo Coelho',         array['fiction','classic','inspirational'],          4.6),
  ('p9',  'Thinking, Fast and Slow',     479,  'Non-Fiction', 'Daniel Kahneman',      array['psychology','nonfiction','science'],          4.6),
  ('p10', 'Deep Work',                   399,  'Self-Help',   'Cal Newport',          array['selfhelp','productivity','focus'],            4.7),
  ('p11', 'The Great Gatsby',            199,  'Fiction',     'F. Scott Fitzgerald',  array['fiction','classic','literature'],             4.4),
  ('p12', 'Designing Data-Intensive Apps',799, 'Technology',  'Martin Kleppmann',     array['programming','systems','engineering'],        4.9)
on conflict (id) do nothing;

-- ============================================================
-- Seed: Coupons
-- ============================================================
insert into coupons (id, label, min_spend, discount) values
  ('c1', 'BOOK30',  300,  30),
  ('c2', 'BOOK80',  800,  80),
  ('c3', 'BOOK150', 1500, 150),
  ('c4', 'BOOK300', 2500, 300)
on conflict (id) do nothing;

-- ============================================================
-- Fix 1: Unique constraint on order_id
-- ============================================================
alter table orders drop constraint if exists orders_order_id_unique;
alter table orders add constraint orders_order_id_unique unique (order_id);

-- ============================================================
-- Fix 2: Cart table (ArrayList<CartItem>)
-- ============================================================
create table if not exists carts (
  user_id  uuid references auth.users(id) on delete cascade,
  book_id  text references books(id) on delete cascade,
  qty      int not null default 1,
  primary key (user_id, book_id)
);

alter table carts enable row level security;
create policy "own cart select" on carts for select using (auth.uid() = user_id);
create policy "own cart insert" on carts for insert with check (auth.uid() = user_id);
create policy "own cart update" on carts for update using (auth.uid() = user_id);
create policy "own cart delete" on carts for delete using (auth.uid() = user_id);

-- ============================================================
-- Fix 3: Recently viewed table (LinkedList<Book>)
-- ============================================================
create table if not exists recently_viewed (
  user_id   uuid references auth.users(id) on delete cascade,
  book_id   text references books(id) on delete cascade,
  viewed_at timestamptz default now(),
  primary key (user_id, book_id)
);

alter table recently_viewed enable row level security;
create policy "own recent select" on recently_viewed for select using (auth.uid() = user_id);
create policy "own recent insert" on recently_viewed for insert with check (auth.uid() = user_id);
create policy "own recent update" on recently_viewed for update using (auth.uid() = user_id);
create policy "own recent delete" on recently_viewed for delete using (auth.uid() = user_id);
