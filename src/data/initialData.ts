import {
  Recipe,
  ExerciseItem,
  WellnessFood,
  Hospital,
  Laboratory,
  RideOption,
  Product,
  NotificationItem,
  UserProfile,
} from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Aanya Sharma',
  age: 26,
  heightCm: 165,
  weightKg: 58,
  bmi: 21.3,
  bmiCategory: 'Normal Healthy Weight',
  scalpType: 'Combination',
  hairType: 'Wavy',
  hairConcerns: ['Hair Fall', 'Frizz & Flyaways'],
  hairWashFrequency: 'Twice a week',
  skinType: 'Combination',
  skinConcerns: ['Occasional Breakouts', 'Uneven Tone'],
  lastPeriodDate: '2026-09-24',
  cycleRegularity: 'Regular',
  cycleLength: 28,
  periodDuration: 5,
  flow: 'Moderate',
  mood: 'Calm & Focused',
  location: {
    area: 'Indiranagar 100ft Road',
    landmark: 'Near Metro Station',
    fullAddress: 'Flat 402, Green Orchid Apartments, 12th Main, Indiranagar',
    pincode: '560038',
    latitude: 12.9716,
    longitude: 77.6412,
    isDetected: true,
  },
  hasCompletedOnboarding: true,
};

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    name: 'Flaxseed & Berry Hormone Balance Oatmeal Bowl',
    mealType: 'Breakfast',
    category: 'Hormonal Wellness',
    calories: 340,
    prepTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=600&q=80',
    description: 'Warm rolled oats steeped in almond milk, enriched with freshly ground golden flaxseeds, chia seeds, fresh blueberries, and raw honey.',
    ingredients: [
      '1/2 cup Rolled organic oats',
      '1 tbsp Ground golden flaxseeds (lignan rich)',
      '1 tsp Chia seeds',
      '1 cup Unsweetened almond milk',
      '1/2 cup Fresh blueberries & raspberries',
      '1 tsp Pure raw forest honey',
      'Pinch of Ceylon cinnamon'
    ],
    instructions: [
      'Simmer rolled oats in almond milk over medium-low heat for 6-8 minutes until creamy.',
      'Remove from heat and gently fold in the ground flaxseed and Ceylon cinnamon.',
      'Transfer to your favourite ceramic bowl and top with fresh berries, chia seeds, and raw honey drizzle.'
    ],
    nutritionalBenefits: [
      'Lignans in flaxseed assist estrogen metabolism balance',
      'Antioxidant polyphenols fight oxidative cellular stress',
      'Slow-digesting beta-glucans stabilize morning insulin curves'
    ],
    personalizedNote: 'Tailored for follicular and luteal phase support with phytoestrogen balance.'
  },
  {
    id: 'rec-2',
    name: 'Avocado Spinach Green Glow Sourdough Toast',
    mealType: 'Breakfast',
    category: 'Glowing Skin',
    calories: 380,
    prepTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    description: 'Crisp artisanal whole-grain sourdough topped with creamy Hass avocado mash, baby spinach leaves, pumpkin seeds, and cold-pressed extra virgin olive oil.',
    ingredients: [
      '2 slices Whole grain sourdough bread',
      '1 ripe Hass avocado, pitted and mashed',
      '1 cup Baby spinach leaves',
      '1 tbsp Roasted pumpkin seeds',
      '1 tsp Cold-pressed extra virgin olive oil',
      'Himalayan pink salt and chili flakes'
    ],
    instructions: [
      'Toast the sourdough slices until golden and crisp.',
      'Mash avocado with a squeeze of fresh lemon, pink salt, and olive oil.',
      'Spread liberally over toast, layer with fresh crisp spinach, and garnish with pumpkin seeds.'
    ],
    nutritionalBenefits: [
      'Healthy monounsaturated fatty acids support cellular skin barrier',
      'Zinc in pumpkin seeds aids blemish healing and tissue repair',
      'Lutein and Vitamin E combat UV-induced cellular aging'
    ],
    personalizedNote: 'Ideal for nourishing combination skin from within.'
  },
  {
    id: 'rec-3',
    name: 'Rainbow Quinoa Power Bowl with Tahini Drizzle',
    mealType: 'Lunch',
    category: 'Weight Management',
    calories: 450,
    prepTime: '20 mins',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    description: 'Fluffy tri-colour quinoa with roasted turmeric chickpeas, steamed broccoli florets, purple cabbage, and a creamy lemon-tahini dressing.',
    ingredients: [
      '3/4 cup Cooked tricolor quinoa',
      '1/2 cup Spiced roasted chickpeas',
      '1/2 cup Steamed broccoli florets',
      '1/3 cup Shredded purple cabbage',
      '2 tbsp Sesame tahini dressing with lemon & garlic',
      'Fresh mint and cilantro leaves'
    ],
    instructions: [
      'Cook quinoa and fluff with a fork; season with sea salt.',
      'Roast cooked chickpeas with olive oil, cumin, and turmeric until slightly crunchy.',
      'Assemble vegetables and quinoa in sections and pour creamy garlic tahini over the bowl.'
    ],
    nutritionalBenefits: [
      'Complete plant-based amino acid profile with high fiber',
      'Sulforaphane from broccoli enhances liver detoxification pathways',
      'Sesame lignans provide bioavailable calcium for bone strength'
    ],
    personalizedNote: 'High satiety index helps sustain steady afternoon energy without glucose crashes.'
  },
  {
    id: 'rec-4',
    name: 'Wild Salmon with Asparagus & Lemon Herb Quinoa',
    mealType: 'Lunch',
    category: 'Hair Care',
    calories: 510,
    prepTime: '25 mins',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
    description: 'Pan-seared Atlantic salmon fillet with tender grilled asparagus spears, lemon zest, and fresh rosemary quinoa.',
    ingredients: [
      '150g Fresh salmon fillet (or grilled firm tofu for vegetarians)',
      '6 spears Tender garden asparagus',
      '1/2 cup Cooked lemon-herb quinoa',
      '1 tbsp Cold-pressed olive oil',
      'Fresh rosemary and garlic minced',
      'Fresh lemon wedge'
    ],
    instructions: [
      'Season fillet with sea salt, cracked black pepper, and minced rosemary.',
      'Sear skin-side down for 4 minutes until crisp, flip for 3 minutes.',
      'Sauté asparagus in the same pan with garlic and olive oil until bright green.',
      'Serve atop hot lemon quinoa with lemon juice.'
    ],
    nutritionalBenefits: [
      'Omega-3 EPA & DHA nourish hair follicle roots and scalp lipid layers',
      'High bioavailable protein supplies keratin structural building blocks',
      'Selenium and B12 support active microcirculation'
    ],
    personalizedNote: 'Formulated to strengthen strands and curb shedding.'
  },
  {
    id: 'rec-5',
    name: 'Turmeric Spiced Lentil & Kale Healing Stew',
    mealType: 'Dinner',
    category: 'Bone Health',
    calories: 390,
    prepTime: '30 mins',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
    description: 'Comforting yellow dal and green lentils simmered with organic ginger, turmeric root, tender kale leaves, and a fragrant cumin temper.',
    ingredients: [
      '1/2 cup Yellow moong & masoor lentils',
      '1 cup Chopped curly Tuscan kale',
      '1 tsp Fresh grated turmeric & ginger',
      '1/2 tsp Cumin seeds & asafoetida',
      '1 tsp A2 Gir Cow Ghee or coconut oil',
      '2 cups Purified mineral water'
    ],
    instructions: [
      'Pressure cook lentils with water, turmeric, ginger, and pink salt until velvety.',
      'Heat ghee in a tadka pan, crackle cumin seeds and asafoetida.',
      'Stir chopped kale into hot dal until wilted, pour hot aromatic tadka over top.'
    ],
    nutritionalBenefits: [
      'Calcium and Vitamin K in kale enhance bone mineral matrix',
      'Curcumin acts as an anti-inflammatory modulator',
      'Easily assimilated lentils promote gut mucosal repair before sleep'
    ],
    personalizedNote: 'Light on evening digestion while maximizing overnight micronutrient repair.'
  },
  {
    id: 'rec-6',
    name: 'Sesame Crusted Tofu with Bok Choy & Shiitake',
    mealType: 'Dinner',
    category: 'Hormonal Wellness',
    calories: 420,
    prepTime: '20 mins',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    description: 'Crisp organic tofu cubes crusted with black and white sesame seeds, stir-fried with tender baby bok choy and immunity-boosting shiitake mushrooms.',
    ingredients: [
      '150g Organic non-GMO firm tofu cubes',
      '1 tbsp Mixed black & white sesame seeds',
      '2 heads Baby bok choy halved',
      '4 fresh Shiitake mushrooms sliced',
      '1 tbsp Tamari sauce & ginger juice',
      '1 tsp Toasted sesame oil'
    ],
    instructions: [
      'Press tofu and roll cubes in sesame seeds.',
      'Sear in sesame oil until golden on all sides.',
      'Toss bok choy and shiitake mushrooms with tamari and ginger until tender-crisp.'
    ],
    nutritionalBenefits: [
      'Isoflavones offer gentle phytoestrogenic cellular modulation',
      'Zinc and copper promote enzymatic hormone synthesis',
      'Beta-glucans in shiitake boost lymphocyte resilience'
    ],
    personalizedNote: 'Balances menstrual cycle phases without heavy glycemic burden.'
  },
  {
    id: 'rec-7',
    name: 'Walnut & Dark Cacao Magnesium Energy Bites',
    mealType: 'Snacks',
    category: 'Hormonal Wellness',
    calories: 180,
    prepTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    description: 'No-bake wholesome treats crafted from Medjool dates, raw walnuts, pumpkin seeds, 85% raw cacao, and sea salt flakes.',
    ingredients: [
      '4 pitted Medjool dates',
      '1/4 cup Raw Kashmiri walnuts',
      '2 tbsp Raw pumpkin seeds',
      '1.5 tbsp Organic raw cacao powder',
      'Flaky sea salt'
    ],
    instructions: [
      'Pulse dates, walnuts, pumpkin seeds, and cacao in a food processor until a dough forms.',
      'Roll into bite-sized balls and dust with sea salt.',
      'Chill in the refrigerator for 20 minutes before enjoying.'
    ],
    nutritionalBenefits: [
      'High magnesium eases premenstrual uterine cramps and tension',
      'Alpha-linolenic acid (ALA) in walnuts supports brain neurotransmitters',
      'Theobromine gently uplifts mood and focus'
    ],
    personalizedNote: 'Great 4 PM snack to conquer cravings and alleviate PMS irritability.'
  },
  {
    id: 'rec-8',
    name: 'Hydrating Cucumber Coconut Collagen Elixir',
    mealType: 'Snacks',
    category: 'Glowing Skin',
    calories: 95,
    prepTime: '5 mins',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
    description: 'Refreshing cold-pressed English cucumber juice blended with tender tender coconut water, fresh mint leaves, and lime juice.',
    ingredients: [
      '1 chilled English cucumber',
      '150ml Tender green coconut water',
      '6 fresh Mint leaves',
      '1/2 Lime juiced',
      'Pinch of Himalayan pink salt'
    ],
    instructions: [
      'Blend peeled cucumber with coconut water and mint leaves.',
      'Strain lightly through a fine mesh or drink with natural fiber.',
      'Squeeze fresh lime and add pink salt; serve chilled.'
    ],
    nutritionalBenefits: [
      'Electrolyte-dense potassium and silica restore cellular turgor',
      'Flushes lymphatic stagnation and minimizes facial puffiness',
      'Alkalinizing botanicals balance skin pH'
    ],
    personalizedNote: 'Deep cellular hydration for a luminous dewy complexion.'
  }
];

