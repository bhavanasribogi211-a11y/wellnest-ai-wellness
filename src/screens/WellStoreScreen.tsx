import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  Heart,
  ShoppingBag,
  Star,
  Sparkles,
  AlertTriangle,
  Info,
  X,
  Plus,
  Check,
  ChevronRight,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { STORE_PRODUCTS } from '../data/initialData';
import { Product } from '../types';
import { CheckoutModal } from '../components/common/CheckoutModal';

export const WellStoreScreen: React.FC = () => {
  const {
    userProfile,
    cart,
    addToCart,
    wishlist,
    toggleWishlist,
    isInWishlist,
    setIsCartOpen,
    orders,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  const categories = [
    'All',
    'Skin Care',
    'Hair Care',
    'Period Essentials',
    'Medicines',
    'Supplements',
  ];

  const brands = [
    'All',
    'Minimalist',
    'The Ordinary',
    'Dot & Key',
    'Bontress / ThriveCo',
    'Bare Anatomy',
    'Wella Professionals',
    'Carmesi',
    'Pee Safe',
    'Sirona',
    'Carbamide Forte',
    'HealthyHey Nutrition',
    'OZiva',
  ];

  // Filtering products
  const filteredProducts = STORE_PRODUCTS.filter(product => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesBrand =
      selectedBrand === 'All' || product.brand === selectedBrand;
    const matchesSearch =
      !searchQuery.trim() ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesBrand && matchesSearch;
  });

  // Recommended products matching user's skin/hair concerns
  const recommendedProducts = STORE_PRODUCTS.filter(p => !!p.personalizedReason);

  const handleBuyNow = (product: Product) => {
    addToCart(product, 1);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-24 pt-4 px-4 max-w-6xl mx-auto space-y-6">
      {/* Store Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>SC5 • Well Store, Pharmacy & Essentials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
            Curated Wellness & Essentials Store
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 max-w-xl mt-1 leading-relaxed">
            Dermatologist-approved skincare, clinical trichology serums, rash-free organic period care, and bioavailable supplements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {orders.length > 0 && (
            <button
              onClick={() => setIsOrderHistoryOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Package className="w-4 h-4" />
              <span>Past Orders ({orders.length})</span>
            </button>
          )}

          <button
            onClick={() => setIsCartOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-white text-purple-700 hover:bg-purple-50 font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>View Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
          </button>
        </div>
      </div>

      {/* Personalized Recommendations Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-800 font-heading flex items-center gap-1.5">
              <span>✨</span> Formulated For Your Profile
            </h2>
            <p className="text-xs text-slate-500">
              Matched for {userProfile.skinType} skin & {userProfile.hairType} hair
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {recommendedProducts.slice(0, 4).map(product => (
            <div
              key={`rec-${product.id}`}
              onClick={() => setSelectedProduct(product)}
              className="p-3.5 bg-gradient-to-br from-purple-50/70 to-pink-50/40 rounded-2xl border border-purple-200/80 hover:border-purple-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative overflow-hidden rounded-xl mb-2.5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-purple-700 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Bio Match
                  </span>
                </div>
                <span className="text-[10px] font-bold text-purple-700 uppercase">
                  {product.brand}
                </span>
                <h4 className="text-xs font-bold text-slate-800 truncate mt-0.5">
                  {product.name}
                </h4>
                <p className="text-[11px] text-purple-900 mt-1 line-clamp-2 italic">
                  "{product.personalizedReason}"
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-purple-100 flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900">₹{product.price}</span>
                <span className="font-bold text-purple-600">Inspect →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-purple-500 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search ceramide, redensyl, organic pads, inositol..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:border-purple-500 focus:bg-white transition-all"
            />
          </div>

          {/* Brand Filter */}
          <div className="w-full sm:w-56">
            <select
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              className="w-full py-2.5 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:border-purple-500"
            >
              <option value="All">All Brands</option>
              {brands.filter(b => b !== 'All').map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-slate-700">
            Showing {filteredProducts.length} Products
          </span>
          <span className="text-[11px] text-slate-400">
            Same-day demo delivery available in {userProfile.location?.pincode || '560038'}
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-100">
            <span className="text-3xl block mb-2">🔍</span>
            <h3 className="text-sm font-bold text-slate-800">No products match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the category or search keyword.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedBrand('All');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => {
              const inWishlist = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-slate-100 shadow-2xs hover:shadow-xl hover:border-purple-200 transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div className="p-4 space-y-3">
                    {/* Image with Wishlist Button */}
                    <div className="relative overflow-hidden rounded-2xl">
                      <img
                        src={product.image}
                        alt={product.name}
                        onClick={() => setSelectedProduct(product)}
                        className="w-full h-44 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-xs hover:bg-white transition-transform active:scale-90"
                        title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            inWishlist
                              ? 'text-pink-600 fill-pink-600'
                              : 'text-slate-400 hover:text-pink-500'
                          }`}
                        />
                      </button>

                      {product.prescriptionRequired && (
                        <span className="absolute bottom-2.5 left-2.5 bg-rose-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                          Rx Required
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-purple-700 uppercase tracking-wide text-[10px]">
                          {product.brand}
                        </span>
                        <span className="font-bold text-amber-500 flex items-center gap-1 text-[11px]">
                          <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                          {product.rating} ({product.reviewsCount})
                        </span>
                      </div>

                      <h3
                        onClick={() => setSelectedProduct(product)}
                        className="text-sm font-bold text-slate-800 font-heading mt-1 cursor-pointer hover:text-purple-600 transition-colors line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {product.shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="p-4 pt-0 border-t border-slate-50 space-y-2">
                    <div className="flex items-baseline justify-between pt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-black text-slate-900 font-heading">
                          ₹{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        In Stock
                      </span>
                    </div>

                    <div className="flex gap-2 text-xs">
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="flex-1 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>

                      <button
                        onClick={() => handleBuyNow(product)}
                        className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all active:scale-95 shadow-xs"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setSelectedProduct(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-purple-100 z-10 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-purple-700 uppercase">
                {selectedProduct.brand} • {selectedProduct.category}
              </span>
              <button onClick={() => setSelectedProduct(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-48 rounded-2xl object-cover"
              />

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-extrabold text-slate-900 font-heading">
                    {selectedProduct.name}
                  </span>
                  <span className="text-lg font-black text-purple-700 font-heading">
                    ₹{selectedProduct.price}
                  </span>
                </div>
                <p className="text-slate-600 mt-2 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Consultation or Medicine Warning Notice */}
              {selectedProduct.warningNotice && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">
                    {selectedProduct.warningNotice}
                  </span>
                </div>
              )}

              {/* Key Ingredients */}
              <div>
                <h4 className="font-bold text-slate-800 mb-1.5">Key Actives & Formulation:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.ingredients.map((ing, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-semibold text-[11px]">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Usage Instructions */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-1">Recommended Usage:</h4>
                <p className="text-slate-600 text-[11px]">{selectedProduct.usage}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => toggleWishlist(selectedProduct)}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-pink-600 transition-colors"
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isInWishlist(selectedProduct.id) ? 'fill-pink-500 text-pink-500' : ''}`} />
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    addToCart(selectedProduct, 1);
                    setSelectedProduct(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    handleBuyNow(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md transition-all active:scale-95"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ORDER HISTORY MODAL */}
      {isOrderHistoryOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsOrderHistoryOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 z-10 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-800 font-heading">
                Demo Order History ({orders.length})
              </h3>
              <button onClick={() => setIsOrderHistoryOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {orders.map(order => (
                <div key={order.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-purple-700">#{order.id}</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {order.status}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    <p>Date: {order.date} • ETA: {order.eta}</p>
                    <p>Shipping to: {order.shippingAddress.slice(0, 35)}...</p>
                    <p className="font-bold text-slate-800 mt-1">Total: ₹{order.total} ({order.items.length} items)</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsOrderHistoryOpen(false)}
                className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      )}
    </div>
  );
};
