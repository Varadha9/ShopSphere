# 📚 BookSphere — Frontend

React 18 + Vite frontend for BookSphere, connected to Supabase backend.

🌐 **Live:** [booksphere-dun.vercel.app](https://booksphere-dun.vercel.app)

---

## 🚀 Setup

```bash
npm install
cp .env.example .env   # fill in Supabase keys
npm run dev
```

## 🔑 Environment Variables

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_key_here
```

---

## 📁 Structure

```
src/
├── lib/supabase.js          ← Supabase client singleton
├── store/useStore.jsx       ← global state + all DSA logic
├── components/
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   └── CategoryTree.jsx
├── pages/
│   ├── LoginPage.jsx        ← Email + Google OAuth
│   ├── CatalogPage.jsx      ← HashMap search, Tree genre browse
│   ├── CartPage.jsx         ← ArrayList cart, Stack undo, DP coupons
│   ├── OrdersPage.jsx       ← Queue + PriorityQueue orders
│   ├── DeliveryPage.jsx     ← Graph + Dijkstra shortest path
│   ├── RecommendationsPage.jsx ← Graph + BFS recommendations
│   └── UXPage.jsx
├── data/mockData.js         ← delivery graph, rec graph, category tree
├── App.jsx
└── index.css
```

---

## 🧩 DSA Features

| Feature | Data Structure | File |
|---------|---------------|------|
| Book Search | HashMap | `useStore.jsx` |
| Cart | ArrayList | `useStore.jsx` |
| Undo Remove | Stack | `useStore.jsx` |
| Orders | Queue + PriorityQueue | `useStore.jsx` |
| Wishlist | HashSet | `useStore.jsx` |
| Price Filter | TreeMap | `useStore.jsx` |
| Genre Browse | N-ary Tree | `CategoryTree.jsx` |
| Delivery | Graph + Dijkstra | `useStore.jsx` |
| Recently Viewed | LinkedList | `useStore.jsx` |
| Discount | 0/1 Knapsack DP | `useStore.jsx` |
| Recommendations | Graph + BFS | `useStore.jsx` |

---

## 🗄️ Supabase Tables Used

`books` · `coupons` · `orders` · `wishlists` · `carts` · `recently_viewed`

See [`../BACKEND.md`](../BACKEND.md) for full backend docs.
See [`../supabase_setup.sql`](../supabase_setup.sql) to set up the database.
