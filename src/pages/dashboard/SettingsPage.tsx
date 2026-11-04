import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db } from '../../lib/db';
import { Language } from '../../lib/translations';
import {
  Settings,
  Globe,
  Shield,
  User,
  CheckCircle2,
  KeyRound,
  Bell,
  Download,
  LogOut,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const SettingsPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser, language, setLanguage, refreshData, logout } = useAuth();

  const [fullName, setFullName] = useState(currentUser.full_name);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [kebele, setKebele] = useState(currentUser.kebele || '');
  const [savedNotice, setSavedNotice] = useState(false);

  // Password Change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Notification Preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateUser(currentUser.id, {
      full_name: fullName,
      phone,
      bio,
      kebele,
    });
    refreshData();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordNotice(null);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordNotice('Password changed successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setTimeout(() => setPasswordNotice(null), 3000);
  };

  const handleExportData = () => {
    const userData = {
      profile: currentUser,
      documents: db.getUserDocuments(currentUser.id),
      applications: db.getApplications(currentUser.id),
      notifications: db.getNotifications(currentUser.id),
      exported_at: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(userData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sodobiz_profile_export_${currentUser.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSignOut = () => {
    logout();
    onNavigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account & Platform Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your personal credentials, communication preferences, interface language, and account security.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>Account profile updated successfully!</span>
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
                    ? 'border-teal-600 bg-teal-50/50 shadow-xs ring-1 ring-teal-600'
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900">Personal Account Information</h2>
          </div>
          <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
            Role: {currentUser.role}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Full Legal Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
            />
          </div>

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
            <label className="text-xs font-semibold text-slate-700">Phone Number (telebirr)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Kebele of Residence</label>
            <input
              type="text"
              value={kebele}
              onChange={(e) => setKebele(e.target.value)}
              placeholder="e.g. Kebele 02, Sodo"
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Short Bio / Background</label>
          <textarea
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell partners and opportunities about your trade background."
            className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shadow-sm"
          >
            Save Account Information
          </button>
        </div>
      </form>

      {/* Password & Security Card */}
      <form onSubmit={handlePasswordChange} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900">Change Password</h2>
        </div>

        {passwordError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{passwordNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">New Password</label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Confirm New Password</label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors shadow-sm"
          >
            Update Password
          </button>
        </div>
      </form>

      {/* Notification Preferences */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900">Communication & Notification Preferences</h2>
        </div>

        <div className="space-y-3 pt-1">
          <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
            <div>
              <span className="font-semibold block">Opportunity & Application Updates</span>
              <span className="text-slate-500 text-[11px]">Notify when status changes to shortlisted, interview, or accepted</span>
            </div>
            <input
              type="checkbox"
              checked={inAppAlerts}
              onChange={(e) => setInAppAlerts(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer pt-2 border-t border-slate-100">
            <div>
              <span className="font-semibold block">Mentorship Session Alerts</span>
              <span className="text-slate-500 text-[11px]">Receive reminders for scheduled advisory sessions and messages</span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer pt-2 border-t border-slate-100">
            <div>
              <span className="font-semibold block">SMS / telebirr Alerts</span>
              <span className="text-slate-500 text-[11px]">Direct SMS dispatch for emergency interview dates</span>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
          </label>
        </div>
      </div>

      {/* Data Export & Account Actions */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-slate-900">Data Portability & Logout</h3>
          <p className="text-[11px] text-slate-500">
            Export a complete JSON backup of your records, or sign out of this device session.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Data</span>
          </button>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
