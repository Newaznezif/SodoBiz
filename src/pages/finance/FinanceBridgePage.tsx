import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { FinanceProduct, FinanceReadinessCheck } from '../../types';
import {
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Users,
  Building2,
  Clock,
  ArrowRight,
  ExternalLink,
  Info,
} from 'lucide-react';

export const FinanceBridgePage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState<FinanceProduct[]>([]);
  const [readiness, setReadiness] = useState<FinanceReadinessCheck>({
    id: `readiness-${currentUser.id}`,
    user_id: currentUser.id,
    has_valid_id: true,
    has_tin_number: false,
    has_trade_license: false,
    has_written_business_plan: false,
    has_solidarity_group: false,
    has_recorded_bookkeeping: false,
    willing_to_attend_training: true,
    assessed_at: new Date().toISOString(),
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const list = db.getFinanceProducts();
    setProducts(list);
    const existing = db.getFinanceReadiness(currentUser.id);
    if (existing) {
      setReadiness(existing);
    }
  }, [currentUser.id]);

  const calculateScore = (state: FinanceReadinessCheck) => {
    let count = 0;
    if (state.has_valid_id) count++;
    if (state.has_tin_number) count++;
    if (state.has_trade_license) count++;
    if (state.has_written_business_plan) count++;
    if (state.has_solidarity_group) count++;
    if (state.has_recorded_bookkeeping) count++;
    if (state.willing_to_attend_training) count++;
    return Math.round((count / 7) * 100);
  };

  const handleCheckboxChange = (field: keyof FinanceReadinessCheck) => {
    const updated = {
      ...readiness,
      [field]: !readiness[field],
      assessed_at: new Date().toISOString(),
    };
    setReadiness(updated);
    db.saveFinanceReadiness(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const score = calculateScore(readiness);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <DollarSign className="w-4 h-4" />
            <span>Sodo Youth Finance Bridge</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Demystifying Loans & Finance Readiness in Sodo
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Field mission data shows youth-targeted loan products exist in Sodo, but very few young people access them due to trade licence/TIN hurdles, unclear loan terms, and fear of debt. We bridge the gap through transparent information and readiness checklists.
          </p>
        </div>

        {/* Prominent Legal Disclaimer Banner */}
        <div className="mt-5 p-3.5 bg-amber-950/60 border border-amber-800/80 rounded-lg text-xs text-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed">
            <span className="font-bold text-amber-300">Important Advisory & Disclaimer: </span>
            SodoBiz Bridge does NOT issue credit, provide loan capital, or approve loan applications. All financial products listed below are provided solely by accredited regional financial institutions (Omo Bank, VisionFund MFI, Wasasa).
          </div>
        </div>
      </div>

      {/* Main Grid: Readiness Assessment (Left) + Verified Products Directory (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Interactive Readiness Checklist */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Finance Readiness Checklist</h2>
                <p className="text-xs text-slate-500 mt-0.5">Self-assess your eligibility before visiting an MFI branch</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-teal-700 font-mono">{score}%</span>
                <span className="block text-[10px] text-slate-400 uppercase">Score</span>
              </div>
            </div>

            {/* Score progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${score}%` }}
              ></div>
            </div>

            {saveSuccess && (
              <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Readiness record updated</span>
              </div>
            )}

            {/* Checkbox Items */}
            <div className="mt-4 space-y-3">
              {[
                {
                  id: 'has_valid_id' as const,
                  title: 'Valid Kebele National / Resident ID',
                  desc: 'Proof of age (18-29 years) and residence within Wolaita Sodo city or surrounding woreda.',
                  tip: 'Available at your local Kebele administration office in Sodo.',
                },
                {
                  id: 'has_tin_number' as const,
                  title: 'Taxpayer Identification Number (TIN)',
                  desc: 'Individual tax registration required for formal enterprise loan disbursements.',
                  tip: 'Visit the Sodo City Revenues Branch (Piazza). Free of charge with Kebele ID.',
                },
                {
                  id: 'has_trade_license' as const,
                  title: 'Micro-Enterprise Trade License or Kebele Permit',
                  desc: 'Formal commercial permit or provisional youth enterprise letter.',
                  tip: 'Issued by Sodo City Trade & Industry Bureau or Micro/Small Enterprise Desk.',
                },
                {
                  id: 'has_written_business_plan' as const,
                  title: 'Written Business Plan & Cost Breakdown',
                  desc: 'Clear articulation of target market, unit costs, pricing, and expected cash flow.',
                  tip: 'Use our SodoBiz Business Launchpad to generate your complete plan in 10 minutes.',
                },
                {
                  id: 'has_solidarity_group' as const,
                  title: 'Peer Solidarity Group (3 to 5 Members)',
                  desc: 'Group guarantee model allowing youth without land/house collateral to co-guarantee each other.',
                  tip: 'Organized with fellow TVET graduates or Sodo Youth Center cohort peers.',
                },
                {
                  id: 'has_recorded_bookkeeping' as const,
                  title: 'Recorded Bookkeeping (14+ Days of Sales)',
                  desc: 'Demonstrated history of daily cash/telebirr sales and basic operational expenses.',
                  tip: 'Use the SodoBiz transaction recorder to establish verified proof of sales.',
                },
                {
                  id: 'willing_to_attend_training' as const,
                  title: 'Financial Literacy & Debt Management Commitment',
                  desc: 'Willingness to complete the mandatory 2-hour pre-loan orientation.',
                  tip: 'Access free modules right inside SodoBiz Bridge learning library.',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    readiness[item.id]
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(readiness[item.id])}
                      onChange={() => handleCheckboxChange(item.id)}
                      className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-800">{item.title}</div>
                      <div className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</div>
                      <div className="text-[10px] text-teal-700 font-medium pt-1 flex items-center gap-1">
                        <Info className="w-3 h-3 shrink-0" />
                        <span>{item.tip}</span>
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigate('/business-launchpad')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <span>Draft Business Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('/dashboard/learning')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-1"
              >
                <span>Study Loan Modules</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Verified Sodo Loan Products */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Verified Sodo Youth Finance Catalog</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Exact terms, real interest rates, and transparent collateral requirements verified with local branches.
              </p>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {products.map((prod) => (
                <div key={prod.id} className="py-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                        {(prod.product_type || prod.category || 'Loan').replace('_', ' ')}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{prod.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{prod.institution_name || 'Verified Sodo Institution'}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block text-[10px] uppercase">Loan Limit</span>
                      <span className="text-sm font-bold text-slate-900 font-mono">
                        Up to {(prod.max_amount || 50000).toLocaleString()} {prod.currency || 'ETB'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{prod.description || prod.interest_rate_desc}</p>

                  {/* Product Terms Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-lg text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Interest Rate</span>
                      <span className="font-semibold text-slate-800">{prod.interest_rate_annual || 9.5}% / year</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Max Tenure</span>
                      <span className="font-semibold text-slate-800">{prod.repayment_period_months || 24} months</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Collateral Model</span>
                      <span className="font-semibold text-slate-800 capitalize">{(prod.collateral_type || 'Group Guarantee').replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Trade License</span>
                      <span className="font-semibold text-slate-800">{prod.trade_licence_required ? 'Mandatory' : 'Exempted for Cohorts'}</span>
                    </div>
                  </div>

                  {/* Requirements List */}
                  <div className="text-xs space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Required Documentation:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {(prod.requirements || prod.required_documents || []).map((req: string, idx: number) => (
                        <span key={idx} className="text-[11px] text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Branch Contact & Physical Application Channel */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-2">
                    <span className="font-medium text-slate-700">Official Channel: {prod.official_application_channel}</span>
                    <span className="text-teal-700 font-semibold">{prod.contact_phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
