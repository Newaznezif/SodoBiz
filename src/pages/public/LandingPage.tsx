import React from 'react';
import { useAuth } from '../../lib/auth-context';
import {
  ArrowRight,
  Receipt,
  Package,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Building,
  Users,
  FileCheck,
  HelpCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export const LandingPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { t, currentUser } = useAuth();

  const getStartedTarget = currentUser.role === 'entrepreneur' ? '/dashboard' : '/dashboard/business';

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-950/80 border border-teal-800/60 text-teal-300 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {t.hero.headline}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {t.hero.subheadline}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => onNavigate(getStartedTarget)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-colors shadow-lg shadow-teal-900/30 whitespace-nowrap"
                >
                  <span>{t.hero.primaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('/how-it-works')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-colors border border-slate-700 whitespace-nowrap"
                >
                  <span>{t.hero.secondaryCta}</span>
                </button>
              </div>

              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>Simple Cash & Telebirr Logging</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>No Auditing Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>Full Consent Control</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Dashboard Mockup & Authentic Photography */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950">
                <img
                  src="/src/assets/images/sodobiz_hero_entrepreneur_1792923960799.jpg"
                  alt="Micro-enterprise shopkeeper reviewing sales records in Wolaita Sodo"
                  className="w-full h-56 sm:h-64 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-5 bg-slate-900 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Live Business Snapshot</span>
                    <span className="text-teal-400 font-mono text-[11px]">Asegedech Spice & Grain Mill</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                      <div className="text-[11px] text-slate-400">Total Recorded Sales</div>
                      <div className="text-base font-bold text-teal-400 font-mono tabular-nums">26,740 ETB</div>
                    </div>
                    <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                      <div className="text-[11px] text-slate-400">Est. Operating Result</div>
                      <div className="text-base font-bold text-amber-400 font-mono tabular-nums">+15,740 ETB</div>
                    </div>
                  </div>

                  <div className="p-3 bg-teal-950/40 rounded-lg border border-teal-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-300">Readiness Score</span>
                    <span className="font-bold text-teal-300 font-mono">88% (Ready for Review)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-teal-700">The Problem Small Businesses Face</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Without Organised Records, Growth Stalls.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every day, thousands of merchants in Wolaita Sodo, Bedesa, and Areka conduct honest commerce. But when financial institutions ask for verification, informal businesses face high hurdles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">Unrecorded Cash & Mobile Flows</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sales collected through loose cash boxes and personal telebirr accounts get lost. Owners cannot tell their true profit from personal spending.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">Inability to Prove Turnover to MFIs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When approaching Omo Bank or VisionFund for working capital, entrepreneurs have no structured documentation demonstrating past sales history.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">Predatory Scams & Confusion</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Informal traders fall victim to fake digital lenders demanding upfront "registration fees". Clear educational guidance protects hard-earned savings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-teal-700">Simple 4-Step Journey</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              From Daily Receipts to Structured Readiness
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">Record Every Transaction</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log cash and telebirr sales and expenses in seconds on your mobile phone or browser.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">Understand Operating Profit</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                See instant summaries: total sales minus cost of goods and shop rent. No accounting jargon.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">Build Readiness Profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track compliance checklists: licenses, separated banking, stock lists, and generate exportable summaries.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900">Refer with Explicit Consent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Share your verified readiness packet with licensed MFIs and youth support agents on your terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Agents & Marketplace Spotlight */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                Local Human Support
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                Supported by Trained Youth Business-Support Agents
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Technology alone is not enough. SodoBiz Bridge partners with trained local youth counselors in Wolaita Sodo who visit market stalls, assist with digitizing paper ledgers, and guide entrepreneurs through readiness checklists.
              </p>
              <div className="space-y-2 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>One-on-one assistance sessions with private internal counselor notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Strict assignment boundaries preventing unauthorized record browsing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Preparation for Omo Bank, VisionFund, and municipal MSE programs</span>
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/services')}
                  className="px-5 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Explore Support Services
                </button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              <img
                src="/src/assets/images/sodobiz_agent_support_1792923961462.jpg"
                alt="Business counselor assisting an entrepreneur with records in Wolaita Sodo"
                className="w-full h-80 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Verified Providers Preview */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-teal-700">Institution Directory</h2>
              <p className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                Verified Sodo Financial & Support Organizations
              </p>
            </div>
            <button
              onClick={() => onNavigate('/providers')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
            >
              <span>View All Verified Providers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Commercial & Micro Bank</span>
                <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-medium">Verified</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Omo Bank S.C. (Sodo Piazza)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Offers micro-enterprise working capital loans and seasonal grain trading facilities with verified record requirements.
              </p>
              <div className="pt-2 text-xs text-slate-500 font-mono">
                Piazza Commercial District, Wolaita Sodo
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Microfinance Institution</span>
                <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-medium">Verified</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">VisionFund MFI Sodo Branch</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specialized in women entrepreneur empowerment loans, group guarantees, and agricultural trade working capital.
              </p>
              <div className="pt-2 text-xs text-slate-500 font-mono">
                Near WSU University Main Gate, Hospital Rd
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Municipal Development Office</span>
                <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-medium">Verified</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Wolaita MSE Development Office</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Facilitates formal business licensing, trade exhibitions, subsidized market shades, and vocational entrepreneurship workshops.
              </p>
              <div className="pt-2 text-xs text-slate-500 font-mono">
                Municipal Complex, Wolaita Sodo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-teal-700">Frequently Asked Questions</h2>
            <p className="text-2xl font-bold text-slate-900">Clear Facts About SodoBiz Bridge</p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Does SodoBiz Bridge issue loans or credit directly?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No. SodoBiz Bridge is a digital record-keeping and business readiness platform. It does not provide loans, guarantee loan approval, or set interest rates. All credit decisions remain strictly with licensed financial institutions like Omo Bank or VisionFund.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Who can see my business transaction numbers?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Only you. Your transaction entries are protected by strict Row-Level Security. Neither third parties nor service providers can view your sales records unless you explicitly check the consent box to share a summary for an authorized referral.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Can I use the app in Amharic or Wolaita?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes. The platform supports English, Amharic (አማርኛ), and Wolaita (Wolayttatto) so local business owners can easily navigate transactions and learning materials in their preferred language.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Turn Daily Records Into Real Opportunities?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Start logging your sales and expenses today, build your readiness score, and prepare your business for legitimate institutional partnerships.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate(getStartedTarget)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-colors shadow-lg"
            >
              <span>Start Your Business Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