export const DIET_KITS = [
  {
    id: 'kit-1',
    name: 'Hormonal Harmony & Cycle Reset Kit',
    category: 'Hormonal Wellness',
    tagline: 'Seed cycling, adaptogens, and phytoestrogens for a smoother cycle',
    itemsCount: 7,
    caloriesAvg: 1650,
    benefits: ['Supports regular cycle rhythm', 'Balances estrogen & progesterone', 'Reduces PMS mood dips'],
    recommendedFor: 'Follicular & Luteal cycle phases, mild mood swings, cycle regularity',
    color: 'from-purple-500 to-pink-500',
    icon: '🌸'
  },
  {
    id: 'kit-2',
    name: 'Radiant Skin & Collagen Booster Kit',
    category: 'Glowing Skin',
    tagline: 'Antioxidants, healthy lipids, and zinc for dewy, balanced skin',
    itemsCount: 6,
    caloriesAvg: 1720,
    benefits: ['Reinforces lipid skin barrier', 'Clears occasional breakouts', 'Promotes natural hydration'],
    recommendedFor: 'Combination/acne-prone skin, dull complexion, urban pollution defense',
    color: 'from-amber-400 to-rose-400',
    icon: '✨'
  },
  {
    id: 'kit-3',
    name: 'Hair Density & Follicle Strength Kit',
    category: 'Hair Care',
    tagline: 'Bioavailable proteins, iron, biotin sources, and scalp circulation',
    itemsCount: 8,
    caloriesAvg: 1800,
    benefits: ['Keratin structural replenishment', 'Reduces seasonal hair thinning', 'Deep root nourishment'],
    recommendedFor: 'Hair fall, brittle roots, scalp combination dryness',
    color: 'from-emerald-400 to-teal-500',
    icon: '🌿'
  },
  {
    id: 'kit-4',
    name: 'Lean Metabolic & Weight Balance Kit',
    category: 'Weight Management',
    tagline: 'High fiber, steady glucose, lean proteins, and thermogenic herbs',
    itemsCount: 6,
    caloriesAvg: 1500,
    benefits: ['Sustained steady satiety', 'Prevents 3 PM sugar cravings', 'Healthy BMI maintenance'],
    recommendedFor: 'Healthy BMI support, insulin sensitivity, all-day stamina',
    color: 'from-indigo-500 to-blue-500',
    icon: '⚖️'
  },
  {
    id: 'kit-5',
    name: 'Bone Density & Vital Mineral Kit',
    category: 'Bone Health',
    tagline: 'Calcium, Vitamin K2, magnesium, and bioavailable boron foods',
    itemsCount: 5,
    caloriesAvg: 1680,
    benefits: ['Enhances bone mineral density', 'Supports joint flexibility', 'Strengthens teeth and nails'],
    recommendedFor: 'Sedentary lifestyles, post-period mineral replenishment',
    color: 'from-cyan-400 to-blue-600',
    icon: '🦴'
  }
];

