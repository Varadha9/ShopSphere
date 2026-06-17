import { useState } from "react";
import { useStore, bfsRecommend } from "../store/useStore";
import { BOOK_DESCRIPTIONS, BOOK_META, RATING_DIST } from "../data/mockData";

const BOOK_IMAGES = {
  p1:  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80",
  p2:  "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&q=80",
  p3:  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80",
  p4:  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&q=80",
  p5:  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80",
  p6:  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&q=80",
  p7:  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
  p8:  "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&q=80",
  p9:  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80",
  p10: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80",
  p11: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=600&q=80",
  p12: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
};

function getDeliveryDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export default function BookDetailPage({ setPage }) {
  const { state, dispatch } = useStore();
  const book = state.selectedBook;
  const [selectedFormat, setSelectedFormat] = useState(0);
  const [copied, setCopied]                 = useState(false);

  if (!book) { setPage("Catalog"); return null; }

  const wishlisted = state.wishlist.has(book.id);
  const inCart     = state.cart.find(i => i.product.id === book.id);
  const ratingPct  = Math.min(100, Math.round((book.rating / 5) * 100));
  const meta       = BOOK_META[book.id] || {};
  const dist       = RATING_DIST[book.id] || [0, 0, 0, 0, 0];
  const totalReviews = dist.reduce((s, n) => s + n, 0);
  const description = BOOK_DESCRIPTIONS[book.id] || "A must-read from our curated collection.";

  // More by same author
  const sameAuthor = state.catalog.filter(p => p.author === book.author && p.id !== book.id);

  // BFS recs
  const recs = bfsRecommend(book.id, state.catalog, 2);

  function addToCart() {
    dispatch({ type: "ADD_TO_CART", payload: { product: book } });
    dispatch({ type: "SHOW_TOAST", payload: { message: `"${book.name}" added to cart`, type: "success" } });
  }

  function toggleWishlist() {
    dispatch({ type: "TOGGLE_WISHLIST", payload: book.id });
    dispatch({ type: "SHOW_TOAST", payload: { message: wishlisted ? "Removed from wishlist" : "Added to wishlist", type: wishlisted ? "info" : "success" } });
  }

  function share() {
    const text = `Check out "${book.name}" by ${book.author} on BookSphere — ₹${book.price}`;
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function openBook(b) {
    dispatch({ type: "VIEW_PRODUCT", payload: b });
    dispatch({ type: "SELECT_BOOK",  payload: b });
  }

  return (
    <div className="book-detail-page">

      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <span onClick={() => setPage("Catalog")}>All Books</span>
        <span className="bc-sep">›</span>
        <span onClick={() => setPage("Catalog")}>{book.category}</span>
        <span className="bc-sep">›</span>
        <span className="bc-active">{book.name}</span>
      </nav>

      {/* Main hero */}
      <div className="book-detail-hero">
        <div className="book-detail-cover">
          {BOOK_IMAGES[book.id]
            ? <img src={BOOK_IMAGES[book.id]} alt={book.name} />
            : <span>📚</span>
          }
        </div>

        <div className="book-detail-info">
          <span className="category-chip-lg">{book.category}</span>
          <h1 className="book-detail-title">{book.name}</h1>
          <p className="book-detail-author">by <strong>{book.author}</strong></p>

          {/* Rating row */}
          <div className="book-detail-rating">
            <span className="rating-star">★</span>
            <span className="rating-num">{book.rating}</span>
            <span className="rating-max">/ 5.0</span>
            <div className="rating-meter rating-meter-lg">
              <i style={{ width: `${ratingPct}%` }} />
            </div>
            <span className="review-count">({totalReviews.toLocaleString()} reviews)</span>
          </div>

          {/* Star breakdown (Amazon-style) */}
          <div className="star-breakdown">
            {[5, 4, 3, 2, 1].map((star, i) => {
              const count = dist[4 - i];
              const pct   = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={star} className="star-row">
                  <span className="star-label">{star}★</span>
                  <div className="star-bar"><div className="star-fill" style={{ width: `${pct}%` }} /></div>
                  <span className="star-pct">{pct}%</span>
                </div>
              );
            })}
          </div>

          {/* Format selector */}
          {meta.formats?.length > 1 && (
            <div className="format-selector">
              <span className="format-label">Format:</span>
              {meta.formats.map((f, i) => (
                <button
                  key={f}
                  className={`format-btn ${selectedFormat === i ? "active" : ""}`}
                  onClick={() => setSelectedFormat(i)}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          <p className="book-detail-desc">{description}</p>

          {/* Tags */}
          <div className="book-detail-tags">
            {book.tags.map(tag => (
              <button key={tag} className="tag-chip"
                onClick={() => { dispatch({ type: "SEARCH", payload: tag }); setPage("Catalog"); }}>
                #{tag}
              </button>
            ))}
          </div>

          {/* Price + availability */}
          <div className="book-detail-price-row">
            <span className="book-detail-price">₹{book.price.toLocaleString()}</span>
            <span className="avail-chip-lg">✓ In Stock</span>
            {inCart && <span className="in-cart-badge">✓ {inCart.qty} in cart</span>}
          </div>

          {/* Delivery estimate */}
          <div className="delivery-estimate">
            <span>🚚</span>
            <div>
              <strong>Standard delivery: {getDeliveryDate(5)}</strong>
              <small>Express delivery: {getDeliveryDate(2)} · Free on orders ₹499+</small>
            </div>
          </div>

          {/* Actions */}
          <div className="book-detail-actions">
            <button className="btn-primary btn-detail-cart" onClick={addToCart}>
              🛒 {inCart ? "Add Another" : "Add to Cart"}
            </button>
            <button className={`btn-wishlist-lg ${wishlisted ? "wishlisted" : ""}`} onClick={toggleWishlist}>
              {wishlisted ? "♥ Wishlisted" : "♡ Wishlist"}
            </button>
            <button className="btn-outline" onClick={() => setPage("Cart")}>View Cart →</button>
            <button className="btn-share" onClick={share}>{copied ? "✓ Copied!" : "🔗 Share"}</button>
          </div>
        </div>

        {/* Book metadata panel */}
        <div className="book-meta-panel">
          <h4>Book Details</h4>
          <div className="meta-rows">
            {meta.publisher && <div className="meta-row"><span>Publisher</span><strong>{meta.publisher}</strong></div>}
            {meta.year      && <div className="meta-row"><span>Year</span><strong>{meta.year}</strong></div>}
            {meta.pages     && <div className="meta-row"><span>Pages</span><strong>{meta.pages}</strong></div>}
            {meta.isbn      && <div className="meta-row"><span>ISBN</span><strong className="mono">{meta.isbn}</strong></div>}
            <div className="meta-row"><span>Language</span><strong>English</strong></div>
            <div className="meta-row"><span>Category</span><strong>{book.category}</strong></div>
          </div>
        </div>
      </div>

      {/* More by same author */}
      {sameAuthor.length > 0 && (
        <section className="book-detail-recs">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Same author</span>
              <h2>More by {book.author}</h2>
            </div>
          </div>
          <div className="book-detail-recs-grid">
            {sameAuthor.map(rec => <RecMiniCard key={rec.id} rec={rec} dispatch={dispatch} onOpen={openBook} />)}
          </div>
        </section>
      )}

      {/* BFS Recommendations */}
      {recs.length > 0 && (
        <section className="book-detail-recs">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Graph + BFS · O(V+E)</span>
              <h2>Customers also bought</h2>
            </div>
          </div>
          <div className="book-detail-recs-grid">
            {recs.map(rec => <RecMiniCard key={rec.id} rec={rec} dispatch={dispatch} onOpen={openBook} />)}
          </div>
        </section>
      )}

      {/* Customers also viewed */}
      {state.recentProducts.filter(p => p.id !== book.id).length > 0 && (
        <section className="book-detail-recs">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Your browsing history</span>
              <h2>Customers also viewed</h2>
            </div>
          </div>
          <div className="book-detail-recs-grid">
            {state.recentProducts.filter(p => p.id !== book.id).map(rec => (
              <RecMiniCard key={rec.id} rec={rec} dispatch={dispatch} onOpen={openBook} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function RecMiniCard({ rec, dispatch, onOpen }) {
  const img = {
    p1:"https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&q=80",
    p2:"https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=200&q=80",
    p3:"https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&q=80",
    p4:"https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&q=80",
    p5:"https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&q=80",
    p6:"https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&q=80",
    p7:"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&q=80",
    p8:"https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=200&q=80",
    p9:"https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200&q=80",
    p10:"https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&q=80",
    p11:"https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=200&q=80",
    p12:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
  }[rec.id];

  return (
    <div className="rec-mini-card" onClick={() => onOpen(rec)}>
      <div className="rec-mini-cover">
        {img ? <img src={img} alt={rec.name} /> : <span>📚</span>}
      </div>
      <div className="rec-mini-info">
        <strong>{rec.name}</strong>
        <small>by {rec.author}</small>
        <span className="price">₹{rec.price.toLocaleString()}</span>
        <small style={{ color: "var(--amber)" }}>★ {rec.rating}</small>
      </div>
      <button
        className="btn-primary btn-sm"
        onClick={e => {
          e.stopPropagation();
          dispatch({ type: "ADD_TO_CART",  payload: { product: rec } });
          dispatch({ type: "SHOW_TOAST",   payload: { message: `"${rec.name}" added to cart`, type: "success" } });
        }}
      >Add</button>
    </div>
  );
}
