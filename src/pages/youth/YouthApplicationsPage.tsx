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
} from 'lucide-react';

export const YouthApplicationsPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<OpportunityApplication[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<OpportunityApplication | null>(null);

  useEffect(() => {
    loadApplications();
  }, [currentUser.id]);

  const loadApplications = () => {
    const list = db.getApplications(currentUser.id);
    setApplications(list);
  };

  const handleWithdraw = (appId: string) => {
    if (confirm('Are you sure you want to withdraw this application?')) {
      db.updateApplicationStatus(appId, 'withdrawn', 'Candidate requested withdrawal.');
      loadApplications();
    }
  };

  const filteredApps = applications.filter((app) => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  const getStatusBadge = (status: OpportunityApplication['status']) => {
    switch (status) {
      case 'accepted':
        return <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider">Accepted / Placed</span>;
      case 'interview_scheduled':
        return <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider">Interview Scheduled</span>;
      case 'shortlisted':
        return <span className="text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider">Shortlisted</span>;
      case 'reviewing':
        return <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider">Under Review</span>;
      case 'rejected':
        return <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider">Not Selected</span>;
      case 'withdrawn':
        return <span className="text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider">Withdrawn</span>;
      case 'submitted':
      default:
        return <span className="text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider">Submitted</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => onNavigate('/youth/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-xl font-bold text-slate-900">Application Status Tracker</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status updates from Sodo employers and TVET providers.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/opportunities')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-xs"
        >
          <Briefcase className="w-4 h-4" />
          <span>Find More Opportunities</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: `All (${applications.length})` },
          { id: 'submitted', label: 'Submitted' },
          { id: 'reviewing', label: 'Under Review' },
          { id: 'shortlisted', label: 'Shortlisted' },
          { id: 'interview_scheduled', label: 'Interview Scheduled' },
          { id: 'accepted', label: 'Accepted' },
          { id: 'rejected', label: 'Not Selected' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
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
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800">No applications in this category</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You do not currently have any applications with the selected status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApps.map((app) => {
            const opp = db.getOpportunityById(app.opportunity_id);
            const org = opp ? db.getOrganizationById(opp.organization_id) : null;

            return (
              <div
                key={app.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-base font-bold text-slate-900">{opp?.title || 'Opportunity'}</h2>
                      {getStatusBadge(app.status)}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {org?.name || 'Local Partner'}
                      </span>
                      <span>·</span>
                      <span className="capitalize">{opp?.type}</span>
                      <span>·</span>
                      <span>Applied: {(app.applied_at || app.created_at || '').slice(0, 10)}</span>
                      <span>·</span>
                      <span className="font-mono font-medium text-slate-700">
                        {opp?.stipend_amount ? `${opp.stipend_amount.toLocaleString()} ${opp.currency}` : 'Stipend Unspecified'}
                      </span>
                    </div>

                    {/* Applicant Motivation Note */}
                    <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 border border-slate-100">
                      <span className="font-semibold text-slate-700">Your Submitted Statement: </span>
                      {app.motivation_statement}
                    </div>

                    {/* Reviewer Note / Interview Date */}
                    {app.reviewer_notes && (
                      <div className="bg-teal-50/60 rounded-lg p-3 text-xs text-teal-900 border border-teal-100">
                        <span className="font-semibold text-teal-800">Employer Follow-up: </span>
                        {app.reviewer_notes}
                        {app.interview_date && (
                          <div className="mt-1 font-semibold text-teal-800">
                            Scheduled Interview Time: {new Date(app.interview_date).toLocaleString()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => onNavigate('/opportunities')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                    >
                      View Posting
                    </button>
                    {app.status !== 'withdrawn' && app.status !== 'accepted' && (
                      <button
                        onClick={() => handleWithdraw(app.id)}
                        className="text-xs text-slate-500 hover:text-rose-600 py-1 transition-colors"
                      >
                        Withdraw Application
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
