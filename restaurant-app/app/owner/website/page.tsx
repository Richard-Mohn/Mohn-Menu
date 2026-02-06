'use client';

import { useAuth } from '@/context/AuthContext';
import WebsiteBuilder from '@/components/WebsiteBuilder';

/**
 * /owner/website — Website management page.
 * Embeds the full WebsiteBuilder component (wizard + post-publish dashboard).
 */
export default function OwnerWebsitePage() {
  const { currentBusiness } = useAuth();

  if (!currentBusiness) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-zinc-400 font-bold">No business found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-black">Website Manager</h1>
        <p className="text-zinc-400 font-medium mt-1">
          Build and manage your SEO-optimized website for {currentBusiness.name}.
        </p>
      </div>

      {/* WebsiteBuilder */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6 lg:p-8">
        <WebsiteBuilder
          businessId={currentBusiness.businessId}
          businessSlug={currentBusiness.slug}
          businessName={currentBusiness.name}
          currentWebsite={currentBusiness.website}
          businessState={currentBusiness.state}
          businessCity={currentBusiness.city}
          businessType={currentBusiness.type}
        />
      </div>
    </div>
  );
}
