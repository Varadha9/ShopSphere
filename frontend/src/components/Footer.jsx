export default function Footer({ setPage }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">B</div>
          <strong>BookSphere</strong>
          <p>Every bookstore feature backed by the right data structure.</p>
          <div className="footer-social">
            <a href="https://github.com/Varadha9/ShopSphere" target="_blank" rel="noopener noreferrer" className="footer-social-btn">GitHub</a>
          </div>
        </div>

        <div className="footer-col">
          <h5>Shop</h5>
          <ul>
            <li><span onClick={() => setPage("Catalog")}>All Books</span></li>
            <li><span onClick={() => setPage("Catalog")}>Technology</span></li>
            <li><span onClick={() => setPage("Catalog")}>Fiction</span></li>
            <li><span onClick={() => setPage("Catalog")}>Non-Fiction</span></li>
            <li><span onClick={() => setPage("Catalog")}>Self-Help</span></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Account</h5>
          <ul>
            <li><span onClick={() => setPage("Profile")}>My Profile</span></li>
            <li><span onClick={() => setPage("Orders")}>My Orders</span></li>
            <li><span onClick={() => setPage("Wishlist")}>Wishlist</span></li>
            <li><span onClick={() => setPage("Cart")}>Cart</span></li>
            <li><span onClick={() => setPage("Premium")}>Go Premium ⭐</span></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Features</h5>
          <ul>
            <li><span onClick={() => setPage("Recommendations")}>Book Recommendations</span></li>
            <li><span onClick={() => setPage("Delivery")}>Delivery Tracker</span></li>
            <li><span onClick={() => setPage("UX")}>UX Blueprint</span></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>DSA Engine</h5>
          <ul>
            <li>HashMap · O(1) search</li>
            <li>HashSet · Wishlist</li>
            <li>Stack · Undo remove</li>
            <li>Priority Queue · Orders</li>
            <li>Dijkstra · Delivery</li>
            <li>BFS · Recommendations</li>
            <li>DP Knapsack · Coupons</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} BookSphere. Built as a DSA showcase project.</span>
        <span>React + Vite + Supabase · Deployed on Vercel</span>
      </div>
    </footer>
  );
}
