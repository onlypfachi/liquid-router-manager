import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "liquid-router-theme";

type ThemeContextValue = {
  /** The user's stored preference — may be "system". */
  theme: Theme;
  /** The theme actually applied to the page ("light" or "dark"). */
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.style.colorScheme = resolved;
  return resolved;
}

/**
 * Provides light/dark/system theming, backed by `data-theme` on <html> and
 * persisted to localStorage. Pair with the blocking script in `root.tsx` to
 * avoid a flash of the wrong theme on first paint.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Pick up whatever the blocking script (or a previous visit) already stored.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const initial: Theme = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    setThemeState(initial);
    setResolvedTheme(applyTheme(initial));
  }, []);

  useEffect(() => {
    setResolvedTheme(applyTheme(theme));

    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolvedTheme(applyTheme("system"));
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

/**
 * Inline, render-blocking script that sets `data-theme` on <html> before
 * hydration so there's no flash of the wrong theme. Keep in sync with the
 * storage key / resolution logic above.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
    var theme = stored === "light" || stored === "dark" ? stored : "system";
    var resolved = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme;
    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.style.colorScheme = resolved;
  } catch (e) {}
})();
`;
