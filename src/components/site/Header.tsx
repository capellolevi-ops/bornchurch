import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import logo from "@/assets/born-logo.png";
import { navItems } from "@/config/site";
import { cn } from "@/lib/utils";

import { SocialLinks } from "./SocialLinks";
import { ThemeToggle } from "./ThemeToggle";

/** Menu superior fixo, com navegação responsiva, tema e redes sociais. */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open
          ? "border-b border-border bg-background/90 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="Born Church"
            width={910}
            height={294}
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-gold" }}
              className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <span className="h-4 w-px bg-border" />
          <SocialLinks />
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 xl:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
            className="shrink-0 rounded-full border border-border p-2 text-foreground transition-colors hover:border-gold hover:text-gold"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-[60px] z-40 h-[calc(100dvh-60px)] overflow-y-auto border-t border-border bg-background px-5 pb-10 pt-6 xl:hidden"
          >
            <div className="grid gap-2">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.35 }}
                >
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: item.to === "/" }}
                    activeProps={{ className: "border-gold text-gold" }}
                    className="flex items-center justify-between rounded-2xl border border-border bg-card/50 px-5 py-4 font-display text-lg text-foreground transition-colors hover:border-gold"
                  >
                    {item.label}
                    <span className="text-xs tracking-[0.3em] text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <SocialLinks />
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
