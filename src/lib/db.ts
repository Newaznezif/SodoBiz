import {
  UserProfile,
  Business,
  BusinessCategory,
  Transaction,
  Product,
  ReadinessItem,
  BusinessReadiness,
  LearningLesson,
  LessonProgress,
  Provider,
  ProviderService,
  Referral,
  SupportAssignment,
  SupportSession,
  SupportRequest,
  AuditLog,
  Organization,
  Opportunity,
  OpportunityApplication,
  SavedOpportunity,
  PartnerCommitment,
  FinanceProduct,
  FinanceReadinessCheck,
  BusinessPlan,
  MentorProfile,
  MentorshipRequest,
  SupportService,
  AppNotification,
  UserDocument,
  TrainingCourse,
  TrainingEnrollment,
  BusinessNeedsAssessment,
  BusinessSupportProgram,
  SavedFinanceProduct,
  FinanceProductInquiry,
} from '../types';
import {
  SEED_ORGANIZATIONS,
  SEED_OPPORTUNITIES,
  SEED_APPLICATIONS,
  SEED_COMMITMENTS,
  SEED_FINANCE_PRODUCTS,
  SEED_MENTORS,
  SEED_MENTORSHIP_REQUESTS,
  SEED_SUPPORT_SERVICES,
  SEED_TRAINING_COURSES,
  SEED_TRAINING_ENROLLMENTS,
  SEED_BUSINESS_SUPPORT_PROGRAMS,
  SEED_NOTIFICATIONS,
} from './youth-db-seed';

// Default categories
export const INITIAL_CATEGORIES: BusinessCategory[] = [
  { id: 'cat-retail', name: 'Retail & Consumer Goods', description: 'Small general shops, groceries, textiles, and household essentials', is_active: true },
  { id: 'cat-agri', name: 'Agriculture & Processing', description: 'Grain milling, spice preparation, vegetable trade, and dairy', is_active: true },
  { id: 'cat-crafts', name: 'Artisan Crafts & Weaving', description: 'Traditional Wolaita handweaving, pottery, and woodcrafts', is_active: true },
  { id: 'cat-food', name: 'Food & Beverage Services', description: 'Coffee houses, tea stalls, injera baking, and local eateries', is_active: true },
  { id: 'cat-services', name: 'Personal & Trade Services', description: 'Tailoring, hair salons, electronics repair, and transport services', is_active: true },
];

// Initial readiness items
export const INITIAL_READINESS_ITEMS: ReadinessItem[] = [
  {
    id: 'read-1',
    title: 'Completed Business Profile',
    description: 'Basic business details, sector, location, operating duration, and owner information.',
    category: 'records',
    is_active: true,
    recommended_action: 'Complete all steps in the business profile onboarding page.',
  },
  {
    id: 'read-2',
    title: 'Regular Daily Sales Log',
    description: 'At least 14 days of recorded customer sales transactions.',
    category: 'records',
    is_active: true,
    recommended_action: 'Record everyday cash and digital (telebirr) receipts consistently.',
  },
  {
    id: 'read-3',
    title: 'Operating Expense Tracking',
    description: 'Documented inventory restock costs, utility, transport, and rental expenses.',
    category: 'records',
    is_active: true,
    recommended_action: 'Log all expenses with receipts or handwritten vendor notes.',
  },
  {
    id: 'read-4',
    title: 'Product & Inventory List',
    description: 'Structured list of primary products or services with selling prices and stock levels.',
    category: 'records',
    is_active: true,
    recommended_action: 'Add your active inventory products with cost and selling prices.',
  },
  {
    id: 'read-5',
    title: 'Monthly Cash Flow Summary',
    description: 'Clear visibility of monthly net income after subtracting total operational costs.',
    category: 'records',
    is_active: true,
    recommended_action: 'Review the financial report summary to confirm positive operating result.',
  },
  {
    id: 'read-6',
    title: 'Kebele Business Registration / License',
    description: 'Official municipal or Kebele micro-enterprise registration certificate, if issued.',
    category: 'documentation',
    is_active: true,
    recommended_action: 'Visit Wolaita Sodo trade bureau or Kebele administration office to renew permit.',
  },
  {
    id: 'read-7',
    title: 'Separated Business & Personal Money',
    description: 'Distinct cash box or dedicated telebirr merchant / CBE bank account for business.',
    category: 'banking',
    is_active: true,
    recommended_action: 'Keep a separate bank account or telebirr wallet specifically for business flows.',
  },
  {
    id: 'read-8',
    title: 'Documented Business Growth Goals',
    description: 'Clear plan for upcoming restock, equipment purchase, or hiring needs.',
    category: 'governance',
    is_active: true,
    recommended_action: 'Outline your 6-month growth target in your business profile.',
  },
  {
    id: 'read-9',
    title: 'Reviewed Provider Application Checklist',
    description: 'Understood specific requirements of local MFIs or cooperatives before applying.',
    category: 'documentation',
    is_active: true,
    recommended_action: 'Browse verified providers in the directory and examine their eligibility criteria.',
  },
];

