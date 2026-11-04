import React from 'react';
import { useAuth } from '../../lib/auth-context';
import {
  ArrowRight,
  Briefcase,
  DollarSign,
  Rocket,
  Award,
  GraduationCap,
  LifeBuoy,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Users,
  Target,
  FileCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const LandingPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();

  const getDashboardTarget = () => {
    switch (currentUser.role) {
      case 'youth':
        return '/youth/dashboard';
      case 'employer':
        return '/employer/dashboard';
      case 'mentor':
        return '/mentor/dashboard';
      case 'agent':
        return '/agent/dashboard';
      case 'provider':
        return '/provider/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'entrepreneur':
      default:
        return '/dashboard';
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-14 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Vision & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-950/80 border border-teal-800/60 text-teal-300 text-xs font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                <span>Sodo Innovation HackLab Initiative · Wolaita Sodo, Ethiopia</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                From Ideas to Income — One Bridge to Opportunity.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                A locally driven, inclusive Youth Livelihood and Opportunity Management System for Wolaita Sodo. Connecting youth to verified jobs, apprenticeships, TVET cohorts, loan readiness, and mentorship—while holding employers accountable for promised placements.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => onNavigate('/opportunities')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-colors shadow-lg shadow-teal-900/30 whitespace-nowrap"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Browse Opportunities</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate(getDashboardTarget())}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-colors border border-slate-700 whitespace-nowrap"
                >
                  <span>Open {currentUser.role === 'youth' ? 'Youth Portal' : `${currentUser.role} Portal`}</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>41 Participating Employers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>Verified 60-Day Retained Jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>No Broker Fees</span>
                </div>
              </div>
            </div>

            {/* Right Column: Authentic Photography & Sodo Snapshot */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950">
                <img
                  src="/src/assets/images/sodobiz_hero_entrepreneur_1792923960799.jpg"
                  alt="Young Ethiopian job candidate and micro-entrepreneur reviewing opportunities in Wolaita Sodo"
                  className="w-full h-56 sm:h-64 object-cover"
                />
                <div className="p-5 bg-slate-900 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Sodo HackLab Cohort Snapshot</span>
                    <span className="text-teal-400 font-mono text-[11px]">Active TVET Cohort 1</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                      <div className="text-[11px] text-slate-400">Youth Center Candidates</div>
                      <div className="text-base font-bold text-teal-400 font-mono tabular-nums">54 Selected</div>
                    </div>
                    <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                      <div className="text-[11px] text-slate-400">TVET Cohort 1</div>
                      <div className="text-base font-bold text-amber-400 font-mono tabular-nums">40 Enrolled (Goal 1k)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sodo Innovation HackLab Problem Context Strip */}
      <section className="bg-slate-100 border-y border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">Ground Reality & Evidence</span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Field Mission Findings in Wolaita Sodo
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Why an opportunity management system is essential: opportunities exist in Sodo, but they have been fragmented, unaccountable, and inaccessible.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
              <div className="text-2xl font-bold text-slate-900 font-mono">306 → 41</div>
              <div className="font-semibold text-slate-800">Business Partnership Gap</div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                306 businesses were approached across Sodo; 41 joined. 117 businesses were mapped in town. SodoBiz Bridge gives businesses a shared portal to publish placements.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
              <div className="text-2xl font-bold text-rose-600 font-mono">&lt; 1 in 5</div>
              <div className="font-semibold text-slate-800">The Retention Bottleneck</div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Fewer than one in five promised jobs resulted in youth still employed after 60 days. Our Commitment Tracker publicly audits promised vs delivered retention.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
              <div className="text-2xl font-bold text-amber-600 font-mono">TIN & Debt Fear</div>
              <div className="font-semibold text-slate-800">Finance Barriers Demystified</div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Youth-focused loan products exist in Sodo, but few use them due to trade licence/TIN hurdles and fear of debt. Our Finance Bridge checklist prepares youth before applying.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
              <div className="text-2xl font-bold text-teal-700 font-mono">40 of 1,000</div>
              <div className="font-semibold text-slate-800">Vocational TVET Cohorts</div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                40 youth entered Cohort 1 against a regional goal of 1,000. SodoBiz coordinates digital, agro, automotive, and hospitality TVET cohorts directly with industry partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 6 Connected Opportunity Journey Pillars */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">The Connected Journey</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Discover → Prepare → Connect → Apply → Follow Up → Track
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Not a passive job board. A complete opportunity management system tailored to Sodo's local economy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pillar 1: Opportunity Hub */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-teal-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">1. Sodo Opportunity Hub</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Search verified jobs, apprenticeships, and TVET cohorts from Damota Agro, Wolaita Digital Hub, Highlands Automotive, and local merchants.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/opportunities')}
              className="mt-5 text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 self-start"
            >
              <span>Explore active listings</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 2: Finance Bridge */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">2. Youth Finance Bridge</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Demystifying loan terms from Omo Bank and VisionFund. Interactive readiness checklists covering TIN, trade licence exemptions, and solidarity groups.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/finance-bridge')}
              className="mt-5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start"
            >
              <span>Check loan readiness</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 3: Business Launchpad */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-amber-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Rocket className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">3. Business Launchpad</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Structure micro-enterprise ideas into viable cash-flow plans. Generate printable proposals for HackLab micro-grants and peer solidarity groups.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/business-launchpad')}
              className="mt-5 text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 self-start"
            >
              <span>Build business plan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 4: TVET Skills Cohort */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-indigo-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">4. TVET Skills Cohorts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track progress toward the 1,000-youth regional TVET target. Apply for Cohort 2 in digital payments, automotive maintenance, and specialty coffee.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/skills-tvet')}
              className="mt-5 text-xs font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 self-start"
            >
              <span>View cohort tracks</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 5: Mentorship */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-purple-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">5. Sodo Mentorship Advisory</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect 1-on-1 with local business leaders in agriculture, fintech, and mechanics for confidential career direction and trade guidance.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/mentorship')}
              className="mt-5 text-xs font-semibold text-purple-700 hover:text-purple-800 flex items-center gap-1 self-start"
            >
              <span>Connect with mentors</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 6: Commitment Tracker */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-slate-400 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">6. Partner Commitment Tracker</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Holding employers accountable: public records of promised vs delivered placements and 60-day retained jobs verified by field agents.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/commitments')}
              className="mt-5 text-xs font-semibold text-slate-800 hover:text-slate-900 flex items-center gap-1 self-start"
            >
              <span>View partner accountability</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Inclusion Callout Strip */}
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Universal Inclusion</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Leaving No Young Person in Wolaita Sodo Behind
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Young people without family backing, smartphones, formal degrees, and youth with disabilities can access walk-in support, sign language assistance, and legal advice.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/support-directory')}
            className="px-5 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition-colors whitespace-nowrap shrink-0"
          >
            Open Support Directory
          </button>
        </div>
      </section>
    </div>
  );
};
