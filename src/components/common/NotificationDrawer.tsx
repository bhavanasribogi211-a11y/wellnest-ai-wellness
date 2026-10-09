import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CheckCheck,
  Trash2,
  Clock,
  CheckCircle2,
  Settings,
  Bell,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { ScreenId } from '../../types';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearAllNotifications,
    snoozeNotification,
    unreadNotificationCount,
    setCurrentScreen,
    setIsNotificationSettingsOpen,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'All' | 'Period' | 'Diet' | 'Store' | 'SOS'>('All');

  if (!isNotificationsOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'SOS') return n.category === 'SOS' || n.category === 'Health';
    return n.category === activeTab;
  });

  const handleActionClick = (targetScreen?: ScreenId, id?: string) => {
    if (id) markNotificationRead(id);
    if (targetScreen) {
      setCurrentScreen(targetScreen);
      setIsNotificationsOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsNotificationsOpen(false)}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 via-pink-50 to-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-800 font-heading">
                  Notifications
                </h2>
                {unreadNotificationCount > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                    {unreadNotificationCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">Live wellness updates & alerts</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setIsNotificationsOpen(false);
                setIsNotificationSettingsOpen(true);
              }}
              className="p-2 text-slate-500 hover:text-purple-600 hover:bg-white rounded-xl transition-colors"
              title="Notification Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto bg-slate-50/50">
          {(['All', 'Period', 'Diet', 'Store', 'SOS'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-700 border border-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Actions Bar */}
        <div className="px-4 py-2 bg-purple-50/40 border-b border-purple-50 flex items-center justify-between text-xs">
          <button
            onClick={markAllNotificationsRead}
            disabled={unreadNotificationCount === 0}
            className="flex items-center gap-1.5 font-semibold text-purple-700 hover:text-purple-900 disabled:opacity-40 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
          <button
            onClick={() => {
              if (window.confirm('Clear all notifications?')) {
                clearAllNotifications();
              }
            }}
            disabled={notifications.length === 0}
            className="flex items-center gap-1 font-semibold text-slate-400 hover:text-rose-600 disabled:opacity-40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-50 flex items-center justify-center text-3xl">
                🌸
              </div>
              <h3 className="text-sm font-bold text-slate-700">All caught up!</h3>
              <p className="text-xs text-slate-400 mt-1">
                No notifications in the {activeTab} category right now.
              </p>
            </div>
          ) : (
            filteredNotifications.map(item => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  item.isRead
                    ? 'bg-white border-slate-100 opacity-90'
                    : 'bg-gradient-to-r from-purple-50/60 to-pink-50/30 border-purple-200 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-purple-200 text-purple-700">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.time}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mt-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0 mt-1" />
                  )}
                </div>

                {/* Actions on notification card */}
                <div className="mt-3 pt-2.5 border-t border-slate-100/80 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    {item.actionText && item.actionTargetScreen && (
                      <button
                        onClick={() => handleActionClick(item.actionTargetScreen, item.id)}
                        className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-1 shadow-2xs transition-all active:scale-95"
                      >
                        {item.actionText}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => snoozeNotification(item.id)}
                      className="px-2 py-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg flex items-center gap-1 transition-colors"
                      title="Snooze"
                    >
                      <Clock className="w-3 h-3" />
                      Snooze
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {!item.isRead && (
                      <button
                        onClick={() => markNotificationRead(item.id)}
                        className="p-1 text-slate-400 hover:text-emerald-600 rounded-md transition-colors"
                        title="Mark Done"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded-md transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
