import React from 'react';
import { useAuth } from '../../lib/auth-context';
import { SEED_USERS } from '../../lib/db';
import { RotateCcw, ShieldCheck, UserCheck, Building2, User } from 'lucide-react';

export const DemoSwitcher: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { currentUser, switchUser, language, setLanguage, resetToDemoData } = useAuth();

  return (
    <div className="bg-slate-900 text-slate-200 text-xs border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 no-print">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-teal-400 uppercase tracking-wider">Demo Role Switcher:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {SEED_USERS.map((user) => {
            const isActive = currentUser.id === user.id;
            let Icon = User;
            let roleLabel = 'Entrepreneur';
            if (user.role === 'agent') {
              Icon = UserCheck;
              roleLabel = 'Agent';
            } else if (user.role === 'provider') {
              Icon = Building2;
              roleLabel = 'Provider';
            } else if (user.role === 'admin') {
              Icon = ShieldCheck;
              roleLabel = 'Admin';
            }

            return (
              <button
                key={user.id}
                onClick={() => {
                  switchUser(user.id);
                  if (user.role === 'entrepreneur') onNavigate('/dashboard');
                  else if (user.role === 'agent') onNavigate('/agent/dashboard');
                  else if (user.role === 'provider') onNavigate('/provider/dashboard');
                  else if (user.role === 'admin') onNavigate('/admin/dashboard');
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-teal-600 text-white font-medium shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={`Switch to ${user.full_name} (${roleLabel})`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{user.full_name.split(' ')[0]} ({roleLabel})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Language selector */}
        <div className="flex items-center bg-slate-800 rounded p-0.5">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              language === 'en' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('am')}
            className={`px-2 py-0.5 rounded text-xs font-ethiopic transition-colors ${
              language === 'am' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            አማ
          </button>
          <button
            onClick={() => setLanguage('wo')}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              language === 'wo' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Wol
          </button>
        </div>

        {/* Reset Demo Data Button */}
        <button
          onClick={() => {
            if (confirm('Reset all demo records back to initial Wolaita Sodo seed state?')) {
              resetToDemoData();
              onNavigate('/dashboard');
            }
          }}
          className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors px-2 py-0.5"
          title="Reset database to seed state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Seeds</span>
        </button>
      </div>
    </div>
  );
};
