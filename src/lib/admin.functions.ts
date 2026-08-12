import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

/** Sessão criptografada do painel administrativo. */
type AdminSession = { unlocked?: boolean; role?: AdminRole; name?: string; seen?: number };

export type AdminRole = "admin" | "editor" | "moderator";

const INACTIVITY_MS = 2 * 60 * 60 * 1000; // 2 horas sem uso encerram a sessão

function sessionConfig() {
  return {
    password: process.env["ADMIN_SESSION_SECRET"]!,
    name: "born-admin",
    maxAge: 60 * 60 * 12,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function sha256(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function matches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

/** Proteção simples contra força bruta (por identificador). */
const attempts = new Map<string, { count: number; until: number }>();

function checkThrottle(key: string) {
  const entry = attempts.get(key);
  if (entry && entry.until > Date.now()) {
    const mins = Math.ceil((entry.until - Date.now()) / 60000);
    throw new Error(`Muitas tentativas. Tente novamente em ${mins} min.`);
  }
}

function registerFailure(key: string) {
  const entry = attempts.get(key) ?? { count: 0, until: 0 };
  entry.count += 1;
  if (entry.count >= 5) {
    entry.until = Date.now() + 15 * 60 * 1000;
    entry.count = 0;
  }
  attempts.set(key, entry);
}

async function currentSession() {
  return useSession<AdminSession>(sessionConfig());
}

async function requireAdmin(roles?: AdminRole[]) {
  const session = await currentSession();
  const data = session.data;
  if (!data.unlocked) throw new Error("Não autorizado");
  if (data.seen && Date.now() - data.seen > INACTIVITY_MS) {
    await session.clear();
    throw new Error("Sessão expirada por inatividade");
  }
  const role = data.role ?? "admin";
  if (roles && !roles.includes(role) && role !== "admin") throw new Error("Sem permissão");
  await session.update({ seen: Date.now() });
  return { role, name: data.name ?? "Equipe" };
}

async function db() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await currentSession();
  const data = session.data;
  const expired = Boolean(data.seen && Date.now() - data.seen > INACTIVITY_MS);
  if (expired) await session.clear();
  return {
    unlocked: data.unlocked === true && !expired,
    role: (data.role ?? "admin") as AdminRole,
    name: data.name ?? "Equipe",
  };
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string; email?: string }) => data)
  .handler(async ({ data }) => {
    const email = (data.email ?? "").trim().toLowerCase();
    const key = email || "master";
    checkThrottle(key);

    const session = await currentSession();

    if (email) {
      const client = await db();
      const { data: user } = await client
        .from("admin_users")
        .select("id, name, role, active, password_hash")
        .eq("email", email)
        .maybeSingle();
      if (!user || !user.active || user.password_hash !== sha256(data.password)) {
        registerFailure(key);
        return { ok: false as const };
      }
      await session.update({
        unlocked: true,
        role: user.role as AdminRole,
        name: user.name,
        seen: Date.now(),
      });
      return { ok: true as const };
    }

    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected) throw new Error("Senha do painel não configurada");
    if (!matches(data.password, expected)) {
      registerFailure(key);
      return { ok: false as const };
    }
    await session.update({ unlocked: true, role: "admin", name: "Administrador", seen: Date.now() });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await currentSession();
  await session.clear();
  return { ok: true as const };
});

export type Table =
  | "service_times"
  | "events"
  | "announcements"
  | "sermons"
  | "gallery_photos"
  | "banners"
  | "admin_users";

type Value = string | number | boolean | string[] | null;
export type Row = Record<string, Value>;

const orderBy: Record<Table, { column: string; ascending: boolean }> = {
  service_times: { column: "sort_order", ascending: true },
  events: { column: "starts_at", ascending: true },
  announcements: { column: "created_at", ascending: false },
  sermons: { column: "created_at", ascending: false },
  gallery_photos: { column: "sort_order", ascending: true },
  banners: { column: "created_at", ascending: false },
  admin_users: { column: "created_at", ascending: false },
};

