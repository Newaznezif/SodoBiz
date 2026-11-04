import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { Building, Share2, CheckCircle2, ShieldAlert, ArrowRight, Eye, Phone, MapPin } from 'lucide-react';
import { Referral, ReferralStatus } from '../../types';

export const ProviderDashboard: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser, refreshData } = useAuth();
  const providers = db.getProviders();

  // Find provider linked to current user or default to Omo Bank
  const provider = providers.find((p) => p.id === 'prov-omo') || providers[0];
  const services = db.getServices(provider.id);
  const referrals = db.getReferrals({ providerId: provider.id });
  const businesses = db.getBusinesses();

  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);

  const handleUpdateStatus = (refId: string, status: ReferralStatus) => {
    db.updateReferralStatus(refId, status, currentUser.id);
    refreshData();
    if (selectedReferral?.id === refId) {
      setSelectedReferral((prev) => (prev ? { ...prev, status } : null));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border-b border-slate-200 pb-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-teal-700">
          Financial Institution & Partner Portal
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
          {provider.organization_name}
        </h1>
        <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
          <span>{provider.location}</span>
          <span>·</span>
          <span className="text-teal-700 font-semibold uppercase">Verified Institution Partner</span>
          <span>·</span>
          <span>Official Contact: {provider.official_phone}</span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Incoming Consented Referrals</span>
            <Share2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {referrals.length}
          </div>
          <div className="text-[11px] text-slate-400">Strictly consented submissions only</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active Published Services</span>
            <Building className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {services.length}
          </div>
          <div className="text-[11px] text-slate-400">Micro credit & working capital programs</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Verification Status</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-lg font-bold text-teal-800 capitalize">
            {provider.verification_status}
          </div>
          <div className="text-[11px] text-slate-400">
            Audited on {new Date(provider.last_verified_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* RLS Privacy Notice for Providers */}
      <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-950 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Institutional Access Boundary:</strong> In compliance with Ethiopian consumer protection and SodoBiz Bridge security rules, financial service providers cannot browse unrelated business records. You can only inspect profiles and summaries for entrepreneurs who have explicitly submitted consent.
        </div>
      </div>

      {/* Referrals Review & Processing Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Incoming Entrepreneur Referrals ({referrals.length})
        </h2>

        {referrals.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No incoming referrals at this time.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5 px-3">Date Submitted</th>
                  <th className="py-2.5 px-3">Enterprise Name</th>
                  <th className="py-2.5 px-3">Service Applied</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {referrals.map((r) => {
                  const b = businesses.find((biz) => biz.id === r.business_id);
                  const s = services.find((srv) => srv.id === r.service_id);

                  return (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono text-slate-500">
                        {new Date(r.consent_given_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {b?.name || r.business_id}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {s?.title || 'Micro Loan Facility'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 capitalize">
                          {r.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => setSelectedReferral(r)}
                          className="px-3 py-1 rounded bg-slate-900 text-white font-semibold text-[11px] hover:bg-slate-800"
                        >
                          Review Dossier
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Dossier Modal */}
      {selectedReferral && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                  Consented Referral Dossier
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {businesses.find((b) => b.id === selectedReferral.business_id)?.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReferral(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <div className="font-semibold text-slate-700">Consent Authorization:</div>
                <div className="text-slate-500">
                  Granted: {new Date(selectedReferral.consent_given_at).toLocaleString()}
                </div>
                <div className="text-slate-500">
                  Scope: {selectedReferral.consent_scope.join(', ')}
                </div>
              </div>

              {selectedReferral.notes && (
                <div className="space-y-1">
                  <div className="font-semibold text-slate-700">Entrepreneur Statement:</div>
                  <p className="p-2.5 rounded border border-slate-200 text-slate-700">
                    {selectedReferral.notes}
                  </p>
                </div>
              )}

              {/* Status Update Controls */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="font-semibold text-slate-700">Update Referral Processing Status:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'in_review', label: 'Mark In Review' },
                    { id: 'additional_info_requested', label: 'Request More Info' },
                    { id: 'referred_to_official_channel', label: 'Refer to Piazza Branch' },
                    { id: 'closed', label: 'Close Referral' },
                  ].map((act) => (
                    <button
                      key={act.id}
                      onClick={() => handleUpdateStatus(selectedReferral.id, act.id as ReferralStatus)}
                      className="p-2 rounded border border-slate-200 text-[11px] hover:bg-slate-100 font-medium text-slate-800 transition-colors"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