// Initial financial literacy lessons
export const INITIAL_LESSONS: LearningLesson[] = [
  {
    id: 'les-1',
    title: 'Separating Business and Personal Money',
    slug: 'separating-business-personal-money',
    summary: 'Why mixing household expenses with store cash drains working capital and how to stop it.',
    category: 'cash_management',
    language: 'en',
    content: `When a micro-entrepreneur takes 200 ETB from the store till to buy groceries for dinner without recording it, the store effectively loses inventory restock money. 
    
In Wolaita Sodo, many promising retail shops run out of stock within six months because money collected from customers was treated as personal pocket money.

Key Steps:
1. Pay yourself a fixed weekly or monthly allowance (owner's wage) rather than dipping into daily sales.
2. Maintain a separate cash drawer or pouch for business sales.
3. Open a dedicated bank account or separate telebirr account strictly for business operations.
4. Record any emergency personal withdrawal as an owner withdrawal, not a general business expense.`,
    practical_example: 'Almaz runs a spice shop in Sodo market. Daily sales are 1,800 ETB. Rather than using 300 ETB for family food directly, she sets aside 3,500 ETB at the end of every week as her salary. Her store stock remains 100% funded.',
    review_questions: [
      {
        question: 'Why should an entrepreneur avoid paying household bills directly out of the cash drawer?',
        options: [
          'It drains working capital needed to restock merchandise',
          'It is illegal under trade law to buy food',
          'It reduces your customer satisfaction rating',
          'It attracts bank transaction fees'
        ],
        correct_index: 0,
        explanation: 'Taking unrecorded cash from daily sales leaves insufficient working capital to replenish wholesale stock.'
      }
    ],
    is_published: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'les-2',
    title: 'The Discipline of Daily Record-Keeping',
    slug: 'discipline-daily-record-keeping',
    summary: 'How recording every transaction in a ledger or digital app unlocks bank trust and trade credit.',
    category: 'record_keeping',
    language: 'en',
    content: `Banks and MFIs in Wolaita (such as Omo Bank and VisionFund) cannot approve loans based on verbal claims of high revenue. They demand verifiable transaction consistency.

Recording Principles:
1. Log cash and telebirr sales as they occur, or at the close of every business day.
2. Demand and store vendor receipts for bulk goods purchased.
3. Total weekly sales and track whether peak market days (e.g., Saturday market) cover slow mid-week days.`,
    practical_example: 'Bekele records every Bajaj tire repair immediately on his phone. When applying for working capital, his 30-day ledger proved 28,000 ETB in sales with zero gaps.',
    review_questions: [
      {
        question: 'What is the primary reason formal lenders require a written sales log?',
        options: [
          'To report your business to tax auditors',
          'To verify consistent cash flow and repayment capacity',
          'To verify who your suppliers are',
          'To confiscate excess inventory'
        ],
        correct_index: 1,
        explanation: 'Consistent transaction history gives credit officers confidence in your ability to make scheduled loan repayments.'
      }
    ],
    is_published: true,
    created_at: '2026-01-12T10:00:00Z',
    updated_at: '2026-01-12T10:00:00Z',
  },
  {
    id: 'les-3',
    title: 'Calculating True Operating Profit',
    slug: 'calculating-true-operating-profit',
    summary: 'Revenue is not profit: how to subtract cost of goods and operational expenses correctly.',
    category: 'profit_calculation',
    language: 'en',
    content: `Many micro-entrepreneurs confuse cash in hand with profit. 
    
Operating Profit Formula:
Operating Result = Total Income from Sales - Total Business Expenses (Cost of Goods + Rent + Utilities + Transport + Wages).

If you purchase 10,000 ETB of goods and sell them for 13,000 ETB, your gross markup is 3,000 ETB. But if transport cost 800 ETB and shop rent allocation is 1,200 ETB, your actual operating profit is:
3,000 ETB - 800 ETB - 1,200 ETB = 1,000 ETB.`,
    practical_example: 'Yohannes sells 45,000 ETB of coffee and snacks this month. His supplies cost 28,000 ETB, electricity 1,500 ETB, and kiosk rent 4,000 ETB. Total expenses: 33,500 ETB. Estimated operating profit: 11,500 ETB.',
    review_questions: [
      {
        question: 'If your store collects 20,000 ETB in sales and spent 14,000 ETB on restock, rent, and transport, what is your operating profit?',
        options: ['20,000 ETB', '14,000 ETB', '6,000 ETB', '34,000 ETB'],
        correct_index: 2,
        explanation: '20,000 ETB - 14,000 ETB = 6,000 ETB operating profit.'
      }
    ],
    is_published: true,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'les-4',
    title: 'Understanding Borrowing Costs & Avoiding Loan Scams',
    slug: 'understanding-borrowing-costs-avoiding-scams',
    summary: 'How to compare legitimate interest rates, service fees, and spot predatory advance-fee scams.',
    category: 'credit_safety',
    language: 'en',
    content: `Legitimate financial institutions (such as Omo Bank, VisionFund, or licensed RuSACCOs) never demand upfront non-refundable registration fees deposited to personal mobile wallets before reviewing loan applications.

Always ask these 4 questions before taking any loan:
1. What is the total interest percentage over the loan period?
2. Are there upfront administrative or insurance fees?
3. What is the exact weekly or monthly repayment amount?
4. What happens if sales drop unexpectedly during one month?

Do not borrow for day-to-day consumption; only borrow if the borrowed capital directly generates additional income that exceeds the repayment cost.`,
    practical_example: 'An unknown Telegram channel promises "Instant 100,000 ETB Business Loans without collateral" if the owner sends 3,000 ETB "processing fee" via telebirr. This is an advance-fee fraud scam. Genuine MFIs never operate this way.',
    review_questions: [
      {
        question: 'Which of the following is an immediate red flag indicating a loan scam?',
        options: [
          'The institution asks to see your business sales ledger',
          'An unknown person demands an upfront fee to a personal mobile account before releasing funds',
          'The bank provides a physical contract with a repayment schedule',
          'The loan officer visits your physical shop in Sodo'
        ],
        correct_index: 1,
        explanation: 'Demanding upfront money to personal accounts without formal physical appraisal is the hallmark of loan fraud.'
      }
    ],
    is_published: true,
    created_at: '2026-01-18T10:00:00Z',
    updated_at: '2026-01-18T10:00:00Z',
  },
  {
    id: 'les-5',
    title: 'Pricing Products & Managing Inventory',
    slug: 'pricing-products-managing-inventory',
    summary: 'Factoring in transport, spoilage, and seasonal supply fluctuations in southern Ethiopia.',
    category: 'pricing',
    language: 'en',
    content: `Pricing a product requires more than matching your competitor's price. You must know your unit landed cost.
    
Unit Landed Cost = Purchase Price per unit + (Transport Cost / units) + Handling/Packaging + Spoilage margin.

If you buy 50kg of teff for 4,500 ETB and pay 300 ETB for transport and 100 ETB for sacks, your total cost is 4,900 ETB (98 ETB/kg). Selling at 100 ETB/kg yields only 2 ETB profit per kilo, which may not cover your store rent. Always calculate unit landed cost before setting retail prices.`,
    practical_example: 'Almaz factors in the 250 ETB motorcycle transport cost for each sack of red peppers. She prices her packaged pepper powder with a healthy 30% margin that safely absorbs market price swings.',
    review_questions: [
      {
        question: 'What must be included when determining the true cost of an inventory item?',
        options: [
          'Only the sticker price paid to the farmer',
          'The purchase price plus freight, packaging, and handling costs',
          'Whatever price the customer offers to pay',
          'Last year\'s average market rate'
        ],
        correct_index: 1,
        explanation: 'Unit landed cost must include purchase price plus freight, packaging, and handling to prevent operating at a loss.'
      }
    ],
    is_published: true,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
];

// Initial verified providers in Wolaita Sodo
export const INITIAL_PROVIDERS: Provider[] = [
  {
    id: 'prov-omo',
    organization_name: 'Omo Bank S.C. (Wolaita Sodo District Branch)',
    slug: 'omo-bank-wolaita-sodo',
    organization_type: 'bank',
    description: 'Prominent regional commercial and microfinance institution serving smallholder farmers, micro-enterprises, and youth businesses across southern Ethiopia.',
    location: 'Around Piazza, Commercial District, Wolaita Sodo',
    official_phone: '+251 46 551 2280',
    official_website: 'https://omobank.com.et',
    verification_status: 'verified',
    last_verified_at: '2026-09-15T00:00:00Z',
    approved_by: 'admin-1',
    approved_at: '2026-09-15T12:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-09-15T00:00:00Z',
  },
  {
    id: 'prov-visionfund',
    organization_name: 'VisionFund Microfinance Institution Sodo',
    slug: 'visionfund-mfi-sodo',
    organization_type: 'microfinance',
    description: 'Specialized microfinance organization providing working capital loans, women empowerment financing, and agricultural trade credits in Wolaita.',
    location: 'Hospital Road, Near Wolaita Sodo University Main Gate',
    official_phone: '+251 46 551 4412',
    official_website: 'https://visionfundmfi.com',
    verification_status: 'verified',
    last_verified_at: '2026-09-20T00:00:00Z',
    approved_by: 'admin-1',
    approved_at: '2026-09-20T14:30:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-09-20T00:00:00Z',
  },
  {
    id: 'prov-wasasa',
    organization_name: 'Wasasa Microfinance S.C. Sodo Branch',
    slug: 'wasasa-mfi-sodo',
    organization_type: 'microfinance',
    description: 'Dedicated financial inclusion partner offering group guarantee loans, asset financing for machinery, and retail merchant working capital.',
    location: 'Arada Kebele, Near Central Bus Terminal, Wolaita Sodo',
    official_phone: '+251 46 551 1890',
    official_website: 'https://wasasa.org.et',
    verification_status: 'verified',
    last_verified_at: '2026-10-01T00:00:00Z',
    approved_by: 'admin-1',
    approved_at: '2026-10-01T09:15:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-10-01T00:00:00Z',
  },
  {
    id: 'prov-sme-office',
    organization_name: 'Wolaita Sodo City Micro & Small Enterprise Office',
    slug: 'wolaita-sodo-mse-development',
    organization_type: 'government_office',
    description: 'Public municipal agency facilitating formal business licensing, trade exhibitions, subsidized market shades, and vocational workshops.',
    location: 'Municipal Administration Complex, Wolaita Sodo',
    official_phone: '+251 46 551 2133',
    verification_status: 'verified',
    last_verified_at: '2026-10-15T00:00:00Z',
    approved_by: 'admin-1',
    approved_at: '2026-10-15T11:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-10-15T00:00:00Z',
  },
];

export const INITIAL_SERVICES: ProviderService[] = [
  {
    id: 'srv-omo-micro',
    provider_id: 'prov-omo',
    title: 'Micro-Enterprise Working Capital Loan',
    description: 'Short-term financing for purchasing restock inventory, raw grains, and processing materials with seasonal harvest grace periods.',
    eligibility: 'Operating micro-enterprise in Wolaita zone with at least 6 months of verifiable sales transactions.',
    requirements: [
      'Valid Kebele ID from Wolaita Sodo',
      'At least 3 months of recorded business transactions (verified via SodoBiz ledger or bank statement)',
      'Two personal guarantors from local business community or registered traders',
      'Completed SodoBiz Business Readiness profile summary'
    ],
    official_application_url: 'https://omobank.com.et/branches/sodo',
    is_published: true,
  },
  {
    id: 'srv-vf-women',
    provider_id: 'prov-visionfund',
    title: 'Women Entrepreneur Growth Financing',
    description: 'Tailored financial facility designed for women-owned micro-businesses in retail, agro-processing, and trade with flexible group guarantees.',
    eligibility: 'Women business owners aged 18-60 running an active trade or service in Wolaita Sodo.',
    requirements: [
      'Valid Kebele identity card',
      'Proof of existing business activity and inventory',
      'Participation in a 1-day financial literacy refresher session',
      'Group guarantee of 3 fellow market traders'
    ],
    official_application_url: 'https://visionfundmfi.com/credit',
    is_published: true,
  },
  {
    id: 'srv-wasasa-asset',
    provider_id: 'prov-wasasa',
    title: 'Machinery & Equipment Lease-to-Own Facility',
    description: 'Asset loan for grain milling motors, electric sewing machines, or woodcraft tools with repayment structured around machine output.',
    eligibility: 'Registered artisan or trade technician with dedicated commercial premises or market stall.',
    requirements: [
      'Proforma invoice from certified machinery supplier',
      'Renewed Kebele trade permit or cooperative membership certificate',
      '20% equity contribution to equipment cost'
    ],
    is_published: true,
  },
];

// Pre-seeded Users
export const SEED_USERS: UserProfile[] = [
  {
    id: 'user-almaz',
    email: 'almaz@sodobiz.et',
    full_name: 'Almaz Tekle Haile',
    phone: '+251 91 145 6789',
    preferred_language: 'en',
    role: 'entrepreneur',
    bio: 'Founder and owner of Asegedech Spice & Grain Mill in Sodo. Over 5 years experience in trade and spice preparation.',
    created_at: '2026-02-01T08:00:00Z',
    updated_at: '2026-10-15T09:00:00Z',
  },
  {
    id: 'user-birtukan',
    email: 'birtukan@sodobiz.et',
    full_name: 'Birtukan Shanko',
    phone: '+251 92 234 5678',
    preferred_language: 'wo',
    role: 'entrepreneur',
    bio: 'Master weaver producing authentic Wolaita gabi and cultural attire.',
    created_at: '2026-03-10T08:00:00Z',
    updated_at: '2026-10-18T10:00:00Z',
  },
  {
    id: 'user-yohannes',
    email: 'yohannes@sodobiz.et',
    full_name: 'Yohannes Desta',
    phone: '+251 93 345 6789',
    preferred_language: 'am',
    role: 'entrepreneur',
    bio: 'Operator of Buna Desta Coffee & Snack Bar near Sodo Stadium.',
    created_at: '2026-04-05T08:00:00Z',
    updated_at: '2026-10-20T11:00:00Z',
  },
  {
    id: 'user-youth-bekele',
    email: 'bekele.youth@sodobiz.et',
    full_name: 'Bekele Abera (Sodo Youth Job-Seeker)',
    phone: '+251 91 199 8877',
    preferred_language: 'en',
    role: 'youth',
    education_level: 'TVET Certificate Level 2',
    field_of_study: 'ICT & Electrical Installation',
    skills: ['Computer Literacy', 'Telebirr Integration', 'Basic Wiring', 'Customer Care'],
    career_goals: 'Secure an IT or electrical technician apprenticeship and establish a community solar repair kiosk.',
    careerGoals: 'Secure an IT or electrical technician apprenticeship and establish a community solar repair kiosk.',
    career_interests: ['Information Technology', 'Solar Energy & Electric Repair', 'Micro-Enterprise Management'],
    has_disability: false,
    tvet_status: 'graduated',
    kebele: 'Kebele 02, Sodo',
    bio: 'Certified TVET graduate with hands-on computer maintenance and electronics experience in Wolaita Sodo.',
    cv_filename: 'bekele_abera_cv.pdf',
    cv_uploaded_at: '2026-10-20T10:00:00Z',
    work_experience: [
      { id: 'exp-1', company: 'Damota Electronics Kiosk', role: 'Apprentice Repair Assistant', duration: '6 Months', description: 'Assisted in testing wiring and fixing phone screen charging ports.' },
      { id: 'exp-2', company: 'Sodo Market Retail Shop', role: 'Part-Time Cashier & Stock Taker', duration: '4 Months', description: 'Recorded cash and telebirr collections; verified daily inventory.' }
    ],
    documents: [
      { id: 'doc-1', user_id: 'user-youth-bekele', title: 'Curriculum Vitae (CV)', type: 'cv', file_name: 'bekele_abera_cv.pdf', file_size: '245 KB', uploaded_at: '2026-10-20T10:00:00Z' },
      { id: 'doc-2', user_id: 'user-youth-bekele', title: 'TVET Level 2 Certificate in ICT', type: 'certificate', file_name: 'bekele_tvet_level2_cert.pdf', file_size: '512 KB', uploaded_at: '2026-10-20T10:05:00Z' },
      { id: 'doc-3', user_id: 'user-youth-bekele', title: 'Kebele Resident Identity Card', type: 'id_card', file_name: 'kebele_id_bekele.pdf', file_size: '180 KB', uploaded_at: '2026-10-20T10:10:00Z' }
    ],
    created_at: '2026-03-01T08:00:00Z',
    updated_at: '2026-10-24T09:00:00Z',
  },
  {
    id: 'user-youth-marta',
    email: 'marta.youth@sodobiz.et',
    full_name: 'Marta Haile (Young Micro-Entrepreneur)',
    phone: '+251 92 288 3344',
    preferred_language: 'am',
    role: 'youth',
    education_level: 'High School Diploma (Grade 12)',
    field_of_study: 'General Commerce',
    skills: ['Textile Weaving', 'Sales', 'Stock Recording'],
    career_goals: 'Expand my home-based craft weaving business and access youth revolving finance.',
    careerGoals: 'Expand my home-based craft weaving business and access youth revolving finance.',
    career_interests: ['Artisan Crafts', 'Retail Store Management', 'Women Entrepreneurship'],
    has_disability: false,
    tvet_status: 'enrolled',
    kebele: 'Kebele 04, Sodo',
    bio: 'First-generation woman entrepreneur participating in Sodo micro-business cohort.',
    cv_filename: 'marta_haile_cv.pdf',
    cv_uploaded_at: '2026-10-21T11:00:00Z',
    work_experience: [
      { id: 'exp-m1', company: 'Wolaita Craft Artisans', role: 'Junior Weaver', duration: '1 Year', description: 'Hand-weaving traditional textiles and managing retail stalls.' }
    ],
    documents: [
      { id: 'doc-m1', user_id: 'user-youth-marta', title: 'Curriculum Vitae (CV)', type: 'cv', file_name: 'marta_haile_cv.pdf', file_size: '198 KB', uploaded_at: '2026-10-21T11:00:00Z' }
    ],
    created_at: '2026-03-15T08:00:00Z',
    updated_at: '2026-10-25T11:00:00Z',
  },
  {
    id: 'user-employer-damota',
    email: 'selamawit@damota-agro.et',
    full_name: 'W/ro Selamawit Gizaw (Damota Agro HR)',
    phone: '+251 46 551 2901',
    preferred_language: 'en',
    role: 'employer',
    organization_id: 'org-damota-agro',
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-10-12T10:00:00Z',
  },
  {
    id: 'user-mentor-tamirat',
    email: 'tamirat.mentor@sodobiz.et',
    full_name: 'Ato Tamirat Mengesha (Agri Mentor)',
    phone: '+251 91 144 3322',
    preferred_language: 'en',
    role: 'mentor',
    created_at: '2026-01-18T08:00:00Z',
    updated_at: '2026-10-15T08:00:00Z',
  },
  {
    id: 'user-mentor-hanan',
    email: 'hanan.finance@sodobiz.et',
    full_name: 'Hanan Worku (FinTech & Loan Advisor)',
    phone: '+251 93 355 7711',
    preferred_language: 'en',
    role: 'mentor',
    created_at: '2026-01-20T08:00:00Z',
    updated_at: '2026-10-18T08:00:00Z',
  },
  {
    id: 'user-agent-dawit',
    email: 'dawit.agent@sodobiz.et',
    full_name: 'Dawit Wolde (Youth Business Agent)',
    phone: '+251 94 456 7890',
    preferred_language: 'en',
    role: 'agent',
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-10-10T12:00:00Z',
  },
  {
    id: 'user-provider-omo',
    email: 'officer@omobank.et',
    full_name: 'Tsegaye Mengistu (Omo Bank Sodo Officer)',
    phone: '+251 46 551 2280',
    preferred_language: 'en',
    role: 'provider',
    organization_id: 'org-omo-bank',
    created_at: '2026-01-20T08:00:00Z',
    updated_at: '2026-10-12T14:00:00Z',
  },
  {
    id: 'user-admin',
    email: 'admin@sodobiz.et',
    full_name: 'SodoBiz System Administrator',
    phone: '+251 90 000 1234',
    preferred_language: 'en',
    role: 'admin',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-10-25T00:00:00Z',
  },
];

// Pre-seeded Businesses
export const SEED_BUSINESSES: Business[] = [
  {
    id: 'biz-almaz',
    owner_id: 'user-almaz',
    name: 'Asegedech Spice & Grain Mill',
    description: 'Retail trading of prepared berbere spices, shiro flour, teff grains, and custom electric spice grinding.',
    category_id: 'cat-agri',
    business_type: 'agriculture',
    location: 'Near Old Merkato Market, Kebele 02, Wolaita Sodo',
    operating_since: '2021',
    worker_count: 3,
    status: 'active',
    created_at: '2026-02-01T08:30:00Z',
    updated_at: '2026-10-20T10:00:00Z',
  },
  {
    id: 'biz-birtukan',
    owner_id: 'user-birtukan',
    name: 'Sodo Highlands Handwoven Crafts',
    description: 'Production and retail of authentic Wolaita traditional woven gabi, dresses, and woven straw baskets.',
    category_id: 'cat-crafts',
    business_type: 'crafts',
    location: 'Wadu Road Craft Market, Wolaita Sodo',
    operating_since: '2023',
    worker_count: 2,
    status: 'active',
    created_at: '2026-03-10T09:00:00Z',
    updated_at: '2026-10-18T10:00:00Z',
  },
  {
    id: 'biz-yohannes',
    owner_id: 'user-yohannes',
    name: 'Buna Desta Coffee & Snack Bar',
    description: 'Fresh roast Wolaita coffee, freshly squeezed juices, homemade pastries, and telebirr cash-in services.',
    category_id: 'cat-food',
    business_type: 'food_services',
    location: 'Around Sodo Stadium, Main Avenue, Wolaita Sodo',
    operating_since: '2024',
    worker_count: 2,
    status: 'active',
    created_at: '2026-04-05T08:30:00Z',
    updated_at: '2026-10-22T08:00:00Z',
  },
];

// Pre-seeded Products for Almaz's business
export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    business_id: 'biz-almaz',
    name: 'Prepared Berbere Spice (1 kg bag)',
    description: 'High-grade sun-dried chili blend seasoned with local organic garlic and ginger.',
    selling_price: 450,
    cost_price: 310,
    stock_quantity: 48,
    low_stock_threshold: 15,
    sku: 'SPICE-BER-01',
    is_active: true,
    created_at: '2026-02-10T09:00:00Z',
    updated_at: '2026-10-20T11:00:00Z',
  },
  {
    id: 'prod-2',
    business_id: 'biz-almaz',
    name: 'Shiro Chickpea Flour (1 kg bag)',
    description: 'Fine ground chickpea flour blended with cumin and cardamom.',
    selling_price: 260,
    cost_price: 180,
    stock_quantity: 65,
    low_stock_threshold: 20,
    sku: 'FLOUR-SHI-02',
    is_active: true,
    created_at: '2026-02-10T09:00:00Z',
    updated_at: '2026-10-20T11:00:00Z',
  },
  {
    id: 'prod-3',
    business_id: 'biz-almaz',
    name: 'Magna White Teff Grain (25 kg sack)',
    description: 'First quality white teff sourced directly from local contract farmers.',
    selling_price: 3600,
    cost_price: 2950,
    stock_quantity: 8,
    low_stock_threshold: 10,
    sku: 'GRAIN-TEF-25',
    is_active: true,
    created_at: '2026-02-12T09:00:00Z',
    updated_at: '2026-10-24T14:00:00Z',
  },
  {
    id: 'prod-4',
    business_id: 'biz-almaz',
    name: 'Korerima Cardamom Powder (250g jar)',
    description: 'Pure Ethiopian false cardamom ground and sealed.',
    selling_price: 380,
    cost_price: 240,
    stock_quantity: 4,
    low_stock_threshold: 8,
    sku: 'SPICE-KOR-250',
    is_active: true,
    created_at: '2026-03-01T09:00:00Z',
    updated_at: '2026-10-24T14:00:00Z',
  },
];

