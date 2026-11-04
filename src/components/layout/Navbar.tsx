import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { Menu, X, ArrowRight, LayoutDashboard, UserCheck, LogIn, UserPlus } from 'lucide-react';
import { NotificationBell } from '../common/NotificationBell';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    switch (currentUser.role) {
      case 'youth':
        return '/youth/dashboard';
      case 'employer':
        return '/employer/dashboard';
      case 'mentor':
        return '/mentor/dashboard';
      case 'agent':
        return '/agent/dashboard';
      case 'provider':
        return '/provider/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'entrepreneur':
      default:
        return '/dashboard';
    }
  };

  const navLinks = [
    { label: 'Opportunities', path: '/opportunities' },
    { label: 'Finance Bridge', path: '/finance-bridge' },
    { label: 'Business Launchpad', path: '/business-launchpad' },
    { label: 'TVET & Skills', path: '/skills-tvet' },
    { label: 'Mentorship', path: '/mentorship' },
    { label: 'Commitment Tracker', path: '/commitments' },
    { label: 'Support Directory', path: '/support-directory' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Wordmark */}
          <button
            onClick={() => onNavigate('/')}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-teal-700 transition-colors flex items-center gap-2.5 text-left"
          >
            <span className="w-8 h-8 rounded-lg bg-slate-900 text-teal-400 font-black flex items-center justify-center text-sm shadow-sm">
              SB
            </span>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight leading-none">SodoBiz Bridge</span>
              <span className="text-[10px] text-slate-500 font-normal uppercase tracking-wider mt-0.5">Wolaita Sodo, Ethiopia</span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-4 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-[13px] ${
                    isActive
                      ? 'border-teal-600 text-slate-900 font-semibold'
                      : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action Area: Notifications & Portal CTA */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <NotificationBell onNavigate={onNavigate} />

            <button
              onClick={() => onNavigate(getDashboardPath())}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-teal-400" />
              <span className="capitalize">{currentUser.role === 'youth' ? 'Youth Portal' : `${currentUser.role} Portal`}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <NotificationBell onNavigate={onNavigate} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-2">
          <div className="grid grid-cols-1 gap-1">
            <button
              onClick={() => {
                onNavigate('/');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md"
            >
              Home
            </button>
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-sm font-medium rounded-md ${
                  currentPath === link.path
                    ? 'bg-teal-50 text-teal-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onNavigate(getDashboardPath());
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800"
            >
              <LayoutDashboard className="w-4 h-4 text-teal-400" />
              <span>Go to {currentUser.role} Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
