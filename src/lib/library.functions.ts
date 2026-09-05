import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Album, Artist, Track } from "@/lib/music.functions";

/**
 * Biblioteca do usuário: favoritos, artistas seguidos, álbuns salvos,
 * histórico de reprodução e playlists pessoais.
 */

const TRACK_COLUMNS =
  "id, title, slug, cover_url, audio_url, youtube_id, genre, kind, duration_seconds, description, credits, lyrics, play_count, track_number, released_on, created_at, artist_id, album_id, music_artists(name, slug), music_albums(title, slug, cover_url)";

function slugify(value: string) {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "playlist"
  );
}

/** Tudo o que a página da biblioteca precisa, em uma chamada. */
export const getMyLibrary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [profile, favorites, artists, albums, playlists, history] = await Promise.all([
      supabase.from("profiles").select("id, display_name, avatar_url").eq("id", userId).maybeSingle(),
      supabase
        .from("user_favorite_tracks")
        .select(`created_at, music_tracks(${TRACK_COLUMNS})`)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("user_followed_artists")
        .select("created_at, music_artists(id, name, slug, photo_url, bio)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("user_saved_albums")
        .select("created_at, music_albums(id, title, slug, cover_url, year, description, artist_id, music_artists(name, slug))")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("playlists")
        .select("id, title, slug, description, cover_url, owner_id, is_public, is_collaborative, featured")
        .eq("owner_id", userId)
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("play_history")
        .select(`played_at, music_tracks(${TRACK_COLUMNS})`)
        .eq("user_id", userId)
        .order("played_at", { ascending: false })
        .limit(60),
    ]);

    const pick = <T,>(rows: unknown[] | null, key: string): T[] =>
      (rows ?? [])
        .map((r) => (r as Record<string, unknown>)[key] as T | null)
        .filter((v): v is T => Boolean(v));

    return {
      profile: profile.data,
      favorites: pick<Track>(favorites.data, "music_tracks"),
      artists: pick<Artist>(artists.data, "music_artists"),
      albums: pick<Album>(albums.data, "music_albums"),
      playlists: playlists.data ?? [],
      history: pick<Track>(history.data, "music_tracks"),
    };
  });

/** IDs curtidos/seguidos/salvos — usado para marcar os botões de coração. */
export const getMyMarks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [tracks, artists, albums] = await Promise.all([
      supabase.from("user_favorite_tracks").select("track_id").eq("user_id", userId),
      supabase.from("user_followed_artists").select("artist_id").eq("user_id", userId),
      supabase.from("user_saved_albums").select("album_id").eq("user_id", userId),
    ]);
    return {
      tracks: (tracks.data ?? []).map((r) => r.track_id),
      artists: (artists.data ?? []).map((r) => r.artist_id),
      albums: (albums.data ?? []).map((r) => r.album_id),
    };
  });

/** Alterna favorito de faixa, seguir artista ou salvar álbum. */
export const toggleSave = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { kind: "track" | "artist" | "album"; id: string; on: boolean }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    if (data.kind === "track") {
      if (data.on) await supabase.from("user_favorite_tracks").upsert({ user_id: userId, track_id: data.id });
      else await supabase.from("user_favorite_tracks").delete().eq("user_id", userId).eq("track_id", data.id);
    } else if (data.kind === "artist") {
      if (data.on) await supabase.from("user_followed_artists").upsert({ user_id: userId, artist_id: data.id });
      else await supabase.from("user_followed_artists").delete().eq("user_id", userId).eq("artist_id", data.id);
    } else {
      if (data.on) await supabase.from("user_saved_albums").upsert({ user_id: userId, album_id: data.id });
      else await supabase.from("user_saved_albums").delete().eq("user_id", userId).eq("album_id", data.id);
    }
    return { ok: true as const, on: data.on };
  });

/** Registra a faixa no histórico do usuário. */
export const logPlay = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { trackId: string; seconds?: number }) => data)
  .handler(async ({ data, context }) => {
    await context.supabase.from("play_history").insert({
      user_id: context.userId,
      track_id: data.trackId,
      seconds_played: Math.max(0, Math.round(data.seconds ?? 0)),
    });
    return { ok: true as const };
  });

/** Cria uma playlist pessoal. */
export const createPlaylist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { title: string; description?: string; isPublic?: boolean }) => data)
  .handler(async ({ data, context }) => {
    const title = data.title.trim().slice(0, 80);
    if (!title) throw new Error("Dê um nome para a playlist");
    const slug = `${slugify(title)}-${Math.random().toString(36).slice(2, 7)}`;
    const { data: row, error } = await context.supabase
      .from("playlists")
      .insert({
        title,
        slug,
        description: data.description ?? "",
        owner_id: context.userId,
        is_public: data.isPublic ?? false,
      })
      .select("id, slug, title")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

/** Remove uma playlist do usuário. */
export const deletePlaylist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("playlists")
      .delete()
      .eq("id", data.id)
      .eq("owner_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/** Adiciona ou remove uma faixa de uma playlist. */
export const setPlaylistTrack = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { playlistId: string; trackId: string; on: boolean }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    if (!data.on) {
      const { error } = await supabase
        .from("playlist_tracks")
        .delete()
        .eq("playlist_id", data.playlistId)
        .eq("track_id", data.trackId);
      if (error) throw new Error(error.message);
      return { ok: true as const };
    }
    const { count } = await supabase
      .from("playlist_tracks")
      .select("id", { count: "exact", head: true })
      .eq("playlist_id", data.playlistId);
    const { error } = await supabase.from("playlist_tracks").insert({
      playlist_id: data.playlistId,
      track_id: data.trackId,
      position: (count ?? 0) + 1,
      added_by: userId,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/** Playlists do usuário (para o menu "adicionar à playlist"). */
export const myPlaylists = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("playlists")
      .select("id, title, slug, is_public")
      .eq("owner_id", context.userId)
      .order("created_at", { ascending: false });
    return data ?? [];
  });

/** Recomendações simples com base no histórico e nos favoritos. */
export const getRecommendations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: history } = await supabase
      .from("play_history")
      .select("music_tracks(artist_id, genre)")
      .eq("user_id", userId)
      .order("played_at", { ascending: false })
      .limit(40);
    const artistIds = Array.from(
      new Set(
        (history ?? [])
          .map((r) => (r as unknown as { music_tracks: { artist_id: string | null } | null }).music_tracks?.artist_id)
          .filter((v): v is string => Boolean(v)),
      ),
    ).slice(0, 5);

    let query = supabase.from("music_tracks").select(TRACK_COLUMNS).eq("published", true);
    if (artistIds.length) query = query.in("artist_id", artistIds);
    const { data } = await query.order("play_count", { ascending: false }).limit(12);
    return data ?? [];
  });
