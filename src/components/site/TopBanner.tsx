import { X } from "lucide-react";
import { useEffect, useState } from "react";

import type { PublicBanner } from "@/lib/public.functions";

/** Banner de aviso temporário exibido no topo do site. */
export function TopBanner({ banners }: { banners: PublicBanner[] }) {
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem("born-banners-dismissed");
      if (raw) setDismissed(JSON.parse(raw) as string[]);
    } catch {
      /* ignora */
    }
  }, []);

  const visible = banners.filter((b) => !dismissed.includes(b.id));
  if (visible.length === 0) return null;

  function dismiss(id: string) {
    const next = [...dismissed, id];
    setDismissed(next);
    try {
      window.sessionStorage.setItem("born-banners-dismissed", JSON.stringify(next));
    } catch {
      /* ignora */
    }
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[60]">
      {visible.map((banner) => (
        <div
          key={banner.id}
          className="flex items-center justify-center gap-3 bg-gold px-10 py-2 text-center text-sm text-primary-foreground"
        >
          <span>{banner.text}</span>
          {banner.link && banner.button_label ? (
            <a
              href={banner.link}
              className="rounded-full border border-primary-foreground/40 px-3 py-1 text-xs uppercase tracking-[0.2em]"
            >
              {banner.button_label}
            </a>
          ) : null}
          <button
            type="button"
            aria-label="Fechar aviso"
            onClick={() => dismiss(banner.id)}
            className="absolute right-3 opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
