import React from 'react';
import Link from 'next/link';
import { Flame, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import { generateWhatsAppSupportUrl } from '@/lib/whatsapp';

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                PrimeHeritage
              </span>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              PrimeHeritage Foods & Catering Services delivers piping-hot fast food,
              signature smoky Jollof combos, charcoal grills, and executive event catering
              within Ikorodu and surrounding vicinities.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={generateWhatsAppSupportUrl('General Inquiry')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp: 09026875420</span>
              </a>
            </div>
          </div>

          {/* Quick Routes */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">
              Fast Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  Storefront Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-amber-400 transition-colors">
                  Food Menu & Order
                </Link>
              </li>
              <li>
                <Link href="/catering" className="hover:text-amber-400 transition-colors">
                  Event Catering Packages
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-amber-400 transition-colors">
                  Checkout & Payment
                </Link>
              </li>
            </ul>
          </div>

          {/* Location & Operating Hours */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-2">
              Kitchen Hub
            </h4>
            <div className="flex items-start gap-2.5 text-xs leading-relaxed">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                PrimeHeritage Kitchen, Ikorodu Central Axis (6.613065° N, 3.541461° E),
                Lagos, Nigeria.
              </span>
            </div>
            <div className="flex items-start gap-2.5 text-xs leading-relaxed">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Open Daily: 9:00 AM – 10:00 PM</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <a href="tel:09026875420" className="hover:text-white transition-colors">
                Hotline: 09026875420
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} PrimeHeritage Foods & Catering Services. All rights reserved.</p>
          <div className="flex items-center gap-4 text-zinc-500">
            <span>Powered by Next.js & Paystack</span>
            <span>•</span>
            <span>Ikorodu Vicinity Focused</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
