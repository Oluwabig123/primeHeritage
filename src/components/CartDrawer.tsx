'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    subtotal,
    deliveryFee,
    totalAmount,
    fulfillmentType,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-md bg-zinc-950 text-white h-full flex flex-col shadow-2xl border-l border-zinc-800 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-lg">Your Order Tray</h3>
            <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full font-semibold">
              {items.reduce((acc, i) => acc + i.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-3">
              <ShoppingBag className="w-12 h-12 text-zinc-700" />
              <p className="font-medium text-base text-zinc-400">Your tray is currently empty</p>
              <p className="text-xs max-w-xs text-zinc-500">
                Explore our mouth-watering rice combos, smoky grills, and fast bites!
              </p>
              <Link
                href="/menu"
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm rounded-xl transition-all"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartItemId}
                className="flex gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80"
              >
                {/* Item Thumbnail */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                  <Image
                    src={item.menuItem.imageUrl}
                    alt={item.menuItem.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm text-zinc-100 truncate">
                      {item.menuItem.name}
                    </h4>
                    <button
                      onClick={() => removeItem(item.cartItemId)}
                      className="text-zinc-500 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Options list */}
                  {item.selectedOptions.length > 0 && (
                    <div className="text-[11px] text-zinc-400 mt-0.5 space-y-0.5">
                      {item.selectedOptions.map((opt) => (
                        <div key={opt.optionId} className="truncate">
                          + {opt.optionName}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Special note */}
                  {item.specialInstructions && (
                    <div className="text-[11px] text-amber-400/90 italic truncate mt-0.5">
                      Note: &ldquo;{item.specialInstructions}&rdquo;
                    </div>
                  )}

                  {/* Quantity and Price row */}
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-800/60">
                    <div className="flex items-center gap-1.5 bg-zinc-800/80 rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white rounded hover:bg-zinc-700 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-1.5 text-zinc-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white rounded hover:bg-zinc-700 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-bold text-sm text-amber-400">
                      ₦{item.lineTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Checkout summary */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950 space-y-3">
            <div className="space-y-1.5 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-zinc-200">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>
                  {fulfillmentType === 'pickup'
                    ? 'Store Pickup:'
                    : 'Est. Delivery Fee:'}
                </span>
                <span className="font-semibold text-zinc-200">
                  {fulfillmentType === 'pickup'
                    ? 'FREE (₦0)'
                    : `₦${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                <span>Total:</span>
                <span className="text-amber-400">₦{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 transition-all hover:scale-[1.01] active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
