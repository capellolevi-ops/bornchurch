import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "born-theme";

/** Alterna entre modo escuro (padrão) e claro. */
export function ThemeToggle({ className }: { className?: string }) {
  const [light, setLight] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const isLight = saved === "light";
    setLight(isLight);
    document.documentElement.classList.toggle("light", isLight);
    setReady(true);
  }, []);

  function toggle() {
    setLight((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("light", next);
      window.localStorage.setItem(STORAGE_KEY, next ? "light" : "dark");
      return next;
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "Ativar modo escuro" : "Ativar modo claro"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 hover:scale-105 hover:border-gold hover:text-gold ${className ?? ""}`}
    >
      {ready && light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
