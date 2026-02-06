/**
 * TenantHeroActions — Client component for tenant homepage hero buttons
 *
 * Wraps the "Quick Order" button and the QuickOrderModal since
 * the tenant homepage is server-rendered but modals need client state.
 */

'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { MohnMenuBusiness } from '@/lib/types';

const QuickOrderModal = dynamic(() => import('./QuickOrderModal'), { ssr: false });

export default function TenantHeroActions({
  business,
  orderPath,
  menuPath,
}: {
  business: MohnMenuBusiness & { businessId: string };
  orderPath: string;
  menuPath: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {business.settings?.orderingEnabled && (
          <button
            onClick={() => setModalOpen(true)}
            className="group px-10 py-5 bg-black text-white rounded-full font-bold text-lg flex items-center gap-3 hover:bg-zinc-800 transition-all shadow-xl cursor-pointer"
          >
            Quick Order
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        )}
        <a
          href={menuPath}
          className="px-10 py-5 bg-white text-black border-2 border-zinc-200 rounded-full font-bold text-lg hover:border-black transition-all"
        >
          View Menu
        </a>
        <a
          href={orderPath}
          className="px-10 py-5 bg-zinc-100 text-black rounded-full font-bold text-lg hover:bg-zinc-200 transition-all"
        >
          Full Menu &amp; Order
        </a>
      </div>

      <QuickOrderModal
        business={business}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
