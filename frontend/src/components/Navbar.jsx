import { useStore } from "../store/useStore";
import { supabase } from "../lib/supabase";

const pages = [
  { name: "Catalog",         icon: "📚" },
  { name: "Cart",            icon: "🛒" },
  { name: "Orders",          icon: "📦" },
  { name: "Delivery",        icon: "🚚" },
  { name: "Recommendations", icon: "🤝" },
];

export default function Navbar({ page, setPage }) {
  const { state } = useStore();
  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);

  return (
    <nav className="navbar">
      <button className="logo" onClick={() => setPage("Catalog")} aria-label="Go to catalog">
        <span className="logo-mark">B</span>
        <span>
          <strong>BookSphere</strong>
          <small>Curated reads</small>
        </span>
      </button>

      <div className="nav-links">
        {pages.map(p => (
          <button key={p.name} className={page === p.name ? "active" : ""} onClick={() => setPage(p.name)}>
            <span>{p.icon}</span>
            <span>{p.name}</span>
            {p.name === "Cart" && cartCount > 0 ? <b>{cartCount}</b> : null}
          </button>
        ))}
      </div>

      <div className="nav-user">
        {!state.user?.isPremium && (
          <button className="btn-premium-nav" onClick={() => setPage("Premium")}>⭐ Go Premium</button>
        )}
        <button
          className={`user-pill ${page === "Profile" ? "active" : ""}`}
          onClick={() => setPage("Profile")}
        >
          <span className="avatar">{state.user?.name?.slice(0, 1).toUpperCase()}</span>
          <span>{state.user?.name?.split(" ")[0]}</span>
          {state.user?.isPremium ? <em>⭐</em> : null}
        </button>
        <button className="nav-logout" onClick={() => supabase.auth.signOut()}>↩ Logout</button>
      </div>
    </nav>
  );
}
