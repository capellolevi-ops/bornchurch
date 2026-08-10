import { CalendarClock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

import { nextEvent } from "@/config/site";

type Parts = { dias: number; horas: number; min: number; seg: number };

function diff(target: number): Parts | null {
  const ms = target - Date.now();
  if (ms <= 0) return null;
  return {
    dias: Math.floor(ms / 86_400_000),
    horas: Math.floor((ms / 3_600_000) % 24),
    min: Math.floor((ms / 60_000) % 60),
    seg: Math.floor((ms / 1000) % 60),
  };
}

/** Contagem regressiva para o próximo evento. */
export function Countdown() {
  const target = new Date(nextEvent.date).getTime();
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    setParts(diff(target));
    const id = window.setInterval(() => setParts(diff(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const items: Array<[string, number]> = parts
    ? [
        ["dias", parts.dias],
        ["horas", parts.horas],
        ["min", parts.min],
        ["seg", parts.seg],
      ]
    : [];

  return (
    <div className="card-lux flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
      <div>
        <p className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.35em] text-gold lg:justify-start">
          <CalendarClock className="h-4 w-4" /> Próximo evento
        </p>
        <h3 className="mt-3 font-display text-2xl text-foreground">{nextEvent.title}</h3>
        <p className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground lg:justify-start">
          <MapPin className="h-4 w-4 text-gold" /> {nextEvent.location}
        </p>
      </div>

      {parts ? (
        <div className="flex gap-3 sm:gap-4">
          {items.map(([label, value]) => (
            <div
              key={label}
              className="min-w-[68px] rounded-2xl border border-border bg-background/60 px-3 py-4"
            >
              <span className="block font-display text-3xl tabular-nums text-gold">
                {String(value).padStart(2, "0")}
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="chip">É agora! Te esperamos.</p>
      )}
    </div>
  );
}
