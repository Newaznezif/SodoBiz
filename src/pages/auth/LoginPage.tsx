import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { SEED_USERS } from '../../lib/db';
import { ArrowRight, Lock, Mail, User, ShieldCheck, Building2, UserCheck } from 'lucide-react';

export const LoginPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { login, switchUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const success = login(email);
    if (success) {
      onNavigate('/dashboard');
    } else {
      setErrorMessage('Account not found with this email. Try one of the demo accounts below.');
    }
  };

  return (
    <div className="bg-slate-50 py-12 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1 text-center">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-teal-400 font-bold flex items-center justify-center mx-auto text-sm shadow">
            SB
          </div>
          <h1 className="text-xl font-bold text-slate-900 pt-2">Sign In to SodoBiz Bridge</h1>
          <p className="text-xs text-slate-500">Access your micro-enterprise records & readiness tools</p>
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
                placeholder="e.g. almaz@sodobiz.et"
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

        {/* Quick Demo Sign In for Hackathon Evaluators */}
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center">
            One-Click Demo Credentials
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {SEED_USERS.slice(0, 4).map((u) => {
              let Icon = User;
              let shortRole = 'Entrepreneur';
              if (u.role === 'agent') {
                Icon = UserCheck;
                shortRole = 'Agent';
              } else if (u.role === 'provider') {
                Icon = Building2;
                shortRole = 'Provider';
              } else if (u.role === 'admin') {
                Icon = ShieldCheck;
                shortRole = 'Admin';
              }

              return (
                <button
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    if (u.role === 'entrepreneur') onNavigate('/dashboard');
                    else if (u.role === 'agent') onNavigate('/agent/dashboard');
                    else if (u.role === 'provider') onNavigate('/provider/dashboard');
                    else if (u.role === 'admin') onNavigate('/admin/dashboard');
                  }}
                  className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition-colors flex items-center gap-2"
                >
                  <Icon className="w-4 h-4 text-teal-600 shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {u.full_name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{shortRole}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          New business owner?{' '}
          <button
            onClick={() => onNavigate('/register')}
            className="text-teal-700 font-semibold hover:underline"
          >
            Start Free Profile
          </button>
        </div>
      </div>
    </div>
  );
};