export const EXERCISE_ITEMS: ExerciseItem[] = [
  {
    id: 'ex-1',
    title: 'Pelvic Floor & Supta Baddha Konasana (Reclined Butterfly)',
    category: 'Yoga',
    durationMinutes: 12,
    difficulty: 'Gentle',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80',
    benefits: [
      'Gently releases pelvic floor tension and lower abdomen spasms',
      'Stimulates abdominal circulation and calms central nervous system',
      'Helps alleviate menstrual cramps and hip stiffness'
    ],
    steps: [
      'Lie on your back on a comfortable yoga mat or firm bed.',
      'Bend knees and bring the soles of your feet together, letting knees fall open to the sides.',
      'Place one hand on your heart and one on your lower belly.',
      'Close your eyes and breathe deeply into your belly for 4 counts, exhaling for 6 counts.',
      'Hold the posture for 5-10 minutes, using pillows beneath knees if hips feel tight.'
    ],
    tips: 'Do not force your knees downward; allow gravity and slow exhalations to do the work.'
  },
  {
    id: 'ex-2',
    title: 'Brisk Sunlight Stride & Rhythmic Walking',
    category: 'Walking',
    durationMinutes: 25,
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80',
    benefits: [
      'Natural Vitamin D synthesis boosts bone density and serotonin',
      'Low-impact cardiovascular stimulus aids insulin sensitivity',
      'Reduces cortisol levels and clears brain fog'
    ],
    steps: [
      'Put on supportive cushioned walking sneakers.',
      'Start with a 3-minute gentle warm-up walk at easy conversational pace.',
      'Accelerate to a brisk cadence where your arms swing comfortably at 90 degrees.',
      'Maintain an upright posture with shoulders relaxed down and back.',
      'Finish with 2 minutes of relaxed stroll and gentle calf stretches.'
    ],
    tips: 'Best performed during early morning golden hours (7:30 - 9:00 AM) for circadian alignment.'
  },
  {
    id: 'ex-3',
    title: 'Traditional Ayurvedic Scalp & Marma Point Massage',
    category: 'Hair-Care Massage',
    durationMinutes: 10,
    difficulty: 'Gentle',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80',
    benefits: [
      'Stimulates microcapillary blood flow directly to hair follicles',
      'Releases cranial muscular tension that restricts nutrient flow',
      'Aids deeper, more restorative REM sleep'
    ],
    steps: [
      'Sit comfortably with spine erect. Warm 1-2 drops of rosemary or bhringraj oil between palms.',
      'Place fingertips at the crown of your head (Adhipati marma point).',
      'Make firm, circular kneading motions with your finger pads (never fingernails).',
      'Work your way down from the crown to the temples, behind the ears, and base of the neck.',
      'Gently tug small sections of hair at the roots to stimulate dermal papilla.'
    ],
    tips: 'Breathe rhythmically throughout and do not rush the base of the skull.'
  },
  {
    id: 'ex-4',
    title: 'Facial Gua Sha & Lymphatic Drainage Massage',
    category: 'Facial Relaxation',
    durationMinutes: 8,
    difficulty: 'Gentle',
    image: 'https://images.unsplash.com/photo-1512290900672-1f02e6205842?auto=format&fit=crop&w=600&q=80',
    benefits: [
      'Drains stagnant interstitial fluid to minimize morning facial puffiness',
      'Relaxes jaw tightness (masseter muscle) from stress or teeth grinding',
      'Enhances natural dermal microcirculation for a radiant flush'
    ],
    steps: [
      'Apply 3-4 drops of squalane or rosehip seed oil over clean face and neck.',
      'Hold Gua Sha stone or finger knuckles at a 15-degree angle nearly flat against skin.',
      'Glide upward from the collarbone toward the jawline 5 times on each side.',
      'Sweep from the center of the chin along the jawbone to the earlobe.',
      'Glide gently beneath cheekbones outward to temples with feather-light pressure.'
    ],
    tips: 'Never pull or drag dry skin; always ensure plenty of facial oil slip.'
  },
  {
    id: 'ex-5',
    title: 'Bodyweight Squats & Core Stability Flow',
    category: 'Bone Strength',
    durationMinutes: 18,
    difficulty: 'Active',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
    benefits: [
      'Mechanical loading stimulates osteoblast activity and bone density',
      'Strengthens glutes, hamstrings, and pelvic stability',
      'Enhances basal metabolic rate and glucose clearance'
    ],
    steps: [
      'Stand with feet shoulder-width apart, toes turned slightly outwards.',
      'Inhale as you sit hips back and down, keeping chest proud and knees tracking over toes.',
      'Lower until thighs are parallel to the floor, then drive through heels to stand.',
      'Complete 3 sets of 12 controlled repetitions.',
      'Follow with a 45-second forearm plank, keeping core braced and glutes engaged.'
    ],
    tips: 'Keep your weight distributed through your heels and mid-foot, avoiding knee collapse inward.'
  },
  {
    id: 'ex-6',
    title: '4-7-8 Parasympathetic Vagus Nerve Relaxation',
    category: 'Relaxation',
    durationMinutes: 10,
    difficulty: 'Gentle',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    benefits: [
      'Rapidly downregulates sympathetic nervous system (fight-or-flight)',
      'Lowers heart rate and blood pressure within minutes',
      'Prepares body for deep restorative sleep cycle'
    ],
    steps: [
      'Sit comfortably with your back straight and rest the tip of your tongue behind upper teeth.',
      'Exhale completely through your mouth with a soft whoosh sound.',
      'Close your mouth and inhale quietly through your nose for a mental count of 4.',
      'Hold your breath for a count of 7.',
      'Exhale completely through your mouth for a slow count of 8.',
      'Repeat this cycle 4 to 8 times.'
    ],
    tips: 'The ratio (4:7:8) is what matters most; if you feel breathless, count faster while keeping proportions.'
  }
];

