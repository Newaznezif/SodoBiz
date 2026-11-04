# SodoBiz Bridge

> **From Small Business Records to Bigger Opportunities.**  
> A digital micro-enterprise management and financial inclusion platform built for small businesses in Wolaita Sodo and surrounding communities, southern Ethiopia.

---

## 1. System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                 SodoBiz Bridge                                    |
|             (React 19 + TypeScript + Tailwind CSS + Lucide Icons)                 |
+-----------------------------------------------------------------------------------+
                                         |
     +-----------------------------------+-----------------------------------+
     |                                   |                                   |
[Public Portal]                 [Role Auth Engine]                 [Business Engine]
 - Landing Page                  - Multi-Role Session              - Sales & Expense CRUD
 - How It Works                  - Role-Aware Routing              - Operating Profit Calc
 - Public Literacy Lessons       - Instant Demo Switcher           - Low-Stock Alerts
 - Verified Sodo Directory       - Language (EN/አማ/Wol)           - 9-Point Readiness
     |                                   |                                   |
     +-----------------------------------+-----------------------------------+
                                         |
                    +--------------------+--------------------+
                    |                                         |
        [Unified Storage Layer]                      [Database Backend]
         - Dual Mode Architecture:                    - Supabase PostgreSQL
         - Production: Supabase Client & RLS          - 15 Normalized Tables
         - Pilot / Demo: In-Memory / LocalDB          - Row-Level Security
         - Audit Logging on all actions               - Migration SQL Included
```

---

## 2. Multi-Role Permission Matrix

| Role | Business Records | Readiness Audit | Support Sessions | Referral Access | Admin Controls |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Entrepreneur** | Full CRUD for own business only | Complete & print profile | View own assistance notes | Submit / withdraw consent | None |
| **Support Agent** | Read-only for assigned clients | Assist checklist completion | Create session logs (internal + visible) | None | None |
| **Financial Provider** | None (private by default) | View consented summary packets | None | Review incoming referrals | None |
| **Administrator** | System statistics only | Manage checklist milestones | Assign agents to enterprises | Audit all linkages | Full governance |

---

## 3. Database Entity Relationships

1. **`profiles`** `1 ── 1` **`user_roles`**
2. **`profiles`** `1 ── N` **`businesses`** (via `owner_id`)
3. **`businesses`** `1 ── N` **`transactions`** (strictly scoped to owner)
4. **`businesses`** `1 ── N` **`products`** (inventory catalog with thresholds)
5. **`businesses`** `1 ── N` **`business_readiness`** (readiness checklist item progress)
6. **`providers`** `1 ── N` **`provider_services`** (available credit facilities)
7. **`businesses`** `1 ── N` **`referrals`** `N ── 1` **`providers`** (with explicit consent scopes)
8. **`businesses`** `1 ── N` **`support_assignments`** `N ── 1` **`agents`** (controlled field counselor mapping)
9. **`support_assignments`** `1 ── N` **`support_sessions`** (separated client-visible vs confidential notes)
10. **`audit_logs`** (immutable chronological system events)

---

## 4. Hackathon Demo Walkthrough (30-Second Guide)

The application includes an instant **Demo Role Switcher Toolbar** pinned at the top:

1. **Entrepreneur Persona (Almaz Tekle - Asegedech Spice & Grain Mill)**:
   - Click `Almaz (Entrepreneur)`.
   - Navigate to `/dashboard`: Observe live calculated KPIs (Total Sales, Total Expenses, Estimated Operating Result in ETB).
   - Go to `/dashboard/transactions`: View the transaction ledger, filter by category, or export to CSV.
   - Go to `/dashboard/transactions/new`: Record a new sale or expense.
   - Go to `/dashboard/products`: Notice the low-stock alert on *Magna White Teff Grain*.
   - Go to `/dashboard/reports`: Click **Print Official Statement** to review the bank-ready summary.
   - Go to `/dashboard/readiness`: Audit the 9-point checklist and toggle milestones.
   - Go to `/dashboard/learning`: Complete a financial literacy quiz with Ethiopian Birr examples.
   - Go to `/dashboard/providers`: Select *Omo Bank Sodo Branch* and request a consented referral.

2. **Youth Support Agent Persona (Dawit Wolde)**:
   - Click `Dawit (Agent)`.
   - View assigned clients: Access is restricted strictly to assigned businesses (Asegedech Spice Mill).
   - Go to `/agent/sessions`: Log a counseling session with separated public and private notes.

3. **Financial Service Provider Persona (Tsegaye Mengistu - Omo Bank)**:
   - Click `Tsegaye (Provider)`.
   - Access is restricted: Provider cannot browse private transactions, only consented referrals.
   - Click **Review Dossier** on an incoming referral and update processing status.

4. **System Administrator Persona**:
   - Click `Admin (Admin)`.
   - Review platform statistics, verify pending providers (e.g. Southern Youth Incubator), assign support agents to businesses, and review immutable security audit logs.

5. **Language Switcher**:
   - Toggle between **EN** (English), **አማ** (Amharic - አማርኛ), and **Wol** (Wolaita - Wolayttatto).

---

## 5. Setup & Development Instructions

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Run automated test suite
npm test

# 3. Start development server on port 3000
npm run dev

# 4. Run type check and linting
npm run lint

# 5. Build for production
npm run build
```

### Supabase Setup (Optional Production DB)
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Execute the migration file located at:  
   `supabase/migrations/20261025000000_sodobiz_bridge_schema.sql`
3. Seed initial data using:  
   `supabase/seed.sql`
4. Set environment variables in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
5. Deploy to Vercel or your hosting provider of choice.

---

## 6. Completed Features & Regulatory Safeguards

- [x] Complete public website (Landing, About, How It Works, Services, Literacy, Providers, Contact, Privacy, Terms).
- [x] 6-Step guided entrepreneur registration and onboarding flow.
- [x] Full transaction CRUD with positive amount checks and automatic operating result calculation.
- [x] Product inventory with low-stock alerts.
- [x] Print-friendly and CSV-exportable monthly statements with auditor disclaimers.
- [x] 9-Point Business Readiness Checklist with download and print options.
- [x] 12 Financial Literacy Lessons with quizzes and local ETB market scenarios.
- [x] Verified local provider directory (Omo Bank, VisionFund, Wasasa MFI, MSE Office, RuSACCOs).
- [x] Explicit consent-based referral workflow with revocable authorization.
- [x] Role-restricted agent module with separated internal vs. client-visible notes.
- [x] Administrative console with user role updates, provider approvals, and audit logs.
- [x] Tri-lingual localization architecture (English, Amharic, Wolaita).
- [x] Automated unit, integration, and security tests.
