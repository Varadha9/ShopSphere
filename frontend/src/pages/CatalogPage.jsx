import { useState } from "react";
import { useStore } from "../store/useStore";
import ProductCard from "../components/ProductCard";
import CategoryTree from "../components/CategoryTree";
import { CATEGORY_TREE } from "../data/mockData";

export default function CatalogPage({ setPage }) {
  const { state, dispatch } = useStore();
  const [searchKw, setSearchKw] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

  const { min, max } = state.priceFilter;

  // Price filter uses priceSorted (TreeMap equivalent — pre-sorted array, range slice)
  let products = state.priceSorted.filter(p => p.price >= min && p.price <= max);

  // Category filter (CategoryTree selection)
  if (selectedCat !== "All") {
    products = products.filter(p =>
      p.category === selectedCat ||
      p.tags.some(t => t.toLowerCase() === selectedCat.toLowerCase())
    );
  }

  // Search overrides (HashMap lookup)
  const displayProducts = state.searchResults ? state.searchResults.results : products;
  const featured = state.catalog[0];

  if (!state.catalog.length) {
    return (
      <div className="page">
        <p className="empty">No books loaded yet. Check your Supabase environment variables and run the SQL setup.</p>
      </div>
    );
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchKw.trim()) dispatch({ type: "SEARCH", payload: searchKw.trim() });
    else dispatch({ type: "CLEAR_SEARCH" });
  }

  return (
    <div className="catalog-page">
      <section className="catalog-hero">
        <div className="hero-copy">
          <span className="eyebrow">Modern bookstore experience</span>
          <h1>Discover books that fit the way you think.</h1>
          <p>Search by topic, browse smart collections, save favorites, and checkout through a beautiful data-structure powered shopping flow.</p>
          <form className="search-bar hero-search" onSubmit={handleSearch}>
            <input placeholder="Search tags: programming, scifi, productivity, classic..."
              value={searchKw} onChange={e => setSearchKw(e.target.value)} />
            <button type="submit">Search</button>
            {state.searchResults && (
              <button type="button" onClick={() => { dispatch({ type: "CLEAR_SEARCH" }); setSearchKw(""); }}>Clear</button>
            )}
          </form>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="floating-book main-book">
            <span>📚</span>
            <strong>{featured.name}</strong>
            <small>{featured.author}</small>
          </div>
          <div className="orbit-card orbit-one">4.9 rated</div>
          <div className="orbit-card orbit-two">Fast checkout</div>
          <div className="orbit-card orbit-three">Smart routes</div>
        </div>
      </section>

      <section className="stat-strip">
        <div><strong>{state.catalog.length}</strong><span>Curated titles</span></div>
        <div><strong>{state.wishlist.size}</strong><span>Saved books</span></div>
        <div><strong>{displayProducts.length}</strong><span>Visible results</span></div>
        <div><strong>O(1)</strong><span>Tag search</span></div>
      </section>

      <div className="catalog-layout">
      <aside className="sidebar">
        <section>
          {/* DSA: Custom N-ary Tree  →  each node holds name + children[]
               DFS traversal powers genre filter and breadcrumb. O(n) */}
          <h4>🗂️ Browse by Genre</h4>
          <CategoryTree node={CATEGORY_TREE} onSelect={cat => { setSelectedCat(cat); dispatch({ type: "CLEAR_SEARCH" }); }} selected={selectedCat} />
        </section>

        <section>
          {/* DSA: TreeMap<Double, List<Book>>  →  java.util.TreeMap (Red-Black Tree)
               Books sorted by price at insert time. Range slice in O(log n) */}
          <h4>💰 Price Range</h4>
          <div className="price-inputs">
            <input type="number" placeholder="Min" value={min === 0 ? "" : min}
              onChange={e => dispatch({ type: "SET_PRICE_FILTER", payload: { min: +e.target.value || 0, max } })} />
            <span>–</span>
            <input type="number" placeholder="Max" value={max === 99999 ? "" : max}
              onChange={e => dispatch({ type: "SET_PRICE_FILTER", payload: { min, max: +e.target.value || 99999 } })} />
          </div>
          <button className="btn-sm" onClick={() => dispatch({ type: "SET_PRICE_FILTER", payload: { min: 0, max: 99999 } })}>
            Reset
          </button>
        </section>

        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <h4 style={{ margin: 0 }}>💖 Wishlist {state.wishlist.size > 0 && <span style={{ background: "var(--mint)", color: "#000", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 800, padding: "1px 7px", marginLeft: 6 }}>{state.wishlist.size}</span>}</h4>
            {state.wishlist.size > 0 && (
              <button className="btn-xs" onClick={() => setPage("Wishlist")}>View All</button>
            )}
          </div>
          {/* DSA: HashSet<String>  →  java.util.HashSet
               Stores unique book IDs. Add/remove/contains all O(1) average */}
          {state.wishlist.size === 0 ? (
            <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Tap ♡ on any book to save it here.</p>
          ) : (
            <ul className="wishlist-list">
              {[...state.wishlist].slice(0, 5).map(id => {
                const p = state.catalog.find(x => x.id === id);
                return p ? <li key={id}>
                  {p.name}
                  <button className="btn-xs" onClick={() => dispatch({ type: "TOGGLE_WISHLIST", payload: id })}>✕</button>
                </li> : null;
              })}
            </ul>
          )}
        </section>

        {state.recentProducts.length > 0 && (
          <section>
            <h4>🕐 Recently Viewed</h4>
            {/* DSA: LinkedList<Book>  →  java.util.LinkedList
                 Sliding window: addFirst() + removeLast() when size > MAX_RECENT. O(1) */}
            <ul className="recent-list">
              {state.recentProducts.map(p => <li key={p.id}>{p.name}</li>)}
            </ul>
          </section>
        )}
      </aside>

      <main className="catalog-main">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Library shelf</span>
            <h2>{selectedCat === "All" ? "Featured collection" : selectedCat}</h2>
          </div>
          <button className="btn-primary" onClick={() => setPage("Recommendations")}>Get recommendations</button>
        </div>

        {state.searchResults && (
          <p className="search-info">
            Results for <strong>{state.searchResults.keyword}</strong> - {state.searchResults.results.length} found
          </p>
        )}

        <div className="product-grid">
          {displayProducts.length
            ? displayProducts.map(p => <ProductCard key={p.id} product={p} />)
            : <p className="empty">No products found.</p>
          }
        </div>
      </main>
      </div>
    </div>
  );
}