export const WELLNESS_FOODS: WellnessFood[] = [
  {
    id: 'wf-1',
    name: 'Raw Organic Pumpkin Seeds',
    category: 'Seeds & Nuts',
    benefits: ['Supports progestogenic balance in luteal phase', 'Promotes blemish healing', 'Aids restful sleep'],
    richIn: ['Zinc', 'Magnesium', 'Tryptophan'],
    servingSuggestion: '1-2 tablespoons sprinkled on morning oatmeal or afternoon yoghurt.',
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80',
    calories: 140
  },
  {
    id: 'wf-2',
    name: 'Wild Blueberries',
    category: 'Berries & Fruits',
    benefits: ['Fights cellular oxidative stress', 'Supports microvascular circulation', 'Low glycemic fruit choice'],
    richIn: ['Anthocyanins', 'Vitamin C', 'Dietary Fiber'],
    servingSuggestion: '1/2 cup fresh or frozen in smoothies, parfaits, or warm porridge.',
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80',
    calories: 84
  },
  {
    id: 'wf-3',
    name: 'Cold-Pressed Golden Flaxseed Meal',
    category: 'Seeds & Nuts',
    benefits: ['Gentle estrogen metabolite clearance', 'Supports smooth bowel regularity', 'Feeds friendly gut microbiome'],
    richIn: ['Lignans', 'Alpha-Linolenic Acid (Omega-3)', 'Soluble Fiber'],
    servingSuggestion: '1 tablespoon freshly ground mixed into warm dal, soups, or smoothies.',
    image: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=600&q=80',
    calories: 55
  },
  {
    id: 'wf-4',
    name: 'Organic Hass Avocado',
    category: 'Healthy Fats',
    benefits: ['Maintains skin lipid barrier elasticity', 'Enhances fat-soluble vitamin absorption', 'Steady insulin modulation'],
    richIn: ['Monounsaturated Oleic Acid', 'Potassium', 'Vitamin E'],
    servingSuggestion: '1/2 avocado sliced onto whole grain sourdough or mixed in salads.',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
    calories: 160
  },
  {
    id: 'wf-5',
    name: 'Fermented Greek Style Curd / Yoghurt',
    category: 'Fermented Foods',
    benefits: ['Repopulates gut microbiome', 'Enhances vaginal microbiome defenses', 'High biological value protein'],
    richIn: ['Live Probiotic Cultures', 'Calcium', 'B Vitamins'],
    servingSuggestion: '1 small bowl with roasted cumin powder and rock salt as a digestive accompaniment.',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    calories: 120
  },
  {
    id: 'wf-6',
    name: 'Tender Green Coconut Water',
    category: 'Hydration',
    benefits: ['Replenishes fluid loss during menstruation', 'Combats heat and facial flushing', 'Natural gentle electrolyte balance'],
    richIn: ['Potassium', 'Magnesium', 'Bioactive Enzymes'],
    servingSuggestion: '1 fresh tender coconut mid-morning around 11 AM.',
    image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=600&q=80',
    calories: 45
  }
];

