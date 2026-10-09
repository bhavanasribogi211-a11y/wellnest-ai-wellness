import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  MapPin,
  Clock,
  CreditCard,
  CheckCircle2,
  Package,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Truck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const {
    userProfile,
    cart,
    cartSubtotal,
    createOrder,
    setIsCartOpen,
    setCurrentScreen,
  } = useApp();

  const [deliveryMethod, setDeliveryMethod] = useState<'Express (30-45 mins)' | 'Standard (Next Day)'>('Express (30-45 mins)');
  const [address, setAddress] = useState(userProfile.location?.fullAddress || 'Flat 402, Green Orchid, Indiranagar, Bengaluru');
  const [pincode, setPincode] = useState(userProfile.location?.pincode || '560038');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const deliveryFee = deliveryMethod.includes('Express') ? 49 : 0;
  const finalTotal = cartSubtotal + deliveryFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      alert('Please provide a delivery address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const order = createOrder(deliveryMethod, `${address}, Pincode: ${pincode}`);
      setConfirmedOrder(order);
      setIsSubmitting(false);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#EC4899', '#38BDF8', '#FDE047'],
        });
      } catch (err) {
        console.error(err);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 z-10 animate-in zoom-in-95 duration-200">
        {confirmedOrder ? (
          /* Order Confirmation View */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Demo Order Placed Successfully
              </span>
              <h3 className="text-xl font-extrabold text-slate-800 font-heading mt-2">
                Thank you, {userProfile.name ? userProfile.name.split(' ')[0] : 'Wellness Friend'}!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Order ID: <span className="font-bold text-slate-700">#{confirmedOrder.id}</span>
              </p>
            </div>

            <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-700 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-600" />
                  Estimated Delivery:
                </span>
                <span className="font-bold text-purple-700">{confirmedOrder.eta}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700 font-medium">
                <span className="flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-purple-600" />
                  Tracking Number:
                </span>
                <span className="font-mono font-bold text-slate-800">{confirmedOrder.trackingNumber}</span>
              </div>
              <div className="pt-2 border-t border-purple-100 flex justify-between items-center font-bold text-slate-900">
                <span>Total Amount Paid (Simulated):</span>
                <span>₹{confirmedOrder.total}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2 text-left">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Demo Mode:</strong> This is an interactive simulation. No real money was charged and no physical items will be dispatched.
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  onClose();
                  setIsCartOpen(false);
                  setCurrentScreen('dashboard');
                }}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  onClose();
                  setIsCartOpen(false);
                  setCurrentScreen('store');
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  💳
                </div>
                <h3 className="text-base font-extrabold text-slate-800 font-heading">
                  Express Checkout
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="py-4 space-y-4 text-xs">
              {/* Delivery Speed Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  Select Delivery Speed
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <div
                    onClick={() => setDeliveryMethod('Express (30-45 mins)')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      deliveryMethod.includes('Express')
                        ? 'border-purple-400 bg-purple-50/60 ring-2 ring-purple-300'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        ⚡ Express
                      </span>
                      <span className="font-extrabold text-purple-700">₹49</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">30–45 Mins delivery</p>
                  </div>

                  <div
                    onClick={() => setDeliveryMethod('Standard (Next Day)')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      !deliveryMethod.includes('Express')
                        ? 'border-purple-400 bg-purple-50/60 ring-2 ring-purple-300'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        📦 Standard
                      </span>
                      <span className="font-extrabold text-emerald-600">FREE</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Tomorrow by 2 PM</p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Shipping Address</span>
                  <span className="text-[11px] text-purple-600 font-semibold cursor-pointer">
                    Editable
                  </span>
                </label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-800 font-medium resize-none"
                  placeholder="Enter your flat/street address..."
                  required
                />
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    className="w-1/2 p-2 rounded-xl border border-slate-200 text-slate-800 font-medium"
                    placeholder="Pincode (e.g. 560038)"
                    required
                  />
                  <div className="w-1/2 flex items-center text-[11px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-purple-500 mr-1" />
                    Indiranagar, BLR
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  Simulated Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'Card', 'COD'] as const).map(pm => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setPaymentMethod(pm)}
                      className={`py-2 px-2 rounded-xl border font-bold text-center transition-all ${
                        paymentMethod === pm
                          ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-2xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pm === 'UPI' ? '📲 UPI Pay' : pm === 'Card' ? '💳 Card' : '💵 Cash'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Items Subtotal ({cart.length} items):</span>
                  <span className="font-semibold text-slate-700">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold text-slate-700">₹{deliveryFee}</span>
                </div>
                <div className="pt-1 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                  <span>Final Payable:</span>
                  <span className="text-purple-700">₹{finalTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold text-sm shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Demo Order...</span>
                ) : (
                  <>
                    <span>Confirm & Place Demo Order (₹{finalTotal})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
