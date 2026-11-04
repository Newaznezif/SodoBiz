export type UserRoleType = 'entrepreneur' | 'agent' | 'provider' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  preferred_language: 'en' | 'am' | 'wo';
  role: UserRoleType;
  created_at: string;
  updated_at: string;
}

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
  business_type: 'retail' | 'agriculture' | 'crafts' | 'food_services' | 'services' | 'other';
  location: string;
  operating_since: string; // e.g. "2021"
  worker_count: number;
  status: 'active' | 'pending' | 'suspended';
  created_at: string;
  updated_at: string;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  business_id: string;
  created_by: string;
  transaction_type: TransactionType;
  amount: number;
  currency: string; // default "ETB"
  category: string;
  description: string;
  transaction_date: string; // YYYY-MM-DD
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
  category: 'cash_management' | 'record_keeping' | 'profit_calculation' | 'credit_safety' | 'pricing';
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

export type VerificationStatus = 'verified' | 'pending' | 'rejected';

export interface Provider {
  id: string;
  organization_name: string;
  slug: string;
  organization_type: 'microfinance' | 'bank' | 'cooperative' | 'government_office' | 'ngo' | 'incubator';
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
  | 'draft'
  | 'submitted'
  | 'received'
  | 'in_review'
  | 'additional_info_requested'
  | 'referred_to_official_channel'
  | 'closed'
  | 'withdrawn';

export interface Referral {
  id: string;
  business_id: string;
  owner_id: string;
  provider_id: string;
  service_id: string;
  status: ReferralStatus;
  consent_given_at: string;
  consent_scope: string[]; // e.g. ['business_profile', 'monthly_revenue_summary', 'readiness_checklist']
  notes?: string;
  withdrawn_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SupportAssignment {
  id: string;
  business_id: string;
  agent_id: string;
  assigned_by: string;
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
  entrepreneur_visible_notes: string;
  internal_notes: string;
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
