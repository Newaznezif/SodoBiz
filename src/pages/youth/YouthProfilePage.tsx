import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { User, Phone, Mail, Award, BookOpen, MapPin, Check, Plus, X, ArrowLeft } from 'lucide-react';

export const YouthProfilePage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser, refreshData } = useAuth();

  const [fullName, setFullName] = useState(currentUser.full_name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [educationLevel, setEducationLevel] = useState(currentUser.education_level || 'TVET Certificate Level 2');
  const [fieldOfStudy, setFieldOfStudy] = useState(currentUser.field_of_study || 'ICT & Electrical Installation');
  const [tvetStatus, setTvetStatus] = useState<any>(currentUser.tvet_status || 'enrolled');
  const [kebele, setKebele] = useState(currentUser.kebele || 'Kebele 02, Sodo');
  const [careerGoals, setCareerGoals] = useState(currentUser.career_goals || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [hasDisability, setHasDisability] = useState(currentUser.has_disability || false);
  const [skills, setSkills] = useState<string[]>(currentUser.skills || ['Computer Literacy', 'Customer Care']);
  const [newSkill, setNewSkill] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateUser(currentUser.id, {
      full_name: fullName,
      phone,
      email,
      education_level: educationLevel,
      field_of_study: fieldOfStudy,
      tvet_status: tvetStatus,
      kebele,
      careerGoals: careerGoals,
      career_goals: careerGoals,
      bio,
      has_disability: hasDisability,
      skills,
    });
    refreshData();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('/youth/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Youth Overview</span>
        </button>
        <span className="text-xs text-slate-500">ID: {currentUser.id}</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h1 className="text-lg font-bold text-slate-900">Youth Profile & Skills Profile</h1>
          <p className="text-xs text-slate-500 mt-1">
            Keep your credentials, TVET cohort status, and vocational skills updated for local Sodo employers.
          </p>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Profile details saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                placeholder="e.g. Kebele 02, Sodo"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Education Level</label>
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
                <option value="Non-Formal Vocational Training">Non-Formal Vocational Training</option>
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
                placeholder="e.g. Agro-processing, Electrical"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Skills Management */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Skills & Competencies</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs border border-slate-200"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
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
                placeholder="Add a skill (e.g. Solar Installation, Cashier, Barista, Sewing)..."
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Goals & Inclusion */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Career Goal & Aspirations</label>
              <textarea
                value={careerGoals}
                onChange={(e) => setCareerGoals(e.target.value)}
                rows={2}
                placeholder="What type of apprenticeship, job, or micro-business do you want to establish in Sodo?"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bio / Background Summary</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                placeholder="Brief summary of your background, TVET cohort experience, or local community activities."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="disabilityCheck"
                checked={hasDisability}
                onChange={(e) => setHasDisability(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <label htmlFor="disabilityCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
                I identify as a person with a disability or require accessible accommodations during interviews / work.
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/youth/dashboard')}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
