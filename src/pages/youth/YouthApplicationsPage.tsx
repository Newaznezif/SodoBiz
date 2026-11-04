import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { OpportunityApplication, Opportunity } from '../../types';
import {
  Briefcase,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  ChevronRight,
  Filter,
  XCircle,
  FileText,
  MessageSquare,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const YouthApplicationsPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<OpportunityApplication[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [withdrawModalId, setWithdrawModalId] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, [currentUser.id]);

  const loadApplications = () => {
    const list = db.getApplications(currentUser.id);
    setApplications(list);
  };

  const handleWithdrawConfirm = (appId: string) => {
    db.withdrawApplication(appId);
    setWithdrawModalId(null);
    loadApplications();
  };

  const filteredApps = applications.filter((app) => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  const getStatusBadge = (status: OpportunityApplication['status']) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
            Accepted / Offer Made
          </span>
        );
      case 'interview_scheduled':
        return (
          <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
            Interview Scheduled
          </span>
        );
      case 'shortlisted':
        return (
          <span className="text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
            Shortlisted
          </span>
        );
      case 'reviewing':
        return (
          <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
            Under Review
          </span>
        );
      case 'rejected':
        return (
          <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
            Not Selected
          </span>
        );
      case 'withdrawn':
        return (
          <span className="text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
            Withdrawn
          </span>
        );
      case 'submitted':
      default:
        return (
          <span className="text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
            Submitted
          </span>
        );
    }
  };

  // Helper for lifecycle timeline steps
  const getLifecycleStepIndex = (status: OpportunityApplication['status']) => {
    switch (status) {
      case 'submitted':
        return 0;
      case 'reviewing':
        return 1;
      case 'shortlisted':
        return 2;
      case 'interview_scheduled':
        return 3;
      case 'accepted':
        return 4;
      case 'rejected':
      case 'withdrawn':
        return -1;
      default:
        return 0;
    }
  };

  const steps = [
    { title: 'Submitted', desc: 'Application received' },
    { title: 'Under Review', desc: 'Screening CV' },
    { title: 'Shortlisted', desc: 'Candidate approved' },
    { title: 'Interview', desc: 'Assessment date set' },
    { title: 'Accepted', desc: 'Placement finalized' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <button
            onClick={() => onNavigate('/youth/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Application Status & Lifecycle Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status updates, scheduled interview dates, and employer feedback notes.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/opportunities')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
        >
          <Briefcase className="w-4 h-4" />
          <span>Explore More Opportunities</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: `All Applications (${applications.length})` },
          { id: 'submitted', label: 'Submitted' },
          { id: 'reviewing', label: 'Under Review' },
          { id: 'shortlisted', label: 'Shortlisted' },
          { id: 'interview_scheduled', label: 'Interview Scheduled' },
          { id: 'accepted', label: 'Accepted / Placed' },
          { id: 'rejected', label: 'Not Selected' },
          { id: 'withdrawn', label: 'Withdrawn' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors ${
              statusFilter === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
          <h3 className="text-sm font-bold text-slate-800">No applications found in this category</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You do not currently have any applications matching the selected filter.
          </p>
          <button
            onClick={() => onNavigate('/opportunities')}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold"
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse Opportunities</span>
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredApps.map((app) => {
            const opp = db.getOpportunityById(app.opportunity_id);
            const org = opp ? db.getOrganizationById(opp.organization_id) : null;
            const currentStepIdx = getLifecycleStepIndex(app.status);

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all space-y-5"
              >
                {/* Header Information */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-slate-900">{opp?.title || 'Opportunity'}</h2>
                      {getStatusBadge(app.status)}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="font-semibold text-teal-800">{org?.name || 'Local Enterprise Partner'}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {opp?.location || 'Wolaita Sodo'}
                      </span>
                      <span>·</span>
                      <span className="capitalize">{opp?.type || 'Job'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    {app.status !== 'withdrawn' && app.status !== 'rejected' && app.status !== 'accepted' && (
                      <button
                        onClick={() => setWithdrawModalId(app.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
                      >
                        Withdraw Application
                      </button>
                    )}
                  </div>
                </div>

                {/* Visual Lifecycle Stepper (if active) */}
                {app.status !== 'rejected' && app.status !== 'withdrawn' ? (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {steps.map((step, idx) => {
                        const isDone = currentStepIdx >= idx;
                        const isCurrent = currentStepIdx === idx;
                        return (
                          <div key={idx} className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  isDone
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-slate-200 text-slate-500'
                                }`}
                              >
                                {isDone ? '✓' : idx + 1}
                              </div>
                              <span
                                className={`text-xs font-bold ${
                                  isCurrent
                                    ? 'text-teal-700'
                                    : isDone
                                    ? 'text-slate-800'
                                    : 'text-slate-400'
                                }`}
                              >
                                {step.title}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 pl-7">{step.desc}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl border text-xs font-medium bg-slate-50 border-slate-200 text-slate-600">
                    {app.status === 'withdrawn'
                      ? 'This application was withdrawn by candidate request.'
                      : 'Candidate was not selected for this cohort round.'}
                  </div>
                )}

                {/* Details Grid: CV, Motivation, Interview Note */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>Attached Credentials:</span>
                      <span className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {app.cv_filename || 'Applicant_Profile.pdf'}
                      </span>
                    </div>

                    {app.motivation_statement && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Candidate Motivation
                        </span>
                        <p className="text-slate-700 leading-relaxed italic">
                          "{app.motivation_statement}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {app.interview_date && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                        <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
                          <Clock className="w-4 h-4 text-blue-700" />
                          <span>Interview Scheduled</span>
                        </div>
                        <div className="text-blue-800 text-xs font-medium">
                          Date: {new Date(app.interview_date).toLocaleString()}
                        </div>
                        <div className="text-[11px] text-blue-600">
                          Please bring your original TVET certificates and Kebele ID to the interview location.
                        </div>
                      </div>
                    )}

                    {app.reviewer_notes && (
                      <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl space-y-1">
                        <div className="flex items-center gap-1.5 text-teal-900 font-bold text-xs">
                          <MessageSquare className="w-4 h-4 text-teal-700" />
                          <span>Employer Feedback Note</span>
                        </div>
                        <p className="text-teal-800 text-xs leading-relaxed">{app.reviewer_notes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Applied on: {(app.applied_at || app.created_at || '').slice(0, 10)}</span>
                      <span>Ref ID: {app.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* WITHDRAW CONFIRMATION MODAL */}
      {withdrawModalId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-sm font-bold text-slate-900">Withdraw Application?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to withdraw this application? The employer will be notified, and you may need to re-apply if the role is still open.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setWithdrawModalId(null)}
                className="px-3 py-1.5 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleWithdrawConfirm(withdrawModalId)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Yes, Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
