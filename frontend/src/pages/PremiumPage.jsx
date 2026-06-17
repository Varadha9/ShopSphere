import { useState } from "react";
import { useStore } from "../store/useStore";
import { supabase } from "../lib/supabase";

const BENEFITS = [
  { icon: "🏆", title: "Priority Order Processing", desc: "Your orders get priority=1 in the queue. Premium orders are always processed before standard orders (priority=10)." },
  { icon: "⚡", title: "Faster Delivery Queue", desc: "Premium orders jump ahead in the PriorityQueue min-heap. You always get served first, regardless of how many standard orders are waiting." },
  { icon: "⭐", title: "Premium Badge", desc: "Your profile shows a Premium badge across the app — navbar, orders, and profile page." },
  { icon: "📊", title: "Priority Analytics", desc: "See your priority level (1 vs 10) on every order card so you always know your queue position." },
];

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    color: "var(--muted)",
    features: [
      "Browse full book catalog",
      "Search by tag (HashMap O(1))",
      "Add to cart & wishlist",
      "Undo remove (Stack)",
      "Standard order queue (priority 10)",
      "Delivery route finder",
      "Book recommendations",
      "Discount coupon engine",
    ],
    cta: "Current Plan",
    disabled: true,
  },
  {
    name: "Premium",
    price: "₹199",
    period: "per month",
    color: "var(--amber)",
    features: [
      "Everything in Free",
      "Priority order queue (priority 1)",
      "Orders processed before standard users",
      "⭐ Premium badge on profile",
      "Priority shown on every order card",
      "First in line — always",
    ],
    cta: "Upgrade to Premium",
    disabled: false,
  },
];

export default function PremiumPage({ setPage }) {
  const { state, dispatch } = useStore();
  const isPremium = state.user?.isPremium;

  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState("");

  async function upgrade() {
    setUpgrading(true);
    setError("");
    const { error } = await supabase.auth.updateUser({
      data: { name: state.user?.name, isPremium: true },
    });
    if (error) {
      setError(error.message);
    } else {
      dispatch({ type: "SET_USER", payload: { ...state.user, isPremium: true } });
    }
    setUpgrading(false);
  }

  if (isPremium) {
    return (
      <div className="premium-page">
        <div className="premium-hero">
          <div className="premium-hero-icon">⭐</div>
          <h1>You are a Premium Member!</h1>
          <p>You have priority order processing. Your orders always come first.</p>
          <button className="btn-primary" onClick={() => setPage("Profile")}>View Profile →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-page">

      <div className="premium-hero">
        <span className="eyebrow">BookSphere Premium</span>
        <h1>Get to the front of the queue</h1>
        <p>Premium members get priority order processing. Your orders are placed at priority=1 in the min-heap queue — always processed before standard orders.</p>
      </div>

      {/* How it works */}
      <div className="premium-how">
        <h2>How Priority Queue Works</h2>
        <div className="premium-queue-demo">
          <div className="queue-item premium-item">
            <span>⭐ Your Order</span>
            <span className="priority-badge">Priority 1</span>
            <span className="queue-pos">Position #1</span>
          </div>
          <div className="queue-item">
            <span>Standard Order</span>
            <span className="priority-badge standard">Priority 10</span>
            <span className="queue-pos">Position #2</span>
          </div>
          <div className="queue-item">
            <span>Standard Order</span>
            <span className="priority-badge standard">Priority 10</span>
            <span className="queue-pos">Position #3</span>
          </div>
        </div>
        <p className="premium-queue-note">The PriorityQueue min-heap always surfaces the lowest priority number first. Premium = 1, Standard = 10.</p>
      </div>

      {/* Benefits */}
      <div className="premium-benefits">
        <h2>Premium Benefits</h2>
        <div className="premium-benefits-grid">
          {BENEFITS.map(b => (
            <div key={b.title} className="premium-benefit-card">
              <span className="premium-benefit-icon">{b.icon}</span>
              <h4>{b.title}</h4>
              <p>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="premium-plans">
        <h2>Choose Your Plan</h2>
        <div className="premium-plans-grid">
          {PLANS.map(plan => (
            <div key={plan.name} className={`premium-plan-card ${plan.name === "Premium" ? "featured" : ""}`}>
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  <strong>{plan.price}</strong>
                  <span>{plan.period}</span>
                </div>
              </div>
              <ul className="plan-features">
                {plan.features.map(f => (
                  <li key={f}><span>✓</span>{f}</li>
                ))}
              </ul>
              <button
                className={plan.disabled ? "btn-plan-disabled" : "btn-primary"}
                disabled={plan.disabled || upgrading}
                onClick={plan.disabled ? undefined : upgrade}
              >
                {upgrading ? <span className="auth-spinner" /> : plan.cta}
              </button>
              {error && <p style={{ color: "var(--red)", fontSize: "0.8rem" }}>{error}</p>}
            </div>
          ))}
        </div>
      </div>

      <p className="premium-note">
        * This is a DSA showcase project. Premium upgrade is simulated — no real payment required.
        Clicking Upgrade sets your account to Premium instantly.
      </p>
    </div>
  );
}
