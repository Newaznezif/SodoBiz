import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { MentorProfile, MentorshipRequest } from '../../types';
import {
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  Send,
  Building2,
  X,
  MessageSquare,
  ArrowRight,
  User,
} from 'lucide-react';

export const MentorshipPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [myRequests, setMyRequests] = useState<MentorshipRequest[]>([]);

  // Request modal
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [topic, setTopic] = useState<'career_guidance' | 'business_startup' | 'technical_skills' | 'loan_navigation'>('career_guidance');
  const [requestNote, setRequestNote] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, [currentUser.id]);

  const loadData = () => {
    const list = db.getMentors();
    const reqs = db.getMentorshipRequests(currentUser.id);
    setMentors(list);
    setMyRequests(reqs);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;

    db.submitMentorshipRequest({
      mentor_id: selectedMentor.id,
      youth_id: currentUser.id,
      topic,
      notes: requestNote.trim() || 'Seeking advice on vocational opportunities and enterprise growth in Sodo.',
    });

    setRequestSuccess(true);
    loadData();
    setTimeout(() => {
      setRequestSuccess(false);
      setSelectedMentor(null);
      setRequestNote('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>SodoBiz Mentorship & Advisory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Connect with Experienced Sodo Practitioners
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Gain direct guidance on career transitions, navigating trade licenses and TIN registration, mastering agricultural equipment, and preparing viable microfinance proposals.
          </p>
        </div>
      </div>

      {/* Active Requests Tracker if any exist */}
      {myRequests.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-3">Your Mentorship Sessions & Requests</h2>
          <div className="divide-y divide-slate-100">
            {myRequests.map((req) => {
              const mentor = mentors.find((m) => m.id === req.mentor_id);
              return (
                <div key={req.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{mentor?.full_name || 'Mentor'}</span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded border bg-slate-100 text-slate-700">
                        {req.status}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="capitalize text-slate-600">{req.topic.replace('_', ' ')}</span>
                    </div>
                    <div className="text-slate-600 italic">"{req.notes}"</div>
                    {req.session_date && (
                      <div className="text-teal-700 font-medium">
                        Scheduled Session: {new Date(req.session_date).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mentors Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-sm border border-slate-200">
                    {(mentor.full_name || 'M').charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{mentor.full_name || 'Sodo Mentor'}</h3>
                    <div className="text-xs text-slate-500 font-medium">{mentor.job_title || 'Advisor'}</div>
                    <div className="text-[11px] text-teal-700">{mentor.organization || 'Local Partner'}</div>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-semibold uppercase tracking-wider">
                  Available
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{mentor.bio}</p>

              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Focus Areas:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {mentor.expertise_areas.map((area, idx) => (
                    <span key={idx} className="text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-3">
                <span>Availability: {mentor.availability_hours || '3 hours/wk'}</span>
                <span>·</span>
                <span>Language: {(mentor.languages || mentor.languages_spoken || ['Amharic', 'English']).join(', ')}</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => {
                  setSelectedMentor(mentor);
                  setRequestSuccess(false);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>Request Mentorship Session</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mentorship Request Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Book Advisory</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Session with {selectedMentor.full_name}</h3>
              </div>
              <button onClick={() => setSelectedMentor(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="p-5 space-y-4">
              {requestSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mentorship request submitted! The mentor will coordinate a meeting time with you.</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Advisory Topic</label>
                <select
                  value={topic}
                  onChange={(e: any) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="career_guidance">Career Guidance & Job Application Advice</option>
                  <option value="business_startup">Micro-Enterprise Launch & Planning</option>
                  <option value="technical_skills">Vocational / Technical Skill Deepening</option>
                  <option value="loan_navigation">Loan Readiness, TIN & MFI Application</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  What would you like to discuss during the session?
                </label>
                <textarea
                  rows={3}
                  required
                  value={requestNote}
                  onChange={(e) => setRequestNote(e.target.value)}
                  placeholder="Describe your current situation, challenge, or the specific decision you need guidance on in Wolaita Sodo."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={requestSuccess}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                >
                  Confirm Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
