import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { Business } from '../../types';
import { Users, CheckSquare, Search, ArrowRight, ShieldCheck, Phone, MapPin } from 'lucide-react';

export const AgentEntrepreneursPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const assignments = db.getAssignments(currentUser.id);
  const businesses = db.getBusinesses();
  const users = db.getUsers();

  const assignedBizIds = new Set(assignments.map((a) => a.business_id));
  const assignedBusinesses = businesses.filter((b) => assignedBizIds.has(b.id));

  const [selectedBiz, setSelectedBiz] = useState<Business | null>(assignedBusinesses[0] || null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assigned Entrepreneurs</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review business readiness and verify bookkeeping compliance for assigned clients.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Client Portfolio ({assignedBusinesses.length})
          </h2>

          <div className="space-y-2">
            {assignedBusinesses.map((b) => {
              const isSelected = selectedBiz?.id === b.id;
              const owner = users.find((u) => u.id === b.owner_id);
              const readiness = db.getBusinessReadiness(b.id);
              const doneCount = readiness.filter((r) => r.status === 'completed').length;
              const pct = Math.round((doneCount / (readiness.length || 9)) * 100);

              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedBiz(b)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{b.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Owner: {owner?.full_name}</div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                      {pct}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2 truncate">{b.location}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Detail / Audit Panel */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          {selectedBiz ? (
            <>
              <div className="border-b border-slate-100 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    Authorized Support View
                  </span>
                  <span className="text-xs font-mono text-slate-400">ID: {selectedBiz.id}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{selectedBiz.name}</h2>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedBiz.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {selectedBiz.location}
                  </span>
                  <span>·</span>
                  <span>Sector: {selectedBiz.business_type}</span>
                  <span>·</span>
                  <span>Operating since {selectedBiz.operating_since}</span>
                </div>
              </div>

              {/* Readiness Audit Check */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Readiness Item Status Audit</h3>
                <div className="space-y-2">
                  {db.getBusinessReadiness(selectedBiz.id).map((r) => {
                    const itemDef = db.getLessons(); // definition
                    return (
                      <div
                        key={r.id}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-800">Item: {r.readiness_item_id}</div>
                          {r.notes && <div className="text-slate-500 text-[11px] mt-0.5">Note: {r.notes}</div>}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            r.status === 'completed'
                              ? 'bg-teal-100 text-teal-800'
                              : r.status === 'in_progress'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {r.status.replace('_', ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onNavigate('/agent/sessions')}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800"
                >
                  Record Counseling Session with this Business
                </button>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">Select an entrepreneur to review.</p>
          )}
        </div>
      </div>
    </div>
  );
};
