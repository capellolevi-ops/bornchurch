import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

/** Sessão criptografada do painel administrativo. */
type AdminSession = { unlocked?: boolean };

function sessionConfig() {
  return {
    password: process.env["ADMIN_SESSION_SECRET"]!,
    name: "born-admin",
    maxAge: 60 * 60 * 12,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function matches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireAdmin() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.unlocked) throw new Error("Não autorizado");
}

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  return { unlocked: session.data.unlocked === true };
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected) throw new Error("Senha do painel não configurada");
    if (!matches(data.password, expected)) return { ok: false as const };
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

type Table = "service_times" | "events" | "announcements" | "sermons";
type Value = string | number | boolean | string[] | null;
export type Row = Record<string, Value>;

const orderBy: Record<Table, { column: string; ascending: boolean }> = {
  service_times: { column: "sort_order", ascending: true },
  events: { column: "starts_at", ascending: true },
  announcements: { column: "created_at", ascending: false },
  sermons: { column: "created_at", ascending: false },
};

/** Lista todos os registros (inclusive não publicados) — apenas para o painel. */
export const adminList = createServerFn({ method: "POST" })
  .inputValidator((data: { table: Table }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const order = orderBy[data.table];
    const db = supabaseAdmin as unknown as {
      from: (t: string) => {
        select: (c: string) => {
          order: (
            c: string,
            o: { ascending: boolean },
          ) => Promise<{ data: Row[] | null; error: { message: string } | null }>;
        };
        update: (v: Row) => { eq: (c: string, v: string) => Promise<{ error: { message: string } | null }> };
        insert: (v: Row) => Promise<{ error: { message: string } | null }>;
        delete: () => { eq: (c: string, v: string) => Promise<{ error: { message: string } | null }> };
      };
    };
    const { data: rows, error } = await db
      .from(data.table)
      .select("*")
      .order(order.column, { ascending: order.ascending });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminSave = createServerFn({ method: "POST" })
  .inputValidator((data: { table: Table; id?: string; values: Row }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as unknown as {
      from: (t: string) => {
        update: (v: Row) => { eq: (c: string, v: string) => Promise<{ error: { message: string } | null }> };
        insert: (v: Row) => Promise<{ error: { message: string } | null }>;
      };
    };
    if (data.id) {
      const { error } = await db
        .from(data.table)
        .update(data.values)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await db.from(data.table).insert(data.values);
      if (error) throw new Error(error.message);
    }
    return { ok: true as const };
  });

export const adminDelete = createServerFn({ method: "POST" })
  .inputValidator((data: { table: Table; id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as unknown as {
      from: (t: string) => {
        delete: () => { eq: (c: string, v: string) => Promise<{ error: { message: string } | null }> };
      };
    };
    const { error } = await db.from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
