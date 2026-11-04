import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { Bell, Check, ExternalLink, Inbox, X } from 'lucide-react';
import { AppNotification } from '../../types';

export const NotificationBell: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { notifications, unreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notif: AppNotification) => {
    if (!notif.is_read) {
      markNotificationAsRead(notif.id);
    }
    setIsOpen(false);
    if (notif.link_url) {
      onNavigate(notif.link_url);
    }
  };

  const getTypeBadge = (type: AppNotification['type']) => {
    switch (type) {
      case 'application':
        return 'bg-blue-100 text-blue-800';
      case 'mentorship':
        return 'bg-indigo-100 text-indigo-800';
      case 'referral':
        return 'bg-emerald-100 text-emerald-800';
      case 'opportunity':
        return 'bg-teal-100 text-teal-800';
      case 'commitment':
        return 'bg-amber-100 text-amber-800';
      case 'system':
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadNotificationCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100">
          <div className="p-3 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900">Notifications</span>
              {unreadNotificationCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                  {unreadNotificationCount} new
                </span>
              )}
            </div>
            {unreadNotificationCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-1">
                <Inbox className="w-6 h-6 mx-auto stroke-1" />
                <div className="text-xs">No notifications yet</div>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full p-3 text-left hover:bg-slate-50 transition-colors flex items-start gap-2.5 ${
                    !n.is_read ? 'bg-teal-50/40' : ''
                  }`}
                >
                  <div className="pt-0.5">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        !n.is_read ? 'bg-teal-600' : 'bg-transparent'
                      }`}
                    />
                  </div>
                  <div className="flex-1 space-y-0.5 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-slate-900 truncate">
                        {n.title}
                      </span>
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${getTypeBadge(n.type)}`}>
                        {n.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    <div className="text-[10px] text-slate-400">
                      {new Date(n.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
