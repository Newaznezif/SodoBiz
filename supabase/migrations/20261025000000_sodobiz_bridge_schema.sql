-- ====================================================================
-- SodoBiz Bridge Database Migration: 20261025000000_sodobiz_bridge_schema.sql
-- Description: Complete Normalized PostgreSQL Schema with Row-Level Security
-- Target Platform: Supabase / PostgreSQL 15+
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAIN CONSTRAINTS
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('entrepreneur', 'agent', 'provider', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type_enum AS ENUM ('income', 'expense');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE readiness_status_enum AS ENUM ('not_started', 'in_progress', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status_enum AS ENUM ('verified', 'pending', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE referral_status_enum AS ENUM (
        'draft',
        'submitted',
        'received',
        'in_review',
        'additional_info_requested',
        'referred_to_official_channel',
        'closed',
        'withdrawn'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    preferred_language VARCHAR(5) DEFAULT 'en' CHECK (preferred_language IN ('en', 'am', 'wo')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. USER ROLES TABLE (Protected from self-elevation)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role_enum NOT NULL DEFAULT 'entrepreneur',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    CONSTRAINT unique_user_role UNIQUE (user_id, role)
);

-- 5. BUSINESS CATEGORIES
CREATE TABLE IF NOT EXISTS public.business_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- 6. BUSINESSES TABLE
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category_id TEXT REFERENCES public.business_categories(id),
    business_type TEXT NOT NULL,
    location TEXT NOT NULL,
    operating_since VARCHAR(10) DEFAULT '2023',
    worker_count INT DEFAULT 1 CHECK (worker_count >= 1),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    transaction_type transaction_type_enum NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(5) DEFAULT 'ETB' NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method TEXT DEFAULT 'cash',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category_id TEXT REFERENCES public.business_categories(id),
    selling_price NUMERIC(12, 2) NOT NULL CHECK (selling_price >= 0),
    cost_price NUMERIC(12, 2) CHECK (cost_price >= 0),
    stock_quantity INT DEFAULT 0 NOT NULL CHECK (stock_quantity >= 0),
    low_stock_threshold INT DEFAULT 5 NOT NULL CHECK (low_stock_threshold >= 0),
    sku TEXT,
    image_path TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. READINESS ITEMS & AUDIT
CREATE TABLE IF NOT EXISTS public.readiness_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    recommended_action TEXT
);

CREATE TABLE IF NOT EXISTS public.business_readiness (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    readiness_item_id TEXT NOT NULL REFERENCES public.readiness_items(id) ON DELETE CASCADE,
    status readiness_status_enum DEFAULT 'not_started' NOT NULL,
    notes TEXT,
    updated_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_business_readiness UNIQUE (business_id, readiness_item_id)
);

-- 10. FINANCIAL LITERACY LESSONS & PROGRESS
CREATE TABLE IF NOT EXISTS public.learning_lessons (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    language VARCHAR(5) DEFAULT 'en' NOT NULL,
    practical_example TEXT,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES public.learning_lessons(id) ON DELETE CASCADE,
    status readiness_status_enum DEFAULT 'not_started' NOT NULL,
    quiz_score INT CHECK (quiz_score >= 0 AND quiz_score <= 100),
    completed_at TIMESTAMPTZ,
    CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_id)
);

-- 11. VERIFIED PROVIDERS & SERVICES
CREATE TABLE IF NOT EXISTS public.providers (
    id TEXT PRIMARY KEY,
    organization_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    organization_type TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    official_phone TEXT NOT NULL,
    official_website TEXT,
    verification_status verification_status_enum DEFAULT 'pending' NOT NULL,
    last_verified_at TIMESTAMPTZ DEFAULT NOW(),
    approved_by UUID REFERENCES public.profiles(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.provider_services (
    id TEXT PRIMARY KEY,
    provider_id TEXT NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    requirements JSONB DEFAULT '[]'::jsonb NOT NULL,
    official_application_url TEXT,
    is_published BOOLEAN DEFAULT TRUE NOT NULL
);

-- 12. REFERRALS (Consent-Based)
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider_id TEXT NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
    service_id TEXT NOT NULL REFERENCES public.provider_services(id) ON DELETE CASCADE,
    status referral_status_enum DEFAULT 'submitted' NOT NULL,
    consent_given_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    consent_scope JSONB DEFAULT '["business_profile"]'::jsonb NOT NULL,
    notes TEXT,
    withdrawn_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 13. AGENT SUPPORT ASSIGNMENTS & SESSIONS
CREATE TABLE IF NOT EXISTS public.support_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.profiles(id),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_business_agent UNIQUE (business_id, agent_id)
);

CREATE TABLE IF NOT EXISTS public.support_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES public.support_assignments(id) ON DELETE CASCADE,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    topic TEXT NOT NULL,
    outcome TEXT NOT NULL,
    entrepreneur_visible_notes TEXT,
    internal_notes TEXT, -- Confidential
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 14. SUPPORT REQUESTS
CREATE TABLE IF NOT EXISTS public.support_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 15. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_readiness ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: Is Administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can view & edit their own profile; Admins can view all
CREATE POLICY "Users read own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Businesses: Owner can read/write; assigned agents can read; admins can manage
CREATE POLICY "Owners read own business" ON public.businesses
FOR SELECT USING (
  owner_id = auth.uid()
  OR public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.support_assignments
    WHERE business_id = public.businesses.id AND agent_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY "Owners update own business" ON public.businesses
FOR UPDATE USING (owner_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users create own business" ON public.businesses
FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Transactions: STRICT RLS - ONLY the business owner can access
CREATE POLICY "Owners read own transactions" ON public.transactions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE id = public.transactions.business_id AND owner_id = auth.uid()
  )
  OR public.is_admin()
);

CREATE POLICY "Owners insert own transactions" ON public.transactions
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE id = public.transactions.business_id AND owner_id = auth.uid()
  )
);

CREATE POLICY "Owners update own transactions" ON public.transactions
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE id = public.transactions.business_id AND owner_id = auth.uid()
  )
);

