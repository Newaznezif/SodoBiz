import React from 'react';
import { useAuth } from '../../lib/auth-context';
import { MapPin, ShieldCheck, BookOpen, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useAuth();

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand & Regional Focus */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <span className="w-7 h-7 rounded bg-teal-600 text-white flex items-center justify-center text-xs font-black">
                SB
              </span>
              <span>{t.appName}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.tagline}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-teal-400 pt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Wolaita Sodo & Southern Ethiopia Pilot Hub</span>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/how-it-works')} className="hover:text-white transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-white transition-colors">
                  Micro-Enterprise Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/financial-literacy')} className="hover:text-white transition-colors">
                  Financial Literacy Lessons
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/providers')} className="hover:text-white transition-colors">
                  Verified Local Providers
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Institutional & Governance */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Governance & Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">
                  Mission & Problem Statement
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors">
                  Contact Advisory Team
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-white transition-colors">
                  Data Consent & Privacy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Regulatory Transparency Notice */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Important Regulatory Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              SodoBiz Bridge provides digital transaction recording, readiness assessment, and educational guidance. It does not issue loans, make credit approvals, or guarantee funding. All financial services are provided directly by authorized, regulated Ethiopian institutions.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>
            © {new Date().getFullYear()} SodoBiz Bridge. Built for Ethiopian micro-enterprises.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('/privacy')} className="hover:text-slate-300">Privacy Policy</button>
            <span>·</span>
            <button onClick={() => onNavigate('/terms')} className="hover:text-slate-300">Terms of Use</button>
            <span>·</span>
            <button onClick={() => onNavigate('/contact')} className="hover:text-slate-300">Community Support</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
