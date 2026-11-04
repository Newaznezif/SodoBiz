import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './lib/auth-context';
import { DemoSwitcher } from './components/common/DemoSwitcher';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Public pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { FinancialLiteracyPage } from './pages/public/FinancialLiteracyPage';
import { ProvidersPage } from './pages/public/ProvidersPage';
import { ProviderDetailPage } from './pages/public/ProviderDetailPage';
import { ContactPage } from './pages/public/ContactPage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { TermsPage } from './pages/public/TermsPage';

// Auth pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Entrepreneur dashboard pages
import { EntrepreneurDashboard } from './pages/dashboard/EntrepreneurDashboard';
import { BusinessProfilePage } from './pages/dashboard/BusinessProfilePage';
import { TransactionsPage } from './pages/dashboard/TransactionsPage';
import { NewTransactionPage } from './pages/dashboard/NewTransactionPage';
import { ProductsPage } from './pages/dashboard/ProductsPage';
import { ReportsPage } from './pages/dashboard/ReportsPage';
import { ReadinessPage } from './pages/dashboard/ReadinessPage';
import { LearningPage } from './pages/dashboard/LearningPage';
import { ReferralsPage } from './pages/dashboard/ReferralsPage';
import { SupportPage } from './pages/dashboard/SupportPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';

// Agent pages
import { AgentDashboard } from './pages/agent/AgentDashboard';
import { AgentEntrepreneursPage } from './pages/agent/AgentEntrepreneursPage';
import { AgentSessionsPage } from './pages/agent/AgentSessionsPage';

// Provider pages
import { ProviderDashboard } from './pages/provider/ProviderDashboard';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminProvidersPage } from './pages/admin/AdminProvidersPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

function AppContent() {
  const { currentUser } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname && window.location.pathname !== '/'
      ? window.location.pathname
      : '/';
  });
  const [selectedProviderSlug, setSelectedProviderSlug] = useState<string>('omo-bank-wolaita-sodo');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDashboardRoute =
    currentPath.startsWith('/dashboard') ||
    currentPath.startsWith('/agent') ||
    currentPath.startsWith('/provider') ||
    currentPath.startsWith('/admin');

  const renderPage = () => {
    // Dynamic provider detail route
    if (currentPath.startsWith('/providers/')) {
      const slug = currentPath.replace('/providers/', '');
      return <ProviderDetailPage slug={slug} onNavigate={navigate} />;
    }

    switch (currentPath) {
      // Public pages
      case '/':
        return <LandingPage onNavigate={navigate} />;
      case '/about':
        return <AboutPage onNavigate={navigate} />;
      case '/how-it-works':
        return <HowItWorksPage onNavigate={navigate} />;
      case '/services':
        return <ServicesPage onNavigate={navigate} />;
      case '/financial-literacy':
        return <FinancialLiteracyPage onNavigate={navigate} />;
      case '/providers':
        return (
          <ProvidersPage
            onNavigate={navigate}
            onSelectProvider={(slug) => setSelectedProviderSlug(slug)}
          />
        );
      case '/contact':
        return <ContactPage onNavigate={navigate} />;
      case '/privacy':
        return <PrivacyPage onNavigate={navigate} />;
      case '/terms':
        return <TermsPage onNavigate={navigate} />;

      // Auth pages
      case '/login':
        return <LoginPage onNavigate={navigate} />;
      case '/register':
        return <RegisterPage onNavigate={navigate} />;
      case '/forgot-password':
        return <ForgotPasswordPage onNavigate={navigate} />;

      // Entrepreneur dashboard pages
      case '/dashboard':
        return <EntrepreneurDashboard onNavigate={navigate} />;
      case '/dashboard/business':
        return <BusinessProfilePage onNavigate={navigate} />;
      case '/dashboard/transactions':
        return <TransactionsPage onNavigate={navigate} />;
      case '/dashboard/transactions/new':
        return <NewTransactionPage onNavigate={navigate} />;
      case '/dashboard/products':
        return <ProductsPage onNavigate={navigate} />;
      case '/dashboard/reports':
        return <ReportsPage onNavigate={navigate} />;
      case '/dashboard/readiness':
        return <ReadinessPage onNavigate={navigate} />;
      case '/dashboard/learning':
        return <LearningPage onNavigate={navigate} />;
      case '/dashboard/providers':
        return (
          <ProvidersPage
            onNavigate={navigate}
            onSelectProvider={(slug) => setSelectedProviderSlug(slug)}
          />
        );
      case '/dashboard/referrals':
        return <ReferralsPage onNavigate={navigate} />;
      case '/dashboard/support':
        return <SupportPage onNavigate={navigate} />;
      case '/dashboard/settings':
        return <SettingsPage onNavigate={navigate} />;

      // Agent pages
      case '/agent/dashboard':
        return <AgentDashboard onNavigate={navigate} />;
      case '/agent/entrepreneurs':
        return <AgentEntrepreneursPage onNavigate={navigate} />;
      case '/agent/sessions':
        return <AgentSessionsPage onNavigate={navigate} />;

      // Provider pages
      case '/provider/dashboard':
      case '/provider/profile':
      case '/provider/services':
      case '/provider/referrals':
        return <ProviderDashboard onNavigate={navigate} />;

      // Admin pages
      case '/admin/dashboard':
        return <AdminDashboard onNavigate={navigate} />;
      case '/admin/users':
        return <AdminUsersPage onNavigate={navigate} />;
      case '/admin/providers':
        return <AdminProvidersPage onNavigate={navigate} />;
      case '/admin/support':
        return <AdminUsersPage onNavigate={navigate} />;
      case '/admin/audit-logs':
        return <AdminAuditLogsPage onNavigate={navigate} />;

      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      {/* Demo Role Switcher Toolbar */}
      <DemoSwitcher onNavigate={navigate} />

      {isDashboardRoute ? (
        <DashboardLayout currentPath={currentPath} onNavigate={navigate}>
          {renderPage()}
        </DashboardLayout>
      ) : (
        <div className="flex flex-col min-h-screen">
          <Navbar currentPath={currentPath} onNavigate={navigate} />
          <main className="flex-1">{renderPage()}</main>
          <Footer onNavigate={navigate} />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
