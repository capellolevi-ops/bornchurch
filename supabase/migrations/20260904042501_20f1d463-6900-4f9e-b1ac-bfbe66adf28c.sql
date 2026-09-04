-- ============ PROFILES & ROLES ============
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email,''), '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ CATALOG ============
CREATE TABLE public.music_artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  photo_url text,
  bio text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.music_artists TO anon, authenticated;
GRANT ALL ON public.music_artists TO service_role;
ALTER TABLE public.music_artists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published artists are public" ON public.music_artists FOR SELECT TO anon, authenticated USING (published = true);
CREATE TRIGGER music_artists_updated_at BEFORE UPDATE ON public.music_artists FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.music_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  artist_id uuid REFERENCES public.music_artists(id) ON DELETE SET NULL,
  cover_url text,
  year integer,
  description text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.music_albums TO anon, authenticated;
GRANT ALL ON public.music_albums TO service_role;
ALTER TABLE public.music_albums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published albums are public" ON public.music_albums FOR SELECT TO anon, authenticated USING (published = true);
CREATE TRIGGER music_albums_updated_at BEFORE UPDATE ON public.music_albums FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX music_albums_artist_idx ON public.music_albums(artist_id);

CREATE TABLE public.music_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  artist_id uuid REFERENCES public.music_artists(id) ON DELETE SET NULL,
  album_id uuid REFERENCES public.music_albums(id) ON DELETE SET NULL,
  cover_url text,
  genre text NOT NULL DEFAULT '',
  duration_seconds integer NOT NULL DEFAULT 0,
  audio_url text,
  youtube_id text NOT NULL DEFAULT '',
  lyrics text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  credits text NOT NULL DEFAULT '',
  kind text NOT NULL DEFAULT 'song',
  track_number integer NOT NULL DEFAULT 0,
  released_on date,
  published boolean NOT NULL DEFAULT true,
  play_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.music_tracks TO anon, authenticated;
GRANT ALL ON public.music_tracks TO service_role;
ALTER TABLE public.music_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published tracks are public" ON public.music_tracks FOR SELECT TO anon, authenticated USING (published = true);
CREATE TRIGGER music_tracks_updated_at BEFORE UPDATE ON public.music_tracks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX music_tracks_artist_idx ON public.music_tracks(artist_id);
CREATE INDEX music_tracks_album_idx ON public.music_tracks(album_id);
CREATE INDEX music_tracks_plays_idx ON public.music_tracks(play_count DESC);

CREATE TABLE public.playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  cover_url text,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public boolean NOT NULL DEFAULT true,
  is_collaborative boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.playlists TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.playlists TO authenticated;
GRANT ALL ON public.playlists TO service_role;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public playlists are readable" ON public.playlists FOR SELECT TO anon, authenticated USING (is_public = true);
CREATE POLICY "Owners read own playlists" ON public.playlists FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Users create own playlists" ON public.playlists FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update own playlists" ON public.playlists FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners delete own playlists" ON public.playlists FOR DELETE TO authenticated USING (auth.uid() = owner_id);
CREATE TRIGGER playlists_updated_at BEFORE UPDATE ON public.playlists FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.playlist_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  track_id uuid NOT NULL REFERENCES public.music_tracks(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  added_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (playlist_id, track_id)
);
GRANT SELECT ON public.playlist_tracks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.playlist_tracks TO authenticated;
GRANT ALL ON public.playlist_tracks TO service_role;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Readable when playlist readable" ON public.playlist_tracks FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.playlists p WHERE p.id = playlist_id AND (p.is_public = true OR p.owner_id = auth.uid())));
CREATE POLICY "Add to own or collaborative playlists" ON public.playlist_tracks FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.playlists p WHERE p.id = playlist_id AND (p.owner_id = auth.uid() OR p.is_collaborative = true)));
CREATE POLICY "Update own or collaborative playlist tracks" ON public.playlist_tracks FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.playlists p WHERE p.id = playlist_id AND (p.owner_id = auth.uid() OR p.is_collaborative = true)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.playlists p WHERE p.id = playlist_id AND (p.owner_id = auth.uid() OR p.is_collaborative = true)));
CREATE POLICY "Delete from own playlist or own additions" ON public.playlist_tracks FOR DELETE TO authenticated
  USING (added_by = auth.uid() OR EXISTS (SELECT 1 FROM public.playlists p WHERE p.id = playlist_id AND p.owner_id = auth.uid()));
CREATE INDEX playlist_tracks_playlist_idx ON public.playlist_tracks(playlist_id, position);

-- ============ USER LIBRARY ============
CREATE TABLE public.user_favorite_tracks (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id uuid NOT NULL REFERENCES public.music_tracks(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, track_id)
);
GRANT SELECT, INSERT, DELETE ON public.user_favorite_tracks TO authenticated;
GRANT ALL ON public.user_favorite_tracks TO service_role;
ALTER TABLE public.user_favorite_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own favorites" ON public.user_favorite_tracks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.user_followed_artists (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  artist_id uuid NOT NULL REFERENCES public.music_artists(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, artist_id)
);
GRANT SELECT, INSERT, DELETE ON public.user_followed_artists TO authenticated;
GRANT ALL ON public.user_followed_artists TO service_role;
ALTER TABLE public.user_followed_artists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own follows" ON public.user_followed_artists FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.user_saved_albums (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  album_id uuid NOT NULL REFERENCES public.music_albums(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, album_id)
);
GRANT SELECT, INSERT, DELETE ON public.user_saved_albums TO authenticated;
GRANT ALL ON public.user_saved_albums TO service_role;
ALTER TABLE public.user_saved_albums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own saved albums" ON public.user_saved_albums FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.play_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id uuid NOT NULL REFERENCES public.music_tracks(id) ON DELETE CASCADE,
  played_at timestamptz NOT NULL DEFAULT now(),
  seconds_played integer NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, DELETE ON public.play_history TO authenticated;
GRANT ALL ON public.play_history TO service_role;
ALTER TABLE public.play_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own history" ON public.play_history FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX play_history_user_idx ON public.play_history(user_id, played_at DESC);

CREATE OR REPLACE FUNCTION public.increment_track_play(_id uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c integer;
BEGIN
  UPDATE public.music_tracks SET play_count = play_count + 1
   WHERE id = _id AND published = true
   RETURNING play_count INTO c;
  RETURN COALESCE(c, 0);
END;
$$;
GRANT EXECUTE ON FUNCTION public.increment_track_play(uuid) TO anon, authenticated;