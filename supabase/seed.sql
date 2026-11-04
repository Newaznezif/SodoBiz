-- ====================================================================
-- SodoBiz Bridge Database Seed: supabase/seed.sql
-- Fictional Demonstration Data for Wolaita Sodo, Ethiopia
-- ====================================================================

-- 1. SEED CATEGORIES
INSERT INTO public.business_categories (id, name, description, is_active) VALUES
('cat-retail', 'Retail & Consumer Goods', 'Small general shops, groceries, textiles, and household essentials', true),
('cat-agri', 'Agriculture & Processing', 'Grain milling, spice preparation, vegetable trade, and dairy', true),
('cat-crafts', 'Artisan Crafts & Weaving', 'Traditional Wolaita handweaving, pottery, and woodcrafts', true),
('cat-food', 'Food & Beverage Services', 'Coffee houses, tea stalls, injera baking, and local eateries', true),
('cat-services', 'Personal & Trade Services', 'Tailoring, hair salons, electronics repair, and transport services', true)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED READINESS ITEMS
INSERT INTO public.readiness_items (id, title, description, category, is_active, recommended_action) VALUES
('read-1', 'Completed Business Profile', 'Basic business details, sector, location, operating duration, and owner information.', 'records', true, 'Complete all steps in the business profile onboarding page.'),
('read-2', 'Regular Daily Sales Log', 'At least 14 days of recorded customer sales transactions.', 'records', true, 'Record everyday cash and digital (telebirr) receipts consistently.'),
('read-3', 'Operating Expense Tracking', 'Documented inventory restock costs, utility, transport, and rental expenses.', 'records', true, 'Log all expenses with receipts or handwritten vendor notes.'),
('read-4', 'Product & Inventory List', 'Structured list of primary products or services with selling prices and stock levels.', 'records', true, 'Add your active inventory products with cost and selling prices.'),
('read-5', 'Monthly Cash Flow Summary', 'Clear visibility of monthly net income after subtracting total operational costs.', 'records', true, 'Review the financial report summary to confirm positive operating result.'),
('read-6', 'Kebele Business Registration / License', 'Official municipal or Kebele micro-enterprise registration certificate, if issued.', 'documentation', true, 'Visit Wolaita Sodo trade bureau or Kebele administration office to renew permit.'),
('read-7', 'Separated Business & Personal Money', 'Distinct cash box or dedicated telebirr merchant / CBE bank account for business.', 'banking', true, 'Keep a separate bank account or telebirr wallet specifically for business flows.'),
('read-8', 'Documented Business Growth Goals', 'Clear plan for upcoming restock, equipment purchase, or hiring needs.', 'governance', true, 'Outline your 6-month growth target in your business profile.'),
('read-9', 'Reviewed Provider Application Checklist', 'Understood specific requirements of local MFIs or cooperatives before applying.', 'documentation', true, 'Browse verified providers in the directory and examine their eligibility criteria.')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED VERIFIED PROVIDERS
INSERT INTO public.providers (id, organization_name, slug, organization_type, description, location, official_phone, official_website, verification_status, last_verified_at) VALUES
('prov-omo', 'Omo Bank S.C. (Wolaita Sodo District Branch)', 'omo-bank-wolaita-sodo', 'bank', 'Prominent regional commercial and microfinance institution serving smallholder farmers and youth businesses across southern Ethiopia.', 'Around Piazza, Commercial District, Wolaita Sodo', '+251 46 551 2280', 'https://omobank.com.et', 'verified', NOW()),
('prov-visionfund', 'VisionFund Microfinance Institution Sodo', 'visionfund-mfi-sodo', 'microfinance', 'Specialized microfinance organization providing working capital loans, women empowerment financing, and agricultural trade credits in Wolaita.', 'Hospital Road, Near Wolaita Sodo University Main Gate', '+251 46 551 4412', 'https://visionfundmfi.com', 'verified', NOW()),
('prov-wasasa', 'Wasasa Microfinance S.C. Sodo Branch', 'wasasa-mfi-sodo', 'microfinance', 'Dedicated financial inclusion partner offering group guarantee loans, asset financing for machinery, and retail merchant working capital.', 'Arada Kebele, Near Central Bus Terminal, Wolaita Sodo', '+251 46 551 1890', 'https://wasasa.org.et', 'verified', NOW()),
('prov-sme-office', 'Wolaita Sodo City Micro & Small Enterprise Office', 'wolaita-sodo-mse-development', 'government_office', 'Public municipal agency facilitating formal business licensing, trade exhibitions, subsidized market shades, and vocational workshops.', 'Municipal Administration Complex, Wolaita Sodo', '+251 46 551 2133', null, 'verified', NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. SEED SERVICES
INSERT INTO public.provider_services (id, provider_id, title, description, eligibility, requirements, is_published) VALUES
('srv-omo-micro', 'prov-omo', 'Micro-Enterprise Working Capital Loan', 'Credit support for small retail shops, grain millers, and craftspeople to purchase seasonal inventory.', 'Operating micro-enterprise in Wolaita zone with at least 6 months of verifiable sales transactions.', '["Valid Kebele ID", "At least 3 months of recorded business transactions", "Two personal guarantors from local business community", "Completed SodoBiz Business Readiness profile summary"]'::jsonb, true),
('srv-vf-women', 'prov-visionfund', 'Women Entrepreneur Growth Financing', 'Tailored financial facility designed for women-owned micro-businesses with flexible group guarantees.', 'Women business owners aged 18-60 running an active trade or service in Wolaita Sodo.', '["Valid Kebele identity card", "Proof of existing business activity and inventory", "Participation in a 1-day financial literacy refresher session"]'::jsonb, true)
ON CONFLICT (id) DO NOTHING;