CREATE POLICY "Owners delete own transactions" ON public.transactions
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE id = public.transactions.business_id AND owner_id = auth.uid()
  )
);

-- Products: Business owners manage products
CREATE POLICY "Owners access products" ON public.products
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE id = public.products.business_id AND owner_id = auth.uid()
  )
  OR public.is_admin()
);

-- Referrals: Owner, recipient provider, and admin
CREATE POLICY "Referrals access policy" ON public.referrals
FOR SELECT USING (
  owner_id = auth.uid()
  OR public.is_admin()
  OR (provider_id IN (
    SELECT p.id FROM public.providers p
    JOIN public.profiles pr ON pr.id = auth.uid()
    JOIN public.user_roles ur ON ur.user_id = pr.id
    WHERE ur.role = 'provider'
  ))
);

-- Support Sessions: Visible notes to entrepreneur, all to assigned agent/admin
CREATE POLICY "Support sessions access" ON public.support_sessions
FOR SELECT USING (
  public.is_admin()
  OR created_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.support_assignments sa
    JOIN public.businesses b ON b.id = sa.business_id
    WHERE sa.id = public.support_sessions.assignment_id AND b.owner_id = auth.uid()
  )
);

-- ====================================================================
-- 16. SODOBIZ BRIDGE OPPORTUNITY MANAGEMENT EXTENSIONS
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('employer', 'tvet_institute', 'financial_institution', 'community_org', 'government_bureau')),
    industry TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    website TEXT,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('verified', 'pending', 'rejected')),
    verified_at TIMESTAMPTZ,
    contact_person TEXT,
    is_hacklab_partner BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.opportunities (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('job', 'internship', 'apprenticeship', 'training')),
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    workplace_type TEXT DEFAULT 'on_site' CHECK (workplace_type IN ('on_site', 'hybrid', 'field_based')),
    description TEXT NOT NULL,
    responsibilities JSONB DEFAULT '[]'::jsonb NOT NULL,
    eligibility_criteria JSONB DEFAULT '[]'::jsonb NOT NULL,
    required_skills JSONB DEFAULT '[]'::jsonb NOT NULL,
    open_positions INTEGER DEFAULT 1 NOT NULL,
    stipend_or_salary TEXT,
    deadline DATE NOT NULL,
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.opportunity_applications (
    id TEXT PRIMARY KEY,
    opportunity_id TEXT NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'shortlisted', 'interview', 'accepted', 'rejected', 'withdrawn')),
    cover_note TEXT NOT NULL,
    resume_summary TEXT,
    status_reason TEXT,
    employer_feedback TEXT,
    interview_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_opp_applicant UNIQUE (opportunity_id, applicant_id)
);

CREATE TABLE IF NOT EXISTS public.saved_opportunities (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id TEXT NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_user_saved_opp UNIQUE (user_id, opportunity_id)
);

