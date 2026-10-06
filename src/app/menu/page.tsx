'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  UtensilsCrossed,
  Flame,
  Search,
  Plus,
  ShoppingBag,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import styles from './menu.module.css';
import { MENU_ITEMS } from '@/lib/menu-data';
import { MenuItemModal } from '@/components/MenuItemModal';
import { useCart } from '@/context/CartContext';
import { MenuCategory, MenuItem } from '@/types';

const CATEGORIES: Array<{ id: MenuCategory | 'all'; label: string; icon: string }> = [
  { id: 'all', label: 'All Dishes', icon: '🍽️' },
  { id: 'rice_combos', label: 'Rice & Combos', icon: '🍚' },
  { id: 'grills', label: 'Grills & Asun', icon: '🔥' },
  { id: 'fast_bites', label: 'Fast Bites & Chops', icon: '🌯' },
  { id: 'drinks', label: 'Drinks & Refreshments', icon: '🍹' },
];

export default function MenuPage() {
  const { totalCount, subtotal, setIsCartOpen } = useCart();
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Filter items by category and search query
  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.menuContainer}>
      {/* 1. Header Banner */}
      <section className={styles.menuHeaderSection}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Flame className="w-3.5 h-3.5" />
            <span>Fresh From The Kitchen</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            PrimeHeritage Food Menu
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto mt-2 leading-relaxed">
            Every dish is cooked fresh with authentic herbs and premium cuts. Customize your
            proteins and sides for the ultimate meal in Ikorodu.
          </p>

          {/* Quick Search */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search dishes (e.g. Jollof, Turkey, Asun, Chapman)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs sm:text-sm placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* 2. Sticky Category Navigation */}
      <div className={styles.categoryNavWrapper}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={styles.categoryScroll}>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`${styles.categoryTab} ${
                    isActive ? styles.categoryTabActive : styles.categoryTabInactive
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Menu Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <UtensilsCrossed className="w-12 h-12 text-zinc-700 mx-auto" />
            <h3 className="text-lg font-bold text-zinc-300">No dishes match your search</h3>
            <p className="text-xs text-zinc-500">
              Try searching for something else or switch category tabs.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 bg-zinc-800 text-amber-400 font-semibold text-xs rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={styles.menuGrid}>
            {filteredItems.map((item) => (
              <div key={item.id} className={styles.foodCard}>
                {/* Food Image */}
                <div className="relative h-48 w-full bg-zinc-900 overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-xs text-amber-400 font-black text-sm px-3 py-1 rounded-full border border-zinc-700">
                    ₦{item.price.toLocaleString()}
                  </div>
                  {item.isPopular && (
                    <div className="absolute top-3 left-3 bg-rose-600/90 text-white font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                      <Sparkles className="w-3 h-3" />
                      <span>Popular</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-extrabold text-base text-white">{item.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400 font-medium">
                      {item.modifierGroups && item.modifierGroups.length > 0
                        ? 'Customizable'
                        : 'Instant Serving'}
                    </span>
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-md shadow-amber-500/10"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Tray</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 4. Sticky Mobile Cart Bar */}
      {totalCount > 0 && (
        <div className={styles.stickyCartBar}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black text-sm">
                {totalCount}
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">
                  Tray Subtotal
                </span>
                <span className="text-lg font-black text-white">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-rose-950/50 cursor-pointer active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Review Tray & Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Item Customization Modal */}
      <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
