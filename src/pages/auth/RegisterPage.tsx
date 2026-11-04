import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db, INITIAL_CATEGORIES } from '../../lib/db';
import { Language } from '../../lib/translations';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building,
  User,
  ShieldCheck,
  Briefcase,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export const RegisterPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { register, setLanguage } = useAuth();
  const [step, setStep] = useState(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<Language>('en');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Business fields
  const [businessName, setBusinessName] = useState('');
  const [businessDesc, setBusinessDesc] = useState('');
  const [categoryId, setCategoryId] = useState(INITIAL_CATEGORIES[0].id);
  const [businessType, setBusinessType] = useState<'retail' | 'agriculture' | 'crafts' | 'food_services' | 'services'>('retail');
  const [location, setLocation] = useState('Merkato Quarter, Wolaita Sodo');
  const [operatingSince, setOperatingSince] = useState('2023');
  const [workerCount, setWorkerCount] = useState(2);
  const [recordMethod, setRecordMethod] = useState('Physical paper exercise book');
  const [growthGoal, setGrowthGoal] = useState('Secure working capital for seasonal bulk restock');

  const [errorMessage, setErrorMessage] = useState('');

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all required personal fields.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('You must accept the terms of service and privacy policy.');
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  const handleCompleteRegistration = () => {
    if (!businessName.trim()) {
      setErrorMessage('Please provide your business name.');
      return;
    }

    try {
      // 1. Create User
      const newUser = register(fullName, email, phone, preferredLanguage);
      setLanguage(preferredLanguage);

      // 2. Create Business
      db.createBusiness({
        owner_id: newUser.id,
        name: businessName,
        description: businessDesc || `${businessType} micro-enterprise in ${location}`,
        category_id: categoryId,
        business_type: businessType,
        location,
        operating_since: operatingSince,
        worker_count: Number(workerCount),
        status: 'active',
      });

      onNavigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed');
    }
  };

  return (
    <div className="bg-slate-50 py-12 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white max-w-xl w-full rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header & Step Tracker */}
        <div className="space-y-2 border-b border-slate-200 pb-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-teal-700 uppercase tracking-wider">
              Entrepreneur Onboarding
            </span>
            <span className="font-mono">Step {step} of 6</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {step === 1 && 'Personal Account Information'}
            {step === 2 && 'Business Details'}
            {step === 3 && 'Category & Operating Type'}
            {step === 4 && 'Location & Operating Status'}
            {step === 5 && 'Current Record-Keeping Practices'}
            {step === 6 && 'Business Growth Target & Review'}
          </h1>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-teal-600 h-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 text-rose-800 text-xs border border-rose-200">
            {errorMessage}
          </div>
        )}

        {/* Step 1: Personal Profile */}
        {step === 1 && (
          <form onSubmit={handleStep1Next} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Almaz Tekle Haile"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. almaz@sodobiz.et"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="+251 91 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Preferred Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as Language)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 bg-white"
                >
                  <option value="en">English (Default)</option>
                  <option value="am">አማርኛ (Amharic)</option>
                  <option value="wo">Wolayttatto (Wolaita)</option>
                </select>
              </div>
            </div>

            <label className="flex items-start gap-2 pt-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-teal-600"
              />
              <span>
                I agree to the <button type="button" onClick={() => onNavigate('/terms')} className="text-teal-700 underline">Terms of Service</button> and <button type="button" onClick={() => onNavigate('/privacy')} className="text-teal-700 underline">Privacy Policy</button>.
              </span>
            </label>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shadow-sm"
            >
              <span>Continue to Business Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: Business Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Business Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Asegedech Spice & Grain Mill"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Brief Business Description</label>
              <textarea
                rows={3}
                placeholder="Describe what products or services you provide to your customers..."
                value={businessDesc}
                onChange={(e) => setBusinessDesc(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!businessName.trim()) {
                    setErrorMessage('Please enter your business name.');
                    return;
                  }
                  setErrorMessage('');
                  setStep(3);
                }}
                className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Type and Category */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Industry Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 bg-white"
              >
                {INITIAL_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Operating Type</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 bg-white capitalize"
              >
                <option value="retail">Retail Shop / Grocery</option>
                <option value="agriculture">Agriculture & Agro-Processing (Milling/Spices)</option>
                <option value="crafts">Traditional Crafts & Handweaving</option>
                <option value="food_services">Food & Beverage (Coffee / Snacks / Eatery)</option>
                <option value="services">Personal / Technical Services</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Location & Operating Status */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Specific Location / Kebele in Wolaita Sodo</label>
              <input
                type="text"
                placeholder="e.g. Near Merkato Market, Kebele 02, Wolaita Sodo"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Operating Since (Year)</label>
                <input
                  type="text"
                  placeholder="2022"
                  value={operatingSince}
                  onChange={(e) => setOperatingSince(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Number of Workers</label>
                <input
                  type="number"
                  min={1}
                  value={workerCount}
                  onChange={(e) => setWorkerCount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Current Record-Keeping Practices */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                How do you currently keep track of your daily sales?
              </label>
              {[
                'Physical handwritten exercise book',
                'Memory and daily cash-drawer count',
                'Mobile SMS and telebirr transaction history',
                'No formal records kept currently',
              ].map((method) => (
                <label
                  key={method}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                    recordMethod === method
                      ? 'bg-teal-50/60 border-teal-500 font-medium text-slate-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="recordMethod"
                    checked={recordMethod === method}
                    onChange={() => setRecordMethod(method)}
                    className="text-teal-600"
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(6)}
                className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Growth Goals & Review */}
        {step === 6 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Primary 6-Month Business Target or Capital Goal
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Purchase an electric grain mill or double stock for holiday market"
                value={growthGoal}
                onChange={(e) => setGrowthGoal(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="font-semibold text-slate-800">Profile Summary Confirmation</div>
              <div className="text-slate-600">
                Owner: <strong>{fullName}</strong> ({email})
              </div>
              <div className="text-slate-600">
                Business: <strong>{businessName}</strong> · {location}
              </div>
              <div className="text-slate-600">
                Operating Since: <strong>{operatingSince}</strong> ({workerCount} workers)
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(5)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={handleCompleteRegistration}
                className="px-6 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-sm"
              >
                Complete Onboarding & Enter Dashboard
              </button>
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('/login')}
            className="text-teal-700 font-semibold hover:underline"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};
