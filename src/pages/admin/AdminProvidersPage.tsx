import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { VerificationStatus } from '../../types';
import { Building, CheckCircle2, XCircle, Clock, ShieldCheck, MapPin, Phone } from 'lucide-react';

export const AdminProvidersPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser, refreshData } = useAuth();
  const providers = db.getProviders();
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleStatusChange = (providerId: string, status: VerificationStatus) => {
    db.updateProviderVerification(providerId, status, currentUser.id);
    refreshData();
    setSuccessNotice(`Provider verification updated to ${status}`);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Institution Verification</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit partner organizations, verify regulatory licenses, and approve public directory publication.
          </p>
        </div>

        {successNotice && (
          <div className="px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs flex items-center gap-1.5 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>{successNotice}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map((p) => {
          const isVerified = p.verification_status === 'verified';
          const isPending = p.verification_status === 'pending';
          const isRejected = p.verification_status === 'rejected';

          return (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider capitalize">
                    {p.organization_type.replace('_', ' ')}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                      isVerified
                        ? 'bg-teal-50 text-teal-800'
                        : isPending
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-rose-50 text-rose-800'
                    }`}
                  >
                    {p.verification_status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{p.organization_name}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{p.description}</p>
                </div>

                <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{p.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{p.official_phone}</span>
                  </div>
                </div>
              </div>

              {/* Status Update Action Bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  Audited: {new Date(p.last_verified_at).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  {p.verification_status !== 'verified' && (
                    <button
                      onClick={() => handleStatusChange(p.id, 'verified')}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors"
                    >
                      Approve & Verify
                    </button>
                  )}
                  {p.verification_status !== 'pending' && (
                    <button
                      onClick={() => handleStatusChange(p.id, 'pending')}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium"
                    >
                      Set Pending
                    </button>
                  )}
                  {p.verification_status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusChange(p.id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
