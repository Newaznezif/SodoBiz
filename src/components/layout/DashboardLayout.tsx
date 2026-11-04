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
  Compass,
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
  const { currentUser, currentBusiness, logout, t } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Define navigation items based on current role
  let navItems: { label: string; path: string; icon: any }[] = [];

  if (currentUser.role === 'youth') {
    navItems = [
      { label: 'Youth Overview', path: '/youth/dashboard', icon: LayoutDashboard },
      { label: 'Browse Opportunities', path: '/opportunities', icon: Briefcase },
      { label: 'My Applications', path: '/youth/applications', icon: FileText },
      { label: 'Saved Opportunities', path: '/youth/saved', icon: BookmarkCheck },
      { label: 'Finance Bridge & Loans', path: '/finance-bridge', icon: DollarSign },
      { label: 'Business Launchpad', path: '/business-launchpad', icon: Rocket },
      { label: 'TVET & Skills Cohort', path: '/skills-tvet', icon: Award },
      { label: 'Mentorship Advisory', path: '/mentorship', icon: GraduationCap },
      { label: 'Inclusion & Support', path: '/support-directory', icon: LifeBuoy },
      { label: 'My Profile & Skills', path: '/youth/profile', icon: Users },
    ];
  } else if (currentUser.role === 'employer') {
    navItems = [
      { label: 'Employer Overview', path: '/employer/dashboard', icon: LayoutDashboard },
      { label: 'Publish Opportunity', path: '/employer/dashboard?tab=post', icon: PlusCircle },
      { label: 'Review Applications', path: '/employer/dashboard?tab=applications', icon: Users },
      { label: 'Partner Commitments', path: '/commitments', icon: Award },
      { label: 'Opportunity Hub', path: '/opportunities', icon: Briefcase },
    ];
  } else if (currentUser.role === 'mentor') {
    navItems = [
      { label: 'Mentor Overview', path: '/mentor/dashboard', icon: LayoutDashboard },
      { label: 'Session Requests', path: '/mentor/dashboard?tab=requests', icon: CheckSquare },
      { label: 'Session Notes', path: '/mentor/dashboard?tab=sessions', icon: FileText },
      { label: 'Mentor Directory', path: '/mentorship', icon: GraduationCap },
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
      { label: 'Opportunities', path: '/opportunities', icon: Briefcase },
      { label: 'Financial Literacy', path: '/dashboard/learning', icon: GraduationCap },
      { label: 'Verified Providers', path: '/dashboard/providers', icon: Building },
      { label: 'Settings', path: '/dashboard/settings', icon: Settings },
    ];
  } else if (currentUser.role === 'agent') {
    navItems = [
      { label: 'Agent Overview', path: '/agent/dashboard', icon: LayoutDashboard },
      { label: 'Assigned Entrepreneurs', path: '/agent/entrepreneurs', icon: Users },
      { label: 'Assistance Sessions', path: '/agent/sessions', icon: CheckSquare },
      { label: 'Opportunity Hub', path: '/opportunities', icon: Briefcase },
      { label: 'Commitment Tracker', path: '/commitments', icon: Award },
    ];
  } else if (currentUser.role === 'provider') {
    navItems = [
      { label: 'Provider Overview', path: '/provider/dashboard', icon: LayoutDashboard },
      { label: 'Organization Profile', path: '/provider/profile', icon: Building },
      { label: 'Finance Products', path: '/finance-bridge', icon: DollarSign },
      { label: 'Consented Referrals', path: '/provider/referrals', icon: Share2 },
    ];
  } else if (currentUser.role === 'admin') {
    navItems = [
      { label: 'System Overview', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'User Directory', path: '/admin/users', icon: Users },
      { label: 'Provider Approvals', path: '/admin/providers', icon: Building },
      { label: 'Opportunity Moderation', path: '/opportunities', icon: Briefcase },
      { label: 'Commitment Tracker', path: '/commitments', icon: Award },
      { label: 'Security Audit Logs', path: '/admin/audit-logs', icon: Shield },
    ];
  }

  // Derive active item
  const currentItem = navItems.find((item) => {
    if (item.path.includes('?')) {
      return currentPath === item.path.split('?')[0];
    }
    return item.path === currentPath;
  });
  const breadcrumbTitle = currentItem ? currentItem.label : 'Dashboard';

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded bg-teal-500 text-slate-900 font-bold flex items-center justify-center text-xs">
            SB
          </span>
          <span className="font-bold text-sm tracking-tight">{t.appName}</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 text-slate-300 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-30 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 transition-transform duration-200 ease-in-out no-print ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand header */}
          <div className="p-4 border-b border-slate-800">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 text-left text-white hover:text-teal-400 transition-colors w-full"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 font-black flex items-center justify-center text-sm shadow">
                SB
              </div>
              <div>
                <div className="font-bold tracking-tight text-sm text-white">SodoBiz Bridge</div>
                <div className="text-[11px] text-teal-400 font-medium capitalize">
                  {currentUser.role} Portal
                </div>
              </div>
            </button>
          </div>

          {/* Current entity info */}
          <div className="px-4 py-3 bg-slate-800/40 border-b border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Active User
            </div>
            <div className="text-xs font-semibold text-slate-100 truncate mt-0.5">
              {currentUser.full_name}
            </div>
            <div className="text-[11px] text-teal-300 truncate mt-0.5">
              {currentUser.role === 'youth' && currentUser.tvet_status
                ? `TVET: ${currentUser.tvet_status} · ${currentUser.kebele || 'Sodo'}`
                : currentUser.email}
            </div>
          </div>

          {/* Nav links */}
          <nav className="p-3 space-y-1 flex-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.path || (item.path.includes('?') && currentPath === item.path.split('?')[0]);
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
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="capitalize">{currentUser.role}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800">{breadcrumbTitle}</span>
          </div>

          <div className="flex items-center gap-3">
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
