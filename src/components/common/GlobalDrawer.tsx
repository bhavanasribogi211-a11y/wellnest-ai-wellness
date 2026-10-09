import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Compass,
  LayoutDashboard,
  CalendarHeart,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  UserCheck,
  Settings,
  Heart,
  ShoppingCart,
  Bell,
  RotateCcw,
} from 'lucide-react';
import { ScreenId } from '../../types';

export const GlobalDrawer: React.FC = () => {
  const {
    isGlobalDrawerOpen,
    setIsGlobalDrawerOpen,
    currentScreen,
    setCurrentScreen,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsNotificationsOpen,
    setIsNotificationSettingsOpen,
    setIsProfileModalOpen,
    resetProfile,
    showToast,
  } = useApp();

  if (!isGlobalDrawerOpen) return null;

  const navigateTo = (screen: ScreenId) => {
    setCurrentScreen(screen);
    setIsGlobalDrawerOpen(false);
  };

  const menuSections = [
    {
      id: 'welcome' as ScreenId,
      code: 'SC1',
      title: 'Welcome & Profile Setup',
      desc: 'Interactive body metrics, BMI, hair/skin, cycle inputs & mascot onboarding',
      icon: Compass,
      color: 'text-indigo-500 bg-indigo-50 border-indigo-100',
    },
    {
      id: 'dashboard' as ScreenId,
      code: 'SC2',
      title: 'Personalized Prediction Dashboard',
      desc: 'Hormonal, skin, hair, BMI & cycle insights cards with deep-dive modals',
      icon: LayoutDashboard,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      id: 'healing-plan' as ScreenId,
      code: 'SC3',
      title: 'Diet Lab, Exercise & Period Tracker',
      desc: '4 interactive tabs: Recipes, live workout timers, dynamic 4-phase cycle wheel, wellness foods',
      icon: CalendarHeart,
      color: 'text-pink-600 bg-pink-50 border-pink-100',
    },
    {
      id: 'sos' as ScreenId,
      code: 'SC4',
      title: 'Emergency SOS & Care Directory',
      desc: 'Hospitals, verified doctors, lab tests, appointment slots & simulated rides',
      icon: ShieldAlert,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
    {
      id: 'store' as ScreenId,
      code: 'SC5',
      title: 'Well Store & Pharmacy',
      desc: 'Skin/hair products, period essentials, supplements, cart, wishlist & checkout',
      icon: ShoppingBag,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      id: 'chat' as ScreenId,
      code: 'SC6',
      title: 'Nesty AI Wellness Chat',
      desc: '24/7 personalized wellness conversational companion with quick actions',
      icon: Sparkles,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsGlobalDrawerOpen(false)}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 left-0 max-w-sm w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-xl shadow-md">
              🐣
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-800 font-heading">
                WellNest Menu
              </h2>
              <p className="text-xs text-purple-600 font-medium">
                Jump to all 6 modules anytime
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsGlobalDrawerOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
            Application Modules
          </p>

          {menuSections.map(sec => {
            const Icon = sec.icon;
            const isActive = currentScreen === sec.id;

            return (
              <button
                key={sec.id}
                onClick={() => navigateTo(sec.id)}
                className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isActive
                    ? 'bg-purple-50/80 border-purple-300 shadow-xs ring-1 ring-purple-300'
                    : 'bg-white border-slate-100 hover:border-purple-200 hover:bg-slate-50/80'
                }`}
              >
                <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${sec.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-600 tracking-wide uppercase">
                      {sec.code}
                    </span>
                    {isActive && (
                      <span className="text-[10px] bg-purple-600 text-white font-bold px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 truncate mt-0.5">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                    {sec.desc}
                  </p>
                </div>
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-100 space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Quick Shortcuts & Settings
            </p>

            <button
              onClick={() => {
                setIsGlobalDrawerOpen(false);
                setIsProfileModalOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
            >
              <UserCheck className="w-4 h-4 text-purple-500" />
              Edit Wellness Profile & Metrics
            </button>

            <button
              onClick={() => {
                setIsGlobalDrawerOpen(false);
                setIsCartOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
            >
              <ShoppingCart className="w-4 h-4 text-pink-500" />
              Shopping Cart & Checkout
            </button>

            <button
              onClick={() => {
                setIsGlobalDrawerOpen(false);
                setIsWishlistOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors"
            >
              <Heart className="w-4 h-4 text-pink-500" />
              Saved Wishlist
            </button>

            <button
              onClick={() => {
                setIsGlobalDrawerOpen(false);
                setIsNotificationsOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
            >
              <Bell className="w-4 h-4 text-purple-500" />
              Notifications Center
            </button>

            <button
              onClick={() => {
                setIsGlobalDrawerOpen(false);
                setIsNotificationSettingsOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              Notification Settings
            </button>

            <button
              onClick={() => {
                resetProfile();
                showToast('Sample profile restored!', 'info');
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Profile to Default
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            WellNest Prototype • General Wellness Companion
          </p>
        </div>
      </div>
    </div>
  );
};
