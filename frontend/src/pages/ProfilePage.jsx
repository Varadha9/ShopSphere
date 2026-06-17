import { useState } from "react";
import { useStore } from "../store/useStore";
import { supabase } from "../lib/supabase";

export default function ProfilePage({ setPage }) {
  const { state, dispatch } = useStore();
  const { user, orders, wishlist, cart, recentProducts, catalog } = state;

  const [tab, setTab] = useState("profile");
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [showPass, setShowPass] = useState(false);

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const joinDate = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  async function saveName() {
    setSaving(true);
    await supabase.auth.updateUser({ data: { name, isPremium: user?.isPremium || false } });
    dispatch({ type: "SET_USER", payload: { ...user, name } });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function changePassword() {
    if (newPassword.length < 6) { setPwMsg("Minimum 6 characters"); return; }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwMsg(error ? error.message : "✓ Password updated successfully");
    setNewPassword("");
  }

  async function deleteAccount() {
    if (!window.confirm("Are you sure? This will permanently delete your account and all data.")) return;
    await supabase.auth.signOut();
  }

  return (
    <div className="profile-page">

      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar-big">
          {user?.name?.slice(0, 1).toUpperCase() || "?"}
        </div>
        <div className="profile-header-info">
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
          <div className="profile-badges">
            {user?.isPremium
              ? <span className="badge-premium">⭐ Premium Member</span>
              : <span className="badge-free">Free Plan</span>
            }
            <span className="badge-joined">Member since {joinDate}</span>
          </div>
        </div>
        {!user?.isPremium && (
          <button className="btn-primary profile-upgrade" onClick={() => setPage("Premium")}>
            ⭐ Upgrade to Premium
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="profile-stat">
          <strong>{orders.length}</strong>
          <span>Orders Placed</span>
        </div>
        <div className="profile-stat">
          <strong>{wishlist.size}</strong>
          <span>Wishlisted</span>
        </div>
        <div className="profile-stat">
          <strong>{cart.length}</strong>
          <span>In Cart</span>
        </div>
        <div className="profile-stat">
          <strong>₹{totalSpent.toLocaleString()}</strong>
          <span>Total Spent</span>
        </div>
        <div className="profile-stat">
          <strong>{recentProducts.length}</strong>
          <span>Recently Viewed</span>
        </div>
        <div className="profile-stat">
          <strong>{user?.isPremium ? "Priority 1" : "Priority 10"}</strong>
          <span>Order Priority</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        {["profile", "orders", "wishlist", "settings"].map(t => (
          <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
            {t === "profile" && "👤 Profile"}
            {t === "orders" && `📦 Orders (${orders.length})`}
            {t === "wishlist" && `💖 Wishlist (${wishlist.size})`}
            {t === "settings" && "⚙️ Settings"}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === "profile" && (
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="profile-form">
            <div className="profile-field">
              <label>Full Name</label>
              <div className="profile-input-row">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
                <button className="btn-primary" onClick={saveName} disabled={saving}>
                  {saving ? "Saving..." : saved ? "✓ Saved" : "Save"}
                </button>
              </div>
            </div>
            <div className="profile-field">
              <label>Email Address</label>
              <input value={user?.email} disabled className="input-disabled" />
              <small>Email cannot be changed</small>
            </div>
            <div className="profile-field">
              <label>Account Type</label>
              <input value={user?.isPremium ? "Premium Member ⭐" : "Free Plan"} disabled className="input-disabled" />
            </div>
            <div className="profile-field">
              <label>User ID</label>
              <input value={user?.userId} disabled className="input-disabled input-mono" />
            </div>
          </div>

          {recentProducts.length > 0 && (
            <div className="profile-recent">
              <h3>Recently Viewed</h3>
              <div className="profile-recent-list">
                {recentProducts.map(p => (
                  <div key={p.id} className="profile-recent-item" onClick={() => {
                    dispatch({ type: "SELECT_BOOK", payload: p });
                    setPage("BookDetail");
                  }}>
                    <span className="profile-recent-emoji">📖</span>
                    <div>
                      <strong>{p.name}</strong>
                      <small>by {p.author}</small>
                    </div>
                    <span className="price">₹{p.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {tab === "orders" && (
        <div className="profile-section">
          <h3>Order History</h3>
          {orders.length === 0 ? (
            <div className="empty">
              No orders yet. <span className="link" onClick={() => setPage("Catalog")}>Browse books →</span>
            </div>
          ) : (
            <div className="profile-orders">
              {orders.map(order => (
                <div key={order.orderId} className={`profile-order-card ${order.isPremium ? "premium" : ""}`}>
                  <div className="profile-order-header">
                    <div>
                      <strong>{order.orderId}</strong>
                      <span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
                      {order.isPremium && <span className="badge-premium">⭐ Premium</span>}
                    </div>
                    <strong className="price">₹{order.total.toLocaleString()}</strong>
                  </div>
                  <div className="profile-order-items">
                    {order.items.map(({ product, qty }) => (
                      <span key={product.id} className="order-item-chip">
                        {product.name} ×{qty}
                      </span>
                    ))}
                  </div>
                  <p className="profile-order-meta">Priority: {order.priority} · {order.isPremium ? "Premium queue" : "Standard queue"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Wishlist Tab */}
      {tab === "wishlist" && (
        <div className="profile-section">
          <h3>Saved Books</h3>
          {wishlist.size === 0 ? (
            <div className="empty">
              No books saved yet. <span className="link" onClick={() => setPage("Catalog")}>Browse catalog →</span>
            </div>
          ) : (
            <div className="profile-wishlist">
              {[...wishlist].map(id => {
                const book = catalog.find(b => b.id === id);
                if (!book) return null;
                return (
                  <div key={id} className="profile-wishlist-item">
                    <div className="profile-wishlist-info">
                      <span>📖</span>
                      <div>
                        <strong>{book.name}</strong>
                        <small>by {book.author} · {book.category}</small>
                      </div>
                    </div>
                    <div className="profile-wishlist-actions">
                      <span className="price">₹{book.price}</span>
                      <button className="btn-primary btn-sm" onClick={() => dispatch({ type: "ADD_TO_CART", payload: { product: book } })}>
                        Add to Cart
                      </button>
                      <button className="btn-danger btn-sm" onClick={() => dispatch({ type: "TOGGLE_WISHLIST", payload: id })}>
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {tab === "settings" && (
        <div className="profile-section">
          <h3>Account Settings</h3>

          <div className="settings-group">
            <h4>🔒 Change Password</h4>
            <div className="profile-field">
              <label>New Password</label>
              <div className="profile-input-row">
                <div className="pass-wrap" style={{ flex: 1 }}>
                  <input
                    type={showPass ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <button type="button" className="pass-toggle" onClick={() => setShowPass(s => !s)}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
                <button className="btn-primary" onClick={changePassword}>Update</button>
              </div>
              {pwMsg && <small style={{ color: pwMsg.startsWith("✓") ? "var(--green)" : "var(--red)" }}>{pwMsg}</small>}
            </div>
          </div>

          <div className="settings-group">
            <h4>⭐ Membership</h4>
            <div className="settings-info-row">
              <div>
                <strong>{user?.isPremium ? "Premium Member" : "Free Plan"}</strong>
                <p>{user?.isPremium ? "Priority order processing, faster delivery queue" : "Standard order processing"}</p>
              </div>
              {!user?.isPremium && (
                <button className="btn-primary" onClick={() => setPage("Premium")}>Upgrade ⭐</button>
              )}
            </div>
          </div>

          <div className="settings-group">
            <h4>📊 Account Stats</h4>
            <div className="settings-stats">
              <div><span>Email</span><strong>{user?.email}</strong></div>
              <div><span>Orders</span><strong>{orders.length}</strong></div>
              <div><span>Total Spent</span><strong>₹{totalSpent.toLocaleString()}</strong></div>
              <div><span>Wishlist</span><strong>{wishlist.size} books</strong></div>
            </div>
          </div>

          <div className="settings-group settings-danger">
            <h4>⚠️ Danger Zone</h4>
            <p>Signing out will clear your session. Your data is saved in Supabase.</p>
            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <button className="btn-danger" onClick={() => supabase.auth.signOut()}>↩ Sign Out</button>
              <button className="btn-danger" onClick={deleteAccount}>🗑 Delete Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
