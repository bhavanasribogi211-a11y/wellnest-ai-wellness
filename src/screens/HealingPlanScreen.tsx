import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  UtensilsCrossed,
  Activity,
  CalendarHeart,
  Apple,
  Sparkles,
  Clock,
  Flame,
  Plus,
  Check,
  Play,
  Pause,
  RotateCcw,
  Printer,
  ChevronRight,
  X,
  Heart,
  ShieldAlert,
  ArrowRight,
  Info,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react';
import {
  INITIAL_RECIPES,
  DIET_KITS,
  EXERCISE_ITEMS,
  WELLNESS_FOODS,
  STORE_PRODUCTS,
} from '../data/initialData';
import { Recipe, ExerciseItem, WellnessFood, PeriodPhase, DailyPeriodLog } from '../types';

export const HealingPlanScreen: React.FC = () => {
  const {
    healingPlanTab,
    setHealingPlanTab,
    userProfile,
    updateUserProfile,
    mealPlan,
    addToMealPlan,
    removeFromMealPlan,
    addToCart,
    periodLogs,
    addOrUpdatePeriodLog,
    currentCycleDay,
    currentPhase,
    estimatedNextPeriodDate,
    daysUntilNextPeriod,
    setCurrentScreen,
    showToast,
  } = useApp();

  // Recipe Modal
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  // Diet Kit Modal
  const [selectedKit, setSelectedKit] = useState<typeof DIET_KITS[0] | null>(null);
  // Exercise Modal & Timer
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Period Tracker States
  const [selectedPhaseDetail, setSelectedPhaseDetail] = useState<PeriodPhase | null>(null);
  const [isDailyLogModalOpen, setIsDailyLogModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Log Form State
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [logFlow, setLogFlow] = useState<DailyPeriodLog['flow']>('Medium');
  const [logMood, setLogMood] = useState<DailyPeriodLog['mood']>('Calm');
  const [logPain, setLogPain] = useState<DailyPeriodLog['pain']>('Mild');
  const [logDischarge, setLogDischarge] = useState<DailyPeriodLog['discharge']>('None');
  const [logSymptoms, setLogSymptoms] = useState<string[]>(['Mild Cramps']);
  const [logNotes, setLogNotes] = useState<string>('');

  // Exercise Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      showToast('🎉 Workout complete! Great job maintaining your body flow.', 'success');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleOpenExercise = (ex: ExerciseItem) => {
    setSelectedExercise(ex);
    setTimerSeconds(ex.durationMinutes * 60);
    setIsTimerRunning(false);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveDailyLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: DailyPeriodLog = {
      date: logDate,
      flow: logFlow,
      mood: logMood,
      pain: logPain,
      discharge: logDischarge,
      symptoms: logSymptoms,
      notes: logNotes,
    };
    addOrUpdatePeriodLog(newLog);
    setIsDailyLogModalOpen(false);
  };

  const toggleSymptom = (sym: string) => {
    setLogSymptoms(prev =>
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  // Phase Info Cards Data
  const phaseDetails: Record<PeriodPhase, {
    title: string;
    days: string;
    color: string;
    badgeBg: string;
    desc: string;
    hormones: string;
    symptoms: string[];
    care: string[];
    exercises: string;
  }> = {
    Menstruation: {
      title: 'Menstruation Phase',
      days: `Days 1 – ${userProfile.periodDuration || 5}`,
      color: 'from-rose-500 to-pink-500',
      badgeBg: 'bg-rose-500 text-white',
      desc: 'The uterine lining sheds as estrogen and progesterone reach their monthly baseline. Energy naturally pauses for restoration.',
      hormones: 'Low Estrogen & Low Progesterone',
      symptoms: ['Lower abdomen cramping', 'Lower back heaviness', 'Fatigue / Desired rest', 'Fluid retention'],
      care: ['Restorative warm broths & chamomile infusion', 'Hot water bottle therapy', 'Gentle breathwork'],
      exercises: 'Rest, gentle stretching, restorative yoga (Supta Baddha Konasana). Avoid heavy HIIT.',
    },
    Follicular: {
      title: 'Follicular Phase',
      days: `Days ${(userProfile.periodDuration || 5) + 1} – 13`,
      color: 'from-purple-500 to-indigo-500',
      badgeBg: 'bg-purple-600 text-white',
      desc: 'Pituitary gland releases FSH; ovarian follicles mature and estrogen begins its vibrant rise. Energy, optimism, and mental sharpness climb.',
      hormones: 'Rising Estrogen & FSH',
      symptoms: ['Elevated stamina', 'Clearer radiant skin', 'Optimistic mood', 'Increased social desire'],
      care: ['Fresh salads, pumpkin seeds, fermented probiotics', 'Brainstorming creative projects', 'Deep hydration'],
      exercises: 'Brisk walking, dynamic strength training, vinyasa yoga, dance cardio.',
    },
    Ovulation: {
      title: 'Ovulation Phase',
      days: 'Days 14 – 16 (Peak)',
      color: 'from-amber-500 to-yellow-500',
      badgeBg: 'bg-amber-500 text-white',
      desc: 'LH surge triggers egg release. Peak estrogen levels give maximum vitality, communication clarity, and high basal metabolic efficiency.',
      hormones: 'Peak LH Surge, Peak Estrogen, Slight Testosterone bump',
      symptoms: ['Mild one-sided pelvic twinge (Mittelschmerz)', 'Watery/egg-white cervical discharge', 'Peak libido & energy'],
      care: ['Cruciferous vegetables (broccoli/kale) to aid estrogen metabolism', 'Antioxidant berries', 'Electrolytes'],
      exercises: 'Peak performance training, interval jogging, strength personal bests.',
    },
    Luteal: {
      title: 'Luteal Phase',
      days: `Days 17 – ${userProfile.cycleLength}`,
      color: 'from-teal-500 to-emerald-500',
      badgeBg: 'bg-teal-600 text-white',
      desc: 'Corpus luteum produces progesterone to nurture the uterine lining. Metabolism speeds up slightly; cravings and inward reflection naturally increase.',
      hormones: 'Dominant Progesterone, Second smaller Estrogen wave',
      symptoms: ['Mild premenstrual breast tenderness', 'Craving warm complex carbs', 'Reflective introverted mood'],
      care: ['Magnesium-dense dark cacao & walnuts', 'Herbal teas', 'Seed cycling (sunflower & sesame)'],
      exercises: 'Pilates, steady walking, gentle resistance training, vagus nerve 4-7-8 relaxation.',
    },
  };

  // Phase color circle angles
  const getPhaseSegmentAngle = (phase: PeriodPhase) => {
    switch (phase) {
      case 'Menstruation': return '0deg';
      case 'Follicular': return '90deg';
      case 'Ovulation': return '180deg';
      case 'Luteal': return '270deg';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-24 pt-4 px-4 max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-purple-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>SC3 • Healing Plan, Diet Lab, Exercise & Period Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
            Your Body Healing Sanctum
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 max-w-xl mt-1 leading-relaxed">
            Synchronize what you eat, how you move, and how you rest with your body's dynamic hormonal cycles.
          </p>
        </div>

        {/* 4 Working Tabs Navigator */}
        <div className="flex bg-white/15 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 gap-1 overflow-x-auto max-w-full">
          {[
            { id: 'diet', label: 'Diet Lab', icon: UtensilsCrossed },
            { id: 'exercise', label: 'Exercise', icon: Activity },
            { id: 'period', label: 'Period Tracker', icon: CalendarHeart },
            { id: 'foods', label: 'Wellness Foods', icon: Apple },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = healingPlanTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setHealingPlanTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-purple-700 shadow-md scale-102'
                    : 'text-purple-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB A: DIET PLAN */}
      {healingPlanTab === 'diet' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Diet Kits Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-800 font-heading">
                  Curated Wellness Diet Kits
                </h2>
                <p className="text-xs text-slate-500">
                  Formulated for specific hormonal targets. Click any kit to inspect full protocol.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DIET_KITS.map(kit => (
                <div
                  key={kit.id}
                  onClick={() => setSelectedKit(kit)}
                  className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-purple-300 shadow-2xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{kit.icon}</span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                        {kit.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 font-heading mt-2 group-hover:text-purple-600 transition-colors">
                      {kit.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {kit.tagline}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">~{kit.caloriesAvg} kcal/day</span>
                    <span className="font-bold text-purple-600 flex items-center gap-1">
                      View Kit <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recipes grouped by meal */}
          <div className="space-y-6">
            {(['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as const).map(meal => {
              const recipes = INITIAL_RECIPES.filter(r => r.mealType === meal);
              return (
                <div key={meal}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-extrabold text-slate-800 font-heading flex items-center gap-2">
                      <span>{meal === 'Breakfast' ? '🌅' : meal === 'Lunch' ? '☀️' : meal === 'Dinner' ? '🌙' : '🍵'}</span>
                      <span>{meal} Recipes</span>
                    </h3>
                    {mealPlan[meal] && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Added to Plan: {mealPlan[meal].name.slice(0, 18)}...
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recipes.map(recipe => (
                      <div
                        key={recipe.id}
                        onClick={() => setSelectedRecipe(recipe)}
                        className="p-4 bg-white rounded-3xl border border-slate-100 shadow-2xs hover:shadow-lg hover:border-purple-200 cursor-pointer transition-all flex flex-col sm:flex-row gap-4 group"
                      >
                        <img
                          src={recipe.image}
                          alt={recipe.name}
                          className="w-full sm:w-32 h-36 rounded-2xl object-cover shrink-0 group-hover:scale-102 transition-transform"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                                {recipe.category}
                              </span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {recipe.prepTime}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 font-heading mt-1.5 group-hover:text-purple-600 transition-colors">
                              {recipe.name}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {recipe.description}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700 flex items-center gap-1">
                              <Flame className="w-3.5 h-3.5 text-amber-500" />
                              {recipe.calories} kcal
                            </span>
                            <span className="font-bold text-purple-600">
                              View Recipe & Ingredients →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Medical Disclaimer notice */}
          <div className="p-3.5 bg-purple-50/70 rounded-2xl border border-purple-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <span>
              <strong>Nutritional Guidance:</strong> Foods and meal suggestions support normal physiological functions. They do not claim to treat, cure, or replace prescribed clinical therapies.
            </span>
          </div>
        </div>
      )}

      {/* TAB B: EXERCISE & TIMERS */}
      {healingPlanTab === 'exercise' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 font-heading">
              Rhythmic Movement & Live Workout Timers
            </h2>
            <p className="text-xs text-slate-500">
              Low-cortisol exercises designed for female bio-rhythms. Tap any exercise to start the guided timer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXERCISE_ITEMS.map(ex => (
              <div
                key={ex.id}
                onClick={() => handleOpenExercise(ex)}
                className="p-4 bg-white rounded-3xl border border-slate-100 shadow-2xs hover:shadow-xl hover:border-pink-300 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative overflow-hidden rounded-2xl mb-3">
                    <img
                      src={ex.image}
                      alt={ex.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {ex.durationMinutes} mins
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {ex.difficulty} Intensity
                    </span>
                  </div>

                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full">
                    {ex.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 font-heading mt-1.5 group-hover:text-pink-600 transition-colors">
                    {ex.title}
                  </h3>
                  <ul className="mt-2 space-y-1 text-xs text-slate-500">
                    {ex.benefits.slice(0, 2).map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5 line-clamp-1">
                        <span className="text-pink-500 font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-pink-600">
                  <span>Start Guided Timer</span>
                  <Play className="w-3.5 h-3.5 fill-pink-600" />
                </div>
              </div>
            ))}
          </div>

          {/* Illustrative Video section clearly labelled demo content */}
          <div className="p-5 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-3xl border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200">
                  Illustrative Video Demonstrations (Simulated / Demo Content)
                </span>
                <h3 className="text-base font-extrabold text-slate-800 font-heading mt-1">
                  Guided Asanas & Marma Point Technique Tutorials
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div
                onClick={() => handleOpenExercise(EXERCISE_ITEMS[0])}
                className="p-3 bg-white rounded-2xl border border-purple-100 flex items-center gap-3 cursor-pointer hover:border-purple-300 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl shrink-0">
                  ▶️
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Supta Baddha Konasana Flow</h4>
                  <p className="text-slate-500 text-[11px]">12 Mins • Pelvic Floor Relaxation & Breath</p>
                </div>
              </div>

              <div
                onClick={() => handleOpenExercise(EXERCISE_ITEMS[2])}
                className="p-3 bg-white rounded-2xl border border-purple-100 flex items-center gap-3 cursor-pointer hover:border-purple-300 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center text-xl shrink-0">
                  ▶️
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Ayurvedic Marma Scalp Kneading</h4>
                  <p className="text-slate-500 text-[11px]">10 Mins • Crown & Temple Microcirculation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB C: PERIOD TRACKER */}
      {healingPlanTab === 'period' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-3xl border border-purple-100 shadow-2xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🌸</span>
                <h2 className="text-lg font-extrabold text-slate-800 font-heading">
                  Dynamic Period & Phasic Rhythm Wheel
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculated dynamically from your actual inputs ({userProfile.lastPeriodDate}, {userProfile.cycleLength} days).
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsDailyLogModalOpen(true)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                Log Daily Symptoms
              </button>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-3 py-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors flex items-center gap-1"
                title="Print / Export Period Report"
              >
                <FileText className="w-3.5 h-3.5" />
                Report
              </button>
            </div>
          </div>

          {/* Interactive Phase Wheel & Current Status */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Interactive 4-Colour Phase Wheel (Left 5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-purple-100 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 mb-2">
                Interactive 4-Colour Phase Wheel (Click segments)
              </span>

              {/* Circular Wheel Graphic */}
              <div className="relative w-56 h-56 my-2 flex items-center justify-center select-none">
                {/* SVG Ring with 4 segments */}
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {/* Menstruation Segment (Rose) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#F43F5E"
                    strokeWidth="14"
                    strokeDasharray="45 195"
                    strokeDashoffset="0"
                    className="cursor-pointer hover:stroke-rose-600 transition-all opacity-90"
                    onClick={() => setSelectedPhaseDetail('Menstruation')}
                  />
                  {/* Follicular Segment (Purple) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="14"
                    strokeDasharray="65 175"
                    strokeDashoffset="-50"
                    className="cursor-pointer hover:stroke-purple-700 transition-all opacity-90"
                    onClick={() => setSelectedPhaseDetail('Follicular')}
                  />
                  {/* Ovulation Segment (Amber) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="14"
                    strokeDasharray="30 210"
                    strokeDashoffset="-120"
                    className="cursor-pointer hover:stroke-amber-600 transition-all opacity-90"
                    onClick={() => setSelectedPhaseDetail('Ovulation')}
                  />
                  {/* Luteal Segment (Teal) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#14B8A6"
                    strokeWidth="14"
                    strokeDasharray="95 145"
                    strokeDashoffset="-155"
                    className="cursor-pointer hover:stroke-teal-600 transition-all opacity-90"
                    onClick={() => setSelectedPhaseDetail('Luteal')}
                  />
                </svg>

                {/* Inner Center Badge */}
                <div
                  onClick={() => setSelectedPhaseDetail(currentPhase)}
                  className="absolute inset-10 rounded-full bg-white shadow-md border border-purple-100 flex flex-col items-center justify-center p-2 cursor-pointer hover:scale-105 transition-transform"
                >
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Cycle Day</span>
                  <span className="text-3xl font-black text-slate-800 font-heading leading-tight">
                    {currentCycleDay}
                  </span>
                  <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-tight">
                    {currentPhase}
                  </span>
                </div>
              </div>

              {/* Clickable phase legend badges */}
              <div className="grid grid-cols-2 gap-2 w-full mt-3 text-xs font-bold">
                <button
                  onClick={() => setSelectedPhaseDetail('Menstruation')}
                  className={`p-2 rounded-xl text-left border flex items-center gap-1.5 transition-all ${
                    currentPhase === 'Menstruation' ? 'bg-rose-50 border-rose-300 text-rose-700' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                  <span>1. Menstruation</span>
                </button>

                <button
                  onClick={() => setSelectedPhaseDetail('Follicular')}
                  className={`p-2 rounded-xl text-left border flex items-center gap-1.5 transition-all ${
                    currentPhase === 'Follicular' ? 'bg-purple-50 border-purple-300 text-purple-700' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
                  <span>2. Follicular</span>
                </button>

                <button
                  onClick={() => setSelectedPhaseDetail('Ovulation')}
                  className={`p-2 rounded-xl text-left border flex items-center gap-1.5 transition-all ${
                    currentPhase === 'Ovulation' ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span>3. Ovulation</span>
                </button>

                <button
                  onClick={() => setSelectedPhaseDetail('Luteal')}
                  className={`p-2 rounded-xl text-left border flex items-center gap-1.5 transition-all ${
                    currentPhase === 'Luteal' ? 'bg-teal-50 border-teal-300 text-teal-700' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0" />
                  <span>4. Luteal</span>
                </button>
              </div>
            </div>

            {/* Current Phase Details & Recommendations (Right 7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${phaseDetails[currentPhase].badgeBg}`}>
                    Active: {phaseDetails[currentPhase].title}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-800 font-heading mt-2">
                    {phaseDetails[currentPhase].desc}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100">
                  <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                    <span>🧬</span> Dominant Hormones:
                  </h4>
                  <p className="text-slate-600">{phaseDetails[currentPhase].hormones}</p>
                </div>

                <div className="p-3 bg-pink-50/50 rounded-2xl border border-pink-100">
                  <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                    <span>🏃‍♀️</span> Recommended Exercise:
                  </h4>
                  <p className="text-slate-600">{phaseDetails[currentPhase].exercises}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2">Self-Care & Nutrition Focus:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {phaseDetails[currentPhase].care.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-medium">
                      ✓ {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Editable Cycle Length in place */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-700">Adjust Cycle Length ({userProfile.cycleLength} Days):</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="range"
                      min="21"
                      max="35"
                      value={userProfile.cycleLength}
                      onChange={e => updateUserProfile({ cycleLength: parseInt(e.target.value) })}
                      className="accent-purple-600 w-36"
                    />
                    <span className="font-extrabold text-purple-700">{userProfile.cycleLength} d</span>
                  </div>
                </div>

                <div className="text-right sm:text-right">
                  <span className="text-[11px] text-slate-400 block">Estimated Next Period:</span>
                  <span className="font-extrabold text-slate-800 text-sm">{estimatedNextPeriodDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Monthly Calendar with Phase Colors & Clickable Dates */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-800 font-heading">
                  Interactive Cycle Calendar
                </h3>
                <p className="text-xs text-slate-500">
                  Click any date to log symptoms or inspect that cycle day.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-[11px] text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Period
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Ovulation
                </span>
              </div>
            </div>

            {/* Calendar Grid (Days 1 to 28/31 demo visual) */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <span key={d} className="font-bold text-slate-400 text-[11px] py-1">{d}</span>
              ))}

              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                const isPeriod = day >= 1 && day <= (userProfile.periodDuration || 5);
                const isOvulation = day >= 13 && day <= 16;
                const isToday = day === currentCycleDay;
                const hasLog = periodLogs.some(l => l.date.endsWith(`-${day < 10 ? '0' + day : day}`));

                return (
                  <button
                    key={day}
                    onClick={() => {
                      setLogDate(`2026-10-${day < 10 ? '0' + day : day}`);
                      setIsDailyLogModalOpen(true);
                    }}
                    className={`p-2 rounded-2xl border transition-all text-center relative focus:outline-hidden ${
                      isToday
                        ? 'border-purple-600 ring-2 ring-purple-300 font-extrabold shadow-xs'
                        : isPeriod
                        ? 'bg-rose-50 border-rose-200 text-rose-700 font-bold'
                        : isOvulation
                        ? 'bg-amber-50 border-amber-200 text-amber-700 font-bold'
                        : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-xs">{day}</span>
                    {hasLog && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mx-auto mt-0.5 block" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Historical Logs List & 6-Month Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 6-Month History Chart with clickable bars */}
            <div className="p-5 bg-white rounded-3xl border border-purple-100 shadow-2xs space-y-3">
              <h3 className="text-sm font-extrabold text-slate-800 font-heading">
                6-Month Cycle Regularity History
              </h3>
              <p className="text-xs text-slate-500">
                Click bars to inspect cycle variances over past 6 recorded cycles.
              </p>

              <div className="flex items-end justify-between h-36 pt-4 pb-2 px-3 border-b border-slate-100">
                {[
                  { month: 'May', len: 28, status: 'Regular' },
                  { month: 'Jun', len: 29, status: 'Regular' },
                  { month: 'Jul', len: 27, status: 'Regular' },
                  { month: 'Aug', len: 31, status: 'Mild delay' },
                  { month: 'Sep', len: 28, status: 'Regular' },
                  { month: 'Oct', len: userProfile.cycleLength, status: 'Predicted' },
                ].map(item => (
                  <div
                    key={item.month}
                    onClick={() => showToast(`${item.month} Cycle: ${item.len} days (${item.status})`, 'info')}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.len}d
                    </span>
                    <div
                      className="w-7 rounded-t-xl bg-gradient-to-t from-purple-500 to-pink-500 group-hover:from-purple-600 group-hover:to-pink-600 transition-all shadow-xs"
                      style={{ height: `${(item.len / 35) * 80}px` }}
                    />
                    <span className="text-xs font-semibold text-slate-500">{item.month}</span>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>Average length: <strong>28.5 Days</strong></span>
                <span className="text-emerald-600 font-bold">Standard 95% Consistency</span>
              </div>
            </div>

            {/* Recent Daily Logs Card */}
            <div className="p-5 bg-white rounded-3xl border border-purple-100 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-800 font-heading">
                  Saved Symptom Logs ({periodLogs.length})
                </h3>
                <button
                  onClick={() => setIsDailyLogModalOpen(true)}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800"
                >
                  + Add Log
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {periodLogs.map(log => (
                  <div
                    key={log.date}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{log.date}</span>
                      <div className="flex gap-2 text-slate-500 text-[11px] mt-0.5">
                        <span>Flow: {log.flow}</span>
                        <span>• Mood: {log.mood}</span>
                        <span>• Pain: {log.pain}</span>
                      </div>
                      {log.notes && (
                        <p className="text-[10px] text-slate-400 italic mt-0.5">"{log.notes}"</p>
                      )}
                    </div>
                    <span className="text-xs font-bold text-purple-600">Saved</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fertility and Irregular Cycle Caution */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Clinical Fertility Disclaimer:</strong> Predicted ovulation and fertility estimates are calculated approximations. They must not be utilized as reliable contraception.
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen('sos')}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0"
            >
              Consult Gynecologist
            </button>
          </div>
        </div>
      )}

      {/* TAB D: WELLNESS FOODS */}
      {healingPlanTab === 'foods' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 font-heading">
              Whole Functional Wellness Foods
            </h2>
            <p className="text-xs text-slate-500">
              Micronutrient-dense staples for cycle phases, skin glow, and follicle strength.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WELLNESS_FOODS.map(food => (
              <div
                key={food.id}
                className="p-4 bg-white rounded-3xl border border-slate-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-36 rounded-2xl object-cover mb-3"
                  />
                  <span className="text-[10px] font-extrabold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                    {food.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 font-heading mt-1.5">
                    {food.name}
                  </h3>

                  <div className="mt-2 text-xs space-y-1">
                    <div className="text-slate-500">
                      <strong>Rich In:</strong> {food.richIn.join(', ')}
                    </div>
                    <div className="text-slate-500">
                      <strong>Serving:</strong> {food.servingSuggestion}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600">{food.calories} kcal/serving</span>
                  <button
                    onClick={() => {
                      showToast(`Added ${food.name} to wellness shopping list!`, 'success');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold transition-colors active:scale-95"
                  >
                    + Add to Grocery List
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECIPE DETAIL MODAL */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setSelectedRecipe(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-purple-100 z-10 animate-in zoom-in-95 duration-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-purple-700 uppercase">{selectedRecipe.mealType} • {selectedRecipe.category}</span>
              <button onClick={() => setSelectedRecipe(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              <img src={selectedRecipe.image} alt={selectedRecipe.name} className="w-full h-44 rounded-2xl object-cover" />
              <h3 className="text-lg font-extrabold text-slate-800 font-heading">{selectedRecipe.name}</h3>
              <p className="text-slate-600">{selectedRecipe.description}</p>

              <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100">
                <h4 className="font-bold text-slate-800 mb-1">Personalized Bio-Match:</h4>
                <p className="text-purple-900">{selectedRecipe.personalizedNote}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2">Ingredients Required:</h4>
                <ul className="space-y-1 text-slate-600 pl-2">
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-purple-600 font-bold">•</span> {ing}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2">Preparation Instructions:</h4>
                <ol className="space-y-1.5 text-slate-600 pl-2">
                  {selectedRecipe.instructions.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-bold text-purple-700">{i + 1}.</span> {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <h4 className="font-bold text-emerald-800 mb-1">Nutritional Advantages:</h4>
                <ul className="space-y-1 text-emerald-900">
                  {selectedRecipe.nutritionalBenefits.map((b, i) => (
                    <li key={i}>✓ {b}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => {
                  addToMealPlan(selectedRecipe);
                  setSelectedRecipe(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add to Meal Plan
              </button>

              <button
                onClick={() => {
                  showToast('Recipe ingredients added to grocery shopping cart! 🛒', 'success');
                  setSelectedRecipe(null);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs transition-colors"
              >
                Order Ingredients (Demo)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXERCISE DETAIL & LIVE TIMER MODAL */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setSelectedExercise(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-100 z-10 animate-in zoom-in-95 duration-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-pink-700 uppercase">{selectedExercise.category}</span>
              <button onClick={() => setSelectedExercise(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              <h3 className="text-lg font-extrabold text-slate-800 font-heading">{selectedExercise.title}</h3>

              {/* Working Live Timer display */}
              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl border border-pink-200 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Interactive Timer</span>
                <span className="text-5xl font-black text-slate-900 font-heading my-2 font-mono">
                  {formatTimer(timerSeconds)}
                </span>

                <div className="flex items-center gap-2 mt-2">
                  {!isTimerRunning ? (
                    <button
                      onClick={() => setIsTimerRunning(true)}
                      className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Start Timer
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsTimerRunning(false)}
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                    >
                      <Pause className="w-3.5 h-3.5" /> Pause
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(selectedExercise.durationMinutes * 60);
                    }}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1.5">Movement Steps:</h4>
                <ol className="space-y-1.5 text-slate-600 pl-2">
                  {selectedExercise.steps.map((st, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-bold text-pink-600">{i + 1}.</span> {st}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-3 bg-pink-50 rounded-2xl border border-pink-100 text-pink-900">
                <strong>Tips:</strong> {selectedExercise.tips}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedExercise(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close Exercise
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DAILY SYMPTOM LOG MODAL */}
      {isDailyLogModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsDailyLogModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 z-10 animate-in zoom-in-95 duration-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-800 font-heading">
                Log Daily Period Symptoms
              </h3>
              <button onClick={() => setIsDailyLogModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDailyLog} className="py-4 space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={logDate}
                  onChange={e => setLogDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Flow Level</label>
                <div className="grid grid-cols-5 gap-1.5 text-center">
                  {(['None', 'Spotting', 'Light', 'Medium', 'Heavy'] as const).map(fl => (
                    <button
                      key={fl}
                      type="button"
                      onClick={() => setLogFlow(fl)}
                      className={`p-2 rounded-xl border font-bold ${
                        logFlow === fl ? 'bg-rose-50 border-rose-400 text-rose-700' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {fl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Mood</label>
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  {(['Calm', 'Happy', 'Energetic', 'Anxious', 'Irritable', 'Tired', 'Sad'] as const).map(md => (
                    <button
                      key={md}
                      type="button"
                      onClick={() => setLogMood(md)}
                      className={`p-1.5 rounded-xl border font-bold ${
                        logMood === md ? 'bg-purple-50 border-purple-400 text-purple-700' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {md}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Pain / Cramp Intensity</label>
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  {(['None', 'Mild', 'Moderate', 'Severe'] as const).map(pn => (
                    <button
                      key={pn}
                      type="button"
                      onClick={() => setLogPain(pn)}
                      className={`p-2 rounded-xl border font-bold ${
                        logPain === pn ? 'bg-rose-50 border-rose-400 text-rose-700' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {pn}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Symptoms (Select any)</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Cramps', 'Bloating', 'Headache', 'Backache', 'Tender Breasts', 'Acne', 'Insomnia', 'Food Cravings'].map(sym => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${
                        logSymptoms.includes(sym) ? 'bg-pink-50 border-pink-400 text-pink-700' : 'border-slate-200'
                      }`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Optional Notes</label>
                <textarea
                  value={logNotes}
                  onChange={e => setLogNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Hot compress helped, craving warm oatmeal"
                  className="w-full p-2.5 rounded-xl border border-slate-200 resize-none font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDailyLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPORT / PRINT REPORT MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsReportModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-purple-100 z-10 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-extrabold text-slate-800 font-heading">
                  WellNest Cycle Wellness Summary Report
                </h3>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 print:space-y-2">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">Patient / User:</span>
                  <span className="text-slate-900 font-bold">{userProfile.name} (Age {userProfile.age})</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">Current Phase:</span>
                  <span className="text-purple-700 font-bold">{currentPhase} (Day {currentCycleDay})</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">Cycle Baseline:</span>
                  <span>{userProfile.cycleLength} days ({userProfile.cycleRegularity})</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">Estimated Next Period:</span>
                  <span className="text-rose-700 font-bold">{estimatedNextPeriodDate}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Recent 3 Recorded Logs:</h4>
                <div className="space-y-1.5">
                  {periodLogs.slice(0, 3).map((l, i) => (
                    <div key={i} className="p-2 rounded-xl bg-purple-50/40 border border-purple-100 text-[11px]">
                      <strong>{l.date}:</strong> Flow: {l.flow}, Mood: {l.mood}, Pain: {l.pain} | {l.notes || 'None'}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
                Note: This record is generated for patient lifestyle tracking and doctor discussion. It is not an automated medical prescription.
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
