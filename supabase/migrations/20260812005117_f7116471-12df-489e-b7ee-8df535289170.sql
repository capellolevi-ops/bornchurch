-- ===== submissions =====
CREATE TABLE public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_key text NOT NULL,
  form_label text NOT NULL DEFAULT '',
  name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  needs_review boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'pending',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.submissions TO anon, authenticated;
GRANT ALL ON public.submissions TO service_role;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit forms" ON public.submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE TRIGGER submissions_updated_at BEFORE UPDATE ON public.submissions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===== prayer_requests =====
CREATE TABLE public.prayer_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  message text NOT NULL,
  visibility text NOT NULL DEFAULT 'private',
  status text NOT NULL DEFAULT 'pending',
  admin_reply text NOT NULL DEFAULT '',
  prayer_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.prayer_requests TO anon, authenticated;
GRANT SELECT ON public.prayer_requests TO anon, authenticated;
GRANT ALL ON public.prayer_requests TO service_role;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send prayer requests" ON public.prayer_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public approved prayers are readable" ON public.prayer_requests FOR SELECT TO anon, authenticated USING (visibility = 'public' AND status = 'approved');
CREATE TRIGGER prayer_requests_updated_at BEFORE UPDATE ON public.prayer_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.increment_prayer_count(_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE new_count integer;
BEGIN
  UPDATE public.prayer_requests
     SET prayer_count = prayer_count + 1
   WHERE id = _id AND visibility = 'public' AND status = 'approved'
   RETURNING prayer_count INTO new_count;
  RETURN COALESCE(new_count, 0);
END;
$$;
GRANT EXECUTE ON FUNCTION public.increment_prayer_count(uuid) TO anon, authenticated, service_role;

-- ===== site_content =====
CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site content is public" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE TRIGGER site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_content (key, value) VALUES
  ('hero', '{"highlight":"O novo começa agora","title":"Bem-vindo à Born Church","subtitle":"Um lugar para nascer de novo, crescer na fé e viver o propósito de Deus.","primaryLabel":"Conheça a Igreja","primaryLink":"/sobre","secondaryLabel":"Planeje sua Visita","secondaryLink":"/novo-aqui"}'::jsonb),
  ('maintenance', '{"enabled":false,"title":"Estamos em manutenção","message":"Nosso site está passando por uma atualização. Voltamos em breve!"}'::jsonb);

-- ===== gallery_photos =====
CREATE TABLE public.gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_photos TO anon, authenticated;
GRANT ALL ON public.gallery_photos TO service_role;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published photos are public" ON public.gallery_photos FOR SELECT TO anon, authenticated USING (published = true);
CREATE TRIGGER gallery_photos_updated_at BEFORE UPDATE ON public.gallery_photos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===== banners =====
CREATE TABLE public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  image_url text,
  button_label text NOT NULL DEFAULT '',
  link text NOT NULL DEFAULT '',
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.banners TO anon, authenticated;
GRANT ALL ON public.banners TO service_role;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active banners are public" ON public.banners FOR SELECT TO anon, authenticated USING (active = true);
CREATE TRIGGER banners_updated_at BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===== admin_users =====
CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'editor',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.admin_users TO service_role;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===== admin_notifications =====
CREATE TABLE public.admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.admin_notifications TO service_role;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.notify_new_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_notifications (kind, title, body)
  VALUES ('submission', 'Novo envio: ' || COALESCE(NEW.form_label, NEW.form_key), COALESCE(NEW.name, ''));
  RETURN NEW;
END;
$$;
CREATE TRIGGER submissions_notify AFTER INSERT ON public.submissions FOR EACH ROW EXECUTE FUNCTION public.notify_new_submission();

CREATE OR REPLACE FUNCTION public.notify_new_prayer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_notifications (kind, title, body)
  VALUES ('prayer', CASE WHEN NEW.visibility = 'public' THEN 'Novo pedido de oração público (aguardando aprovação)' ELSE 'Novo pedido de oração privado' END, COALESCE(NEW.name, ''));
  RETURN NEW;
END;
$$;
CREATE TRIGGER prayer_requests_notify AFTER INSERT ON public.prayer_requests FOR EACH ROW EXECUTE FUNCTION public.notify_new_prayer();

-- ===== events: link + active =====
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS link text NOT NULL DEFAULT '';