-- Migration 007: Admin Role & Dashboard
-- Adds admin role to profiles, a security-definer helper, and RLS for admin access

-- 1. Security-definer helper: bypasses RLS to check admin status safely
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- 2. Widen the profiles role check to include 'admin'
--    The original constraint was created inline; find its name dynamically.
DO $$
DECLARE
  _constraint text;
BEGIN
  SELECT tc.constraint_name INTO _constraint
  FROM information_schema.table_constraints tc
  JOIN information_schema.check_constraints cc
    ON tc.constraint_name = cc.constraint_name
    AND tc.constraint_schema = cc.constraint_schema
  WHERE tc.table_name = 'profiles'
    AND tc.table_schema = 'public'
    AND tc.constraint_type = 'CHECK'
    AND cc.check_clause LIKE '%role%';

  IF _constraint IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.profiles DROP CONSTRAINT %I', _constraint);
  END IF;
END $$;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('student', 'tutor', 'coach', 'admin'));

-- 3. Admin can SELECT all profiles (existing own-row policy still applies)
CREATE POLICY "admin_select_all_profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

-- 4. Admin can SELECT all tutor requests (existing own-row policy still applies)
CREATE POLICY "admin_select_all_requests"
  ON tutor_requests FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

-- 5. Admin can UPDATE tutor request status (accept / decline)
CREATE POLICY "admin_update_requests"
  ON tutor_requests FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));
