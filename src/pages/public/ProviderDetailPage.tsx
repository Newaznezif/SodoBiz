import React, { useState } from 'react';
import { db } from '../../lib/db';
import { useAuth } from '../../lib/auth-context';
import {
  Building,
  MapPin,
  Phone,
  Globe,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Share2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { ProviderService } from '../../types';

interface ProviderDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProviderDetailPage: React.FC<ProviderDetailPageProps> = ({ slug, onNavigate }) => {
  const { currentUser, currentBusiness } = useAuth();
  const provider = db.getProviderBySlug(slug);
  const services = provider ? db.getServices(provider.id) : [];

  // Referral consent modal state
  const [selectedService, setSelectedService] = useState<ProviderService | null>(null);
  const [consentProfile, setConsentProfile] = useState(true);
  const [consentRevenue, setConsentRevenue] = useState(true);
  const [consentReadiness, setConsentReadiness] = useState(true);
  const [referralNotes, setReferralNotes] = useState('');
  const [submittedReferral, setSubmittedReferral] = useState(false);

  if (!provider) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <p className="text-slate-600">Provider not found.</p>
        <button
          onClick={() => onNavigate('/providers')}
          className="text-teal-700 font-semibold text-xs inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Providers Directory
        </button>
      </div>
    );
  }

  const handleConsentSubmit = () => {
    if (!currentBusiness) {
      alert('Please complete your business profile before requesting an institutional referral.');
      onNavigate('/dashboard/business');
      return;
    }

    const scopes: string[] = [];
    if (consentProfile) scopes.push('business_profile');
    if (consentRevenue) scopes.push('monthly_revenue_summary');
    if (consentReadiness) scopes.push('readiness_checklist');

    db.createReferral({
      business_id: currentBusiness.id,
      owner_id: currentUser.id,
      provider_id: provider.id,
      service_id: selectedService ? selectedService.id : services[0]?.id || 'general',
      status: 'submitted',
      consent_given_at: new Date().toISOString(),
      consent_scope: scopes,
      notes: referralNotes,
    });

    setSubmittedReferral(true);
  };

  return (
    <div className="bg-slate-50 py-12 sm:py-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <button
          onClick={() => onNavigate('/providers')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Providers</span>
        </button>

        {/* Provider Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider capitalize">
                  {provider.organization_type.replace('_', ' ')}
                </span>
                <span className="text-[11px] text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded font-semibold inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{provider.verification_status === 'verified' ? 'Verified Institution' : 'Pending Verification'}</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {provider.organization_name}
              </h1>
            </div>

            <div className="text-right text-xs text-slate-500">
              <div>Last Verified</div>
              <div className="font-mono text-slate-700 font-medium">
                {new Date(provider.last_verified_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
            {provider.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Physical Location:</span>
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{provider.location}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Official Phone:</span>
              <div className="font-semibold text-slate-800 flex items-center gap-1.5 font-mono">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{provider.official_phone}</span>
              </div>
            </div>

            {provider.official_website && (
              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Official Portal:</span>
                <div>
                  <a
                    href={provider.official_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-teal-700 hover:underline flex items-center gap-1"
                  >
                    <Globe className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Visit Website</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Published Services & Requirements */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Available Services & Loan Facilities ({services.length})
          </h2>

          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">{service.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{service.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setSubmittedReferral(false);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors shrink-0 whitespace-nowrap"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Request Consented Referral</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="space-y-1.5">
                    <span className="font-semibold text-slate-800">Target Eligibility:</span>
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {service.eligibility}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-semibold text-slate-800">Prerequisite Documentation:</span>
                    <ul className="space-y-1 text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {service.requirements.map((req, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consent Modal Dialog */}
        {selectedService && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
              <div className="space-y-1 border-b border-slate-200 pb-3">
                <div className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                  Consent-Based Referral Authorization
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Referral to {provider.organization_name}
                </h3>
                <p className="text-xs text-slate-500">Service: {selectedService.title}</p>
              </div>

              {!submittedReferral ? (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/80 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      SodoBiz Bridge does not share your raw transaction entries. You choose exactly which aggregated summaries the institution can review.
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-800">Select Information to Share:</div>
                    <label className="flex items-center gap-2.5 p-2 rounded border border-slate-200 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentProfile}
                        onChange={(e) => setConsentProfile(e.target.checked)}
                        className="rounded text-teal-600"
                      />
                      <span>Business Profile (Name, sector, location, operating duration)</span>
                    </label>

                    <label className="flex items-center gap-2.5 p-2 rounded border border-slate-200 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentRevenue}
                        onChange={(e) => setConsentRevenue(e.target.checked)}
                        className="rounded text-teal-600"
                      />
                      <span>Monthly Revenue & Expense Aggregates (No individual receipt lines)</span>
                    </label>

                    <label className="flex items-center gap-2.5 p-2 rounded border border-slate-200 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentReadiness}
                        onChange={(e) => setConsentReadiness(e.target.checked)}
                        className="rounded text-teal-600"
                      />
                      <span>Business Readiness Checklist Score & Completed Milestones</span>
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-800">
                      Optional Notes or Planned Capital Use:
                    </label>
                    <textarea
                      value={referralNotes}
                      onChange={(e) => setReferralNotes(e.target.value)}
                      placeholder="e.g., Applying for seasonal inventory restock for upcoming Meskel market week..."
                      rows={3}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedService(null)}
                      className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConsentSubmit}
                      disabled={!consentProfile && !consentRevenue && !consentReadiness}
                      className="px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold text-xs shadow-sm"
                    >
                      Confirm Consent & Transmit Referral
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    Referral Consent Submitted Successfully!
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                    Your readiness profile has been queued for {provider.organization_name}. You can track the processing status or withdraw consent at any time in your referrals dashboard.
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={() => onNavigate('/dashboard/referrals')}
                      className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs"
                    >
                      View Referral Status
                    </button>
                    <button
                      onClick={() => setSelectedService(null)}
                      className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
