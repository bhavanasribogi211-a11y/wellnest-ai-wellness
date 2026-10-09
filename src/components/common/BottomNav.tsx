import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  UtensilsCrossed,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { ScreenId } from '../../types';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useApp();

  const navItems: { id: ScreenId; label: string; icon: any; isEmergency?: boolean }[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'healing-plan', label: 'Diet Lab', icon: UtensilsCrossed },
    { id: 'sos', label: 'SOS', icon: ShieldAlert, isEmergency: true },
    { id: 'store', label: 'Store', icon: ShoppingBag },
    { id: 'chat', label: 'Nesty AI', icon: Sparkles },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-purple-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-2 py-1 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          if (item.isEmergency) {
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className="flex flex-col items-center -mt-5 focus:outline-hidden group"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
                    isActive
                      ? 'bg-rose-600 text-white ring-4 ring-rose-200'
                      : 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white hover:scale-105'
                  }`}
                >
                  <Icon className="w-6 h-6 animate-pulse" />
                </div>
                <span className={`text-[10px] font-bold mt-1 ${isActive ? 'text-rose-600' : 'text-slate-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all focus:outline-hidden ${
                isActive
                  ? 'text-purple-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600 active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-bold text-purple-700' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
