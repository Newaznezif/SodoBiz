import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { CheckSquare, Calendar, PlusCircle, CheckCircle2, Lock, Eye } from 'lucide-react';

export const AgentSessionsPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser, refreshData } = useAuth();
  const assignments = db.getAssignments(currentUser.id);
  const businesses = db.getBusinesses();

  const [assignmentId, setAssignmentId] = useState(assignments[0]?.id || '');
  const [topic, setTopic] = useState('');
  const [outcome, setOutcome] = useState('');
  const [visibleNotes, setVisibleNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [submitted, setSubmitted] = useState(false);

  const sessions = db.getSupportSessions();

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !outcome.trim() || !assignmentId) return;

    db.createSupportSession({
      assignment_id: assignmentId,
      session_date: date,
      topic,
      outcome,
      entrepreneur_visible_notes: visibleNotes,
      internal_notes: internalNotes,
      created_by: currentUser.id,
    });

    refreshData();
    setTopic('');
    setOutcome('');
    setVisibleNotes('');
    setInternalNotes('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assistance-Session Records</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Log advisory meetings with clear separation between entrepreneur-visible notes and confidential supervisor notes.
        </p>
      </div>

      {submitted && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>Support session recorded and logged in database!</span>
        </div>
      )}

      {/* New Session Form */}
      <form onSubmit={handleCreateSession} className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-slate-900">Record a Completed Counseling Session</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Assigned Enterprise *</label>
            <select
              value={assignmentId}
              onChange={(e) => setAssignmentId(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 bg-white"
            >
              {assignments.map((a) => {
                const b = businesses.find((biz) => biz.id === a.business_id);
                return (
                  <option key={a.id} value={a.id}>
                    {b?.name || a.business_id}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Session Date *</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Session Topic / Objective *</label>
          <input
            type="text"
            required
            placeholder="e.g. Sales Ledger Verification & MFI Document Readiness"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Session Outcome & Agreed Next Steps *</label>
          <textarea
            required
            rows={2}
            placeholder="Key agreements, milestones achieved, or document follow-up needed..."
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Separated Notes Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Entrepreneur-Visible Notes */}
          <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Eye className="w-4 h-4 text-teal-600" />
              <span>Entrepreneur-Visible Action Notes</span>
            </div>
            <p className="text-[11px] text-slate-500">Shared with client on their dashboard.</p>
            <textarea
              rows={3}
              placeholder="e.g. Remember to bring updated Kebele business permit stamp before Friday."
              value={visibleNotes}
              onChange={(e) => setVisibleNotes(e.target.value)}
              className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-teal-500 mt-1"
            />
          </div>

          {/* Confidential Internal Counselor Notes */}
          <div className="space-y-1 bg-amber-50/60 p-4 rounded-xl border border-amber-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Lock className="w-4 h-4 text-amber-700" />
              <span>Confidential Internal Counselor Notes</span>
            </div>
            <p className="text-[11px] text-amber-800">Only visible to counselors & administrators.</p>
            <textarea
              rows={3}
              placeholder="e.g. Owner exhibits strong cash discipline; recommend for cooperative loan."
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              className="w-full text-xs p-2 border border-amber-200 rounded-lg bg-white focus:outline-none focus:border-amber-500 mt-1"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 shadow-xs"
          >
            Save Session Record
          </button>
        </div>
      </form>

      {/* Historical Sessions Log */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900">Historical Counseling Sessions ({sessions.length})</h2>
        <div className="space-y-3">
          {sessions.map((ses) => (
            <div key={ses.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{ses.topic}</h3>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Date: {ses.session_date} · Assignment: {ses.assignment_id}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-700">
                <strong>Outcome:</strong> {ses.outcome}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                {ses.entrepreneur_visible_notes && (
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-600">
                    <span className="font-semibold text-slate-800 block text-[11px]">Client Note:</span>
                    {ses.entrepreneur_visible_notes}
                  </div>
                )}
                {ses.internal_notes && (
                  <div className="p-2.5 rounded bg-amber-50/70 border border-amber-200 text-amber-900">
                    <span className="font-semibold block text-[11px]">Internal Counselor Note:</span>
                    {ses.internal_notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
