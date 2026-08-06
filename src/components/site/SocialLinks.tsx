import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Ícone oficial do YouTube (marca registrada). */
function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
    </svg>
  );
}

/** Ícone oficial do Instagram (marca registrada). */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.72a6.12 6.12 0 1 0 0 12.24 6.12 6.12 0 0 0 0-12.24Zm0 10.09a3.97 3.97 0 1 1 0-7.94 3.97 3.97 0 0 1 0 7.94Zm7.79-10.33a1.43 1.43 0 1 1-2.86 0 1.43 1.43 0 0 1 2.86 0Z" />
    </svg>
  );
}

const itemClass =
  "group relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:scale-110 hover:border-gold hover:text-gold hover:shadow-[0_0_18px_-4px_hsl(var(--gold)/0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60";

/** Ícones de redes sociais com abertura em nova aba. */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <a
        href={siteConfig.social.youtube}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="YouTube da Born Church (abre em nova aba)"
        title="YouTube"
        className={itemClass}
      >
        <YouTubeIcon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110" />
      </a>
      <a
        href={siteConfig.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram da Born Church (abre em nova aba)"
        title="Instagram"
        className={itemClass}
      >
        <InstagramIcon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110" />
      </a>
    </div>
  );
}
