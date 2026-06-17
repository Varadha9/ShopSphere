import { useStore, bfsRecommend } from "../store/useStore";
import { BOOK_DESCRIPTIONS } from "../data/mockData";

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

export default function BookDetailPage({ setPage }) {
  const { state, dispatch } = useStore();
  const book = state.selectedBook;

  if (!book) {
    setPage("Catalog");
    return null;
  }

  const wishlisted = state.wishlist.has(book.id);
  const inCart = state.cart.find(i => i.product.id === book.id);
  const ratingPct = Math.min(100, Math.round((book.rating / 5) * 100));
  const recs = bfsRecommend(book.id, state.catalog, 2);
  const description = BOOK_DESCRIPTIONS[book.id] || "A must-read book from our curated collection.";

  function addToCart() {
    dispatch({ type: "ADD_TO_CART", payload: { product: book } });
    dispatch({ type: "SHOW_TOAST", payload: { message: `"${book.name}" added to cart`, type: "success" } });
  }

  function toggleWishlist() {
    dispatch({ type: "TOGGLE_WISHLIST", payload: book.id });
    dispatch({
      type: "SHOW_TOAST",
      payload: {
        message: wishlisted ? `Removed from wishlist` : `Added to wishlist`,
        type: wishlisted ? "info" : "success",
      },
    });
  }

  function openRec(rec) {
    dispatch({ type: "VIEW_PRODUCT", payload: rec });
    dispatch({ type: "SELECT_BOOK", payload: rec });
  }

  return (
    <div className="book-detail-page">
      <button className="btn-back" onClick={() => setPage("Catalog")}>
        ← Back to Catalog
      </button>

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

          <div className="book-detail-rating">
            <span className="rating-star">★</span>
            <span className="rating-num">{book.rating}</span>
            <span className="rating-max">/ 5.0</span>
            <div className="rating-meter rating-meter-lg">
              <i style={{ width: `${ratingPct}%` }} />
            </div>
          </div>

          <p className="book-detail-desc">{description}</p>

          <div className="book-detail-tags">
            {book.tags.map(tag => (
              <button
                key={tag}
                className="tag-chip"
                onClick={() => {
                  dispatch({ type: "SEARCH", payload: tag });
                  setPage("Catalog");
                }}
              >
                #{tag}
              </button>
            ))}
          </div>

          <div className="book-detail-price-row">
            <span className="book-detail-price">₹{book.price.toLocaleString()}</span>
            {inCart && <span className="in-cart-badge">✓ {inCart.qty} in cart</span>}
          </div>

          <div className="book-detail-actions">
            <button className="btn-primary btn-detail-cart" onClick={addToCart}>
              🛒 {inCart ? "Add Another" : "Add to Cart"}
            </button>
            <button
              className={`btn-wishlist-lg ${wishlisted ? "wishlisted" : ""}`}
              onClick={toggleWishlist}
            >
              {wishlisted ? "♥ Wishlisted" : "♡ Save to Wishlist"}
            </button>
            <button className="btn-outline" onClick={() => setPage("Cart")}>
              View Cart →
            </button>
          </div>
        </div>
      </div>

      {recs.length > 0 && (
        <section className="book-detail-recs">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Graph + BFS — O(V+E)</span>
              <h2>Readers also bought</h2>
            </div>
          </div>
          <div className="book-detail-recs-grid">
            {recs.map(rec => (
              <div key={rec.id} className="rec-mini-card" onClick={() => openRec(rec)}>
                <div className="rec-mini-cover">
                  {BOOK_IMAGES[rec.id]
                    ? <img src={BOOK_IMAGES[rec.id]} alt={rec.name} />
                    : <span>📚</span>
                  }
                </div>
                <div className="rec-mini-info">
                  <strong>{rec.name}</strong>
                  <small>by {rec.author}</small>
                  <span className="price">₹{rec.price.toLocaleString()}</span>
                </div>
                <button
                  className="btn-primary btn-sm"
                  onClick={e => {
                    e.stopPropagation();
                    dispatch({ type: "ADD_TO_CART", payload: { product: rec } });
                    dispatch({ type: "SHOW_TOAST", payload: { message: `"${rec.name}" added to cart`, type: "success" } });
                  }}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
