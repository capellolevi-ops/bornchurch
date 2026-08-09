import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import logo from "@/assets/born-logo.png";
import { navItems, siteConfig } from "@/config/site";

import { SocialLinks } from "./SocialLinks";

/** Rodapé com navegação, contato, redes sociais e direitos autorais. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/30 px-6 py-16">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center">
            <img
              src={logo}
              alt="Born Church"
              width={910}
              height={294}
              loading="lazy"
              className="h-10 w-auto"
            />
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            “{siteConfig.tagline}”
          </p>
          <SocialLinks className="mt-6" />
        </div>

        <nav className="grid grid-cols-2 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-muted-foreground transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <ul className="space-y-4 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span>{siteConfig.contact.address}</span>
          </li>
          <li className="flex gap-3">

            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-gold">
              {siteConfig.contact.email}
            </a>
          </li>
          <li className="flex gap-3">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <a href={siteConfig.contact.phoneHref} className="hover:text-gold">
              {siteConfig.contact.phone}
            </a>
          </li>
        </ul>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © {year} {siteConfig.name}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
