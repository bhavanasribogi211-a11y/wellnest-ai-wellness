import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ScreenId,
  UserProfile,
  CartItem,
  Product,
  NotificationItem,
  NotificationSettings,
  DailyPeriodLog,
  AppointmentBooking,
  LabBooking,
  RideBooking,
  Order,
  ChatMessage,
  Recipe,
  PeriodPhase,
} from '../types';
import {
  DEFAULT_USER_PROFILE,
  INITIAL_NOTIFICATIONS,
  STORE_PRODUCTS,
} from '../data/initialData';
import { NESTY_MASTER_SYSTEM_PROMPT } from '../data/agentSystemPrompt';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface AppContextType {
  // Navigation
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  healingPlanTab: 'diet' | 'exercise' | 'period' | 'foods';
  setHealingPlanTab: (tab: 'diet' | 'exercise' | 'period' | 'foods') => void;

  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  resetProfile: () => void;
  calculateBmi: (heightCm: number, weightKg: number) => { bmi: number; category: string };

  // Meal Plan
  mealPlan: { [key: string]: Recipe };
  addToMealPlan: (recipe: Recipe) => void;
  removeFromMealPlan: (mealType: string) => void;

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  createOrder: (deliveryMethod: 'Express (30-45 mins)' | 'Standard (Next Day)', shippingAddress: string) => Order;

  // Healthcare Bookings
  appointments: AppointmentBooking[];
  bookAppointment: (booking: Omit<AppointmentBooking, 'id' | 'status'>) => AppointmentBooking;
  cancelAppointment: (id: string) => void;
  labBookings: LabBooking[];
  bookLabTest: (booking: Omit<LabBooking, 'id' | 'status'>) => LabBooking;
  activeRide: RideBooking | null;
  bookRide: (ride: Omit<RideBooking, 'id' | 'status'>) => RideBooking;
  cancelRide: () => void;

  // Period Tracking
  periodLogs: DailyPeriodLog[];
  addOrUpdatePeriodLog: (log: DailyPeriodLog) => void;
  currentCycleDay: number;
  currentPhase: PeriodPhase;
  estimatedNextPeriodDate: string;
  daysUntilNextPeriod: number;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  snoozeNotification: (id: string) => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'time'>) => void;
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;

  // Chat & n8n Agent Integration
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => Promise<void>;
  clearChatHistory: () => void;
  isChatLoading: boolean;
  n8nWebhookUrl: string;
  setN8nWebhookUrl: (url: string) => void;
  isN8nAgentEnabled: boolean;
  setIsN8nAgentEnabled: (enabled: boolean) => void;
  useTestWebhookMode: boolean;
  setUseTestWebhookMode: (useTest: boolean) => void;
  n8nAgentStatus: 'ready' | 'inactive' | 'error' | 'testing' | 'untested';
  testN8nConnection: () => Promise<{ success: boolean; message: string; hint?: string }>;

  // Modals / Drawers UI state
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isNotificationSettingsOpen: boolean;
  setIsNotificationSettingsOpen: (open: boolean) => void;
  isGlobalDrawerOpen: boolean;
  setIsGlobalDrawerOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;

  // Water tracking
  waterGlassesToday: number;
  incrementWater: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Sync URL hash with current screen
  const getInitialScreen = (): ScreenId => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    const validScreens: ScreenId[] = ['welcome', 'dashboard', 'healing-plan', 'sos', 'store', 'chat'];
    if (validScreens.includes(hash as ScreenId)) {
      return hash as ScreenId;
    }
    const saved = localStorage.getItem('wellnest_last_screen');
    if (saved && validScreens.includes(saved as ScreenId)) {
      return saved as ScreenId;
    }
    return 'welcome';
  };

  const [currentScreen, setCurrentScreenState] = useState<ScreenId>(getInitialScreen);
  const [healingPlanTab, setHealingPlanTab] = useState<'diet' | 'exercise' | 'period' | 'foods'>('diet');

  // Router history sync
  const setCurrentScreen = (screen: ScreenId) => {
    setCurrentScreenState(screen);
    window.location.hash = `#/${screen}`;
    localStorage.setItem('wellnest_last_screen', screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      const validScreens: ScreenId[] = ['welcome', 'dashboard', 'healing-plan', 'sos', 'store', 'chat'];
      if (validScreens.includes(hash as ScreenId)) {
        setCurrentScreenState(hash as ScreenId);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // User Profile
  const [userProfile, setUserProfileState] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('wellnest_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_USER_PROFILE;
  });

  const calculateBmi = (heightCm: number, weightKg: number) => {
    if (!heightCm || !weightKg || heightCm <= 0) return { bmi: 21, category: 'Normal Healthy Weight' };
    const heightM = heightCm / 100;
    const rawBmi = weightKg / (heightM * heightM);
    const bmi = Math.round(rawBmi * 10) / 10;
    let category = 'Normal Healthy Weight';
    if (bmi < 18.5) category = 'Mildly Underweight';
    else if (bmi < 24.9) category = 'Normal Healthy Weight';
    else if (bmi < 29.9) category = 'Pre-Obesity / Overweight';
    else category = 'High Body Mass Index';
    return { bmi, category };
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfileState(prev => {
      const next = { ...prev, ...updates };
      if (updates.heightCm !== undefined || updates.weightKg !== undefined) {
        const { bmi, category } = calculateBmi(next.heightCm, next.weightKg);
        next.bmi = bmi;
        next.bmiCategory = category;
      }
      localStorage.setItem('wellnest_user_profile', JSON.stringify(next));
      return next;
    });
  };

  const resetProfile = () => {
    setUserProfileState(DEFAULT_USER_PROFILE);
    localStorage.setItem('wellnest_user_profile', JSON.stringify(DEFAULT_USER_PROFILE));
  };

  // Meal Plan
  const [mealPlan, setMealPlan] = useState<{ [key: string]: Recipe }>(() => {
    const saved = localStorage.getItem('wellnest_meal_plan');
    return saved ? JSON.parse(saved) : {};
  });

  const addToMealPlan = (recipe: Recipe) => {
    setMealPlan(prev => {
      const next = { ...prev, [recipe.mealType]: recipe };
      localStorage.setItem('wellnest_meal_plan', JSON.stringify(next));
      return next;
    });
    showToast(`Added ${recipe.name} to your ${recipe.mealType} plan!`, 'success');
  };

  const removeFromMealPlan = (mealType: string) => {
    setMealPlan(prev => {
      const next = { ...prev };
      delete next[mealType];
      localStorage.setItem('wellnest_meal_plan', JSON.stringify(next));
      return next;
    });
    showToast(`Removed meal from ${mealType}`, 'info');
  };

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('wellnest_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Initial sample cart items
    return [
      { product: STORE_PRODUCTS[0], quantity: 1 },
      { product: STORE_PRODUCTS[6], quantity: 2 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('wellnest_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name}" to cart!`, 'success');
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('wellnest_wishlist');
    return saved ? JSON.parse(saved) : [STORE_PRODUCTS[1], STORE_PRODUCTS[3]];
  });

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      let next: Product[];
      if (exists) {
        next = prev.filter(p => p.id !== product.id);
        showToast(`Removed from Wishlist`, 'info');
      } else {
        next = [...prev, product];
        showToast(`Saved to Wishlist! ❤️`, 'success');
      }
      localStorage.setItem('wellnest_wishlist', JSON.stringify(next));
      return next;
    });
  };

  const isInWishlist = (productId: string) => wishlist.some(p => p.id === productId);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('wellnest_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const createOrder = (
    deliveryMethod: 'Express (30-45 mins)' | 'Standard (Next Day)',
    shippingAddress: string
  ) => {
    const deliveryFee = deliveryMethod.includes('Express') ? 49 : 0;
    const newOrder: Order = {
      id: `WN-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      total: cartSubtotal + deliveryFee,
      deliveryMethod,
      shippingAddress,
      status: 'Confirmed',
      eta: deliveryMethod.includes('Express') ? '35 mins' : 'Tomorrow by 2:00 PM',
      trackingNumber: `TRK${Date.now().toString().slice(-6)}`,
    };
    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    localStorage.setItem('wellnest_orders', JSON.stringify(nextOrders));
    clearCart();
    showToast(`Order #${newOrder.id} confirmed!`, 'success');
    return newOrder;
  };

  // Healthcare Bookings
  const [appointments, setAppointments] = useState<AppointmentBooking[]>(() => {
    const saved = localStorage.getItem('wellnest_appointments');
    return saved ? JSON.parse(saved) : [];
  });

  const bookAppointment = (booking: Omit<AppointmentBooking, 'id' | 'status'>) => {
    const newAppt: AppointmentBooking = {
      ...booking,
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Confirmed',
    };
    const next = [newAppt, ...appointments];
    setAppointments(next);
    localStorage.setItem('wellnest_appointments', JSON.stringify(next));
    showToast(`Appointment booked with ${booking.doctorName}!`, 'success');
    addNotification({
      title: `🩺 Doctor Appointment Confirmed`,
      message: `Your appointment with ${booking.doctorName} at ${booking.hospitalName} is set for ${booking.date} (${booking.slot}).`,
      category: 'SOS',
      isRead: false,
      actionText: 'View SOS Details',
      actionTargetScreen: 'sos',
    });
    return newAppt;
  };

  const cancelAppointment = (id: string) => {
    setAppointments(prev => {
      const next = prev.map(a => (a.id === id ? { ...a, status: 'Cancelled' as const } : a));
      localStorage.setItem('wellnest_appointments', JSON.stringify(next));
      return next;
    });
    showToast('Appointment cancelled', 'info');
  };

  const [labBookings, setLabBookings] = useState<LabBooking[]>(() => {
    const saved = localStorage.getItem('wellnest_lab_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const bookLabTest = (booking: Omit<LabBooking, 'id' | 'status'>) => {
    const newBooking: LabBooking = {
      ...booking,
      id: `LAB-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Confirmed',
    };
    const next = [newBooking, ...labBookings];
    setLabBookings(next);
    localStorage.setItem('wellnest_lab_bookings', JSON.stringify(next));
    showToast(`Lab test booked with ${booking.labName}!`, 'success');
    addNotification({
      title: `🔬 Diagnostic Test Booked`,
      message: `Your tests at ${booking.labName} are confirmed for ${booking.date} (${booking.timeSlot}). ${booking.homeCollection ? 'Home collection assigned.' : 'Visit center directly.'}`,
      category: 'Health',
      isRead: false,
      actionText: 'View Bookings',
      actionTargetScreen: 'sos',
    });
    return newBooking;
  };

  const [activeRide, setActiveRide] = useState<RideBooking | null>(() => {
    const saved = localStorage.getItem('wellnest_active_ride');
    return saved ? JSON.parse(saved) : null;
  });

  const bookRide = (ride: Omit<RideBooking, 'id' | 'status'>) => {
    const newRide: RideBooking = {
      ...ride,
      id: `RD-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Assigned',
    };
    setActiveRide(newRide);
    localStorage.setItem('wellnest_active_ride', JSON.stringify(newRide));
    showToast(`Driver assigned! Arriving in ${ride.etaMinutes} mins.`, 'success');
    addNotification({
      title: `🚖 ${ride.rideType} Arriving Soon (OTP: ${ride.otp})`,
      message: `${ride.driverName} (${ride.vehicleNumber}) is en route to ${ride.pickupAddress}.`,
      category: 'SOS',
      isRead: false,
      actionText: 'Track Ride',
      actionTargetScreen: 'sos',
    });
    return newRide;
  };

  const cancelRide = () => {
    setActiveRide(null);
    localStorage.removeItem('wellnest_active_ride');
    showToast('Ride cancelled', 'info');
  };

  // Period Tracking Calculations
  const calculateCycleInfo = () => {
    const lastDate = new Date(userProfile.lastPeriodDate);
    const today = new Date();
    const cycleLength = userProfile.cycleLength || 28;
    const periodDuration = userProfile.periodDuration || 5;

    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const dayOfCycle = (diffDays % cycleLength) + 1;

    let phase: PeriodPhase = 'Menstruation';
    if (dayOfCycle <= periodDuration) {
      phase = 'Menstruation';
    } else if (dayOfCycle < Math.floor(cycleLength / 2) - 1) {
      phase = 'Follicular';
    } else if (dayOfCycle <= Math.floor(cycleLength / 2) + 2) {
      phase = 'Ovulation';
    } else {
      phase = 'Luteal';
    }

    const nextPeriodDateObj = new Date(lastDate);
    const cyclesPassed = Math.floor(diffDays / cycleLength) + 1;
    nextPeriodDateObj.setDate(lastDate.getDate() + cyclesPassed * cycleLength);

    const nextDaysDiff = Math.ceil((nextPeriodDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
      currentCycleDay: dayOfCycle,
      currentPhase: phase,
      estimatedNextPeriodDate: nextPeriodDateObj.toISOString().split('T')[0],
      daysUntilNextPeriod: Math.max(1, nextDaysDiff),
    };
  };

  const { currentCycleDay, currentPhase, estimatedNextPeriodDate, daysUntilNextPeriod } = calculateCycleInfo();

  // Period Logs
  const [periodLogs, setPeriodLogs] = useState<DailyPeriodLog[]>(() => {
    const saved = localStorage.getItem('wellnest_period_logs');
    if (saved) return JSON.parse(saved);
    return [
      {
        date: '2026-09-24',
        flow: 'Heavy',
        mood: 'Tired',
        pain: 'Moderate',
        symptoms: ['Cramps', 'Bloating', 'Fatigue'],
        discharge: 'None',
        notes: 'First day, hot water bag helped immensely.',
        waterIntakeGlasses: 6,
      },
      {
        date: '2026-09-25',
        flow: 'Medium',
        mood: 'Calm',
        pain: 'Mild',
        symptoms: ['Mild Cramps'],
        discharge: 'None',
        notes: 'Had chamomile tea before bed.',
        waterIntakeGlasses: 7,
      },
      {
        date: '2026-09-26',
        flow: 'Light',
        mood: 'Energetic',
        pain: 'None',
        symptoms: [],
        discharge: 'None',
        notes: 'Did 15 min gentle yoga.',
        waterIntakeGlasses: 8,
      },
    ];
  });

  const addOrUpdatePeriodLog = (newLog: DailyPeriodLog) => {
    setPeriodLogs(prev => {
      const filtered = prev.filter(l => l.date !== newLog.date);
      const next = [newLog, ...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      localStorage.setItem('wellnest_period_logs', JSON.stringify(next));
      return next;
    });
    showToast(`Period log saved for ${newLog.date}! 🌸`, 'success');
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('wellnest_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('wellnest_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All notifications marked as read', 'info');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Notification deleted', 'info');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('Cleared all notifications', 'info');
  };

  const snoozeNotification = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, time: 'Snoozed for 1 hour' } : n)));
    showToast('Notification snoozed for 1 hour ⏰', 'info');
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'time'>) => {
    const newItem: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      time: 'Just now',
    };
    setNotifications(prev => [newItem, ...prev]);
  };

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('wellnest_notif_settings');
    return saved
      ? JSON.parse(saved)
      : {
          period: true,
          diet: true,
          water: true,
          exercise: true,
          medicines: true,
          store: true,
          appointments: true,
          sound: true,
          vibration: false,
        };
  });

  const updateNotificationSettings = (updates: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('wellnest_notif_settings', JSON.stringify(next));
      return next;
    });
    showToast('Notification preferences updated!', 'success');
  };

  // n8n Agent Integration Settings
  const [n8nWebhookUrl, setN8nWebhookUrlState] = useState<string>(() => {
    return localStorage.getItem('wellnest_n8n_url') || 'https://bhavana21.app.n8n.cloud/webhook/b634992d-9383-4493-a980-a84db05a68d4/chat';
  });

  const setN8nWebhookUrl = (url: string) => {
    setN8nWebhookUrlState(url);
    localStorage.setItem('wellnest_n8n_url', url);
  };

  const [isN8nAgentEnabled, setIsN8nAgentEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem('wellnest_n8n_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  const setIsN8nAgentEnabled = (enabled: boolean) => {
    setIsN8nAgentEnabledState(enabled);
    localStorage.setItem('wellnest_n8n_enabled', enabled ? 'true' : 'false');
  };

  const [useTestWebhookMode, setUseTestWebhookMode] = useState<boolean>(false);
  const [n8nAgentStatus, setN8nAgentStatus] = useState<'ready' | 'inactive' | 'error' | 'testing' | 'untested'>('untested');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Auto-check n8n status on mount and when settings change
  useEffect(() => {
    if (isN8nAgentEnabled) {
      const timer = setTimeout(() => {
        testN8nConnection();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setN8nAgentStatus('inactive');
    }
  }, [isN8nAgentEnabled, useTestWebhookMode, n8nWebhookUrl]);

  // Chat Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('wellnest_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Clean out any legacy or stale error hint boxes from saved messages
          return parsed.map((m: ChatMessage) => ({ ...m, hint: undefined }));
        }
      } catch (e) {
        console.warn('Failed parsing chat history:', e);
      }
    }
    return [
      {
        id: 'msg-1',
        sender: 'nesty',
        text: `Hi ${userProfile.name || 'there'}! 🐣 I'm Nesty, your 24/7 wellness companion. How are you feeling today? Need hormone-friendly recipes, cycle predictions, skin analysis, or help booking a doctor?`,
        timestamp: '10:00 AM',
        agentSource: 'n8n',
      },
    ];
  });

  const clearChatHistory = () => {
    const initial: ChatMessage[] = [
      {
        id: `msg-${Date.now()}`,
        sender: 'nesty',
        text: `Chat reset. I'm ready to assist you, ${userProfile.name ? userProfile.name.split(' ')[0] : 'friend'}! 🐣 How can I support your wellness today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentSource: 'n8n',
      },
    ];
    setChatMessages(initial);
    localStorage.setItem('wellnest_chat_history', JSON.stringify(initial));
    showToast('Chat history cleared', 'info');
  };

  // Test Connection to n8n Webhook
  const testN8nConnection = async (): Promise<{ success: boolean; message: string; hint?: string }> => {
    setN8nAgentStatus('testing');
    const endpoint = useTestWebhookMode ? '/api/n8n-webhook-test' : '/api/n8n-webhook';
    try {
      const payload = {
        chatInput: 'Hello n8n test ping',
        message: 'Hello n8n test ping',
        sessionId: 'wellnest-ping-test',
      };

      let response: Response;
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (proxyErr) {
        // Fallback to direct URL if proxy is unavailable
        const targetUrl = useTestWebhookMode
          ? n8nWebhookUrl.replace('/webhook/', '/webhook-test/')
          : n8nWebhookUrl;
        response = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        setN8nAgentStatus('ready');
        return { success: true, message: 'n8n Agent is live, connected and responding!' };
      }

      const resData = await response.json().catch(() => null);
      const isWorkflowInactive =
        response.status === 404 ||
        resData?.code === 404 ||
        (typeof resData?.message === 'string' &&
          (resData.message.toLowerCase().includes('not registered') ||
            resData.message.toLowerCase().includes('not active') ||
            resData.message.toLowerCase().includes('does not exist')));

      if (isWorkflowInactive) {
        setN8nAgentStatus('inactive');
        return {
          success: false,
          message: 'Webhook reached! Workflow is currently inactive in your n8n cloud workspace.',
          hint:
            resData?.hint ||
            'Open your workflow at bhavana21.app.n8n.cloud and toggle the switch in the top-right corner to "Active". In the meantime, Nesty\'s local engine is answering seamlessly!',
        };
      }

      setN8nAgentStatus('error');
      return {
        success: false,
        message: `HTTP ${response.status}: ${resData?.message || 'Agent not responding'}`,
      };
    } catch (err: any) {
      setN8nAgentStatus('error');
      return {
        success: false,
        message: err.message || 'Network error reaching n8n agent.',
      };
    }
  };

  // Generate response strictly aligned with NESTY_MASTER_SYSTEM_PROMPT
  const generateFallbackResponse = (text: string) => {
    const lower = text.toLowerCase();
    const userName = userProfile.name ? userProfile.name.split(' ')[0] : '';
    const namePrefix = userName ? `${userName}, ` : '';
    let reply = '';
    let quickAction: ChatMessage['quickAction'] = undefined;

    // 1. EMERGENCY SOS AND SAFETY (Top priority check)
    if (
      lower.includes('chest pain') ||
      lower.includes('faint') ||
      lower.includes('difficulty breathing') ||
      lower.includes('shortness of breath') ||
      lower.includes('bleed heavily') ||
      lower.includes('uncontrolled bleeding') ||
      lower.includes('emergency') ||
      lower.includes('severe acute pain')
    ) {
      reply = `🚨 Please seek emergency medical assistance immediately! If you are in India, dial 112 or visit the nearest hospital emergency room. Do not delay emergency care.\n\nYou can access quick emergency dispatch and nearby multi-specialty trauma centers directly in the WellNest SOS screen.`;
      quickAction = { label: 'Open Emergency SOS', screen: 'sos' };
      return { reply, quickAction };
    }

    // 2. GREETINGS & INTRODUCTIONS
    if (
      lower === 'hi' ||
      lower === 'hello' ||
      lower === 'hey' ||
      lower.startsWith('hi ') ||
      lower.startsWith('hello ') ||
      lower.startsWith('hey ') ||
      lower.includes('how are you') ||
      lower.includes('who are you')
    ) {
      reply = `Hello ${namePrefix}🐣! I'm Nesty, your 24/7 wellness companion here at WellNest.

Today you are on **Cycle Day ${currentCycleDay} (${currentPhase} Phase)**. Here is how I can support you right now:
• 🌸 **Cycle & Hormonal Syncing**: Personalized tips for your ${currentPhase} phase
• 🥗 **Diet Lab**: Hormone-balancing recipes & anti-inflammatory meal kits
• ✨ **Skin & Scalp Care**: Science-backed routines for your ${userProfile.skinType} skin
• 🧘 **Gentle Movement**: Restorative yoga poses & breathing timers
• 🏥 **Healthcare Navigation**: Book consultations with vetted doctors or diagnostic labs

How are you feeling today? What would you like to explore?`;
      quickAction = { label: 'Explore Healing Plan', screen: 'healing-plan' };
      return { reply, quickAction };
    }

    // 3. MENSTRUAL-CYCLE & HORMONAL HEALTH
    if (
      lower.includes('cramp') ||
      lower.includes('period') ||
      lower.includes('cycle') ||
      lower.includes('pms') ||
      lower.includes('flow') ||
      lower.includes('phase') ||
      lower.includes('ovulat') ||
      lower.includes('bleed') ||
      lower.includes('follicular') ||
      lower.includes('luteal')
    ) {
      reply = `Hello ${namePrefix}🐣! According to your cycle profile, you are on **Day ${currentCycleDay} (${currentPhase} phase)**:

${
  currentPhase === 'Menstruation'
    ? '• **Menstruation Phase**: Your uterine lining is shedding. Estrogen and progesterone are at baseline. Prioritize gentle rest, hydration, magnesium-rich foods (dark chocolate, pumpkin seeds), and warm compresses for pelvic comfort. Try the 12-minute Reclined Butterfly pose.'
    : currentPhase === 'Follicular'
    ? '• **Follicular Phase**: Estrogen is steadily rising to support follicle development. You may notice higher energy, sharper focus, and brighter skin. Great time for vibrant rainbow bowls, fermented sourdough, and brisk walks.'
    : currentPhase === 'Ovulation'
    ? '• **Ovulation Phase**: Peak estrogen triggers luteinizing hormone (LH). Stamina is elevated. Note: calendar forecasts are informational estimates and must never be used as contraception.'
    : '• **Luteal Phase**: Progesterone dominates. Mild fluid retention, cravings, or mood shifts are common. Nourish yourself with complex carbohydrates (sweet potato, oats), magnesium bisglycinate, and calming 4-7-8 breathing.'
}

You can log daily symptoms, flow, and mood changes in the Period Tracker for personalized cycle insights.

*These suggestions are for educational wellness support and do not replace clinical advice from a gynecologist.*`;
      quickAction = { label: 'Open Period Tracker', screen: 'healing-plan' };
    }
    // 4. DIET LAB, RECIPES & NUTRITION
    else if (
      lower.includes('diet') ||
      lower.includes('food') ||
      lower.includes('recipe') ||
      lower.includes('eat') ||
      lower.includes('hungry') ||
      lower.includes('meal') ||
      lower.includes('breakfast') ||
      lower.includes('lunch') ||
      lower.includes('dinner') ||
      lower.includes('snack') ||
      lower.includes('oatmeal') ||
      lower.includes('quinoa')
    ) {
      reply = `Hi ${namePrefix}🐣! Here are nourishing, hormone-friendly recipe options from the WellNest Diet Lab:

🥣 **Hormone Balance Oatmeal Bowl** (Breakfast | 340 kcal)
• Rolled oats, ground flaxseed (lignans for estrogen metabolism), chia seeds, blueberries, walnuts, and cinnamon.

🥑 **Sourdough Avocado & Poached Egg Toast** (Breakfast | 380 kcal)
• Fermented sourdough, ripe avocado, pasture-raised egg, microgreens, and hemp seeds (healthy fats, Vitamin E).

🥗 **Rainbow Quinoa Power Bowl** (Lunch | 460 kcal)
• Tri-color quinoa, roasted spiced chickpeas, shredded purple cabbage, baby spinach, and tahini lemon dressing.

🍲 **Turmeric Spiced Lentil & Spinach Stew** (Dinner | 390 kcal)
• Yellow lentils, cumin, fresh ginger, turmeric (curcumin for inflammation), and coconut oil.

🍫 **Walnut & Dark Chocolate Energy Bites** (Snack | 160 kcal)
• Medjool dates, raw walnuts, pumpkin seeds, and cacao nibs.

Explore our curated Diet Kits (Hormonal Wellness, Glowing Skin, Hair Care, Weight Management) in the Diet Lab!

*Meals support general vitality but do not cure medical conditions.*`;
      quickAction = { label: 'Explore Diet Lab', screen: 'healing-plan' };
    }
    // 5. SKINCARE & HAIRCARE
    else if (
      lower.includes('skin') ||
      lower.includes('hair') ||
      lower.includes('scalp') ||
      lower.includes('acne') ||
      lower.includes('fall') ||
      lower.includes('shampoo') ||
      lower.includes('serum') ||
      lower.includes('moisturiz') ||
      lower.includes('dry skin') ||
      lower.includes('oily skin')
    ) {
      reply = `Hello ${namePrefix}🐣! Customized for your **${userProfile.skinType} skin**, **${userProfile.hairType} hair**, and **${userProfile.scalpType} scalp**:

✨ **Skincare Protocol**:
• **Cleanse**: Use a pH-balanced, non-stripping cleanser twice daily.
• **Hydrate & Barrier**: Seek ceramides (NP/AP), hyaluronic acid, and niacinamide with zinc to balance sebum and support the skin barrier.
• **Protect**: Broad-spectrum SPF 50 sunscreen every morning.
• **Patch Testing**: Always patch test active serums behind your ear before full application.

🌿 **Hair & Scalp Protocol**:
• **Scalp Care**: Clarify gently without stripping natural lipids.
• **Nourishment**: Warm rosemary or cold-pressed argan oil massage (10 mins) to support microcirculation.
• Avoid aggressive detangling when hair is wet.

Discover dermatologist-reviewed barrier creams, scalp tonics, and organic hair serums in the Well Store.

*For sudden patchy hair loss or cystic acne, consult a board-certified dermatologist.*`;
      quickAction = { label: 'Visit Well Store', screen: 'store' };
    }
    // 6. EXERCISE, YOGA & RELAXATION
    else if (
      lower.includes('exercise') ||
      lower.includes('workout') ||
      lower.includes('yoga') ||
      lower.includes('breath') ||
      lower.includes('relax') ||
      lower.includes('walk') ||
      lower.includes('stretch')
    ) {
      reply = `Hi ${namePrefix}🐣! Gentle movement helps regulate cortisol, relieve menstrual congestion, and uplift your mood:

🧘 **Reclined Butterfly Pose (Supta Baddha Konasana)** — 12 mins
• Releases tension in the hips and pelvic floor, comforting cramps and lower back ache.

🚶‍♀️ **Brisk Morning Sunlight Walk** — 25 mins
• Aligns your circadian rhythm, boosts serotonin, and improves insulin sensitivity.

💆‍♀️ **Ayurvedic Scalp & Temple Massage** — 10 mins
• Relieves mental fatigue and stimulates blood flow to follicles.

🌬️ **4-7-8 Relaxation Breathing** — 10 mins
• Inhale through nose for 4 counts, hold for 7, exhale through mouth for 8. Activates the parasympathetic nervous system.

You can launch guided countdown timers right inside the Exercise Plan screen! Stop immediately if you feel pain or dizziness.`;
      quickAction = { label: 'Start Exercise Timer', screen: 'healing-plan' };
    }
    // 7. BMI, WEIGHT & METABOLISM
    else if (
      lower.includes('bmi') ||
      lower.includes('weight') ||
      lower.includes('fat') ||
      lower.includes('lose') ||
      lower.includes('gain') ||
      lower.includes('metabol')
    ) {
      reply = `Hello ${namePrefix}🐣! Your profile BMI is **${userProfile.bmi || '21.5'}** (${userProfile.bmiCategory || 'Normal Healthy Range'}).

At WellNest, we prioritize sustainable metabolic health over restrictive dieting:
• **Protein Pacing**: Aim for 25–30g clean protein per meal (eggs, lentils, tofu, Greek yogurt) to stabilize blood sugar and preserve lean muscle.
• **Fiber Diversity**: 30g+ daily fiber from flaxseeds, chia, vegetables, and complex grains to support gut microbiome and estrogen excretion.
• **Resistance & Walking**: Daily 20–30 min walks combined with 2 weekly bodyweight sessions.

Check out our Weight Management Diet Kit in the Diet Lab for wholesome meal schedules!`;
      quickAction = { label: 'View Weight Kit', screen: 'healing-plan' };
    }
    // 8. DOCTORS, HOSPITALS, SPECIALISTS & LABS
    else if (
      lower.includes('doctor') ||
      lower.includes('hospital') ||
      lower.includes('clinic') ||
      lower.includes('test') ||
      lower.includes('lab') ||
      lower.includes('gynecologist') ||
      lower.includes('dermatologist') ||
      lower.includes('appointment')
    ) {
      reply = `Hi ${namePrefix}🐣! You can find vetted doctors and accredited diagnostics in our Healthcare Directory:

🏥 **Hospitals & Specialty Clinics**:
• **Manipal Hospital** (Gynecology, Obstetrics, Dermatology, 24x7 Emergency)
• **Cloudnine Hospital for Women** (Reproductive endocrinology, prenatal & PCOS care)
• **Apollo Cradle & Children's Hospital** (Women's specialty wellness)

🔬 **Diagnostic Lab Panels**:
• Comprehensive Female Hormone Profile (FSH, LH, Prolactin, Estradiol)
• Thyroid Complete Profile (TSH, Free T3, Free T4) with home sample collection.

You can view available doctor slots and simulated appointment booking in the SOS & Healthcare screen.`;
      quickAction = { label: 'Go to SOS & Doctors', screen: 'sos' };
    }
    // 9. WELL STORE & PRODUCTS
    else if (
      lower.includes('store') ||
      lower.includes('product') ||
      lower.includes('buy') ||
      lower.includes('price') ||
      lower.includes('supplement') ||
      lower.includes('vitamin') ||
      lower.includes('pad') ||
      lower.includes('tampon')
    ) {
      reply = `Hi ${namePrefix}🐣! The Well Store features doctor-vetted wellness essentials:

• **Ceramide Barrier Cream** (₹650) — NP/AP ceramides & squalane
• **Rosemary & Biotin Scalp Serum** (₹550) — Microcirculation booster
• **Organic Cotton Period Pads** (₹299) — Chlorine-free, breathable
• **Magnesium Bisglycinate Complex** (₹750) — PMS cramp & sleep support
• **Hormone Balance Seed Cycling Mix** (₹420) — Raw organic seeds

All products feature clear ingredient lists and same-day express delivery!`;
      quickAction = { label: 'Open Well Store', screen: 'store' };
    }
    // 10. GENERAL / CATCH-ALL
    else {
      reply = `Hi ${namePrefix}🐣! I'm Nesty, your 24/7 wellness companion. I can help you with:

1. 🌸 **Menstrual cycle education** & active ${currentPhase} phase insights
2. 🥗 **Anti-inflammatory recipes** & Diet Lab meal plans
3. ✨ **Skincare & haircare ingredients** tailored to your ${userProfile.skinType} skin
4. 🧘 **Guided yoga, walking**, and relaxation timers
5. 🏥 **Navigating the Well Store** or Healthcare Directory

What question is on your mind today?`;
      quickAction = { label: 'View Dashboard', screen: 'dashboard' };
    }

    return { reply, quickAction };
  };

  const sendChatMessage = async (text: string) => {
    if (!text.trim() || isChatLoading) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: nowTime,
    };

    const newChat = [...chatMessages, userMsg];
    setChatMessages(newChat);
    setIsChatLoading(true);

    let reply = '';
    let quickAction: ChatMessage['quickAction'] = undefined;
    let agentSource: 'n8n' | 'nesty-local' = 'nesty-local';

    if (isN8nAgentEnabled) {
      try {
        const endpoint = useTestWebhookMode ? '/api/n8n-webhook-test' : '/api/n8n-webhook';
        const payload = {
          chatInput: text.trim(),
          message: text.trim(),
          systemPrompt: NESTY_MASTER_SYSTEM_PROMPT,
          sessionId: `wellnest-user-${userProfile.name || 'guest'}`,
          user: {
            name: userProfile.name,
            age: userProfile.age,
            bmi: userProfile.bmi,
            bmiCategory: userProfile.bmiCategory,
            cycleDay: currentCycleDay,
            phase: currentPhase,
            skinType: userProfile.skinType,
            hairType: userProfile.hairType,
            scalpType: userProfile.scalpType,
            location: userProfile.location?.area,
          },
        };

        let response: Response;
        try {
          response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch (fetchErr) {
          // Direct fallback if proxy is unmounted
          const targetUrl = useTestWebhookMode
            ? n8nWebhookUrl.replace('/webhook/', '/webhook-test/')
            : n8nWebhookUrl;
          response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        }

        if (response.ok) {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await response.json();
            if (typeof data === 'string') {
              reply = data;
            } else if (Array.isArray(data)) {
              const item = data[0];
              reply =
                item?.output ||
                item?.text ||
                item?.response ||
                item?.message ||
                item?.json?.output ||
                item?.json?.text ||
                item?.json?.response ||
                JSON.stringify(data);
            } else if (typeof data === 'object' && data !== null) {
              reply =
                data.output ||
                data.text ||
                data.response ||
                data.message ||
                data.json?.output ||
                data.json?.text ||
                data.data?.output ||
                (typeof data.output === 'object' ? JSON.stringify(data.output) : JSON.stringify(data));
            }
          } else {
            reply = await response.text();
          }
          agentSource = 'n8n';
          setN8nAgentStatus('ready');
        } else {
          const resData = await response.json().catch(() => null);
          const isWorkflowInactive =
            response.status === 404 ||
            resData?.code === 404 ||
            (typeof resData?.message === 'string' &&
              (resData.message.toLowerCase().includes('not registered') ||
                resData.message.toLowerCase().includes('not active')));

          if (isWorkflowInactive) {
            setN8nAgentStatus('inactive');
          } else {
            setN8nAgentStatus('error');
          }

          // Seamless fallback to local intelligence without message error banners
          const fallback = generateFallbackResponse(text);
          reply = fallback.reply;
          quickAction = fallback.quickAction;
          agentSource = 'nesty-local';
        }
      } catch (err: any) {
        console.warn('n8n agent webhook unavailable, falling back:', err);
        setN8nAgentStatus('error');
        const fallback = generateFallbackResponse(text);
        reply = fallback.reply;
        quickAction = fallback.quickAction;
        agentSource = 'nesty-local';
      }
    } else {
      // Local Nesty rule-based engine
      await new Promise(r => setTimeout(r, 350));
      const fallback = generateFallbackResponse(text);
      reply = fallback.reply;
      quickAction = fallback.quickAction;
      agentSource = 'nesty-local';
    }

    setIsChatLoading(false);

    const nestyMsg: ChatMessage = {
      id: `chat-${Date.now() + 1}`,
      sender: 'nesty',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentSource,
      quickAction,
    };

    setChatMessages(prev => {
      const updated = [...prev, nestyMsg];
      localStorage.setItem('wellnest_chat_history', JSON.stringify(updated));
      return updated;
    });
  };

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [isGlobalDrawerOpen, setIsGlobalDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Toast system
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  // Water tracking
  const [waterGlassesToday, setWaterGlassesToday] = useState<number>(() => {
    const saved = localStorage.getItem('wellnest_water_glasses');
    return saved ? parseInt(saved, 10) : 5;
  });

  const incrementWater = () => {
    setWaterGlassesToday(prev => {
      const next = prev >= 12 ? 1 : prev + 1;
      localStorage.setItem('wellnest_water_glasses', next.toString());
      return next;
    });
    showToast(`Hydration logged: ${waterGlassesToday + 1} glasses today! 💧`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        healingPlanTab,
        setHealingPlanTab,
        userProfile,
        updateUserProfile,
        resetProfile,
        calculateBmi,
        mealPlan,
        addToMealPlan,
        removeFromMealPlan,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        createOrder,
        appointments,
        bookAppointment,
        cancelAppointment,
        labBookings,
        bookLabTest,
        activeRide,
        bookRide,
        cancelRide,
        periodLogs,
        addOrUpdatePeriodLog,
        currentCycleDay,
        currentPhase,
        estimatedNextPeriodDate,
        daysUntilNextPeriod,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        clearAllNotifications,
        snoozeNotification,
        addNotification,
        notificationSettings,
        updateNotificationSettings,
        chatMessages,
        sendChatMessage,
        clearChatHistory,
        isChatLoading,
        n8nWebhookUrl,
        setN8nWebhookUrl,
        isN8nAgentEnabled,
        setIsN8nAgentEnabled,
        useTestWebhookMode,
        setUseTestWebhookMode,
        n8nAgentStatus,
        testN8nConnection,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isNotificationSettingsOpen,
        setIsNotificationSettingsOpen,
        isGlobalDrawerOpen,
        setIsGlobalDrawerOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isSearchOpen,
        setIsSearchOpen,
        toasts,
        showToast,
        waterGlassesToday,
        incrementWater,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
