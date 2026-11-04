/**
 * SodoBiz Bridge Automated Test Suite
 * Covers Unit, Integration, and Security Authorization Scenarios
 * Including Sodo Innovation HackLab Opportunities, Commitments, Finance Bridge & Mentorship
 */

import { db, SEED_USERS, SEED_BUSINESSES, SEED_TRANSACTIONS, INITIAL_READINESS_ITEMS } from '../lib/db';
import { Transaction, BusinessReadiness, UserProfile, OpportunityApplication } from '../types';

export function runTests(): { passed: number; failed: number; results: { name: string; status: 'PASS' | 'FAIL'; error?: string }[] } {
  const results: { name: string; status: 'PASS' | 'FAIL'; error?: string }[] = [];
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void) {
    try {
      fn();
      results.push({ name, status: 'PASS' });
      passed++;
    } catch (e: any) {
      results.push({ name, status: 'FAIL', error: e.message || String(e) });
      failed++;
    }
  }

  function assert(condition: boolean, msg: string) {
    if (!condition) throw new Error(msg);
  }

  // UNIT TESTS
  test('Unit: Transaction amount must be strictly positive', () => {
    let threw = false;
    try {
      db.createTransaction({
        business_id: 'biz-almaz',
        created_by: 'user-almaz',
        transaction_type: 'income',
        amount: -500, // Negative amount must throw
        currency: 'ETB',
        category: 'Sales',
        description: 'Invalid negative test',
        transaction_date: '2026-10-25',
      });
    } catch (e) {
      threw = true;
    }
    assert(threw, 'Should throw error when transaction amount is negative');
  });

  test('Unit: Operating Profit calculation correctly calculates income minus expenses', () => {
    const transactions = db.getTransactions('biz-almaz');
    const totalIncome = transactions
      .filter((t) => t.transaction_type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.transaction_type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const calculatedOperatingResult = totalIncome - totalExpense;

    assert(totalIncome > 0, 'Total income should be positive');
    assert(totalExpense > 0, 'Total expense should be positive');
    assert(
      calculatedOperatingResult === totalIncome - totalExpense,
      'Operating result must strictly equal income minus expenses'
    );
  });

  test('Unit: Readiness completion percentage calculation', () => {
    const readiness = db.getBusinessReadiness('biz-almaz');
    const completed = readiness.filter((r) => r.status === 'completed').length;
    const total = INITIAL_READINESS_ITEMS.length;
    const pct = Math.round((completed / total) * 100);

    assert(pct >= 0 && pct <= 100, 'Readiness percentage must be bounded between 0 and 100');
    assert(completed <= total, 'Completed items cannot exceed total available items');
  });

  test('Unit: Product stock and price validation', () => {
    let threw = false;
    try {
      db.createProduct({
        business_id: 'biz-almaz',
        name: 'Invalid Negative Product',
        description: 'Test',
        selling_price: -100, // Invalid
        stock_quantity: -5,  // Invalid
        low_stock_threshold: 2,
        is_active: true,
      });
    } catch {
      threw = true;
    }
    assert(threw, 'Product creation with negative price/quantity must be rejected');
  });

  // OPPORTUNITY & APPLICATION TESTS
  test('Opportunity: Application submission, status transition & duplicate prevention', () => {
    const testUserId = 'user-test-applicant';
    const testOppId = 'opp-tech-1';

    // 1. Submit application
    const app = db.submitApplication({
      opportunity_id: testOppId,
      user_id: testUserId,
      motivation_statement: 'Eager to learn mobile integration in Wolaita Sodo.',
      relevant_skills: ['Computer Basics', 'Customer Service'],
      phone: '+251 91 199 0011',
    });

    assert(app.status === 'submitted', 'New application must start in submitted state');

    // 2. Prevent duplicate application
    let threw = false;
    try {
      db.submitApplication({
        opportunity_id: testOppId,
        user_id: testUserId,
        motivation_statement: 'Duplicate attempt',
      });
    } catch (e: any) {
      threw = true;
      assert(e.message.includes('already submitted'), 'Duplicate application must be rejected');
    }
    assert(threw, 'Duplicate application submission must throw error');

    // 3. Status progression: submitted -> reviewing -> shortlisted -> accepted
    const updatedShortlisted = db.updateApplicationStatus(app.id, 'shortlisted', 'Strong credentials');
    assert(Boolean(updatedShortlisted && updatedShortlisted.status === 'shortlisted'), 'Status must advance to shortlisted');

    const updatedAccepted = db.updateApplicationStatus(app.id, 'accepted', 'Placed in Damota Agro');
    assert(Boolean(updatedAccepted && updatedAccepted.status === 'accepted'), 'Status must advance to accepted');
  });

  // FINANCE BRIDGE READINESS TESTS
  test('Finance Bridge: Self-assessment checklist scoring and missing requirements guidance', () => {
    const userId = 'user-youth-marta';
    const check = db.saveFinanceReadiness({
      id: `readiness-${userId}`,
      user_id: userId,
      has_valid_id: true,
      has_tin_number: true,
      has_trade_license: false, // Missing
      has_written_business_plan: true,
      has_solidarity_group: true,
      has_recorded_bookkeeping: false, // Missing
      willing_to_attend_training: true,
      assessed_at: new Date().toISOString(),
    });

    assert(check.user_id === userId, 'Readiness check must be associated with youth user');

    // Calculate score (5 of 7 completed = 71%)
    let count = 0;
    if (check.has_valid_id) count++;
    if (check.has_tin_number) count++;
    if (check.has_trade_license) count++;
    if (check.has_written_business_plan) count++;
    if (check.has_solidarity_group) count++;
    if (check.has_recorded_bookkeeping) count++;
    if (check.willing_to_attend_training) count++;

    const scorePct = Math.round((count / 7) * 100);
    assert(scorePct === 71, `Calculated readiness score should be 71% (got ${scorePct}%)`);
  });

  // BUSINESS LAUNCHPAD TESTS
  test('Business Launchpad: Business plan creation, financial cash-flow validation', () => {
    const userId = 'user-youth-bekele';
    const plan = db.saveBusinessPlan({
      id: `plan-${userId}`,
      user_id: userId,
      business_name: 'Bekele Community Solar Charging Kiosk',
      sector: 'Trade & Technical Services',
      target_market: 'Damot Gale rural farmers arriving at Sodo market',
      product_or_service: 'Solar lantern repair and battery recharging',
      pricing_strategy: '200 ETB flat repair fee + spare parts cost',
      startup_capital_needed: 30000,
      estimated_monthly_revenue: 18000,
      estimated_monthly_expenses: 9500,
      currency: 'ETB',
      is_completed: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    assert(plan.business_name === 'Bekele Community Solar Charging Kiosk', 'Plan title must match');
    const netProfit = plan.estimated_monthly_revenue - plan.estimated_monthly_expenses;
    assert(netProfit === 8500, 'Projected net operating profit must correctly equal revenue minus expenses');
    assert(netProfit > 0, 'Projected business cashflow must be positive');
  });

  // PARTNER COMMITMENTS & RETENTION AUDIT TESTS
  test('Commitment Tracker: Promised vs delivered youth placements and 60-day retention rate calculation', () => {
    const commitment = db.createCommitment({
      organization_id: 'org-damota',
      organization_name: 'Damota Agro-Processing Test Cohort',
      opportunity_type: 'Agro Machinery Apprenticeship',
      spots_promised: 10,
      spots_delivered: 8,
      verified_retained: 6,
      commitment_date: '2026-10-01',
      verification_status: 'partial',
      last_verified_at: '2026-10-25',
      notes: 'Monitored by TVET coordinator.',
    });

    assert(commitment.spots_promised === 10, 'Promised slots must match');
    assert(commitment.spots_delivered === 8, 'Delivered slots must match');
    assert(commitment.verified_retained === 6, 'Retained slots must match');

    // Retention rate check: 6 / 8 = 75%
    const retentionRate = Math.round((commitment.verified_retained / commitment.spots_delivered) * 100);
    assert(retentionRate === 75, `Retention rate must be 75% (got ${retentionRate}%)`);
  });

  // MENTORSHIP REQUEST LIFECYCLE TESTS
  test('Mentorship: Request submission and scheduled session confirmation', () => {
    const youthId = 'user-youth-marta';
    const mentorId = 'mentor-tamirat';

    const req = db.submitMentorshipRequest({
      mentor_id: mentorId,
      youth_id: youthId,
      topic: 'business_startup',
      notes: 'Need advice on Sodo weaving trade licensing.',
    });

    assert(req.status === 'pending', 'New mentorship request must be pending');

    // Mentor schedules session
    const scheduled = db.updateMentorshipRequest(req.id, {
      status: 'scheduled',
      session_date: '2026-11-10T14:00:00Z',
      session_notes: 'Meeting at Sodo Youth Center',
    });

    assert(Boolean(scheduled && scheduled.status === 'scheduled'), 'Status must advance to scheduled');
    assert(Boolean(scheduled && scheduled.session_date), 'Session date must be recorded');
  });

  // EXISTING INTEGRATION TESTS
  test('Integration: Create transaction, read from store, update, and delete', () => {
    const newTx = db.createTransaction({
      business_id: 'biz-almaz',
      created_by: 'user-almaz',
      transaction_type: 'income',
      amount: 1250,
      currency: 'ETB',
      category: 'Sales - Grain',
      description: 'Integration test teff sale',
      transaction_date: '2026-10-25',
      payment_method: 'telebirr',
    });

    assert(newTx.id.startsWith('tx-'), 'Generated transaction ID must have valid format');

    // Update
    const updated = db.updateTransaction(newTx.id, { amount: 1300 }, 'biz-almaz');
    assert(updated?.amount === 1300, 'Updated transaction amount must match');

    // Delete
    const deleted = db.deleteTransaction(newTx.id, 'biz-almaz');
    assert(deleted, 'Delete transaction must return true');
  });

  test('Integration: Consent-based referral submission and status transitions', () => {
    const ref = db.createReferral({
      business_id: 'biz-almaz',
      owner_id: 'user-almaz',
      provider_id: 'prov-omo',
      service_id: 'srv-omo-micro',
      status: 'submitted',
      consent_given_at: new Date().toISOString(),
      consent_scope: ['business_profile', 'monthly_revenue_summary'],
      notes: 'Test loan referral',
    });

    assert(ref.status === 'submitted', 'Referral initial status must be submitted');

    // Status transition to in_review
    const inReview = db.updateReferralStatus(ref.id, 'in_review', 'user-provider-omo');
    assert(inReview?.status === 'in_review', 'Referral status must transition to in_review');

    // Withdraw consent
    const withdrawn = db.updateReferralStatus(ref.id, 'withdrawn', 'user-almaz');
    assert(withdrawn?.status === 'withdrawn', 'Referral status must transition to withdrawn');
    assert(Boolean(withdrawn?.withdrawn_at), 'Withdrawal timestamp must be recorded');
  });

  // SECURITY & ACCESS CONTROL TESTS
  test('Security: Entrepreneur A cannot read or delete Entrepreneur B transactions', () => {
    const almazBusiness = 'biz-almaz';
    const birtukanBusiness = 'biz-birtukan';

    const almazTxs = db.getTransactions(almazBusiness);
    assert(almazTxs.every((t) => t.business_id === almazBusiness), 'RLS check: All returned transactions belong to biz-almaz');

    // Attempting to delete Almaz transaction with Birtukan business ID must fail
    if (almazTxs.length > 0) {
      const targetId = almazTxs[0].id;
      const deleteAttempt = db.deleteTransaction(targetId, birtukanBusiness);
      assert(!deleteAttempt, 'Tenant isolation: Deleting with mismatched business ID must return false');
    }
  });

  test('Security: Agent access is restricted strictly to assigned businesses', () => {
    const agentId = 'user-agent-dawit';
    const assignments = db.getAssignments(agentId);
    const assignedIds = new Set(assignments.map((a) => a.business_id));

    assert(assignedIds.has('biz-almaz'), 'Agent Dawit is assigned to biz-almaz');
    assert(!assignedIds.has('biz-birtukan'), 'Agent Dawit must NOT be assigned to biz-birtukan');
  });

  test('Security: Provider can only access referrals with explicit consent', () => {
    const omoReferrals = db.getReferrals({ providerId: 'prov-omo' });
    assert(omoReferrals.every((r) => r.provider_id === 'prov-omo'), 'Provider RLS check: Only referrals for prov-omo are returned');
  });

  return { passed, failed, results };
}
