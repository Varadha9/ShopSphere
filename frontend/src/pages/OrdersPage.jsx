import { useStore } from "../store/useStore";

export default function OrdersPage({ setPage }) {
  const { state, dispatch } = useStore();

  return (
    <div className="page">
      {/* DSA: LinkedList<Order> (FIFO Queue)  →  java.util.LinkedList
           + PriorityQueue<Order> (Min-Heap)  →  java.util.PriorityQueue
           Premium priority=1 always dequeues before standard priority=10 */}
      <h2>📦 Order Queue</h2>

      <div className="queue-info">
        <p>Premium orders (⭐ priority=1) are always processed before regular orders (priority=10).</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn-primary" disabled={!state.orders.some(o => o.status === "PENDING")}
            onClick={() => dispatch({ type: "PROCESS_ORDER" })}>
            ▶ Process Next Order
          </button>
          <button className="btn-sm" onClick={() => setPage("Delivery")}>
            🚚 Track Delivery Route
          </button>
        </div>
      </div>

      {state.orders.length === 0 ? (
        <p className="empty">No orders yet. <span className="link" onClick={() => setPage("Cart")}>Go to cart →</span></p>
      ) : (
        <div className="order-list">
          {state.orders.map((order, i) => (
            <div key={order.orderId} className={`order-card ${order.isPremium ? "premium" : ""}`}>
              <div className="order-header">
                <span>#{i + 1} {order.orderId}</span>
                <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                {order.isPremium && <span className="premium-badge">⭐ PREMIUM</span>}
              </div>
              <p>Priority: {order.priority} · Total: ₹{order.total.toLocaleString()}</p>
              <div className="order-items">
                {order.items.map(({ product, qty }) => (
                  <span key={product.id} className="order-item-chip">{product.name} ×{qty}</span>
                ))}
              </div>
              {order.status === "PROCESSING" && (
                <button
                  className="btn-primary btn-sm"
                  style={{ justifySelf: "start" }}
                  onClick={() => {
                    dispatch({ type: "DELIVER_ORDER", payload: order.orderId });
                    dispatch({ type: "SHOW_TOAST", payload: { message: `Order ${order.orderId} delivered!`, type: "success" } });
                  }}
                >
                  ✅ Mark as Delivered
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
