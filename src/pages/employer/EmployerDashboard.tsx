import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { Opportunity, OpportunityApplication, Organization, PartnerCommitment, UserProfile } from '../../types';
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
  ChevronRight,
  Filter,
  Eye,
  Edit,
  Trash2,
  PauseCircle,
  PlayCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const EmployerDashboard: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<OpportunityApplication[]>([]);
  const [commitments, setCommitments] = useState<PartnerCommitment[]>([]);
  const [activeTab, setActiveTab] = useState<'applications' | 'listings' | 'post' | 'commitments'>('applications');

  // Application Review State
  const [selectedApp, setSelectedApp] = useState<OpportunityApplication | null>(null);
  const [newStatus, setNewStatus] = useState<OpportunityApplication['status']>('shortlisted');
  const [reviewNote, setReviewNote] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [actionSuccess, setActionSuccess] = useState(false);
  const [appFilterStatus, setAppFilterStatus] = useState<string>('all');
  const [appFilterOppId, setAppFilterOppId] = useState<string>('all');

  // New Opportunity Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Opportunity['type']>('job');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [location, setLocation] = useState('Wolaita Sodo Industrial Zone');
  const [stipend, setStipend] = useState('4500');
  const [spots, setSpots] = useState('4');
  const [deadline, setDeadline] = useState('2026-12-31');
  const [accessible, setAccessible] = useState(true);

  // Edit Opportunity Modal State
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);

  useEffect(() => {
    loadEmployerData();
  }, [currentUser.id]);

  const loadEmployerData = () => {
    const allOrgs = db.getOrganizations();
    setOrganizations(allOrgs);

    const defaultOrg = currentUser.organization_id || allOrgs[0]?.id || 'org-damota';
    if (!selectedOrgId) {
      setSelectedOrgId(defaultOrg);
    }

    const allOpps = db.getOpportunities();
    const allApps = db.getApplications();
    const allCommits = db.getCommitments();

    setOpportunities(allOpps);
    setApplications(allApps);
    setCommitments(allCommits);
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
    if (!title.trim()) return;

    db.createOpportunity({
      organization_id: selectedOrgId || 'org-damota',
      title: title.trim(),
      type,
      description: description.trim(),
      requirements: requirements.split('\n').filter(Boolean),
      location: location.trim(),
      stipend_amount: Number(stipend) || 0,
      currency: 'ETB',
      spots_available: Number(spots) || 1,
      deadline,
      is_accessible: accessible,
      created_by: currentUser.id,
    });

    setTitle('');
    setDescription('');
    setRequirements('');
    loadEmployerData();
    setActiveTab('listings');
  };

  const handleToggleListingStatus = (opp: Opportunity) => {
    const next = opp.status === 'open' ? 'paused' : 'open';
    db.updateOpportunity(opp.id, { status: next });
    loadEmployerData();
  };

  const handleDeleteListing = (oppId: string) => {
    if (confirm('Are you sure you want to remove this opportunity listing?')) {
      db.deleteOpportunity(oppId);
      loadEmployerData();
    }
  };

  const handleUpdateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOpp) return;
    db.updateOpportunity(editingOpp.id, editingOpp);
    setEditingOpp(null);
    loadEmployerData();
  };

  // Filtered applications
  const filteredApplications = applications.filter((app) => {
    const matchesStatus = appFilterStatus === 'all' || app.status === appFilterStatus;
    const matchesOpp = appFilterOppId === 'all' || app.opportunity_id === appFilterOppId;
    return matchesStatus && matchesOpp;
  });

  const totalPlaced = applications.filter((a) => a.status === 'accepted').length;
  const currentOrg = organizations.find((o) => o.id === selectedOrgId) || organizations[0];
  const orgCommitments = commitments.filter((c) => c.organization_id === selectedOrgId);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* SaaS Employer Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>Partner Employer & Placement Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {currentOrg ? currentOrg.name : currentUser.full_name}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Screen candidate CVs, schedule technical interviews, coordinate TVET apprenticeships, and uphold verified job retention targets in Wolaita Sodo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {organizations.length > 1 && (
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="px-3 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold focus:outline-none"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={() => setActiveTab('post')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Opportunity</span>
            </button>
            <button
              onClick={() => onNavigate('/commitments')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700"
            >
              <Award className="w-4 h-4 text-teal-400" />
              <span>Commitments</span>
            </button>
          </div>
        </div>

        {/* Real KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-slate-800 text-xs">
          <div>
            <div className="text-slate-400 text-[11px] font-medium">Published Listings</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">{opportunities.length} active</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px] font-medium">Total Applications Received</div>
            <div className="text-xl font-bold text-teal-400 font-mono mt-0.5">{applications.length} candidates</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px] font-medium">Scheduled Interviews</div>
            <div className="text-xl font-bold text-blue-400 font-mono mt-0.5">
              {applications.filter((a) => a.status === 'interview_scheduled').length}
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px] font-medium">Final Placements (Retained)</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">{totalPlaced} hires</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'applications'
              ? 'border-teal-600 text-teal-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Candidate Pipeline ({applications.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'listings'
              ? 'border-teal-600 text-teal-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Manage Listings ({opportunities.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('post')}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'post'
              ? 'border-teal-600 text-teal-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Listing</span>
        </button>
        <button
          onClick={() => setActiveTab('commitments')}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'commitments'
              ? 'border-teal-600 text-teal-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Retention Commitments ({orgCommitments.length})</span>
        </button>
      </div>

      {/* TAB 1: APPLICATIONS PIPELINE & REVIEW */}
      {activeTab === 'applications' && (
        <div className="space-y-5">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="font-bold text-slate-700">Filter By Opportunity:</span>
              <select
                value={appFilterOppId}
                onChange={(e) => setAppFilterOppId(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
              >
                <option value="all">All Opportunities</option>
                {opportunities.map((opp) => (
                  <option key={opp.id} value={opp.id}>
                    {opp.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {[
                { id: 'all', label: 'All' },
                { id: 'submitted', label: 'Submitted' },
                { id: 'reviewing', label: 'Reviewing' },
                { id: 'shortlisted', label: 'Shortlisted' },
                { id: 'interview_scheduled', label: 'Interview' },
                { id: 'accepted', label: 'Accepted' },
                { id: 'rejected', label: 'Rejected' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setAppFilterStatus(pill.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                    appFilterStatus === pill.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
              <h3 className="text-sm font-bold text-slate-800">No candidate applications in this view</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Applications submitted by youth across Wolaita Sodo will appear here for review.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredApplications.map((app) => {
                const opp = db.getOpportunityById(app.opportunity_id);
                const applicant = db.getUserById(app.user_id);

                return (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-slate-900">
                            {applicant ? applicant.full_name : 'Youth Candidate'}
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-teal-50 text-teal-800 border border-teal-200">
                            {app.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span>Target: <strong className="text-slate-800">{opp?.title}</strong></span>
                          <span>·</span>
                          <span>Phone: {app.phone || applicant?.phone || 'No phone'}</span>
                          <span>·</span>
                          <span>Education: {applicant?.education_level || 'Grade 12'}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setNewStatus(app.status);
                          setReviewNote(app.reviewer_notes || '');
                          setInterviewDate(app.interview_date || '');
                        }}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors self-start shadow-xs"
                      >
                        Review & Update Status
                      </button>
                    </div>

                    {/* Candidate motivation & CV preview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-100">
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Applicant Motivation
                        </span>
                        <p className="text-slate-700 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                          "{app.motivation_statement}"
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-semibold">Attached CV:</span>
                          <span className="font-mono text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {app.cv_filename || 'Candidate_Profile.pdf'}
                          </span>
                        </div>
                        {applicant?.skills && (
                          <div className="flex flex-wrap gap-1">
                            {applicant.skills.map((s, i) => (
                              <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                        {app.interview_date && (
                          <div className="text-blue-700 font-semibold text-xs flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Interview: {new Date(app.interview_date).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* APPLICATION REVIEW MODAL */}
          {selectedApp && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 my-8">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Review Candidate Application</h2>
                    <p className="text-xs text-slate-500">
                      Update applicant status, schedule interview, and record feedback.
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                {actionSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h3 className="text-sm font-bold text-emerald-900">Status Updated Successfully!</h3>
                    <p className="text-xs text-emerald-700">The applicant has been notified of their updated status.</p>
                  </div>
                ) : (
                  <form onSubmit={handleStatusUpdate} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Lifecycle Status</label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                      >
                        <option value="submitted">Submitted (Pending Review)</option>
                        <option value="reviewing">Under Review / CV Screening</option>
                        <option value="shortlisted">Shortlisted for Practical Test</option>
                        <option value="interview_scheduled">Interview Scheduled</option>
                        <option value="accepted">Accepted / Offer Extended</option>
                        <option value="rejected">Not Selected</option>
                      </select>
                    </div>

                    {newStatus === 'interview_scheduled' && (
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Interview Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={interviewDate}
                          onChange={(e) => setInterviewDate(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Employer Feedback / Instructions
                      </label>
                      <textarea
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        rows={3}
                        placeholder="Provide feedback, practical exam location, or required documents to bring..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setSelectedApp(null)}
                        className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold shadow-xs transition-colors"
                      >
                        Save & Notify Applicant
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANAGE LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Active Organization Postings</h2>
            <button
              onClick={() => setActiveTab('post')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Listing</span>
            </button>
          </div>

          <div className="space-y-3">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{opp.title}</h3>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {opp.type.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        opp.status === 'open' || !opp.status
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {opp.status || 'open'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{opp.location}</span>
                    <span>·</span>
                    <span>{opp.spots_available} spots</span>
                    <span>·</span>
                    <span>{opp.stipend_amount ? `${opp.stipend_amount} ETB` : 'Unpaid'}</span>
                    <span>·</span>
                    <span>Deadline: {opp.deadline || 'Open'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleListingStatus(opp)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1"
                  >
                    {opp.status === 'open' ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                    <span>{opp.status === 'open' ? 'Pause' : 'Activate'}</span>
                  </button>
                  <button
                    onClick={() => setEditingOpp(opp)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteListing(opp.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* EDIT LISTING MODAL */}
          {editingOpp && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 my-8">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">Edit Opportunity Listing</h3>
                  <button onClick={() => setEditingOpp(null)} className="text-slate-400 hover:text-slate-700">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateListing} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editingOpp.title}
                      onChange={(e) => setEditingOpp({ ...editingOpp, title: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={editingOpp.location}
                      onChange={(e) => setEditingOpp({ ...editingOpp, location: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Stipend (ETB)</label>
                      <input
                        type="number"
                        value={editingOpp.stipend_amount || 0}
                        onChange={(e) => setEditingOpp({ ...editingOpp, stipend_amount: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Spots Available</label>
                      <input
                        type="number"
                        value={editingOpp.spots_available}
                        onChange={(e) => setEditingOpp({ ...editingOpp, spots_available: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Description</label>
                    <textarea
                      value={editingOpp.description}
                      onChange={(e) => setEditingOpp({ ...editingOpp, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingOpp(null)}
                      className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold shadow-xs"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PUBLISH NEW LISTING */}
      {activeTab === 'post' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-2xl">
          <div className="border-b border-slate-100 pb-4 mb-5">
            <h2 className="text-base font-bold text-slate-900">Publish New Opportunity Listing</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify training outcomes, monthly stipend allowances, and accessibility support for Sodo candidates.
            </p>
          </div>

          <form onSubmit={handleCreateOpportunity} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Opportunity Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                >
                  <option value="job">Direct Employment Contract</option>
                  <option value="internship">Student Internship</option>
                  <option value="apprenticeship">Vocational TVET Apprenticeship</option>
                  <option value="training">Technical Skills Training</option>
                  <option value="scholarship">Tuition Scholarship</option>
                  <option value="entrepreneurship">Micro-Enterprise Grant / Cohort</option>
                  <option value="business_support">Business Development Services</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Position / Role Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Grain Milling Operator"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Role Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                placeholder="Describe practical responsibilities, tools handled, and supervision provided..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Requirements (one per line)</label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={2}
                placeholder="High school completion or TVET Level 1&#10;Reside in Wolaita Sodo&#10;Willing to work full-time"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Monthly Stipend (ETB)</label>
                <input
                  type="number"
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Placements / Openings</label>
                <input
                  type="number"
                  value={spots}
                  onChange={(e) => setSpots(e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accessible}
                  onChange={(e) => setAccessible(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>Accessible to youth with disabilities</span>
              </label>

              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Publish Listing
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: PARTNER COMMITMENTS */}
      {activeTab === 'commitments' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Signed Placement & Retention Commitments</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Target placements pledged by {currentOrg?.name || 'this employer'} with verified 60-day retention outcomes.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/commitments')}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Open Full Commitment Tracker
            </button>
          </div>

          {orgCommitments.length === 0 ? (
            <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
              <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No formal commitment records found for this entity.</p>
              <button
                onClick={() => onNavigate('/commitments')}
                className="mt-3 text-xs font-bold text-teal-600 hover:underline"
              >
                Sign a placement pledge →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orgCommitments.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">{c.opportunity_type}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        c.status === 'verified_outcomes'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Spots Promised</span>
                      <span className="font-bold text-slate-900 text-sm">{c.spots_promised}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Delivered</span>
                      <span className="font-bold text-teal-700 text-sm">{c.placements_delivered}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Verified Retained</span>
                      <span className="font-bold text-emerald-700 text-sm">{c.verified_retained}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
