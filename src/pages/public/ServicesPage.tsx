import React from 'react';
import { Receipt, BarChart3, Package, GraduationCap, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';

export const ServicesPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const services = [
    {
      title: 'Digital Sales & Expense Ledger',
      description: 'Record cash, telebirr, and CBE transactions with positive-amount validation, categorisation, and date filtering.',
      features: ['Calculates operating profit from transaction records', 'Distinguishes sales from owner contributions and loans', 'Filter by date range and category'],
      icon: Receipt,
    },
    {
      title: 'Product & Stock Management',
      description: 'Manage merchandise catalogs with selling and cost prices, inventory quantities, and automated low-stock threshold alerts.',
      features: ['Tracks units in stock', 'Highlights items requiring re-order', 'Prevents unrecorded stock depletion'],
      icon: Package,
    },
    {
      title: 'Financial Performance Reporting',
      description: 'View monthly revenue trends, expense breakdowns, and print-ready summary statements in Ethiopian Birr.',
      features: ['Downloadable CSV export', 'Print-friendly official business summary', 'Transparent formula disclaimers'],
      icon: BarChart3,
    },
    {
      title: 'Business-Readiness Profile & Audits',
      description: 'A structured 9-point checklist covering documentation, financial separation, licensing, and provider prerequisites.',
      features: ['Tracks status: not started, in progress, completed', 'Downloadable verified PDF/printout', 'Identifies immediate next actions'],
      icon: ShieldCheck,
    },
    {
      title: 'Practical Financial Literacy Lessons',
      description: '12 bite-sized lessons written in plain English, Amharic, and Wolaita with realistic local market examples.',
      features: ['Interactive knowledge quizzes', 'Practical examples in Ethiopian Birr', 'Loan scam prevention guidelines'],
      icon: GraduationCap,
    },
    {
      title: 'Verified Financial Service Referrals',
      description: 'Explore approved MFIs, commercial banks, and cooperatives with transparent eligibility requirements and consent-based referral submissions.',
      features: ['Explicit consent scope selection', 'Status tracking: submitted, in review, approved', 'Revocable authorization'],
      icon: HeartHandshake,
    },
  ];

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-700">Platform Capabilities</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Integrated Tools for Micro-Enterprises
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every feature is designed specifically for small shops, grain millers, coffee houses, and artisans in Wolaita Sodo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{srv.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{srv.description}</p>
                  </div>
                  <ul className="space-y-1.5 pt-2 border-t border-slate-200/80 text-xs text-slate-600">
                    {srv.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-start gap-2">
                        <span className="text-teal-600 font-bold">·</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => onNavigate('/dashboard')}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
                  >
                    <span>Try in Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
