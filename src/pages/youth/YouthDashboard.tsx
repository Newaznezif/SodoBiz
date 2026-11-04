import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { Opportunity, OpportunityApplication, SavedOpportunity, MentorshipRequest, TrainingEnrollment } from '../../types';
import {
  Briefcase,
  DollarSign,
  Rocket,
  GraduationCap,
  LifeBuoy,
  CheckCircle2,
  Clock,
  ArrowRight,
  Building2,
  Calendar,
  AlertCircle,
  FileText,
  User,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Award,
  UploadCloud,
  Layers,
} from 'lucide-react';

export const YouthDashboard: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<OpportunityApplication[]>([]);
  const [savedOpps, setSavedOpps] = useState<SavedOpportunity[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [enrollments, setEnrollments] = useState<TrainingEnrollment[]>([]);
  const [userDocs, setUserDocs] = useState<any[]>([]);
  const [readinessScore, setReadinessScore] = useState<number>(0);

  useEffect(() => {
    loadDashboardData();
  }, [currentUser.id]);

  const loadDashboardData = () => {
    const userApps = db.getApplications(currentUser.id);
    const userSaved = db.getSavedOpportunities(currentUser.id);
    const allOpps = db.getOpportunities();
    const userReqs = db.getMentorshipRequests(currentUser.id);
    const userEnrolls = db.getTrainingEnrollments(currentUser.id);
    const docs = db.getUserDocuments(currentUser.id);
    const readiness = db.getFinanceReadiness(currentUser.id);

    setApplications(userApps);
    setSavedOpps(userSaved);
    setOpportunities(allOpps);
    setMentorshipRequests(userReqs);
    setEnrollments(userEnrolls);
    setUserDocs(docs);

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
      setReadinessScore(40);
    }
  };

  // Profile completion calculation
  const getProfileCompletion = () => {
    let score = 20; // baseline
    if (currentUser.phone) score += 15;
    if (currentUser.education_level) score += 15;
    if (currentUser.skills && currentUser.skills.length > 0) score += 15;
    if (currentUser.career_goals) score += 10;
    if (currentUser.kebele) score += 10;
    if (userDocs.some((d) => d.document_type === 'cv')) score += 15;
    return Math.min(100, score);
  };

  const profilePct = getProfileCompletion();

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

  // Relevant opportunities based on user skills
  const recommendedOpps = opportunities
    .filter((opp) => (opp.status === 'open' || !opp.status))
    .sort((a, b) => {
      const aMatches = (currentUser.skills || []).filter((s) =>
        (a.required_skills || []).some((req) => req.toLowerCase().includes(s.toLowerCase()))
      ).length;
      const bMatches = (currentUser.skills || []).filter((s) =>
        (b.required_skills || []).some((req) => req.toLowerCase().includes(s.toLowerCase()))
      ).length;
      return bMatches - aMatches;
    })
    .slice(0, 4);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* SaaS Product Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              Youth Livelihood & Opportunity Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {currentUser.full_name}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Discover verified employment vacancies, apprenticeships, TVET skill certifications, and micro-financing resources across Wolaita Sodo.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('/opportunities')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              <Briefcase className="w-4 h-4" />
              <span>Explore Opportunities</span>
            </button>
            <button
              onClick={() => onNavigate('/youth/profile')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all border border-slate-700"
            >
              <User className="w-4 h-4" />
              <span>Manage Profile & CV</span>
            </button>
          </div>
        </div>

        {/* Real Dynamic Platform Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-slate-800 text-xs">
          <div>
            <div className="text-slate-400 text-[11px] font-medium">Open Opportunities</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              {opportunities.filter((o) => o.status === 'open' || !o.status).length} listings
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px] font-medium">My Active Applications</div>
            <div className="text-xl font-bold text-teal-400 font-mono mt-0.5">
              {applications.length} submitted
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px] font-medium">TVET Courses Enrolled</div>
            <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">
              {enrollments.length} active
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px] font-medium">Mentorship Connections</div>
            <div className="text-xl font-bold text-indigo-400 font-mono mt-0.5">
              {mentorshipRequests.length} sessions
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Pathway Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Applications */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Opportunity Pipeline</span>
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {applications.length}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {applications.filter((a) => a.status === 'accepted' || a.status === 'shortlisted' || a.status === 'interview_scheduled').length} advancing stages
            </div>
          </div>
          <button
            onClick={() => onNavigate('/youth/applications')}
            className="mt-4 text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 self-start"
          >
            <span>View Tracked Applications</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Finance Readiness */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Finance Readiness</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">{readinessScore}%</span>
              <span className="text-xs font-semibold text-emerald-600">Verified</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${readinessScore}%` }}></div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/finance-bridge')}
            className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 self-start"
          >
            <span>Check Financial Products</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: TVET Skills Progress */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Skills & TVET Courses</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {enrollments.length}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {enrollments.filter((e) => e.status === 'completed').length} completed certificates
            </div>
          </div>
          <button
            onClick={() => onNavigate('/skills-tvet')}
            className="mt-4 text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 self-start"
          >
            <span>Explore TVET Courses</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 4: Mentorship & Advisory */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mentorship Advisory</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {mentorshipRequests.length}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {mentorshipRequests.filter((r) => r.status === 'scheduled' || r.status === 'completed').length} confirmed sessions
            </div>
          </div>
          <button
            onClick={() => onNavigate('/mentorship')}
            className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start"
          >
            <span>Schedule Advisor</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Applications Tracker + Profile & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Applications Tracker & Opportunities */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Applications Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Your Opportunity Applications</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track your progress through review, shortlisting, interviews, and offers
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
              <div className="py-10 text-center">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
                <p className="text-xs font-semibold text-slate-700">No applications submitted yet.</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                  Browse open positions in Agro-processing, ICT, Construction, and Hospitality across Wolaita Sodo.
                </p>
                <button
                  onClick={() => onNavigate('/opportunities')}
                  className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Browse Open Opportunities</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 mt-2">
                {applications.slice(0, 4).map((app) => {
                  const opp = db.getOpportunityById(app.opportunity_id);
                  const org = opp ? db.getOrganizationById(opp.organization_id) : null;
                  return (
                    <div key={app.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 rounded-lg px-2 -mx-2 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{opp?.title || 'Opportunity'}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusColor(app.status)}`}>
                            {app.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="font-medium text-slate-700">{org?.name || 'Local Partner'}</span>
                          <span>·</span>
                          <span>Applied: {(app.applied_at || app.created_at || '').slice(0, 10)}</span>
                          <span>·</span>
                          <span className="capitalize">{opp?.type || 'Job'}</span>
                        </div>
                        {app.reviewer_notes && (
                          <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-md border border-slate-100 mt-1">
                            <span className="font-semibold text-slate-700">Employer Feedback: </span>
                            {app.reviewer_notes}
                          </div>
                        )}
                        {app.interview_date && (
                          <div className="text-[11px] text-blue-700 bg-blue-50/70 p-2 rounded-md border border-blue-100 mt-1 flex items-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Interview Scheduled: {new Date(app.interview_date).toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          onClick={() => onNavigate('/youth/applications')}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          Details
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
                <h2 className="text-sm font-bold text-slate-900">Recommended Opportunities for You</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Matched to your skills profile and vocational career interests
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
              {recommendedOpps.map((opp) => {
                const org = db.getOrganizationById(opp.organization_id);
                const hasApplied = applications.some((a) => a.opportunity_id === opp.id);
                return (
                  <div
                    key={opp.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-teal-500/60 bg-white hover:bg-slate-50/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded">
                          {opp.type.replace('_', ' ')} · {opp.spots_available} SPOTS
                        </span>
                        {opp.is_accessible && (
                          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Accessible</span>
                        )}
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">{opp.title}</h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{org?.name} · {opp.location}</p>
                      <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {opp.description}
                      </p>
                      {opp.required_skills && opp.required_skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {opp.required_skills.slice(0, 3).map((s, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 font-mono text-xs">
                        {opp.stipend_amount ? `${opp.stipend_amount.toLocaleString()} ${opp.currency}` : 'Stipend Provided'}
                      </span>
                      {hasApplied ? (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Applied</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onNavigate('/opportunities')}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
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

          {/* Enrolled Training Tracks */}
          {enrollments.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900">Enrolled Training & TVET Courses</h2>
                <button
                  onClick={() => onNavigate('/skills-tvet')}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <span>Go to TVET Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {enrollments.map((enr) => {
                  const course = db.getTrainingCourseById(enr.course_id);
                  return (
                    <div key={enr.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-900">{course?.title || 'Training Program'}</div>
                        <div className="text-[11px] text-slate-500">
                          {course?.provider_name} · Enrolled: {enr.enrolled_at.slice(0, 10)}
                        </div>
                        <div className="w-48 bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1.5">
                          <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${enr.progress_pct}%` }}></div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold font-mono text-slate-800">{enr.progress_pct}%</span>
                        <div className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5">{enr.status}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Youth Profile Card & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Profile Completeness</h2>
              <span className="text-xs font-extrabold text-teal-600">{profilePct}%</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div className="bg-teal-600 h-2 rounded-full transition-all duration-500" style={{ width: `${profilePct}%` }}></div>
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
              <div className="flex items-start justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Uploaded CV</span>
                <span className={`font-semibold text-right ${userDocs.some((d) => d.document_type === 'cv') ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {userDocs.some((d) => d.document_type === 'cv') ? 'Attached' : 'Not Uploaded'}
                </span>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-3.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Registered Skills</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {currentUser.skills && currentUser.skills.length > 0 ? (
                  currentUser.skills.map((skill, idx) => (
                    <span key={idx} className="text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
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
              className="mt-4 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors text-center"
            >
              Update Profile & Upload CV
            </button>
          </div>

          {/* Quick Opportunity Journey Links */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Connected Opportunity Journey
            </h3>

            <button
              onClick={() => onNavigate('/finance-bridge')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50/30 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Finance Bridge</div>
                  <div className="text-[11px] text-slate-500">TIN, loan checklist & products</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('/business-launchpad')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-amber-500/50 hover:bg-amber-50/30 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Business Launchpad</div>
                  <div className="text-[11px] text-slate-500">Startup costs, plan & incubator</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('/mentorship')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-500/50 hover:bg-indigo-50/30 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Mentorship Sessions</div>
                  <div className="text-[11px] text-slate-500">Connect with industry leaders</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('/support-directory')}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-teal-500/50 hover:bg-teal-50/30 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Support & Inclusion Directory</div>
                  <div className="text-[11px] text-slate-500">Disability, youth center, advisory</div>
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