// Pre-seeded Transactions
export const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-01',
    business_id: 'biz-almaz',
    created_by: 'user-almaz',
    transaction_type: 'income',
    amount: 3600,
    currency: 'ETB',
    category: 'Sales - Grain',
    description: 'Sale of 1 sack of Magna White Teff to local restaurant',
    transaction_date: '2026-10-24',
    payment_method: 'telebirr',
    created_at: '2026-10-24T10:15:00Z',
    updated_at: '2026-10-24T10:15:00Z',
  },
  {
    id: 'tx-02',
    business_id: 'biz-almaz',
    created_by: 'user-almaz',
    transaction_type: 'income',
    amount: 1800,
    currency: 'ETB',
    category: 'Sales - Spices',
    description: '4 bags of prepared berbere spice to walk-in customers',
    transaction_date: '2026-10-24',
    payment_method: 'cash',
    created_at: '2026-10-24T16:30:00Z',
    updated_at: '2026-10-24T16:30:00Z',
  },
  {
    id: 'tx-03',
    business_id: 'biz-almaz',
    created_by: 'user-almaz',
    transaction_type: 'expense',
    amount: 450,
    currency: 'ETB',
    category: 'Packaging & Bags',
    description: '50 clear heavy plastic packaging pouches for spices',
    transaction_date: '2026-10-23',
    payment_method: 'cash',
    created_at: '2026-10-23T11:00:00Z',
    updated_at: '2026-10-23T11:00:00Z',
  },
  {
    id: 'tx-04',
    business_id: 'biz-almaz',
    created_by: 'user-almaz',
    transaction_type: 'income',
    amount: 2340,
    currency: 'ETB',
    category: 'Sales - Flour',
    description: '9 bags of Shiro chickpea flour for wedding party order',
    transaction_date: '2026-10-22',
    payment_method: 'telebirr',
    created_at: '2026-10-22T14:20:00Z',
    updated_at: '2026-10-22T14:20:00Z',
  },
  {
    id: 'tx-05',
    business_id: 'biz-almaz',
    created_by: 'user-almaz',
    transaction_type: 'expense',
    amount: 1200,
    currency: 'ETB',
    category: 'Transport & Freight',
    description: 'Motorcycle delivery of 3 quintals of raw chickpeas from farm gate',
    transaction_date: '2026-10-21',
    payment_method: 'telebirr',
    created_at: '2026-10-21T09:00:00Z',
    updated_at: '2026-10-21T09:00:00Z',
  },
  {
    id: 'tx-06',
    business_id: 'biz-almaz',
    created_by: 'user-almaz',
    transaction_type: 'income',
    amount: 4500,
    currency: 'ETB',
    category: 'Sales - Spices',
    description: 'Bulk order of berbere powder to Sodo University cafeteria catering',
    transaction_date: '2026-10-19',
    payment_method: 'bank_transfer',
    created_at: '2026-10-19T15:00:00Z',
    updated_at: '2026-10-19T15:00:00Z',
  },
  {
    id: 'tx-07',
    business_id: 'biz-almaz',
    created_by: 'user-almaz',
    transaction_type: 'expense',
    amount: 3200,
    currency: 'ETB',
    category: 'Rent & Premises',
    description: 'Monthly store rental for Kebele 02 kiosk space',
    transaction_date: '2026-10-15',
    payment_method: 'cbe_birr',
    created_at: '2026-10-15T09:30:00Z',
    updated_at: '2026-10-15T09:30:00Z',
  },
  {
    id: 'tx-08',
    business_id: 'biz-almaz',
    created_by: 'user-almaz',
    transaction_type: 'expense',
    amount: 850,
    currency: 'ETB',
    category: 'Machine Maintenance',
    description: 'Sharpened electric spice milling plates and replaced motor drive belt',
    transaction_date: '2026-10-08',
    payment_method: 'cash',
    created_at: '2026-10-08T12:00:00Z',
    updated_at: '2026-10-08T12:00:00Z',
  },
];

// Pre-seeded Readiness statuses for Almaz
export const SEED_BUSINESS_READINESS: BusinessReadiness[] = [
  { id: 'br-1', business_id: 'biz-almaz', readiness_item_id: 'read-1', status: 'completed', notes: 'Profile fully documented with location and worker count.', updated_by: 'user-almaz', updated_at: '2026-10-15T10:00:00Z' },
  { id: 'br-2', business_id: 'biz-almaz', readiness_item_id: 'read-2', status: 'completed', notes: 'Daily sales recorded consistently for over 3 weeks.', updated_by: 'user-almaz', updated_at: '2026-10-24T10:00:00Z' },
  { id: 'br-3', business_id: 'biz-almaz', readiness_item_id: 'read-3', status: 'completed', notes: 'Restock, transport, and rent expenses separated and logged.', updated_by: 'user-almaz', updated_at: '2026-10-23T11:00:00Z' },
  { id: 'br-4', business_id: 'biz-almaz', readiness_item_id: 'read-4', status: 'completed', notes: '4 primary products cataloged with SKU and stock levels.', updated_by: 'user-almaz', updated_at: '2026-10-20T10:00:00Z' },
  { id: 'br-5', business_id: 'biz-almaz', readiness_item_id: 'read-5', status: 'completed', notes: 'Monthly operating result shows steady positive surplus.', updated_by: 'user-almaz', updated_at: '2026-10-24T10:00:00Z' },
  { id: 'br-6', business_id: 'biz-almaz', readiness_item_id: 'read-6', status: 'in_progress', notes: 'Kebele license renewal filed at trade bureau, pending final seal.', updated_by: 'user-almaz', updated_at: '2026-10-18T10:00:00Z' },
  { id: 'br-7', business_id: 'biz-almaz', readiness_item_id: 'read-7', status: 'completed', notes: 'Dedicated telebirr merchant number used solely for store income.', updated_by: 'user-almaz', updated_at: '2026-10-15T10:00:00Z' },
  { id: 'br-8', business_id: 'biz-almaz', readiness_item_id: 'read-8', status: 'completed', notes: 'Goal to purchase a second high-efficiency milling machine by 2027.', updated_by: 'user-almaz', updated_at: '2026-10-15T10:00:00Z' },
  { id: 'br-9', business_id: 'biz-almaz', readiness_item_id: 'read-9', status: 'in_progress', notes: 'Reviewed Omo Bank micro loan requirements with Agent Dawit.', updated_by: 'user-agent-dawit', updated_at: '2026-10-22T14:00:00Z' },
];

export const SEED_REFERRALS: Referral[] = [
  {
    id: 'ref-01',
    business_id: 'biz-almaz',
    owner_id: 'user-almaz',
    provider_id: 'prov-omo',
    service_id: 'srv-omo-micro',
    status: 'in_review',
    consent_given_at: '2026-10-20T14:30:00Z',
    consent_scope: ['business_profile', 'monthly_revenue_summary', 'readiness_checklist'],
    notes: 'Submitted for 50,000 ETB working capital for harvest season teff procurement.',
    created_at: '2026-10-20T14:30:00Z',
    updated_at: '2026-10-22T09:15:00Z',
  },
];

export const SEED_ASSIGNMENTS: SupportAssignment[] = [
  {
    id: 'asg-01',
    business_id: 'biz-almaz',
    agent_id: 'user-agent-dawit',
    assigned_by: 'user-admin',
    status: 'active',
    created_at: '2026-09-01T10:00:00Z',
    updated_at: '2026-09-01T10:00:00Z',
  },
];

export const SEED_SESSIONS: SupportSession[] = [
  {
    id: 'ses-01',
    assignment_id: 'asg-01',
    session_date: '2026-10-22',
    topic: 'Omo Bank Loan Preparation & Readiness Profile Review',
    outcome: 'Completed readiness review, identified pending Kebele license renewal, prepared monthly sales summary printout.',
    entrepreneur_visible_notes: 'Reviewed readiness checklist together. Verified that daily recording is in order. Next step is obtaining the Kebele trade certificate stamp.',
    internal_notes: 'Entrepreneur maintains excellent cash discipline. Strong candidate for working capital credit once Kebele permit is stamped.',
    created_by: 'user-agent-dawit',
    created_at: '2026-10-22T15:00:00Z',
  },
];

