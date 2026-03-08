-- Add foreign key from reviews.user_id to profiles.user_id so joins work
ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;