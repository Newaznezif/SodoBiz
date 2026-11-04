import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { Language } from '../../lib/translations';
import { Settings, Globe, Shield, User, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser, language, setLanguage, refreshData } = useAuth();

  const [fullName, setFullName] = useState(currentUser.full_name);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateUser(currentUser.id, {
      full_name: fullName,
      phone,
    });
    refreshData();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account & Platform Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure language preferences, contact details, and privacy configurations.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>Account preferences updated successfully!</span>
        </div>
      )}

      {/* Language Preference Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-teal-600" />
          <h2 className="text-sm font-bold text-slate-900">Platform Language Preference</h2>
        </div>
        <p className="text-xs text-slate-600">
          Select the interface language for navigation, transaction labels, and learning lessons.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {[
            { id: 'en', label: 'English', desc: 'Standard business terms' },
            { id: 'am', label: 'አማርኛ (Amharic)', desc: 'የአማርኛ ቋንቋ በይነገጽ' },
            { id: 'wo', label: 'Wolayttatto (Wolaita)', desc: 'Wolaytta doona qonccissuwan' },
          ].map((lang) => {
            const isActive = language === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id as Language)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'border-teal-600 bg-teal-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`text-xs font-bold ${isActive ? 'text-teal-900' : 'text-slate-900'}`}>
                  {lang.label}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">{lang.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Account Info Form */}
      <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900">Personal Contact Information</h2>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Email Address (Read-Only)</label>
            <input
              type="email"
              disabled
              value={currentUser.email}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800"
          >
            Save Account Information
          </button>
        </div>
      </form>

      {/* Security & Data Ownership Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900">Security & Privacy Governance</h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your account is protected under role-based database constraints. Your records cannot be viewed by other merchants, third-party brokers, or external lenders without your explicit consent.
        </p>
        <div className="pt-2 flex items-center gap-4 text-xs">
          <button onClick={() => onNavigate('/privacy')} className="text-teal-700 font-semibold hover:underline">
            Review Privacy Policy
          </button>
          <span>·</span>
          <button onClick={() => onNavigate('/terms')} className="text-teal-700 font-semibold hover:underline">
            Review Terms of Service
          </button>
        </div>
      </div>
    </div>
  );
};
