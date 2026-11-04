import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { MentorshipRequest, MentorProfile } from '../../types';
import {
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  MessageSquare,
  FileText,
  User,
  ArrowRight,
  XCircle,
} from 'lucide-react';

export const MentorDashboard: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [selectedReq, setSelectedReq] = useState<MentorshipRequest | null>(null);
  const [sessionDate, setSessionDate] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [currentUser.id]);

  const loadRequests = () => {
    // Look up mentor matching this user
    const allMentors = db.getMentors();
    const myMentor = allMentors.find((m) => m.full_name.includes(currentUser.full_name.split(' ')[0])) || allMentors[0];
    const allReqs = db.getMentorshipRequests();
    // Filter to requests directed to this mentor or show all for demo
    const relevant = allReqs.filter((r) => !myMentor || r.mentor_id === myMentor.id || r.mentor_id === 'mentor-tamirat');
    setRequests(relevant.length > 0 ? relevant : allReqs);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    db.updateMentorshipRequest(selectedReq.id, {
      status: 'scheduled',
      session_date: sessionDate,
      session_notes: sessionNotes || 'Initial advisory meeting scheduled.',
    });

    setActionSuccess(true);
    loadRequests();
    setTimeout(() => {
      setActionSuccess(false);
      setSelectedReq(null);
      setSessionNotes('');
      setSessionDate('');
    }, 1500);
  };

  const handleCompleteSession = (reqId: string) => {
    db.updateMentorshipRequest(reqId, {
      status: 'completed',
      session_notes: 'Completed session. Advised youth on micro-enterprise financing and trade license steps in Sodo.',
    });
    loadRequests();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>SodoBiz Mentor Portal</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {currentUser.full_name}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Review session requests from Sodo youth, TVET apprentices, and budding micro-entrepreneurs. Help bridge career transitions and loan readiness.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/mentorship')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              <Users className="w-4 h-4" />
              <span>Public Directory</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-800 text-xs">
          <div>
            <div className="text-slate-400 text-[11px]">Incoming Requests</div>
            <div className="text-xl font-bold text-white font-mono">{requests.length}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Scheduled Sessions</div>
            <div className="text-xl font-bold text-teal-400 font-mono">
              {requests.filter((r) => r.status === 'scheduled').length}
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Completed Consultations</div>
            <div className="text-xl font-bold text-emerald-400 font-mono">
              {requests.filter((r) => r.status === 'completed').length}
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Pending Review</div>
            <div className="text-xl font-bold text-amber-400 font-mono">
              {requests.filter((r) => r.status === 'pending').length}
            </div>
          </div>
        </div>
      </div>

      {/* Requests Queue */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Youth Mentorship Requests</h2>
          <span className="text-xs text-slate-500">Coordinating guidance for Sodo youth</span>
        </div>

        <div className="divide-y divide-slate-100">
          {requests.map((req) => {
            const youth = db.getUsers().find((u) => u.id === req.youth_id);

            return (
              <div key={req.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-bold text-slate-900">{youth?.full_name || req.youth_id}</span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded border bg-slate-100 text-slate-700">
                      {req.status}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="capitalize text-xs font-semibold text-teal-700">
                      {req.topic.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Topic Note: </span>
                    {req.notes}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>Phone: {youth?.phone || 'N/A'}</span>
                    <span>·</span>
                    <span>Requested: {(req.requested_at || req.created_at || '').slice(0, 10)}</span>
                    {req.session_date && (
                      <>
                        <span>·</span>
                        <span className="text-indigo-600 font-medium">
                          Scheduled: {new Date(req.session_date).toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>

                  {req.session_notes && (
                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 mt-1">
                      <span className="font-semibold text-slate-700">Advisory Summary: </span>
                      {req.session_notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {req.status === 'pending' && (
                    <button
                      onClick={() => {
                        setSelectedReq(req);
                        setSessionDate(new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16));
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
                    >
                      Accept & Schedule
                    </button>
                  )}

                  {req.status === 'scheduled' && (
                    <button
                      onClick={() => handleCompleteSession(req.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schedule Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Schedule Advisory</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Confirm Session Date</h3>
              </div>
              <button onClick={() => setSelectedReq(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-5 space-y-4 text-xs">
              {actionSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Session scheduled and notification logged!</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Session Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meeting Location / Channel</label>
                <input
                  type="text"
                  required
                  defaultValue="Sodo Youth Center Meeting Room / Phone"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preparation Note for Candidate</label>
                <textarea
                  rows={2}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="e.g. Please bring your draft business plan or TVET certificate."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionSuccess}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-xs"
                >
                  Confirm & Notify Youth
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
