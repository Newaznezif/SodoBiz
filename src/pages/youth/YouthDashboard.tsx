import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { Opportunity, OpportunityApplication, SavedOpportunity, MentorProfile, MentorshipRequest } from '../../types';
import {
  Briefcase,
  Award,
  DollarSign,
  Rocket,
  GraduationCap,
  LifeBuoy,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookmarkCheck,
  Building2,
  Calendar,
  AlertCircle,
  FileText,
  User,
  ChevronRight,
} from 'lucide-react';

export const YouthDashboard: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser, language } = useAuth();
  const [applications, setApplications] = useState<OpportunityApplication[]>([]);
  const [savedOpps, setSavedOpps] = useState<SavedOpportunity[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [readinessScore, setReadinessScore] = useState<number>(0);

  useEffect(() => {
    loadDashboardData();
  }, [currentUser.id]);

  const loadDashboardData = () => {
    const userApps = db.getApplications(currentUser.id);
    const userSaved = db.getSavedOpportunities(currentUser.id);
    const allOpps = db.getOpportunities();
    const userReqs = db.getMentorshipRequests(currentUser.id);
    const readiness = db.getFinanceReadiness(currentUser.id);

    setApplications(userApps);
    setSavedOpps(userSaved);
    setOpportunities(allOpps);
    setMentorshipRequests(userReqs);

    if (readiness) {
      let count = 0;
      if (readiness.has_valid_id) count++;
      if (readiness.has_tin_number) count++;
      if (readiness.has_trade_license) count++;
      if (readiness.has_written_business_plan) count++;
      if (readiness.has_solidarity_group) count++;
      if (readiness.has_recorded_bookkeeping) count++;
      if (readiness.willing_to_attend_training) count++;
      setReadinessScore(Math.round((count / 7) * 100));
    } else {
      setReadinessScore(30); // Base default
    }
  };

  // Profile completion calculation
  const getProfileCompletion = () => {
    let score = 20; // baseline
    if (currentUser.phone) score += 15;
    if (currentUser.education_level) score += 15;
    if (currentUser.skills && currentUser.skills.length > 0) score += 20;
    if (currentUser.career_goals) score += 15;
    if (currentUser.kebele) score += 15;
    return Math.min(100, score);
  };

  const profilePct = getProfileCompletion();

  // Status color helper for applications
  const getStatusColor = (status: OpportunityApplication['status']) => {
    switch (status) {
      case 'accepted':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'interview_scheduled':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'shortlisted':
        return 'text-teal-700 bg-teal-50 border-teal-200';
      case 'reviewing':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'rejected':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'withdrawn':
        return 'text-slate-600 bg-slate-100 border-slate-200';
      case 'submitted':
      default:
        return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Sodo Innovation HackLab Context Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              Sodo Innovation HackLab Field Mission Cohort
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Welcome, {currentUser.full_name}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Bridging Sodo youth from ideas to sustainable income. Connecting 54 selected Youth Center candidates, 40 TVET cohort members, and 41 mapped business partners across Wolaita Sodo.
            </p>
          </div>
          <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
            <button
              onClick={() => onNavigate('/opportunities')}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Explore Opportunities</span>
            </button>
            <button
              onClick={() => onNavigate('/youth/profile')}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700"
            >
              <User className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* HackLab Mission Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-800 text-xs">
          <div>
            <div className="text-slate-400 text-[11px]">Businesses Mapped</div>
            <div className="text-lg font-bold text-white font-mono">117 in Sodo</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Active Partners</div>
            <div className="text-lg font-bold text-teal-400 font-mono">41 participating</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">TVET Cohort 1</div>
            <div className="text-lg font-bold text-amber-400 font-mono">40 enrolled (Goal: 1k)</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Sodo Youth Center</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">54 candidates</div>
          </div>
        </div>
      </div>

      {/* 4 Core Pathway KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Applications */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Applications</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {applications.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {applications.filter((a) => a.status === 'accepted' || a.status === 'shortlisted').length} shortlisted or advancing
            </div>
          </div>
          <button
            onClick={() => onNavigate('/youth/applications')}
            className="mt-3 text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 self-start"
          >
            <span>View status tracker</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Finance Readiness */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Finance Readiness</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{readinessScore}%</span>
              <span className="text-[11px] text-emerald-600 font-medium">Ready</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${readinessScore}%` }}></div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/finance-bridge')}
            className="mt-3 text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 self-start"
          >
            <span>Complete loan checklist</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Business Launchpad */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Business Launchpad</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Rocket className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm font-bold text-slate-900">
              Micro-Enterprise Plan
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Structure startup idea, cash flow & equipment
            </div>
          </div>
          <button
            onClick={() => onNavigate('/business-launchpad')}
            className="mt-3 text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 self-start"
          >
            <span>Launch business planner</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 4: Mentorship & Advisory */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Mentorship Advisory</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {mentorshipRequests.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {mentorshipRequests.filter((r) => r.status === 'scheduled' || r.status === 'completed').length} sessions active / completed
            </div>
          </div>
          <button
            onClick={() => onNavigate('/mentorship')}
            className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start"
          >
            <span>Request mentor session</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Applications Tracker + Profile & Pathways */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Applications Tracker & Opportunities */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Applications Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Your Opportunity Applications</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Follow up on your submitted job, apprenticeship, and TVET cohort applications
                </p>
              </div>
              <button
                onClick={() => onNavigate('/youth/applications')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <span>View All ({applications.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="py-8 text-center">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-600">No applications submitted yet.</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                  Browse verified opportunities from Damota Agro, Wolaita Digital Hub, Highlands Automotive, and Sodo Youth Center.
                </p>
                <button
                  onClick={() => onNavigate('/opportunities')}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-xs font-semibold"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Browse Opportunities</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 mt-2">
                {applications.slice(0, 4).map((app) => {
                  const opp = db.getOpportunityById(app.opportunity_id);
                  const org = opp ? db.getOrganizationById(opp.organization_id) : null;
                  return (
                    <div key={app.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{opp?.title || 'Opportunity'}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusColor(app.status)}`}>
                            {app.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="font-medium text-slate-700">{org?.name || 'Local Partner'}</span>
                          <span>·</span>
                          <span>Applied: {(app.applied_at || app.created_at || '').slice(0, 10)}</span>
                          <span>·</span>
                          <span className="capitalize">{opp?.type}</span>
                        </div>
                        {app.reviewer_notes && (
                          <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 mt-1">
                            <span className="font-semibold text-slate-700">Employer Note: </span>
                            {app.reviewer_notes}
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          onClick={() => onNavigate(`/opportunities`)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recommended Opportunities Showcase */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Featured Sodo Opportunities</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified placements with signed retention commitments from local partners
                </p>
              </div>
              <button
                onClick={() => onNavigate('/opportunities')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <span>Browse All ({opportunities.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
              {opportunities.slice(0, 4).map((opp) => {
                const org = db.getOrganizationById(opp.organization_id);
                const hasApplied = applications.some((a) => a.opportunity_id === opp.id);
                return (
                  <div
                    key={opp.id}
                    className="p-3.5 rounded-lg border border-slate-200 hover:border-teal-500/60 bg-white hover:bg-slate-50/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider">
                          {opp.type.toUpperCase()} · {opp.spots_available} SPOTS
                        </span>
                        {opp.is_accessible && (
                          <span className="text-[10px] font-medium text-emerald-700">Accessible</span>
                        )}
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{opp.title}</h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{org?.name}</p>
                      <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {opp.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 font-mono text-[11px]">
                        {opp.stipend_amount ? `${opp.stipend_amount.toLocaleString()} ${opp.currency}` : 'Unpaid Training'}
                      </span>
                      {hasApplied ? (
                        <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Applied</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onNavigate('/opportunities')}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
                        >
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Youth Profile Card & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Youth Profile Status</h2>
              <span className="text-xs font-bold text-teal-600">{profilePct}% complete</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${profilePct}%` }}></div>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex items-start justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Education</span>
                <span className="font-semibold text-slate-800 text-right">{currentUser.education_level || 'Grade 12'}</span>
              </div>
              <div className="flex items-start justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">TVET Cohort</span>
                <span className="font-semibold text-slate-800 text-right capitalize">{currentUser.tvet_status || 'Enrolled'}</span>
              </div>
              <div className="flex items-start justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Field of Study</span>
                <span className="font-semibold text-slate-800 text-right">{currentUser.field_of_study || 'ICT / General'}</span>
              </div>
              <div className="flex items-start justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Kebele</span>
                <span className="font-semibold text-slate-800 text-right">{currentUser.kebele || 'Sodo City'}</span>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-3.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Registered Skills</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {currentUser.skills && currentUser.skills.length > 0 ? (
                  currentUser.skills.map((skill, idx) => (
                    <span key={idx} className="text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No skills listed yet</span>
                )}
              </div>
            </div>

            <button
              onClick={() => onNavigate('/youth/profile')}
              className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors text-center"
            >
              Update Profile Details
            </button>
          </div>

          {/* Quick Opportunity Journey Links */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Connected Opportunity Journey
            </h3>

            <button
              onClick={() => onNavigate('/finance-bridge')}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50/30 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">Finance Readiness</div>
                  <div className="text-[11px] text-slate-500">TIN, trade license & loan checklist</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('/business-launchpad')}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-amber-500/50 hover:bg-amber-50/30 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">Business Launchpad</div>
                  <div className="text-[11px] text-slate-500">Structure startup costs & micro-plan</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('/mentorship')}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-indigo-500/50 hover:bg-indigo-50/30 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">Mentorship Sessions</div>
                  <div className="text-[11px] text-slate-500">Connect with local Sodo leaders</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('/support-directory')}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-teal-500/50 hover:bg-teal-50/30 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">Inclusion & Support</div>
                  <div className="text-[11px] text-slate-500">Disability, youth center, counseling</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