export const HOSPITALS_DATA: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'Manipal Hospital & Women Care Center',
    distanceKm: 1.4,
    address: '98, HAL Old Airport Road, Kodihalli, Bengaluru',
    emergencyPhone: '080-25024444',
    generalPhone: '1800-102-5555',
    rating: 4.8,
    open24x7: true,
    bedsAvailable: 14,
    services: ['24x7 Emergency Trauma', 'Obstetrics & Gynecology', 'Dermatology & Cosmetology', 'Endocrinology', 'Ultrasound & MRI'],
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80',
    doctors: [
      {
        id: 'doc-1',
        name: 'Dr. Priya Ramachandran',
        specialty: 'Senior Obstetrician & Gynecologist',
        experienceYears: 16,
        rating: 4.9,
        reviewsCount: 342,
        languages: ['English', 'Hindi', 'Kannada', 'Tamil'],
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        consultationFee: 850,
        availability: ['Today, 10:30 AM', 'Today, 02:00 PM', 'Today, 04:30 PM', 'Tomorrow, 11:00 AM'],
        about: 'Specializes in PCOS/PCOD management, menstrual irregularities, fertility counseling, and holistic endocrine care.'
      },
      {
        id: 'doc-2',
        name: 'Dr. Ananya Sengupta',
        specialty: 'Consultant Dermatologist & Trichologist',
        experienceYears: 11,
        rating: 4.8,
        reviewsCount: 215,
        languages: ['English', 'Hindi', 'Bengali'],
        image: 'https://images.unsplash.com/photo-1594824813590-7853193c4456?auto=format&fit=crop&w=400&q=80',
        consultationFee: 750,
        availability: ['Today, 11:30 AM', 'Today, 03:15 PM', 'Tomorrow, 10:00 AM'],
        about: 'Expert in scalp disorders, telogen effluvium, adult hormonal acne, and sensitive skin barrier restoration.'
      }
    ]
  },
  {
    id: 'hosp-2',
    name: 'Cloudnine Hospital for Women & Wellness',
    distanceKm: 2.8,
    address: 'Old Airport Road, Murugeshpalya, Bengaluru',
    emergencyPhone: '080-67999999',
    generalPhone: '99728-99728',
    rating: 4.9,
    open24x7: true,
    bedsAvailable: 8,
    services: ['24x7 Gynecology Emergency', 'Reproductive Endocrinology', 'Pediatrics', 'Clinical Nutritionist', 'Fetal Medicine'],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    doctors: [
      {
        id: 'doc-3',
        name: 'Dr. Meera Nambiar',
        specialty: 'Reproductive Endocrinologist & OB-GYN',
        experienceYears: 14,
        rating: 4.9,
        reviewsCount: 420,
        languages: ['English', 'Hindi', 'Malayalam'],
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        consultationFee: 900,
        availability: ['Today, 12:00 PM', 'Today, 05:00 PM', 'Tomorrow, 09:30 AM'],
        about: 'Pioneer in adolescent cycle stabilization, perimenopausal transition, and insulin-resistant PCOS support.'
      },
      {
        id: 'doc-4',
        name: 'Dr. Vikram Malhotra',
        specialty: 'Clinical Nutritionist & Lifestyle Medicine',
        experienceYears: 9,
        rating: 4.7,
        reviewsCount: 168,
        languages: ['English', 'Hindi', 'Punjabi'],
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        consultationFee: 650,
        availability: ['Today, 02:30 PM', 'Tomorrow, 11:30 AM', 'Tomorrow, 04:00 PM'],
        about: 'Focuses on dietary protocols for thyroid auto-antibodies, gut dysbiosis, and sustainable metabolic wellness.'
      }
    ]
  },
  {
    id: 'hosp-3',
    name: 'Aster CMI Multispeciality Hospital',
    distanceKm: 5.2,
    address: 'Bellary Road, Sahakar Nagar, Hebbal, Bengaluru',
    emergencyPhone: '080-43444344',
    generalPhone: '080-43444444',
    rating: 4.7,
    open24x7: true,
    bedsAvailable: 22,
    services: ['24x7 Advanced Trauma Center', 'Endocrine & Metabolic Health', 'Comprehensive Diagnostics', 'Women Health Pavilion'],
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80',
    doctors: [
      {
        id: 'doc-5',
        name: 'Dr. Shalini Deshmukh',
        specialty: 'Endocrinologist & Diabetes Specialist',
        experienceYears: 18,
        rating: 4.9,
        reviewsCount: 388,
        languages: ['English', 'Hindi', 'Marathi', 'Kannada'],
        image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=400&q=80',
        consultationFee: 1000,
        availability: ['Today, 03:00 PM', 'Tomorrow, 10:00 AM', 'Tomorrow, 01:30 PM'],
        about: 'National investigator in hormonal metabolic syndrome, thyroid disorders, and hormonal hair/skin therapies.'
      }
    ]
  }
];

export const LABORATORIES_DATA: Laboratory[] = [
  {
    id: 'lab-1',
    name: 'Thyrocare Certified Diagnostic Centre',
    distanceKm: 1.2,
    address: '100 Feet Road, HAL 2nd Stage, Indiranagar',
    phone: '022-30900000',
    rating: 4.8,
    homeCollection: true,
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
    tests: [
      {
        id: 't-1',
        name: 'Comprehensive Hormone & Cycle Panel (FSH, LH, Prolactin, Estradiol)',
        price: 1850,
        fastingRequired: false,
        tatHours: '24 Hours',
        description: 'Complete quantitative assay of key female endocrine markers to understand cycle irregularities and follicular health.'
      },
      {
        id: 't-2',
        name: 'Complete Thyroid & Antibody Profile (TSH, Free T3, Free T4, Anti-TPO)',
        price: 1100,
        fastingRequired: true,
        tatHours: '12 Hours',
        description: 'Sensitive chemiluminescence test to detect sluggish thyroid function or autoimmune Hashimoto markers.'
      },
      {
        id: 't-3',
        name: 'Serum Ferritin, Iron Binding & Total Vitamin D3',
        price: 950,
        fastingRequired: true,
        tatHours: '8 Hours',
        description: 'Vital micronutrient screen commonly indicated for unexpected hair fall, chronic fatigue, and bone aches.'
      }
    ]
  },
  {
    id: 'lab-2',
    name: 'Dr. Lal PathLabs Advanced Wellness Center',
    distanceKm: 2.1,
    address: 'CMH Road, Metro Pillar 84, Indiranagar',
    phone: '011-39885050',
    rating: 4.7,
    homeCollection: true,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    tests: [
      {
        id: 't-4',
        name: 'PCOS Metabolic Screen (HbA1c, Fasting Insulin, Lipid Profile & HOMA-IR)',
        price: 1450,
        fastingRequired: true,
        tatHours: '12 Hours',
        description: 'Calculates insulin resistance index and glycemic markers linked to stubborn weight and cycle disruption.'
      },
      {
        id: 't-5',
        name: 'Skin & Allergy Immunoglobulin E (Total IgE + CBC with ESR)',
        price: 890,
        fastingRequired: false,
        tatHours: '8 Hours',
        description: 'Evaluates allergic inflammatory responses, eosinophil counts, and acute tissue reactivities.'
      }
    ]
  }
];

