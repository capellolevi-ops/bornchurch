CREATE TABLE public.service_times (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day text NOT NULL,
  title text NOT NULL,
  times text[] NOT NULL DEFAULT '{}',
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  starts_at timestamptz NOT NULL,
  location text NOT NULL DEFAULT '',
  image_url text,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  starts_at timestamptz,
  ends_at timestamptz,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.sermons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  preacher text NOT NULL DEFAULT '',
  youtube_id text NOT NULL,
  description text NOT NULL DEFAULT '',
  preached_on date,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.service_times TO anon;
GRANT SELECT ON public.service_times TO authenticated;
GRANT ALL ON public.service_times TO service_role;
GRANT SELECT ON public.events TO anon;
GRANT SELECT ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
GRANT SELECT ON public.announcements TO anon;
GRANT SELECT ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
GRANT SELECT ON public.sermons TO anon;
GRANT SELECT ON public.sermons TO authenticated;
GRANT ALL ON public.sermons TO service_role;

ALTER TABLE public.service_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published service times" ON public.service_times FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Public can read published events" ON public.events FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Public can read published announcements" ON public.announcements FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Public can read published sermons" ON public.sermons FOR SELECT TO anon, authenticated USING (published = true);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER service_times_updated_at BEFORE UPDATE ON public.service_times FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER sermons_updated_at BEFORE UPDATE ON public.sermons FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.service_times (day, title, times, description, sort_order) VALUES
('Domingo', 'Culto de Celebração', ARRAY['10h00','18h30 às 21h00'], 'Nosso principal encontro da semana: louvor, palavra e comunhão para toda a família.', 1),
('Quarta-feira', 'Quarta Profética', ARRAY['20h00'], 'Uma noite de oração, palavra profética e fé para receber direção de Deus e renovar as forças.', 2),
('Quinta-feira', 'Set Prayer', ARRAY['22h00'], 'Um set de oração: intercessão, adoração e busca pela presença de Deus.', 3),
('Sexta-feira', 'Torre de Oração', ARRAY['20h00'], 'Nossa torre de intercessão pela igreja, pelas famílias e pela cidade de Pinhais.', 4),
('Sábado', 'Purpose', ARRAY['19h30'], 'Encontro de jovens: louvor, palavra e amizade para viver o propósito de Deus.', 5),
('Eventos Especiais', 'Conferências e Encontros', ARRAY['Datas no Instagram'], 'Conferências, batismos, encontros de jovens, mulheres e homens ao longo do ano.', 6);