import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { Opportunity, OpportunityApplication, Organization, UserDocument } from '../../types';
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
  Edit,
  Trash2,
  PauseCircle,
  PlayCircle,
  FileText,
  UploadCloud,
  ChevronDown,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const OpportunityHubPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [applications, setApplications] = useState<OpportunityApplication[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [userDocs, setUserDocs] = useState<UserDocument[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'stipend' | 'deadline' | 'spots'>('newest');
  const [onlyAccessible, setOnlyAccessible] = useState(false);

  // View Opportunity Details Modal
  const [viewOpp, setViewOpp] = useState<Opportunity | null>(null);

  // Apply Modal state
  const [selectedOppForApply, setSelectedOppForApply] = useState<Opportunity | null>(null);
  const [applicantPhone, setApplicantPhone] = useState(currentUser.phone || '');
  const [motivation, setMotivation] = useState('');
  const [selectedCvDocId, setSelectedCvDocId] = useState<string>('');
  const [relevantSkills, setRelevantSkills] = useState(currentUser.skills?.join(', ') || '');
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  // Employer / Admin Post & Edit Modal
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingOppId, setEditingOppId] = useState<string | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<Opportunity['type']>('job');
  const [formDesc, setFormDesc] = useState('');
  const [formRequirements, setFormRequirements] = useState('');
  const [formLocation, setFormLocation] = useState('Wolaita Sodo Industrial Zone');
  const [formStipend, setFormStipend] = useState('4500');
  const [formSpots, setFormSpots] = useState('3');
  const [formDeadline, setFormDeadline] = useState('2026-12-31');
  const [formAccessible, setFormAccessible] = useState(true);

  useEffect(() => {
    loadData();
  }, [currentUser.id]);

  const loadData = () => {
    const opps = db.getOpportunities();
    const orgs = db.getOrganizations();
    const userApps = db.getApplications(currentUser.id);
    const saved = db.getSavedOpportunities(currentUser.id);
    const docs = db.getUserDocuments(currentUser.id);

    setOpportunities(opps);
    setOrganizations(orgs);
    setApplications(userApps);
    setSavedIds(saved.map((s) => s.opportunity_id));
    setUserDocs(docs);

    if (docs.length > 0) {
      const primary = docs.find((d) => d.is_primary_cv && d.document_type === 'cv');
      if (primary) {
        setSelectedCvDocId(primary.id);
      } else {
        const anyCv = docs.find((d) => d.document_type === 'cv');
        if (anyCv) setSelectedCvDocId(anyCv.id);
      }
    }

    if (orgs.length > 0 && !selectedOrgId) {
      setSelectedOrgId(orgs[0].id);
    }
  };

  const handleToggleSave = (oppId: string) => {
    db.toggleSaveOpportunity(currentUser.id, oppId);
    loadData();
  };

  const openApplyModal = (opp: Opportunity) => {
    setSelectedOppForApply(opp);
    setMotivation('');
    setApplyError('');
    setApplicantPhone(currentUser.phone || '');
    setRelevantSkills(currentUser.skills?.join(', ') || '');
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOppForApply) return;
    setApplyError('');

    const chosenCv = userDocs.find((d) => d.id === selectedCvDocId);

    try {
      db.submitApplication({
        opportunity_id: selectedOppForApply.id,
        user_id: currentUser.id,
        motivation_statement: motivation.trim() || 'I am motivated to contribute my technical and practical skills to this position.',
        relevant_skills: relevantSkills.split(',').map((s) => s.trim()).filter(Boolean),
        phone: applicantPhone,
        cv_filename: chosenCv ? chosenCv.file_name : 'Applicant_Profile.pdf',
        cv_url: chosenCv ? chosenCv.file_url : undefined,
      });

      setApplySuccess(true);
      loadData();
      setTimeout(() => {
        setApplySuccess(false);
        setSelectedOppForApply(null);
        setMotivation('');
      }, 1800);
    } catch (err: any) {
      setApplyError(err.message || 'Application could not be submitted');
    }
  };

  const openCreateModal = () => {
    setEditingOppId(null);
    setFormTitle('');
    setFormType('job');
    setFormDesc('');
    setFormRequirements('');
    setFormLocation('Wolaita Sodo Industrial Zone');
    setFormStipend('4500');
    setFormSpots('2');
    setFormDeadline('2026-12-31');
    setFormAccessible(true);
    setShowPostModal(true);
  };

  const openEditModal = (opp: Opportunity) => {
    setEditingOppId(opp.id);
    setSelectedOrgId(opp.organization_id);
    setFormTitle(opp.title);
    setFormType(opp.type);
    setFormDesc(opp.description);
    setFormRequirements(opp.requirements.join('\n'));
    setFormLocation(opp.location);
    setFormStipend(String(opp.stipend_amount || 0));
    setFormSpots(String(opp.spots_available));
    setFormDeadline(opp.deadline || '2026-12-31');
    setFormAccessible(opp.is_accessible);
    setShowPostModal(true);
  };

  const handleSaveOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingOppId) {
      db.updateOpportunity(editingOppId, {
        title: formTitle.trim(),
        type: formType,
        description: formDesc.trim(),
        requirements: formRequirements.split('\n').filter(Boolean),
        location: formLocation.trim(),
        stipend_amount: Number(formStipend) || 0,
        spots_available: Number(formSpots) || 1,
        deadline: formDeadline,
        is_accessible: formAccessible,
      });
    } else {
      db.createOpportunity({
        organization_id: selectedOrgId || organizations[0]?.id || 'org-damota',
        title: formTitle.trim(),
        type: formType,
        description: formDesc.trim(),
        requirements: formRequirements.split('\n').filter(Boolean),
        location: formLocation.trim(),
        stipend_amount: Number(formStipend) || 0,
        currency: 'ETB',
        spots_available: Number(formSpots) || 1,
        deadline: formDeadline,
        is_accessible: formAccessible,
        created_by: currentUser.id,
      });
    }

    setShowPostModal(false);
    setEditingOppId(null);
    loadData();
  };

  const handleToggleOpportunityStatus = (opp: Opportunity) => {
    const nextStatus = opp.status === 'open' ? 'paused' : 'open';
    db.updateOpportunity(opp.id, { status: nextStatus });
    loadData();
  };

  const handleDeleteOpportunity = (oppId: string) => {
    if (confirm('Are you sure you want to delete this opportunity listing?')) {
      db.deleteOpportunity(oppId);
      loadData();
    }
  };

  // Filter & Sort logic
  const filteredOpps = opportunities
    .filter((opp) => {
      const matchesSearch =
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'all' || opp.type === selectedType;
      const matchesLocation =
        selectedLocation === 'all' || opp.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesAccessibility = !onlyAccessible || opp.is_accessible;

      // Regular youth only see open listings unless they already applied
      if (currentUser.role === 'youth') {
        const isNotClosed = opp.status === 'open' || !opp.status;
        const hasApplied = applications.some((a) => a.opportunity_id === opp.id);
        if (!isNotClosed && !hasApplied) return false;
      }

      return matchesSearch && matchesType && matchesLocation && matchesAccessibility;
    })
    .sort((a, b) => {
      if (sortBy === 'stipend') {
        return (b.stipend_amount || 0) - (a.stipend_amount || 0);
      }
      if (sortBy === 'deadline') {
        return (a.deadline || '').localeCompare(b.deadline || '');
      }
      if (sortBy === 'spots') {
        return b.spots_available - a.spots_available;
      }
      return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
    });

  const canManageOpps = currentUser.role === 'employer' || currentUser.role === 'admin' || currentUser.role === 'provider';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Opportunity Pipeline</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Verified Opportunities in Wolaita Sodo</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Search active jobs, apprenticeships, TVET certificate programs, scholarships, and entrepreneurship initiatives backed by employer retention agreements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {canManageOpps && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Listing</span>
            </button>
          )}
          {currentUser.role === 'youth' && (
            <button
              onClick={() => onNavigate('/youth/applications')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Clock className="w-4 h-4" />
              <span>My Applications ({applications.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Search, Filter Bar & 7 Categories */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Search Input & Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, skills, keyword..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
            >
              <option value="all">All Locations (Sodo City & Industrial Zone)</option>
              <option value="Industrial Zone">Wolaita Sodo Industrial Zone</option>
              <option value="Town Center">Sodo Town Center / Market</option>
              <option value="Damota">Mount Damota / Peri-Urban</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
            >
              <option value="newest">Sort by: Newest Listings</option>
              <option value="stipend">Sort by: Highest Stipend</option>
              <option value="deadline">Sort by: Approaching Deadline</option>
              <option value="spots">Sort by: Most Spots Available</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyAccessible}
                onChange={(e) => setOnlyAccessible(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <span>Disability Accessible Only</span>
            </label>
          </div>
        </div>

        {/* 7 Required Opportunity Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1 border-t border-slate-100">
          {[
            { id: 'all', label: `All Categories (${opportunities.length})` },
            { id: 'job', label: 'Permanent / Contract Jobs' },
            { id: 'internship', label: 'Internships' },
            { id: 'apprenticeship', label: 'Vocational Apprenticeships' },
            { id: 'training', label: 'TVET & Technical Training' },
            { id: 'scholarship', label: 'Scholarships & Education' },
            { id: 'entrepreneurship', label: 'Entrepreneurship Programs' },
            { id: 'business_support', label: 'Business Development' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedType(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                selectedType === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Grid */}
      {filteredOpps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No matching opportunities found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria, category filters, or location filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOpps.map((opp) => {
            const org = db.getOrganizationById(opp.organization_id);
            const hasApplied = applications.some((a) => a.opportunity_id === opp.id);
            const isSaved = savedIds.includes(opp.id);
            const isClosed = opp.status === 'closed';
            const isPaused = opp.status === 'paused';

            return (
              <div
                key={opp.id}
                className={`bg-white rounded-2xl border ${
                  hasApplied
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : isPaused || isClosed
                    ? 'border-slate-200 opacity-80'
                    : 'border-slate-200 hover:border-teal-500/60'
                } p-5 shadow-xs transition-all flex flex-col justify-between`}
              >
                <div>
                  {/* Top Bar: Category, Status, Bookmark */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                        {opp.type.replace('_', ' ')}
                      </span>
                      {opp.is_accessible && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          Accessible
                        </span>
                      )}
                      {opp.status && opp.status !== 'open' && (
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {opp.status}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleSave(opp.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved
                          ? 'border-teal-300 text-teal-600 bg-teal-50'
                          : 'border-slate-200 text-slate-400 hover:text-slate-600 bg-white'
                      }`}
                      title={isSaved ? 'Saved' : 'Save for later'}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Title & Employer */}
                  <h3 className="text-sm font-bold text-slate-900 mt-2.5 line-clamp-1">{opp.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">{org?.name || 'Local Partner Enterprise'}</span>
                  </div>

                  {/* Location & Details */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {opp.location}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {opp.spots_available} spots
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Required skills */}
                  {opp.required_skills && opp.required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {opp.required_skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Bar */}
                <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Stipend / Comp</span>
                      <span className="font-bold text-slate-900 font-mono text-xs">
                        {opp.stipend_amount ? `${opp.stipend_amount.toLocaleString()} ${opp.currency}` : 'Unpaid Training'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">Deadline</span>
                      <span className="font-semibold text-slate-700 text-xs">
                        {opp.deadline ? opp.deadline.slice(0, 10) : 'Open Rolling'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewOpp(opp)}
                      className="flex-1 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
                    >
                      View Details
                    </button>

                    {hasApplied ? (
                      <button
                        onClick={() => onNavigate('/youth/applications')}
                        className="flex-1 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors text-center flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tracked</span>
                      </button>
                    ) : isClosed || isPaused ? (
                      <button
                        disabled
                        className="flex-1 py-2 text-xs font-bold text-slate-400 bg-slate-100 rounded-xl cursor-not-allowed text-center capitalize"
                      >
                        {opp.status}
                      </button>
                    ) : (
                      <button
                        onClick={() => openApplyModal(opp)}
                        className="flex-1 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors text-center"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>

                  {/* Admin / Employer management quick actions */}
                  {canManageOpps && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                      <button
                        onClick={() => openEditModal(opp)}
                        className="text-slate-600 hover:text-teal-700 font-semibold flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleToggleOpportunityStatus(opp)}
                        className="text-slate-600 hover:text-amber-700 font-semibold flex items-center gap-1"
                      >
                        {opp.status === 'open' ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                        <span>{opp.status === 'open' ? 'Pause' : 'Activate'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteOpportunity(opp.id)}
                        className="text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewOpp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-5 my-8">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                  {viewOpp.type.replace('_', ' ')}
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-1">{viewOpp.title}</h2>
                <p className="text-xs font-semibold text-teal-700">
                  {db.getOrganizationById(viewOpp.organization_id)?.name} · {viewOpp.location}
                </p>
              </div>
              <button
                onClick={() => setViewOpp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">Overview & Role</h4>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{viewOpp.description}</p>
              </div>

              {viewOpp.requirements && viewOpp.requirements.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
                    Key Requirements & Qualifications
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {viewOpp.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Stipend</span>
                  <span className="font-bold text-slate-900">
                    {viewOpp.stipend_amount ? `${viewOpp.stipend_amount} ETB` : 'Unpaid'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Available Spots</span>
                  <span className="font-bold text-slate-900">{viewOpp.spots_available} Placements</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Application Deadline</span>
                  <span className="font-bold text-slate-900">{viewOpp.deadline || 'Rolling'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Accessibility</span>
                  <span className="font-bold text-slate-900">{viewOpp.is_accessible ? 'Supported' : 'Standard'}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setViewOpp(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              {applications.some((a) => a.opportunity_id === viewOpp.id) ? (
                <button
                  onClick={() => {
                    setViewOpp(null);
                    onNavigate('/youth/applications');
                  }}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500"
                >
                  Track Application
                </button>
              ) : (
                <button
                  onClick={() => {
                    const target = viewOpp;
                    setViewOpp(null);
                    openApplyModal(target);
                  }}
                  className="px-5 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-500"
                >
                  Apply for this Role
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT APPLICATION MODAL */}
      {selectedOppForApply && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Submit Opportunity Application</h2>
                <p className="text-xs text-slate-500">{selectedOppForApply.title}</p>
              </div>
              <button
                onClick={() => setSelectedOppForApply(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {applySuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-emerald-900">Application Submitted Successfully!</h3>
                <p className="text-xs text-emerald-700">
                  Your application and attached CV are now with the employer. You can track its status in your dashboard.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                {applyError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-medium">
                    {applyError}
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone Number (telebirr)</label>
                  <input
                    type="tel"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    required
                    placeholder="+251 9X XXX XXXX"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select CV / Document from Profile</label>
                  {userDocs.filter((d) => d.document_type === 'cv').length > 0 ? (
                    <select
                      value={selectedCvDocId}
                      onChange={(e) => setSelectedCvDocId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                    >
                      {userDocs
                        .filter((d) => d.document_type === 'cv')
                        .map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.title} ({doc.file_name})
                          </option>
                        ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                      <span className="text-amber-800 text-[11px]">No CV uploaded yet. Default profile info will be sent.</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOppForApply(null);
                          onNavigate('/youth/profile');
                        }}
                        className="text-teal-700 font-bold underline text-[11px]"
                      >
                        Upload CV
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Key Relevant Skills</label>
                  <input
                    type="text"
                    value={relevantSkills}
                    onChange={(e) => setRelevantSkills(e.target.value)}
                    placeholder="e.g. Electrical wiring, Equipment calibration, Customer service"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Motivation Statement / Note to Employer</label>
                  <textarea
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    rows={3}
                    placeholder="Briefly explain why you are interested in this position and how your TVET training or skills fit this role..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedOppForApply(null)}
                    className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Application</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CREATE / EDIT OPPORTUNITY MODAL (Employer & Admin) */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {editingOppId ? 'Edit Opportunity Listing' : 'Publish New Opportunity'}
                </h2>
                <p className="text-xs text-slate-500">
                  Create verified roles with clear skill requirements and stipend details.
                </p>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOpportunity} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Partner Organization</label>
                  <select
                    value={selectedOrgId}
                    onChange={(e) => setSelectedOrgId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                  >
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Opportunity Category</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                  >
                    <option value="job">Permanent / Contract Job</option>
                    <option value="internship">Internship</option>
                    <option value="apprenticeship">Vocational Apprenticeship</option>
                    <option value="training">TVET & Technical Training</option>
                    <option value="scholarship">Scholarship & Education</option>
                    <option value="entrepreneurship">Entrepreneurship Program</option>
                    <option value="business_support">Business Development Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Position Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  placeholder="e.g. Quality Control Apprentice or Solar Inverter Technician"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description & Role Responsibilities</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={3}
                  required
                  placeholder="Describe daily responsibilities, equipment handled, and learning outcomes..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Requirements (one per line)</label>
                <textarea
                  value={formRequirements}
                  onChange={(e) => setFormRequirements(e.target.value)}
                  rows={2}
                  placeholder="TVET Certificate Level 2&#10;Basic machine calibration&#10;Reside in Wolaita Sodo"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Stipend (ETB)</label>
                  <input
                    type="number"
                    value={formStipend}
                    onChange={(e) => setFormStipend(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Placements / Spots</label>
                  <input
                    type="number"
                    value={formSpots}
                    onChange={(e) => setFormSpots(e.target.value)}
                    min="1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formAccessible}
                    onChange={(e) => setFormAccessible(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <span>Disability Accommodating Workplace</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold shadow-xs transition-colors"
                  >
                    {editingOppId ? 'Save Changes' : 'Publish Opportunity'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
