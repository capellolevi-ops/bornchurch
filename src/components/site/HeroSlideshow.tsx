import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.jpg";

const slides = [
  { src: hero1, alt: "Congregação em momento de adoração com as mãos levantadas" },
  { src: hero2, alt: "Culto de louvor com luzes sobre a plateia" },
  { src: hero3, alt: "Interior de igreja durante o culto" },
  { src: hero4, alt: "Banda de louvor ministrando no palco" },
];

const INTERVAL = 6000;

export function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="false">
      <AnimatePresence mode="sync">
        <motion.img
          key={index}
          src={slides[index].src}
          alt={slides[index].alt}
          loading={index === 0 ? "eager" : "lazy"}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.6, ease: "easeInOut" },
            scale: { duration: INTERVAL / 1000 + 2, ease: "linear" },
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      {/* Véus para legibilidade */}
      <div className="absolute inset-0 bg-background/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent,color-mix(in_oklab,var(--background)_85%,transparent))]" />

      {/* Indicadores */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ir para imagem ${i + 1}`}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === index ? "w-8 bg-gold" : "w-3 bg-foreground/25 hover:bg-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
