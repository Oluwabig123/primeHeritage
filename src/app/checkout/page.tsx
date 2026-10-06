'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  ArrowLeft,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import styles from './checkout.module.css';
import { useCart } from '@/context/CartContext';
import {
  IKORODU_LANDMARKS,
  calculateDistanceKm,
  calculateDeliveryFee,
  KITCHEN_ANCHOR,
} from '@/lib/vicinity';
import {
  loadPaystackScript,
  getPaystackPublicKey,
  generatePaymentReference,
} from '@/lib/paystack';
import {
  generateWhatsAppOrderUrl,
  generateWhatsAppOutOfRadiusUrl,
} from '@/lib/whatsapp';
import { saveOrderRecord } from '@/lib/supabase';
import { OrderRecord, OrderType } from '@/types';

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    deliveryFee,
    totalAmount,
    fulfillmentType,
    setFulfillmentType,
    clearCart,
  } = useCart();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [selectedLandmarkId, setSelectedLandmarkId] = useState(
    IKORODU_LANDMARKS[0].id
  );
  const [specialNotes, setSpecialNotes] = useState('');

  // UI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  // Load Paystack script
  useEffect(() => {
    loadPaystackScript();
  }, []);

  const selectedLandmark =
    IKORODU_LANDMARKS.find((l) => l.id === selectedLandmarkId) ||
    IKORODU_LANDMARKS[0];

  // Recalculate distance and fee
  const distanceKm =
    fulfillmentType === 'pickup'
      ? 0
      : calculateDistanceKm(
          KITCHEN_ANCHOR.lat,
          KITCHEN_ANCHOR.lng,
          selectedLandmark.lat,
          selectedLandmark.lng
        );

  const deliveryCalc =
    fulfillmentType === 'pickup'
      ? { isDeliverable: true, distanceKm: 0, fee: 0 }
      : calculateDeliveryFee(distanceKm);

  const activeDeliveryFee = fulfillmentType === 'pickup' ? 0 : deliveryCalc.fee;
  const currentTotal = subtotal + activeDeliveryFee;

  // Phone validation (Nigerian format: 080..., 090..., 070..., 081..., +234...)
  const isPhoneValid = (phone: string) => {
    const cleaned = phone.replace(/\s+/g, '');
    return /^(\+?234|0)[789][01]\d{8}$/.test(cleaned);
  };

  const handlePaystackPayment = () => {
    setValidationError(null);

    // Validation
    if (!customerName.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!customerPhone.trim() || !isPhoneValid(customerPhone)) {
      setValidationError(
        'Please enter a valid Nigerian WhatsApp phone number (e.g. 09026875420 or 08012345678).'
      );
      return;
    }
    if (fulfillmentType === 'delivery' && !customerAddress.trim()) {
      setValidationError('Please enter your specific street delivery address in Ikorodu.');
      return;
    }
    if (fulfillmentType === 'delivery' && !deliveryCalc.isDeliverable) {
      setValidationError(
        'Delivery distance exceeds our 18km kitchen freshness limit. Please select store pickup or contact us on WhatsApp.'
      );
      return;
    }
    if (items.length === 0) {
      setValidationError('Your tray is empty. Add food items before checking out.');
      return;
    }

    setIsProcessing(true);

    const paystackKey = getPaystackPublicKey();
    const reference = generatePaymentReference('PH');
    const orderNumber = `PH-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderRecord: OrderRecord = {
      orderNumber,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      orderType: fulfillmentType,
      landmark: selectedLandmark.name,
      deliveryAddress:
        fulfillmentType === 'pickup'
          ? 'Store Pickup: PrimeHeritage Kitchen, Ikorodu Central'
          : customerAddress.trim(),
      distanceKm,
      items: items.map((i) => ({
        name: i.menuItem.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        options: i.selectedOptions.map((o) => `${o.groupTitle}: ${o.optionName}`),
        specialInstructions: i.specialInstructions,
      })),
      subtotal,
      deliveryFee: activeDeliveryFee,
      totalAmount: currentTotal,
      paystackReference: reference,
      paymentStatus: 'paid',
      status: 'pending',
    };

    if (window.PaystackPop) {
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: `${customerPhone.replace(/\D/g, '')}@primeheritage.ng`,
        amount: Math.round(currentTotal * 100), // in Kobo
        currency: 'NGN',
        ref: reference,
        metadata: {
          custom_fields: [
            { display_name: 'Customer Name', variable_name: 'customer_name', value: customerName },
            { display_name: 'Phone', variable_name: 'customer_phone', value: customerPhone },
            { display_name: 'Order Number', variable_name: 'order_number', value: orderNumber },
          ],
        },
        callback: async function (response) {
          setIsProcessing(false);
          orderRecord.paystackReference = response.reference;

          // 1. Persist order
          await saveOrderRecord(orderRecord);

          // 2. Clear cart & set completed order state
          clearCart();
          setCompletedOrder(orderRecord);

          // 3. Dispatch WhatsApp ticket
          const whatsappUrl = generateWhatsAppOrderUrl(orderRecord);
          window.open(whatsappUrl, '_blank');
        },
        onClose: function () {
          setIsProcessing(false);
        },
      });

      handler.openIframe();
    } else {
      // Fallback if Paystack iframe is blocked
      setTimeout(async () => {
        setIsProcessing(false);
        await saveOrderRecord(orderRecord);
        clearCart();
        setCompletedOrder(orderRecord);
        const whatsappUrl = generateWhatsAppOrderUrl(orderRecord);
        window.open(whatsappUrl, '_blank');
      }, 1000);
    }
  };

  // SUCCESS RECEIPT VIEW
  if (completedOrder) {
    const whatsappUrl = generateWhatsAppOrderUrl(completedOrder);
    return (
      <div className={styles.checkoutContainer}>
        <div className="max-w-2xl mx-auto px-4">
          <div className={styles.receiptContainer}>
            <div className="text-center space-y-2 mb-6">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-white">Order Confirmed & Paid!</h2>
              <p className="text-xs text-zinc-400">
                Order #{completedOrder.orderNumber} • Reference: {completedOrder.paystackReference}
              </p>
            </div>

            <div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800 space-y-3 mb-6 text-xs text-zinc-300">
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Customer:</span>
                <span className="font-semibold text-white">{completedOrder.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Phone:</span>
                <span className="font-semibold text-white">{completedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Fulfillment:</span>
                <span className="font-semibold text-amber-400 uppercase">
                  {completedOrder.orderType}
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Destination:</span>
                <span className="font-semibold text-white text-right max-w-xs">
                  {completedOrder.deliveryAddress}
                </span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold text-white">
                <span>Total Paid (Paystack NGN):</span>
                <span className="text-emerald-400">
                  ₦{completedOrder.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Kitchen WhatsApp Ticket (+2349026875420)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Link
                href="/menu"
                className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
              >
                Back To Food Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // REGULAR CHECKOUT VIEW
  return (
    <div className={styles.checkoutContainer}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-4">
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Ordering</span>
          </Link>
        </div>

        <div className={styles.checkoutHeader}>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Checkout & Order Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Pay online securely via Paystack & dispatch your order receipt instantly to WhatsApp.
          </p>
        </div>

        {validationError && (
          <div className="mb-6 max-w-4xl mx-auto p-3.5 bg-rose-950/60 border border-rose-900 rounded-xl text-rose-300 text-xs sm:text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className={styles.cardPanel}>
              {/* Fulfillment Toggle */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-zinc-300 mb-2">
                  Fulfillment Mode
                </label>
                <div className={styles.tabSelector}>
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('delivery')}
                    className={`${styles.tabButton} ${
                      fulfillmentType === 'delivery'
                        ? styles.tabButtonActive
                        : styles.tabButtonInactive
                    }`}
                  >
                    Home / Office Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('pickup')}
                    className={`${styles.tabButton} ${
                      fulfillmentType === 'pickup'
                        ? styles.tabButtonActive
                        : styles.tabButtonInactive
                    }`}
                  >
                    Store Pickup (Benson, Ikorodu)
                  </button>
                </div>
              </div>

              {/* Customer Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Babatunde Johnson"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 08012345678 or 09026875420"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Delivery Area / Landmark Selection */}
                {fulfillmentType === 'delivery' && (
                  <div className="space-y-4 pt-2 border-t border-zinc-800">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        Select Delivery Neighborhood / Landmark *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3 pointer-events-none" />
                        <select
                          value={selectedLandmarkId}
                          onChange={(e) => setSelectedLandmarkId(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                          {IKORODU_LANDMARKS.map((lm) => (
                            <option key={lm.id} value={lm.id}>
                              {lm.name} ({lm.areaNotes})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        Street Address / Apartment Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 14 Kokoro Abu Street, off Itamaga Road, Flat 3B"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Delivery Distance & Fee Card */}
                    {deliveryCalc.isDeliverable ? (
                      <div className="bg-emerald-950/30 border border-emerald-900/60 rounded-xl p-3 text-xs text-emerald-300 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>
                            Distance: ~<strong>{distanceKm} km</strong> from PrimeHeritage Kitchen
                          </span>
                        </div>
                        <span className="font-black text-sm text-white">
                          Fee: ₦{deliveryCalc.fee.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <div className="bg-amber-950/40 border border-amber-900/60 rounded-xl p-3.5 space-y-2 text-xs text-amber-200">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block text-white">
                              Outside 18km Regular Delivery Zone (~{distanceKm} km)
                            </span>
                            <p className="text-amber-200/90 text-xs mt-0.5">
                              {deliveryCalc.outOfRadiusMessage}
                            </p>
                          </div>
                        </div>
                        <div className="pt-1 flex justify-end">
                          <a
                            href={generateWhatsAppOutOfRadiusUrl(
                              selectedLandmark.name,
                              distanceKm,
                              `Subtotal ₦${subtotal.toLocaleString()}`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Chat on WhatsApp for Special Courier</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Special Delivery Notes */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Order Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Call upon arrival at the gate, black gate with bell"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Paystack Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className={styles.cardPanel}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-500" />
                  <h3 className="font-extrabold text-sm text-white">Order Summary</h3>
                </div>
                <span className="text-xs text-zinc-400 font-semibold">
                  {items.reduce((acc, i) => acc + i.quantity, 0)} Items
                </span>
              </div>

              {/* Items List */}
              <div className="py-2 divide-y divide-zinc-800/60 max-h-60 overflow-y-auto">
                {items.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">Your tray is empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.cartItemId} className="py-2.5 text-xs space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-zinc-200">
                          {item.quantity}x {item.menuItem.name}
                        </span>
                        <span className="font-bold text-white">
                          ₦{item.lineTotal.toLocaleString()}
                        </span>
                      </div>
                      {item.selectedOptions.length > 0 && (
                        <div className="text-[11px] text-zinc-400">
                          {item.selectedOptions.map((o) => o.optionName).join(', ')}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Cost Totals */}
              <div className="pt-3 border-t border-zinc-800 space-y-2 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Food Subtotal:</span>
                  <span className="text-zinc-200 font-semibold">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {fulfillmentType === 'pickup'
                      ? 'Store Pickup:'
                      : 'Delivery Fee (Calculated):'}
                  </span>
                  <span className="text-zinc-200 font-semibold">
                    {fulfillmentType === 'pickup'
                      ? 'FREE (₦0)'
                      : `₦${activeDeliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-800 text-base font-extrabold text-white">
                  <span>Total Amount:</span>
                  <span className="text-amber-400 font-black">
                    ₦{currentTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Paystack Online Payment Trigger */}
              <div className="pt-5 space-y-3">
                <button
                  type="button"
                  onClick={handlePaystackPayment}
                  disabled={
                    isProcessing ||
                    items.length === 0 ||
                    (fulfillmentType === 'delivery' && !deliveryCalc.isDeliverable)
                  }
                  className={styles.paystackButton}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>
                    {isProcessing
                      ? 'Initializing Paystack...'
                      : `Pay Online (₦${currentTotal.toLocaleString()})`}
                  </span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Secure 256-bit Encrypted Checkout via Paystack</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
