import { useEffect } from "react";
import { useStore } from "../store/useStore";

export default function Toast() {
  const { state, dispatch } = useStore();
  const { toast } = state;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => dispatch({ type: "HIDE_TOAST" }), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`}>
      <span>{toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}</span>
      {toast.message}
    </div>
  );
}
