import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

export type ServiceTime = {
  id: string;
  day: string;
  title: string;
  times: string[];
  description: string;
};

export type Sermon = {
  id: string;
  title: string;
  preacher: string;
  youtube_id: string;
  description: string;
};

export type Announcement = { id: string; title: string; body: string };

export type EventItem = {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  location: string;
};

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const getServiceTimes = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("service_times")
    .select("id, day, title, times, description")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  return (data ?? []) as ServiceTime[];
});

export const getSermons = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("sermons")
    .select("id, title, preacher, youtube_id, description")
    .eq("published", true)
    .order("created_at", { ascending: false });
  return (data ?? []) as Sermon[];
});

export const getAnnouncements = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("announcements")
    .select("id, title, body")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(4);
  return (data ?? []) as Announcement[];
});

export const getEvents = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("events")
    .select("id, title, description, starts_at, location")
    .eq("published", true)
    .order("starts_at", { ascending: true })
    .limit(6);
  return (data ?? []) as EventItem[];
});
