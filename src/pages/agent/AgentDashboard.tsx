import React from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { Users, CheckSquare, Calendar, ArrowRight, ShieldAlert, Award } from 'lucide-react';

export const AgentDashboard: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const assignments = db.getAssignments(currentUser.id);
  const businesses = db.getBusinesses();
  const sessions = db.getSupportSessions();

  // Filter assigned businesses
  const assignedBizIds = new Set(assignments.map((a) => a.business_id));
  const assignedBusinesses = businesses.filter((b) => assignedBizIds.has(b.id));

  return (
    <div className="space-y-6">
      {/* Welcome Bar */}
      <div className="border-b border-slate-200 pb-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-teal-700">
          Youth Business Support Agent Portal
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
          Welcome, {currentUser.full_name}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Authorized agent for field counseling and record verification in Wolaita Sodo.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Assigned Micro-Enterprises</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {assignedBusinesses.length}
          </div>
          <div className="text-[11px] text-slate-400">Strict assignment boundaries enforced</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Assistance Sessions Logged</span>
            <CheckSquare className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {sessions.length}
          </div>
          <div className="text-[11px] text-slate-400">Readiness audits & record reviews</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Local Target Area</span>
            <Award className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-base font-bold text-slate-900 truncate">
            Wolaita Sodo Central Market
          </div>
          <div className="text-[11px] text-slate-400">Active Tuesday & Saturday field days</div>
        </div>
      </div>

      {/* Access Boundary Warning */}
      <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-950 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Authorized Access Rule:</strong> Under SodoBiz Bridge privacy architecture, you are authorized to view and support only entrepreneurs explicitly assigned to you by municipal administrators. Private daily transaction line items remain protected unless shared in an assistance session.
        </div>
      </div>

      {/* Assigned Businesses Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Your Assigned Micro-Enterprises</h2>
          <button
            onClick={() => onNavigate('/agent/entrepreneurs')}
            className="text-xs text-teal-700 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <span>Manage All Assigned</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {assignedBusinesses.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">No entrepreneurs currently assigned.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedBusinesses.map((biz) => {
              const readiness = db.getBusinessReadiness(biz.id);
              const doneCount = readiness.filter((r) => r.status === 'completed').length;
              const readinessPct = Math.round((doneCount / (readiness.length || 9)) * 100);

              return (
                <div
                  key={biz.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-teal-500 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{biz.name}</h3>
                      <div className="text-[11px] text-slate-500">{biz.location}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {readinessPct}% Readiness
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{biz.description}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onNavigate(`/agent/entrepreneurs`)}
                      className="text-xs font-semibold text-teal-700 hover:underline"
                    >
                      Conduct Readiness Audit
                    </button>
                    <button
                      onClick={() => onNavigate('/agent/sessions')}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                    >
                      Log Counseling Session
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
