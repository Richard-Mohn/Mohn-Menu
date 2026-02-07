'use client';

import { Suspense, useEffect } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { GTM_ID, pageview, setUserId } from '@/lib/gtag';
import { useAuth } from '@/context/AuthContext';

/**
 * Inner tracker that uses useSearchParams (requires Suspense boundary).
 */
function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Track virtual page views on SPA route changes
  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    pageview(url);
  }, [pathname, searchParams]);

  // Link sessions to authenticated user
  useEffect(() => {
    setUserId(user?.uid ?? null);
  }, [user]);

  return null;
}

/**
 * Google Tag Manager — single container that manages GA4, Facebook Pixel,
 * and any future tags from one place.
 *
 * After deploying, enable Google Tag Gateway in GTM admin so the
 * container loads from your first-party domain (faster, ad-block resistant).
 */
export default function GoogleAnalytics() {
  return (
    <>
      {/* Google Tag Manager */}
      <Script id="gtm-init" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>

      {/* GTM noscript fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>

      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
    </>
  );
}
