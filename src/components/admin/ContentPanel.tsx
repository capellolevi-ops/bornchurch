import { useServerFn } from "@tanstack/react-start";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";

import { inputClass } from "@/components/admin/ui";
import { adminContent, adminSaveContent } from "@/lib/admin.functions";

type Group = {
  key: string;
  title: string;
  hint: string;
  fields: Array<{ name: string; label: string; multiline?: boolean; bool?: boolean }>;
};

const groups: Group[] = [
  {
    key: "hero",
    title: "Página inicial (Hero)",
    hint: "Textos principais exibidos na abertura do site.",
    fields: [
      { name: "highlight", label: "Frase de destaque" },
      { name: "title", label: "Título" },
      { name: "subtitle", label: "Subtítulo", multiline: true },
      { name: "primaryLabel", label: "Botão 1 — texto" },
      { name: "primaryLink", label: "Botão 1 — link" },
      { name: "secondaryLabel", label: "Botão 2 — texto" },
      { name: "secondaryLink", label: "Botão 2 — link" },
    ],
  },
  {
    key: "messages",
    title: "Mensagens de confirmação",
    hint: "Textos exibidos após o envio dos formulários.",
    fields: [
      { name: "form", label: "Após enviar um formulário", multiline: true },
      { name: "prayer", label: "Após enviar um pedido de oração", multiline: true },
    ],
  },
  {
    key: "maintenance",
    title: "Modo manutenção",
    hint: "Quando ativo, os visitantes veem apenas um aviso.",
    fields: [
      { name: "enabled", label: "Ativar modo manutenção", bool: true },
      { name: "title", label: "Título" },
      { name: "message", label: "Mensagem", multiline: true },
    ],
  },
];

/** Editor dos textos e configurações do site. */
export function ContentPanel() {
  const loadFn = useServerFn(adminContent);
  const saveFn = useServerFn(adminSaveContent);
  const [content, setContent] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    void loadFn().then((data) => {
      setContent(data);
      setLoading(false);
    });
  }, [loadFn]);

  function set(groupKey: string, field: string, value: string) {
    setContent((prev) => ({ ...prev, [groupKey]: { ...(prev[groupKey] ?? {}), [field]: value } }));
  }

  async function save(groupKey: string) {
    await saveFn({ data: { key: groupKey, value: content[groupKey] ?? {} } });
    setSaved(groupKey);
    window.setTimeout(() => setSaved(""), 2500);
  }

  if (loading) return <p className="text-sm text-muted-foreground">Carregando...</p>;

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.key} className="card-lux">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">{group.title}</p>
          <p className="mt-2 text-sm text-muted-foreground">{group.hint}</p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {group.fields.map((f) => {
              const id = `${group.key}-${f.name}`;
              const value = content[group.key]?.[f.name] ?? "";
              return (
                <div key={f.name} className={f.multiline ? "sm:col-span-2" : ""}>
                  <label className="text-sm text-muted-foreground" htmlFor={id}>
                    {f.label}
                  </label>
                  {f.bool ? (
                    <div className="mt-2">
                      <input
                        id={id}
                        type="checkbox"
                        checked={value === "true"}
                        onChange={(e) => set(group.key, f.name, e.target.checked ? "true" : "false")}
                        className="h-5 w-5 accent-[var(--gold)]"
                      />
                    </div>
                  ) : f.multiline ? (
                    <textarea
                      id={id}
                      rows={3}
                      value={value}
                      onChange={(e) => set(group.key, f.name, e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    <input
                      id={id}
                      value={value}
                      onChange={(e) => set(group.key, f.name, e.target.value)}
                      className={inputClass}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button type="button" className="btn-gold" onClick={() => void save(group.key)}>
              <Save className="h-4 w-4" /> Salvar
            </button>
            {saved === group.key ? <span className="text-sm text-gold">Salvo!</span> : null}
          </div>
        </section>
      ))}
    </div>
  );
}
