import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Business } from '../types';
import { db, SEED_USERS } from './db';
import { translations, Language, Translations } from './translations';

interface AuthContextType {
  currentUser: UserProfile;
  currentBusiness: Business | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  allUsers: UserProfile[];
  login: (email: string) => boolean;
  register: (name: string, email: string, phone?: string, lang?: Language) => UserProfile;
  logout: () => void;
  switchUser: (userId: string) => void;
  refreshData: () => void;
  resetToDemoData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => db.getCurrentUser());
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
      db.setCurrentUser(found.id);
      setCurrentUser(found);
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

  const register = (name: string, email: string, phone?: string, lang: Language = 'en'): UserProfile => {
    const newUser = db.createUser({
      email,
      full_name: name,
      phone,
      preferred_language: lang,
      role: 'entrepreneur',
    });
    db.setCurrentUser(newUser.id);
    setCurrentUser(newUser);
    setCurrentBusiness(null);
    setRefreshTrigger((prev) => prev + 1);
    return newUser;
  };

  const logout = () => {
    // Switch to first demo entrepreneur for ease of inspection
    db.setCurrentUser('user-almaz');
    setCurrentUser(SEED_USERS[0]);
    setCurrentBusiness(db.getBusinessForUser('user-almaz'));
    setRefreshTrigger((prev) => prev + 1);
  };

  const switchUser = (userId: string) => {
    const u = db.setCurrentUser(userId);
    setCurrentUser(u);
    if (u.role === 'entrepreneur') {
      setCurrentBusiness(db.getBusinessForUser(u.id));
    } else {
      setCurrentBusiness(null);
    }
    setRefreshTrigger((prev) => prev + 1);
  };

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const resetToDemoData = () => {
    db.resetDemoData();
    const defaultUser = db.getCurrentUser();
    setCurrentUser(defaultUser);
    setCurrentBusiness(db.getBusinessForUser(defaultUser.id));
    setRefreshTrigger((prev) => prev + 1);
  };

  const t = translations[language] || translations.en;
  const allUsers = db.getUsers();

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentBusiness,
        language,
        setLanguage,
        t,
        allUsers,
        login,
        register,
        logout,
        switchUser,
        refreshData,
        resetToDemoData,
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
