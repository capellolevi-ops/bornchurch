import { useServerFn } from "@tanstack/react-start";
import { Heart, MessageCircle, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { StatusBadge, inputClass, whatsappLink } from "@/components/admin/ui";
import { adminDelete, adminPrayers, adminUpdatePrayer, type PrayerRow } from "@/lib/admin.functions";

/** Moderação de pedidos de oração (privados e públicos). */
export function PrayersPanel() {
  const listFn = useServerFn(adminPrayers);
  const updateFn = useServerFn(adminUpdatePrayer);
  const removeFn = useServerFn(adminDelete);

  const [rows, setRows] = useState<PrayerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [visibility, setVisibility] = useState("");
  const [replies, setReplies] = useState<Record<string, string>>({});

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await listFn({ data: { search, status, visibility } });
    setRows(data);
    setLoading(false);
  }, [listFn, search, status, visibility]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function patch(id: string, values: { status?: string; visibility?: string; admin_reply?: string }) {
    await updateFn({ data: { id, ...values } });
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...values } : r)));
  }

  return (
    <div className="space-y-6">
      <div className="card-lux grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-sm text-muted-foreground" htmlFor="pr-search">
            Buscar
          </label>
          <input id="pr-search" value={search} onChange={(e) => setSearch(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground" htmlFor="pr-status">
            Status
          </label>
          <select id="pr-status" value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
            <option value="">Todos</option>
            <option value="pending">Aguardando análise</option>
            <option value="approved">Aprovado</option>
            <option value="rejected">Não aprovado</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground" htmlFor="pr-vis">
            Visibilidade
          </label>
          <select
            id="pr-vis"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className={inputClass}
          >
            <option value="">Todas</option>
            <option value="private">Privado</option>
            <option value="public">Público</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? "Carregando..." : `${rows.length} pedido(s)`}
        </p>
        <button type="button" onClick={() => void refresh()} className="btn-outline">
          <RefreshCw className="h-4 w-4" /> Atualizar
        </button>
      </div>

      {rows.map((row) => {
        const wa = whatsappLink(row.phone, `Olá ${row.name.split(" ")[0] ?? ""}! Estamos orando por você.`);
        return (
          <article key={row.id} className="card-lux">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">
                  {row.visibility === "public" ? "Pedido público" : "Pedido privado"}
                </p>
                <h3 className="mt-2 font-display text-xl text-foreground">{row.name || "Anônimo"}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(row.created_at).toLocaleString("pt-BR")}
                  {row.phone ? ` • ${row.phone}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-sm text-gold">
                  <Heart className="h-4 w-4" /> {row.prayer_count}
                </span>
                <StatusBadge status={row.status} />
              </div>
            </div>

            <p className="mt-4 whitespace-pre-line text-sm text-muted-foreground">{row.message}</p>

            <div className="mt-4">
              <label className="text-sm text-muted-foreground" htmlFor={`reply-${row.id}`}>
                Resposta / observação da equipe
              </label>
              <textarea
                id={`reply-${row.id}`}
                rows={2}
                value={replies[row.id] ?? row.admin_reply ?? ""}
                onChange={(e) => setReplies((p) => ({ ...p, [row.id]: e.target.value }))}
                className={inputClass}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button type="button" className="btn-gold" onClick={() => void patch(row.id, { status: "approved" })}>
                Aprovar
              </button>
              <button type="button" className="btn-outline" onClick={() => void patch(row.id, { status: "rejected" })}>
                Não aprovar
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() =>
                  void patch(row.id, { visibility: row.visibility === "public" ? "private" : "public" })
                }
              >
                Tornar {row.visibility === "public" ? "privado" : "público"}
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => void patch(row.id, { admin_reply: replies[row.id] ?? row.admin_reply ?? "" })}
              >
                Salvar resposta
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
                  if (!window.confirm("Excluir este pedido?")) return;
                  await removeFn({ data: { table: "prayer_requests", id: row.id } });
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
        <p className="text-sm text-muted-foreground">Nenhum pedido encontrado.</p>
      ) : null}
    </div>
  );
}
