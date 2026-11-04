import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Business, UserRoleType, AppNotification } from '../types';
import { db, SEED_USERS } from './db';
import { translations, Language, Translations } from './translations';

interface AuthContextType {
  currentUser: UserProfile;
  currentBusiness: Business | null;
  isAuthenticated: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  allUsers: UserProfile[];
  notifications: AppNotification[];
  unreadNotificationCount: number;
  login: (email: string) => boolean;
  register: (
    name: string,
    email: string,
    phone?: string,
    lang?: Language,
    role?: UserRoleType,
    extra?: Partial<UserProfile>
  ) => UserProfile;
  logout: () => void;
  switchUser: (userId: string) => void;
  refreshData: () => void;
  resetToDemoData: () => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateCurrentProfile: (updates: Partial<UserProfile>) => UserProfile | null;
  resetPassword: (email: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => db.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('sodobiz_logged_out') !== 'true';
  });
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(() =>
    db.getBusinessForUser(currentUser.id)
  );
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('sodobiz_lang') as Language) || currentUser.preferred_language || 'en';
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const user = db.getCurrentUser();
    setCurrentUser(user);
    if (user.role === 'entrepreneur') {
      const biz = db.getBusinessForUser(user.id);
      setCurrentBusiness(biz);
    } else {
      setCurrentBusiness(null);
    }
  }, [refreshTrigger]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sodobiz_lang', lang);
    db.updateUser(currentUser.id, { preferred_language: lang });
  };

  const login = (email: string): boolean => {
    const users = db.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (found) {
      localStorage.removeItem('sodobiz_logged_out');
      db.setCurrentUser(found.id);
      setCurrentUser(found);
      setIsAuthenticated(true);
      if (found.role === 'entrepreneur') {
        setCurrentBusiness(db.getBusinessForUser(found.id));
      } else {
        setCurrentBusiness(null);
      }
      setRefreshTrigger((prev) => prev + 1);
      return true;
    }
    return false;
  };

  const register = (
    name: string,
    email: string,
    phone?: string,
    lang: Language = 'en',
    role: UserRoleType = 'youth',
    extra?: Partial<UserProfile>
  ): UserProfile => {
    localStorage.removeItem('sodobiz_logged_out');
    const newUser = db.createUser({
      email,
      full_name: name,
      phone,
      preferred_language: lang,
      role,
      ...extra,
    });
    db.setCurrentUser(newUser.id);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setCurrentBusiness(null);
    setRefreshTrigger((prev) => prev + 1);
    return newUser;
  };

  const logout = () => {
    localStorage.setItem('sodobiz_logged_out', 'true');
    setIsAuthenticated(false);
    // Keep user state for seamless demo fallback or public browsing
    setRefreshTrigger((prev) => prev + 1);
  };

  const switchUser = (userId: string) => {
    localStorage.removeItem('sodobiz_logged_out');
    const u = db.setCurrentUser(userId);
    setCurrentUser(u);
    setIsAuthenticated(true);
    if (u.role === 'entrepreneur') {
      setCurrentBusiness(db.getBusinessForUser(u.id));
    } else {
      setCurrentBusiness(null);
    }
    setRefreshTrigger((prev) => prev + 1);
  };

  const updateCurrentProfile = (updates: Partial<UserProfile>): UserProfile | null => {
    const updated = db.updateUser(currentUser.id, updates);
    if (updated) {
      setCurrentUser(updated);
      setRefreshTrigger((prev) => prev + 1);
    }
    return updated;
  };

  const resetPassword = (email: string): boolean => {
    const users = db.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (found) {
      db.createNotification({
        user_id: found.id,
        title: 'Password Reset Initiated',
        message: 'A password recovery request was confirmed for your account.',
        type: 'system',
        link_url: '/login',
        is_read: false,
      });
      return true;
    }
    return false;
  };

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const resetToDemoData = () => {
    db.resetDemoData();
    localStorage.removeItem('sodobiz_logged_out');
    const defaultUser = db.getCurrentUser();
    setCurrentUser(defaultUser);
    setIsAuthenticated(true);
    setCurrentBusiness(db.getBusinessForUser(defaultUser.id));
    setRefreshTrigger((prev) => prev + 1);
  };

  const notifications = db.getNotifications(currentUser.id);
  const unreadNotificationCount = notifications.filter((n) => !n.is_read).length;

  const markNotificationAsRead = (id: string) => {
    db.markNotificationRead(id);
    setRefreshTrigger((prev) => prev + 1);
  };

  const markAllNotificationsAsRead = () => {
    db.markAllNotificationsRead(currentUser.id);
    setRefreshTrigger((prev) => prev + 1);
  };

  const t = translations[language] || translations.en;
  const allUsers = db.getUsers();

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentBusiness,
        isAuthenticated,
        language,
        setLanguage,
        t,
        allUsers,
        notifications,
        unreadNotificationCount,
        login,
        register,
        logout,
        switchUser,
        refreshData,
        resetToDemoData,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateCurrentProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
