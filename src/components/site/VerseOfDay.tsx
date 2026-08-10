import { BookOpen } from "lucide-react";

import { verses } from "@/config/site";

/** Escolhe o versículo pelo dia do ano — muda automaticamente todos os dias. */
function verseOfToday() {
  const now = new Date();
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const day = Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - start) / 86_400_000);
  return verses[day % verses.length]!;
}

export function VerseOfDay() {
  const verse = verseOfToday();

  return (
    <figure className="card-gold text-center">
      <BookOpen className="mx-auto h-6 w-6 text-gold" />
      <p className="mt-4 text-xs uppercase tracking-[0.4em] text-gold">Versículo do dia</p>
      <blockquote className="mx-auto mt-6 max-w-2xl font-display text-2xl leading-snug text-foreground sm:text-3xl">
        “{verse.text}”
      </blockquote>
      <figcaption className="mt-5 text-sm tracking-[0.2em] text-muted-foreground">
        {verse.ref}
      </figcaption>
    </figure>
  );
}
