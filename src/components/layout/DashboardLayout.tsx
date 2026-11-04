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
  FileText,
  FolderTree,
  LogOut,
  ChevronRight,
  Menu,
  X,
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

  if (currentUser.role === 'entrepreneur') {
    navItems = [
      { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Business Profile', path: '/dashboard/business', icon: Store },
      { label: 'Transactions', path: '/dashboard/transactions', icon: Receipt },
      { label: 'Record New Entry', path: '/dashboard/transactions/new', icon: PlusCircle },
      { label: 'Products & Stock', path: '/dashboard/products', icon: Package },
      { label: 'Financial Reports', path: '/dashboard/reports', icon: BarChart3 },
      { label: 'Readiness Profile', path: '/dashboard/readiness', icon: CheckSquare },
      { label: 'Financial Literacy', path: '/dashboard/learning', icon: GraduationCap },
      { label: 'Verified Providers', path: '/dashboard/providers', icon: Building },
      { label: 'Consented Referrals', path: '/dashboard/referrals', icon: Share2 },
      { label: 'Support Requests', path: '/dashboard/support', icon: LifeBuoy },
      { label: 'Settings', path: '/dashboard/settings', icon: Settings },
    ];
  } else if (currentUser.role === 'agent') {
    navItems = [
      { label: 'Agent Overview', path: '/agent/dashboard', icon: LayoutDashboard },
      { label: 'Assigned Entrepreneurs', path: '/agent/entrepreneurs', icon: Users },
      { label: 'Assistance Sessions', path: '/agent/sessions', icon: CheckSquare },
    ];
  } else if (currentUser.role === 'provider') {
    navItems = [
      { label: 'Provider Overview', path: '/provider/dashboard', icon: LayoutDashboard },
      { label: 'Organization Profile', path: '/provider/profile', icon: Building },
      { label: 'Published Services', path: '/provider/services', icon: Package },
      { label: 'Consented Referrals', path: '/provider/referrals', icon: Share2 },
    ];
  } else if (currentUser.role === 'admin') {
    navItems = [
      { label: 'System Overview', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'User Directory', path: '/admin/users', icon: Users },
      { label: 'Provider Approvals', path: '/admin/providers', icon: Building },
      { label: 'Support & Assistance', path: '/admin/support', icon: LifeBuoy },
      { label: 'Security Audit Logs', path: '/admin/audit-logs', icon: Shield },
    ];
  }

  // Derive breadcrumb text
  const currentItem = navItems.find((item) => item.path === currentPath);
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
          <div className="p-5 border-b border-slate-800">
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
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Active Context
            </div>
            <div className="text-xs font-semibold text-slate-100 truncate mt-0.5">
              {currentUser.role === 'entrepreneur' && currentBusiness
                ? currentBusiness.name
                : currentUser.full_name}
            </div>
            {currentUser.role === 'entrepreneur' && currentBusiness && (
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                {currentBusiness.location}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate(item.path);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-teal-600 text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User footer & return to public site */}
          <div className="p-3 border-t border-slate-800 space-y-2">
            <button
              onClick={() => onNavigate('/')}
              className="w-full flex items-center justify-between px-3 py-2 rounded text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              <span>View Public Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Breadcrumb Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="hover:text-slate-900 transition-colors"
            >
              Dashboard
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">{breadcrumbTitle}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-2 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              <span className="font-medium text-slate-800">{currentUser.full_name}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 capitalize">{currentUser.role}</span>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
