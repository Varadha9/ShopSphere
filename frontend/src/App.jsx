import { useState } from "react";
import { StoreProvider, useStore } from "./store/useStore";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import CatalogPage from "./pages/CatalogPage";
import BookDetailPage from "./pages/BookDetailPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import OrdersPage from "./pages/OrdersPage";
import DeliveryPage from "./pages/DeliveryPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ProfilePage from "./pages/ProfilePage";
import PremiumPage from "./pages/PremiumPage";
import UXPage from "./pages/UXPage";

function AppInner() {
  const { state } = useStore();
  const [page, setPage] = useState("Catalog");

  if (state.loading) return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <span className="auth-spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
    </div>
  );

  if (!state.user) return <LoginPage />;

  return (
    <div className="app-shell">
      <Navbar page={page} setPage={setPage} />
      <Toast />
      <div className="app-body">
        {page === "Catalog"         && <CatalogPage setPage={setPage} />}
        {page === "BookDetail"       && <BookDetailPage setPage={setPage} />}
        {page === "Cart"            && <CartPage setPage={setPage} />}
        {page === "Wishlist"        && <WishlistPage setPage={setPage} />}
        {page === "Orders"          && <OrdersPage setPage={setPage} />}
        {page === "Delivery"        && <DeliveryPage />}
        {page === "Recommendations" && <RecommendationsPage setPage={setPage} />}
        {page === "Profile"         && <ProfilePage setPage={setPage} />}
        {page === "Premium"         && <PremiumPage setPage={setPage} />}
        {page === "UX"              && <UXPage />}
      </div>
      <Footer setPage={setPage} />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  );
}
