import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

/** Cliente público (chave publicável) — respeita as políticas de acesso. */
function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
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

export type Artist = {
  id: string;
  name: string;
  slug: string;
  photo_url: string | null;
  bio: string;
};

export type Album = {
  id: string;
  title: string;
  slug: string;
  cover_url: string | null;
  year: number | null;
  description: string;
  artist_id: string | null;
  music_artists?: { name: string; slug: string } | null;
};

export type Track = {
  id: string;
  title: string;
  slug: string;
  cover_url: string | null;
  audio_url: string | null;
  youtube_id: string;
  genre: string;
  kind: string;
  duration_seconds: number;
  description: string;
  credits: string;
  lyrics: string;
  play_count: number;
  track_number: number;
  released_on: string | null;
  created_at: string;
  artist_id: string | null;
  album_id: string | null;
  music_artists?: { name: string; slug: string } | null;
  music_albums?: { title: string; slug: string; cover_url: string | null } | null;
};

export type Playlist = {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_url: string | null;
  owner_id: string | null;
  is_public: boolean;
  is_collaborative: boolean;
  featured: boolean;
};

const TRACK_COLUMNS =
  "id, title, slug, cover_url, audio_url, youtube_id, genre, kind, duration_seconds, description, credits, lyrics, play_count, track_number, released_on, created_at, artist_id, album_id, music_artists(name, slug), music_albums(title, slug, cover_url)";

/** Conteúdo da home da plataforma de música. */
export const getMusicHome = createServerFn({ method: "GET" }).handler(async () => {
  const db = publicClient();
  const [popular, releases, artists, albums, playlists, sermons] = await Promise.all([
    db
      .from("music_tracks")
      .select(TRACK_COLUMNS)
      .eq("published", true)
      .eq("kind", "song")
      .order("play_count", { ascending: false })
      .limit(12),
    db
      .from("music_tracks")
      .select(TRACK_COLUMNS)
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(12),
    db.from("music_artists").select("id, name, slug, photo_url, bio").eq("published", true).limit(12),
    db
      .from("music_albums")
      .select("id, title, slug, cover_url, year, description, artist_id, music_artists(name, slug)")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(12),
    db
      .from("playlists")
      .select("id, title, slug, description, cover_url, owner_id, is_public, is_collaborative, featured")
      .eq("is_public", true)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(12),
    db
      .from("music_tracks")
      .select(TRACK_COLUMNS)
      .eq("published", true)
      .in("kind", ["sermon", "podcast"])
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  return {
    popular: (popular.data ?? []) as unknown as Track[],
    releases: (releases.data ?? []) as unknown as Track[],
    artists: (artists.data ?? []) as Artist[],
    albums: (albums.data ?? []) as unknown as Album[],
    playlists: (playlists.data ?? []) as Playlist[],
    sermons: (sermons.data ?? []) as unknown as Track[],
  };
});

/** Lista de faixas paginada, opcionalmente filtrada por tipo. */
export const listTracks = createServerFn({ method: "POST" })
  .inputValidator((data: { kind?: string; limit?: number; offset?: number }) => data)
  .handler(async ({ data }) => {
    let query = publicClient()
      .from("music_tracks")
      .select(TRACK_COLUMNS)
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (data.kind) query = query.eq("kind", data.kind);
    const offset = data.offset ?? 0;
    const limit = Math.min(data.limit ?? 40, 100);
    const { data: rows } = await query.range(offset, offset + limit - 1);
    return (rows ?? []) as unknown as Track[];
  });

/** Busca global agrupada por categoria. */
export const searchMusic = createServerFn({ method: "POST" })
  .inputValidator((data: { q: string }) => data)
  .handler(async ({ data }) => {
    const term = (data.q ?? "").trim().replace(/[%,]/g, "");
    if (term.length < 2) {
      return { tracks: [] as Track[], artists: [] as Artist[], albums: [] as Album[], playlists: [] as Playlist[] };
    }
    const like = `%${term}%`;
    const db = publicClient();
    const [tracks, artists, albums, playlists] = await Promise.all([
      db.from("music_tracks").select(TRACK_COLUMNS).eq("published", true).ilike("title", like).limit(20),
      db.from("music_artists").select("id, name, slug, photo_url, bio").eq("published", true).ilike("name", like).limit(12),
      db
        .from("music_albums")
        .select("id, title, slug, cover_url, year, description, artist_id, music_artists(name, slug)")
        .eq("published", true)
        .ilike("title", like)
        .limit(12),
      db
        .from("playlists")
        .select("id, title, slug, description, cover_url, owner_id, is_public, is_collaborative, featured")
        .eq("is_public", true)
        .ilike("title", like)
        .limit(12),
    ]);
    return {
      tracks: (tracks.data ?? []) as unknown as Track[],
      artists: (artists.data ?? []) as Artist[],
      albums: (albums.data ?? []) as unknown as Album[],
      playlists: (playlists.data ?? []) as Playlist[],
    };
  });

/** Página de artista com músicas e álbuns. */
export const getArtist = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const db = publicClient();
    const { data: artist } = await db
      .from("music_artists")
      .select("id, name, slug, photo_url, bio")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (!artist) return null;
    const [tracks, albums] = await Promise.all([
      db
        .from("music_tracks")
        .select(TRACK_COLUMNS)
        .eq("published", true)
        .eq("artist_id", artist.id)
        .order("play_count", { ascending: false })
        .limit(50),
      db
        .from("music_albums")
        .select("id, title, slug, cover_url, year, description, artist_id, music_artists(name, slug)")
        .eq("published", true)
        .eq("artist_id", artist.id)
        .order("year", { ascending: false })
        .limit(30),
    ]);
    return {
      artist: artist as Artist,
      tracks: (tracks.data ?? []) as unknown as Track[],
      albums: (albums.data ?? []) as unknown as Album[],
    };
  });

