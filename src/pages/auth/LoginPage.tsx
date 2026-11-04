import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { db, SEED_USERS } from '../../lib/db';
import { ArrowRight, Lock, Mail, User, ShieldCheck, Building2, UserCheck, GraduationCap, Briefcase, Store } from 'lucide-react';

export const LoginPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { login, switchUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const routeForUser = (userId: string) => {
    const user = db.getUsers().find((u) => u.id === userId);
    if (!user) {
      onNavigate('/dashboard');
      return;
    }
    switch (user.role) {
      case 'youth':
        onNavigate('/youth/dashboard');
        break;
      case 'employer':
        onNavigate('/employer/dashboard');
        break;
      case 'mentor':
        onNavigate('/mentor/dashboard');
        break;
      case 'provider':
        onNavigate('/provider/dashboard');
        break;
      case 'agent':
        onNavigate('/agent/dashboard');
        break;
      case 'admin':
        onNavigate('/admin/dashboard');
        break;
      case 'entrepreneur':
      default:
        onNavigate('/dashboard');
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const success = login(email);
    if (success) {
      const matched = db.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
      if (matched) {
        routeForUser(matched.id);
      } else {
        onNavigate('/dashboard');
      }
    } else {
      setErrorMessage('Account not found with this email. Try one of the quick test accounts below.');
    }
  };

  const demoAccounts = [
    { id: 'user-youth-bekele', name: 'Bekele', role: 'Youth / Job Seeker', icon: GraduationCap },
    { id: 'user-employer-damota', name: 'Damota Agro', role: 'Employer Partner', icon: Briefcase },
    { id: 'user-mentor-tamirat', name: 'Tamirat', role: 'Mentor / Advisor', icon: User },
    { id: 'user-provider-omo', name: 'Omo Bank', role: 'Financial Institution', icon: Building2 },
    { id: 'user-almaz', name: 'Almaz', role: 'Micro-Entrepreneur', icon: Store },
    { id: 'user-admin', name: 'Admin', role: 'System Governance', icon: ShieldCheck },
  ];

  return (
    <div className="bg-slate-50 py-12 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1 text-center">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-teal-400 font-bold flex items-center justify-center mx-auto text-sm shadow">
            SB
          </div>
          <h1 className="text-xl font-bold text-slate-900 pt-2">Sign In to SodoBiz Bridge</h1>
          <p className="text-xs text-slate-500">Connecting youth livelihoods, employers & financial opportunities</p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 text-rose-800 text-xs border border-rose-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="e.g. bekele.youth@sodobiz.et"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => onNavigate('/forgot-password')}
                className="text-[11px] text-teal-700 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shadow-sm"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Instant Role Sign-in */}
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center">
            One-Click Role Authentication
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {demoAccounts.map((acc) => {
              const Icon = acc.icon;
              return (
                <button
                  key={acc.id}
                  onClick={() => {
                    switchUser(acc.id);
                    routeForUser(acc.id);
                  }}
                  className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition-colors flex items-center gap-2"
                >
                  <Icon className="w-4 h-4 text-teal-600 shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {acc.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{acc.role}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Need an account?{' '}
          <button
            onClick={() => onNavigate('/register')}
            className="text-teal-700 font-semibold hover:underline"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};
