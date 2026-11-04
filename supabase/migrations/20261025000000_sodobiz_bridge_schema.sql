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