/** Página de álbum com faixas ordenadas. */
export const getAlbum = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const db = publicClient();
    const { data: album } = await db
      .from("music_albums")
      .select("id, title, slug, cover_url, year, description, artist_id, music_artists(name, slug)")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (!album) return null;
    const { data: tracks } = await db
      .from("music_tracks")
      .select(TRACK_COLUMNS)
      .eq("published", true)
      .eq("album_id", album.id)
      .order("track_number", { ascending: true })
      .limit(100);
    return { album: album as unknown as Album, tracks: (tracks ?? []) as unknown as Track[] };
  });

/** Página de playlist pública. */
export const getPlaylist = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const db = publicClient();
    const { data: playlist } = await db
      .from("playlists")
      .select("id, title, slug, description, cover_url, owner_id, is_public, is_collaborative, featured")
      .eq("slug", data.slug)
      .eq("is_public", true)
      .maybeSingle();
    if (!playlist) return null;
    const { data: rows } = await db
      .from("playlist_tracks")
      .select(`position, music_tracks(${TRACK_COLUMNS})`)
      .eq("playlist_id", playlist.id)
      .order("position", { ascending: true })
      .limit(300);
    const tracks = (rows ?? [])
      .map((r) => (r as unknown as { music_tracks: Track | null }).music_tracks)
      .filter((t): t is Track => Boolean(t));
    return { playlist: playlist as Playlist, tracks };
  });

/** Página individual de uma faixa (link profundo/compartilhamento). */
export const getTrack = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const db = publicClient();
    const { data: track } = await db
      .from("music_tracks")
      .select(TRACK_COLUMNS)
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (!track) return null;
    const t = track as unknown as Track;
    const { data: related } = await db
      .from("music_tracks")
      .select(TRACK_COLUMNS)
      .eq("published", true)
      .neq("id", t.id)
      .eq(t.artist_id ? "artist_id" : "kind", t.artist_id ?? t.kind)
      .limit(8);
    return { track: t, related: (related ?? []) as unknown as Track[] };
  });

/** Registra uma reprodução (contador global). */
export const registerPlay = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: count } = await supabaseAdmin.rpc("increment_track_play", { _id: data.id });
    return { count: Number(count ?? 0) };
  });
