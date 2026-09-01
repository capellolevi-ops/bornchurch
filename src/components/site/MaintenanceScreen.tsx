import logo from "@/assets/born-logo.png";

/** Tela exibida quando o modo manutenção está ativo no painel. */
export function MaintenanceScreen({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <img src={logo} alt="Born Church" width={910} height={294} className="h-12 w-auto" />
      <h1 className="font-display text-3xl text-foreground sm:text-4xl">{title}</h1>
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{message}</p>
    </div>
  );
}
