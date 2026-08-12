import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bell, Download, Loader2, LogOut } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ContentPanel } from "@/components/admin/ContentPanel";
import { DashboardPanel } from "@/components/admin/DashboardPanel";
import { PrayersPanel } from "@/components/admin/PrayersPanel";
import { SubmissionsPanel } from "@/components/admin/SubmissionsPanel";
import { RowEditor, emptyRow, inputClass, type EditorField } from "@/components/admin/ui";
import { PageHeader } from "@/components/site/PageHeader";
import {
  adminBackup,
  adminList,
  adminLogin,
  adminLogout,
  adminNotifications,
  adminReadNotifications,
  adminStatus,
  type Row,
  type Table,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel Administrativo — Born Church" },
      {
        name: "description",
        content:
          "Área restrita da Born Church para gerenciar conteúdo, eventos, formulários e pedidos de oração.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Painel Administrativo — Born Church" },
      { property: "og:description", content: "Área restrita da equipe da Born Church." },
    ],
  }),
  component: Admin,
});

type CrudSection = { id: string; label: string; table: Table; fields: EditorField[]; titleField?: string };

const crudSections: CrudSection[] = [
  {
    id: "service_times",
    label: "Horários",
    table: "service_times",
    fields: [
      { name: "day", label: "Dia", type: "text" },
      { name: "title", label: "Nome do culto", type: "text" },
      { name: "times", label: "Horários (separe por vírgula)", type: "list" },
      { name: "description", label: "Descrição", type: "textarea" },
      { name: "sort_order", label: "Ordem", type: "number" },
      { name: "published", label: "Publicado", type: "bool" },
    ],
  },
  {
    id: "events",
    label: "Eventos",
    table: "events",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "starts_at", label: "Data e hora", type: "datetime" },
      { name: "location", label: "Local", type: "text" },
      { name: "description", label: "Descrição", type: "textarea" },
      { name: "image_url", label: "URL da imagem (opcional)", type: "text" },
      { name: "link", label: "Link de inscrição (opcional)", type: "text" },
      { name: "featured", label: "Destaque (cronômetro na home)", type: "bool" },
      { name: "published", label: "Publicado", type: "bool" },
    ],
  },
  {
    id: "announcements",
    label: "Avisos",
    table: "announcements",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "body", label: "Mensagem", type: "textarea" },
      { name: "published", label: "Publicado", type: "bool" },
    ],
  },
  {
    id: "banners",
    label: "Banner do topo",
    table: "banners",
    titleField: "text",
    fields: [
      { name: "text", label: "Texto do aviso", type: "textarea" },
      { name: "button_label", label: "Texto do botão (opcional)", type: "text" },
      { name: "link", label: "Link do botão (opcional)", type: "text" },
      { name: "image_url", label: "URL da imagem (opcional)", type: "text" },
      { name: "starts_at", label: "Exibir a partir de", type: "datetime" },
      { name: "ends_at", label: "Exibir até", type: "datetime" },
      { name: "active", label: "Ativo", type: "bool" },
    ],
  },
  {
    id: "sermons",
    label: "Pregações",
    table: "sermons",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "preacher", label: "Pregador", type: "text" },
      { name: "youtube_id", label: "ID do vídeo no YouTube", type: "text" },
      { name: "preached_on", label: "Data", type: "date" },
      { name: "description", label: "Descrição", type: "textarea" },
      { name: "published", label: "Publicado", type: "bool" },
    ],
  },
  {
    id: "gallery_photos",
    label: "Galeria",
    table: "gallery_photos",
    fields: [
      { name: "url", label: "URL da foto", type: "text" },
      { name: "title", label: "Título", type: "text" },
      { name: "description", label: "Descrição (texto alternativo)", type: "textarea" },
      { name: "sort_order", label: "Ordem", type: "number" },
      { name: "published", label: "Publicada", type: "bool" },
    ],
  },
  {
    id: "admin_users",
    label: "Equipe",
    table: "admin_users",
    titleField: "name",
    fields: [
      { name: "name", label: "Nome", type: "text" },
      { name: "email", label: "E-mail de acesso", type: "text" },
      {
        name: "role",
        label: "Função",
        type: "select",
        options: [
          { value: "admin", label: "Administrador" },
          { value: "editor", label: "Editor" },
          { value: "moderator", label: "Moderador" },
        ],
      },
      { name: "password", label: "Senha (deixe vazio para manter)", type: "password" },
      { name: "active", label: "Ativo", type: "bool" },
    ],
  },
];

