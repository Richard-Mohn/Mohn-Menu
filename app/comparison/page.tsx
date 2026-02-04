'use client';

import Image from "next/image";
import Link from "next/link";
import Footer from '@/components/Footer';
import { GradientText } from '@/components/AnimatedElements';

export default function Comparison() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
      {/* HERO SECTION */}
      <section className="py-24 pt-40">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-zinc-900 dark:text-white leading-[0.95] tracking-tighter mb-8">
            Why Restaurants
            <br />
            <GradientText>Choose OrderFlow</GradientText>
          </h1>
          
          <p className="text-xl sm:text-2xl text-zinc-700 dark:text-zinc-300 font-semibold max-w-3xl mx-auto leading-relaxed">
            See how we compare to DoorDash, Uber Eats, and GrubHub. It's not even close.
          </p>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900 overflow-x-auto">
        <div className="container mx-auto px-4">
          <div className="min-w-full">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
              <div className="lg:col-span-2 bg-white dark:bg-zinc-800 p-6 rounded-xl font-black text-zinc-900 dark:text-white">
                Feature
              </div>
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-xl font-black text-zinc-900 dark:text-white border-2 border-red-200 dark:border-red-800">
                DoorDash
              </div>
              <div className="bg-gradient-to-br from-black to-gray-800 p-6 rounded-xl font-black text-white border-2 border-gray-800 dark:border-gray-600">
                Uber Eats
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl font-black text-zinc-900 dark:text-white border-2 border-indigo-200 dark:border-indigo-800">
                OrderFlow
              </div>
            </div>

            {/* COMMISSION */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
              <div className="lg:col-span-2 bg-white dark:bg-zinc-800 p-6 rounded-xl font-bold text-zinc-900 dark:text-white">
                Commission Rate
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl text-zinc-600 dark:text-zinc-400">
                <div className="text-2xl font-black text-red-600 mb-2">30%</div>
                <p className="text-xs">Often 35-40% with fees</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl text-zinc-600 dark:text-zinc-400">
                <div className="text-2xl font-black text-red-600 mb-2">25-30%</div>
                <p className="text-xs">Plus service & delivery</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl text-zinc-600 dark:text-zinc-400">
                <div className="text-2xl font-black text-emerald-600 mb-2">$0</div>
                <p className="text-xs">No per-order fees</p>
              </div>
            </div>

            {/* CUSTOMER DATA */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
              <div className="lg:col-span-2 bg-white dark:bg-zinc-800 p-6 rounded-xl font-bold text-zinc-900 dark:text-white">
                Own Your Customer Data
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl">❌</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">DoorDash owns it</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl">❌</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Uber owns it</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl text-emerald-600">✓</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">100% yours</p>
              </div>
            </div>

            {/* DIRECT CONTACT */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
              <div className="lg:col-span-2 bg-white dark:bg-zinc-800 p-6 rounded-xl font-bold text-zinc-900 dark:text-white">
                Direct Customer Contact
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl">❌</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">They block it</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl">❌</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">They block it</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl text-emerald-600">✓</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Email & SMS</p>
              </div>
            </div>

            {/* CONTROL PRICING */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
              <div className="lg:col-span-2 bg-white dark:bg-zinc-800 p-6 rounded-xl font-bold text-zinc-900 dark:text-white">
                Control Menu & Pricing
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl">❌</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Limited control</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl">❌</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Limited control</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl text-emerald-600">✓</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Full control</p>
              </div>
            </div>

            {/* DELIVERY */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
              <div className="lg:col-span-2 bg-white dark:bg-zinc-800 p-6 rounded-xl font-bold text-zinc-900 dark:text-white">
                Delivery Management
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl">❌</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Their drivers</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl">❌</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Their drivers</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl text-emerald-600">✓</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Your drivers</p>
              </div>
            </div>

            {/* CUSTOMER SUPPORT */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
              <div className="lg:col-span-2 bg-white dark:bg-zinc-800 p-6 rounded-xl font-bold text-zinc-900 dark:text-white">
                Restaurant Support
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl">⚠️</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Email only</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl">⚠️</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Email only</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl text-emerald-600">✓</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Phone + Email</p>
              </div>
            </div>

            {/* ANALYTICS */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
              <div className="lg:col-span-2 bg-white dark:bg-zinc-800 p-6 rounded-xl font-bold text-zinc-900 dark:text-white">
                Real-Time Analytics
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl">⚠️</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Basic</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl">⚠️</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Basic</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl text-emerald-600">✓</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Advanced</p>
              </div>
            </div>

            {/* LOYALTY PROGRAM */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
              <div className="lg:col-span-2 bg-white dark:bg-zinc-800 p-6 rounded-xl font-bold text-zinc-900 dark:text-white">
                Built-In Loyalty
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl">❌</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Not included</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl">❌</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Not included</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl text-emerald-600">✓</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Included</p>
              </div>
            </div>

            {/* CONTRACTS */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
              <div className="lg:col-span-2 bg-white dark:bg-zinc-800 p-6 rounded-xl font-bold text-zinc-900 dark:text-white">
                Long-Term Contracts
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl">❌</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">12+ months</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl">❌</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">12+ months</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl">
                <div className="text-3xl text-emerald-600">✓</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Month-to-month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12-MONTH COST */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl sm:text-6xl font-black text-zinc-900 dark:text-white mb-16 text-center">
            12-Month Total <GradientText>Cost</GradientText>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-8 rounded-2xl border-2 border-red-200 dark:border-red-800">
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4">DoorDash</h3>
              <div className="text-4xl font-black text-red-600 mb-2">$7,176</div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Based on 400 orders/month at $25 avg
              </p>
              <p className="text-xs text-red-600 font-bold">30% of annual revenue</p>
            </div>

            <div className="bg-gradient-to-br from-black/5 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 p-8 rounded-2xl border-2 border-gray-300 dark:border-gray-700">
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4">Uber Eats</h3>
              <div className="text-4xl font-black text-red-600 mb-2">$6,960</div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Based on 27% commission + fees
              </p>
              <p className="text-xs text-red-600 font-bold">29% of annual revenue</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-8 rounded-2xl border-2 border-orange-200 dark:border-orange-800">
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4">GrubHub</h3>
              <div className="text-4xl font-black text-red-600 mb-2">$7,452</div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Based on average 32% commission
              </p>
              <p className="text-xs text-red-600 font-bold">31% of annual revenue</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-8 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800">
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4">OrderFlow</h3>
              <div className="text-4xl font-black text-emerald-600 mb-2">$1,428</div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                $299 setup + $99 × 12 months
              </p>
              <p className="text-xs text-emerald-600 font-bold">6% of annual revenue</p>
            </div>
          </div>

          <div className="mt-16 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 p-12 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800">
            <h3 className="text-3xl font-black text-emerald-900 dark:text-emerald-300 mb-4 text-center">
              You Save $5,748 - $6,024 Annually
            </h3>
            <p className="text-center text-emerald-900 dark:text-emerald-300 font-bold">
              That's $478-502 every single month back in your pocket.
            </p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE ORDERFLOW */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl sm:text-6xl font-black text-zinc-900 dark:text-white mb-16 text-center">
            Why Smart Restaurants <GradientText>Choose OrderFlow</GradientText>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3">Your Business, Your Rules</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                No platform owns your customers. No algorithm controls your visibility. You decide how your restaurant appears and how you operate.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3">80%+ More Profit</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                On a typical 400-order month, you keep an extra $5,600+ that would've gone to DoorDash. Reinvest it in your restaurant.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3">Own Your Customers</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Every email, phone number, and order history is yours. Build a real relationship. Run promotions. Create loyalty.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3">Speed & Control</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Real-time order notifications, live GPS tracking for deliveries, kitchen management tools built specifically for restaurants.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3">We're on Your Side</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                We succeed when you succeed. Our business model doesn't depend on taking a cut of your sales. We actually care about your margins.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3">Scale Your Business</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Multiple locations? No problem. Same flat fee structure. Analytics across all locations. One dashboard for everything.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl sm:text-6xl font-black text-white mb-8">
            Stop Losing 30% to Delivery Apps
          </h2>
          <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
            See how OrderFlow works. Book a demo with one of our restaurant specialists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/pricing" 
              className="bg-white text-indigo-600 px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-zinc-100 transition-all text-lg"
            >
              View Pricing
            </Link>
            <Link 
              href="#contact" 
              className="bg-indigo-700 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-indigo-800 transition-all border-2 border-white text-lg"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
