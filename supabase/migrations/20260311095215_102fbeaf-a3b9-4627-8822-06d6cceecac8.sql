
-- Fix destinations policies
DROP POLICY IF EXISTS "Anyone can view active destinations" ON public.destinations;
DROP POLICY IF EXISTS "Admins can manage destinations" ON public.destinations;

CREATE POLICY "Anyone can view active destinations" ON public.destinations
AS PERMISSIVE FOR SELECT TO public
USING (is_active = true);

CREATE POLICY "Admins can manage destinations" ON public.destinations
AS PERMISSIVE FOR ALL TO public
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Fix site_content policies
DROP POLICY IF EXISTS "Anyone can view active content" ON public.site_content;
DROP POLICY IF EXISTS "Admins can manage content" ON public.site_content;

CREATE POLICY "Anyone can view active content" ON public.site_content
AS PERMISSIVE FOR SELECT TO public
USING (is_active = true);

CREATE POLICY "Admins can manage content" ON public.site_content
AS PERMISSIVE FOR ALL TO public
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Fix bookings policies
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;

CREATE POLICY "Users can view own bookings" ON public.bookings
AS PERMISSIVE FOR SELECT TO public
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings" ON public.bookings
AS PERMISSIVE FOR SELECT TO public
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create bookings" ON public.bookings
AS PERMISSIVE FOR INSERT TO public
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update bookings" ON public.bookings
AS PERMISSIVE FOR UPDATE TO public
USING (public.has_role(auth.uid(), 'admin'));

-- Fix reviews policies
DROP POLICY IF EXISTS "Reviews viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON public.reviews;

CREATE POLICY "Reviews viewable by everyone" ON public.reviews
AS PERMISSIVE FOR SELECT TO public
USING (true);

CREATE POLICY "Users can create reviews" ON public.reviews
AS PERMISSIVE FOR INSERT TO public
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON public.reviews
AS PERMISSIVE FOR UPDATE TO public
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON public.reviews
AS PERMISSIVE FOR DELETE TO public
USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete reviews" ON public.reviews
AS PERMISSIVE FOR DELETE TO public
USING (public.has_role(auth.uid(), 'admin'));

-- Fix profiles policies
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles
AS PERMISSIVE FOR SELECT TO public
USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
AS PERMISSIVE FOR UPDATE TO public
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
AS PERMISSIVE FOR INSERT TO public
WITH CHECK (auth.uid() = user_id);

-- Fix user_roles policies
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Users can view own roles" ON public.user_roles
AS PERMISSIVE FOR SELECT TO public
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
AS PERMISSIVE FOR ALL TO public
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Fix trip_plans policies
DROP POLICY IF EXISTS "Users can view own trips" ON public.trip_plans;
DROP POLICY IF EXISTS "Users can create trips" ON public.trip_plans;
DROP POLICY IF EXISTS "Users can update own trips" ON public.trip_plans;
DROP POLICY IF EXISTS "Users can delete own trips" ON public.trip_plans;

CREATE POLICY "Users can view own trips" ON public.trip_plans
AS PERMISSIVE FOR SELECT TO public
USING (auth.uid() = user_id);

CREATE POLICY "Users can create trips" ON public.trip_plans
AS PERMISSIVE FOR INSERT TO public
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips" ON public.trip_plans
AS PERMISSIVE FOR UPDATE TO public
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips" ON public.trip_plans
AS PERMISSIVE FOR DELETE TO public
USING (auth.uid() = user_id);

-- Fix trip_days policies
DROP POLICY IF EXISTS "Users can view own trip days" ON public.trip_days;
DROP POLICY IF EXISTS "Users can create trip days" ON public.trip_days;
DROP POLICY IF EXISTS "Users can update own trip days" ON public.trip_days;
DROP POLICY IF EXISTS "Users can delete own trip days" ON public.trip_days;

CREATE POLICY "Users can view own trip days" ON public.trip_days
AS PERMISSIVE FOR SELECT TO public
USING (EXISTS (SELECT 1 FROM trip_plans WHERE trip_plans.id = trip_days.trip_plan_id AND trip_plans.user_id = auth.uid()));

CREATE POLICY "Users can create trip days" ON public.trip_days
AS PERMISSIVE FOR INSERT TO public
WITH CHECK (EXISTS (SELECT 1 FROM trip_plans WHERE trip_plans.id = trip_days.trip_plan_id AND trip_plans.user_id = auth.uid()));

CREATE POLICY "Users can update own trip days" ON public.trip_days
AS PERMISSIVE FOR UPDATE TO public
USING (EXISTS (SELECT 1 FROM trip_plans WHERE trip_plans.id = trip_days.trip_plan_id AND trip_plans.user_id = auth.uid()));

CREATE POLICY "Users can delete own trip days" ON public.trip_days
AS PERMISSIVE FOR DELETE TO public
USING (EXISTS (SELECT 1 FROM trip_plans WHERE trip_plans.id = trip_days.trip_plan_id AND trip_plans.user_id = auth.uid()));
