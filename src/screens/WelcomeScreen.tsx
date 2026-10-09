import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NestyMascot } from '../components/common/NestyMascot';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Heart,
  Scale,
  Calendar,
  Layers,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WelcomeScreen: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    calculateBmi,
    setCurrentScreen,
    showToast,
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Local form state initialized from current profile
  const [name, setName] = useState(userProfile.name || '');
  const [age, setAge] = useState<number>(userProfile.age || 26);
  const [heightCm, setHeightCm] = useState<number>(userProfile.heightCm || 165);
  const [weightKg, setWeightKg] = useState<number>(userProfile.weightKg || 58);

  const [scalpType, setScalpType] = useState(userProfile.scalpType || 'Combination');
  const [hairType, setHairType] = useState(userProfile.hairType || 'Wavy');
  const [hairConcerns, setHairConcerns] = useState<string[]>(userProfile.hairConcerns || ['Hair Fall']);
  const [hairWashFrequency, setHairWashFrequency] = useState(userProfile.hairWashFrequency || 'Twice a week');

  const [skinType, setSkinType] = useState(userProfile.skinType || 'Combination');
  const [skinConcerns, setSkinConcerns] = useState<string[]>(userProfile.skinConcerns || ['Occasional Breakouts']);

  const [lastPeriodDate, setLastPeriodDate] = useState(userProfile.lastPeriodDate || '2026-09-24');
  const [cycleRegularity, setCycleRegularity] = useState(userProfile.cycleRegularity || 'Regular');
  const [cycleLength, setCycleLength] = useState<number>(userProfile.cycleLength || 28);
  const [flow, setFlow] = useState(userProfile.flow || 'Moderate');
  const [mood, setMood] = useState(userProfile.mood || 'Calm & Focused');

  const [area, setArea] = useState(userProfile.location?.area || 'Indiranagar 100ft Road');
  const [landmark, setLandmark] = useState(userProfile.location?.landmark || 'Near Metro Station');
  const [fullAddress, setFullAddress] = useState(userProfile.location?.fullAddress || 'Flat 402, Green Orchid Apartments, 12th Main, Indiranagar');
  const [pincode, setPincode] = useState(userProfile.location?.pincode || '560038');
  const [isGpsActive, setIsGpsActive] = useState(userProfile.location?.isDetected || false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Live BMI calculation
  const { bmi, category: bmiCategory } = calculateBmi(heightCm, weightKg);

  const cmToFtIn = (cm: number) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  };

  const handleToggleHairConcern = (item: string) => {
    setHairConcerns(prev =>
      prev.includes(item) ? prev.filter(c => c !== item) : [...prev, item]
    );
  };

  const handleToggleSkinConcern = (item: string) => {
    setSkinConcerns(prev =>
      prev.includes(item) ? prev.filter(c => c !== item) : [...prev, item]
    );
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'warning');
      return;
    }
    showToast('Locating your area securely...', 'info');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsGpsActive(true);
        showToast('GPS coordinates acquired! (Latitude / Longitude attached)', 'success');
      },
      err => {
        showToast('Location permission unavailable. Manual address entry active.', 'info');
      }
    );
  };

  const handleFinishOnboarding = () => {
    // Validate
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Please provide your name';
    if (!area.trim()) errs.area = 'Please provide your area / city';
    if (!pincode.trim()) errs.pincode = 'Pincode is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast('Please check required fields highlighted in red', 'warning');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      updateUserProfile({
        name: name.trim(),
        age,
        heightCm,
        weightKg,
        bmi,
        bmiCategory,
        scalpType,
        hairType,
        hairConcerns,
        hairWashFrequency,
        skinType,
        skinConcerns,
        lastPeriodDate,
        cycleRegularity,
        cycleLength,
        periodDuration: 5,
        flow,
        mood,
        location: {
          area,
          landmark,
          fullAddress,
          pincode,
          isDetected: isGpsActive,
        },
        hasCompletedOnboarding: true,
      });

      setIsLoading(false);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      showToast(`Welcome to WellNest, ${name}! 🐣`, 'success');
      setCurrentScreen('dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-24 pt-6 px-4 max-w-4xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-700 text-white p-6 sm:p-10 shadow-xl mb-8">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-64 h-64 rounded-full bg-pink-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>SC1 • Personal Wellness Profile</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight leading-tight">
              Welcome to WellNest
            </h1>
            <p className="text-sm sm:text-base text-purple-100 font-medium max-w-lg mt-2">
              Meet Nesty 🐣 Your 24/7 Wellness Companion. Personalizing your prediction dashboard, hormonal diet, workout timers, and care directory.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => {
                  updateUserProfile({ hasCompletedOnboarding: true });
                  setCurrentScreen('dashboard');
                  showToast('Previewing Dashboard with sample profile', 'info');
                }}
                className="text-xs font-bold bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-white/20 transition-all"
              >
                Explore All Features Directly ⚡
              </button>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center">
            <NestyMascot
              mood="wave"
              size="lg"
              showSpeechBubble={true}
              bubbleText="Let's personalize your nest! 🌸"
            />
          </div>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center justify-between max-w-xl mx-auto mb-6 px-2">
        {[
          { num: 1, label: 'Body Metrics' },
          { num: 2, label: 'Skin & Hair' },
          { num: 3, label: 'Cycle & Hormones' },
          { num: 4, label: 'SOS Address' },
        ].map(s => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className="flex flex-col items-center group focus:outline-hidden"
          >
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs transition-all ${
                step === s.num
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md shadow-purple-500/25 ring-2 ring-purple-300 scale-105'
                  : step > s.num
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> : s.num}
            </div>
            <span
              className={`text-[11px] font-semibold mt-1 hidden sm:block ${
                step === s.num ? 'text-purple-700 font-bold' : 'text-slate-400'
              }`}
            >
              {s.label}
            </span>
          </button>
        ))}
      </div>

      {/* Card Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100 relative">
        {/* Step 1: Body Metrics */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 font-heading">
                Step 1: Your Baseline & Body Metrics
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Used to compute your live BMI and baseline caloric distribution.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="e.g. Aanya Sharma"
                  className={`w-full p-3 rounded-2xl border ${
                    errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  } focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-800 font-medium text-sm`}
                />
                {errors.name && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Age (Years)
                </label>
                <input
                  type="number"
                  min="14"
                  max="85"
                  value={age}
                  onChange={e => setAge(parseInt(e.target.value) || 25)}
                  className="w-full p-3 rounded-2xl border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-800 font-medium text-sm"
                />
              </div>
            </div>

            {/* Height Slider */}
            <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
              <div className="flex justify-between items-center font-bold text-xs">
                <span className="text-slate-700">Height:</span>
                <span className="text-purple-700 text-sm font-extrabold font-heading">
                  {heightCm} cm ({cmToFtIn(heightCm)})
                </span>
              </div>
              <input
                type="range"
                min="140"
                max="180"
                value={heightCm}
                onChange={e => setHeightCm(parseInt(e.target.value))}
                className="w-full accent-purple-600 h-2 bg-purple-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>140 cm (4'7")</span>
                <span>180 cm (5'11")</span>
              </div>
            </div>

            {/* Weight Slider */}
            <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-2">
              <div className="flex justify-between items-center font-bold text-xs">
                <span className="text-slate-700">Weight:</span>
                <span className="text-pink-700 text-sm font-extrabold font-heading">
                  {weightKg} kg
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="120"
                value={weightKg}
                onChange={e => setWeightKg(parseInt(e.target.value))}
                className="w-full accent-pink-600 h-2 bg-pink-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>30 kg</span>
                <span>120 kg</span>
              </div>
            </div>

            {/* Live BMI informational Card */}
            <div className="p-4 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-transparent rounded-2xl border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                  Live Computed BMI
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-slate-900 font-heading">
                    {bmi}
                  </span>
                  <span className="text-xs font-bold text-purple-800 bg-white/80 px-2 py-0.5 rounded-lg border border-purple-200">
                    {bmiCategory}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
                  Formula: {weightKg} kg / ({heightCm / 100}m)² = {bmi}. This is a general wellness metric, not a clinical diagnostic assessment.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white shadow-2xs border border-purple-100 text-[11px] text-slate-600 max-w-xs">
                💡 <strong>Nesty Tip:</strong> Standard range for adult women is 18.5 – 24.9. Maintaining consistent protein and fiber stabilizes your metabolic rate.
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-95"
              >
                Continue to Skin & Hair
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Skin & Hair */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 font-heading">
                Step 2: Skin & Scalp Wellness
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Customizes topical product recommendations in the Well Store and dietary antioxidants.
              </p>
            </div>

            {/* Scalp Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Scalp Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['Oily', 'Dry', 'Normal', 'Sensitive', 'Combination'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setScalpType(type)}
                    className={`p-2.5 rounded-2xl border text-xs font-bold transition-all ${
                      scalpType === type
                        ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Hair Texture
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Straight', 'Wavy', 'Curly', 'Coily'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setHairType(type)}
                    className={`p-2.5 rounded-2xl border text-xs font-bold transition-all ${
                      hairType === type
                        ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Concerns */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Hair Concerns (Select all applicable)
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Hair Fall',
                  'Frizz & Flyaways',
                  'Dandruff / Flakes',
                  'Dry Brittle Ends',
                  'Slow Growth',
                  'Scalp Sensitivity',
                ].map(concern => (
                  <button
                    key={concern}
                    type="button"
                    onClick={() => handleToggleHairConcern(concern)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                      hairConcerns.includes(concern)
                        ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {concern}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Wash Frequency */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Hair Wash Frequency
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Daily', 'Twice a week', '3 times a week', 'Once a week'].map(freq => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setHairWashFrequency(freq)}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                      hairWashFrequency === freq
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Type */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Skin Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['Combination', 'Oily', 'Dry', 'Normal', 'Sensitive'] as const).map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSkinType(st)}
                    className={`p-2.5 rounded-2xl border text-xs font-bold transition-all ${
                      skinType === st
                        ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Concerns */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Skin Concerns
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Occasional Breakouts',
                  'Uneven Tone',
                  'Dark Circles',
                  'Dryness / Flaking',
                  'Enlarged Pores',
                  'Redness / Rosacea',
                ].map(concern => (
                  <button
                    key={concern}
                    type="button"
                    onClick={() => handleToggleSkinConcern(concern)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                      skinConcerns.includes(concern)
                        ? 'border-pink-500 bg-pink-50 text-pink-700 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {concern}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-95"
              >
                Continue to Cycle & Hormones
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Cycle & Hormones */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 font-heading">
                Step 3: Menstrual Cycle & Hormone Rhythm
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enables dynamic calculation of your 4 phases: Menstruation, Follicular, Ovulation, and Luteal.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Last Period Start Date
                </label>
                <input
                  type="date"
                  value={lastPeriodDate}
                  onChange={e => setLastPeriodDate(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-200 focus:border-purple-500 text-slate-800 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cycle Length ({cycleLength} Days)
                </label>
                <input
                  type="range"
                  min="21"
                  max="35"
                  value={cycleLength}
                  onChange={e => setCycleLength(parseInt(e.target.value))}
                  className="w-full accent-purple-600 h-2 bg-purple-200 rounded-lg cursor-pointer mt-2"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>21 days</span>
                  <span>28 days (avg)</span>
                  <span>35 days</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Cycle Regularity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Regular', 'Occasionally Irregular', 'Irregular'] as const).map(reg => (
                    <button
                      key={reg}
                      type="button"
                      onClick={() => setCycleRegularity(reg)}
                      className={`p-2 rounded-xl border text-xs font-bold text-center transition-all ${
                        cycleRegularity === reg
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {reg}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Typical Flow
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Light', 'Moderate', 'Heavy'] as const).map(fl => (
                    <button
                      key={fl}
                      type="button"
                      onClick={() => setFlow(fl)}
                      className={`p-2 rounded-xl border text-xs font-bold text-center transition-all ${
                        flow === fl
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {fl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Mood & Energy Baseline
              </label>
              <input
                type="text"
                value={mood}
                onChange={e => setMood(e.target.value)}
                placeholder="e.g. Calm & Focused, Slight PMS fatigue"
                className="w-full p-3 rounded-2xl border border-slate-200 text-slate-800 font-medium text-sm"
              />
            </div>

            <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100 text-xs text-purple-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>
                <strong>Important Notice:</strong> Predictions are general wellness insights, not clinical diagnoses. WellNest never claims to diagnose PCOS or endocrine disorders from cycle inputs alone.
              </span>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-95"
              >
                Continue to Emergency SOS Location
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Emergency SOS Location */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 font-heading">
                Step 4: Emergency SOS & Care Directory Location
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Pre-configures nearby hospitals, laboratory home pickups, and quick emergency ride dispatch.
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  Auto-Detect My GPS Location
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Uses browser Geolocation API with your strict permission.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDetectLocation}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 shrink-0"
              >
                {isGpsActive ? '✓ Location Synced' : 'Detect Location'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Area / Locality <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={e => {
                    setArea(e.target.value);
                    if (errors.area) setErrors({ ...errors, area: '' });
                  }}
                  placeholder="e.g. Indiranagar 100ft Road"
                  className={`w-full p-3 rounded-2xl border ${
                    errors.area ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  } text-slate-800 font-medium text-sm`}
                />
                {errors.area && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.area}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pincode <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={e => {
                    setPincode(e.target.value);
                    if (errors.pincode) setErrors({ ...errors, pincode: '' });
                  }}
                  placeholder="e.g. 560038"
                  className={`w-full p-3 rounded-2xl border ${
                    errors.pincode ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  } text-slate-800 font-medium text-sm`}
                />
                {errors.pincode && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.pincode}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Address / Street details
              </label>
              <textarea
                value={fullAddress}
                onChange={e => setFullAddress(e.target.value)}
                rows={2}
                placeholder="Apartment, Street name, City"
                className="w-full p-3 rounded-2xl border border-slate-200 text-slate-800 font-medium text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nearby Landmark
              </label>
              <input
                type="text"
                value={landmark}
                onChange={e => setLandmark(e.target.value)}
                placeholder="e.g. Near Indiranagar Metro Station"
                className="w-full p-3 rounded-2xl border border-slate-200 text-slate-800 font-medium text-sm"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Back
              </button>

              <button
                onClick={handleFinishOnboarding}
                disabled={isLoading}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-extrabold text-sm shadow-xl shadow-purple-500/30 hover:scale-102 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Preparing Your Nest...
                  </span>
                ) : (
                  <>
                    <span>Complete Profile & Unlock Nest</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
