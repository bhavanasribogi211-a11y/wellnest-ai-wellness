import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Search,
  ShoppingBag,
  UtensilsCrossed,
  Activity,
  User,
  Building2,
  ArrowRight,
} from 'lucide-react';
import {
  STORE_PRODUCTS,
  INITIAL_RECIPES,
  EXERCISE_ITEMS,
  HOSPITALS_DATA,
} from '../../data/initialData';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    setCurrentScreen,
    setHealingPlanTab,
    addToCart,
  } = useApp();

  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedProducts = q
    ? STORE_PRODUCTS.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    : [];

  const matchedRecipes = q
    ? INITIAL_RECIPES.filter(
        r =>
          r.name.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.mealType.toLowerCase().includes(q)
      )
    : [];

  const matchedExercises = q
    ? EXERCISE_ITEMS.filter(
        e =>
          e.title.toLowerCase().includes(e.category.toLowerCase()) ||
          e.title.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      )
    : [];

  const matchedHospitals = q
    ? HOSPITALS_DATA.filter(
        h =>
          h.name.toLowerCase().includes(q) ||
          h.services.some(s => s.toLowerCase().includes(q)) ||
          h.doctors.some(d => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q))
      )
    : [];

  const totalResults =
    matchedProducts.length +
    matchedRecipes.length +
    matchedExercises.length +
    matchedHospitals.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center p-4 pt-16">
      <div
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-3xl max-w-xl w-full p-5 shadow-2xl border border-purple-100 z-10 animate-in zoom-in-95 duration-200">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-purple-600 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products, recipes, workouts, doctors..."
            autoFocus
            className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-3 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-4">
          {!query ? (
            <div className="py-6 text-center text-xs text-slate-400">
              <p className="font-semibold text-slate-600 mb-2">Popular Searches:</p>
              <div className="flex flex-wrap justify-center gap-1.5 max-w-md mx-auto">
                {['Hormone Oatmeal', 'Pelvic Floor Yoga', 'Ceramides Cream', 'Gynecologist', 'Biotin', 'Iron Panel'].map(
                  tag => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full font-medium hover:bg-purple-100 transition-colors"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <p className="font-bold text-slate-600 text-sm">No results found for "{query}"</p>
              <p className="mt-1">Try keywords like oatmeal, yoga, clinic, inositol, or pads.</p>
            </div>
          ) : (
            <>
              {matchedProducts.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-purple-700 mb-2 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" /> Well Store ({matchedProducts.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchedProducts.slice(0, 3).map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setCurrentScreen('store');
                        }}
                        className="p-2 rounded-xl hover:bg-purple-50/50 flex items-center justify-between cursor-pointer border border-transparent hover:border-purple-200 transition-all text-xs"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover" />
                          <div className="truncate">
                            <span className="font-bold text-slate-800 truncate block">{p.name}</span>
                            <span className="text-[10px] text-slate-400">{p.brand} • ₹{p.price}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedRecipes.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-2 flex items-center gap-1.5">
                    <UtensilsCrossed className="w-3.5 h-3.5" /> Diet Lab ({matchedRecipes.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchedRecipes.slice(0, 3).map(r => (
                      <div
                        key={r.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setHealingPlanTab('diet');
                          setCurrentScreen('healing-plan');
                        }}
                        className="p-2 rounded-xl hover:bg-emerald-50/50 flex items-center justify-between cursor-pointer border border-transparent hover:border-emerald-200 transition-all text-xs"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <img src={r.image} alt={r.name} className="w-9 h-9 rounded-lg object-cover" />
                          <div className="truncate">
                            <span className="font-bold text-slate-800 truncate block">{r.name}</span>
                            <span className="text-[10px] text-slate-400">{r.mealType} • {r.calories} kcal</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedExercises.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-pink-700 mb-2 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> Exercises & Movement ({matchedExercises.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchedExercises.slice(0, 2).map(e => (
                      <div
                        key={e.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setHealingPlanTab('exercise');
                          setCurrentScreen('healing-plan');
                        }}
                        className="p-2 rounded-xl hover:bg-pink-50/50 flex items-center justify-between cursor-pointer border border-transparent hover:border-pink-200 transition-all text-xs"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <img src={e.image} alt={e.title} className="w-9 h-9 rounded-lg object-cover" />
                          <div className="truncate">
                            <span className="font-bold text-slate-800 truncate block">{e.title}</span>
                            <span className="text-[10px] text-slate-400">{e.category} • {e.durationMinutes} mins</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedHospitals.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-rose-700 mb-2 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> Healthcare & Doctors ({matchedHospitals.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchedHospitals.slice(0, 2).map(h => (
                      <div
                        key={h.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setCurrentScreen('sos');
                        }}
                        className="p-2 rounded-xl hover:bg-rose-50/50 flex items-center justify-between cursor-pointer border border-transparent hover:border-rose-200 transition-all text-xs"
                      >
                        <div className="truncate">
                          <span className="font-bold text-slate-800 truncate block">{h.name}</span>
                          <span className="text-[10px] text-slate-400">{h.address} • {h.distanceKm} km</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