export const SEED_SUPPORT_REQUESTS: SupportRequest[] = [
  {
    id: 'req-01',
    user_id: 'user-almaz',
    subject: 'Guidance on printing readiness report for bank loan officer',
    description: 'How can I print my official business readiness profile to present at Omo Bank Piazza branch?',
    status: 'resolved',
    created_at: '2026-10-21T09:00:00Z',
    updated_at: '2026-10-21T14:00:00Z',
  },
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-01',
    actor_id: 'user-admin',
    actor_name: 'SodoBiz System Administrator',
    action: 'APPROVE_PROVIDER',
    target_type: 'provider',
    target_id: 'prov-omo',
    metadata: { org_name: 'Omo Bank S.C.', license_verified: true },
    created_at: '2026-09-15T12:00:00Z',
  },
  {
    id: 'log-02',
    actor_id: 'user-admin',
    actor_name: 'SodoBiz System Administrator',
    action: 'ASSIGN_SUPPORT_AGENT',
    target_type: 'business',
    target_id: 'biz-almaz',
    metadata: { agent_id: 'user-agent-dawit', business_name: 'Asegedech Spice & Grain Mill' },
    created_at: '2026-09-01T10:00:00Z',
  },
  {
    id: 'log-03',
    actor_id: 'user-almaz',
    actor_name: 'Almaz Tekle Haile',
    action: 'GRANT_REFERRAL_CONSENT',
    target_type: 'referral',
    target_id: 'ref-01',
    metadata: { recipient_provider: 'Omo Bank S.C.', scope: ['business_profile', 'monthly_revenue_summary'] },
    created_at: '2026-10-20T14:30:00Z',
  },
];

// LOCAL DATABASE STORAGE ENGINE KEYS
const STORAGE_KEYS = {
  USERS: 'sodobiz_users',
  BUSINESSES: 'sodobiz_businesses',
  PRODUCTS: 'sodobiz_products',
  TRANSACTIONS: 'sodobiz_transactions',
  READINESS: 'sodobiz_readiness',
  REFERRALS: 'sodobiz_referrals',
  ASSIGNMENTS: 'sodobiz_assignments',
  SESSIONS: 'sodobiz_sessions',
  REQUESTS: 'sodobiz_requests',
  AUDIT_LOGS: 'sodobiz_audit_logs',
  PROVIDERS: 'sodobiz_providers',
  SERVICES: 'sodobiz_services',
  LESSONS_PROGRESS: 'sodobiz_lessons_progress',
  CURRENT_USER_ID: 'sodobiz_current_user_id',
  ORGANIZATIONS: 'sodobiz_organizations',
  OPPORTUNITIES: 'sodobiz_opportunities',
  APPLICATIONS: 'sodobiz_applications',
  SAVED_OPPORTUNITIES: 'sodobiz_saved_opportunities',
  COMMITMENTS: 'sodobiz_commitments',
  FINANCE_PRODUCTS: 'sodobiz_finance_products',
  SAVED_FINANCE: 'sodobiz_saved_finance',
  FINANCE_INQUIRIES: 'sodobiz_finance_inquiries',
  FINANCE_READINESS: 'sodobiz_finance_readiness',
  BUSINESS_PLANS: 'sodobiz_business_plans',
  BUSINESS_NEEDS: 'sodobiz_business_needs',
  BUSINESS_PROGRAMS: 'sodobiz_business_programs',
  MENTORS: 'sodobiz_mentors',
  MENTORSHIP_REQUESTS: 'sodobiz_mentorship_requests',
  SUPPORT_SERVICES: 'sodobiz_support_services',
  TRAINING_COURSES: 'sodobiz_training_courses',
  TRAINING_ENROLLMENTS: 'sodobiz_training_enrollments',
  NOTIFICATIONS: 'sodobiz_notifications',
  USER_DOCUMENTS: 'sodobiz_user_documents',
};

class LocalDB {
  private memStore: Record<string, string> = {};

  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private load<T>(key: string, defaultData: T): T {
    try {
      if (this.isLocalStorageAvailable()) {
        const item = window.localStorage.getItem(key);
        if (!item) {
          window.localStorage.setItem(key, JSON.stringify(defaultData));
          return defaultData;
        }
        return JSON.parse(item) as T;
      } else {
        if (!this.memStore[key]) {
          this.memStore[key] = JSON.stringify(defaultData);
          return defaultData;
        }
        return JSON.parse(this.memStore[key]) as T;
      }
    } catch {
      return defaultData;
    }
  }

  private save<T>(key: string, data: T): void {
    try {
      if (this.isLocalStorageAvailable()) {
        window.localStorage.setItem(key, JSON.stringify(data));
      } else {
        this.memStore[key] = JSON.stringify(data);
      }
    } catch (e) {
      // safe fallback
    }
  }

  // --- CURRENT USER / SESSION MANAGEMENT ---
  getCurrentUser(): UserProfile {
    let currentId = 'user-almaz';
    if (this.isLocalStorageAvailable()) {
      currentId = window.localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user-almaz';
    } else {
      currentId = this.memStore[STORAGE_KEYS.CURRENT_USER_ID] || 'user-almaz';
    }
    const users = this.getUsers();
    const user = users.find((u) => u.id === currentId);
    return user || SEED_USERS[0];
  }

