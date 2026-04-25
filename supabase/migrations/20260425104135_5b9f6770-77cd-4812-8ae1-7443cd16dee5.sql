
CREATE TABLE public.accommodations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  partner_hotel TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  image_url TEXT,
  price_per_night NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  amenities TEXT[] NOT NULL DEFAULT '{}',
  room_types TEXT[] NOT NULL DEFAULT '{}',
  rating NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'hotel',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active accommodations"
ON public.accommodations FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage accommodations"
ON public.accommodations FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_accommodations_updated_at
BEFORE UPDATE ON public.accommodations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_accommodations_destination ON public.accommodations(destination_id);
CREATE INDEX idx_accommodations_active ON public.accommodations(is_active);
