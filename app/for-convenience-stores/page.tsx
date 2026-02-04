'use client';

import Image from "next/image";
import Link from "next/link";
import Footer from '@/components/Footer';
import { FloatingItems, GradientText } from '@/components/AnimatedElements';

export default function ForConvenienceStores() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
      <FloatingItems />
      
      {/* HERO SECTION */}
      <section className="relative flex-1 flex items-center min-h-screen overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&q=80&w=2000"
            alt="Convenience store"
            fill
            className="object-cover opacity-20 dark:opacity-10"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/50 to-white dark:via-zinc-950/50 dark:to-zinc-950" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <span className="inline-block bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-6 border border-blue-200 dark:border-blue-800">
              <span className="text-sm font-black text-blue-900 dark:text-blue-300 uppercase tracking-wide">For Convenience Stores</span>
            </span>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-zinc-900 dark:text-white leading-[0.95] tracking-tighter mb-8">
              Grab-and-Go
              <br />
              <GradientText>Without the Big Fees</GradientText>
            </h1>
            
            <p className="text-xl sm:text-2xl text-zinc-700 dark:text-zinc-300 font-semibold mb-12 max-w-3xl leading-relaxed">
              Your margins are already tight. Don't lose 30% to delivery apps. Enable QR code ordering and let customers order directly from their phone.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-16">
              <Link 
                href="#demo"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/30 active:scale-95 text-lg"
              >
                Schedule Demo
              </Link>
              <a 
                href="#details"
                className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all border-2 border-zinc-200 dark:border-zinc-800 text-lg"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-black text-zinc-900 dark:text-white mb-4">
              The Margin <GradientText>Squeeze</GradientText>
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Convenience stores operate on 2-5% margins. Losing 30% to delivery apps makes no sense.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="text-5xl font-black text-red-600 mb-4">30%</div>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4">What You're Losing</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                On a $50 convenience store order placed through DoorDash, Uber Eats, or GrubHub:
              </p>
              <div className="space-y-3 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex justify-between">
                  <span>Order Total</span>
                  <span className="font-bold">$50.00</span>
                </div>
                <div className="flex justify-between text-red-600 dark:text-red-400">
                  <span>Platform Commission (30%)</span>
                  <span className="font-bold">-$15.00</span>
                </div>
                <div className="flex justify-between text-red-600 dark:text-red-400">
                  <span>Payment Processing</span>
                  <span className="font-bold">-$1.50</span>
                </div>
                <div className="border-t border-red-300 dark:border-red-700 pt-3 flex justify-between font-black">
                  <span>You Actually Get</span>
                  <span>$33.50</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="text-5xl font-black text-emerald-600 mb-4">2.9%</div>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4">With OrderFlow</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Same $50 order, but customers order directly via QR code:
              </p>
              <div className="space-y-3 text-sm bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="flex justify-between">
                  <span>Order Total</span>
                  <span className="font-bold">$50.00</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Payment Processing (2.9%)</span>
                  <span className="font-bold">-$1.45</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>OrderFlow Platform</span>
                  <span className="font-bold">$0.00</span>
                </div>
                <div className="border-t border-emerald-300 dark:border-emerald-700 pt-3 flex justify-between font-black">
                  <span>You Actually Get</span>
                  <span>$48.55</span>
                </div>
              </div>
              <div className="mt-6 text-center font-black text-emerald-600 text-lg">+$15.05 Extra Per Order</div>
            </div>
          </div>
        </div>
      </section>

      {/* QR CODE ADVANTAGE */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl sm:text-6xl font-black text-zinc-900 dark:text-white mb-16 text-center">
            QR Code <GradientText>Ordering System</GradientText>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center border border-blue-200 dark:border-blue-800">
              <div className="text-center">
                <div className="text-7xl mb-4">📱</div>
                <p className="font-black text-zinc-900 dark:text-white text-lg">One Scan</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Instant menu, direct payment</p>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-black text-zinc-900 dark:text-white mb-8">Grab-and-Go Customers Love</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-600">
                      <span className="text-white font-black">1</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-zinc-900 dark:text-white mb-1">No Wait. Zero Friction.</h4>
                    <p className="text-zinc-600 dark:text-zinc-400">Customers scan, order, pay, and leave. In and out in 2 minutes.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-600">
                      <span className="text-white font-black">2</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-zinc-900 dark:text-white mb-1">Live Inventory Updates</h4>
                    <p className="text-zinc-600 dark:text-zinc-400">Sold out of coffee? Update it instantly. No "temporarily unavailable" frustration.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-600">
                      <span className="text-white font-black">3</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-zinc-900 dark:text-white mb-1">Impulse Buy Optimization</h4>
                    <p className="text-zinc-600 dark:text-zinc-400">Suggest complementary items. "Add a beverage?" Built-in upsells.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-600">
                      <span className="text-white font-black">4</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-zinc-900 dark:text-white mb-1">Delivery or Pickup</h4>
                    <p className="text-zinc-600 dark:text-zinc-400">Offer both. Customer chooses. You control the fees for each.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-600">
                      <span className="text-white font-black">5</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-zinc-900 dark:text-white mb-1">Loyalty Built-In</h4>
                    <p className="text-zinc-600 dark:text-zinc-400">Every order via QR earns points. First customer gets 10% off. Repeat business.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl sm:text-6xl font-black text-zinc-900 dark:text-white mb-16 text-center">
            Perfect For All Store <GradientText>Types</GradientText>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3">Quick Pick-Up</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Customers grab pre-ordered snacks, drinks, and items on their way home. Reduces impulse returns, increases average order value.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="text-4xl mb-4">🍜</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3">Hot Food/Deli</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Pre-order sandwiches, prepared foods, pizza slices. Heat them just before pickup. No waste, always fresh.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="text-4xl mb-4">☕</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3">Coffee Shop</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Customers order & pay before arriving. Brew their drink as they walk in. Morning rush? No problem.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3">Small Batches</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Make exactly what's ordered. No over-prep waste. Perfect for organic, fresh, or specialty items.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3">Multiple Locations</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Chain of convenience stores? Create once, scale everywhere. Customers order from their nearest location.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3">Reduce Touchless</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                After pandemic, many prefer contactless. QR ordering = full digital experience. Safe for customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl sm:text-6xl font-black text-zinc-900 dark:text-white mb-16 text-center">
            Features Built For <GradientText>You</GradientText>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-800">
              <div className="text-3xl mb-3">📸</div>
              <h3 className="font-black text-zinc-900 dark:text-white mb-3">Photo-Based Menu</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                High-quality photos of each item. Customers know exactly what they're ordering. Increases order confidence.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-800">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-black text-zinc-900 dark:text-white mb-3">Real-Time Notifications</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Customers get notified when their order is ready. No "Is it done yet?" questions.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-800">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-black text-zinc-900 dark:text-white mb-3">Instant Payments</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Customers pay via card immediately. Money hits your account daily. No cash handling.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-800">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-black text-zinc-900 dark:text-white mb-3">Sales Insights</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                See top-selling items, peak hours, customer trends. Optimize your inventory and staffing.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-800">
              <div className="text-3xl mb-3">🎁</div>
              <h3 className="font-black text-zinc-900 dark:text-white mb-3">Built-In Marketing</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Create promotions, coupons, and loyalty programs. Drive repeat visits without third-party app fees.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-800">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-black text-zinc-900 dark:text-white mb-3">Mobile Optimized</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Works perfectly on every device. Customers have a smooth app-like experience via their browser.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-700 dark:to-cyan-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl sm:text-6xl font-black text-white mb-8">
            Keep Your Margins Healthy
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Every order through your QR code is a sale you keep 97%+ of the revenue from. Start today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#demo" 
              className="bg-white text-blue-600 px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-zinc-100 transition-all text-lg"
            >
              Schedule Demo
            </Link>
            <a 
              href="/pricing" 
              className="bg-blue-700 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-800 transition-all border-2 border-white text-lg"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
