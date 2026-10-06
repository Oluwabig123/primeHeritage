// Helper for Paystack Inline payments

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: PaystackOptions) => {
        openIframe: () => void;
      };
    };
  }
}

export interface PaystackOptions {
  key: string;
  email: string;
  amount: number; // in Kobo (e.g. ₦1000 = 100000)
  currency: 'NGN';
  ref: string;
  metadata?: Record<string, unknown>;
  callback: (response: { reference: string; status: string }) => void;
  onClose: () => void;
}

export function loadPaystackScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.PaystackPop) {
      resolve(true);
      return;
    }

    const existingScript = document.getElementById('paystack-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      return;
    }

    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Paystack inline script failed to load.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export function getPaystackPublicKey(): string {
  return (
    process.env.NEXT_PUBLIC_PAYSTACK_KEY ||
    'pk_test_5c50c5ef9976da2857476e33008064b3ef87be7b' // Public test key fallback
  );
}

export function generatePaymentReference(prefix: string = 'PH'): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${random}`;
}
