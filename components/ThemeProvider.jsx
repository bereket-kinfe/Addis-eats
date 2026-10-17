"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("addis-eats-theme") || sessionStorage.getItem("addis-eats-theme");
      if (saved === "dark" || saved === "light") setTheme(saved);
    } catch { /* Use the default theme if browser storage is unavailable. */ }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("addis-eats-theme", theme);
      sessionStorage.setItem("addis-eats-theme", theme);
    } catch { /* The selected theme still applies for this render. */ }
  }, [theme]);

  const toggleTheme = () => setTheme((current) => current === "light" ? "dark" : "light");
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
