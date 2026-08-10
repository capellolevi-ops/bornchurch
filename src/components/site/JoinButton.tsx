import { AnimatePresence, motion } from "motion/react";
import { CalendarPlus, PartyPopper, X } from "lucide-react";
import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";

/** Confete simples em CSS/Motion — sem dependências extras. */
function Confetti() {
  const pieces = Array.from({ length: 26 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
      {pieces.map((i) => (
        <motion.span
          key={i}
          initial={{ y: -40, x: `${(i * 37) % 100}%`, opacity: 0, rotate: 0 }}
          animate={{ y: 420, opacity: [0, 1, 1, 0], rotate: 360 }}
          transition={{ duration: 2.4 + (i % 5) * 0.3, delay: (i % 8) * 0.08, ease: "easeIn" }}
          className={`absolute top-0 h-2 w-2 rounded-[2px] ${
            i % 3 === 0 ? "bg-gold" : i % 3 === 1 ? "bg-gold-soft" : "bg-navy"
          }`}
        />
      ))}
    </div>
  );
}

/** Botão "Quero participar" com celebração ao confirmar. */
export function JoinButton({ serviceName }: { serviceName: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const message = encodeURIComponent(
    `Olá! Quero participar do ${serviceName} na Born Church. 🙌`,
  );

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn-gold mt-6 w-full">
        Quero participar
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 px-5 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="card-gold relative w-full max-w-md overflow-hidden text-center"
            >
              <Confetti />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-gold"
              >
                <X className="h-5 w-5" />
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 14 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15"
              >
                <PartyPopper className="h-8 w-8 text-gold" />
              </motion.div>

              <h3 className="mt-6 font-display text-3xl text-foreground">
                Que alegria! Te esperamos.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Você acaba de dar um passo no <span className="text-gold">{serviceName}</span>.
                Chegue uns minutos antes — nossa equipe de acolhimento vai te receber na porta.
              </p>

              <div className="relative mt-8 flex flex-col gap-3">
                <a
                  href={`${siteConfig.contact.whatsapp}?text=${message}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gold w-full"
                >
                  Avisar no WhatsApp
                </a>
                <a
                  href={siteConfig.contact.mapsLink ?? "/contato"}
                  className="btn-outline w-full"
                >
                  <CalendarPlus className="h-4 w-4" /> Ver endereço
                </a>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
