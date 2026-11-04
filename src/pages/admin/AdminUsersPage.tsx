import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { UserProfile, UserRoleType } from '../../types';
import { Users, Search, Shield, UserCheck, CheckCircle2, UserPlus } from 'lucide-react';

export const AdminUsersPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser, refreshData } = useAuth();
  const users = db.getUsers();
  const businesses = db.getBusinesses();
  const assignments = db.getAssignments();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Assignment modal
  const [assigningBizId, setAssigningBizId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');

  const agents = users.filter((u) => u.role === 'agent');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId: string, newRole: UserRoleType) => {
    db.updateUser(userId, { role: newRole });
    refreshData();
    setSuccessNotice(`Updated role for ${userId} to ${newRole}`);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleAssignAgent = (bizId: string) => {
    if (!selectedAgentId) return;
    db.assignAgent(bizId, selectedAgentId, currentUser.id);
    refreshData();
    setAssigningBizId(null);
    setSuccessNotice('Assigned agent to micro-enterprise!');
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Directory & Role Authorization</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage user roles, assign field agents, and audit account privileges.
          </p>
        </div>

        {successNotice && (
          <div className="px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs flex items-center gap-1.5 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>{successNotice}</span>
          </div>
        )}
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by user name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'entrepreneur', 'agent', 'provider', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize whitespace-nowrap transition-colors ${
                roleFilter === role
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4 text-right">Role Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const userBiz = businesses.find((b) => b.owner_id === u.id);
                return (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{u.full_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                      {userBiz && (
                        <div className="text-[11px] text-teal-700 mt-0.5">
                          Enterprise: {userBiz.name}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {u.phone || '—'}
                    </td>
                    <td className="py-3 px-4 uppercase font-mono text-slate-500">
                      {u.preferred_language}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold capitalize ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-900'
                            : u.role === 'provider'
                            ? 'bg-blue-100 text-blue-900'
                            : u.role === 'agent'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-teal-50 text-teal-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRoleType)}
                        className="p-1 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:border-teal-500"
                      >
                        <option value="entrepreneur">Entrepreneur</option>
                        <option value="agent">Support Agent</option>
                        <option value="provider">Provider</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Micro-Enterprise Agent Assignment Tool */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Assign Support Agents to Micro-Enterprises</h2>
        <p className="text-xs text-slate-500">
          Link registered enterprises with local counselors to enable field audits and assistance sessions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {businesses.map((biz) => {
            const currentAsg = assignments.find((a) => a.business_id === biz.id);
            const assignedAgent = currentAsg ? users.find((u) => u.id === currentAsg.agent_id) : null;

            return (
              <div key={biz.id} className="p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{biz.name}</h3>
                    <div className="text-slate-500 text-[11px]">{biz.location}</div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded font-mono font-medium bg-slate-100 text-slate-700">
                    {biz.business_type}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Current Assigned Agent: </span>
                  <strong className="text-slate-800">
                    {assignedAgent ? assignedAgent.full_name : 'No Agent Assigned'}
                  </strong>
                </div>

                {assigningBizId === biz.id ? (
                  <div className="space-y-2 pt-1">
                    <select
                      value={selectedAgentId}
                      onChange={(e) => setSelectedAgentId(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white"
                    >
                      <option value="">Select Local Agent...</option>
                      {agents.map((ag) => (
                        <option key={ag.id} value={ag.id}>
                          {ag.full_name} ({ag.email})
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAssignAgent(biz.id)}
                        disabled={!selectedAgentId}
                        className="px-3 py-1.5 bg-teal-600 text-white rounded font-semibold text-xs disabled:opacity-50"
                      >
                        Confirm Assignment
                      </button>
                      <button
                        onClick={() => setAssigningBizId(null)}
                        className="px-3 py-1.5 border border-slate-200 rounded text-slate-600 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAssigningBizId(biz.id);
                      setSelectedAgentId(agents[0]?.id || '');
                    }}
                    className="text-xs text-teal-700 font-semibold hover:underline"
                  >
                    + Change / Assign Agent
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
