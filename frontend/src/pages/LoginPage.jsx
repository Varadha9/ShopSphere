import { useState, useEffect, useRef } from "react";
import { useStore } from "../store/useStore";
import { supabase } from "../lib/supabase";

function passwordStrength(pw) {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const STRENGTH_META = [
  null,
  { label: "Weak",   color: "var(--red)"   },
  { label: "Fair",   color: "var(--amber)" },
  { label: "Good",   color: "var(--blue)"  },
  { label: "Strong", color: "var(--green)" },
];

function validate(mode, form) {
  const errs = {};
  if (mode === "register" && !form.name.trim()) errs.name = "Full name is required";
  if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) errs.email = "Enter a valid email address";
  if (mode === "register" && form.password.length < 6) errs.password = "Minimum 6 characters";
  if (mode === "login" && !form.password) errs.password = "Password is required";
  return errs;
}

export default function LoginPage() {
  const { state, dispatch } = useStore();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", isPremium: false, remember: false });
  const [showPass, setShowPass] = useState(false);
  const [registered, setRegistered] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrs, setFieldErrs] = useState({});
  const [touched, setTouched] = useState({});
  const [forgotSent, setForgotSent] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => {
    firstInputRef.current?.focus();
    setFieldErrs({});
    setTouched({});
    setForgotSent(false);
  }, [mode]);

  function touch(key) {
    setTouched(t => ({ ...t, [key]: true }));
  }

  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173",
        skipBrowserRedirect: false,
      },
    });
    if (error) dispatch({ type: "SET_ERROR", payload: error.message });
  }

  async function submit(e) {
    e.preventDefault();
    const allTouched = mode === "register"
      ? { name: true, email: true, password: true }
      : { email: true, password: true };
    setTouched(allTouched);
    const errs = validate(mode, form);
    setFieldErrs(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);

    if (mode === "register") {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { name: form.name, isPremium: form.isPremium } },
      });
      if (error) {
        dispatch({ type: "SET_ERROR", payload: error.message });
        setLoading(false);
      } else {
        setRegistered("done");
        setTimeout(() => { setMode("login"); setRegistered(null); setLoading(false); }, 1600);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) dispatch({ type: "SET_ERROR", payload: error.message });
      setLoading(false);
    }
  }

  function handleChange(key, value) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    if (touched[key]) {
      const errs = validate(mode, updated);
      setFieldErrs(prev => ({ ...prev, [key]: errs[key] }));
    }
  }

  function switchMode(m) {
    setMode(m);
    setRegistered(null);
    setLoading(false);
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      setTouched(t => ({ ...t, email: true }));
      setFieldErrs(prev => ({ ...prev, email: "Enter your email first" }));
      return;
    }
    await supabase.auth.resetPasswordForEmail(form.email);
    setForgotSent(true);
  }

  const strength = mode === "register" ? passwordStrength(form.password) : null;
  const strengthMeta = strength !== null ? STRENGTH_META[strength] : null;

  return (
    <div className="auth-page">
      <div className="auth-split">

        <div className="auth-brand">
          <div className="auth-brand-inner">
            <div className="auth-logo">B</div>
            <h1 className="auth-brand-title">BookSphere</h1>
            <p className="auth-brand-sub">
              Discover, save, and order books you love. Smart search, personalised recommendations, and fast delivery — all in one place.
            </p>
            <div className="auth-brand-stats">
              <div className="auth-stat"><strong>12</strong><span>Curated titles</span></div>
              <div className="auth-stat"><strong>4</strong><span>Genres</span></div>
              <div className="auth-stat"><strong>7</strong><span>Cities delivered</span></div>
            </div>
          </div>
          <div className="auth-showcase" aria-hidden="true">
            <div className="showcase-book">📖</div>
            <span>New drops</span>
            <strong>12 handpicked reads</strong>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-card">
            <div className="auth-tabs">
              <button className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>Sign In</button>
              <button className={mode === "register" ? "active" : ""} onClick={() => switchMode("register")}>Sign Up</button>
            </div>

            <div className="auth-card-header">
              <h2>{mode === "login" ? "Welcome back" : "Create account"}</h2>
              <p>{mode === "login" ? "Sign in to your BookSphere account" : "Start your reading journey today"}</p>
            </div>

            <form onSubmit={submit} noValidate>
              {mode === "register" && (
                <div className={`auth-field${touched.name && fieldErrs.name ? " field-error" : ""}`}>
                  <label htmlFor="inp-name">Full Name</label>
                  <input
                    id="inp-name"
                    ref={mode === "register" ? firstInputRef : undefined}
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={e => handleChange("name", e.target.value)}
                    onBlur={() => touch("name")}
                    autoComplete="name"
                  />
                  {touched.name && fieldErrs.name && <span className="field-err-msg">{fieldErrs.name}</span>}
                </div>
              )}

              <div className={`auth-field${touched.email && fieldErrs.email ? " field-error" : ""}`}>
                <label htmlFor="inp-email">Email Address</label>
                <input
                  id="inp-email"
                  ref={mode === "login" ? firstInputRef : undefined}
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => handleChange("email", e.target.value)}
                  onBlur={() => touch("email")}
                  autoComplete="email"
                />
                {touched.email && fieldErrs.email && <span className="field-err-msg">{fieldErrs.email}</span>}
              </div>

              <div className={`auth-field${touched.password && fieldErrs.password ? " field-error" : ""}`}>
                <div className="auth-field-labelrow">
                  <label htmlFor="inp-pass">Password</label>
                  {mode === "login" && !forgotSent && (
                    <button type="button" className="auth-forgot" onClick={handleForgotPassword}>Forgot password?</button>
                  )}
                </div>
                <div className="pass-wrap">
                  <input
                    id="inp-pass"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => handleChange("password", e.target.value)}
                    onBlur={() => touch("password")}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                  <button type="button" className="pass-toggle" onClick={() => setShowPass(s => !s)} aria-label={showPass ? "Hide password" : "Show password"}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
                {touched.password && fieldErrs.password && <span className="field-err-msg">{fieldErrs.password}</span>}
                {mode === "register" && form.password && (
                  <div className="strength-bar-wrap">
                    <div className="strength-bar">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="strength-segment" style={{ background: i <= strength ? strengthMeta?.color : undefined }} />
                      ))}
                    </div>
                    {strengthMeta && <span className="strength-label" style={{ color: strengthMeta.color }}>{strengthMeta.label}</span>}
                  </div>
                )}
              </div>

              {mode === "register" && (
                <label className="premium-label">
                  <input type="checkbox" checked={form.isPremium} onChange={e => setForm({ ...form, isPremium: e.target.checked })} />
                  <span>⭐ Premium member — priority order processing</span>
                </label>
              )}

              {mode === "login" && (
                <label className="auth-remember">
                  <input type="checkbox" checked={form.remember} onChange={e => setForm({ ...form, remember: e.target.checked })} />
                  <span>Remember me on this device</span>
                </label>
              )}

              {forgotSent && <p className="auth-success">✓ Password reset link sent to {form.email}</p>}
              {state.error && registered !== "done" && <p className="auth-error">⚠ {state.error}</p>}
              {registered === "done" && <p className="auth-success">✓ Account created! Redirecting to sign in…</p>}

              <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                {loading
                  ? <span className="auth-spinner" />
                  : mode === "login" ? "Sign In" : "Create Account"
                }
              </button>
            </form>

            <p className="auth-switch">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <span onClick={() => switchMode(mode === "login" ? "register" : "login")}>
                {mode === "login" ? "Sign up free" : "Sign in"}
              </span>
            </p>

            <div className="auth-divider"><span>or</span></div>

            <button type="button" className="btn-google" onClick={loginWithGoogle}>
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-3.58-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
