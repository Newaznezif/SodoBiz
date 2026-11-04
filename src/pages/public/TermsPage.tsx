import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export const TermsPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-700">Legal Agreement</div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500">Effective Date: October 2026 · Wolaita Sodo, Ethiopia</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Important Financial Disclaimer</span>
            </div>
            <p className="text-xs text-amber-950">
              SodoBiz Bridge provides digital micro-enterprise record-keeping tools and financial literacy education. SodoBiz Bridge is NOT a licensed bank, microfinance institution, or credit union under the National Bank of Ethiopia. It does NOT issue loans, make credit decisions, or guarantee financing from third-party partners.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Nature of the Service</h2>
            <p>
              The platform assists micro-entrepreneurs in organizing sales, tracking inventory, understanding estimated operating results, and preparing structured business documentation. All profit figures are calculations derived from user-entered records, not certified accounting audits.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. User Responsibility & Accuracy</h2>
            <p>
              Users are solely responsible for the accuracy and completeness of the figures they enter. Fabricating sales figures or presenting false information to financial institutions violates this agreement and may lead to legal penalties under Ethiopian commerce statutes.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Independent Third-Party Providers</h2>
            <p>
              Verified financial institutions listed on SodoBiz Bridge (such as Omo Bank, VisionFund, Wasasa MFI, and RuSACCOs) operate independently. Each provider enforces its own legal eligibility, interest rates, underwriting criteria, and loan agreements. Submitting a referral through SodoBiz Bridge does not guarantee acceptance or credit approval.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Limitation of Liability</h2>
            <p>
              SodoBiz Bridge is not liable for commercial losses, loan rejections, or business disputes arising from the use of its digital tools, reports, or educational lessons.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
