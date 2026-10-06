'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Check } from 'lucide-react';
import { MenuItem, CartItemOption } from '@/types';
import { useCart } from '@/context/CartContext';

interface MenuItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export function MenuItemModal({ item, onClose }: MenuItemModalProps) {
  const { addItem } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, CartItemOption>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Reset and pre-select defaults on item change
  useEffect(() => {
    if (!item) return;
    const initial: Record<string, CartItemOption> = {};

    item.modifierGroups?.forEach((group) => {
      if (group.required && group.options.length > 0) {
        const defaultOpt = group.options[0];
        initial[group.id] = {
          groupId: group.id,
          groupTitle: group.title,
          optionId: defaultOpt.id,
          optionName: defaultOpt.name,
          priceDelta: defaultOpt.priceDelta,
        };
      }
    });

    setSelectedOptions(initial);
    setSpecialInstructions('');
  }, [item]);

  if (!item) return null;

  const handleRadioChange = (
    groupId: string,
    groupTitle: string,
    optionId: string,
    optionName: string,
    priceDelta: number
  ) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupId]: {
        groupId,
        groupTitle,
        optionId,
        optionName,
        priceDelta,
      },
    }));
  };

  const handleCheckboxToggle = (
    groupId: string,
    groupTitle: string,
    optionId: string,
    optionName: string,
    priceDelta: number
  ) => {
    const key = `${groupId}:${optionId}`;
    setSelectedOptions((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = {
          groupId,
          groupTitle,
          optionId,
          optionName,
          priceDelta,
        };
      }
      return next;
    });
  };

  const optionsArray = Object.values(selectedOptions);
  const additionalCost = optionsArray.reduce((acc, opt) => acc + opt.priceDelta, 0);
  const totalUnitPrice = Math.max(0, item.price + additionalCost);

  const handleAddToCart = () => {
    addItem(item, optionsArray, specialInstructions.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-zinc-950 text-white rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Header Image */}
        <div className="relative h-48 sm:h-56 w-full bg-zinc-900">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, 512px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded-full text-zinc-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-extrabold text-xl text-white">{item.name}</h3>
              <span className="font-extrabold text-lg text-amber-400 shrink-0">
                ₦{item.price.toLocaleString()}
              </span>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Modifier Groups */}
          {item.modifierGroups?.map((group) => (
            <div key={group.id} className="pt-3 border-t border-zinc-900">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-zinc-200">{group.title}</h4>
                <span className="text-[10px] uppercase font-semibold text-zinc-500">
                  {group.required ? 'Required (Pick 1)' : 'Optional'}
                </span>
              </div>

              <div className="space-y-1.5">
                {group.options.map((opt) => {
                  const isRadio = group.required;
                  const isSelected = isRadio
                    ? selectedOptions[group.id]?.optionId === opt.id
                    : Boolean(selectedOptions[`${group.id}:${opt.id}`]);

                  return (
                    <label
                      key={opt.id}
                      onClick={() => {
                        if (isRadio) {
                          handleRadioChange(
                            group.id,
                            group.title,
                            opt.id,
                            opt.name,
                            opt.priceDelta
                          );
                        } else {
                          handleCheckboxToggle(
                            group.id,
                            group.title,
                            opt.id,
                            opt.name,
                            opt.priceDelta
                          );
                        }
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 text-white font-medium'
                          : 'border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'border-amber-500 bg-amber-500 text-zinc-950'
                              : 'border-zinc-600'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span>{opt.name}</span>
                      </div>
                      {opt.priceDelta !== 0 && (
                        <span className="text-xs text-amber-400 font-semibold">
                          {opt.priceDelta > 0 ? `+₦${opt.priceDelta.toLocaleString()}` : `-₦${Math.abs(opt.priceDelta).toLocaleString()}`}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Kitchen Special Notes */}
          <div className="pt-3 border-t border-zinc-900">
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              Special Kitchen Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Extra spicy, no onions, package pepper separately"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              maxLength={120}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-zinc-400 block">Total Item Price</span>
            <span className="text-lg font-extrabold text-amber-400">
              ₦{totalUnitPrice.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Tray</span>
          </button>
        </div>
      </div>
    </div>
  );
}
