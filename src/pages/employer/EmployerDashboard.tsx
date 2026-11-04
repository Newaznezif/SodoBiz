import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { Opportunity, OpportunityApplication, Organization, PartnerCommitment } from '../../types';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  PlusCircle,
  Building2,
  Calendar,
  XCircle,
  FileText,
  AlertCircle,
  Award,
} from 'lucide-react';

export const EmployerDashboard: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<OpportunityApplication[]>([]);
  const [activeTab, setActiveTab] = useState<'applications' | 'post' | 'commitments'>('applications');

  // Application Review State
  const [selectedApp, setSelectedApp] = useState<OpportunityApplication | null>(null);
  const [newStatus, setNewStatus] = useState<OpportunityApplication['status']>('shortlisted');
  const [reviewNote, setReviewNote] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [actionSuccess, setActionSuccess] = useState(false);

  // New Opportunity Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'job' | 'internship' | 'apprenticeship' | 'training'>('apprenticeship');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [location, setLocation] = useState('Wolaita Sodo Industrial Zone');
  const [stipend, setStipend] = useState('4000');
  const [spots, setSpots] = useState('4');
  const [accessible, setAccessible] = useState(true);

  useEffect(() => {
    loadEmployerData();
  }, [currentUser.id]);

  const loadEmployerData = () => {
    const allOpps = db.getOpportunities();
    const allApps = db.getApplications();
    setOpportunities(allOpps);
    setApplications(allApps);
  };

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    db.updateApplicationStatus(
      selectedApp.id,
      newStatus,
      reviewNote || `Application marked as ${newStatus}`,
      interviewDate || undefined
    );

    setActionSuccess(true);
    loadEmployerData();
    setTimeout(() => {
      setActionSuccess(false);
      setSelectedApp(null);
      setReviewNote('');
      setInterviewDate('');
    }, 1500);
  };

  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    db.createOpportunity({
      organization_id: 'org-damota',
      title,
      type,
      description,
      requirements: requirements.split('\n').filter(Boolean),
      location,
      stipend_amount: Number(stipend) || 0,
      currency: 'ETB',
      spots_available: Number(spots) || 1,
      deadline: '2026-12-31',
      is_accessible: accessible,
      created_by: currentUser.id,
    });

    setTitle('');
    setDescription('');
    setRequirements('');
    loadEmployerData();
    setActiveTab('applications');
  };

  const totalPlaced = applications.filter((a) => a.status === 'accepted').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Sodo Partner Employer Portal</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {currentUser.full_name}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Manage candidate pipelines, schedule vocational interviews, review HackLab youth referrals, and uphold your verified retention commitment in Wolaita Sodo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('post')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Opportunity</span>
            </button>
            <button
              onClick={() => onNavigate('/commitments')}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700"
            >
              <Award className="w-4 h-4 text-teal-400" />
              <span>Commitment Tracker</span>
            </button>
          </div>
        </div>

        {/* Employer KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-800 text-xs">
          <div>
            <div className="text-slate-400 text-[11px]">Active Postings</div>
            <div className="text-xl font-bold text-white font-mono">{opportunities.length}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Applications Received</div>
            <div className="text-xl font-bold text-teal-400 font-mono">{applications.length}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Shortlisted Candidates</div>
            <div className="text-xl font-bold text-amber-400 font-mono">
              {applications.filter((a) => a.status === 'shortlisted' || a.status === 'interview_scheduled').length}
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Confirmed Placements</div>
            <div className="text-xl font-bold text-emerald-400 font-mono">{totalPlaced}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'applications'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Candidate Pipeline ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('post')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'post'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Post New Opportunity
        </button>
      </div>

      {/* Tab 1: Candidate Applications Pipeline */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Received Youth Applications</h2>
            <span className="text-xs text-slate-500">Click any applicant to update status or schedule interview</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Applicant Name</th>
                  <th className="py-3 px-4 font-semibold">Applied Role</th>
                  <th className="py-3 px-4 font-semibold">Phone (telebirr)</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Applied Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => {
                  const opp = db.getOpportunityById(app.opportunity_id);
                  const user = db.getUsers().find((u) => u.id === app.user_id);
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div>{user?.full_name || app.user_id}</div>
                        <div className="text-[11px] text-slate-400 font-normal">
                          {user?.education_level || 'TVET Certified'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{opp?.title || 'Opportunity'}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{app.phone || user?.phone || 'N/A'}</td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold border bg-slate-100 text-slate-700">
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{(app.applied_at || app.created_at || '').slice(0, 10)}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setNewStatus(app.status);
                            setReviewNote(app.reviewer_notes || '');
                            setInterviewDate(app.interview_date || '');
                          }}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold"
                        >
                          Review & Advance
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Post Opportunity Form */}
      {activeTab === 'post' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-3xl">
          <h2 className="text-base font-bold text-slate-900 mb-1">Publish New Opportunity Listing</h2>
          <p className="text-xs text-slate-500 mb-5">
            Published listings are immediately visible to Sodo youth and TVET candidates.
          </p>

          <form onSubmit={handleCreateOpportunity} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Opportunity Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Electrical Maintenance Assistant"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e: any) => setType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="apprenticeship">Apprenticeship</option>
                  <option value="job">Direct Employment</option>
                  <option value="training">TVET Training</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Open Slots</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={spots}
                  onChange={(e) => setSpots(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Monthly Stipend / Wage (ETB)</label>
                <input
                  type="number"
                  required
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Location in Sodo</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Requirements (one per line)</label>
              <textarea
                rows={2}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="accessibleBox"
                checked={accessible}
                onChange={(e) => setAccessible(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <label htmlFor="accessibleBox" className="font-medium text-slate-700">
                Accessible to candidates with disabilities / flexible work setup
              </label>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-xs transition-colors"
              >
                Publish Opportunity Now
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Candidate Status Update Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">Candidate Evaluation</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Update Application Status
                </h3>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStatusUpdate} className="p-5 space-y-4 text-xs">
              {actionSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Candidate status updated and synchronized to youth portal!</span>
                </div>
              )}

              {/* Applicant Motivation Quote */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Applicant Motivation Statement</span>
                <p className="text-slate-700 italic">"{selectedApp.motivation_statement}"</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pipeline Status</label>
                <select
                  value={newStatus}
                  onChange={(e: any) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="submitted">Submitted</option>
                  <option value="reviewing">Under Review</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview_scheduled">Interview Scheduled</option>
                  <option value="accepted">Accepted / Placed in Job</option>
                  <option value="rejected">Not Selected</option>
                </select>
              </div>

              {newStatus === 'interview_scheduled' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Scheduled Interview Date & Time</label>
                  <input
                    type="datetime-local"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Feedback / Guidance for Youth</label>
                <textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="e.g. Please bring Kebele ID and TVET certificate to Damota Agro main office at 9:00 AM."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionSuccess}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-xs"
                >
                  Confirm Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
