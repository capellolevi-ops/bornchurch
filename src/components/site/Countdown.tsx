import { CalendarClock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

import { services, siteConfig } from "@/config/site";
import { countdownParts, nextOccurrence, type CountdownParts } from "@/lib/schedule";

export type CountdownTarget = {
  title: string;
  location: string;
  date: number;
};

function useParts(target: number): CountdownParts | null {
  const [parts, setParts] = useState<CountdownParts | null>(null);
  useEffect(() => {
    setParts(countdownParts(target));
    const id = window.setInterval(() => setParts(countdownParts(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);
  return parts;
}

function Digits({ parts, compact = false }: { parts: CountdownParts | null; compact?: boolean }) {
  if (!parts) return <p className="chip">É agora! Te esperamos.</p>;

  const items: Array<[string, number]> = [
    ["dias", parts.dias],
    ["horas", parts.horas],
    ["min", parts.min],
    ["seg", parts.seg],
  ];

  return (
    <div className={compact ? "flex gap-2" : "flex gap-3 sm:gap-4"}>
      {items.map(([label, value]) => (
        <div
          key={label}
          className={`rounded-2xl border border-border bg-background/60 text-center ${
            compact ? "min-w-[54px] px-2 py-2" : "min-w-[68px] px-3 py-4"
          }`}
        >
          <span
            className={`block font-display tabular-nums text-gold ${compact ? "text-xl" : "text-3xl"}`}
          >
            {String(value).padStart(2, "0")}
          </span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Encontra o próximo culto semanal da agenda. */
export function nextService(): CountdownTarget | null {
  let best: CountdownTarget | null = null;
  for (const service of services) {
    const date = nextOccurrence(service.day, service.times);
    if (date === null) continue;
    if (!best || date < best.date) {
      best = { title: `${service.title} — ${service.day}`, location: siteConfig.contact.address, date };
    }
  }
  return best;
}

/** Contagem regressiva principal: próximo evento do painel ou próximo culto. */
export function Countdown({ event }: { event?: CountdownTarget | null }) {
  const [fallback, setFallback] = useState<CountdownTarget | null>(null);

  useEffect(() => {
    if (event) return;
    setFallback(nextService());
    const id = window.setInterval(() => setFallback(nextService()), 60_000);
    return () => window.clearInterval(id);
  }, [event]);

  const target = event ?? fallback;
  const parts = useParts(target?.date ?? 0);

  if (!target) return null;

  return (
    <div className="card-lux flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
      <div>
        <p className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.35em] text-gold lg:justify-start">
          <CalendarClock className="h-4 w-4" /> Próximo encontro
        </p>
        <h3 className="mt-3 font-display text-2xl text-foreground">{target.title}</h3>
        <p className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground lg:justify-start">
          <MapPin className="h-4 w-4 shrink-0 text-gold" /> {target.location}
        </p>
      </div>
      <Digits parts={parts} />
    </div>
  );
}

function ServiceCountdownCard({ title, day, date }: { title: string; day: string; date: number }) {
  const parts = useParts(date);
  return (
    <article className="card-lux flex h-full flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">{day}</p>
        <h3 className="mt-2 font-display text-xl text-foreground">{title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {new Date(date).toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      <Digits parts={parts} compact />
    </article>
  );
}

/** Contador regressivo para cada culto da semana. */
export function ServicesCountdown() {
  const [list, setList] = useState<Array<{ title: string; day: string; date: number }>>([]);

  useEffect(() => {
    const build = () => {
      const next: Array<{ title: string; day: string; date: number }> = [];
      for (const s of services) {
        const date = nextOccurrence(s.day, s.times);
        if (date !== null) next.push({ title: s.title, day: s.day, date });
      }
      next.sort((a, b) => a.date - b.date);
      setList(next);
    };
    build();
    const id = window.setInterval(build, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (list.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((s) => (
        <ServiceCountdownCard key={`${s.day}-${s.title}`} {...s} />
      ))}
    </div>
  );
}
