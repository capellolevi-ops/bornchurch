import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, LogOut, Plus, Save, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "@/components/site/PageHeader";
import {
  adminDelete,
  adminList,
  adminLogin,
  adminLogout,
  adminStatus,
  type Row,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel Administrativo — Born Church" },
      {
        name: "description",
        content:
          "Área restrita da Born Church para gerenciar horários de culto, eventos, avisos e pregações.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Painel Administrativo — Born Church" },
      { property: "og:description", content: "Área restrita da equipe da Born Church." },
    ],
  }),
  component: Admin,
});

type Table = "service_times" | "events" | "announcements" | "sermons";
type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "datetime" | "list" | "bool";
};

const tabs: Array<{ id: Table; label: string; fields: Field[] }> = [
  {
    id: "service_times",
    label: "Horários",
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
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "starts_at", label: "Data e hora", type: "datetime" },
      { name: "location", label: "Local", type: "text" },
      { name: "description", label: "Descrição", type: "textarea" },
      { name: "image_url", label: "URL da imagem (opcional)", type: "text" },
      { name: "featured", label: "Destaque", type: "bool" },
      { name: "published", label: "Publicado", type: "bool" },
    ],
  },
  {
    id: "announcements",
    label: "Avisos",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "body", label: "Mensagem", type: "textarea" },
      { name: "published", label: "Publicado", type: "bool" },
    ],
  },
  {
    id: "sermons",
    label: "Pregações",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "preacher", label: "Pregador", type: "text" },
      { name: "youtube_id", label: "ID do vídeo no YouTube", type: "text" },
      { name: "preached_on", label: "Data", type: "date" },
      { name: "description", label: "Descrição", type: "textarea" },
      { name: "published", label: "Publicado", type: "bool" },
    ],
  },
];

const inputClass =
  "mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold";

function emptyRow(fields: Field[]): Row {
  const row: Row = {};
  for (const f of fields) {
    row[f.name] =
      f.type === "bool" ? true : f.type === "number" ? 0 : f.type === "list" ? [] : "";
  }
  return row;
}

