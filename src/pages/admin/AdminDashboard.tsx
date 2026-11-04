import React from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import {
  Users,
  Store,
  Receipt,
  Building,
  CheckSquare,
  Shield,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react';

export const AdminDashboard: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();

  const users = db.getUsers();
  const businesses = db.getBusinesses();
  const transactions = db.getTransactions();
  const providers = db.getProviders();
  const assignments = db.getAssignments();
  const referrals = db.getReferrals();
  const auditLogs = db.getAuditLogs();

  const entrepreneurs = users.filter((u) => u.role === 'entrepreneur');
  const verifiedProviders = providers.filter((p) => p.verification_status === 'verified');
  const pendingProviders = providers.filter((p) => p.verification_status === 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            System Administration Console
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Operational Overview & Platform Governance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            System metrics, user directory controls, provider audits, and immutable security logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/admin/audit-logs')}
            className="px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            <span>View Audit Logs</span>
          </button>
        </div>
      </div>

      {/* Operational Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Registered Entrepreneurs</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {entrepreneurs.length}
          </div>
          <div className="text-[11px] text-slate-400">Total accounts active</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Active Businesses</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {businesses.length}
          </div>
          <div className="text-[11px] text-slate-400">Wolaita Sodo micro-enterprises</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Transactions Recorded</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {transactions.length}
          </div>
          <div className="text-[11px] text-slate-400">Ledger entries tracked</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Approved Providers</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {verifiedProviders.length}
          </div>
          <div className="text-[11px] text-amber-600 font-medium">
            {pendingProviders.length} pending review
          </div>
        </div>
      </div>

      {/* Admin Action Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">User & Role Management</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Browse registered profiles, update role authorizations (entrepreneur, agent, provider, admin), and assign agents to businesses.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/admin/users')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
          >
            <span>Manage User Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Provider Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verify legal legitimacy, approve or reject institutional profiles, and audit published microfinance facilities.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/admin/providers')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
          >
            <span>Audit Providers ({pendingProviders.length} Pending)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Audit Logs & Security</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inspect immutable audit records for role changes, provider approvals, and referral authorizations.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/admin/audit-logs')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
          >
            <span>Inspect Logs ({auditLogs.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Security & Activity Logs Preview */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900">Recent Platform Audit Events</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th className="pb-2">Timestamp</th>
                <th className="pb-2">Actor</th>
                <th className="pb-2">Action</th>
                <th className="pb-2">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.slice(0, 5).map((log) => (
                <tr key={log.id}>
                  <td className="py-2.5 font-mono text-slate-500 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="py-2.5 font-medium text-slate-800 whitespace-nowrap">
                    {log.actor_name}
                  </td>
                  <td className="py-2.5 font-mono font-bold text-slate-700 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-2.5 text-slate-500 capitalize whitespace-nowrap">
                    {log.target_type}: {log.target_id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