type AnyDb = {
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

/** Lista todos os registros (inclusive não publicados) — apenas para o painel. */
export const adminList = createServerFn({ method: "POST" })
  .inputValidator((data: { table: Table }) => data)
  .handler(async ({ data }) => {
    await requireAdmin(["editor"]);
    const client = (await db()) as unknown as AnyDb;
    const order = orderBy[data.table];
    const columns = data.table === "admin_users" ? "id, name, email, role, active, created_at" : "*";
    const { data: rows, error } = await client
      .from(data.table)
      .select(columns)
      .order(order.column, { ascending: order.ascending });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminSave = createServerFn({ method: "POST" })
  .inputValidator((data: { table: Table; id?: string; values: Row }) => data)
  .handler(async ({ data }) => {
    await requireAdmin(data.table === "admin_users" ? [] : ["editor"]);
    const client = (await db()) as unknown as AnyDb;
    const values: Row = { ...data.values };

    if (data.table === "admin_users") {
      const password = String(values["password"] ?? "");
      delete values["password"];
      if (password) values["password_hash"] = sha256(password);
      else if (!data.id) throw new Error("Defina uma senha para o novo usuário");
      values["email"] = String(values["email"] ?? "").trim().toLowerCase();
    }

    if (data.id) {
      const { error } = await client.from(data.table).update(values).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await client.from(data.table).insert(values);
      if (error) throw new Error(error.message);
    }
    return { ok: true as const };
  });

export const adminDelete = createServerFn({ method: "POST" })
  .inputValidator((data: { table: Table | "submissions" | "prayer_requests"; id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin(data.table === "admin_users" ? [] : ["editor", "moderator"]);
    const client = (await db()) as unknown as AnyDb;
    const { error } = await client.from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/* ============================ Conteúdo do site ============================ */

export const adminContent = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin(["editor"]);
  const client = await db();
  const { data } = await client.from("site_content").select("key, value");
  const out: Record<string, Record<string, string>> = {};
  for (const row of data ?? []) {
    const value = (row.value ?? {}) as Record<string, unknown>;
    const flat: Record<string, string> = {};
    for (const [k, v] of Object.entries(value)) flat[k] = String(v ?? "");
    out[row.key] = flat;
  }
  return out;
});

export const adminSaveContent = createServerFn({ method: "POST" })
  .inputValidator((data: { key: string; value: Record<string, string> }) => data)
  .handler(async ({ data }) => {
    await requireAdmin(["editor"]);
    const client = await db();
    const value: Record<string, string | boolean> = { ...data.value };
    if ("enabled" in value) value["enabled"] = String(value["enabled"]) === "true";
    const { error } = await client
      .from("site_content")
      .upsert({ key: data.key, value: value as never }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/* ========================= Formulários e inscrições ======================== */

export type Submission = {
  id: string;
  form_key: string;
  form_label: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  payload: Record<string, string>;
  needs_review: boolean;
  status: string;
  notes: string;
  created_at: string;
};

export const adminSubmissions = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { search?: string; status?: string; form?: string; from?: string; to?: string }) => data,
  )
  .handler(async ({ data }) => {
    await requireAdmin(["editor", "moderator"]);
    const client = await db();
    let query = client.from("submissions").select("*").order("created_at", { ascending: false });
    if (data.status) query = query.eq("status", data.status);
    if (data.form) query = query.eq("form_key", data.form);
    if (data.from) query = query.gte("created_at", new Date(data.from).toISOString());
    if (data.to) query = query.lte("created_at", new Date(`${data.to}T23:59:59`).toISOString());
    const search = (data.search ?? "").trim();
    if (search) {
      const like = `%${search.replace(/[%,]/g, "")}%`;
      query = query.or(`name.ilike.${like},phone.ilike.${like},email.ilike.${like},message.ilike.${like}`);
    }
    const { data: rows, error } = await query.limit(300);
    if (error) throw new Error(error.message);
    return (rows ?? []) as unknown as Submission[];
  });

export const adminUpdateSubmission = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; status?: string; notes?: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin(["editor", "moderator"]);
    const client = await db();
    const patch: Record<string, string> = {};
    if (data.status) patch["status"] = data.status;
    if (data.notes !== undefined) patch["notes"] = data.notes;
    const { error } = await client.from("submissions").update(patch as never).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/* ============================ Pedidos de oração =========================== */

export type PrayerRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  visibility: string;
  status: string;
  admin_reply: string;
  prayer_count: number;
  created_at: string;
};

export const adminPrayers = createServerFn({ method: "POST" })
  .inputValidator((data: { search?: string; status?: string; visibility?: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin(["editor", "moderator"]);
    const client = await db();
    let query = client.from("prayer_requests").select("*").order("created_at", { ascending: false });
    if (data.status) query = query.eq("status", data.status);
    if (data.visibility) query = query.eq("visibility", data.visibility);
    const search = (data.search ?? "").trim();
    if (search) {
      const like = `%${search.replace(/[%,]/g, "")}%`;
      query = query.or(`name.ilike.${like},message.ilike.${like},phone.ilike.${like}`);
    }
    const { data: rows, error } = await query.limit(300);
    if (error) throw new Error(error.message);
    return (rows ?? []) as unknown as PrayerRow[];
  });

export const adminUpdatePrayer = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { id: string; status?: string; visibility?: string; admin_reply?: string }) => data,
  )
  .handler(async ({ data }) => {
    await requireAdmin(["editor", "moderator"]);
    const client = await db();
    const patch: Record<string, string> = {};
    if (data.status) patch["status"] = data.status;
    if (data.visibility) patch["visibility"] = data.visibility;
    if (data.admin_reply !== undefined) patch["admin_reply"] = data.admin_reply;
    const { error } = await client.from("prayer_requests").update(patch as never).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/* ============================== Dashboard ================================= */

export const adminDashboard = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin(["editor", "moderator"]);
  const client = await db();
  const nowIso = new Date().toISOString();

  const [pendingSubs, totalSubs, pendingPrayers, publicPending, events, recent] = await Promise.all([
    client.from("submissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
    client.from("submissions").select("id", { count: "exact", head: true }),
    client.from("prayer_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
    client
      .from("prayer_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .eq("visibility", "public"),
    client
      .from("events")
      .select("id, title, starts_at, location")
      .eq("published", true)
      .gte("starts_at", nowIso)
      .order("starts_at", { ascending: true })
      .limit(5),
    client
      .from("submissions")
      .select("id, name, form_label, created_at, status")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  return {
    pendingSubmissions: pendingSubs.count ?? 0,
    totalSubmissions: totalSubs.count ?? 0,
    pendingPrayers: pendingPrayers.count ?? 0,
    publicPendingPrayers: publicPending.count ?? 0,
    upcomingEvents: (events.data ?? []) as Array<{
      id: string;
      title: string;
      starts_at: string;
      location: string;
    }>,
    recent: (recent.data ?? []) as Array<{
      id: string;
      name: string;
      form_label: string;
      created_at: string;
      status: string;
    }>,
  };
});

/* ============================ Notificações ================================ */

export const adminNotifications = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin(["editor", "moderator"]);
  const client = await db();
  const { data } = await client
    .from("admin_notifications")
    .select("id, kind, title, body, read, created_at")
    .order("created_at", { ascending: false })
    .limit(30);
  const rows = (data ?? []) as Array<{
    id: string;
    kind: string;
    title: string;
    body: string;
    read: boolean;
    created_at: string;
  }>;
  return { items: rows, unread: rows.filter((r) => !r.read).length };
});

export const adminReadNotifications = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin(["editor", "moderator"]);
  const client = await db();
  await client.from("admin_notifications").update({ read: true }).eq("read", false);
  return { ok: true as const };
});

/* ================================ Backup ================================== */

export const adminBackup = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin([]);
  const client = (await db()) as unknown as AnyDb;
  const tables = [
    "submissions",
    "prayer_requests",
    "events",
    "service_times",
    "announcements",
    "sermons",
    "gallery_photos",
    "banners",
    "site_content",
  ];
  const out: Record<string, Row[]> = {};
  for (const table of tables) {
    const { data } = await client.from(table).select("*").order("created_at", { ascending: false });
    out[table] = data ?? [];
  }
  return { generatedAt: new Date().toISOString(), data: out };
});
