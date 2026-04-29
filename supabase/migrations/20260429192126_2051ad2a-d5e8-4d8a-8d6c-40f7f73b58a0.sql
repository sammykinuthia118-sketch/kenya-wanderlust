
CREATE TABLE public.accommodation_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  accommodation_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  num_guests INTEGER NOT NULL DEFAULT 1,
  num_rooms INTEGER NOT NULL DEFAULT 1,
  room_type TEXT,
  total_price NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.accommodation_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create accommodation bookings"
  ON public.accommodation_bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own accommodation bookings"
  ON public.accommodation_bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all accommodation bookings"
  ON public.accommodation_bookings FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update accommodation bookings"
  ON public.accommodation_bookings FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_accommodation_bookings_updated_at
  BEFORE UPDATE ON public.accommodation_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_accom_bookings_user ON public.accommodation_bookings(user_id);
CREATE INDEX idx_accom_bookings_accom ON public.accommodation_bookings(accommodation_id);