export const RIDE_OPTIONS: RideOption[] = [
  {
    id: 'ride-1',
    type: 'Bike',
    etaMinutes: 4,
    price: 49,
    icon: '🛵',
    description: 'Fastest navigation through heavy traffic. Helmet provided.'
  },
  {
    id: 'ride-2',
    type: 'Auto',
    etaMinutes: 6,
    price: 85,
    icon: '🛺',
    description: 'Quick, covered 3-wheeler ride with digital meter & GPS tracking.'
  },
  {
    id: 'ride-3',
    type: 'Cab',
    etaMinutes: 8,
    price: 179,
    icon: '🚗',
    description: 'Air-conditioned sedan/hatchback with sanitised comfort and SOS ride share.'
  },
  {
    id: 'ride-4',
    type: 'Ambulance',
    etaMinutes: 11,
    price: 0,
    icon: '🚑',
    description: 'Medical transport with emergency oxygen & trained paramedical responder.',
    isEmergencyAmbulance: true
  }
];

export const STORE_PRODUCTS: Product[] = [
  // 1. Skin Care
  {
    id: 'prod-1',
    name: 'Centella & Barrier Ceramides Daily Calming Cream',
    brand: 'Minimalist',
    category: 'Skin Care',
    price: 599,
    originalPrice: 699,
    rating: 4.8,
    reviewsCount: 1240,
    image: 'https://images.unsplash.com/photo-1608248597359-577884845511?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Pure 0.3% Ceramide complex with Madecassoside for irritated, sensitive, or breakout-prone skin.',
    description: 'Formulated with 3 essential skin-identical ceramides (EOP, NP, AP), free fatty acids, and pure Centella Asiatica leaf extract. Rebuilds compromised moisture barriers within 7 days and calms red flare-ups without clogging pores.',
    ingredients: ['Ceramide NP', 'Ceramide AP', 'Madecassoside', 'Centella Asiatica', 'Glycerin', 'Squalane'],
    usage: 'Apply a dime-sized amount twice daily after cleansing. Gently press into face and neck until absorbed.',
    tags: ['Fragrance Free', 'Non-Comedogenic', 'Dermatologist Tested'],
    personalizedReason: 'Recommended for your Combination skin to balance hydration without heavy pore-clogging oils.'
  },
  {
    id: 'prod-2',
    name: 'Niacinamide 10% + Zinc 1% Blemish Clarifying Serum',
    brand: 'The Ordinary',
    category: 'Skin Care',
    price: 650,
    originalPrice: 700,
    rating: 4.7,
    reviewsCount: 3100,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'High-strength vitamin and mineral blemish formula that visibly targets uneven tone and excess sebum.',
    description: 'Niacinamide (Vitamin B3) visibly regulates sebum activity and minimizes enlarged pores, while Zinc PCA accelerates skin recovery and balances surface microflora.',
    ingredients: ['Niacinamide (10%)', 'Zinc PCA (1%)', 'Tamarindus Indica Seed Gum', 'Pentylene Glycol'],
    usage: 'Apply 2-3 drops morning and evening before heavier creams. Patch test recommended prior to first use.',
    tags: ['Oil Free', 'Vegan', 'Cruelty Free'],
    personalizedReason: 'Addresses your stated skin concerns (Occasional Breakouts & Uneven Tone).'
  },
  {
    id: 'prod-3',
    name: 'Hydra-Gel Water Sunscreen SPF 50+ PA++++',
    brand: 'Dot & Key',
    category: 'Skin Care',
    price: 495,
    originalPrice: 595,
    rating: 4.9,
    reviewsCount: 890,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Ultra-lightweight invisible broad spectrum protection with hyaluronic acid and watermelon extract.',
    description: 'Leaves zero white cast and zero greasy residue. Encapsulated UV filters provide broad spectrum defense against UVA, UVB, and digital blue light while flooding skin with hydration.',
    ingredients: ['Hyaluronic Acid', 'Watermelon Extract', 'Avobenzone', 'Octocrylene', 'Vitamin E'],
    usage: 'Liberally apply 2 finger lengths across face, ears, and neck 15 minutes before stepping into sunlight.',
    tags: ['Zero White Cast', 'Fast Absorbing', 'Broad Spectrum'],
    personalizedReason: 'Lightweight gel texture prevents midday shine on combination T-zones.'
  },

  // 2. Hair Care
  {
    id: 'prod-4',
    name: 'Redensyl 3% + Rosemary Active Hair Growth Tonic',
    brand: 'Bontress / ThriveCo',
    category: 'Hair Care',
    price: 899,
    originalPrice: 1199,
    rating: 4.8,
    reviewsCount: 1680,
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Clinically studied hair density serum activating stem cells in the hair follicle bulge.',
    description: 'A non-sticky water-based leave-in serum powered by Redensyl, Procapil, and pure steam-distilled Rosemary leaf oil. Stimulates the anagen growth cycle and reduces shedding within 6-8 weeks of consistent use.',
    ingredients: ['Redensyl (3%)', 'Rosemary Oil', 'Procapil', 'Anagain', 'Peptides', 'Biotinoyl Tripeptide'],
    usage: 'Dispense 1-2 ml directly onto clean, dry scalp once daily. Gently massage with fingertips for 2 minutes. Do not rinse.',
    tags: ['Clinically Proven', 'Non Greasy', 'Sulfate Free'],
    personalizedReason: 'Targeted support for your Hair Fall and follicle nourishment.'
  },
  {
    id: 'prod-5',
    name: 'Scalp Detox Clarifying Apple Cider Vinegar Scrub',
    brand: 'Bare Anatomy',
    category: 'Hair Care',
    price: 549,
    originalPrice: 650,
    rating: 4.6,
    reviewsCount: 720,
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Gentle physical and enzymatic exfoliant for product buildup, flakes, and combination oily roots.',
    description: 'Features micro-fine walnut shell particles, raw organic fermented apple cider vinegar, and tea tree oil to unclog suffocated hair follicles while maintaining natural scalp moisture.',
    ingredients: ['Apple Cider Vinegar', 'Tea Tree Oil', 'Salicylic Acid', 'Aloe Vera Leaf Juice', 'Vitamin B5'],
    usage: 'Use once a week before shampooing. Part wet hair, massage gently onto scalp for 2 minutes, then rinse thoroughly.',
    tags: ['Scalp Exfoliation', 'Color Safe', 'Paraben Free'],
    personalizedReason: 'Helps reset combination scalps without stripping delicate wavy ends.'
  },
  {
    id: 'prod-6',
    name: 'Argan & Camellia Anti-Frizz Moisture Hair Mask',
    brand: 'Wella Professionals',
    category: 'Hair Care',
    price: 780,
    originalPrice: 850,
    rating: 4.9,
    reviewsCount: 1420,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Deep conditioning salon-grade treatment restoring softness, wave definition, and slip.',
    description: 'Infused with cold-pressed Moroccan Argan oil and Camellia flower seed extract. Seals raised cuticles, banishes flyaway frizz, and imparts silky bounce to wavy hair textures.',
    ingredients: ['Pure Moroccan Argan Oil', 'Camellia Seed Oil', 'Hydrolyzed Keratin', 'Panthenol'],
    usage: 'After shampooing, apply generously from mid-lengths to ends. Leave for 5-10 minutes, then rinse with cool water.',
    tags: ['Intense Hydration', 'Anti-Frizz', 'Salon Formula'],
    personalizedReason: 'Tames frizz and enhances natural wave definition.'
  },

  // 3. Period Essentials
  {
    id: 'prod-7',
    name: '100% Organic Cotton Hypoallergenic Sanitary Pads (Pack of 12)',
    brand: 'Carmesi',
    category: 'Period Essentials',
    price: 299,
    originalPrice: 349,
    rating: 4.9,
    reviewsCount: 2200,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Chlorine-free, rash-free organic cotton top sheet with biodegradable plant-based waterproof backing.',
    description: 'Crafted without artificial scents, dyes, chlorine, or plastic layers. Soft micro-perforated cotton channels absorb flow quickly while keeping skin dry, breathable, and completely rash-free.',
    ingredients: ['100% GOTS Certified Organic Cotton', 'Bamboo Pulp Core', 'Cornstarch Backing'],
    usage: 'Change pad every 4-6 hours or as needed depending on menstrual flow.',
    tags: ['Zero Rashes', '100% Biodegradable', 'GOTS Certified'],
    personalizedReason: 'Gentle on sensitive skin during Moderate flow days.'
  },
  {
    id: 'prod-8',
    name: 'Medical Grade Silicone Menstrual Cup (Size M with Sterilizer Cup)',
    brand: 'Pee Safe',
    category: 'Period Essentials',
    price: 449,
    originalPrice: 599,
    rating: 4.8,
    reviewsCount: 1950,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Reusable, ultra-soft silicone cup offering up to 12 hours of leak-free freedom and zero waste.',
    description: '100% US FDA approved medical-grade silicone with ergonomic flexible rim and textured stem for easy removal. Safe for swimming, working out, and overnight sleep.',
    ingredients: ['100% US-FDA Approved Medical Grade Silicone'],
    usage: 'Fold into C-fold or punch-down fold and insert into vaginal canal. Empty, wash with warm water, and re-insert every 8-12 hours.',
    tags: ['Eco Friendly', '12h Leakproof', 'Reusable 5 Years'],
    personalizedReason: 'Recommended for active lifestyles and sustainable period wellness.'
  },
  {
    id: 'prod-9',
    name: 'Instant Herbal Cramp Relief Roll-On with Peppermint & Wintergreen',
    brand: 'Sirona',
    category: 'Period Essentials',
    price: 249,
    originalPrice: 299,
    rating: 4.7,
    reviewsCount: 1340,
    image: 'https://images.unsplash.com/photo-1608248597359-577884845511?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Ayurvedic cooling botanical roll-on for soothing lower abdomen and lower back cramps on the go.',
    description: 'Enriched with natural peppermint oil, wintergreen oil, and menthol extract. Penetrates quickly to relieve muscle spasms, bloating tenderness, and menstrual aches without staining clothing.',
    ingredients: ['Peppermint Essential Oil', 'Wintergreen Essential Oil', 'Camphor', 'Eucalyptus'],
    usage: 'Gently roll over lower abdomen, thighs, or lower back. Feel the gentle cooling and warming sensation within 5 minutes.',
    tags: ['100% Natural', 'Stain Free', 'Pocket Friendly'],
    personalizedReason: 'Quick, non-medicinal relief for cycle day 1-2 comfort.'
  },

  // 4. Medicines (Demo / Verified OTC / Consultation Warnings)
  {
    id: 'prod-10',
    name: 'Dydrogesterone 10mg / Hormonal Support (Rx)',
    brand: 'Abbott Healthcare',
    category: 'Medicines',
    price: 520,
    rating: 4.6,
    reviewsCount: 420,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Prescription oral progestogen for specific menstrual cycle irregularities and luteal insufficiency.',
    description: 'Indicated for dysmenorrhea, endometriosis, and irregular cycles under direct physician supervision.',
    ingredients: ['Dydrogesterone 10mg'],
    usage: 'As strictly prescribed by your registered gynecologist. Never self-administer.',
    tags: ['Rx Required', 'Gynecology', 'Prescription Only'],
    prescriptionRequired: true,
    warningNotice: '⚠️ Prescription Medicine: Requires a valid doctor prescription. WellNest does not auto-dispense prescription medication without clinical verification.',
    personalizedReason: 'Consult a specialist before exploring pharmacological cycle interventions.'
  },
  {
    id: 'prod-11',
    name: 'Mefenamic Acid & Dicyclomine Antispasmodic Tablets',
    brand: 'Blue Cross (Meftal-Spas)',
    category: 'Medicines',
    price: 65,
    rating: 4.7,
    reviewsCount: 1890,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Anti-inflammatory and antispasmodic for severe primary dysmenorrhea and uterine muscle contractions.',
    description: 'Dual-action oral tablets combining an NSAID with an antispasmodic agent to mitigate prostaglandin-induced uterine cramping.',
    ingredients: ['Mefenamic Acid 250mg', 'Dicyclomine Hydrochloride 10mg'],
    usage: 'Take one tablet after food as recommended by your physician during severe menstrual pain episodes.',
    tags: ['Rx Consultation', 'Pain Relief', 'Clinically Monitored'],
    prescriptionRequired: true,
    warningNotice: '⚠️ Important Safety Notice: Avoid frequent unsupervised use. Consult your doctor if cramps are accompanied by fever, severe nausea, or abnormal bleeding.',
    personalizedReason: 'Explore non-pharmacological hot compress and magnesium remedies first.'
  },

  // 5. Supplements
  {
    id: 'prod-12',
    name: 'Myo-Inositol & D-Chiro Inositol (40:1) with Folate & Vitamin D3',
    brand: 'Carbamide Forte',
    category: 'Supplements',
    price: 749,
    originalPrice: 899,
    rating: 4.8,
    reviewsCount: 2150,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Clinically proven 40:1 ratio supporting cellular insulin sensitivity and ovulatory regularity.',
    description: 'Features 2000mg Myo-Inositol and 50mg D-Chiro-Inositol alongside bioavailable L-Methylfolate and Vitamin D3. Helps restore hormonal homeostasis, clear androgenic acne, and regulate menstrual cyclicity.',
    ingredients: ['Myo-Inositol (2000mg)', 'D-Chiro Inositol (50mg)', 'L-Methylfolate (400mcg)', 'Vitamin D3 (1000 IU)'],
    usage: 'Mix 1 scoop or take 2 capsules daily with a glass of water, preferably 30 minutes before breakfast.',
    tags: ['40:1 Ratio', 'Gluten Free', 'Non GMO', 'Dietary Supplement'],
    warningNotice: 'Dietary supplement. Not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider before use.',
    personalizedReason: 'Supports ovulatory rhythm and steady metabolic balance.'
  },
  {
    id: 'prod-13',
    name: 'Chelated Magnesium Glycinate 400mg + P-5-P (Vitamin B6)',
    brand: 'HealthyHey Nutrition',
    category: 'Supplements',
    price: 649,
    originalPrice: 799,
    rating: 4.9,
    reviewsCount: 1540,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Highly absorbable, gentle-on-the-stomach magnesium for restful sleep, muscle relaxation, and PMS comfort.',
    description: 'Chelated with glycine amino acid molecules for maximum cellular bioavailability without causing laxative distress. Synergized with active Vitamin B6 to ease menstrual mood swings and uterine muscle tension.',
    ingredients: ['Magnesium Bisglycinate Chelate (400mg elemental)', 'Pyridoxal-5-Phosphate (Vitamin B6 10mg)'],
    usage: 'Take 1 capsule 45 minutes before bedtime with water.',
    tags: ['Non-Laxative', 'Deep Sleep', 'Muscle Ease', 'Vegetarian'],
    warningNotice: 'Dietary supplement. Keep out of reach of children. Consult your physician if pregnant, nursing, or taking medication.',
    personalizedReason: 'Eases PMS-related tension and supports restorative overnight recovery.'
  },
  {
    id: 'prod-14',
    name: 'Plant-Based Biotin 10,000 mcg with Bamboo Silica & Amla',
    brand: 'OZiva',
    category: 'Supplements',
    price: 599,
    originalPrice: 699,
    rating: 4.7,
    reviewsCount: 2890,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    shortDesc: 'Sesbania Grandiflora whole-food biotin for hair cortex strength and keratin synthesis.',
    description: '100% natural plant-derived biotin extract combined with bamboo shoot silica, pomegranate, and Indian gooseberry (Amla). Strengthens hair root anchorage, supports healthy nail beds, and boosts skin radiance.',
    ingredients: ['Sesbania Agati Extract (Biotin 10000mcg)', 'Bamboo Shoot Extract (Silica)', 'Amla Extract (Natural Vitamin C)'],
    usage: 'Mix 1 scoop in 150ml of water or take 1 capsule daily after your morning meal.',
    tags: ['100% Plant Based', 'Clean Label', 'Soy Free'],
    warningNotice: 'Nutritional supplement. Maintain balanced dietary intake alongside supplementation.',
    personalizedReason: 'Provides natural micronutrients for hair shaft strength and reduced breakage.'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '🌸 Luteal Phase Gentle Nutrition',
    message: 'You are currently in Day 16 of your cycle (Luteal phase). Magnesium and complex carbs will help keep energy and mood steady today.',
    time: '10 mins ago',
    category: 'Period',
    isRead: false,
    actionText: 'View Cycle Phase',
    actionTargetScreen: 'healing-plan'
  },
  {
    id: 'notif-2',
    title: '🥗 Diet Lab: Lunch Plan Ready',
    message: 'Today\'s recommended meal is the Rainbow Quinoa Power Bowl with Tahini. Packed with sulforaphane and slow-release fiber.',
    time: '1 hour ago',
    category: 'Diet',
    isRead: false,
    actionText: 'Open Recipe',
    actionTargetScreen: 'healing-plan'
  },
  {
    id: 'notif-3',
    title: '💧 Hydration Check with Nesty',
    message: 'Time for a tall glass of mineral water or tender coconut water! You have recorded 4 of your 8 target glasses today.',
    time: '2 hours ago',
    category: 'Health',
    isRead: false,
    actionText: 'Log Water',
    actionTargetScreen: 'dashboard'
  },
  {
    id: 'notif-4',
    title: '🛍️ Well Store: Free Express Delivery',
    message: 'Carmesi Organic Cotton Pads & Minimalist Ceramide Cream are currently eligible for same-day delivery in Indiranagar.',
    time: 'Yesterday',
    category: 'Store',
    isRead: true,
    actionText: 'Explore Store',
    actionTargetScreen: 'store'
  },
  {
    id: 'notif-5',
    title: '🚑 SOS Emergency Network Active',
    message: 'Your emergency location is set to Indiranagar (560038). 3 verified partner hospitals and 24x7 ambulance routes are on standby.',
    time: '2 days ago',
    category: 'SOS',
    isRead: true,
    actionText: 'Review SOS Details',
    actionTargetScreen: 'sos'
  }
];
