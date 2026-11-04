import React, { useState } from 'react';
import { db } from '../../lib/db';
import { Provider } from '../../types';
import { Building, MapPin, Phone, ExternalLink, ShieldCheck, Clock, Search, Filter } from 'lucide-react';

interface ProvidersPageProps {
  onNavigate: (path: string) => void;
  onSelectProvider: (slug: string) => void;
}

export const ProvidersPage: React.FC<ProvidersPageProps> = ({ onNavigate, onSelectProvider }) => {
  const providers = db.getProviders();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = providers.filter((p) => {
    const matchesType = filterType === 'all' || p.organization_type === filterType;
    const matchesSearch =
      p.organization_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="bg-slate-50 py-12 sm:py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="max-w-3xl space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-700">Institutional Directory</div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Verified Financial Institutions & Support Providers
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            All listed organizations are verified by SodoBiz administrators. Discover legitimate microfinance providers, commercial banks, municipal enterprise offices, and cooperative unions serving Wolaita Sodo.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by provider name, location, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Type filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Organizations' },
              { id: 'bank', label: 'Banks' },
              { id: 'microfinance', label: 'Microfinance (MFIs)' },
              { id: 'cooperative', label: 'Cooperatives (SACCOs)' },
              { id: 'government_office', label: 'MSE Public Offices' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition-colors ${
                  filterType === tab.id
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((provider) => {
            const isVerified = provider.verification_status === 'verified';
            const services = db.getServices(provider.id);

            return (
              <div
                key={provider.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider capitalize">
                      {provider.organization_type.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                        isVerified
                          ? 'bg-teal-50 text-teal-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {isVerified ? 'Verified Partner' : 'Verification Pending'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {provider.organization_name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                      {provider.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{provider.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{provider.official_phone}</span>
                    </div>
                  </div>

                  {services.length > 0 && (
                    <div className="pt-2 text-xs">
                      <span className="font-semibold text-slate-800">Available Facilities:</span>
                      <ul className="mt-1 space-y-1 text-slate-600 text-[11px]">
                        {services.slice(0, 2).map((s) => (
                          <li key={s.id} className="truncate">· {s.title}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Verified: {new Date(provider.last_verified_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => {
                      onSelectProvider(provider.slug);
                      onNavigate(`/providers/${provider.slug}`);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                  >
                    View Details & Requirements
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
