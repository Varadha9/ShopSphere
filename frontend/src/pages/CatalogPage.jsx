import { useState } from "react";
import { useStore } from "../store/useStore";
import ProductCard from "../components/ProductCard";
import CategoryTree from "../components/CategoryTree";
import { CATEGORY_TREE } from "../data/mockData";

const SORT_OPTIONS = [
  { value: "default",    label: "Featured" },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating",     label: "Highest Rated" },
];

// Trending = top 4 by rating; New Arrivals = last 4 in catalog (simulated)
const TRENDING_IDS  = ["p3", "p1", "p6", "p12"];
const NEW_IDS       = ["p12", "p10", "p9", "p6"];

export default function CatalogPage({ setPage }) {
  const { state, dispatch } = useStore();
  const [searchKw, setSearchKw]   = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

  const { min, max } = state.priceFilter;
  const sortBy = state.sortBy;

  // Price filter
  let products = state.priceSorted.filter(p => p.price >= min && p.price <= max);

  // Category filter
  if (selectedCat !== "All") {
    products = products.filter(p =>
      p.category === selectedCat ||
      p.tags.some(t => t.toLowerCase() === selectedCat.toLowerCase())
    );
  }

  // Sort
  const sorted = [...products].sort((a, b) => {
    if (sortBy === "price-asc")  return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating")     return b.rating - a.rating;
    return 0;
  });

  // Search overrides everything
  const displayProducts = state.searchResults ? state.searchResults.results : sorted;
  const featured = state.catalog[0];

  const trending   = state.catalog.filter(p => TRENDING_IDS.includes(p.id));
  const newArrivals = state.catalog.filter(p => NEW_IDS.includes(p.id));

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

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="catalog-hero">
        <div className="hero-copy">
          <span className="eyebrow">Modern bookstore experience</span>
          <h1>Discover books that fit the way you think.</h1>
          <p>Search by topic, browse smart collections, save favourites, and checkout through a data-structure powered shopping flow.</p>
          <form className="search-bar hero-search" onSubmit={handleSearch}>
            <input
              placeholder="Search by title, author, tag: programming, scifi, habits..."
              value={searchKw}
              onChange={e => setSearchKw(e.target.value)}
            />
            <button type="submit">Search</button>
            {state.searchResults && (
              <button type="button" onClick={() => { dispatch({ type: "CLEAR_SEARCH" }); setSearchKw(""); }}>✕ Clear</button>
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
          <div className="orbit-card orbit-two">Free delivery</div>
          <div className="orbit-card orbit-three">Smart routes</div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="stat-strip">
        <div><strong>{state.catalog.length}</strong><span>Curated titles</span></div>
        <div><strong>{state.wishlist.size}</strong><span>Saved books</span></div>
        <div><strong>{displayProducts.length}</strong><span>Results</span></div>
        <div><strong>Free</strong><span>Delivery</span></div>
      </section>

      {/* ── Trending ─────────────────────────────────────── */}
      {!state.searchResults && selectedCat === "All" && (
        <section className="shelf-section">
          <div className="shelf-heading">
            <div>
              <span className="eyebrow">Most popular</span>
              <h2>🔥 Trending Now</h2>
            </div>
          </div>
          <div className="shelf-row">
            {trending.map(p => <ProductCard key={p.id} product={p} setPage={setPage} compact />)}
          </div>
        </section>
      )}

      {/* ── New Arrivals ──────────────────────────────────── */}
      {!state.searchResults && selectedCat === "All" && (
        <section className="shelf-section">
          <div className="shelf-heading">
            <div>
              <span className="eyebrow">Just added</span>
              <h2>✨ New Arrivals</h2>
            </div>
          </div>
          <div className="shelf-row">
            {newArrivals.map(p => <ProductCard key={p.id} product={p} setPage={setPage} compact />)}
          </div>
        </section>
      )}

      {/* ── Main catalog layout ──────────────────────────── */}
      <div className="catalog-layout">
        <aside className="sidebar">
          <section>
            <h4>🗂️ Browse by Genre</h4>
            <CategoryTree
              node={CATEGORY_TREE}
              onSelect={cat => { setSelectedCat(cat); dispatch({ type: "CLEAR_SEARCH" }); }}
              selected={selectedCat}
            />
          </section>

          <section>
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
              <h4 style={{ margin: 0 }}>💖 Wishlist {state.wishlist.size > 0 && (
                <span style={{ background: "var(--mint)", color: "#000", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 800, padding: "1px 7px", marginLeft: 6 }}>{state.wishlist.size}</span>
              )}</h4>
              {state.wishlist.size > 0 && <button className="btn-xs" onClick={() => setPage("Wishlist")}>View All</button>}
            </div>
            {state.wishlist.size === 0 ? (
              <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Tap ♡ on any book to save it here.</p>
            ) : (
              <ul className="wishlist-list">
                {[...state.wishlist].slice(0, 5).map(id => {
                  const p = state.catalog.find(x => x.id === id);
                  return p ? <li key={id}>
                    <span style={{ cursor: "pointer" }} onClick={() => { dispatch({ type: "SELECT_BOOK", payload: p }); setPage("BookDetail"); }}>{p.name}</span>
                    <button className="btn-xs" onClick={() => dispatch({ type: "TOGGLE_WISHLIST", payload: id })}>✕</button>
                  </li> : null;
                })}
              </ul>
            )}
          </section>

          {state.recentProducts.length > 0 && (
            <section>
              <h4>🕐 Recently Viewed</h4>
              <ul className="recent-list">
                {state.recentProducts.map(p => (
                  <li key={p.id} className="recent-list-item"
                    onClick={() => { dispatch({ type: "SELECT_BOOK", payload: p }); setPage("BookDetail"); }}>
                    {p.name}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        <main className="catalog-main">
          {/* breadcrumb */}
          <nav className="breadcrumb">
            <span onClick={() => setSelectedCat("All")}>All Books</span>
            {selectedCat !== "All" && <><span className="bc-sep">›</span><span className="bc-active">{selectedCat}</span></>}
            {state.searchResults && <><span className="bc-sep">›</span><span className="bc-active">Search: "{state.searchResults.keyword}"</span></>}
          </nav>

          <div className="catalog-toolbar">
            <div>
              <span className="eyebrow">Library shelf</span>
              <h2>{state.searchResults ? `Results for "${state.searchResults.keyword}"` : selectedCat === "All" ? "All Books" : selectedCat}</h2>
            </div>
            <div className="toolbar-right">
              <span className="result-count">{displayProducts.length} books</span>
              <div className="sort-bar">
                <span>Sort:</span>
                {SORT_OPTIONS.map(o => (
                  <button
                    key={o.value}
                    className={`sort-btn ${sortBy === o.value ? "active" : ""}`}
                    onClick={() => dispatch({ type: "SET_SORT", payload: o.value })}
                  >{o.label}</button>
                ))}
              </div>
            </div>
          </div>

          {state.searchResults && state.searchResults.results.length === 0 && (
            <div className="no-results">
              <p>No results for <strong>"{state.searchResults.keyword}"</strong></p>
              <p className="no-results-hint">Try: <span onClick={() => { dispatch({ type: "SEARCH", payload: "programming" }); }}>programming</span>, <span onClick={() => { dispatch({ type: "SEARCH", payload: "fiction" }); }}>fiction</span>, <span onClick={() => { dispatch({ type: "SEARCH", payload: "habits" }); }}>habits</span></p>
            </div>
          )}

          <div className="product-grid">
            {displayProducts.length
              ? displayProducts.map(p => <ProductCard key={p.id} product={p} setPage={setPage} />)
              : (!state.searchResults && <p className="empty">No books match these filters.</p>)
            }
          </div>
        </main>
      </div>
    </div>
  );
}
