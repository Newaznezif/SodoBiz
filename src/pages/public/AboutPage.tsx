import React from 'react';
import { Target, HeartHandshake, Shield, Sparkles, MapPin, Award } from 'lucide-react';

export const AboutPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            About SodoBiz Bridge
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Empowering Ethiopian Micro-Enterprises Through Record-Keeping & Financial Inclusion
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Founded to bridge the information and readiness gap between hardworking informal businesses and formal financial ecosystems in Wolaita Sodo and southern Ethiopia.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Our Mission</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              To equip small business owners, women micro-entrepreneurs, and youth trade ventures with simple digital bookkeeping tools and verified institutional pathways that turn daily commercial hustle into credible records.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Our Vision</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              A thriving regional economy in Wolaita Sodo where every viable micro-enterprise has full visibility into its profitability, complete ownership over its business data, and fair, transparent access to legitimate financial products.
            </p>
          </div>
        </div>

        {/* The Wolaita Sodo Pilot */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-teal-700 font-semibold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Why Wolaita Sodo?</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            A Hub of Hustle, Commerce, and Untapped Potential
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Wolaita Sodo is one of the fastest-growing commercial transit hubs in southern Ethiopia, connecting agricultural producers in Damot Gale and Boloso Sore with traders traveling to Hawassa and Addis Ababa. 
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Despite this energetic marketplace, over 78% of local market stalls operate without written records or maintain fragmented notes in easily damaged exercise books. When sudden capital needs arise, shop owners face either high-cost informal lenders or complex bank requirements they cannot substantiate.
          </p>
        </div>

        {/* Ethical Commitments */}
        <div className="bg-slate-900 text-white p-8 rounded-2xl space-y-6">
          <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Our Core Ethical Commitments</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="space-y-2">
              <div className="font-bold text-white text-sm">No Fake Guarantees</div>
              <p className="leading-relaxed">
                We never tell users that completing a checklist guarantees a loan. We provide honest preparation, not false hopes.
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-bold text-white text-sm">Absolute Consent Control</div>
              <p className="leading-relaxed">
                Your records belong solely to you. No financial institution or third party can view your figures without your explicit checkmark.
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-bold text-white text-sm">Real Local Community</div>
              <p className="leading-relaxed">
                We partner with accredited institutions like Omo Bank and VisionFund, alongside local youth business support agents on the ground.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
