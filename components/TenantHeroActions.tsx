/**
 * TenantHeroActions — Hero CTA buttons for tenant homepage
 *
 * Two primary actions:
 *   1. "Quick Order" — opens inline ordering modal
 *   2. "Register" / account button — sign up for rewards, receipts, tracking
 * Plus secondary "View Menu" and "Full Menu & Order" links.
 *
 * Both modals (QuickOrderModal, AuthModal) are wrapped here
 * since the tenant homepage page.tsx is a server component.
 */

'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import type { MohnMenuBusiness } from '@/lib/types';
import {
  FaShoppingCart, FaUser, FaStar, FaReceipt, FaArrowRight,
} from 'react-icons/fa';

const QuickOrderModal = dynamic(() => import('./QuickOrderModal'), { ssr: false });
import { useAuthModal } from '@/context/AuthModalContext';

export default function TenantHeroActions({
  business,
  orderPath,
  menuPath,
}: {
  business: MohnMenuBusiness & { businessId: string };
  orderPath: string;
  menuPath: string;
}) {
  const { user } = useAuth();
  const { openAuthModal } = useAuthModal();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* ── Primary CTA Row ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
        {/* Quick Order — primary action */}
        {business.settings?.orderingEnabled && (
          <button
            onClick={() => setModalOpen(true)}
            className="group px-10 py-5 bg-black text-white rounded-full font-bold text-lg flex items-center gap-3 hover:bg-zinc-800 transition-all shadow-xl cursor-pointer"
          >
            <FaShoppingCart className="text-base" />
            Quick Order
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        )}

        {/* Register / Account — secondary action */}
        {user ? (
          <a
            href="/customer/orders"
            className="px-10 py-5 bg-zinc-100 text-black rounded-full font-bold text-lg flex items-center gap-3 hover:bg-zinc-200 transition-all"
          >
            <FaReceipt className="text-base" />
            My Orders
          </a>
        ) : (
          <button
            onClick={() => openAuthModal('signup')}
            className="px-10 py-5 bg-white text-black border-2 border-zinc-200 rounded-full font-bold text-lg flex items-center gap-3 hover:border-black transition-all cursor-pointer"
          >
            <FaUser className="text-base" />
            Register for Rewards
          </button>
        )}
      </div>

      {/* ── Secondary links ─────────────────────────────── */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <a
          href={menuPath}
          className="text-zinc-500 font-bold hover:text-black transition-colors flex items-center gap-1.5"
        >
          View Menu <FaArrowRight className="text-[10px]" />
        </a>
        <a
          href={orderPath}
          className="text-zinc-500 font-bold hover:text-black transition-colors flex items-center gap-1.5"
        >
          Full Menu &amp; Order <FaArrowRight className="text-[10px]" />
        </a>
      </div>

      {/* ── Benefits teaser (for non-logged-in users) ──── */}
      {!user && (
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-zinc-400 font-medium">
          <span className="flex items-center gap-1.5">
            <FaStar className="text-amber-400" /> Earn Rewards
          </span>
          <span className="flex items-center gap-1.5">
            <FaReceipt className="text-zinc-400" /> Track Orders
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            📱 Digital Receipts
          </span>
        </div>
      )}

      {/* ── Modals ──────────────────────────────────────── */}
      <QuickOrderModal
        business={business}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
