export type UserRoleType = 'youth' | 'entrepreneur' | 'employer' | 'provider' | 'mentor' | 'agent' | 'admin';

export type VerificationStatus = 'verified' | 'pending' | 'rejected';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  preferred_language: 'en' | 'am' | 'wo';
  role: UserRoleType;
  // Extended youth profile fields
  education_level?: string;
  field_of_study?: string;
  skills?: string[];
  career_goals?: string;
  careerGoals?: string;
  has_disability?: boolean;
  disability_support_notes?: string;
  tvet_status?: 'not_enrolled' | 'enrolled' | 'graduated' | 'interested' | 'not_interested';
  kebele?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

// Organization / Employer Partner
export interface Organization {
  id: string;
  name: string;
  slug: string;
  type: 'employer' | 'tvet_institute' | 'financial_institution' | 'community_org' | 'government_agency' | 'bank' | 'microfinance' | 'government_office' | string;
  industry: string;
  description: string;
  location: string;
  phone: string;
  email?: string;
  website?: string;
  verification_status: VerificationStatus;
  verified_at?: string;
  contact_person?: string;
  is_hacklab_partner?: boolean; // Sodo HackLab partnership flag
  created_at: string;
  updated_at: string;
}

// Legacy Provider alias
export interface Provider {
  id: string;
  organization_name: string;
  slug: string;
  organization_type: 'bank' | 'microfinance' | 'government_office' | 'ngo' | 'business_hub' | 'cooperative' | 'incubator' | string;
  description: string;
  location: string;
  official_phone: string;
  official_website?: string;
  verification_status: VerificationStatus;
  last_verified_at: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProviderService {
  id: string;
  provider_id: string;
  title: string;
  description: string;
  eligibility: string;
  requirements: string[];
  official_application_url?: string;
  is_published: boolean;
}

export type ReferralStatus =
  | 'submitted'
  | 'in_review'
  | 'contacted'
  | 'approved'
  | 'rejected'
  | 'withdrawn'
  | 'received'
  | 'additional_info_requested'
  | 'referred_to_official_channel'
  | 'closed';

export interface Referral {
  id: string;
  business_id: string;
  owner_id: string;
  provider_id: string;
  service_id: string;
  status: ReferralStatus;
  consent_given_at: string;
  consent_scope: string[];
  notes?: string;
  withdrawn_at?: string;
  created_at: string;
  updated_at: string;
}

// Opportunity Hub
export type OpportunityType = 'job' | 'internship' | 'apprenticeship' | 'training' | 'mentorship_track' | 'grant_competition';

export interface Opportunity {
  id: string;
  organization_id: string;
  title: string;
  type: OpportunityType;
  category: string;
  location: string;
  workplace_type: 'on_site' | 'hybrid' | 'field_based';
  description: string;
  responsibilities: string[];
  eligibility_criteria: string[];
  required_skills: string[];
  open_positions: number;
  spots_available?: number;
  stipend_or_salary?: string;
  stipend_amount?: number;
  currency?: string;
  deadline: string;
  status: 'published' | 'draft' | 'closed';
  is_accessible?: boolean;
  requirements?: string[];
  created_at: string;
  updated_at: string;
}

// Opportunity Applications
export type ApplicationStatus = 'submitted' | 'reviewing' | 'shortlisted' | 'interview' | 'interview_scheduled' | 'accepted' | 'rejected' | 'withdrawn';

export interface OpportunityApplication {
  id: string;
  opportunity_id: string;
  applicant_id: string;
  user_id?: string;
  status: ApplicationStatus;
  cover_note: string;
  motivation_statement?: string;
  resume_summary?: string;
  status_reason?: string;
  employer_feedback?: string;
  reviewer_notes?: string;
  interview_date?: string;
  phone?: string;
  relevant_skills?: string[];
  applied_at?: string;
  created_at: string;
  updated_at: string;
}

// Saved Opportunities
export interface SavedOpportunity {
  id: string;
  user_id: string;
  opportunity_id: string;
  saved_at: string;
}

// Partnership & Commitment Tracker (Sodo Innovation HackLab Evidence)
export type CommitmentStatus = 'proposed_pledge' | 'confirmed_commitment' | 'opportunity_published' | 'youth_placed' | 'outcome_verified' | 'delivered' | 'partial' | 'pending' | 'defaulted';

export interface PartnerCommitment {
  id: string;
  organization_id: string;
  opportunity_title: string;
  category: string;
  promised_placements: number;
  delivered_placements: number;
  verified_retained_placements: number; // Addresses "fewer than 1 in 5 retained" problem
  spots_promised?: number;
  spots_delivered?: number;
  verified_retained?: number;
  organization_name?: string;
  opportunity_type?: string;
  verification_status?: 'delivered' | 'partial' | 'pending' | 'defaulted';
  responsible_person: string;
  target_deadline: string;
  status: CommitmentStatus;
  follow_up_notes: string;
  notes?: string;
  retention_audit_date?: string;
  evidence_url?: string;
  created_at: string;
  updated_at: string;
}

// Finance Bridge: Verified Finance Products & Readiness
export interface FinanceProduct {
  id: string;
  organization_id: string;
  name: string;
  category: 'youth_startup_loan' | 'micro_working_capital' | 'group_guarantee' | 'asset_lease' | 'revolving_fund' | string;
  product_type?: string;
  institution_name?: string;
  description?: string;
  min_amount: number;
  max_amount: number;
  interest_rate_desc: string;
  interest_rate_annual?: number;
  repayment_terms: string;
  repayment_period_months?: number;
  trade_licence_required: boolean;
  requires_trade_license?: boolean;
  tin_required: boolean;
  collateral_required: boolean;
  collateral_type?: string;
  collateral_description: string;
  eligibility_notes: string;
  required_documents: string[];
  requirements?: string[];
  official_channel_name: string;
  official_application_channel?: string;
  official_channel_url?: string;
  official_phone: string;
  contact_phone?: string;
  currency?: string;
  is_verified: boolean;
  created_at: string;
}

export interface FinanceReadinessCheck {
  id: string;
  user_id: string;
  finance_product_id?: string;
  has_kebele_id?: boolean;
  has_valid_id?: boolean;
  has_tin_number: boolean;
  has_trade_license: boolean;
  has_written_business_plan: boolean;
  has_peer_solidarity_group?: boolean;
  has_solidarity_group?: boolean;
  has_basic_record_keeping?: boolean;
  has_recorded_bookkeeping?: boolean;
  completed_financial_training?: boolean;
  willing_to_attend_training?: boolean;
  readiness_score?: number;
  missing_requirements?: string[];
  action_plan_steps?: string[];
  assessed_at?: string;
  updated_at?: string;
}

// Business Launchpad & Micro-Enterprise
export interface BusinessCategory {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  category_id: string;
  business_type: 'retail' | 'agriculture' | 'crafts' | 'food_services' | 'services' | 'technology' | 'other';
  stage?: 'idea' | 'startup' | 'operating' | 'scaling';
  location: string;
  operating_since: string;
  worker_count: number;
  status: 'active' | 'pending' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface BusinessPlan {
  id: string;
  business_id?: string;
  user_id?: string;
  business_name?: string;
  sector?: string;
  target_market?: string;
  product_or_service?: string;
  pricing_strategy?: string;
  startup_capital_needed?: number;
  estimated_monthly_revenue?: number;
  estimated_monthly_expenses?: number;
  currency?: string;
  is_completed?: boolean;
  executive_summary?: string;
  target_customers?: string;
  competitors_in_sodo?: string;
  startup_cost_breakdown?: { item: string; cost: number }[];
  total_startup_cost?: number;
  projected_monthly_revenue?: number;
  break_even_months?: number;
  funding_source_plan?: string;
  created_at?: string;
  updated_at: string;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  business_id: string;
  created_by: string;
  transaction_type: TransactionType;
  amount: number;
  currency: 'ETB';
  category: string;
  description: string;
  transaction_date: string;
  payment_method?: 'cash' | 'telebirr' | 'bank_transfer' | 'cbe_birr' | 'other';
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  business_id: string;
  name: string;
  description: string;
  category_id?: string;
  selling_price: number;
  cost_price?: number;
  stock_quantity: number;
  low_stock_threshold: number;
  sku?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Mentorship
export interface MentorProfile {
  id: string;
  user_id: string;
  full_name?: string;
  job_title?: string;
  organization?: string;
  designation?: string;
  expertise_areas: string[];
  years_experience: number;
  bio: string;
  languages_spoken?: string[];
  languages?: string[];
  available_slots_per_week?: number;
  availability_hours?: string;
  is_accepting_mentees: boolean;
  created_at: string;
}

export type MentorshipRequestStatus = 'pending' | 'accepted' | 'scheduled' | 'declined' | 'completed';

export interface MentorshipRequest {
  id: string;
  mentor_id: string;
  youth_id: string;
  topic: string;
  goal_statement?: string;
  notes?: string;
  status: MentorshipRequestStatus;
  scheduled_time?: string;
  session_date?: string;
  session_location_or_mode?: 'Youth Center' | 'Phone Call' | 'In-Person Sodo' | 'Virtual' | string;
  mentor_notes?: string;
  session_notes?: string;
  requested_at?: string;
  created_at: string;
  updated_at: string;
}

// Support Services & Inclusion Directory
export interface SupportService {
  id: string;
  name: string;
  category: 'disability_support' | 'youth_center_guidance' | 'mental_wellbeing' | 'srhr_health' | 'legal_aid_gbv' | 'tvet_enrollment' | string;
  organization_name?: string;
  provider?: string;
  location?: string;
  address?: string;
  phone: string;
  email?: string;
  eligibility: string;
  description?: string;
  target_group?: string;
  operating_hours?: string;
  access_instructions?: string;
  is_verified: boolean;
}

// Readiness & Audit
export interface ReadinessItem {
  id: string;
  title: string;
  description: string;
  category: 'records' | 'documentation' | 'governance' | 'banking';
  is_active: boolean;
  recommended_action: string;
}

export type ReadinessStatus = 'not_started' | 'in_progress' | 'completed';

export interface BusinessReadiness {
  id: string;
  business_id: string;
  readiness_item_id: string;
  status: ReadinessStatus;
  notes?: string;
  updated_by: string;
  updated_at: string;
}

// Learning Lessons
export interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface LearningLesson {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: 'cash_management' | 'record_keeping' | 'profit_calculation' | 'credit_safety' | 'pricing' | 'interview_readiness' | 'tvet_skills';
  language: 'en' | 'am' | 'wo';
  practical_example: string;
  review_questions: QuizQuestion[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  quiz_score?: number;
  completed_at?: string;
}

// Support Assignments & Sessions
export interface SupportAssignment {
  id: string;
  business_id: string;
  agent_id: string;
  assigned_by?: string;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface SupportSession {
  id: string;
  assignment_id: string;
  session_date: string;
  topic: string;
  outcome: string;
  entrepreneur_visible_notes?: string;
  internal_notes?: string;
  created_by: string;
  created_at: string;
}

export interface SupportRequest {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

// Audit Logs
export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  action: string;
  target_type: string;
  target_id: string;
  metadata?: Record<string, any>;
  created_at: string;
}
