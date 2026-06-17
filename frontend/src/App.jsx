import { useState } from "react";
import { StoreProvider, useStore } from "./store/useStore";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import CatalogPage from "./pages/CatalogPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import DeliveryPage from "./pages/DeliveryPage";
import RecommendationsPage from "./pages/RecommendationsPage";
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
      <div className="app-body">
        {page === "Catalog" && <CatalogPage setPage={setPage} />}
        {page === "Cart" && <CartPage setPage={setPage} />}
        {page === "Orders" && <OrdersPage setPage={setPage} />}
        {page === "Delivery" && <DeliveryPage />}
        {page === "Recommendations" && <RecommendationsPage />}
        {page === "UX" && <UXPage />}
      </div>
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
