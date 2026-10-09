import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Bell,
  Heart,
  ShoppingCart,
  Search,
  User,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { NestyMascot } from './NestyMascot';

export const Header: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    unreadNotificationCount,
    cartCount,
    wishlist,
    setIsNotificationsOpen,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsGlobalDrawerOpen,
    setIsSearchOpen,
    setIsProfileModalOpen,
    userProfile,
  } = useApp();

  const handleLogoClick = () => {
    if (userProfile.hasCompletedOnboarding) {
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('welcome');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-purple-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Left: Menu & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsGlobalDrawerOpen(true)}
            className="p-2 -ml-2 rounded-xl text-slate-700 hover:text-purple-600 hover:bg-purple-50 transition-colors focus:outline-hidden"
            title="Open All Screens Navigation Menu"
            aria-label="Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 text-left focus:outline-hidden group"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl leading-none">🐣</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent font-heading">
                  WellNest
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 tracking-wide uppercase hidden sm:inline-block">
                  Live
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden md:block leading-none">
                Meet Nesty 🐣 Your 24/7 Companion
              </p>
            </div>
          </button>
        </div>

        {/* Center / Navigation Quick Links on Desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
              currentScreen === 'dashboard'
                ? 'bg-purple-100 text-purple-700 font-bold'
                : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentScreen('healing-plan')}
            className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
              currentScreen === 'healing-plan'
                ? 'bg-purple-100 text-purple-700 font-bold'
                : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            Diet & Period
          </button>
          <button
            onClick={() => setCurrentScreen('sos')}
            className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
              currentScreen === 'sos'
                ? 'bg-rose-100 text-rose-700 font-bold'
                : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Emergency SOS
          </button>
          <button
            onClick={() => setCurrentScreen('store')}
            className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
              currentScreen === 'store'
                ? 'bg-purple-100 text-purple-700 font-bold'
                : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            Well Store
          </button>
          <button
            onClick={() => setCurrentScreen('chat')}
            className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1 ${
              currentScreen === 'chat'
                ? 'bg-purple-100 text-purple-700 font-bold'
                : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-pink-500" />
            Nesty AI
          </button>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            title="Search products, recipes, doctors..."
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition-colors relative"
            title="Saved Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition-colors relative"
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition-colors relative"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Profile Trigger */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-1.5 p-1 sm:pl-1.5 sm:pr-2.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-800 transition-colors border border-purple-200"
            title="Edit Profile & Body Metrics"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center text-xs font-bold">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-xs font-semibold max-w-[80px] truncate hidden sm:inline">
              {userProfile.name ? userProfile.name.split(' ')[0] : 'Profile'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
