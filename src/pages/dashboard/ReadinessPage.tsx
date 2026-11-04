import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db, INITIAL_READINESS_ITEMS } from '../../lib/db';
import { ReadinessStatus } from '../../types';
import {
  CheckSquare,
  Printer,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  Circle,
  Building,
  Save,
  ShieldCheck,
} from 'lucide-react';

export const ReadinessPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentBusiness, currentUser } = useAuth();

  if (!currentBusiness) {
    return <div className="p-6 bg-white rounded-xl">Please set up your business profile first.</div>;
  }

  const readinessRecords = db.getBusinessReadiness(currentBusiness.id);
  const items = INITIAL_READINESS_ITEMS;

  const [notesState, setNotesState] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    readinessRecords.forEach((r) => {
      map[r.readiness_item_id] = r.notes || '';
    });
    return map;
  });

  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const getRecord = (itemId: string) => {
    return readinessRecords.find((r) => r.readiness_item_id === itemId);
  };

  const completedCount = readinessRecords.filter((r) => r.status === 'completed').length;
  const inProgressCount = readinessRecords.filter((r) => r.status === 'in_progress').length;
  const totalCount = items.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const handleStatusChange = (itemId: string, newStatus: ReadinessStatus) => {
    const currentNote = notesState[itemId] || '';
    db.updateReadinessItem(currentBusiness.id, itemId, newStatus, currentNote, currentUser.id);
    setSavedNotice('Status updated');
    setTimeout(() => setSavedNotice(null), 2500);
  };

  const handleSaveNotes = (itemId: string) => {
    const record = getRecord(itemId);
    const currentStatus = record ? record.status : 'not_started';
    db.updateReadinessItem(currentBusiness.id, itemId, currentStatus, notesState[itemId] || '', currentUser.id);
    setSavedNotice('Notes saved');
    setTimeout(() => setSavedNotice(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Business-Readiness Profile & Checklist
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit your record preparation, licensing status, and banking readiness for institutional review.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {savedNotice && (
            <span className="text-xs text-teal-700 font-semibold flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded">
              <CheckCircle2 className="w-3.5 h-3.5" /> {savedNotice}
            </span>
          )}

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-teal-400" />
            <span>Print Readiness Summary</span>
          </button>
        </div>
      </div>

      {/* Progress Scorecard */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Preparation Progress
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                {percentage}%
              </span>
              <span className="text-xs text-slate-600 font-medium">
                ({completedCount} completed · {inProgressCount} in progress · {totalCount - completedCount - inProgressCount} remaining)
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200/80 max-w-sm">
            <strong>Standard Milestone Target:</strong> Completing at least 6 items demonstrates organized bookkeeping when presenting to local MFIs in Wolaita Sodo.
          </div>
        </div>

        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-teal-600 h-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* 9-Point Checklist Grid */}
      <div className="space-y-4">
        {items.map((item, idx) => {
          const record = getRecord(item.id);
          const currentStatus: ReadinessStatus = record ? record.status : 'not_started';
          const notes = notesState[item.id] !== undefined ? notesState[item.id] : record?.notes || '';

          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl border p-5 transition-all shadow-xs space-y-3 ${
                currentStatus === 'completed'
                  ? 'border-teal-200/80 bg-teal-50/20'
                  : currentStatus === 'in_progress'
                  ? 'border-amber-200/80 bg-amber-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider capitalize">
                      · {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {item.description}
                  </p>
                </div>

                {/* Status Segmented Buttons */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg shrink-0 self-start no-print">
                  <button
                    onClick={() => handleStatusChange(item.id, 'not_started')}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                      currentStatus === 'not_started'
                        ? 'bg-white text-slate-900 font-bold shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Not Started
                  </button>
                  <button
                    onClick={() => handleStatusChange(item.id, 'in_progress')}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                      currentStatus === 'in_progress'
                        ? 'bg-amber-500 text-white font-bold shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusChange(item.id, 'completed')}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                      currentStatus === 'completed'
                        ? 'bg-teal-600 text-white font-bold shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              {/* Recommended Action & Owner Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold">Recommended Action:</span>
                  <div className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {item.recommended_action}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-semibold">Entrepreneur Notes & Document References:</span>
                    <button
                      onClick={() => handleSaveNotes(item.id)}
                      className="text-teal-700 hover:underline text-[11px] font-semibold no-print"
                    >
                      Save Note
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., Reference number, date verified, or location of physical papers..."
                    value={notes}
                    onChange={(e) =>
                      setNotesState((prev) => ({ ...prev, [item.id]: e.target.value }))
                    }
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Non-Credit Guarantee Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1">
        <div className="font-bold text-slate-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Readiness Checklist Principles</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          This checklist assists micro-entrepreneurs in structuring records and documentation for their own operations. It does not calculate a commercial credit score and does not guarantee loan approval by partner institutions. All lending decisions are governed independently by regulated Ethiopian financial bodies.
        </p>
      </div>
    </div>
  );
};
