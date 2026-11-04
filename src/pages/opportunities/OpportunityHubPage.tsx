import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { Opportunity, OpportunityApplication, Organization } from '../../types';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  X,
  Send,
  Eye,
  Users,
} from 'lucide-react';

export const OpportunityHubPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [applications, setApplications] = useState<OpportunityApplication[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [onlyAccessible, setOnlyAccessible] = useState(false);

  // Apply Modal state
  const [selectedOppForApply, setSelectedOppForApply] = useState<Opportunity | null>(null);
  const [applicantPhone, setApplicantPhone] = useState(currentUser.phone || '');
  const [motivation, setMotivation] = useState('');
  const [relevantSkills, setRelevantSkills] = useState(currentUser.skills?.join(', ') || '');
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  // Employer Post Modal state
  const [showPostModal, setShowPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'job' | 'internship' | 'apprenticeship' | 'training'>('apprenticeship');
  const [newDesc, setNewDesc] = useState('');
  const [newRequirements, setNewRequirements] = useState('');
  const [newLocation, setNewLocation] = useState('Wolaita Sodo Industrial Zone');
  const [newStipend, setNewStipend] = useState('3500');
  const [newSpots, setNewSpots] = useState('3');
  const [newAccessible, setNewAccessible] = useState(true);

  useEffect(() => {
    loadData();
  }, [currentUser.id]);

  const loadData = () => {
    const opps = db.getOpportunities();
    const orgs = db.getOrganizations();
    const userApps = db.getApplications(currentUser.id);
    const saved = db.getSavedOpportunities(currentUser.id);

    setOpportunities(opps);
    setOrganizations(orgs);
    setApplications(userApps);
    setSavedIds(saved.map((s) => s.opportunity_id));
  };

  const handleToggleSave = (oppId: string) => {
    db.toggleSaveOpportunity(currentUser.id, oppId);
    loadData();
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOppForApply) return;
    setApplyError('');

    try {
      db.submitApplication({
        opportunity_id: selectedOppForApply.id,
        user_id: currentUser.id,
        motivation_statement: motivation.trim() || 'Excited to contribute to this role in Wolaita Sodo.',
        relevant_skills: relevantSkills.split(',').map((s) => s.trim()).filter(Boolean),
        phone: applicantPhone,
      });

      setApplySuccess(true);
      loadData();
      setTimeout(() => {
        setApplySuccess(false);
        setSelectedOppForApply(null);
        setMotivation('');
      }, 2000);
    } catch (err: any) {
      setApplyError(err.message || 'Application could not be submitted');
    }
  };

  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    // Use first verified organization for demo
    const defaultOrg = organizations[0]?.id || 'org-damota';

    db.createOpportunity({
      organization_id: defaultOrg,
      title: newTitle,
      type: newType,
      description: newDesc,
      requirements: newRequirements.split('\n').filter(Boolean),
      location: newLocation,
      stipend_amount: Number(newStipend) || 0,
      currency: 'ETB',
      spots_available: Number(newSpots) || 1,
      deadline: '2026-12-31',
      is_accessible: newAccessible,
      created_by: currentUser.id,
    });

    setShowPostModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewRequirements('');
    loadData();
  };

  // Filter logic
  const filteredOpps = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'all' || opp.type === selectedType;
    const matchesAccessibility = !onlyAccessible || opp.is_accessible;

    return matchesSearch && matchesType && matchesAccessibility;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <span>SodoBiz Opportunity Hub</span>
              <span>·</span>
              <span>Wolaita Sodo Local Placements</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Discover Jobs, TVET Apprenticeships & Skill Cohorts
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Connecting young job-seekers and micro-entrepreneurs directly with verified local businesses, industrial agro-processors, and tech hubs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(currentUser.role === 'employer' || currentUser.role === 'admin' || currentUser.role === 'agent') && (
              <button
                onClick={() => setShowPostModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Opportunity</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('/commitments')}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700"
            >
              <Users className="w-4 h-4 text-teal-400" />
              <span>Partner Commitments</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Fast Filters */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by job title, trade, or location (e.g. electrical, agro, barista)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {['all', 'job', 'apprenticeship', 'training', 'internship'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors capitalize ${
                  selectedType === type
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {type === 'all' ? 'All Types' : type}
              </button>
            ))}

            <button
              onClick={() => setOnlyAccessible(!onlyAccessible)}
              className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                onlyAccessible
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>Accessible Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Count & Disclaimer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2 px-1">
        <div>
          Showing <span className="font-bold text-slate-800">{filteredOpps.length}</span> active opportunities in Sodo
        </div>
        <div className="text-[11px] text-slate-400 italic">
          All listings are verified with signed employer partner retention pledges.
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOpps.map((opp) => {
          const org = organizations.find((o) => o.id === opp.organization_id);
          const hasApplied = applications.some((a) => a.opportunity_id === opp.id);
          const isSaved = savedIds.includes(opp.id);

          return (
            <div
              key={opp.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs flex flex-col justify-between overflow-hidden transition-all"
            >
              <div className="p-5 space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                    {opp.type}
                  </div>
                  <button
                    onClick={() => handleToggleSave(opp.id)}
                    className="text-slate-400 hover:text-teal-600 transition-colors p-1"
                    title={isSaved ? 'Remove from saved' : 'Save opportunity'}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-teal-600 fill-teal-100" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Title & Employer */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{opp.title}</h3>
                  <div className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{org?.name || 'Local Partner'}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {opp.description}
                </p>

                {/* Requirements snippets */}
                {opp.requirements && opp.requirements.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Key Requirements</div>
                    <ul className="text-[11px] text-slate-600 space-y-0.5">
                      {opp.requirements.slice(0, 2).map((req, i) => (
                        <li key={i} className="truncate flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Metadata Pills */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[140px]">{opp.location}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{opp.spots_available} spots</span>
                  </span>
                  {opp.is_accessible && (
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                      Accessible
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer: Stipend & Apply Action */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Compensation</div>
                  <div className="text-xs font-bold text-slate-900 font-mono">
                    {opp.stipend_amount ? `${opp.stipend_amount.toLocaleString()} ${opp.currency}/mo` : 'Unpaid TVET Cohort'}
                  </div>
                </div>

                {hasApplied ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Applied</span>
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedOppForApply(opp);
                      setApplicantPhone(currentUser.phone || '');
                      setRelevantSkills(currentUser.skills?.join(', ') || '');
                      setApplyError('');
                    }}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    <span>Apply Now</span>
                    <Send className="w-3 h-3 text-teal-400" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Apply Modal */}
      {selectedOppForApply && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                  Opportunity Application
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedOppForApply.title}</h3>
              </div>
              <button
                onClick={() => setSelectedOppForApply(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-5 space-y-4">
              {applyError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{applyError}</span>
                </div>
              )}

              {applySuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Application successfully submitted! The employer will review your profile.</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Applicant Name
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser.full_name}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone Number (telebirr verified)
                </label>
                <input
                  type="tel"
                  required
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  placeholder="+251 9X XXX XXXX"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Relevant Skills & TVET Certificates
                </label>
                <input
                  type="text"
                  value={relevantSkills}
                  onChange={(e) => setRelevantSkills(e.target.value)}
                  placeholder="e.g. Electrical wiring, Customer service, Barista..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Brief Statement of Interest / Motivation
                </label>
                <textarea
                  required
                  rows={3}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="Explain why you want this apprenticeship or job, and how you will commit to completing the placement in Sodo."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOppForApply(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applySuccess}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                >
                  Confirm & Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Opportunity Modal for Employers */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                  Employer Portal
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Publish New Opportunity</h3>
              </div>
              <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOpportunity} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Opportunity Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Grain Processing Machinery Operator"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="apprenticeship">Apprenticeship</option>
                    <option value="job">Direct Job</option>
                    <option value="training">TVET Training</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Available Spots</label>
                  <input
                    type="number"
                    min="1"
                    value={newSpots}
                    onChange={(e) => setNewSpots(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Stipend (ETB)</label>
                  <input
                    type="number"
                    value={newStipend}
                    onChange={(e) => setNewStipend(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Tasks</label>
                <textarea
                  rows={2}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe daily responsibilities, mentor support provided, and pathways to retention."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Requirements (one per line)</label>
                <textarea
                  rows={2}
                  value={newRequirements}
                  onChange={(e) => setNewRequirements(e.target.value)}
                  placeholder="Basic literacy&#10;Punctuality&#10;TVET Level 1 preferred"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="accessibleCheck"
                  checked={newAccessible}
                  onChange={(e) => setNewAccessible(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <label htmlFor="accessibleCheck" className="text-xs text-slate-700 font-medium">
                  Accessible to candidates with disabilities / flexible work setup
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
