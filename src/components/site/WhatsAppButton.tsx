import { MessageCircle } from "lucide-react";

import { siteConfig } from "@/config/site";

/** Botão flutuante do WhatsApp. */
export function WhatsAppButton() {
  return (
    <a
      href={siteConfig.contact.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com a Born Church no WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold text-primary-foreground shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:scale-110"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-gold/40" aria-hidden="true" />
      <MessageCircle className="relative h-6 w-6" />
    </a>
  );
}
