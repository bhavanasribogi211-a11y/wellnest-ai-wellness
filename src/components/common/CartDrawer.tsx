import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartSubtotal,
    cartCount,
    updateCartQuantity,
    removeFromCart,
    setCurrentScreen,
  } = useApp();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 500;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        />

        <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-800 font-heading">
                  Your Wellness Bag
                </h2>
                <p className="text-xs text-purple-600 font-medium">
                  {cartCount} item{cartCount === 1 ? '' : 's'} selected
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Bar */}
          {cart.length > 0 && (
            <div className="px-4 py-2.5 bg-purple-50/70 border-b border-purple-100">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5 text-purple-700">
                  <Truck className="w-3.5 h-3.5" />
                  {cartSubtotal >= freeDeliveryThreshold
                    ? '🎉 Free Standard Delivery Unlocked!'
                    : `Add ₹${freeDeliveryThreshold - cartSubtotal} more for Free Delivery`}
                </span>
                <span className="text-[11px] text-slate-500">{progressPercent}%</span>
              </div>
              <div className="w-full bg-purple-200/60 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-50 flex items-center justify-center text-3xl">
                  🛍️
                </div>
                <h3 className="text-base font-bold text-slate-800">Your bag is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Explore personalized skincare, hair essentials, organic period care, and supplements in the Well Store.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentScreen('store');
                  }}
                  className="mt-5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  Explore Well Store
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.product.id}
                  className="p-3 bg-white rounded-2xl border border-slate-100 shadow-2xs hover:border-purple-200 transition-all flex gap-3"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-xl object-cover border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wide">
                          {item.product.brand}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-300 hover:text-rose-500 p-0.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">
                        {item.product.name}
                      </h4>
                      <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                        ₹{item.product.price}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, -1)}
                          className="w-5 h-5 rounded-md flex items-center justify-center text-slate-600 hover:bg-white transition-colors"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-800 px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, 1)}
                          className="w-5 h-5 rounded-md flex items-center justify-center text-slate-600 hover:bg-white transition-colors"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-purple-700">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Bar */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Estimate</span>
                  <span className="font-semibold text-emerald-600">
                    {cartSubtotal >= freeDeliveryThreshold ? 'FREE' : '₹49'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-purple-700">
                    ₹{cartSubtotal + (cartSubtotal >= freeDeliveryThreshold ? 0 : 49)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold text-sm shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Simulated Secure Prototype Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
        />
      )}
    </>
  );
};
