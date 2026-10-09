import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  Activity,
  Sparkles,
  Calendar,
  MapPin,
  Save,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { UserProfile } from '../../types';

export const ProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    userProfile,
    updateUserProfile,
    calculateBmi,
    showToast,
  } = useApp();

  const [formData, setFormData] = useState<UserProfile>({ ...userProfile });
  const [activeTab, setActiveTab] = useState<'body' | 'hairskin' | 'cycle' | 'location'>('body');

  if (!isProfileModalOpen) return null;

  // Realtime BMI preview
  const { bmi, category } = calculateBmi(formData.heightCm, formData.weightKg);

  const cmToFtIn = (cm: number) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  };

  const handleHairConcernToggle = (c: string) => {
    setFormData(prev => ({
      ...prev,
      hairConcerns: prev.hairConcerns.includes(c)
        ? prev.hairConcerns.filter(item => item !== c)
        : [...prev.hairConcerns, c],
    }));
  };

  const handleSkinConcernToggle = (c: string) => {
    setFormData(prev => ({
      ...prev,
      skinConcerns: prev.skinConcerns.includes(c)
        ? prev.skinConcerns.filter(item => item !== c)
        : [...prev.skinConcerns, c],
    }));
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'warning');
      return;
    }
    showToast('Requesting GPS location...', 'info');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            isDetected: true,
          },
        }));
        showToast('Location coordinates detected!', 'success');
      },
      err => {
        showToast('Location access denied or unavailable. Manual entry active.', 'warning');
      }
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      ...formData,
      bmi,
      bmiCategory: category,
      hasCompletedOnboarding: true,
    });
    showToast('Wellness profile updated successfully! 🌸', 'success');
    setIsProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        onClick={() => setIsProfileModalOpen(false)}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-purple-100 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              👤
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800 font-heading">
                Wellness Profile & Body Metrics
              </h3>
              <p className="text-xs text-slate-500">Personalized health baseline</p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-100 gap-1 mt-2 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'body', label: 'Body & BMI' },
            { id: 'hairskin', label: 'Skin & Hair' },
            { id: 'cycle', label: 'Cycle & Hormones' },
            { id: 'location', label: 'Emergency Location' },
          ].map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`py-2 px-3 border-b-2 whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? 'border-purple-600 text-purple-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs">
          {activeTab === 'body' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min="14"
                    max="85"
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) || 25 })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Height Slider */}
              <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-700">Height:</span>
                  <span className="text-purple-700 text-sm">
                    {formData.heightCm} cm ({cmToFtIn(formData.heightCm)})
                  </span>
                </div>
                <input
                  type="range"
                  min="140"
                  max="195"
                  value={formData.heightCm}
                  onChange={e => setFormData({ ...formData, heightCm: parseInt(e.target.value) })}
                  className="w-full accent-purple-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>140 cm (4'7")</span>
                  <span>195 cm (6'5")</span>
                </div>
              </div>

              {/* Weight Slider */}
              <div className="p-3 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-2">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-700">Weight:</span>
                  <span className="text-pink-700 text-sm">{formData.weightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="130"
                  value={formData.weightKg}
                  onChange={e => setFormData({ ...formData, weightKg: parseInt(e.target.value) })}
                  className="w-full accent-pink-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>30 kg</span>
                  <span>130 kg</span>
                </div>
              </div>

              {/* Live BMI Card */}
              <div className="p-3.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700">
                    Live Body Mass Index
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black text-slate-900 font-heading">{bmi}</span>
                    <span className="font-bold text-xs text-purple-800">{category}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 max-w-[200px] text-right">
                  Calculated automatically: kg / (m)². General wellness reference only.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hairskin' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Skin Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Combination', 'Oily', 'Dry', 'Normal', 'Sensitive'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFormData({ ...formData, skinType: st })}
                      className={`p-2 rounded-xl border text-center font-bold transition-all ${
                        formData.skinType === st
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Skin Concerns (Select all that apply)</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Occasional Breakouts', 'Uneven Tone', 'Dark Circles', 'Dryness / Flaking', 'Open Pores', 'Redness / Sensitivity'].map(sc => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => handleSkinConcernToggle(sc)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                        formData.skinConcerns.includes(sc)
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {sc}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-700 mb-1.5">Hair Texture</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Straight', 'Wavy', 'Curly', 'Coily'] as const).map(ht => (
                    <button
                      key={ht}
                      type="button"
                      onClick={() => setFormData({ ...formData, hairType: ht })}
                      className={`p-2 rounded-xl border text-center font-bold transition-all ${
                        formData.hairType === ht
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {ht}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Scalp Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Oily', 'Dry', 'Normal', 'Sensitive', 'Combination'] as const).map(sct => (
                    <button
                      key={sct}
                      type="button"
                      onClick={() => setFormData({ ...formData, scalpType: sct })}
                      className={`p-2 rounded-xl border text-center font-bold transition-all ${
                        formData.scalpType === sct
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {sct}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Hair Concerns</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Hair Fall', 'Frizz & Flyaways', 'Dandruff / Flakes', 'Slow Growth', 'Split Ends', 'Scalp Itchiness'].map(hc => (
                    <button
                      key={hc}
                      type="button"
                      onClick={() => handleHairConcernToggle(hc)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                        formData.hairConcerns.includes(hc)
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {hc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cycle' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Last Period Start Date</label>
                  <input
                    type="date"
                    value={formData.lastPeriodDate}
                    onChange={e => setFormData({ ...formData, lastPeriodDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Cycle Length ({formData.cycleLength} days)
                  </label>
                  <input
                    type="range"
                    min="21"
                    max="35"
                    value={formData.cycleLength}
                    onChange={e => setFormData({ ...formData, cycleLength: parseInt(e.target.value) })}
                    className="w-full accent-purple-600 mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>21 days</span>
                    <span>35 days</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Cycle Regularity</label>
                  <select
                    value={formData.cycleRegularity}
                    onChange={e => setFormData({ ...formData, cycleRegularity: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium bg-white"
                  >
                    <option value="Regular">Regular (Consistent 28-30 days)</option>
                    <option value="Occasionally Irregular">Occasionally Irregular</option>
                    <option value="Irregular">Irregular</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Typical Flow</label>
                  <select
                    value={formData.flow}
                    onChange={e => setFormData({ ...formData, flow: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium bg-white"
                  >
                    <option value="Light">Light</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Heavy">Heavy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">General Mood / Energy</label>
                <input
                  type="text"
                  value={formData.mood}
                  onChange={e => setFormData({ ...formData, mood: e.target.value })}
                  placeholder="e.g. Calm, Productive, Mild PMS cramps"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium"
                />
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">GPS / Area Details</span>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  Detect GPS
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Area / Landmark</label>
                <input
                  type="text"
                  value={formData.location.area}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, area: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium"
                  placeholder="e.g. Indiranagar 100ft Road"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Street Address</label>
                <textarea
                  value={formData.location.fullAddress}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, fullAddress: e.target.value },
                    })
                  }
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium resize-none"
                  placeholder="Flat / Building, Cross street"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.location.pincode}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, pincode: e.target.value },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium"
                    placeholder="e.g. 560038"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nearby Landmark</label>
                  <input
                    type="text"
                    value={formData.location.landmark}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, landmark: e.target.value },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium"
                    placeholder="e.g. Near Metro Station"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <Info className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Predictions are wellness insights, not medical diagnoses.</span>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
