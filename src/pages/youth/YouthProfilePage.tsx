import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { WorkExperience, UserDocument } from '../../types';
import {
  User,
  Phone,
  Mail,
  Award,
  BookOpen,
  MapPin,
  Check,
  Plus,
  X,
  ArrowLeft,
  Briefcase,
  FileText,
  UploadCloud,
  Trash2,
  Calendar,
  Building2,
  Download,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const YouthProfilePage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser, refreshData } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'experience' | 'skills' | 'documents'>('profile');

  // Basic Info
  const [fullName, setFullName] = useState(currentUser.full_name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [kebele, setKebele] = useState(currentUser.kebele || 'Kebele 02, Sodo');
  const [gender, setGender] = useState(currentUser.gender || 'male');
  const [bio, setBio] = useState(currentUser.bio || '');

  // Education & TVET
  const [educationLevel, setEducationLevel] = useState(currentUser.education_level || 'TVET Certificate Level 2');
  const [fieldOfStudy, setFieldOfStudy] = useState(currentUser.field_of_study || 'ICT & Electrical Installation');
  const [tvetStatus, setTvetStatus] = useState<any>(currentUser.tvet_status || 'enrolled');

  // Work Experience
  const [experiences, setExperiences] = useState<WorkExperience[]>(currentUser.work_experience || []);
  const [newExpCompany, setNewExpCompany] = useState('');
  const [newExpRole, setNewExpRole] = useState('');
  const [newExpDuration, setNewExpDuration] = useState('');
  const [newExpDesc, setNewExpDesc] = useState('');
  const [isAddingExp, setIsAddingExp] = useState(false);

  // Skills & Interests
  const [skills, setSkills] = useState<string[]>(currentUser.skills || ['Computer Literacy', 'Customer Care']);
  const [newSkill, setNewSkill] = useState('');
  const [careerInterests, setCareerInterests] = useState<string[]>(
    currentUser.career_interests || ['Agro-processing', 'ICT Systems', 'Solar Tech']
  );
  const [newInterest, setNewInterest] = useState('');
  const [careerGoals, setCareerGoals] = useState(currentUser.career_goals || '');
  const [hasDisability, setHasDisability] = useState(currentUser.has_disability || false);

  // Documents
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [uploadDocTitle, setUploadDocTitle] = useState('');
  const [uploadDocType, setUploadDocType] = useState<UserDocument['document_type']>('cv');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileSize, setSelectedFileSize] = useState('');
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadDocuments();
  }, [currentUser.id]);

  const loadDocuments = () => {
    const docs = db.getUserDocuments(currentUser.id);
    setDocuments(docs);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !careerInterests.includes(newInterest.trim())) {
      setCareerInterests([...careerInterests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (item: string) => {
    setCareerInterests(careerInterests.filter((i) => i !== item));
  };

  const handleAddExperience = () => {
    if (!newExpCompany.trim() || !newExpRole.trim()) {
      setErrorMessage('Company and Role are required.');
      return;
    }
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: newExpCompany.trim(),
      role: newExpRole.trim(),
      duration: newExpDuration.trim() || '2025 - Present',
      description: newExpDesc.trim(),
    };
    const updated = [newExp, ...experiences];
    setExperiences(updated);
    setNewExpCompany('');
    setNewExpRole('');
    setNewExpDuration('');
    setNewExpDesc('');
    setIsAddingExp(false);
  };

  const handleRemoveExperience = (id: string) => {
    setExperiences(experiences.filter((e) => e.id !== id));
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      setSelectedFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      if (!uploadDocTitle) {
        setUploadDocTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadDocTitle.trim() || !selectedFileName) {
      setErrorMessage('Please provide a document title and select a file.');
      return;
    }

    db.addUserDocument(currentUser.id, {
      title: uploadDocTitle.trim(),
      document_type: uploadDocType,
      file_name: selectedFileName,
      file_url: `/uploads/${currentUser.id}/${selectedFileName}`,
      file_size: selectedFileSize || '1.2 MB',
      is_primary_cv: uploadDocType === 'cv' && !documents.some((d) => d.is_primary_cv),
    });

    loadDocuments();
    setUploadDocTitle('');
    setSelectedFileName('');
    setSelectedFileSize('');
    setIsUploadingDoc(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDeleteDocument = (docId: string) => {
    db.deleteUserDocument(docId);
    loadDocuments();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateUser(currentUser.id, {
      full_name: fullName,
      phone,
      email,
      gender,
      kebele,
      education_level: educationLevel,
      field_of_study: fieldOfStudy,
      tvet_status: tvetStatus,
      career_goals: careerGoals,
      bio,
      has_disability: hasDisability,
      skills,
      career_interests: careerInterests,
      work_experience: experiences,
    });
    refreshData();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('/youth/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Youth Overview</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">Account ID: {currentUser.id}</span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 uppercase">
            Youth Profile
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile changes and attachments saved successfully!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="text-rose-600 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Profile Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto text-xs font-bold bg-slate-50/70">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-3.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'profile'
                ? 'border-teal-600 text-teal-800 bg-white font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Personal & Education</span>
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`px-5 py-3.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'experience'
                ? 'border-teal-600 text-teal-800 bg-white font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Work Experience ({experiences.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-5 py-3.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'skills'
                ? 'border-teal-600 text-teal-800 bg-white font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Skills & Interests ({skills.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-5 py-3.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'documents'
                ? 'border-teal-600 text-teal-800 bg-white font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Documents & CV ({documents.length})</span>
          </button>
        </div>

        <div className="p-6">
          {/* TAB 1: PERSONAL & EDUCATION */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Personal & Contact Information</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your legal identity and contact details for prospective employers and partner institutions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (telebirr)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 9X XXX XXXX"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Residence Kebele / Woreda</label>
                  <input
                    type="text"
                    value={kebele}
                    onChange={(e) => setKebele(e.target.value)}
                    placeholder="e.g. Kebele 02, Wolaita Sodo"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Education & TVET */}
              <div className="pt-6 border-t border-slate-200">
                <h2 className="text-base font-bold text-slate-900">Education & TVET Certification</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Academic qualifications, TVET polytechnic records, and technical trades.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Highest Education Level</label>
                    <select
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                    >
                      <option value="Primary School (Grade 8)">Primary School (Grade 8)</option>
                      <option value="High School (Grade 10/12)">High School (Grade 10/12)</option>
                      <option value="TVET Certificate Level 1">TVET Certificate Level 1</option>
                      <option value="TVET Certificate Level 2">TVET Certificate Level 2</option>
                      <option value="TVET Certificate Level 3/4">TVET Certificate Level 3/4</option>
                      <option value="Diploma / Associate Degree">Diploma / Associate Degree</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                      <option value="Vocational Apprenticeship Graduate">Vocational Apprenticeship Graduate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">TVET Cohort Status</label>
                    <select
                      value={tvetStatus}
                      onChange={(e) => setTvetStatus(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                    >
                      <option value="enrolled">Enrolled in Active Cohort</option>
                      <option value="graduated">Graduated / Certified</option>
                      <option value="interested">Interested in Upcoming Cohort</option>
                      <option value="not_interested">Not Interested in TVET</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Field of Study / Trade</label>
                    <input
                      type="text"
                      value={fieldOfStudy}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                      placeholder="e.g. Agro-processing, Solar Tech, Garment"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bio & Inclusion */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Bio / Summary</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="Describe your background, motivation, vocational training, and long-term career aspirations..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <input
                    type="checkbox"
                    id="disabilityCheck"
                    checked={hasDisability}
                    onChange={(e) => setHasDisability(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="disabilityCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
                    I identify as a person with a disability or require accessible workplace/interview accommodations.
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  Save Profile Details
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: WORK EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Work Experience & Practical Roles</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add formal jobs, apprenticeships, family business work, or volunteer roles.
                  </p>
                </div>
                {!isAddingExp && (
                  <button
                    onClick={() => setIsAddingExp(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Experience</span>
                  </button>
                )}
              </div>

              {isAddingExp && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Add Experience Record</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Enterprise</label>
                      <input
                        type="text"
                        value={newExpCompany}
                        onChange={(e) => setNewExpCompany(e.target.value)}
                        placeholder="e.g. Damota Agro-processing"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Job Role / Title</label>
                      <input
                        type="text"
                        value={newExpRole}
                        onChange={(e) => setNewExpRole(e.target.value)}
                        placeholder="e.g. Production Line Trainee"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Duration / Period</label>
                      <input
                        type="text"
                        value={newExpDuration}
                        onChange={(e) => setNewExpDuration(e.target.value)}
                        placeholder="e.g. Jun 2024 - Dec 2024"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Key Tasks</label>
                    <textarea
                      value={newExpDesc}
                      onChange={(e) => setNewExpDesc(e.target.value)}
                      rows={2}
                      placeholder="Handled grain weighing, moisture calibration, packaging and inventory logging."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsAddingExp(false)}
                      className="px-3 py-1.5 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddExperience}
                      className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg"
                    >
                      Save Role
                    </button>
                  </div>
                </div>
              )}

              {experiences.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                  <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No work experiences added yet.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Highlight practical internships, apprenticeships, or community tasks to make your profile stand out.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{exp.role}</h4>
                          <span className="text-xs text-slate-400">at</span>
                          <span className="text-xs font-semibold text-teal-700">{exp.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{exp.duration}</span>
                        </div>
                        {exp.description && (
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors self-start"
                        title="Remove role"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Update Profile Experience
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS & INTERESTS */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Skills, Competencies & Career Interests</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Highlight verified skills for job matching algorithms and indicate the industries you wish to enter.
                </p>
              </div>

              {/* Skills section */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Technical & Vocational Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-teal-600 hover:text-rose-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 max-w-md">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="e.g. Solar Inverter Setup, Bookkeeping, Tailoring..."
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Career Interests section */}
              <div className="pt-6 border-t border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Target Career Sectors & Interests
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {careerInterests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-800 text-xs font-semibold border border-indigo-200"
                    >
                      <span>{interest}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(interest)}
                        className="text-indigo-600 hover:text-rose-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 max-w-md">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInterest();
                      }
                    }}
                    placeholder="e.g. Agri-tech, Micro-Enterprise, Automotive..."
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Career Goals */}
              <div className="pt-6 border-t border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Career Goals & Next Steps
                </label>
                <textarea
                  value={careerGoals}
                  onChange={(e) => setCareerGoals(e.target.value)}
                  rows={2}
                  placeholder="Outline your goal for the next 12 months (e.g. Secure full-time technician contract with Damota Agro or launch honey processing cooperative)."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  Save Skills & Interests
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENTS & CV */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Document Repository & CV Attachments</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload your Curriculum Vitae (CV), Kebele ID, TVET credentials, and recommendation letters.
                  </p>
                </div>
                {!isUploadingDoc && (
                  <button
                    onClick={() => setIsUploadingDoc(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload New Document</span>
                  </button>
                )}
              </div>

              {isUploadingDoc && (
                <form onSubmit={handleUploadDocument} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Attach Document</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Document Label / Title</label>
                      <input
                        type="text"
                        value={uploadDocTitle}
                        onChange={(e) => setUploadDocTitle(e.target.value)}
                        placeholder="e.g. Updated CV 2026 or Level 2 TVET Certificate"
                        required
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Document Category</label>
                      <select
                        value={uploadDocType}
                        onChange={(e) => setUploadDocType(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                      >
                        <option value="cv">Curriculum Vitae (CV / Resume)</option>
                        <option value="certificate">Training / TVET Certificate</option>
                        <option value="id_card">National / Kebele ID Card</option>
                        <option value="trade_license">Trade License / Business Reg</option>
                        <option value="recommendation_letter">Letter of Recommendation</option>
                        <option value="other">Other Supporting Record</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Select File (PDF, DOCX, PNG, JPG)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        onChange={handleFileSelection}
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                      />
                      {selectedFileName && (
                        <span className="text-xs text-slate-500 font-mono">
                          {selectedFileName} ({selectedFileSize})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsUploadingDoc(false)}
                      className="px-3 py-1.5 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg shadow-xs"
                    >
                      Upload & Save
                    </button>
                  </div>
                </form>
              )}

              {documents.length === 0 ? (
                <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-xl">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No documents uploaded yet.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Upload your CV so employers can review your full qualifications during application screening.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {documents.map((doc) => (
                    <div key={doc.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{doc.title}</span>
                            {doc.is_primary_cv && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                Default CV
                              </span>
                            )}
                            <span className="text-[10px] uppercase font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {doc.document_type.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                            <span>{doc.file_name}</span>
                            <span>·</span>
                            <span>{doc.file_size || '1.2 MB'}</span>
                            <span>·</span>
                            <span>Uploaded {doc.created_at.slice(0, 10)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
