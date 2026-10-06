'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Users,
  CheckCircle,
  Calendar,
  MapPin,
  Sparkles,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import styles from './catering.module.css';
import { CATERING_PACKAGES } from '@/lib/menu-data';
import { generateWhatsAppCateringUrl } from '@/lib/whatsapp';
import { CateringInquiry } from '@/types';

export default function CateringPage() {
  const [guestCount, setGuestCount] = useState<number>(50);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    CATERING_PACKAGES[1].id
  );

  // Inquiry Form State
  const [formData, setFormData] = useState({
    contactName: '',
    phone: '',
    eventDate: '',
    venue: '',
    notes: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const activePackage =
    CATERING_PACKAGES.find((p) => p.id === selectedPackageId) ||
    CATERING_PACKAGES[1];

  const estimatedCost = guestCount * activePackage.pricePerGuest;

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contactName || !formData.phone || !formData.venue || !formData.eventDate) {
      setFormError('Please fill in your name, phone number, event date, and venue location.');
      return;
    }

    setFormError(null);

    const bookingNumber = `CAT-${Date.now().toString().slice(-5)}`;
    const inquiry: CateringInquiry = {
      bookingNumber,
      contactName: formData.contactName,
      phone: formData.phone,
      eventDate: formData.eventDate,
      venue: formData.venue,
      guestCount,
      packageType: activePackage.name,
      estimatedCost,
      notes: formData.notes,
    };

    // Open pre-formatted WhatsApp quote directly with PrimeHeritage kitchen
    const url = generateWhatsAppCateringUrl(inquiry);
    window.open(url, '_blank');
  };

  return (
    <div className={styles.cateringContainer}>
      {/* 1. HERO SECTION */}
      <section className={styles.cateringHero}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PrimeHeritage Event Catering Services</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Memorable Feasts For Your Special Occasions
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            From intimate birthday celebrations and corporate luncheons to grand weddings and
            naming ceremonies across Ikorodu. Freshly prepared, elegantly packaged, and seamlessly
            coordinated.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-6 text-xs text-zinc-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Uniformed Service Attendants
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Live Barbecue & Grill Stations
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              Custom Menu Tasting Available
            </span>
          </div>
        </div>
      </section>

      {/* 2. PACKAGES GRID */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-amber-500 font-bold text-xs uppercase tracking-widest block mb-1">
            Curated Bundles
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Choose Your Catering Package Tier
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATERING_PACKAGES.map((pkg) => {
            const isSelected = selectedPackageId === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackageId(pkg.id)}
                className={`${styles.packageCard} cursor-pointer ${
                  isSelected ? 'border-amber-500 ring-2 ring-amber-500/40' : ''
                }`}
              >
                <div className="relative h-48 w-full bg-zinc-900">
                  <Image
                    src={pkg.imageUrl}
                    alt={pkg.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-xs text-amber-400 font-extrabold text-xs px-3 py-1 rounded-full border border-zinc-700">
                    ₦{pkg.pricePerGuest.toLocaleString()} / Guest
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-extrabold text-lg text-white mb-1">{pkg.name}</h3>
                    <p className="text-xs text-zinc-400 mb-4">{pkg.tagline}</p>

                    <div className="space-y-2 border-t border-zinc-800 pt-3">
                      {pkg.highlights.map((h, idx) => (
                        <div key={idx} className={styles.packageHighlightItem}>
                          <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-zinc-950 font-black'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {isSelected ? '✓ Selected Package' : 'Select This Tier'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. INTERACTIVE ESTIMATOR & INQUIRY FORM */}
      <section className="py-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Headcount Slider Card */}
          <div className={`lg:col-span-5 ${styles.estimatorCard} space-y-5`}>
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Live Pricing Estimator
              </span>
              <h3 className="text-xl font-extrabold text-white">Estimated Guest Count</h3>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Number of Guests</span>
                <span className="text-2xl font-black text-amber-400 flex items-center gap-1.5">
                  <Users className="w-5 h-5 text-amber-500" />
                  {guestCount}
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="500"
                step="5"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-zinc-500 font-semibold">
                <span>15 Guests</span>
                <span>250 Guests</span>
                <span>500+ Guests</span>
              </div>
            </div>

            {/* Live Calculation Display */}
            <div className="pt-4 border-t border-zinc-800 space-y-2 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Selected Tier:</span>
                <span className="text-white font-bold">{activePackage.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Rate per guest:</span>
                <span className="text-zinc-200">
                  ₦{activePackage.pricePerGuest.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-800 text-sm font-bold text-white">
                <span>Estimated Budget:</span>
                <span className="text-xl font-black text-amber-400">
                  ~₦{estimatedCost.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed italic">
              *Estimates include food preparation, packaging, and standard setup. Venue logistics and
              live grill stations can be adjusted in your custom invoice.
            </p>
          </div>

          {/* Inquiry Form */}
          <div className={`lg:col-span-7 ${styles.inquiryFormCard}`}>
            <h3 className="text-lg font-bold text-white mb-1">
              Request Formal Catering Quotation
            </h3>
            <p className="text-xs text-zinc-400 mb-5">
              Submit your event specifications below to receive an official booking proposal and chat
              directly with our head chef on WhatsApp.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-rose-950/50 border border-rose-900 rounded-xl text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mrs. Adeola Bakare"
                    value={formData.contactName}
                    onChange={(e) =>
                      setFormData({ ...formData, contactName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 08012345678"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Event Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={formData.eventDate}
                      onChange={(e) =>
                        setFormData({ ...formData, eventDate: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                    />
                    <Calendar className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Venue / Location in Ikorodu *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ebute Event Center, Ikorodu"
                      value={formData.venue}
                      onChange={(e) =>
                        setFormData({ ...formData, venue: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                    />
                    <MapPin className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Special Requests or Dietary Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Extra small chops, separate halal meats, live grill setup requested"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer active:scale-98 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Submit & Send Quote to Kitchen WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
