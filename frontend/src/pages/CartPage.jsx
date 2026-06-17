import { useState } from "react";
import { useStore, knapsackDiscount } from "../store/useStore";

const BOOK_IMAGES = {
  p1:"https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=120&q=80",
  p2:"https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=120&q=80",
  p3:"https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=120&q=80",
  p4:"https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=120&q=80",
  p5:"https://images.unsplash.com/photo-1532012197267-da84d127e765?w=120&q=80",
  p6:"https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=120&q=80",
  p7:"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&q=80",
  p8:"https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=120&q=80",
  p9:"https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=120&q=80",
  p10:"https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=120&q=80",
  p11:"https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=120&q=80",
  p12:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&q=80",
};

function getDeliveryDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export default function CartPage({ setPage }) {
  const { state, dispatch } = useStore();
  const [discountResult, setDiscountResult] = useState(null);

  const subtotal  = state.cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const discount  = discountResult?.total || 0;
  const total     = Math.max(0, subtotal - discount);
  const itemCount = state.cart.reduce((s, i) => s + i.qty, 0);

  function applyDiscount() {
    setDiscountResult(knapsackDiscount(state.coupons, subtotal));
  }

  function placeOrder() {
    if (!state.cart.length) return;
    dispatch({ type: "PLACE_ORDER", payload: { discount } });
    dispatch({ type: "SHOW_TOAST", payload: { message: `Order placed!${discount > 0 ? ` ₹${discount} discount applied.` : ""}`, type: "success" } });
    setDiscountResult(null);
    setPage("Orders");
  }

  return (
    <div className="page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Your shopping basket</span>
          <h2>🛒 Cart {itemCount > 0 && <span className="cart-count-badge">{itemCount} {itemCount === 1 ? "item" : "items"}</span>}</h2>
        </div>
      </div>

      {state.cart.length === 0 ? (
        <div className="cart-empty-state">
          <span className="cart-empty-icon">🛒</span>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet.</p>
          <button className="btn-primary" onClick={() => setPage("Catalog")}>Browse Books →</button>
        </div>
      ) : (
        <div className="cart-layout">

          {/* Left: items */}
          <div className="cart-items-col">

            {/* Undo banner */}
            {state.undoStack.length > 0 && (
              <div className="undo-banner">
                <span>"{state.undoStack[0].product.name}" removed</span>
                <button onClick={() => dispatch({ type: "UNDO_REMOVE" })}>↩ Undo</button>
              </div>
            )}

            {state.cart.map(({ product, qty }) => (
              <div key={product.id} className="cart-item-row">
                <div className="cart-item-thumb">
                  {BOOK_IMAGES[product.id]
                    ? <img src={BOOK_IMAGES[product.id]} alt={product.name} />
                    : <span>📚</span>
                  }
                </div>
                <div className="cart-item-info">
                  <h4
                    className="cart-item-title"
                    onClick={() => { dispatch({ type: "SELECT_BOOK", payload: product }); setPage("BookDetail"); }}
                  >{product.name}</h4>
                  <p className="cart-item-author">by {product.author}</p>
                  <p className="cart-item-avail">✓ In Stock · Delivery by {getDeliveryDate(5)}</p>
                  <div className="cart-item-controls">
                    <div className="qty-stepper">
                      <button onClick={() => dispatch({ type: "ADD_TO_CART", payload: { product, qty: -1 } })}>−</button>
                      <span>{qty}</span>
                      <button onClick={() => dispatch({ type: "ADD_TO_CART", payload: { product } })}>+</button>
                    </div>
                    <button className="btn-danger btn-xs"
                      onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: product.id })}>
                      🗑 Remove
                    </button>
                    <button className="btn-xs"
                      onClick={() => { dispatch({ type: "TOGGLE_WISHLIST", payload: product.id }); dispatch({ type: "SHOW_TOAST", payload: { message: "Saved to wishlist", type: "info" } }); }}>
                      ♡ Save for later
                    </button>
                  </div>
                </div>
                <div className="cart-item-price">
                  <strong>₹{(product.price * qty).toLocaleString()}</strong>
                  {qty > 1 && <small>₹{product.price.toLocaleString()} each</small>}
                </div>
              </div>
            ))}

            {/* Coupons */}
            <div className="coupons-info">
              <h4>🏷️ Available Coupons</h4>
              <div className="coupon-list">
                {state.coupons.map(c => (
                  <span key={c.id} className="coupon-chip">{c.label}: ₹{c.discount} off on ₹{c.minSpend}+</span>
                ))}
              </div>
              <button className="btn-sm" style={{ marginTop: 12 }} onClick={applyDiscount}>
                💸 Apply Best Discount (DP Knapsack)
              </button>
              {discountResult && (
                <div className="discount-result" style={{ marginTop: 12 }}>
                  {discountResult.total > 0 ? (
                    <>
                      <p>✓ Best saving: <strong>₹{discountResult.total}</strong> off</p>
                      <p>Applied: {discountResult.selected.map(c => <span key={c.id} className="coupon-chip">{c.label}</span>)}</p>
                    </>
                  ) : (
                    <p className="empty" style={{ padding: "8px 0" }}>No coupons applicable for this total.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: sticky order summary */}
          <div className="cart-summary-col">
            <div className="cart-summary-panel">
              <h3>Order Summary</h3>
              <div className="summary-rows">
                <div className="summary-row"><span>Subtotal ({itemCount} items)</span><strong>₹{subtotal.toLocaleString()}</strong></div>
                {discount > 0 && <div className="summary-row discount-row"><span>Coupon discount</span><strong>−₹{discount.toLocaleString()}</strong></div>}
                <div className="summary-row"><span>Delivery</span><strong className="free-tag">FREE</strong></div>
                <div className="summary-row total-row"><span>Total</span><strong>₹{total.toLocaleString()}</strong></div>
              </div>
              <button className="btn-primary btn-place-order" onClick={placeOrder}>
                Place Order {state.user?.isPremium ? "⭐ Premium" : ""}
              </button>
              <p className="summary-note">🔒 Secure checkout · No hidden charges</p>
              <p className="summary-delivery">🚚 Estimated delivery: {getDeliveryDate(5)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
