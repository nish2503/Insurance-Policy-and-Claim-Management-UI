import { createContext, useState, useEffect } from "react";

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
      root.style.setProperty("--text-main", "#f8fafc");
      root.style.setProperty("--text-muted", "#94a3b8");
      root.style.setProperty("--border-color", "rgba(255, 255, 255, 0.06)");
      root.style.setProperty("--card-shadow", "0 10px 25px -5px rgba(0,0,0,0.4)");
      
      // 🌌 Dark Mode Banner Specific Variables
      root.style.setProperty("--theme-header-gradient", "linear-gradient(135deg, #1e1b4b, #311042)");
      root.style.setProperty("--theme-header-text", "#ffffff");
      root.style.setProperty("--theme-header-muted", "#cbd5e1");
    } else {
      root.style.setProperty("--bg-main", "#f8fafc");
      root.style.setProperty("--panel-bg", "#ffffff");
      root.style.setProperty("--text-main", "#0f172a");
      root.style.setProperty("--text-muted", "#64748b");
      root.style.setProperty("--border-color", "rgba(15, 23, 42, 0.08)");
      root.style.setProperty("--card-shadow", "0 10px 25px -5px rgba(15,23,42,0.04)");
      
      // ☀️ Light Mode Banner Specific Variables
      root.style.setProperty("--theme-header-gradient", "linear-gradient(135deg, #eff6ff, #dbeafe)");
      root.style.setProperty("--theme-header-text", "#1e3a8a");
      root.style.setProperty("--theme-header-muted", "#1e40af");
    }
  }, [theme]);

  function toggleTheme() {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
