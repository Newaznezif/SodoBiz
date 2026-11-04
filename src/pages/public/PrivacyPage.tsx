import React from 'react';
import { ShieldCheck, Lock, Eye, FileCheck } from 'lucide-react';

export const PrivacyPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-700">Data Governance</div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy & Consent Framework
          </h1>
          <p className="text-xs text-slate-500">Effective Date: October 2026 · Version 1.0</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-4 bg-teal-50 rounded-xl border border-teal-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-teal-900 text-sm">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Core Principle: You Own Your Business Records</span>
            </div>
            <p className="text-xs text-teal-950">
              SodoBiz Bridge was engineered to ensure that small business transaction data remains under the exclusive control of the business owner. We never sell, rent, or automatically expose your financial records to external entities or third-party advertisers.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              We collect only the minimum information required to calculate business performance and generate structured readiness profiles:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li>Account information: full name, email address, optional contact phone, and preferred language.</li>
              <li>Business details: business name, sector category, location, approximate operating duration, and worker count.</li>
              <li>Transaction records: sales amounts, expense amounts, categories, and dates entered directly by you.</li>
              <li>Inventory items: product titles, selling prices, cost prices, and current stock quantities.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Row-Level Security & Access Authorization</h2>
            <p>
              All application data is isolated using strict PostgreSQL Row-Level Security (RLS). An entrepreneur cannot read or modify another entrepreneur’s transactions. Business-support agents can only access businesses explicitly assigned to them by an administrator.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Consent-Based Referrals</h2>
            <p>
              When requesting a referral to an approved financial institution (e.g., Omo Bank or VisionFund), you explicitly select which aggregated information will be transmitted (such as business profile, monthly sales totals, or readiness scores). Raw daily receipts are never exposed by default. Consent can be revoked or withdrawn at any time.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Data Deletion & Export</h2>
            <p>
              You may download your transactions in CSV format or print your official Business Readiness Profile at any time. You can request account deactivation and data removal through the settings page or by contacting support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
