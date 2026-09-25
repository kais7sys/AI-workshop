-- =============================================================================
-- Migration: 20260925000001_row_level_security.sql
-- Description: Row Level Security (RLS) & Isolation Policies
-- =============================================================================

-- Helper functions to check user roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
    SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT (public.get_user_role(auth.uid()) = 'ADMIN');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_officer()
RETURNS BOOLEAN AS $$
    SELECT (public.get_user_role(auth.uid()) = 'OFFICER' OR public.get_user_role(auth.uid()) = 'ADMIN');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- -----------------------------------------------------------------------------
-- Enable RLS on all sensitive tables
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 1. Profiles Policies
-- -----------------------------------------------------------------------------
-- Users can view their own profile; Officers/Admins can view any profile
CREATE POLICY "Profiles view policy"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.is_officer());

-- Users can update only their own profile
CREATE POLICY "Profiles update policy"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Insert permitted for self upon signup, or by admin
CREATE POLICY "Profiles insert policy"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id OR public.is_admin());

-- -----------------------------------------------------------------------------
-- 2. Farms Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Farms view policy"
ON public.farms FOR SELECT
USING (owner_id = auth.uid() OR public.is_officer());

CREATE POLICY "Farms insert policy"
ON public.farms FOR INSERT
WITH CHECK (owner_id = auth.uid() OR public.is_admin());

CREATE POLICY "Farms update policy"
ON public.farms FOR UPDATE
USING (owner_id = auth.uid() OR public.is_admin())
WITH CHECK (owner_id = auth.uid() OR public.is_admin());

CREATE POLICY "Farms delete policy"
ON public.farms FOR DELETE
USING (owner_id = auth.uid() OR public.is_admin());

-- -----------------------------------------------------------------------------
-- 3. Fields Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Fields view policy"
ON public.fields FOR SELECT
USING (
    EXISTS (SELECT 1 FROM public.farms f WHERE f.id = fields.farm_id AND f.owner_id = auth.uid())
    OR public.is_officer()
);

CREATE POLICY "Fields insert policy"
ON public.fields FOR INSERT
WITH CHECK (
    EXISTS (SELECT 1 FROM public.farms f WHERE f.id = fields.farm_id AND f.owner_id = auth.uid())
    OR public.is_admin()
);

CREATE POLICY "Fields update policy"
ON public.fields FOR UPDATE
USING (
    EXISTS (SELECT 1 FROM public.farms f WHERE f.id = fields.farm_id AND f.owner_id = auth.uid())
    OR public.is_admin()
);

CREATE POLICY "Fields delete policy"
ON public.fields FOR DELETE
USING (
    EXISTS (SELECT 1 FROM public.farms f WHERE f.id = fields.farm_id AND f.owner_id = auth.uid())
    OR public.is_admin()
);

-- -----------------------------------------------------------------------------
-- 4. Crops Catalog Policies (Public Read, Admin Write)
-- -----------------------------------------------------------------------------
CREATE POLICY "Crops public read"
ON public.crops FOR SELECT
USING (true);

CREATE POLICY "Crops admin manage"
ON public.crops FOR ALL
USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 5. Crop Records Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Crop records view policy"
ON public.crop_records FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.fields fl
        JOIN public.farms fm ON fm.id = fl.farm_id
        WHERE fl.id = crop_records.field_id AND fm.owner_id = auth.uid()
    )
    OR public.is_officer()
);

CREATE POLICY "Crop records manage policy"
ON public.crop_records FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.fields fl
        JOIN public.farms fm ON fm.id = fl.farm_id
        WHERE fl.id = crop_records.field_id AND fm.owner_id = auth.uid()
    )
    OR public.is_admin()
);

-- -----------------------------------------------------------------------------
-- 6. Advisories Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Advisories view policy"
ON public.advisories FOR SELECT
USING (farmer_id = auth.uid() OR public.is_officer());

CREATE POLICY "Advisories insert policy"
ON public.advisories FOR INSERT
WITH CHECK (farmer_id = auth.uid() OR public.is_admin());

-- -----------------------------------------------------------------------------
-- 7. Support Cases Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Cases view policy"
ON public.support_cases FOR SELECT
USING (farmer_id = auth.uid() OR assigned_officer_id = auth.uid() OR public.is_officer());

CREATE POLICY "Cases insert policy"
ON public.support_cases FOR INSERT
WITH CHECK (farmer_id = auth.uid() OR public.is_officer());

CREATE POLICY "Cases update policy"
ON public.support_cases FOR UPDATE
USING (farmer_id = auth.uid() OR assigned_officer_id = auth.uid() OR public.is_admin());

-- -----------------------------------------------------------------------------
-- 8. Schemes Policies (Public active schemes read, Admin manage)
-- -----------------------------------------------------------------------------
CREATE POLICY "Schemes read policy"
ON public.schemes FOR SELECT
USING (is_active = true OR public.is_officer());

CREATE POLICY "Schemes manage policy"
ON public.schemes FOR ALL
USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 9. Alerts Policies (Published read, Officer/Admin manage)
-- -----------------------------------------------------------------------------
CREATE POLICY "Alerts read policy"
ON public.alerts FOR SELECT
USING (is_published = true OR public.is_officer());

CREATE POLICY "Alerts manage policy"
ON public.alerts FOR ALL
USING (public.is_officer());

-- -----------------------------------------------------------------------------
-- 10. Notifications Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Notifications self policy"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Notifications update read policy"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 11. Chat Sessions & Messages Policies
-- -----------------------------------------------------------------------------
CREATE POLICY "Chat sessions self policy"
ON public.chat_sessions FOR ALL
USING (user_id = auth.uid());

CREATE POLICY "Chat messages self policy"
ON public.chat_messages FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.chat_sessions cs WHERE cs.id = chat_messages.session_id AND cs.user_id = auth.uid())
);

-- -----------------------------------------------------------------------------
-- 12. Audit Logs Policies (Admin only read, System write)
-- -----------------------------------------------------------------------------
CREATE POLICY "Audit logs admin read policy"
ON public.audit_logs FOR SELECT
USING (public.is_admin());
