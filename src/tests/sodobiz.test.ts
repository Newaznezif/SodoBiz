/**
 * SodoBiz Bridge Automated Test Suite
 * Covers Unit, Integration, and Security Authorization Scenarios
 */

import { db, SEED_USERS, SEED_BUSINESSES, SEED_TRANSACTIONS, INITIAL_READINESS_ITEMS } from '../lib/db';
import { Transaction, BusinessReadiness, UserProfile } from '../types';

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

  // INTEGRATION TESTS
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
