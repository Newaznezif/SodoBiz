export type UserRoleType = 'youth' | 'entrepreneur' | 'employer' | 'provider' | 'mentor' | 'agent' | 'admin';

export type VerificationStatus = 'verified' | 'pending' | 'rejected';

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface UserDocument {
  id: string;
  user_id: string;
  title: string;
  type: 'cv' | 'certificate' | 'id_card' | 'business_license' | 'other';
  file_name: string;
  file_size?: string;
  url?: string;
  uploaded_at: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'application' | 'mentorship' | 'referral' | 'commitment' | 'opportunity' | 'system';
  link_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  preferred_language: 'en' | 'am' | 'wo';
  role: UserRoleType;
  // Extended youth & job seeker profile fields
  education_level?: string;
  field_of_study?: string;
  skills?: string[];
  career_goals?: string;
  careerGoals?: string;
  career_interests?: string[];
  has_disability?: boolean;
  disability_support_notes?: string;
  tvet_status?: 'not_enrolled' | 'enrolled' | 'graduated' | 'interested' | 'not_interested';
  kebele?: string;
  bio?: string;
  cv_filename?: string;
  cv_uploaded_at?: string;
  work_experience?: WorkExperience[];
  documents?: UserDocument[];
  organization_id?: string;
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
  is_hacklab_partner?: boolean; // Partnership flag
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
export type OpportunityType =
  | 'job'
  | 'internship'
  | 'apprenticeship'
  | 'training'
  | 'tvet'
  | 'scholarship'
  | 'entrepreneurship'
  | 'business_support'
  | 'mentorship_track'
  | 'grant_competition';

export type OpportunityStatus = 'published' | 'draft' | 'pending_approval' | 'paused' | 'closed';

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
  status: OpportunityStatus;
  is_accessible?: boolean;
  requirements?: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// Opportunity Applications
export type ApplicationStatus =
  | 'submitted'
  | 'reviewing'
  | 'shortlisted'
  | 'interview'
  | 'interview_scheduled'
  | 'accepted'
  | 'rejected'
  | 'withdrawn'
  | 'closed';

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
  cv_filename?: string;
  cv_url?: string;
  supporting_documents?: string[];
  applied_at?: string;
  withdrawn_at?: string;
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

// Partnership & Commitment Tracker
export type CommitmentStatus =
  | 'proposed_pledge'
  | 'confirmed_commitment'
  | 'opportunity_published'
  | 'youth_placed'
  | 'outcome_verified'
  | 'delivered'
  | 'partial'
  | 'pending'
  | 'defaulted';

export interface PartnerCommitment {
  id: string;
  organization_id: string;
  opportunity_title: string;
  category: string;
  promised_placements: number;
  delivered_placements: number;
  verified_retained_placements: number;
  spots_promised: number;
  spots_delivered: number;
  verified_retained: number;
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
  evidence_filename?: string;
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

export interface SavedFinanceProduct {
  id: string;
  user_id: string;
  product_id: string;
  saved_at: string;
}

export interface FinanceProductInquiry {
  id: string;
  user_id: string;
  product_id: string;
  business_id?: string;
  applicant_name: string;
  applicant_phone: string;
  amount_requested: number;
  purpose: string;
  status: 'pending' | 'contacted' | 'appointment_booked' | 'under_review' | 'referred' | 'closed';
  officer_notes?: string;
  created_at: string;
  updated_at: string;
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

export interface BusinessNeedsAssessment {
  id: string;
  business_id: string;
  user_id: string;
  capital_need_priority: 'urgent' | 'moderate' | 'low';
  licensing_need: boolean;
  bookkeeping_need: boolean;
  equipment_needed?: string;
  market_access_need: boolean;
  mentorship_requested: boolean;
  training_interests: string[];
  assessed_at: string;
}

export interface BusinessSupportProgram {
  id: string;
  title: string;
  provider_name: string;
  category: 'grant' | 'incubation' | 'equipment_loan' | 'tax_guidance' | 'market_stall' | 'advisory';
  description: string;
  eligibility: string;
  deadline?: string;
  contact_info: string;
  is_active: boolean;
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

// Training & TVET Skills
export interface TrainingCourse {
  id: string;
  title: string;
  provider: string;
  category: 'ict' | 'agro_processing' | 'mechanics' | 'hospitality' | 'construction' | 'business_finance';
  duration: string;
  level: string;
  seats_available: number;
  description: string;
  skills_taught: string[];
  eligibility: string;
  location: string;
  is_free: boolean;
  stipend_provided: boolean;
  created_at: string;
}

export interface TrainingEnrollment {
  id: string;
  course_id: string;
  user_id: string;
  status: 'enrolled' | 'in_progress' | 'completed' | 'dropped';
  enrolled_at: string;
  completed_at?: string;
  progress_percentage: number;
}

// Mentorship
export interface MentorProfile {
  id: string;
  user_id: string;
  full_name: string;
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
