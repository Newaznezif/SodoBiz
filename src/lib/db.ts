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
          'Taxes increase automatically',
          'Customers will refuse to shop'
        ],
        correct_index: 0,
        explanation: 'Dipping into daily sales drains working capital, leaving you unable to restock inventory when suppliers arrive.'
      },
      {
        question: 'What is the best way for a business owner to take money for personal living expenses?',
        options: [
          'Take all the cash left over at the end of each afternoon',
          'Set a predictable regular owner allowance or wage',
          'Borrow from friends each time',
          'Never take any money for family needs'
        ],
        correct_index: 1,
        explanation: 'Paying yourself a predictable regular owner wage protects business cash while covering personal needs.'
      }
    ],
    is_published: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'les-2',
    title: 'Recording Daily Sales Accurately',
    slug: 'recording-daily-sales-accurately',
    summary: 'The simplest habit that turns everyday commerce into proof of business health.',
    category: 'record_keeping',
    language: 'en',
    content: `If you do not record a sale, it never existed in the eyes of a bank, an MFI loan officer, or even your future self trying to evaluate monthly performance.

Sales recording does not require complex accounting software. A daily transaction log on SodoBiz Bridge or a physical ledger with date, item, quantity, and total amount is enough to calculate your true monthly turnover.

Remember to record both cash sales and digital receipts (telebirr or CBE Birr) at the exact moment they occur.`,
    practical_example: 'Birtukan sells 4 woven gabi blankets on Tuesday. Two paid 1,200 ETB in cash; two paid 2,400 ETB via telebirr. She logs both transactions immediately, giving her a recorded Tuesday turnover of 3,600 ETB.',
    review_questions: [
      {
        question: 'When should a sale be recorded into your business ledger or SodoBiz app?',
        options: [
          'At the end of the month from memory',
          'At the moment the sale occurs or at the end of each day',
          'Only when a customer asks for an official receipt',
          'Only when paying taxes'
        ],
        correct_index: 1,
        explanation: 'Immediate or end-of-day logging ensures no transactions are forgotten and figures remain exact.'
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
    content: `Pricing a product requires more than matching your competitor\'s price. You must know your unit landed cost.
    
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
    description: 'Public municipal agency facilitating formal business licensing, trade exhibitions, subsidized market shades, and vocational entrepreneurship workshops.',
    location: 'Municipal Administration Complex, Wolaita Sodo',
    official_phone: '+251 46 551 2133',
    verification_status: 'verified',
    last_verified_at: '2026-10-10T00:00:00Z',
    approved_by: 'admin-1',
    approved_at: '2026-10-10T11:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-10-10T00:00:00Z',
  },
  {
    id: 'prov-rusacco',
    organization_name: 'Wolaita Farmers & Merchants Primary SACCO Union',
    slug: 'wolaita-merchants-sacco-union',
    organization_type: 'cooperative',
    description: 'Community-owned savings and credit cooperative union providing member savings dividends, emergency credit, and cooperative bulk purchase financing.',
    location: 'Merkato Quarter, Wolaita Sodo',
    official_phone: '+251 46 551 3199',
    verification_status: 'verified',
    last_verified_at: '2026-10-14T00:00:00Z',
    approved_by: 'admin-1',
    approved_at: '2026-10-14T16:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-10-14T00:00:00Z',
  },
  {
    id: 'prov-innovate-south',
    organization_name: 'Southern Youth Business Incubator (Candidate)',
    slug: 'southern-youth-incubator',
    organization_type: 'incubator',
    description: 'Pilot youth incubation center seeking accreditation to offer mentorship and digital skills training to youth entrepreneurs.',
    location: 'Near Wolaita Sodo High School',
    official_phone: '+251 91 123 4567',
    verification_status: 'pending',
    last_verified_at: '2026-10-22T00:00:00Z',
    created_at: '2026-10-20T00:00:00Z',
    updated_at: '2026-10-22T00:00:00Z',
  },
];

// Initial services for providers
export const INITIAL_SERVICES: ProviderService[] = [
  {
    id: 'srv-omo-micro',
    provider_id: 'prov-omo',
    title: 'Micro-Enterprise Working Capital Loan',
    description: 'Credit support for small retail shops, grain millers, and craftspeople to purchase seasonal inventory.',
    eligibility: 'Operating micro-enterprise in Wolaita zone with at least 6 months of verifiable sales transactions.',
    requirements: [
      'Valid Kebele ID and residency certificate',
      'At least 3 months of recorded business transactions or sales ledger',
      'Two personal guarantors from the local business community',
      'Completed SodoBiz Business Readiness profile summary'
    ],
    official_application_url: 'https://omobank.com.et/services/micro-loans',
    is_published: true,
  },
  {
    id: 'srv-vf-women',
    provider_id: 'prov-visionfund',
    title: 'Women Entrepreneur Growth Financing',
    description: 'Tailored financial facility designed for women-owned micro-businesses with flexible group guarantees.',
    eligibility: 'Women business owners aged 18-60 running an active trade or service in Wolaita Sodo.',
    requirements: [
      'Valid Kebele identity card',
      'Proof of existing business activity and inventory',
      'Participation in a 1-day financial literacy refresher session',
      'Written business readiness plan'
    ],
    official_application_url: 'https://visionfundmfi.com/ethiopia-women-credit',
    is_published: true,
  },
  {
    id: 'srv-wasasa-asset',
    provider_id: 'prov-wasasa',
    title: 'Small Equipment & Tool Asset Financing',
    description: 'Leasing support for equipment such as grain grinding machines, sewing machines, and solar kiosks.',
    eligibility: 'Licensed or registered small business operators requiring productive machinery.',
    requirements: [
      'Quotation from verified machinery vendor in Wolaita Sodo or Hawassa',
      '20% equity contribution from the entrepreneur',
      'Proof of store or workshop space'
    ],
    official_application_url: 'https://wasasa.org.et/asset-credit',
    is_published: true,
  },
  {
    id: 'srv-mse-shade',
    provider_id: 'prov-sme-office',
    title: 'Subsidized Market Shade Allocation & Trade Fair Entry',
    description: 'Opportunity to access government market stalls and showcase products at seasonal regional expos.',
    eligibility: 'Organized youth or women micro-enterprises registered with the city administration.',
    requirements: [
      'Kebele MSE formation letter',
      'List of active enterprise members',
      'SodoBiz structured business readiness report'
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
    has_disability: false,
    tvet_status: 'graduated',
    kebele: 'Kebele 02, Sodo',
    bio: 'Selected through Sodo City Youth Center HackLab cohort. Eager to turn technical certification into sustainable income.',
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
    has_disability: false,
    tvet_status: 'enrolled',
    kebele: 'Kebele 04, Sodo',
    bio: 'First-generation woman entrepreneur participating in Sodo Youth Center micro-business cohort.',
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
    stock_quantity: 8, // Low stock! threshold is 10
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
    stock_quantity: 4, // Low stock! threshold is 8
    low_stock_threshold: 8,
    sku: 'SPICE-KOR-250',
    is_active: true,
    created_at: '2026-03-01T09:00:00Z',
    updated_at: '2026-10-24T14:00:00Z',
  },
];

// Pre-seeded Transactions for Almaz's business (Spans past 30 days)
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
    amount: 850,
    currency: 'ETB',
    category: 'Transport & Freight',
    description: 'Bajaj freight delivery of 5 grain sacks from rural depot',
    transaction_date: '2026-10-21',
    payment_method: 'cash',
    created_at: '2026-10-21T09:30:00Z',
    updated_at: '2026-10-21T09:30:00Z',
  },
  {
    id: 'tx-06',
    business_id: 'biz-almaz',
    created_by: 'user-almaz',
    transaction_type: 'income',
    amount: 4950,
    currency: 'ETB',
    category: 'Sales - Spices',
    description: 'Bulk order of berbere and korerima jars for boarding school cook',
    transaction_date: '2026-10-19',
    payment_method: 'bank_transfer',
    created_at: '2026-10-19T13:45:00Z',
    updated_at: '2026-10-19T13:45:00Z',
  },
  {
    id: 'tx-07',
    business_id: 'biz-almaz',
    created_by: 'user-almaz',
    transaction_type: 'expense',
    amount: 6000,
    currency: 'ETB',
    category: 'Inventory Restock',
    description: 'Purchased 200 kg of raw red chilies from Bedesa market',
    transaction_date: '2026-10-18',
    payment_method: 'telebirr',
    created_at: '2026-10-18T10:00:00Z',
    updated_at: '2026-10-18T10:00:00Z',
  },
  {
    id: 'tx-08',
    business_id: 'biz-almaz',
    created_by: 'user-almaz',
    transaction_type: 'income',
    amount: 2700,
    currency: 'ETB',
    category: 'Custom Milling Services',
    description: 'Custom grinding services fee for 18 customer grain bags',
    transaction_date: '2026-10-16',
    payment_method: 'cash',
    created_at: '2026-10-16T17:00:00Z',
    updated_at: '2026-10-16T17:00:00Z',
  },
  {
    id: 'tx-09',
    business_id: 'biz-almaz',
    created_by: 'user-almaz',
    transaction_type: 'expense',
    amount: 2500,
    currency: 'ETB',
    category: 'Rent & Electricity',
    description: 'Shop rent contribution and 3-phase mill electricity bill',
    transaction_date: '2026-10-15',
    payment_method: 'telebirr',
    created_at: '2026-10-15T11:30:00Z',
    updated_at: '2026-10-15T11:30:00Z',
  },
  {
    id: 'tx-10',
    business_id: 'biz-almaz',
    created_by: 'user-almaz',
    transaction_type: 'income',
    amount: 7200,
    currency: 'ETB',
    category: 'Sales - Grain',
    description: 'Sale of 2 sacks of Magna White Teff to Sodo hotel',
    transaction_date: '2026-10-12',
    payment_method: 'telebirr',
    created_at: '2026-10-12T15:20:00Z',
    updated_at: '2026-10-12T15:20:00Z',
  },
  {
    id: 'tx-11',
    business_id: 'biz-almaz',
    created_by: 'user-almaz',
    transaction_type: 'income',
    amount: 3150,
    currency: 'ETB',
    category: 'Sales - Spices',
    description: '7 bags of berbere spice sold during weekly market day',
    transaction_date: '2026-10-10',
    payment_method: 'cash',
    created_at: '2026-10-10T16:00:00Z',
    updated_at: '2026-10-10T16:00:00Z',
  },
  {
    id: 'tx-12',
    business_id: 'biz-almaz',
    created_by: 'user-almaz',
    transaction_type: 'expense',
    amount: 1200,
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

// Pre-seeded Referrals
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

// Pre-seeded Support Assignment
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

// Pre-seeded Support Sessions
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

// Pre-seeded Support Requests
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

// Pre-seeded Audit Logs
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

// LOCAL DATABASE STORAGE ENGINE
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
  FINANCE_READINESS: 'sodobiz_finance_readiness',
  BUSINESS_PLANS: 'sodobiz_business_plans',
  MENTORS: 'sodobiz_mentors',
  MENTORSHIP_REQUESTS: 'sodobiz_mentorship_requests',
  SUPPORT_SERVICES: 'sodobiz_support_services',
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

  // Current session management
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

  // Users
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
    this.logAudit(newUser.id, newUser.full_name, 'USER_REGISTERED', 'user', newUser.id);
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

  // Businesses
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

  // Transactions (Strict RLS: only user's business transactions accessible)
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

  // Products
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

  // Business Readiness
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

  // Providers & Services
  getProviders(): Provider[] {
    return this.load<Provider[]>(STORAGE_KEYS.PROVIDERS, INITIAL_PROVIDERS);
  }

  getProviderBySlug(slug: string): Provider | null {
    return this.getProviders().find((p) => p.slug === slug) || null;
  }

  getServices(providerId?: string): ProviderService[] {
    const services = this.load<ProviderService[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    if (providerId) {
      return services.filter((s) => s.provider_id === providerId);
    }
    return services;
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

  // Referrals
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
    return referrals[idx];
  }

  // Agent Support Assignments & Sessions
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

  // Support Requests
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

  // Learning Progress
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

  // Audit Logs
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
    this.save(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 100)); // maintain recent 100
  }

  // --- OPPORTUNITIES HUB & APPLICATIONS ---
  getOpportunities(filters?: { type?: string; category?: string; query?: string }): Opportunity[] {
    const opps = this.load<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, SEED_OPPORTUNITIES);
    return opps.filter((o) => {
      if (o.status !== 'published') return false;
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

  createOpportunity(data: any, actorId: string = 'admin'): Opportunity {
    const opps = this.load<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, SEED_OPPORTUNITIES);
    const newOpp: Opportunity = {
      category: data.category || 'Vocational Placement',
      responsibilities: data.responsibilities || [],
      eligibility_criteria: data.eligibility_criteria || [],
      required_skills: data.required_skills || [],
      open_positions: data.spots_available || data.open_positions || 1,
      deadline: data.deadline || '2026-12-31',
      status: 'published',
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

  // Applications
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

  submitApplication(data: any): OpportunityApplication {
    const apps = this.load<OpportunityApplication[]>(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
    const applicantId = data.applicant_id || data.user_id;
    // Duplicate check
    const existing = apps.find(
      (a) => a.opportunity_id === data.opportunity_id && (a.applicant_id === applicantId || (a as any).user_id === applicantId)
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    };
    apps.unshift(newApp);
    this.save(STORAGE_KEYS.APPLICATIONS, apps);
    this.logAudit(applicantId, 'Youth', 'SUBMIT_APPLICATION', 'application', newApp.id, { opportunity_id: data.opportunity_id });
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
    return apps[idx];
  }

  // Saved Opportunities
  getSavedOpportunities(userId: string): any[] {
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

  // --- PARTNER COMMITMENTS (Sodo HackLab Evidence) ---
  getCommitments(organizationId?: string): any[] {
    const commitments = this.load<any[]>(STORAGE_KEYS.COMMITMENTS, SEED_COMMITMENTS);
    if (organizationId) {
      return commitments.filter((c) => c.organization_id === organizationId);
    }
    return commitments.map((c) => ({
      ...c,
      spots_promised: c.spots_promised || c.promised_placements || 0,
      spots_delivered: c.spots_delivered || c.delivered_placements || 0,
      verified_retained: c.verified_retained || c.verified_retained_placements || 0,
      organization_name: c.organization_name || (this.getOrganizationById(c.organization_id)?.name) || 'Sodo Partner',
      opportunity_type: c.opportunity_type || c.category || 'Apprenticeship',
      verification_status: c.verification_status || (c.verified_retained_placements >= c.delivered_placements && c.delivered_placements > 0 ? 'delivered' : 'partial'),
      notes: c.notes || c.follow_up_notes || '',
    }));
  }

  createCommitment(data: any, actorId: string = 'admin'): any {
    const commitments = this.load<any[]>(STORAGE_KEYS.COMMITMENTS, SEED_COMMITMENTS);
    const newCommitment = {
      id: 'com-' + Date.now(),
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
      verification_status: data.verification_status || 'partial',
      notes: data.notes || data.follow_up_notes || '',
      follow_up_notes: data.notes || data.follow_up_notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    };
    commitments.unshift(newCommitment);
    this.save(STORAGE_KEYS.COMMITMENTS, commitments);
    return newCommitment;
  }

  updateCommitment(id: string, updates: any, actorId: string = 'admin'): any | null {
    const commitments = this.load<any[]>(STORAGE_KEYS.COMMITMENTS, SEED_COMMITMENTS);
    const idx = commitments.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    commitments[idx] = { ...commitments[idx], ...updates, updated_at: new Date().toISOString() };
    this.save(STORAGE_KEYS.COMMITMENTS, commitments);
    return commitments[idx];
  }

  // --- FINANCE BRIDGE ---
  getFinanceProducts(): any[] {
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

  // --- BUSINESS LAUNCHPAD & PLAN BUILDER ---
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

  // --- MENTORSHIP ---
  getMentors(): any[] {
    const list = this.load<any[]>(STORAGE_KEYS.MENTORS, SEED_MENTORS);
    return list.map((m) => ({
      ...m,
      full_name: m.full_name || (this.getUsers().find((u) => u.id === m.user_id)?.full_name) || 'Sodo Mentor',
      job_title: m.job_title || m.designation || 'Advisor',
      availability_hours: m.availability_hours || `${m.available_slots_per_week || 3} hours / week`,
      languages: m.languages || m.languages_spoken || ['Amharic', 'English'],
    }));
  }

  getMentorshipRequests(filters?: string | { youthId?: string; mentorId?: string }): any[] {
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

  submitMentorshipRequest(data: any): any {
    const all = this.load<any[]>(STORAGE_KEYS.MENTORSHIP_REQUESTS, SEED_MENTORSHIP_REQUESTS);
    const newReq = {
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
    return newReq;
  }

  updateMentorshipRequest(id: string, updates: any, actorId: string = 'mentor'): any | null {
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

  // Reset to default seed data
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
      window.localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-almaz');
    } else {
      this.memStore = {};
      this.memStore[STORAGE_KEYS.CURRENT_USER_ID] = 'user-almaz';
    }
  }
}

export const db = new LocalDB();
