import { useState, useEffect, useCallback } from "react";
import { useStore } from "../store/useStore";
import { BOOK_META } from "../data/mockData";

const BOOK_IMAGES = {
  p1:  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
  p2:  "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
  p3:  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80",
  p4:  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80",
  p5:  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80",
  p6:  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80",
  p7:  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  p8:  "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=800&q=80",
  p9:  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80",
  p10: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
  p11: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=800&q=80",
  p12: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
};

const BADGE_COLORS = {
  "Bestseller":    { bg: "rgba(255,209,102,0.18)", border: "rgba(255,209,102,0.6)", color: "var(--amber)" },
  "#1 Bestseller": { bg: "rgba(255,106,168,0.18)", border: "rgba(255,106,168,0.6)", color: "var(--pink)" },
  "Award Winner":  { bg: "rgba(78,230,180,0.18)",  border: "rgba(78,230,180,0.6)",  color: "var(--mint)" },
  "Nobel Prize":   { bg: "rgba(78,230,180,0.18)",  border: "rgba(78,230,180,0.6)",  color: "var(--mint)" },
  "Classic":       { bg: "rgba(143,124,255,0.18)", border: "rgba(143,124,255,0.6)", color: "var(--violet)" },
  "Editor's Pick": { bg: "rgba(57,183,255,0.18)",  border: "rgba(57,183,255,0.6)",  color: "var(--blue)" },
  "Textbook":      { bg: "rgba(255,255,255,0.1)",  border: "rgba(255,255,255,0.3)", color: "var(--soft)" },
};

export default function ShelfSlider({ books, setPage, label, eyebrow, accentColor = "var(--mint)" }) {
  const { dispatch } = useStore();
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const [dir,     setDir]     = useState(1); // 1=next, -1=prev
  const [anim,    setAnim]    = useState(false);
  const total = books.length;

  const goTo = useCallback((i, direction = 1) => {
    setDir(direction);
    setAnim(true);
    setTimeout(() => {
      setCurrent((i + total) % total);
      setAnim(false);
    }, 380);
  }, [total]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => goTo(current + 1, 1), 4000);
    return () => clearInterval(id);
  }, [current, paused, goTo]);

  const book      = books[current];
  const img       = BOOK_IMAGES[book.id];
  const meta      = BOOK_META[book.id];
  const badge     = meta?.badge;
  const badgeStyle = badge ? BADGE_COLORS[badge] : null;

  function handleView() {
    dispatch({ type: "VIEW_PRODUCT", payload: book });
    dispatch({ type: "SELECT_BOOK",  payload: book });
    if (setPage) setPage("BookDetail");
  }

  function handleCart(e) {
    e.stopPropagation();
    dispatch({ type: "ADD_TO_CART", payload: { product: book } });
    dispatch({ type: "SHOW_TOAST",  payload: { message: `"${book.name}" added to cart`, type: "success" } });
  }

  return (
    <section
      className="slider-section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* header */}
      <div className="slider-header">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{label}</h2>
        </div>
        <div className="slider-dots">
          {books.map((_, i) => (
            <button
              key={i}
              className={`slider-dot ${i === current ? "slider-dot-active" : ""}`}
              style={i === current ? { background: accentColor, width: "22px" } : {}}
              onClick={() => { goTo(i, i > current ? 1 : -1); setPaused(true); setTimeout(() => setPaused(false), 2500); }}
            />
          ))}
        </div>
      </div>

      {/* progress bar */}
      <div className="slider-progress-track">
        <div className="slider-progress-fill" style={{ width: `${((current + 1) / total) * 100}%`, background: accentColor }} />
      </div>

      {/* main card */}
      <div
        className={`slider-card ${anim ? (dir === 1 ? "slide-out-left" : "slide-out-right") : "slide-in"}`}
        onClick={handleView}
      >
        {/* left: cover */}
        <div className="slider-cover-wrap">
          <div className="slider-cover">
            {img
              ? <img src={img} alt={book.name} />
              : <span>📚</span>
            }
          </div>
          {badge && (
            <span className="slider-badge" style={{ background: badgeStyle?.bg, color: badgeStyle?.color, border: `1px solid ${badgeStyle?.border}` }}>
              {badge}
            </span>
          )}
        </div>

        {/* right: info */}
        <div className="slider-info">
          <div className="slider-meta">
            <span className="slider-category">{book.category}</span>
            <span className="slider-rating">★ {book.rating}</span>
          </div>
          <h3 className="slider-title">{book.name}</h3>
          <p className="slider-author">by {book.author}</p>
          <p className="slider-price" style={{ color: accentColor }}>₹{book.price.toLocaleString()}</p>
          <div className="slider-actions" onClick={e => e.stopPropagation()}>
            <button className="btn-primary" onClick={handleCart}>🛒 Add to Cart</button>
            <button className="btn-outline" onClick={handleView}>View Details</button>
          </div>
        </div>

        {/* counter */}
        <span className="slider-counter">{current + 1} / {total}</span>
      </div>

      {/* arrows */}
      <button className="slider-arrow slider-prev"
        onClick={() => { goTo(current - 1, -1); setPaused(true); setTimeout(() => setPaused(false), 2500); }}>‹</button>
      <button className="slider-arrow slider-next"
        onClick={() => { goTo(current + 1,  1); setPaused(true); setTimeout(() => setPaused(false), 2500); }}>›</button>
    </section>
  );
}
