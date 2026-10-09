import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NestyMascot } from '../components/common/NestyMascot';
import {
  Sparkles,
  CalendarHeart,
  Activity,
  Heart,
  Droplet,
  UtensilsCrossed,
  ShieldAlert,
  ShoppingBag,
  ArrowRight,
  Info,
  X,
  ChevronRight,
  TrendingUp,
  Smile,
  AlertTriangle,
  Scale,
  Sparkle,
} from 'lucide-react';
import { PeriodPhase } from '../types';

interface PredictionDetailModalProps {
  type: 'hormonal' | 'skin' | 'hair' | 'bmi' | 'cycle' | null;
  onClose: () => void;
}

export const DashboardScreen: React.FC = () => {
  const {
    userProfile,
    currentCycleDay,
    currentPhase,
    daysUntilNextPeriod,
    estimatedNextPeriodDate,
    setCurrentScreen,
    setHealingPlanTab,
    waterGlassesToday,
    incrementWater,
    setIsProfileModalOpen,
  } = useApp();

  const [activeModal, setActiveModal] = useState<'hormonal' | 'skin' | 'hair' | 'bmi' | 'cycle' | null>(null);

  // Phase color mapping
  const phaseColors: Record<PeriodPhase, { bg: string; text: string; border: string }> = {
    Menstruation: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    Follicular: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    Ovulation: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    Luteal: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-24 pt-4 px-4 max-w-6xl mx-auto space-y-6">
      {/* Top Greeting & Mascot Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-52 h-52 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-40 h-40 rounded-full bg-pink-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>SC2 • Personalized Prediction Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Hello, {userProfile.name ? userProfile.name.split(' ')[0] : 'Wellness Friend'} 🌸
            </h1>
            <p className="text-xs sm:text-sm text-purple-100 font-medium max-w-xl mt-1 leading-relaxed">
              You are currently on <strong>Day {currentCycleDay}</strong> of your cycle ({currentPhase} Phase).
              Nesty analyzed your {userProfile.skinType} skin, {userProfile.hairType} hair, and BMI {userProfile.bmi}.
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-4 justify-center sm:justify-start">
              <button
                onClick={() => {
                  setHealingPlanTab('period');
                  setCurrentScreen('healing-plan');
                }}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <CalendarHeart className="w-3.5 h-3.5 text-pink-200" />
                {daysUntilNextPeriod} days to next period
              </button>

              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-xs font-bold transition-all"
              >
                Edit Metrics ⚙️
              </button>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center">
            <NestyMascot
              mood="happy"
              size="lg"
              showSpeechBubble={true}
              bubbleText="Tap any card below for deep insights! 🐣"
              onClick={() => setActiveModal('hormonal')}
            />
          </div>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Cycle Phase */}
        <div
          onClick={() => setActiveModal('cycle')}
          className="p-4 bg-white rounded-2xl border border-purple-100 shadow-2xs hover:shadow-md hover:border-purple-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Cycle Phase</span>
            <span className="text-base">🌙</span>
          </div>
          <div className="mt-2">
            <span className={`inline-block text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${phaseColors[currentPhase].bg} ${phaseColors[currentPhase].text} ${phaseColors[currentPhase].border}`}>
              {currentPhase}
            </span>
            <p className="text-xs text-slate-600 font-bold mt-1">Day {currentCycleDay} of {userProfile.cycleLength}</p>
          </div>
        </div>

        {/* Metric 2: Live BMI */}
        <div
          onClick={() => setActiveModal('bmi')}
          className="p-4 bg-white rounded-2xl border border-purple-100 shadow-2xs hover:shadow-md hover:border-purple-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Body Mass Index</span>
            <Scale className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-extrabold text-slate-800 font-heading">{userProfile.bmi}</span>
            <p className="text-[11px] text-emerald-600 font-bold truncate">{userProfile.bmiCategory}</p>
          </div>
        </div>

        {/* Metric 3: Water Tracker */}
        <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Hydration Today</span>
            <Droplet className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="text-lg font-extrabold text-blue-600 font-heading">{waterGlassesToday} / 8</span>
              <span className="text-[10px] text-slate-400 block font-medium">Glasses</span>
            </div>
            <button
              onClick={incrementWater}
              className="px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs transition-colors active:scale-95 shadow-2xs"
              title="Add 1 glass of water"
            >
              + 1 Glass
            </button>
          </div>
        </div>

        {/* Metric 4: Emergency Radius */}
        <div
          onClick={() => setCurrentScreen('sos')}
          className="p-4 bg-white rounded-2xl border border-rose-100 shadow-2xs hover:shadow-md hover:border-rose-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Emergency SOS</span>
            <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <div className="mt-2">
            <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              3 Hospitals Active
            </span>
            <p className="text-[11px] text-slate-500 truncate mt-1">{userProfile.location?.area || 'Indiranagar'}</p>
          </div>
        </div>
      </div>

      {/* Main Section: 5 Detailed Prediction Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 font-heading">
              Personalized Wellness Predictions
            </h2>
            <p className="text-xs text-slate-500">
              Generated from your baseline metrics. Click each card to reveal full clinical & lifestyle actions.
            </p>
          </div>
          <span className="text-xs text-purple-600 font-bold hidden sm:inline">
            5 Active Insights
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Hormonal Wellness Insights */}
          <div
            onClick={() => setActiveModal('hormonal')}
            className="p-5 bg-white rounded-3xl border border-purple-100 shadow-sm hover:shadow-xl hover:border-purple-300 cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  Hormones & Rhythm
                </span>
                <span className="text-2xl group-hover:scale-110 transition-transform">🌸</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-800 font-heading mt-3 group-hover:text-purple-600 transition-colors">
                Estrogen-Progesterone Dynamics
              </h3>
              <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                As you enter Day {currentCycleDay} ({currentPhase} phase), progesterone transitions naturally. Recommended: phytoestrogen-rich seed cycling and magnesium to stabilize mood.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
              <span>View Diet & Hormone Protocol</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Skin Wellness Insights */}
          <div
            onClick={() => setActiveModal('skin')}
            className="p-5 bg-white rounded-3xl border border-pink-100 shadow-sm hover:shadow-xl hover:border-pink-300 cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-700 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200">
                  Dermal Barrier
                </span>
                <span className="text-2xl group-hover:scale-110 transition-transform">✨</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-800 font-heading mt-3 group-hover:text-pink-600 transition-colors">
                {userProfile.skinType} Skin & Breakout Defense
              </h3>
              <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                Your stated concern: {userProfile.skinConcerns.join(', ')}. In the {currentPhase} phase, skin lipid layers benefit from light ceramides and zinc to prevent pore congestion.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-pink-600">
              <span>Explore Skin Products & Foods</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Hair and Scalp Wellness */}
          <div
            onClick={() => setActiveModal('hair')}
            className="p-5 bg-white rounded-3xl border border-emerald-100 shadow-sm hover:shadow-xl hover:border-emerald-300 cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Follicle Vitality
                </span>
                <span className="text-2xl group-hover:scale-110 transition-transform">🌿</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-800 font-heading mt-3 group-hover:text-emerald-600 transition-colors">
                {userProfile.hairType} Hair & {userProfile.scalpType} Scalp
              </h3>
              <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                Concerns: {userProfile.hairConcerns.join(', ')}. Redensyl peptides, rosemary marma point scalp massage, and dietary biotin nourish the follicular bulb.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>View Scalp Massage & Care</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: BMI and Nutrition */}
          <div
            onClick={() => setActiveModal('bmi')}
            className="p-5 bg-white rounded-3xl border border-indigo-100 shadow-sm hover:shadow-xl hover:border-indigo-300 cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                  Metabolic Index
                </span>
                <span className="text-2xl group-hover:scale-110 transition-transform">⚖️</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-800 font-heading mt-3 group-hover:text-indigo-600 transition-colors">
                BMI {userProfile.bmi} • {userProfile.bmiCategory}
              </h3>
              <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                Height {userProfile.heightCm} cm, Weight {userProfile.weightKg} kg. Stable insulin curve is maintained with slow-digesting oats, chickpeas, and rainbow bowls from Diet Lab.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
              <span>Open Personalized Diet Lab</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Period and Cycle Tracking */}
          <div
            onClick={() => setActiveModal('cycle')}
            className="p-5 bg-white rounded-3xl border border-rose-100 shadow-sm hover:shadow-xl hover:border-rose-300 cursor-pointer transition-all group flex flex-col justify-between md:col-span-2 lg:col-span-1"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  Cyclic Forecast
                </span>
                <span className="text-2xl group-hover:scale-110 transition-transform">🩸</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-800 font-heading mt-3 group-hover:text-rose-600 transition-colors">
                Next Period: {estimatedNextPeriodDate}
              </h3>
              <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                {daysUntilNextPeriod} days remaining until your predicted period start. Interactive 4-phase wheel, symptom logging, and pelvic relaxation exercises ready.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-600">
              <span>Open Period Tracker & Logs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards into SC3, SC4, SC5, SC6 */}
      <div className="p-5 bg-slate-50/80 rounded-3xl border border-slate-100 space-y-3">
        <h3 className="text-sm font-extrabold text-slate-700 font-heading">
          Explore Connected Modules
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <button
            onClick={() => {
              setHealingPlanTab('diet');
              setCurrentScreen('healing-plan');
            }}
            className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xs flex flex-col items-center text-center transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg mb-2 group-hover:scale-110 transition-transform">
              🥗
            </div>
            <span className="font-bold text-slate-800">Diet Lab</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Meal plans & recipes</span>
          </button>

          <button
            onClick={() => {
              setHealingPlanTab('exercise');
              setCurrentScreen('healing-plan');
            }}
            className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xs flex flex-col items-center text-center transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center text-lg mb-2 group-hover:scale-110 transition-transform">
              🧘
            </div>
            <span className="font-bold text-slate-800">Exercise Timers</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Yoga & massage</span>
          </button>

          <button
            onClick={() => setCurrentScreen('sos')}
            className="p-3 rounded-2xl bg-white border border-rose-200 hover:border-rose-400 hover:shadow-xs flex flex-col items-center text-center transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg mb-2 group-hover:scale-110 transition-transform">
              🏥
            </div>
            <span className="font-bold text-rose-700">Emergency SOS</span>
            <span className="text-[10px] text-rose-400 mt-0.5">Doctors & transport</span>
          </button>

          <button
            onClick={() => setCurrentScreen('store')}
            className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xs flex flex-col items-center text-center transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mb-2 group-hover:scale-110 transition-transform">
              🛍️
            </div>
            <span className="font-bold text-slate-800">Well Store</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Organic essentials</span>
          </button>
        </div>
      </div>

      {/* Detailed Modal for Predictions */}
      {activeModal && (
        <PredictionDetailModal
          type={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};

// Detailed Prediction Modal
const PredictionDetailModal: React.FC<PredictionDetailModalProps> = ({ type, onClose }) => {
  const {
    userProfile,
    currentPhase,
    currentCycleDay,
    setCurrentScreen,
    setHealingPlanTab,
  } = useApp();

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" />

      <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-purple-100 z-10 animate-in zoom-in-95 duration-200 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg">
              {type === 'hormonal' && '🌸'}
              {type === 'skin' && '✨'}
              {type === 'hair' && '🌿'}
              {type === 'bmi' && '⚖️'}
              {type === 'cycle' && '🩸'}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800 font-heading">
                {type === 'hormonal' && 'Hormonal Wellness Insights'}
                {type === 'skin' && 'Skin Wellness & Barrier Analysis'}
                {type === 'hair' && 'Hair & Scalp Microcirculation'}
                {type === 'bmi' && 'Body Composition & Metabolic Health'}
                {type === 'cycle' && 'Menstrual Cycle & Phasic Rhythm'}
              </h3>
              <p className="text-[11px] text-slate-500">Personalized for {userProfile.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Explanation based on profile */}
          <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-2">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Detailed Bio-Evaluation
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {type === 'hormonal' && `Your 28-day rhythm is currently in Day ${currentCycleDay} (${currentPhase} phase). In this phase, circulating hormones signal uterine tissue preparation. Lignans from flaxseed and pumpkin seeds gently support healthy estrogen clearance.`}
              {type === 'skin' && `Configured for ${userProfile.skinType} skin with concerns: ${userProfile.skinConcerns.join(', ')}. The skin's outer stratum corneum lipid barrier responds well to ceramide-rich moisturizers and gentle non-foaming hydrators.`}
              {type === 'hair' && `Configured for ${userProfile.hairType} hair on a ${userProfile.scalpType} scalp with reported ${userProfile.hairConcerns.join(', ')}. Washing ${userProfile.hairWashFrequency} keeps sebum balance optimal without over-drying delicate ends.`}
              {type === 'bmi' && `Height: ${userProfile.heightCm} cm, Weight: ${userProfile.weightKg} kg resulting in BMI ${userProfile.bmi} (${userProfile.bmiCategory}). Satiety is highest when meals combine complex carbohydrates with 20g+ clean protein.`}
              {type === 'cycle' && `Cycle regularity: ${userProfile.cycleRegularity}. Recorded flow: ${userProfile.flow}. Dynamically tracking your 4 phases ensures nutrition and exercise align with natural energy peaks and valleys.`}
            </p>
          </div>

          {/* Recommendations */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-xs">Actionable Recommendations:</h4>
            <ul className="space-y-1.5 text-slate-600 pl-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Incorporate bioavailable zinc & magnesium snacks during late afternoons.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Engage in gentle parasympathetic breathing (4-7-8) to reduce cortisol spikes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Keep daily water intake at 8 glasses to maintain cellular perfusion.</span>
              </li>
            </ul>
          </div>

          {/* Caution box */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-relaxed">
              <strong>Medical Disclaimer:</strong> This algorithm generates general wellness insights for lifestyle guidance only. It is not a clinical medical diagnosis for PCOS, endometriosis, or thyroid disorders. Please consult registered healthcare practitioners for medical concerns.
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex gap-2">
            <button
              onClick={() => {
                onClose();
                setHealingPlanTab('diet');
                setCurrentScreen('healing-plan');
              }}
              className="px-3 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs transition-colors"
            >
              Open Diet Lab 🥗
            </button>
            <button
              onClick={() => {
                onClose();
                setCurrentScreen('store');
              }}
              className="px-3 py-2 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 font-bold text-xs transition-colors"
            >
              View Essentials 🛍️
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              setCurrentScreen('sos');
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1"
          >
            Consult Doctor 🩺
          </button>
        </div>
      </div>
    </div>
  );
};
