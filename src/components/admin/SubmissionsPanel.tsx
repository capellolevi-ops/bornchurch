import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { StatusBadge, inputClass, whatsappLink } from "@/components/admin/ui";
import {
  adminDelete,
  adminSubmissions,
  adminUpdateSubmission,
  type Submission,
} from "@/lib/admin.functions";

const forms = [
  { value: "", label: "Todos os formulários" },
  { value: "novo-aqui", label: "Sou novo aqui" },
  { value: "servir", label: "Quero servir" },
  { value: "conte-nos", label: "Conte-nos sua história" },
  { value: "contato", label: "Contato" },
];

const statuses = [
  { value: "", label: "Todos os status" },
  { value: "pending", label: "Aguardando análise" },
  { value: "approved", label: "Aprovado" },
  { value: "rejected", label: "Não aprovado" },
];

/** Central de formulários e inscrições. */
export function SubmissionsPanel() {
  const listFn = useServerFn(adminSubmissions);
  const updateFn = useServerFn(adminUpdateSubmission);
  const removeFn = useServerFn(adminDelete);

  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [form, setForm] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await listFn({ data: { search, status, form, from, to } });
    setRows(data);
    setLoading(false);
  }, [listFn, search, status, form, from, to]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function setRowStatus(id: string, value: string) {
    await updateFn({ data: { id, status: value } });
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: value } : r)));
  }

  return (
    <div className="space-y-6">
      <div className="card-lux grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <label className="text-sm text-muted-foreground" htmlFor="sub-search">
            Buscar por nome, telefone ou mensagem
          </label>
          <input
            id="sub-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground" htmlFor="sub-form">
            Origem
          </label>
          <select id="sub-form" value={form} onChange={(e) => setForm(e.target.value)} className={inputClass}>
            {forms.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground" htmlFor="sub-status">
            Status
          </label>
          <select
            id="sub-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={inputClass}
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-muted-foreground" htmlFor="sub-from">
              De
            </label>
            <input
              id="sub-from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground" htmlFor="sub-to">
              Até
            </label>
            <input
              id="sub-to"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? "Carregando..." : `${rows.length} envio(s)`}
        </p>
        <button type="button" onClick={() => void refresh()} className="btn-outline">
          <RefreshCw className="h-4 w-4" /> Atualizar
        </button>
      </div>

      {rows.map((row) => {
        const wa = whatsappLink(row.phone, `Olá ${row.name.split(" ")[0] ?? ""}! Aqui é da Born Church.`);
        return (
          <article key={row.id} className="card-lux">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">{row.form_label || row.form_key}</p>
                <h3 className="mt-2 font-display text-xl text-foreground">{row.name || "Sem nome"}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(row.created_at).toLocaleString("pt-BR")}
                  {row.phone ? ` • ${row.phone}` : ""}
                  {row.email ? ` • ${row.email}` : ""}
                </p>
              </div>
              <StatusBadge status={row.status} />
            </div>

            {row.message ? (
              <p className="mt-4 whitespace-pre-line text-sm text-muted-foreground">{row.message}</p>
            ) : null}

            {row.payload && Object.keys(row.payload).length > 0 ? (
              <dl className="mt-4 grid gap-2 sm:grid-cols-2">
                {Object.entries(row.payload).map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-border bg-background/50 px-4 py-3">
                    <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{k}</dt>
                    <dd className="text-sm text-foreground">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button type="button" className="btn-gold" onClick={() => void setRowStatus(row.id, "approved")}>
                Aprovar
              </button>
              <button type="button" className="btn-outline" onClick={() => void setRowStatus(row.id, "rejected")}>
                Não aprovar
              </button>
              <button type="button" className="btn-outline" onClick={() => void setRowStatus(row.id, "pending")}>
                Aguardando
              </button>
              {wa ? (
                <a href={wa} target="_blank" rel="noreferrer" className="btn-outline">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              ) : null}
              <button
                type="button"
                className="btn-outline"
                onClick={async () => {
                  if (!window.confirm("Excluir este envio?")) return;
                  await removeFn({ data: { table: "submissions", id: row.id } });
                  await refresh();
                }}
              >
                <Trash2 className="h-4 w-4" /> Excluir
              </button>
            </div>
          </article>
        );
      })}

      {!loading && rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum envio encontrado com esses filtros.</p>
      ) : null}
    </div>
  );
}
