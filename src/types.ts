export type ScreenId = 'welcome' | 'dashboard' | 'healing-plan' | 'sos' | 'store' | 'chat';

export interface UserProfile {
  name: string;
  age: number;
  heightCm: number;
  weightKg: number;
  bmi: number;
  bmiCategory: string;
  scalpType: 'Oily' | 'Dry' | 'Normal' | 'Sensitive' | 'Combination';
  hairType: 'Straight' | 'Wavy' | 'Curly' | 'Coily';
  hairConcerns: string[];
  hairWashFrequency: string;
  skinType: 'Oily' | 'Dry' | 'Combination' | 'Normal' | 'Sensitive';
  skinConcerns: string[];
  lastPeriodDate: string; // YYYY-MM-DD
  cycleRegularity: 'Regular' | 'Irregular' | 'Occasionally Irregular';
  cycleLength: number; // 21 - 35 days
  periodDuration: number; // typically 4 - 7 days
  flow: 'Light' | 'Moderate' | 'Heavy';
  mood: string;
  location: {
    area: string;
    landmark: string;
    fullAddress: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
    isDetected?: boolean;
  };
  hasCompletedOnboarding: boolean;
}

export type PeriodPhase = 'Menstruation' | 'Follicular' | 'Ovulation' | 'Luteal';

export interface DailyPeriodLog {
  date: string; // YYYY-MM-DD
  flow: 'None' | 'Spotting' | 'Light' | 'Medium' | 'Heavy';
  mood: 'Calm' | 'Happy' | 'Energetic' | 'Anxious' | 'Irritable' | 'Tired' | 'Sad';
  pain: 'None' | 'Mild' | 'Moderate' | 'Severe';
  symptoms: string[];
  discharge: 'None' | 'Dry' | 'Sticky' | 'Creamy' | 'Egg-white' | 'Watery';
  notes?: string;
  waterIntakeGlasses?: number;
}

export interface Recipe {
  id: string;
  name: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  category: 'Weight Management' | 'Bone Health' | 'Hormonal Wellness' | 'Glowing Skin' | 'Hair Care';
  calories: number;
  prepTime: string;
  image: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  nutritionalBenefits: string[];
  personalizedNote: string;
}

export interface ExerciseItem {
  id: string;
  title: string;
  category: 'Yoga' | 'Walking' | 'Fitness' | 'Relaxation' | 'Hair-Care Massage' | 'Facial Relaxation' | 'Bone Strength';
  durationMinutes: number;
  difficulty: 'Gentle' | 'Moderate' | 'Active';
  image: string;
  benefits: string[];
  steps: string[];
  tips: string;
}

export interface WellnessFood {
  id: string;
  name: string;
  category: string;
  benefits: string[];
  richIn: string[];
  servingSuggestion: string;
  image: string;
  calories: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  languages: string[];
  image: string;
  consultationFee: number;
  availability: string[];
  about: string;
}

export interface Hospital {
  id: string;
  name: string;
  distanceKm: number;
  address: string;
  emergencyPhone: string;
  generalPhone: string;
  rating: number;
  open24x7: boolean;
  services: string[];
  image: string;
  doctors: Doctor[];
  bedsAvailable: number;
}

export interface LabTest {
  id: string;
  name: string;
  price: number;
  fastingRequired: boolean;
  tatHours: string;
  description: string;
}

export interface Laboratory {
  id: string;
  name: string;
  distanceKm: number;
  address: string;
  phone: string;
  rating: number;
  homeCollection: boolean;
  image: string;
  tests: LabTest[];
}

export interface RideOption {
  id: string;
  type: 'Bike' | 'Auto' | 'Ambulance' | 'Cab';
  etaMinutes: number;
  price: number;
  icon: string;
  description: string;
  isEmergencyAmbulance?: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'Skin Care' | 'Hair Care' | 'Period Essentials' | 'Medicines' | 'Supplements';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  shortDesc: string;
  description: string;
  ingredients: string[];
  usage: string;
  tags: string[];
  prescriptionRequired?: boolean;
  warningNotice?: string;
  personalizedReason?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryMethod: 'Express (30-45 mins)' | 'Standard (Next Day)';
  shippingAddress: string;
  status: 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered';
  eta: string;
  trackingNumber: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  category: 'Period' | 'Diet' | 'Store' | 'SOS' | 'Health';
  isRead: boolean;
  actionText?: string;
  actionTargetScreen?: ScreenId;
  actionPayload?: any;
}

export interface NotificationSettings {
  period: boolean;
  diet: boolean;
  water: boolean;
  exercise: boolean;
  medicines: boolean;
  store: boolean;
  appointments: boolean;
  sound: boolean;
  vibration: boolean;
}

export interface AppointmentBooking {
  id: string;
  hospitalName: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  slot: string;
  patientName: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  consultationFee: number;
}

export interface LabBooking {
  id: string;
  labName: string;
  testNames: string[];
  date: string;
  timeSlot: string;
  patientName: string;
  homeCollection: boolean;
  totalPrice: number;
  status: 'Confirmed' | 'Sample Collected' | 'Report Ready';
}

export interface RideBooking {
  id: string;
  rideType: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  otp: string;
  etaMinutes: number;
  price: number;
  pickupAddress: string;
  hospitalName: string;
  status: 'Assigned' | 'Arrived' | 'In Transit' | 'Completed' | 'Cancelled';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'nesty';
  text: string;
  timestamp: string;
  agentSource?: 'n8n' | 'nesty-local';
  hint?: string;
  quickAction?: {
    label: string;
    screen: ScreenId;
  };
}
