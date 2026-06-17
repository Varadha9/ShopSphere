import { useStore } from "../store/useStore";

export default function WishlistPage({ setPage }) {
  const { state, dispatch } = useStore();
  const savedBooks = [...state.wishlist]
    .map(id => state.catalog.find(book => book.id === id))
    .filter(Boolean);

  function addToCart(book) {
    dispatch({ type: "ADD_TO_CART", payload: { product: book } });
    dispatch({ type: "SHOW_TOAST", payload: { message: `“${book.name}” added to cart`, type: "success" } });
  }

  function addAllToCart() {
    savedBooks.forEach(book => dispatch({ type: "ADD_TO_CART", payload: { product: book } }));
    dispatch({ type: "SHOW_TOAST", payload: { message: `${savedBooks.length} books added to cart`, type: "success" } });
  }

  function removeFromWishlist(bookId) {
    dispatch({ type: "TOGGLE_WISHLIST", payload: bookId });
    dispatch({ type: "SHOW_TOAST", payload: { message: "Removed from wishlist", type: "info" } });
  }

  return (
    <div className="page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Saved books</span>
          <h2>Wishlist</h2>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {savedBooks.length > 1 && (
            <button className="btn-primary" onClick={addAllToCart}>
              🛒 Add All to Cart
            </button>
          )}
          <button className="btn-sm" onClick={() => setPage("Catalog")}>Browse Catalog</button>
        </div>
      </div>

      {savedBooks.length === 0 ? (
        <div className="empty">
          Your wishlist is empty. Tap the heart on any book to save it here.
        </div>
      ) : (
        <div className="profile-wishlist">
          {savedBooks.map(book => (
            <div key={book.id} className="profile-wishlist-item">
              <div
                className="profile-wishlist-info"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  dispatch({ type: "SELECT_BOOK", payload: book });
                  dispatch({ type: "VIEW_PRODUCT", payload: book });
                  setPage("BookDetail");
                }}
              >
                <span>📖</span>
                <div>
                  <strong>{book.name}</strong>
                  <small>by {book.author} · {book.category}</small>
                </div>
              </div>
              <div className="profile-wishlist-actions">
                <span className="price">₹{book.price.toLocaleString()}</span>
                <button className="btn-primary btn-sm" onClick={() => addToCart(book)}>
                  Add to Cart
                </button>
                <button className="btn-danger btn-sm" onClick={() => removeFromWishlist(book.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
