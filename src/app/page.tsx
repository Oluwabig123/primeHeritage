'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  Plus,
  CalendarCheck,
  Award,
  Clock,
  Download,
} from 'lucide-react';
import styles from './page.module.css';
import { MENU_ITEMS } from '@/lib/menu-data';
import { VicinityChecker } from '@/components/VicinityChecker';
import { MenuItemModal } from '@/components/MenuItemModal';
import { ComingSoonBadge } from '@/components/ComingSoonBadge';
import { MenuItem } from '@/types';

export default function HomePage() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Top 4 signature fast-food hits
  const topHits = MENU_ITEMS.slice(0, 4);

  return (
    <div className={styles.homeContainer}>
      {/* 1. HERO SECTION */}
      <section className={styles.heroSection}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <span className={styles.heroBadge}>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ikorodu Vicinity Fast Food & Catering</span>
                </span>
              </div>

              <h1 className={styles.heroHeading}>
                Hot, Delicious Food <br />
                <span className={styles.heroHighlight}>Delivered To Your Door</span> In Ikorodu.
              </h1>

              <p className={`mx-auto lg:mx-0 ${styles.heroSubtext}`}>
                Enjoy authentic firewood smoky Jollof combos, tender charcoal grills, peppered turkey,
                and premium event catering freshly prepared at our central kitchen.
              </p>

              <div className={`justify-center lg:justify-start ${styles.ctaGroup}`}>
                <Link href="/menu" className={styles.primaryCta}>
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Order Food Now</span>
                </Link>
                <Link href="/catering" className={styles.secondaryCta}>
                  <CalendarCheck className="w-4 h-4 text-amber-500" />
                  <span>Explore Catering</span>
                </Link>
              </div>

              {/* Trust highlights */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Freshly Cooked Daily</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Pay Online via Paystack</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Direct WhatsApp Dispatch</span>
                </div>
              </div>
            </div>

            {/* Hero Right: Live Vicinity Checker Card */}
            <div className="lg:col-span-5 w-full">
              <VicinityChecker />
            </div>
          </div>
        </div>
      </section>

      {/* 2. TODAY'S TOP SIGNATURE HITS */}
      <section className={styles.specialsSection}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-amber-500 font-bold text-xs uppercase tracking-widest block mb-1">
                Fast & Sizzling
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Top Signature Hits
              </h2>
            </div>
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>View Full Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {topHits.map((item) => (
              <div key={item.id} className={styles.specialsCard}>
                <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-amber-400 font-extrabold text-xs px-2.5 py-1 rounded-full border border-zinc-700">
                    ₦{item.price.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-white line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedItem(item)}
                    className="w-full py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Order / Customize</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CATERING SERVICES SPOTLIGHT */}
      <section className={styles.cateringBannerSection}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-rose-950/40 border border-zinc-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
            <div className="max-w-2xl space-y-4 relative z-10">
              <span className="text-rose-500 font-bold text-xs uppercase tracking-widest block">
                Executive & Party Events
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Planning A Wedding, Birthday, Or Corporate Event In Ikorodu?
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                PrimeHeritage caters for 15 to 500+ guests. From luxury party boxes and hot buffet
                trays to live barbecue stations and professional attendants.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/catering"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-950/40 hover:opacity-95 transition-all"
                >
                  <span>Explore Catering Packages</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://wa.me/2349026875420?text=Hello%20PrimeHeritage%20Kitchen,%20I%20would%20like%20to%20inquire%20about%20catering%20services%20for%20my%20event."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition-colors"
                >
                  <span>WhatsApp Consultation</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DOWNLOAD MOBILE APP & COMING SOON ROADMAP */}
      <section className="py-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* PWA Mobile App Callout */}
          <div className={styles.pwaBanner}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">
                    Download & Install The PrimeHeritage App
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                  Install our mobile app directly on your Android or iPhone home screen with zero app store downloads. Enjoy 1-tap food re-ordering and live order status.
                </p>
              </div>
              <button
                onClick={() => {
                  alert(
                    'To install on iPhone: Tap the Share button in Safari, then "Add to Home Screen". On Android/Chrome: Tap menu (3 dots) then "Install app".'
                  );
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                How To Install App
              </button>
            </div>
          </div>

          {/* Agile Roadmap - Coming Soon Features */}
          <div>
            <div className="mb-6">
              <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest block mb-1">
                Agile Growth & Roadmap
              </span>
              <h3 className="text-xl font-black text-white">Upcoming Features</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className={styles.comingSoonBox}>
                <div className="flex items-center justify-between mb-3">
                  <Award className="w-6 h-6 text-amber-500" />
                  <ComingSoonBadge label="Coming Soon" />
                </div>
                <h4 className="font-bold text-sm text-white mb-1">Heritage Loyalty Coins</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Earn loyalty points with every plate of smoky Jollof or catering order to redeem free meals and delivery discounts.
                </p>
              </div>

              <div className={styles.comingSoonBox}>
                <div className="flex items-center justify-between mb-3">
                  <Clock className="w-6 h-6 text-rose-500" />
                  <ComingSoonBadge label="Coming Soon" />
                </div>
                <h4 className="font-bold text-sm text-white mb-1">Weekly Office Lunch Subs</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Pre-scheduled Monday–Friday lunch deliveries for businesses and corporate workers across Ikorodu.
                </p>
              </div>

              <div className={styles.comingSoonBox}>
                <div className="flex items-center justify-between mb-3">
                  <Sparkles className="w-6 h-6 text-emerald-500" />
                  <ComingSoonBadge label="Coming Soon" />
                </div>
                <h4 className="font-bold text-sm text-white mb-1">Live Kitchen Cam & Tracking</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Real-time rider GPS tracking directly on your mobile device as the rider speeds from our kitchen to your door.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Item Customization Modal */}
      <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
