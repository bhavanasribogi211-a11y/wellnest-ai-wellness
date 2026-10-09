import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistModal: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    addToCart,
    setCurrentScreen,
  } = useApp();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        onClick={() => setIsWishlistOpen(false)}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-100 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-pink-600" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800 font-heading">
                Saved Wishlist
              </h3>
              <p className="text-xs text-slate-500">{wishlist.length} items saved</p>
            </div>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 max-h-[60vh] overflow-y-auto space-y-3">
          {wishlist.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-pink-50 flex items-center justify-center text-3xl">
                💖
              </div>
              <h4 className="text-sm font-bold text-slate-800">Your wishlist is empty</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Tap the heart on any product in the Well Store to save it for later.
              </p>
              <button
                onClick={() => {
                  setIsWishlistOpen(false);
                  setCurrentScreen('store');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                Browse Well Store
              </button>
            </div>
          ) : (
            wishlist.map(product => (
              <div
                key={product.id}
                className="p-3 bg-white rounded-2xl border border-slate-100 shadow-2xs hover:border-pink-200 transition-all flex items-center gap-3"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-purple-600 uppercase">
                    {product.brand}
                  </span>
                  <h5 className="text-xs font-bold text-slate-800 truncate">
                    {product.name}
                  </h5>
                  <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                    ₹{product.price}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      addToCart(product);
                    }}
                    className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 transition-all active:scale-95 shadow-xs"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