  setCurrentUser(userId: string): UserProfile {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      if (this.isLocalStorageAvailable()) {
        window.localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
      } else {
        this.memStore[STORAGE_KEYS.CURRENT_USER_ID] = userId;
      }
      return user;
    }
    return this.getCurrentUser();
  }

  // --- NOTIFICATIONS SYSTEM ---
  getNotifications(userId: string): AppNotification[] {
    const all = this.load<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    return all.filter((n) => n.user_id === userId);
  }

  createNotification(notif: Omit<AppNotification, 'id' | 'created_at'>): AppNotification {
    const all = this.load<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    const newNotif: AppNotification = {
      ...notif,
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      created_at: new Date().toISOString(),
    };
    all.unshift(newNotif);
    this.save(STORAGE_KEYS.NOTIFICATIONS, all);
    return newNotif;
  }

  markNotificationRead(id: string): void {
    const all = this.load<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    const idx = all.findIndex((n) => n.id === id);
    if (idx !== -1) {
      all[idx].is_read = true;
      this.save(STORAGE_KEYS.NOTIFICATIONS, all);
    }
  }

  markAllNotificationsRead(userId: string): void {
    const all = this.load<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    let changed = false;
    all.forEach((n) => {
      if (n.user_id === userId && !n.is_read) {
        n.is_read = true;
        changed = true;
      }
    });
    if (changed) {
      this.save(STORAGE_KEYS.NOTIFICATIONS, all);
    }
  }

  // --- USER DOCUMENTS / CV MANAGEMENT ---
  getUserDocuments(userId: string): UserDocument[] {
    const all = this.load<UserDocument[]>(STORAGE_KEYS.USER_DOCUMENTS, [
      { id: 'doc-1', user_id: 'user-youth-bekele', title: 'Curriculum Vitae (CV)', type: 'cv', file_name: 'bekele_abera_cv.pdf', file_size: '245 KB', uploaded_at: '2026-10-20T10:00:00Z' },
      { id: 'doc-2', user_id: 'user-youth-bekele', title: 'TVET Level 2 Certificate in ICT', type: 'certificate', file_name: 'bekele_tvet_level2_cert.pdf', file_size: '512 KB', uploaded_at: '2026-10-20T10:05:00Z' },
      { id: 'doc-3', user_id: 'user-youth-bekele', title: 'Kebele Resident Identity Card', type: 'id_card', file_name: 'kebele_id_bekele.pdf', file_size: '180 KB', uploaded_at: '2026-10-20T10:10:00Z' }
    ]);
    return all.filter((d) => d.user_id === userId);
  }

  addUserDocument(doc: Omit<UserDocument, 'id' | 'uploaded_at'>): UserDocument {
    const all = this.load<UserDocument[]>(STORAGE_KEYS.USER_DOCUMENTS, []);
    const newDoc: UserDocument = {
      ...doc,
      id: 'doc-' + Date.now(),
      uploaded_at: new Date().toISOString(),
    };
    all.unshift(newDoc);
    this.save(STORAGE_KEYS.USER_DOCUMENTS, all);

    // If CV, also update user profile cv_filename
    if (doc.type === 'cv') {
      this.updateUser(doc.user_id, {
        cv_filename: doc.file_name,
        cv_uploaded_at: new Date().toISOString(),
      });
    }

    return newDoc;
  }

  deleteUserDocument(docId: string, userId: string): boolean {
    const all = this.load<UserDocument[]>(STORAGE_KEYS.USER_DOCUMENTS, []);
    const filtered = all.filter((d) => !(d.id === docId && d.user_id === userId));
    if (filtered.length === all.length) return false;
    this.save(STORAGE_KEYS.USER_DOCUMENTS, filtered);
    return true;
  }

  // --- USERS ---
  getUsers(): UserProfile[] {
    return this.load<UserProfile[]>(STORAGE_KEYS.USERS, SEED_USERS);
  }

  createUser(profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): UserProfile {
    const users = this.getUsers();
    const newUser: UserProfile = {
      ...profile,
      id: 'user-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    users.push(newUser);
    this.save(STORAGE_KEYS.USERS, users);
    this.logAudit(newUser.id, newUser.full_name, 'USER_REGISTERED', 'user', newUser.id, { role: newUser.role });

    // Send welcome notification
    this.createNotification({
      user_id: newUser.id,
      title: 'Welcome to SodoBiz Bridge',
      message: `Your ${newUser.role} account has been created. Explore available opportunities, readiness tools, and local partnerships in Wolaita Sodo.`,
      type: 'system',
      link_url: newUser.role === 'youth' ? '/youth/profile' : '/dashboard',
      is_read: false,
    });

    return newUser;
  }

  updateUser(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates, updated_at: new Date().toISOString() };
    this.save(STORAGE_KEYS.USERS, users);
    return users[idx];
  }

  deleteUser(id: string, adminId: string = 'admin'): boolean {
    const users = this.getUsers();
    const filtered = users.filter((u) => u.id !== id);
    if (filtered.length === users.length) return false;
    this.save(STORAGE_KEYS.USERS, filtered);
    this.logAudit(adminId, 'Administrator', 'DELETE_USER', 'user', id);
    return true;
  }

  // --- BUSINESSES ---
  getBusinesses(): Business[] {
    return this.load<Business[]>(STORAGE_KEYS.BUSINESSES, SEED_BUSINESSES);
  }

  getBusinessForUser(userId: string): Business | null {
    const businesses = this.getBusinesses();
    return businesses.find((b) => b.owner_id === userId) || null;
  }

  getBusinessById(businessId: string): Business | null {
    const businesses = this.getBusinesses();
    return businesses.find((b) => b.id === businessId) || null;
  }

  createBusiness(biz: Omit<Business, 'id' | 'created_at' | 'updated_at'>): Business {
    const businesses = this.getBusinesses();
    const newBiz: Business = {
      ...biz,
      id: 'biz-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    businesses.push(newBiz);
    this.save(STORAGE_KEYS.BUSINESSES, businesses);

    // Initialize business readiness items
    const allReadiness = this.getBusinessReadiness();
    INITIAL_READINESS_ITEMS.forEach((item, index) => {
      allReadiness.push({
        id: `br-${newBiz.id}-${index}`,
        business_id: newBiz.id,
        readiness_item_id: item.id,
        status: index === 0 ? 'completed' : 'not_started',
        notes: index === 0 ? 'Business profile completed on registration.' : undefined,
        updated_by: biz.owner_id,
        updated_at: new Date().toISOString(),
      });
    });
    this.save(STORAGE_KEYS.READINESS, allReadiness);

    this.logAudit(biz.owner_id, 'Entrepreneur', 'CREATE_BUSINESS', 'business', newBiz.id, { name: newBiz.name });
    return newBiz;
  }

  updateBusiness(id: string, updates: Partial<Business>, actorId: string): Business | null {
    const businesses = this.getBusinesses();
    const idx = businesses.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    businesses[idx] = { ...businesses[idx], ...updates, updated_at: new Date().toISOString() };
    this.save(STORAGE_KEYS.BUSINESSES, businesses);
    this.logAudit(actorId, 'User', 'UPDATE_BUSINESS', 'business', id, updates);
    return businesses[idx];
  }

  // --- TRANSACTIONS ---
  getTransactions(businessId?: string): Transaction[] {
    const txs = this.load<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, SEED_TRANSACTIONS);
    if (businessId) {
      return txs.filter((t) => t.business_id === businessId);
    }
    return txs;
  }

  createTransaction(tx: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Transaction {
    if (tx.amount <= 0) {
      throw new Error('Transaction amount must be strictly positive');
    }
    const txs = this.getTransactions();
    const newTx: Transaction = {
      ...tx,
      id: 'tx-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    txs.unshift(newTx);
    this.save(STORAGE_KEYS.TRANSACTIONS, txs);
    return newTx;
  }

  updateTransaction(id: string, updates: Partial<Transaction>, businessId: string): Transaction | null {
    if (updates.amount !== undefined && updates.amount <= 0) {
      throw new Error('Transaction amount must be strictly positive');
    }
    const txs = this.getTransactions();
    const idx = txs.findIndex((t) => t.id === id && t.business_id === businessId);
    if (idx === -1) return null;
    txs[idx] = { ...txs[idx], ...updates, updated_at: new Date().toISOString() };
    this.save(STORAGE_KEYS.TRANSACTIONS, txs);
    return txs[idx];
  }

  deleteTransaction(id: string, businessId: string): boolean {
    const txs = this.getTransactions();
    const filtered = txs.filter((t) => !(t.id === id && t.business_id === businessId));
    if (filtered.length === txs.length) return false;
    this.save(STORAGE_KEYS.TRANSACTIONS, filtered);
    return true;
  }

  // --- PRODUCTS ---
  getProducts(businessId?: string): Product[] {
    const prods = this.load<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    if (businessId) {
      return prods.filter((p) => p.business_id === businessId);
    }
    return prods;
  }

  createProduct(prod: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
    if (prod.selling_price < 0 || prod.stock_quantity < 0) {
      throw new Error('Prices and stock quantity cannot be negative');
    }
    const prods = this.getProducts();
    const newProd: Product = {
      ...prod,
      id: 'prod-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    prods.unshift(newProd);
    this.save(STORAGE_KEYS.PRODUCTS, prods);
    return newProd;
  }

  updateProduct(id: string, updates: Partial<Product>, businessId: string): Product | null {
    const prods = this.getProducts();
    const idx = prods.findIndex((p) => p.id === id && p.business_id === businessId);
    if (idx === -1) return null;
    prods[idx] = { ...prods[idx], ...updates, updated_at: new Date().toISOString() };
    this.save(STORAGE_KEYS.PRODUCTS, prods);
    return prods[idx];
  }

  deleteProduct(id: string, businessId: string): boolean {
    const prods = this.getProducts();
    const filtered = prods.filter((p) => !(p.id === id && p.business_id === businessId));
    if (filtered.length === prods.length) return false;
    this.save(STORAGE_KEYS.PRODUCTS, filtered);
    return true;
  }

  // --- BUSINESS READINESS ---
  getBusinessReadiness(businessId?: string): BusinessReadiness[] {
    const all = this.load<BusinessReadiness[]>(STORAGE_KEYS.READINESS, SEED_BUSINESS_READINESS);
    if (businessId) {
      return all.filter((r) => r.business_id === businessId);
    }
    return all;
  }

  updateReadinessItem(
    businessId: string,
    readinessItemId: string,
    status: BusinessReadiness['status'],
    notes: string,
    updatedBy: string
  ): BusinessReadiness {
    const all = this.getBusinessReadiness();
    const idx = all.findIndex((r) => r.business_id === businessId && r.readiness_item_id === readinessItemId);
    const updated: BusinessReadiness = {
      id: idx >= 0 ? all[idx].id : `br-${Date.now()}`,
      business_id: businessId,
      readiness_item_id: readinessItemId,
      status,
      notes,
      updated_by: updatedBy,
      updated_at: new Date().toISOString(),
    };
    if (idx >= 0) {
      all[idx] = updated;
    } else {
      all.push(updated);
    }
    this.save(STORAGE_KEYS.READINESS, all);
    return updated;
  }

  // --- PROVIDERS & SERVICES ---
  getProviders(): Provider[] {
    return this.load<Provider[]>(STORAGE_KEYS.PROVIDERS, INITIAL_PROVIDERS);
  }

  getProviderBySlug(slug: string): Provider | null {
    return this.getProviders().find((p) => p.slug === slug) || null;
  }

  createProvider(prov: Omit<Provider, 'id' | 'created_at' | 'updated_at'>): Provider {
    const providers = this.getProviders();
    const newProv: Provider = {
      ...prov,
      id: 'prov-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    providers.push(newProv);
    this.save(STORAGE_KEYS.PROVIDERS, providers);
    return newProv;
  }

  getServices(providerId?: string): ProviderService[] {
    const services = this.load<ProviderService[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    if (providerId) {
      return services.filter((s) => s.provider_id === providerId);
    }
    return services;
  }

  createService(service: Omit<ProviderService, 'id'>): ProviderService {
    const services = this.getServices();
    const newService: ProviderService = {
      ...service,
      id: 'srv-' + Date.now(),
    };
    services.push(newService);
    this.save(STORAGE_KEYS.SERVICES, services);
    return newService;
  }

  updateProviderVerification(id: string, status: Provider['verification_status'], adminId: string): Provider | null {
    const providers = this.getProviders();
    const idx = providers.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    providers[idx] = {
      ...providers[idx],
      verification_status: status,
      approved_by: status === 'verified' ? adminId : undefined,
      approved_at: status === 'verified' ? new Date().toISOString() : undefined,
      updated_at: new Date().toISOString(),
    };
    this.save(STORAGE_KEYS.PROVIDERS, providers);
    this.logAudit(adminId, 'Administrator', `UPDATE_PROVIDER_${status.toUpperCase()}`, 'provider', id);
    return providers[idx];
  }

  // --- REFERRALS ---
  getReferrals(filters?: { ownerId?: string; providerId?: string }): Referral[] {
    const all = this.load<Referral[]>(STORAGE_KEYS.REFERRALS, SEED_REFERRALS);
    if (filters?.ownerId) {
      return all.filter((r) => r.owner_id === filters.ownerId);
    }
    if (filters?.providerId) {
      return all.filter((r) => r.provider_id === filters.providerId);
    }
    return all;
  }

  createReferral(referral: Omit<Referral, 'id' | 'created_at' | 'updated_at'>): Referral {
    const referrals = this.getReferrals();
    const newRef: Referral = {
      ...referral,
      id: 'ref-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    referrals.unshift(newRef);
    this.save(STORAGE_KEYS.REFERRALS, referrals);
    this.logAudit(referral.owner_id, 'Entrepreneur', 'SUBMIT_REFERRAL_CONSENT', 'referral', newRef.id, {
      provider_id: referral.provider_id,
      consent_scope: referral.consent_scope,
    });

    // Notify provider
    const providerUsers = this.getUsers().filter((u) => u.role === 'provider');
    providerUsers.forEach((pu) => {
      this.createNotification({
        user_id: pu.id,
        title: 'New Client Referral Submitted',
        message: 'A micro-enterprise has submitted a consented dossier for working capital review.',
        type: 'referral',
        link_url: '/provider/referrals',
        is_read: false,
      });
    });

    return newRef;
  }

  updateReferralStatus(id: string, status: Referral['status'], actorId: string, notes?: string): Referral | null {
    const referrals = this.getReferrals();
    const idx = referrals.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    referrals[idx] = {
      ...referrals[idx],
      status,
      notes: notes !== undefined ? notes : referrals[idx].notes,
      withdrawn_at: status === 'withdrawn' ? new Date().toISOString() : referrals[idx].withdrawn_at,
      updated_at: new Date().toISOString(),
    };
    this.save(STORAGE_KEYS.REFERRALS, referrals);
    this.logAudit(actorId, 'User', `UPDATE_REFERRAL_${status.toUpperCase()}`, 'referral', id);

    // Notify entrepreneur
    this.createNotification({
      user_id: referrals[idx].owner_id,
      title: `Referral Status: ${status.replace('_', ' ').toUpperCase()}`,
      message: `Your referral application status has been updated to "${status.replace('_', ' ')}". ${notes || ''}`,
      type: 'referral',
      link_url: '/dashboard/referrals',
      is_read: false,
    });

    return referrals[idx];
  }

  // --- AGENT SUPPORT ASSIGNMENTS & SESSIONS ---
  getAssignments(agentId?: string): SupportAssignment[] {
    const all = this.load<SupportAssignment[]>(STORAGE_KEYS.ASSIGNMENTS, SEED_ASSIGNMENTS);
    if (agentId) {
      return all.filter((a) => a.agent_id === agentId);
    }
    return all;
  }

  assignAgent(businessId: string, agentId: string, adminId: string): SupportAssignment {
    const assignments = this.getAssignments();
    const newAsg: SupportAssignment = {
      id: 'asg-' + Date.now(),
      business_id: businessId,
      agent_id: agentId,
      assigned_by: adminId,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    assignments.push(newAsg);
    this.save(STORAGE_KEYS.ASSIGNMENTS, assignments);
    this.logAudit(adminId, 'Administrator', 'ASSIGN_AGENT', 'business', businessId, { agent_id: agentId });
    return newAsg;
  }

  getSupportSessions(assignmentId?: string): SupportSession[] {
    const all = this.load<SupportSession[]>(STORAGE_KEYS.SESSIONS, SEED_SESSIONS);
    if (assignmentId) {
      return all.filter((s) => s.assignment_id === assignmentId);
    }
    return all;
  }

  createSupportSession(session: Omit<SupportSession, 'id' | 'created_at'>): SupportSession {
    const sessions = this.getSupportSessions();
    const newSession: SupportSession = {
      ...session,
      id: 'ses-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    sessions.unshift(newSession);
    this.save(STORAGE_KEYS.SESSIONS, sessions);
    return newSession;
  }

  // --- SUPPORT REQUESTS ---
  getSupportRequests(userId?: string): SupportRequest[] {
    const all = this.load<SupportRequest[]>(STORAGE_KEYS.REQUESTS, SEED_SUPPORT_REQUESTS);
    if (userId) {
      return all.filter((r) => r.user_id === userId);
    }
    return all;
  }

  createSupportRequest(req: Omit<SupportRequest, 'id' | 'created_at' | 'updated_at'>): SupportRequest {
    const all = this.getSupportRequests();
    const newReq: SupportRequest = {
      ...req,
      id: 'req-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    all.unshift(newReq);
    this.save(STORAGE_KEYS.REQUESTS, all);
    return newReq;
  }

  updateSupportRequestStatus(id: string, status: SupportRequest['status'], adminId: string): SupportRequest | null {
    const all = this.getSupportRequests();
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], status, updated_at: new Date().toISOString() };
    this.save(STORAGE_KEYS.REQUESTS, all);
    this.logAudit(adminId, 'Administrator', `UPDATE_SUPPORT_STATUS_${status.toUpperCase()}`, 'support_request', id);
    return all[idx];
  }

  // --- LEARNING LESSONS ---
  getLessons(): LearningLesson[] {
    return INITIAL_LESSONS;
  }

  getLessonProgress(userId: string): LessonProgress[] {
    const all = this.load<LessonProgress[]>(STORAGE_KEYS.LESSONS_PROGRESS, [
      { id: 'lp-1', user_id: 'user-almaz', lesson_id: 'les-1', status: 'completed', quiz_score: 100, completed_at: '2026-10-15T10:00:00Z' },
      { id: 'lp-2', user_id: 'user-almaz', lesson_id: 'les-2', status: 'completed', quiz_score: 100, completed_at: '2026-10-18T14:00:00Z' },
      { id: 'lp-3', user_id: 'user-almaz', lesson_id: 'les-3', status: 'completed', quiz_score: 100, completed_at: '2026-10-21T11:00:00Z' },
    ]);
    return all.filter((p) => p.user_id === userId);
  }

  saveLessonProgress(userId: string, lessonId: string, status: LessonProgress['status'], score?: number): LessonProgress {
    const all = this.load<LessonProgress[]>(STORAGE_KEYS.LESSONS_PROGRESS, []);
    const idx = all.findIndex((p) => p.user_id === userId && p.lesson_id === lessonId);
    const updated: LessonProgress = {
      id: idx >= 0 ? all[idx].id : `lp-${Date.now()}`,
      user_id: userId,
      lesson_id: lessonId,
      status,
      quiz_score: score,
      completed_at: status === 'completed' ? new Date().toISOString() : undefined,
    };
    if (idx >= 0) {
      all[idx] = updated;
    } else {
      all.push(updated);
    }
    this.save(STORAGE_KEYS.LESSONS_PROGRESS, all);
    return updated;
  }

  // --- AUDIT LOGS ---
  getAuditLogs(): AuditLog[] {
    return this.load<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
  }

  private logAudit(
    actorId: string,
    actorName: string,
    action: string,
    targetType: string,
    targetId: string,
    metadata?: Record<string, any>
  ): void {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: 'log-' + Date.now(),
      actor_id: actorId,
      actor_name: actorName,
      action,
      target_type: targetType,
      target_id: targetId,
      metadata,
      created_at: new Date().toISOString(),
    });
    this.save(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 100));
  }

  // --- OPPORTUNITIES HUB ---
  getOpportunities(filters?: { type?: string; category?: string; query?: string; status?: string; organizationId?: string }): Opportunity[] {
    const opps = this.load<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, SEED_OPPORTUNITIES);
    return opps.filter((o) => {
      if (filters?.status) {
        if (filters.status !== 'all' && o.status !== filters.status) return false;
      } else {
        if (o.status !== 'published') return false;
      }
      if (filters?.organizationId && o.organization_id !== filters.organizationId) return false;
      if (filters?.type && filters.type !== 'all' && o.type !== filters.type) return false;
      if (filters?.category && filters.category !== 'all' && o.category !== filters.category) return false;
      if (filters?.query) {
        const q = filters.query.toLowerCase();
        const matches = o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q) || o.location.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }

  getOpportunityById(id: string): Opportunity | null {
    const opps = this.load<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, SEED_OPPORTUNITIES);
    return opps.find((o) => o.id === id) || null;
  }

  getOpportunitiesByOrganization(orgId: string): Opportunity[] {
    const opps = this.load<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, SEED_OPPORTUNITIES);
    return opps.filter((o) => o.organization_id === orgId);
  }

  getOpportunitiesByCreator(creatorId: string): Opportunity[] {
    const opps = this.load<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, SEED_OPPORTUNITIES);
    return opps.filter((o) => o.created_by === creatorId);
  }

  createOpportunity(data: any, actorId: string = 'admin'): Opportunity {
    const opps = this.load<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, SEED_OPPORTUNITIES);
    const newOpp: Opportunity = {
      category: data.category || 'Vocational Placement',
      responsibilities: data.responsibilities || [],
      eligibility_criteria: data.eligibility_criteria || [],
      required_skills: data.required_skills || [],
      open_positions: data.spots_available || data.open_positions || 1,
      spots_available: data.spots_available || data.open_positions || 1,
      deadline: data.deadline || '2026-12-31',
      status: data.status || 'published',
      location: data.location || 'Wolaita Sodo',
      workplace_type: data.workplace_type || 'on_site',
      ...data,
      id: 'opp-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    opps.unshift(newOpp);
    this.save(STORAGE_KEYS.OPPORTUNITIES, opps);
    this.logAudit(actorId, 'Employer', 'CREATE_OPPORTUNITY', 'opportunity', newOpp.id, { title: newOpp.title });
    return newOpp;
  }

  updateOpportunity(id: string, updates: Partial<Opportunity>, actorId: string = 'admin'): Opportunity | null {
    const opps = this.load<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, SEED_OPPORTUNITIES);
    const idx = opps.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    opps[idx] = { ...opps[idx], ...updates, updated_at: new Date().toISOString() };
    this.save(STORAGE_KEYS.OPPORTUNITIES, opps);
    this.logAudit(actorId, 'Employer', 'UPDATE_OPPORTUNITY', 'opportunity', id, updates);
    return opps[idx];
  }

  deleteOpportunity(id: string, actorId: string = 'admin'): boolean {
    const opps = this.load<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, SEED_OPPORTUNITIES);
    const filtered = opps.filter((o) => o.id !== id);
    if (filtered.length === opps.length) return false;
    this.save(STORAGE_KEYS.OPPORTUNITIES, filtered);
    this.logAudit(actorId, 'Employer', 'DELETE_OPPORTUNITY', 'opportunity', id);
    return true;
  }

  // --- APPLICATIONS ---
  getApplications(filters?: string | { applicantId?: string; opportunityId?: string; userId?: string }): OpportunityApplication[] {
    const apps = this.load<OpportunityApplication[]>(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
    if (!filters) return apps;
    if (typeof filters === 'string') {
      return apps.filter((a) => a.applicant_id === filters || (a as any).user_id === filters);
    }
    return apps.filter((a) => {
      const applicantId = filters.applicantId || filters.userId;
      if (applicantId && a.applicant_id !== applicantId && (a as any).user_id !== applicantId) return false;
      if (filters.opportunityId && a.opportunity_id !== filters.opportunityId) return false;
      return true;
    });
  }

  getApplicationById(id: string): OpportunityApplication | null {
    const apps = this.load<OpportunityApplication[]>(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
    return apps.find((a) => a.id === id) || null;
  }

  submitApplication(data: any): OpportunityApplication {
    const apps = this.load<OpportunityApplication[]>(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
    const applicantId = data.applicant_id || data.user_id;
    // Duplicate check
    const existing = apps.find(
      (a) => a.opportunity_id === data.opportunity_id &&
             (a.applicant_id === applicantId || (a as any).user_id === applicantId) &&
             a.status !== 'withdrawn'
    );
    if (existing) {
      throw new Error('You have already submitted an active application for this opportunity.');
    }
    const newApp: OpportunityApplication = {
      id: 'app-' + Date.now(),
      opportunity_id: data.opportunity_id,
      applicant_id: applicantId,
      status: data.status || 'submitted',
      cover_note: data.cover_note || data.motivation_statement || '',
      resume_summary: data.resume_summary || (Array.isArray(data.relevant_skills) ? data.relevant_skills.join(', ') : ''),
      employer_feedback: data.employer_feedback,
      interview_date: data.interview_date,
      cv_filename: data.cv_filename,
      applied_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    };
    apps.unshift(newApp);
    this.save(STORAGE_KEYS.APPLICATIONS, apps);
    this.logAudit(applicantId, 'Youth', 'SUBMIT_APPLICATION', 'application', newApp.id, { opportunity_id: data.opportunity_id });

    // Notify employers & admins
    const opp = this.getOpportunityById(data.opportunity_id);
    const employerUsers = this.getUsers().filter((u) => u.role === 'employer' || u.role === 'admin');
    employerUsers.forEach((emp) => {
      this.createNotification({
        user_id: emp.id,
        title: 'New Application Received',
        message: `A candidate submitted an application for "${opp?.title || 'an opportunity'}".`,
        type: 'application',
        link_url: '/employer/dashboard',
        is_read: false,
      });
    });

    return newApp;
  }

  updateApplicationStatus(
    id: string,
    status: OpportunityApplication['status'],
    feedbackOrActor?: string,
    maybeInterviewDate?: string,
    extraFeedback?: string
  ): OpportunityApplication | null {
    const apps = this.load<OpportunityApplication[]>(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
    const idx = apps.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    let employerFeedback = apps[idx].employer_feedback;
    let interviewDate = apps[idx].interview_date;

    if (feedbackOrActor && (feedbackOrActor.startsWith('user-') || feedbackOrActor === 'admin' || feedbackOrActor === 'employer')) {
      if (maybeInterviewDate) employerFeedback = maybeInterviewDate;
      if (extraFeedback) interviewDate = extraFeedback;
    } else {
      if (feedbackOrActor) employerFeedback = feedbackOrActor;
      if (maybeInterviewDate) interviewDate = maybeInterviewDate;
    }

    apps[idx] = {
      ...apps[idx],
      status,
      employer_feedback: employerFeedback,
      reviewer_notes: employerFeedback,
      interview_date: interviewDate,
      updated_at: new Date().toISOString(),
    };
    this.save(STORAGE_KEYS.APPLICATIONS, apps);

    // Send notification to applicant
    const opp = this.getOpportunityById(apps[idx].opportunity_id);
    this.createNotification({
      user_id: apps[idx].applicant_id,
      title: `Application ${status.replace('_', ' ').toUpperCase()}`,
      message: `Your application for "${opp?.title || 'the opportunity'}" has been updated to "${status.replace('_', ' ')}". ${employerFeedback || ''}`,
      type: 'application',
      link_url: '/youth/applications',
      is_read: false,
    });

    return apps[idx];
  }

  withdrawApplication(id: string, userId: string): OpportunityApplication | null {
    const apps = this.load<OpportunityApplication[]>(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
    const idx = apps.findIndex((a) => a.id === id && (a.applicant_id === userId || (a as any).user_id === userId));
    if (idx === -1) return null;
    apps[idx] = {
      ...apps[idx],
      status: 'withdrawn',
      withdrawn_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.save(STORAGE_KEYS.APPLICATIONS, apps);
    return apps[idx];
  }

  // --- SAVED OPPORTUNITIES ---
  getSavedOpportunities(userId: string): SavedOpportunity[] {
    const saved = this.load<SavedOpportunity[]>(STORAGE_KEYS.SAVED_OPPORTUNITIES, []);
    return saved.filter((s) => s.user_id === userId);
  }

  toggleSaveOpportunity(userId: string, opportunityId: string): boolean {
    const saved = this.load<SavedOpportunity[]>(STORAGE_KEYS.SAVED_OPPORTUNITIES, []);
    const idx = saved.findIndex((s) => s.user_id === userId && s.opportunity_id === opportunityId);
    let isSaved = false;
    if (idx >= 0) {
      saved.splice(idx, 1);
      isSaved = false;
    } else {
      saved.push({ id: 'save-' + Date.now(), user_id: userId, opportunity_id: opportunityId, saved_at: new Date().toISOString() });
      isSaved = true;
    }
    this.save(STORAGE_KEYS.SAVED_OPPORTUNITIES, saved);
    return isSaved;
  }

  // --- ORGANIZATIONS ---
  getOrganizations(): Organization[] {
    return this.load<Organization[]>(STORAGE_KEYS.ORGANIZATIONS, SEED_ORGANIZATIONS);
  }

  getOrganizationById(id: string): Organization | null {
    return this.getOrganizations().find((o) => o.id === id) || null;
  }

  createOrganization(data: Omit<Organization, 'id' | 'created_at' | 'updated_at'>, adminId: string = 'admin'): Organization {
    const orgs = this.getOrganizations();
    const newOrg: Organization = {
      ...data,
      id: 'org-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    orgs.push(newOrg);
    this.save(STORAGE_KEYS.ORGANIZATIONS, orgs);
    this.logAudit(adminId, 'Administrator', 'CREATE_ORGANIZATION', 'organization', newOrg.id, { name: newOrg.name });
    return newOrg;
  }

  updateOrganizationVerification(id: string, status: Organization['verification_status'], adminId: string): Organization | null {
    const orgs = this.getOrganizations();
    const idx = orgs.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    orgs[idx] = {
      ...orgs[idx],
      verification_status: status,
      verified_at: status === 'verified' ? new Date().toISOString() : undefined,
      updated_at: new Date().toISOString(),
    };
    this.save(STORAGE_KEYS.ORGANIZATIONS, orgs);
    this.logAudit(adminId, 'Administrator', `UPDATE_ORG_${status.toUpperCase()}`, 'organization', id);
    return orgs[idx];
  }

  // --- PARTNER COMMITMENTS ---
  getCommitments(organizationId?: string): PartnerCommitment[] {
    const commitments = this.load<any[]>(STORAGE_KEYS.COMMITMENTS, SEED_COMMITMENTS);
    const list = commitments.map((c) => ({
      ...c,
      spots_promised: c.spots_promised || c.promised_placements || 0,
      spots_delivered: c.spots_delivered || c.delivered_placements || 0,
      verified_retained: c.verified_retained || c.verified_retained_placements || 0,
      organization_name: c.organization_name || (this.getOrganizationById(c.organization_id)?.name) || 'Sodo Partner',
      opportunity_type: c.opportunity_type || c.category || 'Apprenticeship',
      verification_status: c.verification_status || (c.verified_retained >= c.spots_delivered && c.spots_delivered > 0 ? 'delivered' : 'partial'),
      notes: c.notes || c.follow_up_notes || '',
    }));

    if (organizationId) {
      return list.filter((c) => c.organization_id === organizationId);
    }
    return list;
  }

  createCommitment(data: any, actorId: string = 'admin'): PartnerCommitment {
    const commitments = this.load<any[]>(STORAGE_KEYS.COMMITMENTS, SEED_COMMITMENTS);
    const newCommitment: PartnerCommitment = {
      id: 'com-' + Date.now(),
      organization_id: data.organization_id || 'org-damota-agro',
      opportunity_title: data.opportunity_title || data.opportunity_type || 'Placement Commitment',
      category: data.category || data.opportunity_type || 'Apprenticeship',
      promised_placements: data.spots_promised || data.promised_placements || 1,
      delivered_placements: data.spots_delivered || data.delivered_placements || 0,
      verified_retained_placements: data.verified_retained || data.verified_retained_placements || 0,
      spots_promised: data.spots_promised || data.promised_placements || 1,
      spots_delivered: data.spots_delivered || data.delivered_placements || 0,
      verified_retained: data.verified_retained || data.verified_retained_placements || 0,
      organization_name: data.organization_name || 'Sodo Partner',
      opportunity_type: data.opportunity_type || 'Apprenticeship',
      responsible_person: data.responsible_person || 'Program Director',
      target_deadline: data.target_deadline || '2026-12-31',
      status: data.status || 'confirmed_commitment',
      verification_status: data.verification_status || 'partial',
      notes: data.notes || data.follow_up_notes || '',
      follow_up_notes: data.notes || data.follow_up_notes || '',
      evidence_filename: data.evidence_filename,
      evidence_url: data.evidence_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    };
    commitments.unshift(newCommitment);
    this.save(STORAGE_KEYS.COMMITMENTS, commitments);
    this.logAudit(actorId, 'Administrator', 'CREATE_COMMITMENT', 'commitment', newCommitment.id);
    return newCommitment;
  }

  updateCommitment(id: string, updates: any, actorId: string = 'admin'): PartnerCommitment | null {
    const commitments = this.load<any[]>(STORAGE_KEYS.COMMITMENTS, SEED_COMMITMENTS);
    const idx = commitments.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    commitments[idx] = { ...commitments[idx], ...updates, updated_at: new Date().toISOString() };
    this.save(STORAGE_KEYS.COMMITMENTS, commitments);
    this.logAudit(actorId, 'Administrator', 'UPDATE_COMMITMENT', 'commitment', id, updates);
    return commitments[idx];
  }

  deleteCommitment(id: string, actorId: string = 'admin'): boolean {
    const commitments = this.load<any[]>(STORAGE_KEYS.COMMITMENTS, SEED_COMMITMENTS);
    const filtered = commitments.filter((c) => c.id !== id);
    if (filtered.length === commitments.length) return false;
    this.save(STORAGE_KEYS.COMMITMENTS, filtered);
    this.logAudit(actorId, 'Administrator', 'DELETE_COMMITMENT', 'commitment', id);
    return true;
  }

  // --- FINANCE BRIDGE ---
  getFinanceProducts(): FinanceProduct[] {
    const list = this.load<any[]>(STORAGE_KEYS.FINANCE_PRODUCTS, SEED_FINANCE_PRODUCTS);
    return list.map((p) => ({
      ...p,
      product_type: p.product_type || p.category || 'youth_startup_loan',
      institution_name: p.institution_name || (this.getOrganizationById(p.organization_id)?.name) || 'Omo Bank S.C.',
      interest_rate_annual: p.interest_rate_annual || 9.5,
      repayment_period_months: p.repayment_period_months || 24,
      collateral_type: p.collateral_type || (p.collateral_required ? 'physical' : 'group_guarantee'),
      requires_trade_license: p.trade_licence_required ?? true,
      requirements: p.requirements || p.required_documents || [],
      official_application_channel: p.official_application_channel || p.official_channel_name || 'Branch Credit Desk',
      contact_phone: p.contact_phone || p.official_phone || '+251 46 551 2280',
      currency: 'ETB',
    }));
  }

  createFinanceProduct(data: any, actorId: string = 'provider'): FinanceProduct {
    const list = this.load<any[]>(STORAGE_KEYS.FINANCE_PRODUCTS, SEED_FINANCE_PRODUCTS);
    const newProduct: FinanceProduct = {
      id: 'fp-' + Date.now(),
      created_at: new Date().toISOString(),
      currency: 'ETB',
      is_verified: true,
      ...data,
    };
    list.unshift(newProduct);
    this.save(STORAGE_KEYS.FINANCE_PRODUCTS, list);
    this.logAudit(actorId, 'Provider', 'CREATE_FINANCE_PRODUCT', 'finance_product', newProduct.id);
    return newProduct;
  }

  getSavedFinanceProducts(userId: string): SavedFinanceProduct[] {
    const saved = this.load<SavedFinanceProduct[]>(STORAGE_KEYS.SAVED_FINANCE, []);
    return saved.filter((s) => s.user_id === userId);
  }

  toggleSaveFinanceProduct(userId: string, productId: string): boolean {
    const saved = this.load<SavedFinanceProduct[]>(STORAGE_KEYS.SAVED_FINANCE, []);
    const idx = saved.findIndex((s) => s.user_id === userId && s.product_id === productId);
    let isSaved = false;
    if (idx >= 0) {
      saved.splice(idx, 1);
      isSaved = false;
    } else {
      saved.push({ id: 'sfp-' + Date.now(), user_id: userId, product_id: productId, saved_at: new Date().toISOString() });
      isSaved = true;
    }
    this.save(STORAGE_KEYS.SAVED_FINANCE, saved);
    return isSaved;
  }

  getFinanceReadiness(userId: string, productId?: string): any | null {
    const all = this.load<any[]>(STORAGE_KEYS.FINANCE_READINESS, []);
    return all.find((r) => r.user_id === userId && (!productId || r.finance_product_id === productId)) || null;
  }

  saveFinanceReadiness(check: any): any {
    const all = this.load<any[]>(STORAGE_KEYS.FINANCE_READINESS, []);
    const idx = all.findIndex((r) => r.user_id === check.user_id && (!check.finance_product_id || r.finance_product_id === check.finance_product_id));
    const updated = {
      id: idx >= 0 ? all[idx].id : 'fcheck-' + Date.now(),
      ...check,
      updated_at: new Date().toISOString(),
    };
    if (idx >= 0) {
      all[idx] = updated;
    } else {
      all.push(updated);
    }
    this.save(STORAGE_KEYS.FINANCE_READINESS, all);
    return updated;
  }

  getFinanceInquiries(userId?: string): FinanceProductInquiry[] {
    const all = this.load<FinanceProductInquiry[]>(STORAGE_KEYS.FINANCE_INQUIRIES, [
      {
        id: 'inq-01',
        user_id: 'user-youth-bekele',
        product_id: 'fp-omo-youth',
        applicant_name: 'Bekele Abera',
        applicant_phone: '+251 91 199 8877',
        amount_requested: 45000,
        purpose: 'Procure high-efficiency soldering equipment and solar panel diagnostic meters.',
        status: 'under_review',
        officer_notes: 'Kebele identity confirmed. Awaiting final business plan printout.',
        created_at: '2026-10-23T11:00:00Z',
        updated_at: '2026-10-24T14:00:00Z',
      }
    ]);
    if (userId) {
      return all.filter((i) => i.user_id === userId);
    }
    return all;
  }

  submitFinanceInquiry(data: Omit<FinanceProductInquiry, 'id' | 'status' | 'created_at' | 'updated_at'>): FinanceProductInquiry {
    const all = this.getFinanceInquiries();
    const newInquiry: FinanceProductInquiry = {
      ...data,
      id: 'inq-' + Date.now(),
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    all.unshift(newInquiry);
    this.save(STORAGE_KEYS.FINANCE_INQUIRIES, all);

    // Notify provider officers
    const providers = this.getUsers().filter((u) => u.role === 'provider');
    providers.forEach((p) => {
      this.createNotification({
        user_id: p.id,
        title: 'New Financial Inquiry / Referral',
        message: `${data.applicant_name} submitted a loan inquiry for ${data.amount_requested.toLocaleString()} ETB.`,
        type: 'referral',
        link_url: '/provider/referrals',
        is_read: false,
      });
    });

    return newInquiry;
  }

  updateFinanceInquiryStatus(id: string, status: FinanceProductInquiry['status'], notes?: string): FinanceProductInquiry | null {
    const all = this.getFinanceInquiries();
    const idx = all.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    all[idx] = {
      ...all[idx],
      status,
      officer_notes: notes || all[idx].officer_notes,
      updated_at: new Date().toISOString(),
    };
    this.save(STORAGE_KEYS.FINANCE_INQUIRIES, all);

    // Notify applicant
    this.createNotification({
      user_id: all[idx].user_id,
      title: `Loan Inquiry Status: ${status.replace('_', ' ').toUpperCase()}`,
      message: `Your inquiry for funding has been marked as "${status.replace('_', ' ')}". ${notes || ''}`,
      type: 'referral',
      link_url: '/finance-bridge',
      is_read: false,
    });

    return all[idx];
  }

  // --- BUSINESS LAUNCHPAD & NEEDS ASSESSMENT ---
  getBusinessPlan(businessIdOrUserId: string): any | null {
    const all = this.load<any[]>(STORAGE_KEYS.BUSINESS_PLANS, []);
    return all.find((p) => p.business_id === businessIdOrUserId || p.user_id === businessIdOrUserId || p.id === businessIdOrUserId) || null;
  }

  saveBusinessPlan(businessIdOrPlan: any, maybePlan?: any): any {
    const all = this.load<any[]>(STORAGE_KEYS.BUSINESS_PLANS, []);
    let planData: any = {};
    let bId = '';
    if (typeof businessIdOrPlan === 'string') {
      bId = businessIdOrPlan;
      planData = maybePlan || {};
    } else {
      planData = businessIdOrPlan || {};
      bId = planData.business_id || planData.user_id || 'biz-default';
    }

    const idx = all.findIndex((p) => p.business_id === bId || p.user_id === bId || (planData.id && p.id === planData.id));
    const updated = {
      id: idx >= 0 ? all[idx].id : planData.id || 'bplan-' + Date.now(),
      business_id: bId,
      user_id: planData.user_id || bId,
      business_name: planData.business_name || planData.executive_summary || 'My Sodo Business',
      ...planData,
      updated_at: new Date().toISOString(),
    };
    if (idx >= 0) {
      all[idx] = updated;
    } else {
      all.push(updated);
    }
    this.save(STORAGE_KEYS.BUSINESS_PLANS, all);
    return updated;
  }

  getBusinessNeedsAssessment(businessId: string): BusinessNeedsAssessment | null {
    const all = this.load<BusinessNeedsAssessment[]>(STORAGE_KEYS.BUSINESS_NEEDS, []);
    return all.find((a) => a.business_id === businessId) || null;
  }

  saveBusinessNeedsAssessment(data: Omit<BusinessNeedsAssessment, 'id' | 'assessed_at'>): BusinessNeedsAssessment {
    const all = this.load<BusinessNeedsAssessment[]>(STORAGE_KEYS.BUSINESS_NEEDS, []);
    const idx = all.findIndex((a) => a.business_id === data.business_id);
    const updated: BusinessNeedsAssessment = {
      ...data,
      id: idx >= 0 ? all[idx].id : 'bneed-' + Date.now(),
      assessed_at: new Date().toISOString(),
    };
    if (idx >= 0) {
      all[idx] = updated;
    } else {
      all.push(updated);
    }
    this.save(STORAGE_KEYS.BUSINESS_NEEDS, all);
    return updated;
  }

  getBusinessSupportPrograms(): BusinessSupportProgram[] {
    return this.load<BusinessSupportProgram[]>(STORAGE_KEYS.BUSINESS_PROGRAMS, SEED_BUSINESS_SUPPORT_PROGRAMS);
  }

  // --- TRAINING & TVET SKILLS ---
  getTrainingCourses(category?: string): TrainingCourse[] {
    const all = this.load<TrainingCourse[]>(STORAGE_KEYS.TRAINING_COURSES, SEED_TRAINING_COURSES);
    if (category && category !== 'all') {
      return all.filter((c) => c.category === category);
    }
    return all;
  }

  getTrainingCourseById(id: string): TrainingCourse | null {
    const all = this.getTrainingCourses();
    return all.find((c) => c.id === id) || null;
  }

  createTrainingCourse(course: Omit<TrainingCourse, 'id' | 'created_at'>): TrainingCourse {
    const all = this.load<TrainingCourse[]>(STORAGE_KEYS.TRAINING_COURSES, SEED_TRAINING_COURSES);
    const newCourse: TrainingCourse = {
      ...course,
      id: 'course-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    all.unshift(newCourse);
    this.save(STORAGE_KEYS.TRAINING_COURSES, all);
    return newCourse;
  }

  getTrainingEnrollments(userId: string): TrainingEnrollment[] {
    const all = this.load<TrainingEnrollment[]>(STORAGE_KEYS.TRAINING_ENROLLMENTS, SEED_TRAINING_ENROLLMENTS);
    return all.filter((e) => e.user_id === userId);
  }

  enrollInCourse(userId: string, courseId: string): TrainingEnrollment {
    const all = this.load<TrainingEnrollment[]>(STORAGE_KEYS.TRAINING_ENROLLMENTS, SEED_TRAINING_ENROLLMENTS);
    const existing = all.find((e) => e.user_id === userId && e.course_id === courseId);
    if (existing) {
      return existing;
    }
    const newEnrollment: TrainingEnrollment = {
      id: 'enr-' + Date.now(),
      user_id: userId,
      course_id: courseId,
      status: 'enrolled',
      enrolled_at: new Date().toISOString(),
      progress_percentage: 10,
    };
    all.unshift(newEnrollment);
    this.save(STORAGE_KEYS.TRAINING_ENROLLMENTS, all);

    const course = this.getTrainingCourseById(courseId);
    this.createNotification({
      user_id: userId,
      title: 'Enrolled in TVET Training Track',
      message: `You have successfully enrolled in "${course?.title || 'the vocational course'}". Classes start soon.`,
      type: 'opportunity',
      link_url: '/skills-tvet',
      is_read: false,
    });

    return newEnrollment;
  }

  updateEnrollmentProgress(enrollmentId: string, progress: number, status?: TrainingEnrollment['status']): TrainingEnrollment | null {
    const all = this.load<TrainingEnrollment[]>(STORAGE_KEYS.TRAINING_ENROLLMENTS, SEED_TRAINING_ENROLLMENTS);
    const idx = all.findIndex((e) => e.id === enrollmentId);
    if (idx === -1) return null;
    all[idx].progress_percentage = progress;
    if (status) all[idx].status = status;
    if (progress >= 100) {
      all[idx].status = 'completed';
      all[idx].completed_at = new Date().toISOString();
    }
    this.save(STORAGE_KEYS.TRAINING_ENROLLMENTS, all);
    return all[idx];
  }

  // --- MENTORSHIP ---
  getMentors(): MentorProfile[] {
    const list = this.load<any[]>(STORAGE_KEYS.MENTORS, SEED_MENTORS);
    return list.map((m) => ({
      ...m,
      full_name: m.full_name || (this.getUsers().find((u) => u.id === m.user_id)?.full_name) || 'Sodo Mentor',
      job_title: m.job_title || m.designation || 'Advisor',
      availability_hours: m.availability_hours || `${m.available_slots_per_week || 3} hours / week`,
      languages: m.languages || m.languages_spoken || ['Amharic', 'English'],
    }));
  }

  getMentorByUserId(userId: string): MentorProfile | null {
    const list = this.getMentors();
    return list.find((m) => m.user_id === userId) || null;
  }

  updateMentorProfile(userId: string, updates: Partial<MentorProfile>): MentorProfile | null {
    const list = this.load<any[]>(STORAGE_KEYS.MENTORS, SEED_MENTORS);
    const idx = list.findIndex((m) => m.user_id === userId);
    if (idx === -1) {
      const newMentor: MentorProfile = {
        id: 'men-' + Date.now(),
        user_id: userId,
        full_name: updates.full_name || (this.getUsers().find((u) => u.id === userId)?.full_name) || 'Sodo Mentor',
        designation: updates.job_title || 'Mentor',
        expertise_areas: updates.expertise_areas || ['Career Guidance'],
        years_experience: updates.years_experience || 5,
        bio: updates.bio || '',
        available_slots_per_week: updates.available_slots_per_week || 3,
        is_accepting_mentees: updates.is_accepting_mentees ?? true,
        created_at: new Date().toISOString(),
        ...updates,
      };
      list.push(newMentor);
      this.save(STORAGE_KEYS.MENTORS, list);
      return newMentor;
    }
    list[idx] = { ...list[idx], ...updates };
    this.save(STORAGE_KEYS.MENTORS, list);
    return list[idx];
  }

  getMentorshipRequests(filters?: string | { youthId?: string; mentorId?: string }): MentorshipRequest[] {
    const all = this.load<any[]>(STORAGE_KEYS.MENTORSHIP_REQUESTS, SEED_MENTORSHIP_REQUESTS);
    if (!filters) return all;
    if (typeof filters === 'string') {
      return all.filter((r) => r.youth_id === filters || r.mentor_id === filters);
    }
    return all.filter((r) => {
      if (filters.youthId && r.youth_id !== filters.youthId) return false;
      if (filters.mentorId && r.mentor_id !== filters.mentorId) return false;
      return true;
    });
  }

  submitMentorshipRequest(data: any): MentorshipRequest {
    const all = this.load<any[]>(STORAGE_KEYS.MENTORSHIP_REQUESTS, SEED_MENTORSHIP_REQUESTS);
    const newReq: MentorshipRequest = {
      ...data,
      status: data.status || 'pending',
      goal_statement: data.goal_statement || data.notes || '',
      notes: data.notes || data.goal_statement || '',
      id: 'mreq-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    all.unshift(newReq);
    this.save(STORAGE_KEYS.MENTORSHIP_REQUESTS, all);

    // Notify mentor
    const mentor = this.getMentors().find((m) => m.id === data.mentor_id);
    if (mentor) {
      this.createNotification({
        user_id: mentor.user_id,
        title: 'New Mentorship Request',
        message: `A youth job-seeker has requested an advisory session regarding "${data.topic?.replace('_', ' ')}".`,
        type: 'mentorship',
        link_url: '/mentor/dashboard',
        is_read: false,
      });
    }

    return newReq;
  }

  updateMentorshipRequest(id: string, updates: any, actorId: string = 'mentor'): MentorshipRequest | null {
    const all = this.load<any[]>(STORAGE_KEYS.MENTORSHIP_REQUESTS, SEED_MENTORSHIP_REQUESTS);
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    all[idx] = {
      ...all[idx],
      ...updates,
      scheduled_time: updates.session_date || updates.scheduled_time || all[idx].scheduled_time,
      session_date: updates.session_date || updates.scheduled_time || all[idx].session_date,
      session_notes: updates.session_notes || updates.mentor_notes || all[idx].session_notes,
      mentor_notes: updates.session_notes || updates.mentor_notes || all[idx].mentor_notes,
      updated_at: new Date().toISOString(),
    };
    this.save(STORAGE_KEYS.MENTORSHIP_REQUESTS, all);

    // Notify mentee
    this.createNotification({
      user_id: all[idx].youth_id,
      title: `Mentorship ${updates.status?.toUpperCase() || 'UPDATED'}`,
      message: `Your advisory session on "${all[idx].topic?.replace('_', ' ')}" has been updated to "${updates.status || 'confirmed'}".`,
      type: 'mentorship',
      link_url: '/mentorship',
      is_read: false,
    });

    return all[idx];
  }

  // --- SUPPORT SERVICES & INCLUSION DIRECTORY ---
  getSupportServices(category?: string): SupportService[] {
    const all = this.load<SupportService[]>(STORAGE_KEYS.SUPPORT_SERVICES, SEED_SUPPORT_SERVICES);
    if (category && category !== 'all') {
      return all.filter((s) => s.category === category);
    }
    return all;
  }

  createSupportService(data: Omit<SupportService, 'id'>, adminId: string = 'admin'): SupportService {
    const all = this.load<SupportService[]>(STORAGE_KEYS.SUPPORT_SERVICES, SEED_SUPPORT_SERVICES);
    const newService: SupportService = {
      ...data,
      id: 'sup-' + Date.now(),
    };
    all.unshift(newService);
    this.save(STORAGE_KEYS.SUPPORT_SERVICES, all);
    this.logAudit(adminId, 'Administrator', 'CREATE_SUPPORT_SERVICE', 'support_service', newService.id, { name: newService.name });
    return newService;
  }

  updateSupportService(id: string, updates: Partial<SupportService>, adminId: string = 'admin'): SupportService | null {
    const all = this.load<SupportService[]>(STORAGE_KEYS.SUPPORT_SERVICES, SEED_SUPPORT_SERVICES);
    const idx = all.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates };
    this.save(STORAGE_KEYS.SUPPORT_SERVICES, all);
    this.logAudit(adminId, 'Administrator', 'UPDATE_SUPPORT_SERVICE', 'support_service', id, updates);
    return all[idx];
  }

  deleteSupportService(id: string, adminId: string = 'admin'): boolean {
    const all = this.load<SupportService[]>(STORAGE_KEYS.SUPPORT_SERVICES, SEED_SUPPORT_SERVICES);
    const filtered = all.filter((s) => s.id !== id);
    if (filtered.length === all.length) return false;
    this.save(STORAGE_KEYS.SUPPORT_SERVICES, filtered);
    this.logAudit(adminId, 'Administrator', 'DELETE_SUPPORT_SERVICE', 'support_service', id);
    return true;
  }

  // --- RESET DEMO DATA ---
  resetDemoData(): void {
    if (this.isLocalStorageAvailable()) {
      window.localStorage.removeItem(STORAGE_KEYS.USERS);
      window.localStorage.removeItem(STORAGE_KEYS.BUSINESSES);
      window.localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
      window.localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      window.localStorage.removeItem(STORAGE_KEYS.READINESS);
      window.localStorage.removeItem(STORAGE_KEYS.REFERRALS);
      window.localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
      window.localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      window.localStorage.removeItem(STORAGE_KEYS.REQUESTS);
      window.localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
      window.localStorage.removeItem(STORAGE_KEYS.PROVIDERS);
      window.localStorage.removeItem(STORAGE_KEYS.SERVICES);
      window.localStorage.removeItem(STORAGE_KEYS.LESSONS_PROGRESS);
      window.localStorage.removeItem(STORAGE_KEYS.ORGANIZATIONS);
      window.localStorage.removeItem(STORAGE_KEYS.OPPORTUNITIES);
      window.localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
      window.localStorage.removeItem(STORAGE_KEYS.SAVED_OPPORTUNITIES);
      window.localStorage.removeItem(STORAGE_KEYS.COMMITMENTS);
      window.localStorage.removeItem(STORAGE_KEYS.FINANCE_PRODUCTS);
      window.localStorage.removeItem(STORAGE_KEYS.SAVED_FINANCE);
      window.localStorage.removeItem(STORAGE_KEYS.FINANCE_INQUIRIES);
      window.localStorage.removeItem(STORAGE_KEYS.FINANCE_READINESS);
      window.localStorage.removeItem(STORAGE_KEYS.BUSINESS_PLANS);
      window.localStorage.removeItem(STORAGE_KEYS.BUSINESS_NEEDS);
      window.localStorage.removeItem(STORAGE_KEYS.BUSINESS_PROGRAMS);
      window.localStorage.removeItem(STORAGE_KEYS.MENTORS);
      window.localStorage.removeItem(STORAGE_KEYS.MENTORSHIP_REQUESTS);
      window.localStorage.removeItem(STORAGE_KEYS.SUPPORT_SERVICES);
      window.localStorage.removeItem(STORAGE_KEYS.TRAINING_COURSES);
      window.localStorage.removeItem(STORAGE_KEYS.TRAINING_ENROLLMENTS);
      window.localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
      window.localStorage.removeItem(STORAGE_KEYS.USER_DOCUMENTS);
      window.localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-almaz');
    } else {
      this.memStore = {};
      this.memStore[STORAGE_KEYS.CURRENT_USER_ID] = 'user-almaz';
    }
  }
}

export const db = new LocalDB();
