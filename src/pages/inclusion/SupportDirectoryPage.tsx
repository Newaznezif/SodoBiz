import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { SupportService } from '../../types';
import {
  LifeBuoy,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Search,
  CheckCircle2,
  HeartHandshake,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

export const SupportDirectoryPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const [services, setServices] = useState<SupportService[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactedService, setContactedService] = useState<string | null>(null);

  useEffect(() => {
    const list = db.getSupportServices();
    setServices(list);
  }, []);

  const filteredServices = services.filter((s) => {
    const name = (s.name || '').toLowerCase();
    const desc = (s.description || s.eligibility || '').toLowerCase();
    const tg = (s.target_group || s.category || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = name.includes(q) || desc.includes(q) || tg.includes(q);
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>Inclusive Community Services</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Youth Inclusion & Support Directory
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Opportunity must not exclude youth without smartphones, degrees, family backing, or young people with disabilities. Access verified local physical walk-in centers offering legal rights advice, psychosocial counseling, assistive accommodations, and wellness.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by need or target group (e.g. disability, counseling, legal, offline)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['all', 'disability', 'counseling', 'health', 'legal'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors capitalize ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat === 'all' ? 'All Services' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {contactedService && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              Referral slip generated for <strong>{contactedService}</strong>. You may walk in during operating hours with no appointment fee.
            </span>
          </div>
          <button
            onClick={() => setContactedService(null)}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                  {service.category}
                </span>
                <span className="text-[11px] font-semibold text-slate-600 font-mono">
                  {service.target_group}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{service.name}</h3>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{service.provider}</div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{service.description}</p>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{service.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{service.operating_hours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="font-semibold text-slate-800">{service.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Free / Confidential</span>
              </span>

              <button
                onClick={() => setContactedService(service.name)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Request Walk-in Slip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
