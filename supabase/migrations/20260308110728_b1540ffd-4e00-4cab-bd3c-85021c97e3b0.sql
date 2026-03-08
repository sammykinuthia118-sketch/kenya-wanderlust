
-- Fix: make public SELECT policies PERMISSIVE instead of RESTRICTIVE

-- destinations
DROP POLICY IF EXISTS "Anyone can view active destinations" ON public.destinations;
CREATE POLICY "Anyone can view active destinations"
  ON public.destinations FOR SELECT
  USING (is_active = true);

-- site_content
DROP POLICY IF EXISTS "Anyone can view active content" ON public.site_content;
CREATE POLICY "Anyone can view active content"
  ON public.site_content FOR SELECT
  USING (is_active = true);

-- reviews
DROP POLICY IF EXISTS "Reviews viewable by everyone" ON public.reviews;
CREATE POLICY "Reviews viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

-- profiles
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);
