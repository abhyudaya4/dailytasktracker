import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthPage from "./components/AuthPage";
import { api } from "./lib/api";
import "./index.css";

function Root() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("dailytracker_user") || "null");
    } catch {
      return null;
    }
  });
  const [checking, setChecking] = useState(Boolean(localStorage.getItem("dailytracker_token")));

  useEffect(() => {
    if (!localStorage.getItem("dailytracker_token")) return;

    api.me()
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("dailytracker_token");
        localStorage.removeItem("dailytracker_user");
        setUser(null);
      })
      .finally(() => setChecking(false));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("dailytracker_token");
    localStorage.removeItem("dailytracker_user");
    setUser(null);
  }, []);

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center">Checking session...</div>;
  }

  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  return <App user={user} onLogout={logout} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
