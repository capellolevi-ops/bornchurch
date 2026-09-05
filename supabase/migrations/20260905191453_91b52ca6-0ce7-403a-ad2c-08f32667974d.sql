INSERT INTO public.music_artists (name, slug, bio, published) VALUES
('Born Worship', 'born-worship', 'Ministério de louvor da Born Church, em Pinhais.', true),
('Hillsong United', 'hillsong-united', 'Ministério de louvor australiano conhecido mundialmente.', true),
('Bethel Music', 'bethel-music', 'Coletivo de adoração de Redding, Califórnia.', true),
('Sinach', 'sinach', 'Cantora e compositora nigeriana de música cristã.', true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.music_albums (title, slug, artist_id, year, description, published)
SELECT 'Nascer de Novo', 'nascer-de-novo', a.id, 2026, 'Coletânea de adoração da Born Church.', true
FROM public.music_artists a WHERE a.slug = 'born-worship'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.music_tracks (title, slug, artist_id, album_id, youtube_id, genre, kind, duration_seconds, description, track_number, published)
SELECT v.title, v.slug, a.id, al.id, v.yt, 'Adoração', 'song', v.dur, v.descr, v.n, true
FROM (VALUES
  ('Oceans (Where Feet May Fail)', 'oceans-where-feet-may-fail', 'hillsong-united', 'dy9nwe9_xzw', 508, 'Um clássico de entrega e confiança.', 1),
  ('What A Beautiful Name', 'what-a-beautiful-name', 'hillsong-united', 'nQWFzMvCfLE', 350, 'Exaltando a beleza do nome de Jesus.', 2),
  ('Goodness of God', 'goodness-of-god', 'bethel-music', 'n0FBb6hnwTo', 330, 'Toda a minha vida testemunho da bondade de Deus.', 3),
  ('Reckless Love', 'reckless-love', 'bethel-music', 'Sc6SSHuZvQE', 340, 'O amor incansável de Deus por nós.', 4),
  ('Way Maker', 'way-maker', 'sinach', 'n4Uzu6mtVwc', 420, 'Ele abre caminhos onde não há caminho.', 5)
) AS v(title, slug, artist_slug, yt, dur, descr, n)
JOIN public.music_artists a ON a.slug = v.artist_slug
LEFT JOIN public.music_albums al ON al.slug = 'nascer-de-novo' AND false
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.playlists (title, slug, description, is_public, featured)
VALUES ('Adoração para começar o dia', 'adoracao-para-comecar-o-dia', 'Seleção da Born Church para o seu devocional.', true, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.playlist_tracks (playlist_id, track_id, position)
SELECT p.id, t.id, t.track_number
FROM public.playlists p
JOIN public.music_tracks t ON t.published = true
WHERE p.slug = 'adoracao-para-comecar-o-dia'
ON CONFLICT DO NOTHING;