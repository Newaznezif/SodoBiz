import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db, INITIAL_CATEGORIES } from '../../lib/db';
import { UserRoleType } from '../../types';
import { Language } from '../../lib/translations';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building,
  User,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  DollarSign,
  MapPin,
  Store,
  Sparkles,
} from 'lucide-react';

export const RegisterPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { register, setLanguage } = useAuth();
  const [step, setStep] = useState(1);

  // Core User Fields
  const [selectedRole, setSelectedRole] = useState<UserRoleType>('youth');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<Language>('en');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Role-Specific: Youth
  const [educationLevel, setEducationLevel] = useState('TVET Certificate Level 2');
  const [fieldOfStudy, setFieldOfStudy] = useState('ICT & Electrical Installation');
  const [youthSkills, setYouthSkills] = useState('Computer Literacy, Customer Care');
  const [youthKebele, setYouthKebele] = useState('Kebele 02, Sodo');
  const [careerGoals, setCareerGoals] = useState('Seeking apprenticeship and practical skill placement.');
  const [hasDisability, setHasDisability] = useState(false);

  // Role-Specific: Employer
  const [orgName, setOrgName] = useState('');
  const [orgIndustry, setOrgIndustry] = useState('Manufacturing & Agro-Processing');
  const [orgLocation, setOrgLocation] = useState('Wolaita Sodo Industrial Zone');

  // Role-Specific: Mentor
  const [mentorExpertise, setMentorExpertise] = useState('Agribusiness, Loan Readiness, Micro-Enterprise');
  const [mentorOrg, setMentorOrg] = useState('Southern Advisory Services');
  const [mentorYears, setMentorYears] = useState('6');

  // Role-Specific: Provider
  const [providerName, setProviderName] = useState('');
  const [providerType, setProviderType] = useState('microfinance');

  // Role-Specific: Entrepreneur
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<'retail' | 'agriculture' | 'crafts' | 'food_services' | 'services'>('retail');
  const [businessLocation, setBusinessLocation] = useState('Merkato Quarter, Wolaita Sodo');
  const [workerCount, setWorkerCount] = useState(2);

  const [errorMessage, setErrorMessage] = useState('');

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill in your name, email, and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the platform terms of service and privacy policy.');
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  const handleCompleteRegistration = () => {
    setErrorMessage('');

    try {
      const extraProfile: any = {};

      if (selectedRole === 'youth') {
        extraProfile.education_level = educationLevel;
        extraProfile.field_of_study = fieldOfStudy;
        extraProfile.skills = youthSkills.split(',').map((s) => s.trim()).filter(Boolean);
        extraProfile.career_goals = careerGoals;
        extraProfile.careerGoals = careerGoals;
        extraProfile.kebele = youthKebele;
        extraProfile.has_disability = hasDisability;
        extraProfile.tvet_status = 'enrolled';
      }

      const newUser = register(fullName, email, phone, preferredLanguage, selectedRole, extraProfile);
      setLanguage(preferredLanguage);

      // Handle role-specific entity creation
      if (selectedRole === 'employer' && orgName.trim()) {
        const org = db.createOrganization({
          name: orgName.trim(),
          slug: orgName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          type: 'employer',
          industry: orgIndustry,
          description: `Verified employer partner operating in ${orgLocation}`,
          location: orgLocation,
          phone: phone || '+251 46 551 0000',
          email,
          verification_status: 'verified',
          contact_person: fullName,
        });
        db.updateUser(newUser.id, { organization_id: org.id });
        onNavigate('/employer/dashboard');
        return;
      }

      if (selectedRole === 'provider' && providerName.trim()) {
        const prov = db.createProvider({
          organization_name: providerName.trim(),
          slug: providerName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          organization_type: providerType,
          description: `Financial inclusion institution in Wolaita Sodo`,
          location: 'Wolaita Sodo Financial District',
          official_phone: phone || '+251 46 551 2280',
          verification_status: 'verified',
          last_verified_at: new Date().toISOString(),
        });
        db.updateUser(newUser.id, { organization_id: prov.id });
        onNavigate('/provider/dashboard');
        return;
      }

      if (selectedRole === 'mentor') {
        db.updateMentorProfile(newUser.id, {
          job_title: 'Advisory Mentor',
          organization: mentorOrg,
          expertise_areas: mentorExpertise.split(',').map((s) => s.trim()).filter(Boolean),
          years_experience: Number(mentorYears) || 5,
          bio: `Experienced advisor in ${mentorExpertise}. Helping Sodo youth succeed.`,
          is_accepting_mentees: true,
        });
        onNavigate('/mentor/dashboard');
        return;
      }

      if (selectedRole === 'entrepreneur' && businessName.trim()) {
        db.createBusiness({
          owner_id: newUser.id,
          name: businessName.trim(),
          description: `${businessType} micro-enterprise in ${businessLocation}`,
          category_id: INITIAL_CATEGORIES[0].id,
          business_type: businessType,
          location: businessLocation,
          operating_since: '2024',
          worker_count: Number(workerCount) || 1,
          status: 'active',
        });
        onNavigate('/dashboard');
        return;
      }

      // Default routing based on role
      if (selectedRole === 'youth') {
        onNavigate('/youth/dashboard');
      } else {
        onNavigate('/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check inputs.');
    }
  };

  return (
    <div className="bg-slate-50 py-12 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white max-w-xl w-full rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header & Step Tracker */}
        <div className="space-y-2 border-b border-slate-200 pb-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-teal-700 uppercase tracking-wider">
              Create SodoBiz Account
            </span>
            <span className="font-mono">Step {step} of 2</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {step === 1 ? 'Select Role & Basic Information' : `Complete Onboarding (${selectedRole.toUpperCase()})`}
          </h1>
          <p className="text-xs text-slate-500">
            {step === 1
              ? 'Join SodoBiz Bridge to discover opportunities, track micro-enterprise records, or link local talent.'
              : 'Add your profile qualifications and details to customize your platform experience.'}
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 text-rose-800 text-xs border border-rose-200">
            {errorMessage}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleStep1Next} className="space-y-5">
            {/* Role Selector Cards */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">I am joining as a:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'youth' as UserRoleType, label: 'Youth / Job Seeker', desc: 'Find jobs, TVET apprenticeships, mentorship', icon: GraduationCap },
                  { id: 'employer' as UserRoleType, label: 'Employer / Business', desc: 'Post opportunities, review candidates', icon: Briefcase },
                  { id: 'provider' as UserRoleType, label: 'Financial Institution', desc: 'Publish loan products, review referrals', icon: DollarSign },
                  { id: 'mentor' as UserRoleType, label: 'Mentor / Advisor', desc: 'Guide youth and fledgling entrepreneurs', icon: User },
                  { id: 'entrepreneur' as UserRoleType, label: 'Micro-Entrepreneur', desc: 'Sales ledger, inventory, loan readiness', icon: Store },
                  { id: 'admin' as UserRoleType, label: 'Administrator', desc: 'Platform governance, audits, commitments', icon: ShieldCheck },
                ].map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/60 ring-1 ring-teal-600'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-700' : 'text-slate-500'}`} />
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{r.label}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{r.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Basic Info Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Martha Haile"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.et"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number (telebirr)</label>
                <input
                  type="tel"
                  placeholder="+251 9X XXX XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Preferred Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as Language)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-teal-500"
                >
                  <option value="en">English (EN)</option>
                  <option value="am">Amharic (አማርኛ)</option>
                  <option value="wo">Wolaita (Wolayttatto)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="terms" className="text-xs text-slate-600">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('/terms')}
                  className="text-teal-700 underline font-medium"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('/privacy')}
                  className="text-teal-700 underline font-medium"
                >
                  Privacy Policy
                </button>
                .
              </label>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="text-xs text-slate-600 hover:text-slate-900"
              >
                Already have an account? Sign in
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: Role-Specific Onboarding */
          <div className="space-y-5">
            {selectedRole === 'youth' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Education Level</label>
                    <select
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Primary School (Grade 8)">Primary School (Grade 8)</option>
                      <option value="High School (Grade 10/12)">High School (Grade 10/12)</option>
                      <option value="TVET Certificate Level 1">TVET Certificate Level 1</option>
                      <option value="TVET Certificate Level 2">TVET Certificate Level 2</option>
                      <option value="TVET Certificate Level 3/4">TVET Certificate Level 3/4</option>
                      <option value="Diploma / Associate Degree">Diploma / Associate Degree</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Field of Study / Trade</label>
                    <input
                      type="text"
                      value={fieldOfStudy}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                      placeholder="e.g. Electrical, ICT, Food Tech, Mechanics"
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Skills & Competencies</label>
                    <input
                      type="text"
                      value={youthSkills}
                      onChange={(e) => setYouthSkills(e.target.value)}
                      placeholder="Comma-separated (e.g. Soldering, Telebirr, Driving)"
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Kebele of Residence</label>
                    <input
                      type="text"
                      value={youthKebele}
                      onChange={(e) => setYouthKebele(e.target.value)}
                      placeholder="e.g. Kebele 02, Sodo"
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Primary Career Goal</label>
                  <textarea
                    rows={2}
                    value={careerGoals}
                    onChange={(e) => setCareerGoals(e.target.value)}
                    placeholder="What kind of opportunity or enterprise are you aiming for?"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="hasDisability"
                    checked={hasDisability}
                    onChange={(e) => setHasDisability(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor="hasDisability" className="text-xs text-slate-700">
                    I identify as a person with a disability or require accessible accommodations
                  </label>
                </div>
              </div>
            )}

            {selectedRole === 'employer' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Organization / Business Name</label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Damota Agro-Processing Enterprises"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Industry Sector</label>
                    <input
                      type="text"
                      value={orgIndustry}
                      onChange={(e) => setOrgIndustry(e.target.value)}
                      placeholder="e.g. Agro-Processing, Manufacturing, Retail"
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Operating Location</label>
                    <input
                      type="text"
                      value={orgLocation}
                      onChange={(e) => setOrgLocation(e.target.value)}
                      placeholder="e.g. Sodo Industrial Zone"
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedRole === 'provider' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Institution Name</label>
                  <input
                    type="text"
                    required
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                    placeholder="e.g. Omo Bank Wolaita Sodo Branch"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Institution Type</label>
                  <select
                    value={providerType}
                    onChange={(e) => setProviderType(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="bank">Commercial Bank</option>
                    <option value="microfinance">Microfinance Institution (MFI)</option>
                    <option value="cooperative">Savings & Credit Cooperative (SACCO)</option>
                    <option value="government_office">Government MSE / Revolving Desk</option>
                  </select>
                </div>
              </div>
            )}

            {selectedRole === 'mentor' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Organization / Firm</label>
                  <input
                    type="text"
                    value={mentorOrg}
                    onChange={(e) => setMentorOrg(e.target.value)}
                    placeholder="e.g. Southern Agribusiness Consultants"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Areas of Advisory Expertise</label>
                    <input
                      type="text"
                      value={mentorExpertise}
                      onChange={(e) => setMentorExpertise(e.target.value)}
                      placeholder="e.g. Trade Licensing, Bookkeeping, Machinery"
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Years of Practical Experience</label>
                    <input
                      type="number"
                      value={mentorYears}
                      onChange={(e) => setMentorYears(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedRole === 'entrepreneur' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Business Name</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Asegedech Grain Milling & Retail"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Business Type</label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="retail">Retail Trade & Goods</option>
                      <option value="agriculture">Agriculture & Grain Processing</option>
                      <option value="crafts">Artisan Crafts & Weaving</option>
                      <option value="food_services">Food & Beverage Services</option>
                      <option value="services">Technical Trade & Repairs</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Location / Market Area</label>
                    <input
                      type="text"
                      value={businessLocation}
                      onChange={(e) => setBusinessLocation(e.target.value)}
                      placeholder="e.g. Merkato Quarter, Sodo"
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedRole === 'admin' && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                You are creating a platform governance account with permission to audit records, approve partners, and monitor commitments across Wolaita Sodo.
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleCompleteRegistration}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                <span>Complete Registration</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
