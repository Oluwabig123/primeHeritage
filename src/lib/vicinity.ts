import { DeliveryCalculation, VicinityLandmark } from '@/types';

// Kitchen Anchor Coordinates: PrimeHeritage Foods & Catering Kitchen, Ikorodu
export const KITCHEN_ANCHOR = {
  name: 'PrimeHeritage Central Kitchen, Ikorodu',
  lat: 6.613065,
  lng: 3.541461,
  baseFee: 800, // ₦800 covers dispatch and initial 2.0 km
  baseThresholdKm: 2.0,
  perKmRate: 200, // ₦200 / km beyond initial 2.0 km
  maxRadiusKm: 18.0, // 18.0 km cut-off for food freshness
};

export const OUT_OF_RADIUS_PROMPT =
  'Delivery distance exceeds our 18km kitchen freshness limit. Contact us on WhatsApp for special courier booking.';

export const IKORODU_LANDMARKS: VicinityLandmark[] = [
  {
    id: 'itamaga',
    name: 'Itamaga / Kokoro Abu',
    lat: 6.6180,
    lng: 3.5460,
    areaNotes: 'Central Ikorodu / Close to Kitchen',
  },
  {
    id: 'sabo',
    name: 'Sabo Market / Eyita',
    lat: 6.6264,
    lng: 3.5150,
    areaNotes: 'Sabo Central Market Axis',
  },
  {
    id: 'garage',
    name: 'Ikorodu Garage / Roundabout',
    lat: 6.6185,
    lng: 3.5132,
    areaNotes: 'Main Transit Hub',
  },
  {
    id: 'benson',
    name: 'Benson / Ikorodu Town Central',
    lat: 6.6169,
    lng: 3.5081,
    areaNotes: 'Benson Bus Stop Area',
  },
  {
    id: 'odogunyan',
    name: 'Odogunyan / LASPOTECH (LASUSTECH)',
    lat: 6.6620,
    lng: 3.5280,
    areaNotes: 'Campus Axis & Industrial Estate',
  },
  {
    id: 'agric',
    name: 'Agric / Asolo / Isawo Junction',
    lat: 6.6021,
    lng: 3.4905,
    areaNotes: 'Expressway Gateway',
  },
  {
    id: 'ebute',
    name: 'Ebute / Ipakodo Ferry Terminal',
    lat: 6.6015,
    lng: 3.4812,
    areaNotes: 'Waterfront & Ferry Jetty Axis',
  },
  {
    id: 'ijede',
    name: 'Ijede Town / Egbin Axis',
    lat: 6.5680,
    lng: 3.5930,
    areaNotes: 'Ijede Coastal Zone',
  },
  {
    id: 'ogolonto',
    name: 'Ogolonto Bus Stop',
    lat: 6.5942,
    lng: 3.4720,
    areaNotes: 'Major Highway Connector',
  },
  {
    id: 'maya',
    name: 'Maya / Adamo / Maya Market',
    lat: 6.6710,
    lng: 3.5850,
    areaNotes: 'Ikorodu North Axis',
  },
  {
    id: 'majidun',
    name: 'Majidun / Awori',
    lat: 6.5821,
    lng: 3.4552,
    areaNotes: 'Waterfront Highway Approach',
  },
  {
    id: 'imota',
    name: 'Imota Town Border',
    lat: 6.6610,
    lng: 3.6620,
    areaNotes: 'Rice Mill & Agricultural Zone',
  },
  {
    id: 'mile12',
    name: 'Mile 12 Border Area',
    lat: 6.6110,
    lng: 3.4020,
    areaNotes: 'Border of Ikorodu & Kosofe',
  },
  {
    id: 'ketu',
    name: 'Ketu / Ojota Border',
    lat: 6.5950,
    lng: 3.3850,
    areaNotes: 'Outlying Express Route',
  },
];

/**
 * Calculates straight-line distance in kilometers using the Haversine formula.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const rawDist = R * c;

  // Round to 1 decimal place (e.g. 3.2 km)
  return Math.round(rawDist * 10) / 10;
}

/**
 * Calculates delivery fee based on customer distance from PrimeHeritage Kitchen.
 * Rules:
 * - Base Fee: ₦800 (covers up to 2.0 km)
 * - Beyond 2.0 km: ₦800 + Math.ceil(distance - 2.0) * ₦200
 * - Maximum Cut-off: 18.0 km
 */
export function calculateDeliveryFee(distanceKm: number): DeliveryCalculation {
  if (distanceKm > KITCHEN_ANCHOR.maxRadiusKm) {
    return {
      isDeliverable: false,
      distanceKm,
      fee: 0,
      outOfRadiusMessage: OUT_OF_RADIUS_PROMPT,
    };
  }

  if (distanceKm <= KITCHEN_ANCHOR.baseThresholdKm) {
    return {
      isDeliverable: true,
      distanceKm,
      fee: KITCHEN_ANCHOR.baseFee,
    };
  }

  const extraKm = Math.ceil(distanceKm - KITCHEN_ANCHOR.baseThresholdKm);
  const fee = KITCHEN_ANCHOR.baseFee + extraKm * KITCHEN_ANCHOR.perKmRate;

  return {
    isDeliverable: true,
    distanceKm,
    fee,
  };
}

/**
 * Resolves delivery fee from customer coordinates directly to kitchen anchor.
 */
export function calculateDeliveryFromCoordinates(
  lat: number,
  lng: number
): DeliveryCalculation {
  const distanceKm = calculateDistanceKm(
    KITCHEN_ANCHOR.lat,
    KITCHEN_ANCHOR.lng,
    lat,
    lng
  );
  return calculateDeliveryFee(distanceKm);
}
