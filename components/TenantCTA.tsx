/**
 * TenantCTA — Bottom call-to-action section for tenant homepage
 *
 * Client component so we can trigger the QuickOrderModal
 * from the "Ready to Order?" CTA at the bottom of the page.
 */

'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import type { MohnMenuBusiness } from '@/lib/types';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

const QuickOrderModal = dynamic(() => import('./QuickOrderModal'), { ssr: false });
import { useAuthModal } from '@/context/AuthModalContext';

export default function TenantCTA({
  business,
  menuPath,
}: {
  business: MohnMenuBusiness & { businessId: string };
  menuPath: string;
}) {
  const { user } = useAuth();
  const { openAuthModal } = useAuthModal();
  const [quickOrderOpen, setQuickOrderOpen] = useState(false);

  return (
    <section className="py-24 px-4 bg-black text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
          Ready to Order?
        </h2>
        <p className="text-xl text-zinc-400 mb-10 max-w-xl mx-auto">
          Fresh food, fast service, and real-time tracking. What are you waiting for?
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {business.settings?.orderingEnabled && (
            <button
              onClick={() => setQuickOrderOpen(true)}
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-zinc-200 transition-all cursor-pointer"
            >
              <FaShoppingCart />
              Quick Order
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          )}
          {!user ? (
            <button
              onClick={() => openAuthModal('signup')}
              className="inline-flex items-center gap-3 px-10 py-5 border-2 border-zinc-700 text-white rounded-full font-bold text-lg hover:border-white transition-all cursor-pointer"
            >
              <FaUser />
              Register — Earn Rewards
            </button>
          ) : (
            <a
              href={menuPath}
              className="inline-flex items-center gap-3 px-10 py-5 border-2 border-zinc-700 text-white rounded-full font-bold text-lg hover:border-white transition-all"
            >
              View Full Menu
            </a>
          )}
        </div>
      </div>

      <QuickOrderModal
        business={business}
        isOpen={quickOrderOpen}
        onClose={() => setQuickOrderOpen(false)}
      />
    </section>
  );
}
