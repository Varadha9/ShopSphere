# 📚 BookSphere — Smart Online Bookstore

> **Every feature. Every data structure. One real-world bookstore.**

BookSphere is a full-stack online bookstore where every feature is directly powered by a specific data structure. Built as a DSA showcase project — not just a bookstore, but a live demonstration of *why* each data structure is the optimal fit for each real-world problem.

🌐 **Live:** [booksphere-dun.vercel.app](https://booksphere-dun.vercel.app)

---

## 💡 Core Idea

```
Real Problem  →  Bookstore Feature  →  Best-fit Data Structure  →  Implementation
```

---

## ⚙️ Tech Stack

| Field | Detail |
|-------|--------|
| Frontend | React 18 + Vite |
| Styling | Pure CSS — no UI library |
| State Management | React useReducer + Context |
| Backend | Supabase (PostgreSQL + Auth + REST API) |
| Authentication | Supabase Auth — Email/Password + Google OAuth |
| Database | PostgreSQL via Supabase (6 tables) |
| Security | Row Level Security (RLS) |
| DSA Engine | JavaScript (mirrored from Java DSA concepts) |
| Deployment | Vercel (frontend) + Supabase Cloud (backend) |

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Varadha9/ShopSphere.git
cd ShopSphere

# Frontend setup
cd frontend
npm install

# Add environment variables
cp .env.example .env
# Fill in your Supabase URL and anon key in .env

npm run dev
```

### Environment Variables

Create `frontend/.env` with:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_key_here
```

### Database Setup

Run `supabase_setup.sql` in your Supabase project → SQL Editor.
This creates all 6 tables with RLS policies and seeds the book catalog.

---

## 🔐 Authentication

BookSphere uses **Supabase Auth** for secure user management:

- Email + password signup / login
- Google OAuth login
- Session persistence across page refreshes via `onAuthStateChange`
- JWT tokens stored in localStorage — auto-refreshed
- Premium member flag stored in `user_metadata`
- Passwords never stored in frontend — bcrypt handled by Supabase
- Forgot password → real reset email via Supabase

| Action | Method |
|--------|--------|
| Register | `supabase.auth.signUp()` |
| Login | `supabase.auth.signInWithPassword()` |
| Google Login | `supabase.auth.signInWithOAuth()` |
| Logout | `supabase.auth.signOut()` |
| Session restore | `supabase.auth.getSession()` |

---

## 🗺️ User Journey

```
Login / Register  (Supabase Auth — Email or Google)
      ↓
Browse Book Catalog + Genres
      ↓
Search Books by Tag / Genre / Author
      ↓
View Recently Seen Books  (persisted in DB)
      ↓
Add to Wishlist  (persisted in DB)
      ↓
Add to Cart  ←→  Remove + Undo  (persisted in DB)
      ↓
Apply Discount Coupons  (shows which coupons selected)
      ↓
Filter by Price
      ↓
Place Order  →  Standard / Premium Queue  (persisted in DB)
      ↓
Track Delivery Route
      ↓
Get Book Recommendations
```

---

## 🧩 Feature → Data Structure Map

| # | Feature | Data Structure | DSA Concept |
|---|---------|----------------|-------------|
| 1 | Book Catalog | ArrayList | `ArrayList<Book>` |
| 2 | Shopping Cart | ArrayList | `ArrayList<CartItem>` |
| 3 | Undo Remove | Stack | `ArrayDeque<CartItem>` |
| 4 | Order Processing | Queue | `LinkedList<Order>` |
| 5 | Premium Orders | Priority Queue | `PriorityQueue<Order>` |
| 6 | Book Search | HashMap | `HashMap<String, List<Book>>` |
| 7 | Wishlist | HashSet | `HashSet<Book>` |
| 8 | Price Sorting | TreeMap | `TreeMap<Double, List<Book>>` |
| 9 | Genre Categories | Tree | Custom N-ary Tree |
| 10 | Delivery Routes | Graph + Dijkstra | `Map<String, List<Edge>>` |
| 11 | Recently Viewed | LinkedList | `LinkedList<Book>` |
| 12 | Discount Engine | Dynamic Programming | `int[n+1][W+1]` |
| 13 | Recommendations | Graph + BFS | `Map<Book, Set<Book>>` |

---

## 🗄️ Database Tables (Supabase)

| Table | Purpose | Access |
|-------|---------|--------|
| `books` | Book catalog — 12 books seeded | Public read |
| `coupons` | Discount coupons for DP engine | Public read |
| `orders` | Order history per user | Private |
| `wishlists` | Saved books per user | Private |
| `carts` | Persistent cart per user | Private |
| `recently_viewed` | View history per user | Private |

---

## 🧠 Algorithm Summary

| Algorithm | Feature | Complexity |
|-----------|---------|------------|
| HashMap Indexing | Book Search | O(1) avg |
| Stack LIFO | Undo Remove | O(1) |
| FIFO Queue | Order Processing | O(1) |
| Min-Heap | Premium Orders, Dijkstra | O(log n) |
| DFS / BFS | Genre Tree | O(n) |
| Dijkstra's | Delivery Routes | O((V+E) log V) |
| BFS on Graph | Recommendations | O(V+E) |
| 0/1 Knapsack DP | Discount Engine | O(n × W) |
| Sliding Window | Recently Viewed | O(1) per view |
| Red-Black Tree | Price Sorting (TreeMap) | O(log n) |

---

## 📁 Project Structure

```
ShopSphere/
├── README.md               ← this file
├── BACKEND.md              ← backend documentation
├── SUPABASE.md             ← Supabase setup guide
├── BOOKSPHERE_DOCS.md      ← full DSA technical docs
├── supabase_setup.sql      ← run this in Supabase SQL Editor
├── frontend/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── lib/
│       │   └── supabase.js         ← Supabase client
│       ├── store/
│       │   └── useStore.jsx        ← global state + all DSA logic
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProductCard.jsx
│       │   └── CategoryTree.jsx
│       ├── pages/
│       │   ├── LoginPage.jsx       ← Email + Google auth
│       │   ├── CatalogPage.jsx     ← HashMap search + Tree browse
│       │   ├── CartPage.jsx        ← ArrayList + Stack + DP
│       │   ├── OrdersPage.jsx      ← Queue + PriorityQueue
│       │   ├── DeliveryPage.jsx    ← Graph + Dijkstra
│       │   ├── RecommendationsPage.jsx ← Graph + BFS
│       │   └── UXPage.jsx
│       ├── data/
│       │   └── mockData.js         ← delivery graph + rec graph + category tree
│       ├── App.jsx
│       └── index.css
```

---

## 📄 Documentation

| File | Contents |
|------|---------|
| [`BACKEND.md`](./BACKEND.md) | Full backend architecture, Supabase services, JWT flow, OAuth |
| [`SUPABASE.md`](./SUPABASE.md) | Supabase setup guide, table schemas, RLS policies |
| [`BOOKSPHERE_DOCS.md`](./BOOKSPHERE_DOCS.md) | DSA technical docs, algorithm rationale, data flow |
| [`supabase_setup.sql`](./supabase_setup.sql) | Run in Supabase SQL Editor to set up all tables |

---

*BookSphere — Every bookstore feature backed by the right data structure.*
