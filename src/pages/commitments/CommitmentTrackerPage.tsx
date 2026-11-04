import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { PartnerCommitment } from '../../types';
import {
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Users,
  ShieldCheck,
  TrendingUp,
  Filter,
  Search,
  PlusCircle,
  X,
} from 'lucide-react';

export const CommitmentTrackerPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [commitments, setCommitments] = useState<PartnerCommitment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add commitment modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [orgName, setOrgName] = useState('New Sodo Partner Enterprise');
  const [oppType, setOppType] = useState('Apprenticeship');
  const [promised, setPromised] = useState('5');
  const [delivered, setDelivered] = useState('3');
  const [retained, setRetained] = useState('2');
  const [notes, setNotes] = useState('Monitored by Sodo Youth Center agent.');

  useEffect(() => {
    loadCommitments();
  }, []);

  const loadCommitments = () => {
    const list = db.getCommitments();
    setCommitments(list);
  };

  const handleCreateCommitment = (e: React.FormEvent) => {
    e.preventDefault();
    db.createCommitment({
      organization_id: 'org-damota',
      organization_name: orgName,
      opportunity_type: oppType,
      spots_promised: Number(promised) || 1,
      spots_delivered: Number(delivered) || 0,
      verified_retained: Number(retained) || 0,
      commitment_date: new Date().toISOString().slice(0, 10),
      verification_status: Number(retained) >= Number(promised) ? 'delivered' : 'partial',
      last_verified_at: new Date().toISOString().slice(0, 10),
      notes,
    });
    setShowAddModal(false);
    loadCommitments();
  };

  // Aggregated calculations
  const totalPromised = commitments.reduce((sum, c) => sum + (c.spots_promised || 0), 0);
  const totalDelivered = commitments.reduce((sum, c) => sum + (c.spots_delivered || 0), 0);
  const totalRetained = commitments.reduce((sum, c) => sum + (c.verified_retained || 0), 0);
  const overallRetentionRate = totalDelivered > 0 ? Math.round((totalRetained / totalDelivered) * 100) : 0;

  const filteredCommitments = commitments.filter((c) => {
    const org = (c.organization_name || '').toLowerCase();
    const type = (c.opportunity_type || '').toLowerCase();
    const n = (c.notes || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = org.includes(q) || type.includes(q) || n.includes(q);
    const matchesStatus = statusFilter === 'all' || c.verification_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PartnerCommitment['verification_status']) => {
    switch (status) {
      case 'delivered':
        return <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider">Delivered</span>;
      case 'partial':
        return <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider">Partial Retained</span>;
      case 'defaulted':
        return <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider">Defaulted</span>;
      case 'pending':
      default:
        return <span className="text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider">In Progress</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Sodo Innovation HackLab Partner Accountability</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Public Employer Commitment & Placement Tracker
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Field evidence showed fewer than 1 in 5 promised jobs resulted in young people still being employed, with no shared record of employer promises. SodoBiz Bridge enforces transparency by tracking promised vs delivered placements and 60-day youth retention audits.
            </p>
          </div>

          {(currentUser.role === 'admin' || currentUser.role === 'employer' || currentUser.role === 'agent') && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg text-xs font-bold transition-colors shadow-sm self-start md:self-auto shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Commitment</span>
            </button>
          )}
        </div>

        {/* HackLab Field Mission Benchmark Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-slate-800 text-xs">
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[11px]">Businesses Approached</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">306</div>
            <div className="text-[10px] text-slate-500 mt-0.5">117 mapped in Sodo town</div>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[11px]">Active Participating Partners</div>
            <div className="text-xl font-bold text-teal-400 font-mono mt-0.5">41</div>
            <div className="text-[10px] text-teal-300/80 mt-0.5">Signed placement pledges</div>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[11px]">Jobs Promised vs Placed</div>
            <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">
              {totalDelivered} / {totalPromised}
            </div>
            <div className="text-[10px] text-amber-300/80 mt-0.5">Youth physically onboarded</div>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[11px]">60-Day Retained Placements</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
              {totalRetained} ({overallRetentionRate}%)
            </div>
            <div className="text-[10px] text-emerald-300/80 mt-0.5">Verified still employed</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search partners, trades, or audit notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'delivered', 'partial', 'pending', 'defaulted'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors capitalize ${
                statusFilter === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Commitment Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Partner Organization</th>
                <th className="py-3 px-4 font-semibold">Opportunity Type</th>
                <th className="py-3 px-4 font-semibold text-center">Promised</th>
                <th className="py-3 px-4 font-semibold text-center">Delivered</th>
                <th className="py-3 px-4 font-semibold text-center">60-Day Retained</th>
                <th className="py-3 px-4 font-semibold text-center">Retention %</th>
                <th className="py-3 px-4 font-semibold">Audit Status</th>
                <th className="py-3 px-4 font-semibold">Field Audit Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCommitments.map((c) => {
                const spotsDel = c.spots_delivered || 0;
                const verifiedRet = c.verified_retained || 0;
                const retPct = spotsDel > 0 ? Math.round((verifiedRet / spotsDel) * 100) : 0;
                return (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{c.organization_name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {c.opportunity_type}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                      {c.spots_promised}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-teal-700">
                      {c.spots_delivered}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700">
                      {c.verified_retained}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`font-mono font-bold ${retPct >= 60 ? 'text-emerald-600' : retPct >= 40 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {retPct}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(c.verification_status)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate" title={c.notes}>
                      {c.notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Commitment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">Accountability Registry</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Record Partner Commitment</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCommitment} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Partner Organization Name</label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Opportunity Type</label>
                <input
                  type="text"
                  required
                  value={oppType}
                  onChange={(e) => setOppType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Promised</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={promised}
                    onChange={(e) => setPromised(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Delivered</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={delivered}
                    onChange={(e) => setDelivered(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">60d Retained</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={retained}
                    onChange={(e) => setRetained(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Field Audit & Verification Notes</label>
                <textarea
                  rows={2}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-xs"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
