-- ====================================================================
-- SodoBiz Bridge Database Migration: 20261104000000_sodobiz_bridge_v2_core.sql
-- Description: Core Youth Opportunity, Notifications, Training, Documents & RLS Migration
-- Target Platform: Supabase / PostgreSQL 15+
-- ====================================================================

-- 1. UPDATE USER ROLE ENUM TO INCLUDE YOUTH, EMPLOYER, MENTOR
DO $$ BEGIN
    ALTER TYPE user_role_enum ADD VALUE IF NOT EXISTS 'youth';
    ALTER TYPE user_role_enum ADD VALUE IF NOT EXISTS 'employer';
    ALTER TYPE user_role_enum ADD VALUE IF NOT EXISTS 'mentor';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. EXTEND PROFILES WITH YOUTH & INCLUSION COLUMNS
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS education_level TEXT,
ADD COLUMN IF NOT EXISTS field_of_study TEXT,
ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS career_goals TEXT,
ADD COLUMN IF NOT EXISTS career_interests JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS has_disability BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS disability_support_notes TEXT,
ADD COLUMN IF NOT EXISTS tvet_status TEXT DEFAULT 'not_enrolled',
ADD COLUMN IF NOT EXISTS kebele TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS cv_filename TEXT,
ADD COLUMN IF NOT EXISTS cv_uploaded_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS organization_id TEXT;

-- 3. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('application', 'mentorship', 'referral', 'commitment', 'opportunity', 'system')),
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read);

-- 4. USER DOCUMENTS TABLE (CVs, Certificates, IDs)
CREATE TABLE IF NOT EXISTS public.user_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('cv', 'certificate', 'id_card', 'business_license', 'other')),
    file_name TEXT NOT NULL,
    file_size TEXT,
    url TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_documents_user ON public.user_documents(user_id);

-- 5. TRAINING COURSES & ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS public.training_courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('ict', 'agro_processing', 'mechanics', 'hospitality', 'construction', 'business_finance')),
    duration TEXT NOT NULL,
    level TEXT NOT NULL,
    seats_available INTEGER DEFAULT 15 NOT NULL,
    description TEXT NOT NULL,
    skills_taught JSONB DEFAULT '[]'::jsonb NOT NULL,
    eligibility TEXT NOT NULL,
    location TEXT NOT NULL,
    is_free BOOLEAN DEFAULT TRUE NOT NULL,
    stipend_provided BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.training_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id TEXT NOT NULL REFERENCES public.training_courses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    enrolled_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ,
    CONSTRAINT unique_user_course_enrollment UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_training_enrollments_user ON public.training_enrollments(user_id);

-- 6. FINANCE PRODUCT INQUIRIES & REFERRALS TABLE
CREATE TABLE IF NOT EXISTS public.finance_product_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.finance_products(id) ON DELETE CASCADE,
    business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
    applicant_name TEXT NOT NULL,
    applicant_phone TEXT NOT NULL,
    amount_requested NUMERIC(14, 2) NOT NULL CHECK (amount_requested > 0),
    purpose TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'appointment_booked', 'under_review', 'referred', 'closed')),
    officer_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_finance_inquiries_user ON public.finance_product_inquiries(user_id);

-- 7. BUSINESS NEEDS ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS public.business_needs_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    capital_need_priority TEXT DEFAULT 'moderate' CHECK (capital_need_priority IN ('urgent', 'moderate', 'low')),
    licensing_need BOOLEAN DEFAULT FALSE NOT NULL,
    bookkeeping_need BOOLEAN DEFAULT FALSE NOT NULL,
    equipment_needed TEXT,
    market_access_need BOOLEAN DEFAULT FALSE NOT NULL,
    mentorship_requested BOOLEAN DEFAULT FALSE NOT NULL,
    training_interests JSONB DEFAULT '[]'::jsonb NOT NULL,
    assessed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_business_assessment UNIQUE (business_id)
);

-- 8. EXTEND OPPORTUNITY APPLICATIONS WITH DOCUMENTS & WITHDRAWAL
ALTER TABLE public.opportunity_applications
ADD COLUMN IF NOT EXISTS cv_filename TEXT,
ADD COLUMN IF NOT EXISTS cv_url TEXT,
ADD COLUMN IF NOT EXISTS supporting_documents JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS applied_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS withdrawn_at TIMESTAMPTZ;

-- 9. ROW-LEVEL SECURITY POLICIES
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_product_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_needs_assessments ENABLE ROW LEVEL SECURITY;

-- Notifications: Users only read/update their own notifications
CREATE POLICY "Users access own notifications" ON public.notifications
FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- Documents: Users only read/modify their own documents
CREATE POLICY "Users access own documents" ON public.user_documents
FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- Training Courses: Public read access for active catalog
CREATE POLICY "Public read training courses" ON public.training_courses
FOR SELECT USING (true);

-- Training Enrollments: User read/write own enrollments
CREATE POLICY "Users manage own training enrollments" ON public.training_enrollments
FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- Finance Inquiries: User and financial provider access
CREATE POLICY "Users access own finance inquiries" ON public.finance_product_inquiries
FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users create own finance inquiries" ON public.finance_product_inquiries
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Business Needs Assessment: Owner and assigned agent/admin
CREATE POLICY "Owners access business needs assessment" ON public.business_needs_assessments
FOR ALL USING (auth.uid() = user_id OR public.is_admin());
