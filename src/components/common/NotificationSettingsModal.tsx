import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, BellRing, Volume2, Vibrate, Check, ShieldCheck } from 'lucide-react';

export const NotificationSettingsModal: React.FC = () => {
  const {
    isNotificationSettingsOpen,
    setIsNotificationSettingsOpen,
    notificationSettings,
    updateNotificationSettings,
  } = useApp();

  if (!isNotificationSettingsOpen) return null;

  const toggle = (key: keyof typeof notificationSettings) => {
    updateNotificationSettings({ [key]: !notificationSettings[key] });
  };

  const categories = [
    { key: 'period', label: 'Period & Cycle Reminders', desc: 'Phase changes, upcoming cycle predictions, and daily symptom logs' },
    { key: 'diet', label: 'Diet Lab & Meal Alerts', desc: 'Breakfast, lunch, and dinner recipe suggestions for hormone harmony' },
    { key: 'water', label: 'Hydration Gentle Prompts', desc: 'Hourly prompts to reach your 8-glass daily water intake' },
    { key: 'exercise', label: 'Movement & Yoga Nudges', desc: 'Reminders for gentle yoga, walks, and pelvic floor stretches' },
    { key: 'medicines', label: 'Supplements & Vitamins', desc: 'Timing alerts for inositol, magnesium, and doctor prescriptions' },
    { key: 'store', label: 'Store Refills & Offers', desc: 'Low-stock reorder reminders and express delivery tracking updates' },
    { key: 'appointments', label: 'Doctor & Lab Bookings', desc: 'Confirmations, reminder calls, and digital report availability' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsNotificationSettingsOpen(false)}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800 font-heading">
                Notification Preferences
              </h3>
              <p className="text-xs text-slate-500">Customize how and when Nesty reminds you</p>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationSettingsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Wellness Categories
          </p>

          {categories.map(cat => {
            const isEnabled = notificationSettings[cat.key as keyof typeof notificationSettings];
            return (
              <div
                key={cat.key}
                onClick={() => toggle(cat.key as keyof typeof notificationSettings)}
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 cursor-pointer transition-all"
              >
                <div className="pr-3">
                  <h4 className="text-sm font-bold text-slate-800">{cat.label}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.desc}</p>
                </div>
                <div
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    isEnabled ? 'bg-gradient-to-r from-purple-600 to-pink-500' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-xs ${
                      isEnabled ? 'left-[22px]' : 'left-0.5'
                    }`}
                  />
                </div>
              </div>
            );
          })}

          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-2">
            Sound & Haptics
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => toggle('sound')}
              className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                notificationSettings.sound
                  ? 'border-purple-300 bg-purple-50/50'
                  : 'border-slate-100 bg-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-slate-800">In-App Sound</span>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${notificationSettings.sound ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300'}`}>
                {notificationSettings.sound && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            <div
              onClick={() => toggle('vibration')}
              className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                notificationSettings.vibration
                  ? 'border-purple-300 bg-purple-50/50'
                  : 'border-slate-100 bg-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Vibrate className="w-4 h-4 text-pink-600" />
                <span className="text-xs font-bold text-slate-800">Vibration</span>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${notificationSettings.vibration ? 'bg-pink-600 border-pink-600 text-white' : 'border-slate-300'}`}>
                {notificationSettings.vibration && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Saved in local storage</span>
          </div>
          <button
            onClick={() => setIsNotificationSettingsOpen(false)}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
