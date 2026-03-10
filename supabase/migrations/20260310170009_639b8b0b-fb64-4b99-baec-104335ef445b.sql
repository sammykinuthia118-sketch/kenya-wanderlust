
-- Fix destinations RLS: drop restrictive policies, recreate as permissive
DROP POLICY IF EXISTS "Admins can manage destinations" ON public.destinations;
DROP POLICY IF EXISTS "Anyone can view active destinations" ON public.destinations;

CREATE POLICY "Admins can manage destinations"
ON public.destinations FOR ALL TO public
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active destinations"
ON public.destinations FOR SELECT TO public
USING (is_active = true);

-- Fix site_content RLS
DROP POLICY IF EXISTS "Admins can manage content" ON public.site_content;
DROP POLICY IF EXISTS "Anyone can view active content" ON public.site_content;

CREATE POLICY "Admins can manage content"
ON public.site_content FOR ALL TO public
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active content"
ON public.site_content FOR SELECT TO public
USING (is_active = true);

-- Fix bookings RLS
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;

CREATE POLICY "Admins can update bookings"
ON public.bookings FOR UPDATE TO public
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all bookings"
ON public.bookings FOR SELECT TO public
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create bookings"
ON public.bookings FOR INSERT TO public
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own bookings"
ON public.bookings FOR SELECT TO public
USING (auth.uid() = user_id);

-- Fix reviews RLS
DROP POLICY IF EXISTS "Admins can delete reviews" ON public.reviews;
DROP POLICY IF EXISTS "Reviews viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;

CREATE POLICY "Admins can delete reviews"
ON public.reviews FOR DELETE TO public
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Reviews viewable by everyone"
ON public.reviews FOR SELECT TO public
USING (true);

CREATE POLICY "Users can create reviews"
ON public.reviews FOR INSERT TO public
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
ON public.reviews FOR DELETE TO public
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
ON public.reviews FOR UPDATE TO public
USING (auth.uid() = user_id);

-- Fix profiles RLS
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Profiles viewable by everyone"
ON public.profiles FOR SELECT TO public
USING (true);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT TO public
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO public
USING (auth.uid() = user_id);

-- Fix user_roles RLS
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL TO public
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT TO public
USING (auth.uid() = user_id);

-- Fix trip_plans RLS
DROP POLICY IF EXISTS "Users can create trips" ON public.trip_plans;
DROP POLICY IF EXISTS "Users can delete own trips" ON public.trip_plans;
DROP POLICY IF EXISTS "Users can update own trips" ON public.trip_plans;
DROP POLICY IF EXISTS "Users can view own trips" ON public.trip_plans;

CREATE POLICY "Users can create trips"
ON public.trip_plans FOR INSERT TO public
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips"
ON public.trip_plans FOR DELETE TO public
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own trips"
ON public.trip_plans FOR UPDATE TO public
USING (auth.uid() = user_id);

CREATE POLICY "Users can view own trips"
ON public.trip_plans FOR SELECT TO public
USING (auth.uid() = user_id);

-- Fix trip_days RLS
DROP POLICY IF EXISTS "Users can create trip days" ON public.trip_days;
DROP POLICY IF EXISTS "Users can delete own trip days" ON public.trip_days;
DROP POLICY IF EXISTS "Users can update own trip days" ON public.trip_days;
DROP POLICY IF EXISTS "Users can view own trip days" ON public.trip_days;

CREATE POLICY "Users can create trip days"
ON public.trip_days FOR INSERT TO public
WITH CHECK (EXISTS (SELECT 1 FROM trip_plans WHERE trip_plans.id = trip_days.trip_plan_id AND trip_plans.user_id = auth.uid()));

CREATE POLICY "Users can delete own trip days"
ON public.trip_days FOR DELETE TO public
USING (EXISTS (SELECT 1 FROM trip_plans WHERE trip_plans.id = trip_days.trip_plan_id AND trip_plans.user_id = auth.uid()));

CREATE POLICY "Users can update own trip days"
ON public.trip_days FOR UPDATE TO public
USING (EXISTS (SELECT 1 FROM trip_plans WHERE trip_plans.id = trip_days.trip_plan_id AND trip_plans.user_id = auth.uid()));

CREATE POLICY "Users can view own trip days"
ON public.trip_days FOR SELECT TO public
USING (EXISTS (SELECT 1 FROM trip_plans WHERE trip_plans.id = trip_days.trip_plan_id AND trip_plans.user_id = auth.uid()));
