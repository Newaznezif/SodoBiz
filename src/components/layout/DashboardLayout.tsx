import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import {
  LayoutDashboard,
  Store,
  Receipt,
  PlusCircle,
  Package,
  BarChart3,
  CheckSquare,
  GraduationCap,
  Building,
  Share2,
  LifeBuoy,
  Settings,
  Users,
  Shield,
  Briefcase,
  BookmarkCheck,
  FileText,
  DollarSign,
  Rocket,
  Award,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { NotificationBell } from '../common/NotificationBell';

interface DashboardLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentPath,
  onNavigate,
  children,
}) => {
  const { currentUser, currentBusiness, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Define navigation items based on current role
  let navItems: { label: string; path: string; icon: any }[] = [];

  if (currentUser.role === 'youth') {
    navItems = [
      { label: 'Youth Overview', path: '/youth/dashboard', icon: LayoutDashboard },
      { label: 'Profile & Documents', path: '/youth/profile', icon: Users },
      { label: 'Browse Opportunities', path: '/opportunities', icon: Briefcase },
      { label: 'My Applications', path: '/youth/applications', icon: FileText },
      { label: 'Finance Bridge & Loans', path: '/finance-bridge', icon: DollarSign },
      { label: 'Business Launchpad', path: '/business-launchpad', icon: Rocket },
      { label: 'TVET & Skills Training', path: '/skills-tvet', icon: Award },
      { label: 'Mentorship Advisory', path: '/mentorship', icon: GraduationCap },
      { label: 'Inclusion & Support', path: '/support-directory', icon: LifeBuoy },
      { label: 'Account Settings', path: '/dashboard/settings', icon: Settings },
    ];
  } else if (currentUser.role === 'employer') {
    navItems = [
      { label: 'Employer Overview', path: '/employer/dashboard', icon: LayoutDashboard },
      { label: 'Publish Opportunity', path: '/employer/dashboard?tab=post', icon: PlusCircle },
      { label: 'Review Applications', path: '/employer/dashboard?tab=applications', icon: Users },
      { label: 'Partner Commitments', path: '/commitments', icon: Award },
      { label: 'Opportunity Hub', path: '/opportunities', icon: Briefcase },
      { label: 'Account Settings', path: '/dashboard/settings', icon: Settings },
    ];
  } else if (currentUser.role === 'mentor') {
    navItems = [
      { label: 'Mentor Overview', path: '/mentor/dashboard', icon: LayoutDashboard },
      { label: 'Session Requests', path: '/mentor/dashboard?tab=requests', icon: CheckSquare },
      { label: 'Session Logs', path: '/mentor/dashboard?tab=sessions', icon: FileText },
      { label: 'Mentor Directory', path: '/mentorship', icon: GraduationCap },
      { label: 'Account Settings', path: '/dashboard/settings', icon: Settings },
    ];
  } else if (currentUser.role === 'entrepreneur') {
    navItems = [
      { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Business Profile', path: '/dashboard/business', icon: Store },
      { label: 'Transactions', path: '/dashboard/transactions', icon: Receipt },
      { label: 'Record New Entry', path: '/dashboard/transactions/new', icon: PlusCircle },
      { label: 'Products & Stock', path: '/dashboard/products', icon: Package },
      { label: 'Financial Reports', path: '/dashboard/reports', icon: BarChart3 },
      { label: 'Readiness Profile', path: '/dashboard/readiness', icon: CheckSquare },
      { label: 'Finance Bridge', path: '/finance-bridge', icon: DollarSign },
      { label: 'Business Launchpad', path: '/business-launchpad', icon: Rocket },
      { label: 'Financial Literacy', path: '/dashboard/learning', icon: GraduationCap },
      { label: 'Verified Providers', path: '/dashboard/providers', icon: Building },
      { label: 'Settings', path: '/dashboard/settings', icon: Settings },
    ];
  } else if (currentUser.role === 'agent') {
    navItems = [
      { label: 'Agent Overview', path: '/agent/dashboard', icon: LayoutDashboard },
      { label: 'Assigned Enterprises', path: '/agent/entrepreneurs', icon: Users },
      { label: 'Assistance Sessions', path: '/agent/sessions', icon: CheckSquare },
      { label: 'Opportunity Hub', path: '/opportunities', icon: Briefcase },
      { label: 'Commitment Tracker', path: '/commitments', icon: Award },
      { label: 'Account Settings', path: '/dashboard/settings', icon: Settings },
    ];
  } else if (currentUser.role === 'provider') {
    navItems = [
      { label: 'Provider Overview', path: '/provider/dashboard', icon: LayoutDashboard },
      { label: 'Organization Profile', path: '/provider/profile', icon: Building },
      { label: 'Finance Products', path: '/finance-bridge', icon: DollarSign },
      { label: 'Consented Referrals', path: '/provider/referrals', icon: Share2 },
      { label: 'Account Settings', path: '/dashboard/settings', icon: Settings },
    ];
  } else if (currentUser.role === 'admin') {
    navItems = [
      { label: 'System Overview', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'User Directory', path: '/admin/users', icon: Users },
      { label: 'Provider Approvals', path: '/admin/providers', icon: Building },
      { label: 'Opportunity Moderation', path: '/opportunities', icon: Briefcase },
      { label: 'Commitment Tracker', path: '/commitments', icon: Award },
      { label: 'Support Directory', path: '/support-directory', icon: LifeBuoy },
      { label: 'Security Audit Logs', path: '/admin/audit-logs', icon: Shield },
      { label: 'Account Settings', path: '/dashboard/settings', icon: Settings },
    ];
  }

  // Derive active item
  const currentItem = navItems.find((item) => {
    if (item.path.includes('?')) {
      const basePath = item.path.split('?')[0];
      return currentPath === basePath;
    }
    return currentPath === item.path;
  });

  const breadcrumbTitle = currentItem?.label || 'Portal';

  return (
    <div className="flex-1 flex min-h-[calc(100vh-3.5rem)] bg-slate-100">
      {/* Mobile Sidebar Toggle Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-3 rounded-full bg-slate-900 text-white shadow-lg focus:outline-none"
          aria-label="Toggle navigation drawer"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 transition-transform duration-200 z-40 fixed inset-y-0 left-0 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* User Profile Mini Header */}
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                {currentUser.role} portal
              </span>
              <button
                onClick={() => {
                  logout();
                  onNavigate('/login');
                }}
                className="text-slate-400 hover:text-rose-400 text-xs p-1 rounded"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="font-bold text-white text-sm mt-1 truncate">
              {currentUser.role === 'entrepreneur' && currentBusiness
                ? currentBusiness.name
                : currentUser.full_name}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {currentUser.role === 'youth'
                ? `${currentUser.education_level || 'TVET Candidate'} · ${currentUser.kebele || 'Sodo'}`
                : currentUser.email}
            </div>
          </div>

          {/* Nav links */}
          <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive =
                currentPath === item.path ||
                (item.path.includes('?') && currentPath === item.path.split('?')[0]);
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    onNavigate(item.path);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-teal-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick link to public website */}
          <div className="p-3 border-t border-slate-800">
            <button
              onClick={() => {
                onNavigate('/');
                setMobileSidebarOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              <span>Back to Public Hub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header / Breadcrumb */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="capitalize">{currentUser.role}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800">{breadcrumbTitle}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationBell onNavigate={onNavigate} />

            <button
              onClick={() => onNavigate('/opportunities')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              <span>Explore Opportunities</span>
            </button>
            <button
              onClick={() => onNavigate('/commitments')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-slate-500" />
              <span>Partner Tracker</span>
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
