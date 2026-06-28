import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);

    localStorage.setItem("theme", theme);

    const root = document.documentElement;

    if (theme === "dark") {
      root.style.setProperty("--bg-main", "#0f172a");
      root.style.setProperty("--panel-bg", "#1e293b");
      root.style.setProperty("--table-bg", "#1e293b");
      root.style.setProperty("--table-header", "#111827");
      root.style.setProperty("--modal-bg", "#1e293b");
      root.style.setProperty("--input-bg", "#1e293b");

      root.style.setProperty("--text-main", "#f8fafc");
      root.style.setProperty("--text-muted", "#94a3b8");

      root.style.setProperty("--border-color", "rgba(255,255,255,.08)");

      root.style.setProperty(
        "--card-shadow",
        "0 10px 25px -5px rgba(0,0,0,.45)"
      );

      root.style.setProperty("--primary", "#3b82f6");
      root.style.setProperty("--primary-light", "#60a5fa");
      root.style.setProperty("--primary-hover", "#2563eb");

      root.style.setProperty("--success", "#10b981");
      root.style.setProperty("--warning", "#f59e0b");
      root.style.setProperty("--danger", "#ef4444");

      root.style.setProperty(
        "--theme-header-gradient",
        "linear-gradient(135deg,#1e1b4b,#311042)"
      );

      root.style.setProperty("--theme-header-text", "#ffffff");
      root.style.setProperty("--theme-header-muted", "#cbd5e1");
    } else {
      root.style.setProperty("--bg-main", "#f8fafc");
      root.style.setProperty("--panel-bg", "#ffffff");
      root.style.setProperty("--table-bg", "#ffffff");
      root.style.setProperty("--table-header", "#1f2937");
      root.style.setProperty("--modal-bg", "#ffffff");
      root.style.setProperty("--input-bg", "#ffffff");

      root.style.setProperty("--text-main", "#0f172a");
      root.style.setProperty("--text-muted", "#64748b");

      root.style.setProperty("--border-color", "rgba(15,23,42,.08)");

      root.style.setProperty(
        "--card-shadow",
        "0 10px 25px -5px rgba(15,23,42,.05)"
      );

      root.style.setProperty("--primary", "#2563eb");
      root.style.setProperty("--primary-light", "#3b82f6");
      root.style.setProperty("--primary-hover", "#1d4ed8");

      root.style.setProperty("--success", "#10b981");
      root.style.setProperty("--warning", "#f59e0b");
      root.style.setProperty("--danger", "#dc2626");

      root.style.setProperty(
        "--theme-header-gradient",
        "linear-gradient(135deg,#eff6ff,#dbeafe)"
      );

      root.style.setProperty("--theme-header-text", "#1e3a8a");
      root.style.setProperty("--theme-header-muted", "#1e40af");
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;