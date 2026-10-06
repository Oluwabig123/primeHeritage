'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CartItem,
  CartItemOption,
  MenuItem,
  OrderType,
  VicinityLandmark,
  DeliveryCalculation,
} from '@/types';
import { calculateDeliveryFee, IKORODU_LANDMARKS } from '@/lib/vicinity';

interface CartContextType {
  items: CartItem[];
  addItem: (
    menuItem: MenuItem,
    options?: CartItemOption[],
    specialInstructions?: string
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  fulfillmentType: OrderType;
  setFulfillmentType: (type: OrderType) => void;
  selectedLandmark: VicinityLandmark | null;
  setSelectedLandmark: (landmark: VicinityLandmark | null) => void;
  deliveryCalculation: DeliveryCalculation | null;
  setDeliveryCalculation: (calc: DeliveryCalculation | null) => void;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  totalCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [fulfillmentType, setFulfillmentType] = useState<OrderType>('delivery');
  const [selectedLandmark, setSelectedLandmark] = useState<VicinityLandmark | null>(
    IKORODU_LANDMARKS[0] // Default to Itamaga (close to kitchen)
  );
  const [deliveryCalculation, setDeliveryCalculation] =
    useState<DeliveryCalculation | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ph_cart_v1');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ph_cart_v1', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  // Update delivery calculation whenever landmark changes
  useEffect(() => {
    if (fulfillmentType === 'pickup') {
      setDeliveryCalculation({
        isDeliverable: true,
        distanceKm: 0,
        fee: 0,
      });
      return;
    }

    if (selectedLandmark) {
      // Calculate distance from landmark
      const calc = calculateDeliveryFee(
        selectedLandmark.lat ? calculateDist(selectedLandmark.lat, selectedLandmark.lng) : 1
      );
      setDeliveryCalculation(calc);
    }
  }, [selectedLandmark, fulfillmentType]);

  const addItem = (
    menuItem: MenuItem,
    options: CartItemOption[] = [],
    specialInstructions?: string
  ) => {
    const optionsCost = options.reduce((sum, opt) => sum + opt.priceDelta, 0);
    const unitPrice = Math.max(0, menuItem.price + optionsCost);

    // Create unique key based on item id and selected options
    const optionsKey = options
      .map((o) => `${o.groupId}:${o.optionId}`)
      .sort()
      .join('|');
    const itemKey = `${menuItem.id}-${optionsKey}-${specialInstructions || ''}`;

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === itemKey);
      if (existingIndex > -1) {
        const next = [...prev];
        const updated = { ...next[existingIndex] };
        updated.quantity += 1;
        updated.lineTotal = updated.quantity * updated.unitPrice;
        next[existingIndex] = updated;
        return next;
      }

      const newItem: CartItem = {
        cartItemId: itemKey,
        menuItem,
        quantity: 1,
        selectedOptions: options,
        specialInstructions,
        unitPrice,
        lineTotal: unitPrice,
      };
      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              lineTotal: nextQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryFee =
    fulfillmentType === 'pickup'
      ? 0
      : deliveryCalculation?.isDeliverable
      ? deliveryCalculation.fee
      : 0;
  const totalAmount = subtotal + deliveryFee;
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        fulfillmentType,
        setFulfillmentType,
        selectedLandmark,
        setSelectedLandmark,
        deliveryCalculation,
        setDeliveryCalculation,
        subtotal,
        deliveryFee,
        totalAmount,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Distance helper
function calculateDist(lat: number, lng: number): number {
  const K_LAT = 6.613065;
  const K_LNG = 3.541461;
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat - K_LAT);
  const dLon = toRad(lng - K_LNG);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(K_LAT)) * Math.cos(toRad(lat)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
