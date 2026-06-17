import { useStore } from "../store/useStore";

const BOOK_IMAGES = {
  p1:  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80",
  p2:  "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80",
  p3:  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80",
  p4:  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&q=80",
  p5:  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80",
  p6:  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80",
  p7:  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80",
  p8:  "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&q=80",
  p9:  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80",
  p10: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=80",
  p11: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=400&q=80",
  p12: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
};

export default function ProductCard({ product, onSelect, setPage }) {
  const { state, dispatch } = useStore();
  const wishlisted = state.wishlist.has(product.id);
  const ratingPct = Math.min(100, Math.round((product.rating / 5) * 100));
  const img = BOOK_IMAGES[product.id];

  function handleView() {
    dispatch({ type: "VIEW_PRODUCT", payload: product });
    dispatch({ type: "SELECT_BOOK", payload: product });
    onSelect?.(product);
    if (setPage) setPage("BookDetail");
  }

  function handleAddToCart(e) {
    e.stopPropagation();
    dispatch({ type: "ADD_TO_CART", payload: { product } });
    dispatch({ type: "SHOW_TOAST", payload: { message: `“${product.name}” added to cart`, type: "success" } });
  }

  function handleWishlist(e) {
    e.stopPropagation();
    dispatch({ type: "TOGGLE_WISHLIST", payload: product.id });
    dispatch({
      type: "SHOW_TOAST",
      payload: {
        message: wishlisted ? `Removed from wishlist` : `“${product.name}” saved to wishlist`,
        type: wishlisted ? "info" : "success",
      },
    });
  }

  return (
    <article className="product-card" onClick={handleView}>
      <div className="book-cover">
        {img
          ? <img src={img} alt={product.name} className="book-cover-img" />
          : <span className="product-emoji">📚</span>
        }
        <span className="category-chip">{product.category}</span>
        <button
          className={`wishlist-btn ${wishlisted ? "wishlisted" : ""}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>
      <div className="product-copy">
        <h3>{product.name}</h3>
        <p className="author">by {product.author}</p>
        <div className="rating-row">
          <span>★ {product.rating}</span>
          <span className="rating-meter"><i style={{ width: `${ratingPct}%` }} /></span>
        </div>
      </div>
      <div className="price-row">
        <p className="price">₹{product.price.toLocaleString()}</p>
        <span>{product.tags[0]}</span>
      </div>
      <div className="card-actions-single" onClick={e => e.stopPropagation()}>
        <button className="btn-primary" onClick={handleAddToCart}>
          🛒 Add to Cart
        </button>
      </div>
    </article>
  );
}
