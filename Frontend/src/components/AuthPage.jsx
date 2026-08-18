import React, { useState } from "react";
import { CheckCircle2, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { api } from "../lib/api";

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (e) =>
    setForm((current) => ({ ...current, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "register" && !form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.email.trim() || !form.password) {
      setError("Email and password are required.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const result =
        mode === "login"
          ? await api.login(form.email, form.password)
          : await api.register(form.name, form.email, form.password);

      localStorage.setItem("dailytracker_token", result.token);
      localStorage.setItem("dailytracker_user", JSON.stringify(result.user));
      onLogin(result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#F5F5FB" }}>
      <div className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-3xl shadow-xl bg-white">
        <div
          className="hidden md:flex flex-col justify-between p-10 text-white"
          style={{ background: "linear-gradient(145deg, #1E1B4B, #6D28D9)" }}
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#7C3AED" }}>
                <CheckCircle2 size={25} />
              </div>
              <span className="text-2xl font-semibold">DailyTracker</span>
            </div>
            <h1 className="text-4xl font-bold mt-16 leading-tight">
              Plan your day.
              <br />
              Track your progress.
              <br />
              Achieve your goals.
            </h1>
            <p className="mt-6 text-white/70 max-w-md">
              Keep your tasks, completion history and productivity statistics in one secure place.
            </p>
          </div>
          <p className="text-sm text-white/60">Your personal productivity workspace.</p>
        </div>

        <div className="p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold" style={{ color: "#1E1B33" }}>
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-2 text-sm" style={{ color: "#8B8AA0" }}>
                {mode === "login"
                  ? "Sign in to continue to your DailyTracker."
                  : "Create an account to save your tasks securely."}
              </p>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-4">
              {mode === "register" && (
                <div>
                  <label className="text-sm font-medium block mb-2">Full name</label>
                  <input
                    value={form.name}
                    onChange={update("name")}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border px-4 py-3 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium block mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={update("password")}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-xl border px-4 py-3 pr-12 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "#FEE2E2", color: "#B91C1C" }}>
                  {error}
                </div>
              )}

              <button
                disabled={loading}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white disabled:opacity-60"
                style={{ background: "#7C3AED" }}
              >
                {mode === "login" ? <LogIn size={18} /> : <UserPlus size={18} />}
                {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
              </button>
            </form>

            <div className="text-center mt-6 text-sm" style={{ color: "#8B8AA0" }}>
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError("");
                }}
                className="font-semibold"
                style={{ color: "#7C3AED" }}
              >
                {mode === "login" ? "Create one" : "Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
