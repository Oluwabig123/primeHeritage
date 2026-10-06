import { OrderRecord, CateringInquiry } from '@/types';

export const WHATSAPP_PHONE = '2349026875420'; // Clean international format for 09026875420

/**
 * Generates an instant WhatsApp order dispatch URL with structured receipt.
 */
export function generateWhatsAppOrderUrl(order: OrderRecord): string {
  const itemsText = order.items
    .map((item) => {
      const optionsText =
        item.options && item.options.length > 0
          ? ` (${item.options.join(', ')})`
          : '';
      const notesText = item.specialInstructions
        ? `\n   ↳ Note: "${item.specialInstructions}"`
        : '';
      return `• ${item.quantity}x ${item.name}${optionsText} — ₦${(
        item.unitPrice * item.quantity
      ).toLocaleString()}${notesText}`;
    })
    .join('\n');

  const fulfillmentDetails =
    order.orderType === 'delivery'
      ? `📍 *Delivery Area:* ${order.landmark} (~${order.distanceKm} km from Kitchen)
🏠 *Street Address:* ${order.deliveryAddress}`
      : `🏬 *Fulfillment:* Store Pickup (PrimeHeritage Kitchen, Ikorodu Central)`;

  const message = `👑 *PRIMEHERITAGE ORDER #${order.orderNumber}*
----------------------------------------
👤 *Customer:* ${order.customerName}
📞 *Phone:* ${order.customerPhone}
${fulfillmentDetails}

🍽 *ITEMS ORDERED:*
${itemsText}

----------------------------------------
💵 *Food Subtotal:* ₦${order.subtotal.toLocaleString()}
🚚 *Delivery Fee:* ₦${order.deliveryFee.toLocaleString()}
💰 *TOTAL PAID:* ₦${order.totalAmount.toLocaleString()}

💳 *Paystack Ref:* ${order.paystackReference}
✅ *Payment Status:* Verified Paid Online
🕒 *Date:* ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${new Date().toLocaleDateString()}

_Please confirm order receipt and send estimated prep/dispatch time!_`;

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates an instant WhatsApp message for Catering Inquiries & Bookings.
 */
export function generateWhatsAppCateringUrl(inquiry: CateringInquiry): string {
  const message = `👑 *PRIMEHERITAGE CATERING INQUIRY #${inquiry.bookingNumber}*
----------------------------------------
👤 *Contact Name:* ${inquiry.contactName}
📞 *Phone Number:* ${inquiry.phone}
📅 *Event Date:* ${inquiry.eventDate}
📍 *Event Venue / Location:* ${inquiry.venue}
👥 *Expected Guests:* ${inquiry.guestCount} guests
🍱 *Package Selected:* ${inquiry.packageType}
💰 *Estimated Budget:* ~₦${inquiry.estimatedCost.toLocaleString()}
${inquiry.notes ? `📝 *Special Requests:* ${inquiry.notes}` : ''}

----------------------------------------
_Hello PrimeHeritage Team, I would like to book catering for my upcoming event. Please review my request and send formal confirmation & invoice._`;

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates WhatsApp URL for customers exceeding the 18km cut-off seeking special courier.
 */
export function generateWhatsAppOutOfRadiusUrl(
  landmark: string,
  distanceKm: number,
  notes?: string
): string {
  const message = `👑 *PRIMEHERITAGE SPECIAL COURIER REQUEST*
----------------------------------------
Hello PrimeHeritage Kitchen, I am placing an order from *${landmark}* (approx. ${distanceKm} km away), which is outside the regular 18km delivery zone.

${notes ? `Order details: ${notes}\n` : ''}
Could we arrange a dedicated express courier dispatch for this delivery? Thank you!`;

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * General customer assistance link.
 */
export function generateWhatsAppSupportUrl(topic: string = 'Inquiry'): string {
  const message = `Hello PrimeHeritage Foods & Catering! I have an inquiry regarding: ${topic}.`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
