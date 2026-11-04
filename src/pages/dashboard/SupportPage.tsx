import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { LifeBuoy, Send, CheckCircle2, Clock } from 'lucide-react';

export const SupportPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser, refreshData } = useAuth();
  const requests = db.getSupportRequests(currentUser.id);

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    db.createSupportRequest({
      user_id: currentUser.id,
      subject,
      description,
      status: 'open',
    });

    refreshData();
    setSubject('');
    setDescription('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Business Support & Assistance</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Submit questions or request hands-on support from trained youth business agents in Wolaita Sodo.
        </p>
      </div>

      {sentSuccess && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>Your support inquiry has been submitted and queued for review.</span>
        </div>
      )}

      {/* New Request Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Open a New Assistance Ticket</h2>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Subject</label>
          <input
            type="text"
            required
            placeholder="e.g. Need assistance organizing past grain receipts"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Description of Need</label>
          <textarea
            required
            rows={4}
            placeholder="Describe what specific help your business requires..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span>Submit Ticket</span>
          </button>
        </div>
      </form>

      {/* Existing Requests */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900">Your Past Inquiries ({requests.length})</h2>
        {requests.length === 0 ? (
          <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            No support requests opened yet.
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{req.subject}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                    req.status === 'resolved'
                      ? 'bg-teal-50 text-teal-800'
                      : req.status === 'in_progress'
                      ? 'bg-amber-50 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {req.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{req.description}</p>
              <div className="text-[11px] text-slate-400 font-mono pt-1">
                Submitted on: {new Date(req.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
