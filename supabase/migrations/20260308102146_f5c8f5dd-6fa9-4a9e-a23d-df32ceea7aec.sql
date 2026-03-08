
-- Destinations table for admin management
CREATE TABLE public.destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url text,
  category text NOT NULL DEFAULT 'safari',
  location text NOT NULL DEFAULT '',
  price_from numeric NOT NULL DEFAULT 0,
  activities text[] NOT NULL DEFAULT '{}',
  travel_tips text[] NOT NULL DEFAULT '{}',
  best_time text NOT NULL DEFAULT '',
  lat numeric NOT NULL DEFAULT 0,
  lng numeric NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active destinations" ON public.destinations
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage destinations" ON public.destinations
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active content" ON public.site_content
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage content" ON public.site_content
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_destinations_updated_at
  BEFORE UPDATE ON public.destinations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