function Admin() {
  const status = useServerFn(adminStatus);
  const login = useServerFn(adminLogin);
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void status().then((r) => setUnlocked(r.unlocked));
  }, [status]);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await login({ data: { password, email } });
      if (res.ok) setUnlocked(true);
      else setError("Dados de acesso incorretos.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    }
    setBusy(false);
  }

  if (unlocked === null) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  if (!unlocked) {
    return (
      <>
        <PageHeader
          eyebrow="Área restrita"
          title="Painel Administrativo"
          description="Entre com seus dados de acesso para gerenciar o site."
        />
        <section className="px-6 pb-24">
          <form onSubmit={onLogin} className="card-lux mx-auto max-w-md">
            <label className="text-sm text-muted-foreground" htmlFor="admin-email">
              E-mail (deixe vazio para usar a senha master)
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <label className="mt-5 block text-sm text-muted-foreground" htmlFor="admin-password">
              Senha
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className={inputClass}
            />
            {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
            <button type="submit" disabled={busy} className="btn-gold mt-6 w-full">
              {busy ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </section>
      </>
    );
  }

  return <Dashboard onLogout={() => setUnlocked(false)} />;
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const logout = useServerFn(adminLogout);
  const notificationsFn = useServerFn(adminNotifications);
  const readFn = useServerFn(adminReadNotifications);
  const backupFn = useServerFn(adminBackup);

  const [section, setSection] = useState("dashboard");
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    void notificationsFn().then((r) => setUnread(r.unread));
  }, [notificationsFn]);

  const nav = [
    { id: "dashboard", label: "Visão geral" },
    { id: "submissions", label: "Formulários" },
    { id: "prayers", label: "Pedidos de oração" },
    { id: "content", label: "Conteúdo do site" },
    ...crudSections.map((s) => ({ id: s.id, label: s.label })),
  ];

  async function downloadBackup() {
    const data = await backupFn();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `born-church-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader
        eyebrow="Área restrita"
        title="Painel Administrativo"
        description="Gerencie conteúdo, eventos, formulários e pedidos de oração do site."
      />

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {nav.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSection(t.id)}
                  className={
                    t.id === section
                      ? "rounded-full border border-gold bg-gold/10 px-5 py-2 text-sm text-gold"
                      : "rounded-full border border-border px-5 py-2 text-sm text-muted-foreground transition-colors hover:text-gold"
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="btn-outline"
                onClick={async () => {
                  await readFn();
                  setUnread(0);
                  setSection("submissions");
                }}
              >
                <Bell className="h-4 w-4" /> {unread > 0 ? `${unread} novos` : "Notificações"}
              </button>
              <button type="button" className="btn-outline" onClick={() => void downloadBackup()}>
                <Download className="h-4 w-4" /> Backup
              </button>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  onLogout();
                }}
                className="btn-outline"
              >
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </div>
          </div>

          <div className="mt-10">
            {section === "dashboard" ? <DashboardPanel onNavigate={setSection} /> : null}
            {section === "submissions" ? <SubmissionsPanel /> : null}
            {section === "prayers" ? <PrayersPanel /> : null}
            {section === "content" ? <ContentPanel /> : null}
            {crudSections.map((s) => (s.id === section ? <CrudPanel key={s.id} section={s} /> : null))}
          </div>
        </div>
      </section>
    </>
  );
}

function CrudPanel({ section }: { section: CrudSection }) {
  const list = useServerFn(adminList);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await list({ data: { table: section.table } });
    setRows(data);
    setLoading(false);
  }, [list, section.table]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <div className="space-y-6">
      <RowEditor
        key={`new-${section.id}`}
        table={section.table}
        fields={section.fields}
        row={emptyRow(section.fields)}
        isNew
        onSaved={refresh}
        {...(section.titleField ? { titleField: section.titleField } : {})}
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum registro ainda.</p>
      ) : (
        rows.map((row) => (
          <RowEditor
            key={String(row["id"])}
            table={section.table}
            fields={section.fields}
            row={row}
            onSaved={refresh}
            {...(section.titleField ? { titleField: section.titleField } : {})}
          />
        ))
      )}
    </div>
  );
}
