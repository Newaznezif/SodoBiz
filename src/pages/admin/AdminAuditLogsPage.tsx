import React, { useState } from 'react';
import { db } from '../../lib/db';
import { Shield, Clock, Search, Filter } from 'lucide-react';

export const AdminAuditLogsPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const auditLogs = db.getAuditLogs();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action.includes(actionFilter);
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Security & Audit Event Logs</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically chronological records of administrative role updates, provider approvals, and referral authorizations.
          </p>
        </div>

        <div className="px-3 py-1 rounded bg-slate-900 text-teal-400 font-mono text-xs font-semibold self-start sm:self-auto">
          {auditLogs.length} Total Audit Records
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, actor, or target ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full sm:w-auto py-2 px-3 border border-slate-200 rounded-lg text-xs bg-white font-mono"
          >
            <option value="all">All Action Types</option>
            <option value="PROVIDER">Provider Approvals</option>
            <option value="ASSIGN">Agent Assignments</option>
            <option value="REFERRAL">Referral Consents</option>
            <option value="USER">User Registration & Roles</option>
            <option value="BUSINESS">Business Profile Updates</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4">Event Timestamp (UTC)</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Metadata Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(log.created_at).toISOString().replace('T', ' ').slice(0, 19)}
                  </td>
                  <td className="py-3 px-4 font-sans font-semibold text-slate-800 whitespace-nowrap">
                    {log.actor_name}
                  </td>
                  <td className="py-3 px-4 font-bold text-teal-800 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    {log.target_type}: {log.target_id}
                  </td>
                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate text-[11px]">
                    {log.metadata ? JSON.stringify(log.metadata) : '—'}
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
