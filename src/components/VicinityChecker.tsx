'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';
import {
  IKORODU_LANDMARKS,
  calculateDeliveryFromCoordinates,
  calculateDistanceKm,
  calculateDeliveryFee,
  KITCHEN_ANCHOR,
} from '@/lib/vicinity';
import { generateWhatsAppOutOfRadiusUrl } from '@/lib/whatsapp';
import { useCart } from '@/context/CartContext';
import { VicinityLandmark } from '@/types';

export function VicinityChecker() {
  const { setSelectedLandmark, setDeliveryCalculation } = useCart();
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string>(
    IKORODU_LANDMARKS[0].id
  );
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [customDistance, setCustomDistance] = useState<number | null>(null);
  const [isGpsMode, setIsGpsMode] = useState(false);

  // Default calculation
  const defaultLandmark =
    IKORODU_LANDMARKS.find((l) => l.id === selectedLandmarkId) ||
    IKORODU_LANDMARKS[0];
  const activeDistance = isGpsMode && customDistance !== null
    ? customDistance
    : calculateDistanceKm(
        KITCHEN_ANCHOR.lat,
        KITCHEN_ANCHOR.lng,
        defaultLandmark.lat,
        defaultLandmark.lng
      );
  const activeResult = calculateDeliveryFee(activeDistance);

  const handleLandmarkSelect = (id: string) => {
    setSelectedLandmarkId(id);
    setIsGpsMode(false);
    setLocationError(null);
    const landmark = IKORODU_LANDMARKS.find((l) => l.id === id);
    if (landmark) {
      setSelectedLandmark(landmark);
      const d = calculateDistanceKm(
        KITCHEN_ANCHOR.lat,
        KITCHEN_ANCHOR.lng,
        landmark.lat,
        landmark.lng
      );
      setDeliveryCalculation(calculateDeliveryFee(d));
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        const res = calculateDeliveryFromCoordinates(latitude, longitude);
        setCustomDistance(res.distanceKm);
        setIsGpsMode(true);

        const customLoc: VicinityLandmark = {
          id: 'gps-location',
          name: 'My Current GPS Location',
          lat: latitude,
          lng: longitude,
          areaNotes: `${res.distanceKm} km from PrimeHeritage Kitchen`,
        };
        setSelectedLandmark(customLoc);
        setDeliveryCalculation(res);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err.message);
        setLocationError(
          'Could not detect precise location. Please select your neighborhood from the list below.'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-amber-500" />
        <h3 className="font-extrabold text-base sm:text-lg text-white">
          Ikorodu Vicinity Delivery Checker
        </h3>
      </div>
      <p className="text-xs sm:text-sm text-zinc-400 mb-4 leading-relaxed">
        We deliver piping-hot meals up to <strong>18 km</strong> from our central kitchen in
        Ikorodu. Check your delivery fee instantly:
      </p>

      {/* Action Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* GPS Button */}
        <button
          onClick={handleDetectLocation}
          disabled={isLocating}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-semibold text-xs sm:text-sm rounded-xl border border-amber-500/30 transition-all cursor-pointer"
        >
          <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Detecting GPS...' : '📍 Use My Current Location'}</span>
        </button>

        {/* Landmark Dropdown */}
        <div className="relative flex-1">
          <select
            value={isGpsMode ? '' : selectedLandmarkId}
            onChange={(e) => handleLandmarkSelect(e.target.value)}
            className="w-full appearance-none px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 cursor-pointer pr-10"
          >
            {isGpsMode && <option value="">Custom GPS Location</option>}
            {IKORODU_LANDMARKS.map((landmark) => (
              <option key={landmark.id} value={landmark.id}>
                {landmark.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" />
        </div>
      </div>

      {locationError && (
        <p className="text-xs text-rose-400 mb-3 bg-rose-950/40 border border-rose-900/50 p-2.5 rounded-xl">
          {locationError}
        </p>
      )}

      {/* Result Card */}
      {activeResult.isDeliverable ? (
        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3.5 flex items-start sm:items-center justify-between gap-3 text-emerald-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs sm:text-sm font-bold block">
                Within Delivery Range (~{activeDistance} km away)
              </span>
              <span className="text-[11px] text-emerald-300/80">
                Hot dispatch available straight to your doorstep in Ikorodu.
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-emerald-300 uppercase tracking-wider block font-semibold">
              Delivery Fee
            </span>
            <span className="text-base sm:text-lg font-black text-white">
              ₦{activeResult.fee.toLocaleString()}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-3.5 space-y-2 text-amber-200">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <span className="font-bold block text-white mb-0.5">
                Distance Exceeds 18km Freshness Limit (~{activeDistance} km)
              </span>
              <p className="text-amber-200/90 text-xs">
                {activeResult.outOfRadiusMessage}
              </p>
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <a
              href={generateWhatsAppOutOfRadiusUrl(
                isGpsMode ? 'GPS Location' : defaultLandmark.name,
                activeDistance
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp for Courier Booking</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
