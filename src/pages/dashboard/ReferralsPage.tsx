import React from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { Share2, Building, Clock, CheckCircle2, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { ReferralStatus } from '../../types';

export const ReferralsPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser, currentBusiness, refreshData } = useAuth();

  if (!currentBusiness) {
    return <div className="p-6 bg-white rounded-xl">Please set up your business profile first.</div>;
  }

  const referrals = db.getReferrals({ ownerId: currentUser.id });
  const providers = db.getProviders();
  const services = db.getServices();

  const handleWithdrawConsent = (referralId: string) => {
    if (confirm('Are you sure you wish to withdraw your consent for this referral? The provider will no longer have permission to review your shared summaries.')) {
      db.updateReferralStatus(referralId, 'withdrawn', currentUser.id);
      refreshData();
    }
  };

  const getStatusBadge = (status: ReferralStatus) => {
    switch (status) {
      case 'submitted':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800">Submitted</span>;
      case 'received':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-800">Received by Provider</span>;
      case 'in_review':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800">In Active Review</span>;
      case 'additional_info_requested':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-800">Info Requested</span>;
      case 'referred_to_official_channel':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-800">Referred to Official Branch</span>;
      case 'closed':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800">Closed</span>;
      case 'withdrawn':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-800">Consent Withdrawn</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800">Draft</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Consented Referrals & Linkages</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor submissions to verified local institutions with explicit consent timestamps and revocation controls.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/dashboard/providers')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Building className="w-4 h-4 text-teal-400" />
          <span>Browse Verified Providers</span>
        </button>
      </div>

      {/* Referrals List */}
      <div className="space-y-4">
        {referrals.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-500 space-y-3">
            <Share2 className="w-8 h-8 text-slate-300 mx-auto" />
            <p>You have not submitted any institutional referrals yet.</p>
            <p className="max-w-md mx-auto text-slate-400">
              When you feel ready to explore credit or support programs, visit the verified providers directory to initiate a consent-based referral.
            </p>
            <button
              onClick={() => onNavigate('/dashboard/providers')}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold"
            >
              Explore Sodo Providers
            </button>
          </div>
        ) : (
          referrals.map((ref) => {
            const provider = providers.find((p) => p.id === ref.provider_id);
            const service = services.find((s) => s.id === ref.service_id);

            return (
              <div
                key={ref.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">
                        {provider?.organization_name || 'Verified Institution'}
                      </span>
                      {getStatusBadge(ref.status)}
                    </div>
                    <div className="text-xs text-slate-500">
                      Service facility: <strong>{service?.title || 'General Microfinance Facility'}</strong>
                    </div>
                  </div>

                  <div className="text-right text-xs text-slate-400 font-mono">
                    <div>Consent Granted: {new Date(ref.consent_given_at).toLocaleDateString()}</div>
                    {ref.withdrawn_at && (
                      <div className="text-rose-600">Withdrawn: {new Date(ref.withdrawn_at).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="space-y-1.5">
                    <span className="font-semibold text-slate-700">Authorized Shared Scope:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {ref.consent_scope.map((scope) => (
                        <span
                          key={scope}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]"
                        >
                          {scope.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {ref.notes && (
                    <div className="space-y-1">
                      <span className="font-semibold text-slate-700">Submitted Notes / Purpose:</span>
                      <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        {ref.notes}
                      </p>
                    </div>
                  )}
                </div>

                {ref.status !== 'withdrawn' && ref.status !== 'closed' && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      You retain full rights to revoke data sharing at any moment.
                    </span>
                    <button
                      onClick={() => handleWithdrawConsent(ref.id)}
                      className="text-rose-600 hover:text-rose-800 font-semibold text-xs"
                    >
                      Withdraw Referral Consent
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