CREATE TABLE IF NOT EXISTS public.partner_commitments (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    opportunity_title TEXT NOT NULL,
    category TEXT NOT NULL,
    promised_placements INTEGER DEFAULT 1 NOT NULL,
    delivered_placements INTEGER DEFAULT 0 NOT NULL,
    verified_retained_placements INTEGER DEFAULT 0 NOT NULL,
    responsible_person TEXT NOT NULL,
    target_deadline DATE NOT NULL,
    status TEXT DEFAULT 'confirmed_commitment' CHECK (status IN ('proposed_pledge', 'confirmed_commitment', 'opportunity_published', 'youth_placed', 'outcome_verified')),
    follow_up_notes TEXT,
    retention_audit_date DATE,
    evidence_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.finance_products (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('youth_startup_loan', 'micro_working_capital', 'group_guarantee', 'asset_lease', 'revolving_fund')),
    min_amount NUMERIC(14, 2) NOT NULL,
    max_amount NUMERIC(14, 2) NOT NULL,
    interest_rate_desc TEXT NOT NULL,
    repayment_terms TEXT NOT NULL,
    trade_licence_required BOOLEAN DEFAULT TRUE NOT NULL,
    tin_required BOOLEAN DEFAULT TRUE NOT NULL,
    collateral_required BOOLEAN DEFAULT FALSE NOT NULL,
    collateral_description TEXT NOT NULL,
    eligibility_notes TEXT NOT NULL,
    required_documents JSONB DEFAULT '[]'::jsonb NOT NULL,
    official_channel_name TEXT NOT NULL,
    official_channel_url TEXT,
    official_phone TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.finance_readiness_checks (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    finance_product_id TEXT NOT NULL REFERENCES public.finance_products(id) ON DELETE CASCADE,
    has_kebele_id BOOLEAN DEFAULT FALSE NOT NULL,
    has_tin_number BOOLEAN DEFAULT FALSE NOT NULL,
    has_trade_license BOOLEAN DEFAULT FALSE NOT NULL,
    has_written_business_plan BOOLEAN DEFAULT FALSE NOT NULL,
    has_peer_solidarity_group BOOLEAN DEFAULT FALSE NOT NULL,
    has_basic_record_keeping BOOLEAN DEFAULT FALSE NOT NULL,
    completed_financial_training BOOLEAN DEFAULT FALSE NOT NULL,
    readiness_score INTEGER DEFAULT 0 NOT NULL,
    missing_requirements JSONB DEFAULT '[]'::jsonb NOT NULL,
    action_plan_steps JSONB DEFAULT '[]'::jsonb NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.mentor_profiles (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    organization TEXT,
    designation TEXT NOT NULL,
    expertise_areas JSONB DEFAULT '[]'::jsonb NOT NULL,
    years_experience INTEGER DEFAULT 1 NOT NULL,
    bio TEXT NOT NULL,
    languages_spoken JSONB DEFAULT '["Amharic", "English"]'::jsonb NOT NULL,
    available_slots_per_week INTEGER DEFAULT 3 NOT NULL,
    is_accepting_mentees BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.mentorship_requests (
    id TEXT PRIMARY KEY,
    mentor_id TEXT NOT NULL REFERENCES public.mentor_profiles(id) ON DELETE CASCADE,
    youth_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    goal_statement TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed')),
    scheduled_time TIMESTAMPTZ,
    session_location_or_mode TEXT DEFAULT 'Youth Center',
    mentor_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.support_services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('disability_support', 'mental_wellbeing', 'srhr_health', 'legal_aid_gbv', 'career_orientation')),
    organization_name TEXT NOT NULL,
    location TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    eligibility TEXT NOT NULL,
    access_instructions TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE NOT NULL
);

-- Row-level security on new tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_readiness_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read verified organizations" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "Public read published opportunities" ON public.opportunities FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Applicants access own applications" ON public.opportunity_applications FOR ALL USING (applicant_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users access own saved opportunities" ON public.saved_opportunities FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Public read partner commitments" ON public.partner_commitments FOR SELECT USING (true);
CREATE POLICY "Public read finance products" ON public.finance_products FOR SELECT USING (is_verified = true OR public.is_admin());
CREATE POLICY "Users access own readiness checks" ON public.finance_readiness_checks FOR ALL USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Public read mentor profiles" ON public.mentor_profiles FOR SELECT USING (is_accepting_mentees = true OR public.is_admin());
CREATE POLICY "Youth and mentors access own requests" ON public.mentorship_requests FOR ALL USING (youth_id = auth.uid() OR public.is_admin());
CREATE POLICY "Public read support services" ON public.support_services FOR SELECT USING (is_verified = true);
