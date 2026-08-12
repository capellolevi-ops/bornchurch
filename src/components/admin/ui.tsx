import { Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";

import { adminDelete, adminSave, type Row, type Table } from "@/lib/admin.functions";
import { useServerFn } from "@tanstack/react-start";

export const inputClass =
  "mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold";

export type EditorField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "datetime" | "list" | "bool" | "password" | "select";
  options?: Array<{ value: string; label: string }>;
};

export function emptyRow(fields: EditorField[]): Row {
  const row: Row = {};
  for (const f of fields) {
    row[f.name] = f.type === "bool" ? true : f.type === "number" ? 0 : f.type === "list" ? [] : "";
  }
  return row;
}

function toInputValue(field: EditorField, value: unknown): string {
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

/** Formulário genérico de criação/edição de um registro. */
export function RowEditor({
  table,
  fields,
  row,
  isNew,
  onSaved,
  titleField = "title",
}: {
  table: Table;
  fields: EditorField[];
  row: Row;
  isNew?: boolean;
  onSaved: () => void | Promise<void>;
  titleField?: string;
}) {
  const save = useServerFn(adminSave);
  const remove = useServerFn(adminDelete);
  const [values, setValues] = useState<Record<string, string | boolean>>(() => {
    const initial: Record<string, string | boolean> = {};
    for (const f of fields) {
      initial[f.name] = f.type === "bool" ? Boolean(row[f.name]) : toInputValue(f, row[f.name]);
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
      else payload[f.name] = String(v ?? "");
    }
    if (table === "sermons" && payload["preached_on"]) {
      payload["preached_on"] = String(payload["preached_on"]).slice(0, 10);
    }
    if (table === "admin_users" && !payload["password"]) delete payload["password"];
    try {
      await save({
        data: isNew ? { table, values: payload } : { table, id: String(row["id"]), values: payload },
      });
      setMessage("Salvo!");
      if (isNew) {
        const cleared: Record<string, string | boolean> = {};
        for (const f of fields) cleared[f.name] = f.type === "bool" ? true : "";
        setValues(cleared);
      }
      await onSaved();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Não foi possível salvar.");
    }
    setBusy(false);
  }

  async function onDelete() {
    if (!window.confirm("Excluir este registro definitivamente?")) return;
    setBusy(true);
    await remove({ data: { table, id: String(row["id"]) } });
    await onSaved();
    setBusy(false);
  }

  return (
    <article className="card-lux">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">
        {isNew ? "Novo registro" : String(row[titleField] ?? row["title"] ?? "Registro")}
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {fields.map((f) => {
          const id = `${row["id"] ?? "new"}-${f.name}`;
          return (
            <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
              <label className="text-sm text-muted-foreground" htmlFor={id}>
                {f.label}
              </label>
              {f.type === "bool" ? (
                <div className="mt-2">
                  <input
                    id={id}
                    type="checkbox"
                    checked={Boolean(values[f.name])}
                    onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.checked }))}
                    className="h-5 w-5 accent-[var(--gold)]"
                  />
                </div>
              ) : f.type === "textarea" ? (
                <textarea
                  id={id}
                  rows={3}
                  value={String(values[f.name] ?? "")}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  className={inputClass}
                />
              ) : f.type === "select" ? (
                <select
                  id={id}
                  value={String(values[f.name] ?? "")}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  className={inputClass}
                >
                  {(f.options ?? []).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={id}
                  type={
                    f.type === "number"
                      ? "number"
                      : f.type === "date"
                        ? "date"
                        : f.type === "datetime"
                          ? "datetime-local"
                          : f.type === "password"
                            ? "password"
                            : "text"
                  }
                  autoComplete={f.type === "password" ? "new-password" : "off"}
                  value={String(values[f.name] ?? "")}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  className={inputClass}
                />
              )}
            </div>
          );
        })}
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

/** Etiqueta colorida de status. */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pending: { label: "Aguardando análise", className: "border-gold/60 text-gold" },
    approved: { label: "Aprovado", className: "border-emerald-500/60 text-emerald-400" },
    rejected: { label: "Não aprovado", className: "border-red-500/60 text-red-400" },
  };
  const item = map[status] ?? { label: status, className: "border-border text-muted-foreground" };
  return (
    <span className={`rounded-full border px-3 py-1 text-xs ${item.className}`}>{item.label}</span>
  );
}

/** Link de contato manual via WhatsApp. */
export function whatsappLink(phone: string, text: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;
  const full = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${full}?text=${encodeURIComponent(text)}`;
}