function Admin() {
  const status = useServerFn(adminStatus);
  const login = useServerFn(adminLogin);
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void status().then((r) => setUnlocked(r.unlocked));
  }, [status]);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await login({ data: { password } });
    setBusy(false);
    if (res.ok) setUnlocked(true);
    else setError(true);
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
          description="Entre com a senha da equipe para gerenciar o conteúdo do site."
        />
        <section className="px-6 pb-24">
          <form onSubmit={onLogin} className="card-lux mx-auto max-w-md">
            <label className="text-sm text-muted-foreground" htmlFor="admin-password">
              Senha
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={inputClass}
            />
            {error ? <p className="mt-3 text-sm text-red-400">Senha incorreta.</p> : null}
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
  const list = useServerFn(adminList);
  const logout = useServerFn(adminLogout);
  const [tab, setTab] = useState<Table>("service_times");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const current = tabs.find((t) => t.id === tab)!;

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await list({ data: { table: tab } });
    setRows(data);
    setLoading(false);
  }, [list, tab]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <>
      <PageHeader
        eyebrow="Área restrita"
        title="Painel Administrativo"
        description="Gerencie horários de culto, eventos, avisos e pregações do site."
      />

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={
                    t.id === tab
                      ? "rounded-full border border-gold bg-gold/10 px-5 py-2 text-sm text-gold"
                      : "rounded-full border border-border px-5 py-2 text-sm text-muted-foreground transition-colors hover:text-gold"
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
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

          <div className="mt-10 space-y-6">
            <RowEditor
              key={`new-${tab}`}
              table={tab}
              fields={current.fields}
              row={emptyRow(current.fields)}
              isNew
              onSaved={refresh}
            />

            {loading ? (
              <p className="text-sm text-muted-foreground">Carregando...</p>
            ) : rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum registro ainda.</p>
            ) : (
              rows.map((row) => (
                <RowEditor
                  key={String(row["id"])}
                  table={tab}
                  fields={current.fields}
                  row={row}
                  onSaved={refresh}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function toInputValue(field: Field, value: unknown): string {
  if (value === null || value === undefined) return "";
  if (field.type === "list") return Array.isArray(value) ? value.join(", ") : String(value);
  if (field.type === "datetime") {
    const d = new Date(String(value));
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  return String(value);
}

function RowEditor({
  table,
  fields,
  row,
  isNew,
  onSaved,
}: {
  table: Table;
  fields: Field[];
  row: Row;
  isNew?: boolean;
  onSaved: () => void | Promise<void>;
}) {
  const save = useServerFn(adminSave);
  const remove = useServerFn(adminDelete);
  const [values, setValues] = useState<Record<string, string | boolean>>(() => {
    const initial: Record<string, string | boolean> = {};
    for (const f of fields) {
      initial[f.name] =
        f.type === "bool" ? Boolean(row[f.name]) : toInputValue(f, row[f.name]);
    }
    return initial;
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function onSave() {
    setBusy(true);
    setMessage("");
    const payload: Row = {};
    for (const f of fields) {
      const v = values[f.name];
      if (f.type === "bool") payload[f.name] = Boolean(v);
      else if (f.type === "number") payload[f.name] = Number(v || 0);
      else if (f.type === "list")
        payload[f.name] = String(v)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      else if (f.type === "datetime" || f.type === "date")
        payload[f.name] = v ? new Date(String(v)).toISOString() : null;
      else payload[f.name] = String(v);
    }
    if (table === "sermons" && payload["preached_on"]) {
      payload["preached_on"] = String(payload["preached_on"]).slice(0, 10);
    }
    try {
      await save({
        data: isNew
          ? { table, values: payload }
          : { table, id: String(row["id"]), values: payload },
      });
      setMessage("Salvo!");
      if (isNew) {
        const cleared: Record<string, string | boolean> = {};
        for (const f of fields) cleared[f.name] = f.type === "bool" ? true : "";
        setValues(cleared);
      }
      await onSaved();
    } catch {
      setMessage("Não foi possível salvar.");
    }
    setBusy(false);
  }

  async function onDelete() {
    setBusy(true);
    await remove({ data: { table, id: String(row["id"]) } });
    await onSaved();
    setBusy(false);
  }

  return (
    <article className="card-lux">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">
        {isNew ? "Novo registro" : String(row["title"] ?? "Registro")}
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
            <label className="text-sm text-muted-foreground" htmlFor={`${row["id"] ?? "new"}-${f.name}`}>
              {f.label}
            </label>
            {f.type === "bool" ? (
              <div className="mt-2">
                <input
                  id={`${row["id"] ?? "new"}-${f.name}`}
                  type="checkbox"
                  checked={Boolean(values[f.name])}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [f.name]: e.target.checked }))
                  }
                  className="h-5 w-5 accent-[var(--gold)]"
                />
              </div>
            ) : f.type === "textarea" ? (
              <textarea
                id={`${row["id"] ?? "new"}-${f.name}`}
                rows={3}
                value={String(values[f.name] ?? "")}
                onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                className={inputClass}
              />
            ) : (
              <input
                id={`${row["id"] ?? "new"}-${f.name}`}
                type={
                  f.type === "number"
                    ? "number"
                    : f.type === "date"
                      ? "date"
                      : f.type === "datetime"
                        ? "datetime-local"
                        : "text"
                }
                value={String(values[f.name] ?? "")}
                onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                className={inputClass}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={onSave} disabled={busy} className="btn-gold">
          {isNew ? <Plus className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {isNew ? "Adicionar" : "Salvar"}
        </button>
        {!isNew ? (
          <button type="button" onClick={onDelete} disabled={busy} className="btn-outline">
            <Trash2 className="h-4 w-4" /> Excluir
          </button>
        ) : null}
        {message ? <span className="text-sm text-gold">{message}</span> : null}
      </div>
    </article>
  );
}
