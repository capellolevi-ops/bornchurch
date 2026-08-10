import { motion } from "motion/react";

import { galleryPhotos } from "@/config/photos";

/** Galeria de fotos reais da comunidade. */
export function PhotoGallery() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {galleryPhotos.map((photo, i) => (
        <motion.figure
          key={photo.src}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          className={`group overflow-hidden rounded-2xl border border-border ${
            i === 0 || i === 3 ? "lg:col-span-2 lg:row-span-1" : ""
          }`}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            className="h-full max-h-[420px] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
          />
        </motion.figure>
      ))}
    </div>
  );
}
