import React from 'react';
import { ArrowRight, UserPlus, BookOpen, CheckSquare, Share2, ShieldCheck, HeartHandshake } from 'lucide-react';

export const HowItWorksPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const steps = [
    {
      step: '01',
      title: 'Register & Complete Business Profile',
      desc: 'Set up your free entrepreneur account in under 2 minutes. Add your trade type (retail, grain mill, crafts, food stall), location in Wolaita Sodo, and current worker count.',
      icon: UserPlus,
    },
    {
      step: '02',
      title: 'Log Daily Sales & Operating Costs',
      desc: 'Enter everyday cash and telebirr transactions on your smartphone or browser. The system separates revenue from operational expenses (restock, transport, rent) to calculate your true operating result.',
      icon: BookOpen,
    },
    {
      step: '03',
      title: 'Track Products & Inventory Alerts',
      desc: 'Add items you sell with selling price and cost price. Receive immediate alerts when critical stock runs low before you run out of merchandise on busy market days.',
      icon: CheckSquare,
    },
    {
      step: '04',
      title: 'Complete Readiness Milestones',
      desc: 'Work through the standard business readiness checklist: license status, separate banking records, and business goals. Generate an exportable profile summary you can print.',
      icon: ShieldCheck,
    },
    {
      step: '05',
      title: 'Explore Verified Providers & Consent Referrals',
      desc: 'Discover authorized financial institutions (Omo Bank, VisionFund, Wasasa MFI, RuSACCOs). When you decide to apply, authorize a secure referral with exact consent over what information is shared.',
      icon: Share2,
    },
    {
      step: '06',
      title: 'Receive Guidance from Local Support Agents',
      desc: 'If assigned a youth business-support agent, receive in-person counseling at your store to audit your books, clarify loan conditions, and follow up on institutional applications.',
      icon: HeartHandshake,
    },
  ];

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            The Entrepreneur Journey
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How SodoBiz Bridge Works
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            A practical, step-by-step roadmap that transforms everyday transaction chaos into organized records and credible business readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-teal-400 font-black flex items-center justify-center text-sm font-mono">
                    {item.step}
                  </div>
                  <Icon className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-2xl text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold">Start Building Your Verified Profile Today</h2>
          <p className="text-xs text-slate-300 max-w-xl mx-auto">
            Take the first step toward clearer business insights and better opportunities in Wolaita Sodo.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
            >
              <span>Go to Entrepreneur Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
