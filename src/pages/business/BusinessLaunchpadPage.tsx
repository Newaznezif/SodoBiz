import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { BusinessPlan } from '../../types';
import {
  Rocket,
  CheckCircle2,
  DollarSign,
  Store,
  FileText,
  Printer,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Building,
} from 'lucide-react';

export const BusinessLaunchpadPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();

  const [businessName, setBusinessName] = useState('Damota Eco-Solar & Repair');
  const [sector, setSector] = useState('Trade & Technical Services');
  const [targetMarket, setTargetMarket] = useState('Smallholder farmers in Damot Gale and retail merchants in Wolaita Sodo Arada market');
  const [productService, setProductService] = useState('Repairs of solar lanterns, small inverters, and battery charging services');
  const [pricingStrategy, setPricingStrategy] = useState('Fixed service fee 150-300 ETB per repair, replacement parts marked up by 25%');
  const [startupCapital, setStartupCapital] = useState('35000');
  const [estimatedMonthlyRevenue, setEstimatedMonthlyRevenue] = useState('22000');
  const [estimatedMonthlyExpenses, setEstimatedMonthlyExpenses] = useState('12500');
  const [planId, setPlanId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const existing = db.getBusinessPlan(currentUser.id);
    if (existing) {
      setPlanId(existing.id);
      setBusinessName(existing.business_name);
      setSector(existing.sector);
      setTargetMarket(existing.target_market);
      setProductService(existing.product_or_service);
      setPricingStrategy(existing.pricing_strategy);
      setStartupCapital(String(existing.startup_capital_needed));
      setEstimatedMonthlyRevenue(String(existing.estimated_monthly_revenue));
      setEstimatedMonthlyExpenses(String(existing.estimated_monthly_expenses));
    }
  }, [currentUser.id]);

  const monthlyProfit = (Number(estimatedMonthlyRevenue) || 0) - (Number(estimatedMonthlyExpenses) || 0);

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const plan: BusinessPlan = {
      id: planId || `plan-${currentUser.id}`,
      user_id: currentUser.id,
      business_name: businessName,
      sector,
      target_market: targetMarket,
      product_or_service: productService,
      pricing_strategy: pricingStrategy,
      startup_capital_needed: Number(startupCapital) || 0,
      estimated_monthly_revenue: Number(estimatedMonthlyRevenue) || 0,
      estimated_monthly_expenses: Number(estimatedMonthlyExpenses) || 0,
      currency: 'ETB',
      is_completed: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.saveBusinessPlan(plan);
    setPlanId(plan.id);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Rocket className="w-4 h-4" />
              <span>Sodo Youth Business Launchpad</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Structure Your Sodo Micro-Enterprise Plan
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Transform your trade or vocational skill into a viable commercial plan. This document serves as proof of intent for Sodo Innovation HackLab micro-grants and MFI solidarity groups.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Plan</span>
            </button>
            <button
              onClick={() => onNavigate('/dashboard')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg text-xs font-bold transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Go to Sales Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Form & Financial Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="border-b border-slate-100 pb-3 mb-5">
              <h2 className="text-base font-bold text-slate-900">Enterprise Concept & Market</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Clearly define what your enterprise offers and who in Wolaita Sodo will pay for it.
              </p>
            </div>

            {saveSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Business plan saved to your profile and ready for loan evaluation!</span>
              </div>
            )}

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Proposed Business Name</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Industry / Trade Sector</label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                  >
                    <option value="Agriculture & Food Processing">Agriculture & Food Processing</option>
                    <option value="Trade & Technical Services">Trade & Technical Services (Solar/Repair)</option>
                    <option value="Retail & Consumer Essentials">Retail & Consumer Essentials</option>
                    <option value="Textile, Weaving & Artisan Crafts">Textile, Weaving & Artisan Crafts</option>
                    <option value="Hospitality, Barista & Catering">Hospitality, Barista & Catering</option>
                    <option value="Digital Commerce & ICT Support">Digital Commerce & ICT Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Product or Service Description</label>
                <textarea
                  rows={2}
                  required
                  value={productService}
                  onChange={(e) => setProductService(e.target.value)}
                  placeholder="What specific product or service will you deliver to customers?"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Customers in Sodo Town</label>
                <textarea
                  rows={2}
                  required
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value)}
                  placeholder="Who are your customers? (e.g. students, restaurants, farmers, transport operators)"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pricing & Sales Model</label>
                <textarea
                  rows={2}
                  required
                  value={pricingStrategy}
                  onChange={(e) => setPricingStrategy(e.target.value)}
                  placeholder="How will you set prices? Will you accept telebirr, cash, or credit?"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Monthly Financial Projections (in ETB)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Startup Capital Needed</label>
                    <input
                      type="number"
                      required
                      value={startupCapital}
                      onChange={(e) => setStartupCapital(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Est. Monthly Sales (ETB)</label>
                    <input
                      type="number"
                      required
                      value={estimatedMonthlyRevenue}
                      onChange={(e) => setEstimatedMonthlyRevenue(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Est. Monthly Costs (ETB)</label>
                    <input
                      type="number"
                      required
                      value={estimatedMonthlyExpenses}
                      onChange={(e) => setEstimatedMonthlyExpenses(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 no-print">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                >
                  Save Business Plan
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Financial Health Projection Card */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Projected Monthly Result
            </h3>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Gross Sales</span>
                <span className="font-bold text-slate-800 font-mono">
                  {Number(estimatedMonthlyRevenue).toLocaleString()} ETB
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Operating Expenses</span>
                <span className="font-bold text-slate-800 font-mono">
                  -{Number(estimatedMonthlyExpenses).toLocaleString()} ETB
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Estimated Net Profit</span>
                <span
                  className={`text-sm font-bold font-mono ${
                    monthlyProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {monthlyProfit >= 0 ? '+' : ''}{monthlyProfit.toLocaleString()} ETB
                </span>
              </div>
            </div>

            {monthlyProfit <= 0 ? (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Projected expenses equal or exceed revenues. Consider lowering fixed overhead or adjusting prices before seeking a loan.
                </span>
              </div>
            ) : (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>
                  Positive cash flow projection! This demonstrates debt-servicing ability for microfinance loan officers.
                </span>
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => onNavigate('/finance-bridge')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Check Loan Eligibility</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
