import { Reveal } from "./Reveal";

/** Cabeçalho padrão das páginas internas. */
export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-border bg-secondary/40 px-6 pb-16 pt-32 sm:pt-40">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          {eyebrow ? (
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-gold">{eyebrow}</p>
          ) : null}
          <h1 className="font-display text-4xl leading-tight text-foreground sm:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
