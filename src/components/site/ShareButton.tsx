import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/** Botão de compartilhar página (Web Share API com fallback para copiar link). */
export function ShareButton({ title, className }: { title?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const data = { title: title ?? "Born Church", text: title ?? "Born Church", url };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        // usuário cancelou — segue para o fallback silenciosamente
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copiado!", { description: "Agora é só colar e compartilhar." });
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Não foi possível compartilhar", { description: url });
    }
  }

  return (
    <button type="button" onClick={share} className={`btn-outline ${className ?? ""}`}>
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      Compartilhar
    </button>
  );
}
