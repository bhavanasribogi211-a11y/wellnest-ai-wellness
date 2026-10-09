/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { GlobalDrawer } from './components/common/GlobalDrawer';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { NotificationSettingsModal } from './components/common/NotificationSettingsModal';
import { CartDrawer } from './components/common/CartDrawer';
import { WishlistModal } from './components/common/WishlistModal';
import { SearchModal } from './components/common/SearchModal';
import { ProfileModal } from './components/common/ProfileModal';

import { WelcomeScreen } from './screens/WelcomeScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { HealingPlanScreen } from './screens/HealingPlanScreen';
import { EmergencySosScreen } from './screens/EmergencySosScreen';
import { WellStoreScreen } from './screens/WellStoreScreen';
import { NestyChatScreen } from './screens/NestyChatScreen';

function MainApp() {
  const { currentScreen } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-purple-200 selection:text-purple-900">
      {/* Sticky Top Header */}
      <Header />

      {/* Main Content Router */}
      <main className="flex-1 w-full">
        {currentScreen === 'welcome' && <WelcomeScreen />}
        {currentScreen === 'dashboard' && <DashboardScreen />}
        {currentScreen === 'healing-plan' && <HealingPlanScreen />}
        {currentScreen === 'sos' && <EmergencySosScreen />}
        {currentScreen === 'store' && <WellStoreScreen />}
        {currentScreen === 'chat' && <NestyChatScreen />}
      </main>

      {/* Persistent Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Modals & Drawers */}
      <GlobalDrawer />
      <NotificationDrawer />
      <NotificationSettingsModal />
      <CartDrawer />
      <WishlistModal />
      <SearchModal />
      <ProfileModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
