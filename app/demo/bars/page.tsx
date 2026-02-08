'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import FloatingStoreIcons from '@/components/FloatingStoreIcons';
import {
  FaGlassCheers, FaArrowRight, FaCreditCard, FaBitcoin, FaMobileAlt,
  FaQrcode, FaStar, FaCalendarAlt, FaUsers, FaClock,
  FaListAlt, FaPercent, FaConciergeBell, FaShieldAlt,
  FaChartLine, FaGlobe, FaMapMarkerAlt, FaMusic, FaBell,
  FaCheck, FaPlay, FaChevronRight, FaWifi, FaVideo,
  FaDollarSign, FaHeart, FaBolt, FaGem,
  FaIdBadge, FaExchangeAlt
} from 'react-icons/fa';

/* ─── Animated stat counter ─── */
const StatCounter = ({ value, suffix, label }: { value: string; suffix?: string; label: string }) => (
  <div className="text-center">
    <div className="text-4xl md:text-5xl font-black text-white">
      {value}<span className="text-purple-400">{suffix}</span>
    </div>
    <p className="text-zinc-500 text-sm font-bold mt-1 uppercase tracking-wider">{label}</p>
  </div>
);

/* ─── Feature card with purple hover ─── */
const FeatureCard = ({ icon: Icon, title, desc, delay }: { icon: any; title: string; desc: string; delay: number }) => (
  <motion.div
    className="bg-white p-7 rounded-3xl shadow-sm border border-zinc-100 flex flex-col items-start text-left group hover:border-purple-200 hover:shadow-xl transition-all duration-500"
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="w-13 h-13 bg-zinc-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-violet-600 group-hover:text-white transition-all duration-500 shadow-sm p-3">
      <Icon className="text-2xl" />
    </div>
    <h4 className="text-lg font-bold text-black mb-2">{title}</h4>
    <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

/* ─── Phone mockup component ─── */
const PhoneMockup = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <motion.div
    className="relative mx-auto"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
  >
    <div className="bg-zinc-900 rounded-[2.5rem] p-3 shadow-2xl shadow-purple-500/10 max-w-[320px] mx-auto border border-zinc-700">
      {/* Notch */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-zinc-900 rounded-b-2xl z-20" />
      <div className="bg-zinc-800 rounded-[2rem] overflow-hidden">
        {children}
      </div>
    </div>
    <p className="text-center text-zinc-400 text-xs font-bold mt-4 uppercase tracking-widest">{label}</p>
  </motion.div>
);

export default function BarsDemoPage() {
  return (
    <div className="min-h-screen bg-white/90">

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — Full-impact dark hero with floating icons
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-purple-950">
        {/* Floating icons behind hero */}
        <FloatingStoreIcons storeType="bar" count={22} position="absolute" />

        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-800/5 rounded-full blur-[200px]" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-black uppercase tracking-widest text-purple-400"
              >
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                Demo Store — Bars & Nightlife
              </motion.div>
              <motion.h1
                className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white leading-[0.95]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                The Copper<br />
                Tap<span className="text-purple-400">.</span>
              </motion.h1>
              <motion.p
                className="text-lg text-zinc-400 leading-relaxed font-medium max-w-lg mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                A next-generation bar experience. Your customers scan a QR code, browse your full drink &
                food menu, order from their table, and pay — without ever flagging down a bartender.
                Reservations, VIP service, crypto payments, and zero commission.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-3 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link href="/register" className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-full font-bold text-lg flex items-center gap-3 hover:shadow-xl hover:shadow-purple-500/30 transition-all">
                  Start Free <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/for-bars-nightlife" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                  Learn More
                </Link>
              </motion.div>

              {/* Quick feature pills */}
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {['QR Table Ordering', 'Table Reservations', 'Crypto Payments', 'VIP Experiences', 'Zero Commission'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-zinc-400">
                    {tag}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right — Phone mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-zinc-800/50 rounded-[2.5rem] p-4 shadow-2xl shadow-purple-500/10 max-w-[340px] mx-auto border border-zinc-700/50 backdrop-blur-sm">
                <div className="bg-zinc-900 rounded-[2rem] overflow-hidden">
                  {/* Status bar */}
                  <div className="bg-zinc-900 px-6 py-3 flex items-center justify-between">
                    <span className="text-white text-xs font-bold">9:41</span>
                    <div className="flex items-center gap-1.5">
                      <FaWifi className="text-white text-xs" />
                      <div className="w-6 h-3 border border-white rounded-sm relative">
                        <div className="absolute inset-0.5 right-1 bg-green-500 rounded-[1px]" />
                      </div>
                    </div>
                  </div>
                  {/* Bar menu preview */}
                  <div className="p-4 space-y-3">
                    <div className="text-center mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg shadow-purple-500/30">
                        <FaGlassCheers className="text-white text-xl" />
                      </div>
                      <h3 className="text-white font-black text-lg">The Copper Tap</h3>
                      <p className="text-zinc-500 text-xs">Downtown Richmond</p>
                    </div>

                    {/* Menu categories */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {['🍸 Cocktails', '🍺 Beer', '🍷 Wine', '🍔 Food'].map((cat, i) => (
                        <div key={cat} className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${i === 0 ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                          {cat}
                        </div>
                      ))}
                    </div>

                    {/* Sample items */}
                    {[
                      { name: 'Old Fashioned', price: '$14', desc: 'Bourbon, bitters, orange' },
                      { name: 'Spicy Margarita', price: '$13', desc: 'Tequila, jalapeño, lime' },
                      { name: 'Espresso Martini', price: '$15', desc: 'Vodka, espresso, Kahlúa' },
                    ].map((item, i) => (
                      <div key={i} className="bg-zinc-800/60 rounded-xl p-3 flex items-center justify-between hover:bg-zinc-800 transition-colors">
                        <div>
                          <p className="text-white font-bold text-sm">{item.name}</p>
                          <p className="text-zinc-500 text-xs">{item.desc}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400 font-black text-sm">{item.price}</span>
                          <div className="w-7 h-7 bg-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-black">+</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Cart bar */}
                    <div className="bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl p-3 flex items-center justify-between mt-2">
                      <div>
                        <p className="text-white font-bold text-xs">2 items</p>
                        <p className="text-purple-200 text-[10px]">Table 7</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-black text-sm">$27.00</span>
                        <FaChevronRight className="text-white text-xs" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STATS BAR
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-zinc-950 border-t border-zinc-800 py-12 px-4">
        <div className="container mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCounter value="0" suffix="%" label="Commission" />
          <StatCounter value="30" suffix="s" label="Avg Order Time" />
          <StatCounter value="25" suffix="%" label="Higher Tabs" />
          <StatCounter value="8" suffix="+" label="Crypto Coins" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          THE CUSTOMER JOURNEY — Step by step
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 relative overflow-hidden">
        <FloatingStoreIcons storeType="bar" count={12} position="absolute" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-black uppercase tracking-widest text-xs mb-3 block">Customer Journey</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-black">
              How Your Customers Order<span className="text-purple-500">.</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">From scanning a QR code to paying — everything happens on their phone in under 60 seconds.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', icon: FaQrcode, title: 'Scan the QR Code', desc: 'Customer sits down, scans the QR on their table or bar mat. Instantly opens your full digital menu — no app download, no account needed.', color: 'from-purple-500 to-violet-600' },
              { step: '02', icon: FaListAlt, title: 'Browse & Order', desc: 'They scroll through cocktails, beer, wine, and food. Tap to add items, customize modifiers, and add special instructions. Real-time cart total shown.', color: 'from-violet-500 to-purple-600' },
              { step: '03', icon: FaCreditCard, title: 'Pay Instantly', desc: 'Apple Pay, Google Pay, credit card, or cryptocurrency. Payment completes in seconds — no splitting bills, no waiting for the check.', color: 'from-purple-600 to-indigo-600' },
              { step: '04', icon: FaBell, title: 'Order Arrives', desc: 'The order pops up on your KDS or tablet with an audio chime. Your team prepares and delivers to the table. Customer can reorder anytime.', color: 'from-indigo-500 to-purple-500' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-3xl border border-zinc-100 overflow-hidden group hover:shadow-xl hover:border-purple-100 transition-all duration-500"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className={`bg-gradient-to-br ${item.color} p-6 flex items-center justify-between`}>
                  <item.icon className="text-white text-3xl" />
                  <span className="text-white/30 text-5xl font-black">{item.step}</span>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-black mb-2">{item.title}</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FULL FEATURE BREAKDOWN
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-zinc-50/50 relative overflow-hidden">
        <FloatingStoreIcons storeType="bar" count={10} position="absolute" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-black uppercase tracking-widest text-xs mb-3 block">Everything Included</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-black">
              Every Feature Your Bar Needs<span className="text-purple-500">.</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">All of these features are available on your bar&apos;s ordering page — zero additional software needed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard icon={FaQrcode} title="QR Code Table Ordering" desc="Place a QR code on every table, the bar top, and your entrance. Customers scan it and instantly see your full menu with photos, prices, and descriptions. No app download required." delay={0.05} />
            <FeatureCard icon={FaListAlt} title="Full Digital Menu" desc="Organize your entire drink and food menu with categories, modifiers, and photos. Cocktails, draft beer, wine by the glass, bottle service, appetizers — everything in one place." delay={0.1} />
            <FeatureCard icon={FaCreditCard} title="Instant Card Payments" desc="Accept all major cards via Stripe. Apple Pay and Google Pay supported. Payments process in seconds — no more running tabs or splitting bills manually." delay={0.15} />
            <FeatureCard icon={FaBitcoin} title="Cryptocurrency Payments" desc="Accept Bitcoin, Ethereum, USDT, SOL, Litecoin, Dogecoin, TRX, and USDC. Customers scan a QR code from their crypto wallet and pay instantly." delay={0.2} />
            <FeatureCard icon={FaMobileAlt} title="Cash App QR Payments" desc="Customers scan your Cash App QR and send payment via Bitcoin on Cash App. Popular with the younger crowd — the crypto bar experience." delay={0.25} />
            <FeatureCard icon={FaCalendarAlt} title="Table Reservations" desc="Customers book tables directly from your page. Pick party size, date, time, seating preference, and occasion. You confirm with one click — zero per-diner fees." delay={0.3} />
            <FeatureCard icon={FaStar} title="VIP & Bottle Service" desc="Flag VIP reservations for priority treatment. Accept bottle service bookings with premium packages. Track birthdays, bachelor parties, and corporate events." delay={0.35} />
            <FeatureCard icon={FaConciergeBell} title="Seating Preference" desc="Indoor, outdoor, bar seating, or private rooms. Customers choose — you manage capacity and optimize your floor plan for maximum covers." delay={0.4} />
            <FeatureCard icon={FaMusic} title="Event & Happy Hour Menus" desc="Schedule happy hour pricing automatically. Create event-specific menus for trivia night, live music, or game day. Promote specials directly on your ordering page." delay={0.45} />
            <FeatureCard icon={FaChartLine} title="Real-Time Analytics" desc="See what's selling, peak order times, average tab size, and drink popularity. Data-driven decisions to optimize your menu and staffing." delay={0.5} />
            <FeatureCard icon={FaShieldAlt} title="Fraud Protection" desc="Enterprise-grade chargeback coverage on every digital transaction. No tab-walkers, no stolen card worries. Every order is protected automatically." delay={0.55} />
            <FeatureCard icon={FaGlobe} title="White-Label Storefront" desc="Your own branded page at mohnmenu.com/your-bar or your custom domain. Your logo, colors, and name — no third-party branding visible to customers." delay={0.6} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          RESERVATION SYSTEM DEEP DIVE
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-purple-600 font-black uppercase tracking-widest text-xs mb-3 block">Reservations</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-black">
                OpenTable Charges $1.50 per Diner<span className="text-purple-500">.</span><br />
                <span className="text-zinc-400">We Charge $0.</span>
              </h2>
              <p className="text-zinc-500 text-lg mb-8 leading-relaxed">
                A busy bar seating 200 covers a night pays OpenTable $9,000/month just for reservations.
                With MohnMenu, your reservation system is built right into your ordering page — free.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Party size selection (1 to 20+ guests)',
                  'Date & time picker with availability',
                  'Indoor, outdoor, bar, or private seating',
                  'VIP toggle for priority treatment',
                  'Birthday, anniversary, and occasion tracking',
                  'Special requests and dietary notes',
                  'Auto-confirm or manual approval',
                  'Real-time dashboard with status workflow',
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="w-6 h-6 bg-purple-50 rounded-full flex items-center justify-center shrink-0">
                      <FaCheck className="text-purple-600 text-xs" />
                    </div>
                    <span className="text-zinc-700 font-medium text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>

              <Link href="/features/reservations" className="inline-flex items-center gap-2 text-purple-600 font-bold hover:text-purple-700 transition-colors">
                Learn about reservations <FaArrowRight className="text-sm" />
              </Link>
            </div>

            {/* Reservation phone mockup */}
            <PhoneMockup label="Customer Reservation Flow">
              <div className="p-4 space-y-3 bg-white min-h-[420px]">
                <div className="text-center mb-3">
                  <h3 className="text-black font-black text-lg">Reserve a Table</h3>
                  <p className="text-zinc-400 text-xs">The Copper Tap</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 mb-2">Party Size</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                      <div key={n} className={`py-2 rounded-lg text-center text-sm font-black ${n === 4 ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-600'}`}>{n}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 mb-2">Seating</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Indoor', 'Bar', 'Outdoor', 'Private'].map((s, i) => (
                      <div key={s} className={`py-2 rounded-lg text-center text-xs font-bold ${i === 1 ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-600'}`}>{s}</div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs font-bold text-zinc-500 mb-1">Date</p>
                    <div className="bg-zinc-100 rounded-lg px-3 py-2 text-xs font-bold text-black">Sat, Feb 8</div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 mb-1">Time</p>
                    <div className="bg-zinc-100 rounded-lg px-3 py-2 text-xs font-bold text-black">8:30 PM</div>
                  </div>
                </div>

                {/* Bartender selection */}
                <div>
                  <p className="text-xs font-bold text-zinc-500 mb-2">Request a Bartender</p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {[
                      { name: 'Mike R.', specialty: 'Cocktails', rating: '4.9', selected: true },
                      { name: 'Sarah L.', specialty: 'Wine', rating: '4.8', selected: false },
                      { name: 'Any', specialty: '', rating: '', selected: false },
                    ].map((b, i) => (
                      <div key={i} className={`flex flex-col items-center gap-1 p-2 rounded-xl min-w-[64px] ${b.selected ? 'bg-purple-50 border border-purple-200' : 'bg-zinc-50'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${b.selected ? 'bg-purple-500 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                          {b.name.charAt(0)}
                        </div>
                        <span className="text-[10px] font-bold text-black">{b.name}</span>
                        {b.rating && <span className="text-[9px] text-amber-500 font-bold">⭐ {b.rating}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-3 flex items-center justify-between border border-amber-100">
                  <div className="flex items-center gap-2">
                    <FaStar className="text-amber-500" />
                    <span className="text-xs font-bold text-black">VIP Experience</span>
                  </div>
                  <div className="w-10 h-5 bg-amber-500 rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
                  </div>
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl font-bold text-sm mt-1">
                  Confirm Reservation
                </button>
              </div>
            </PhoneMockup>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STAFF MARKETPLACE — WHO'S WORKING TONIGHT
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-zinc-50/50 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-black uppercase tracking-widest text-xs mb-3 block">Staff Marketplace</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-black">
              Who&apos;s Working Tonight<span className="text-purple-500">?</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Customers see your bartenders and servers, follow their favorites, and pre-order drinks before they even arrive.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Features */}
            <div className="space-y-6">
              {[
                { icon: FaIdBadge, title: 'Staff Profiles', desc: 'Every bartender and server gets a profile with photo, bio, specialties, and customer ratings. Build a following across venues.' },
                { icon: FaExchangeAlt, title: 'Multi-Venue Work', desc: 'Staff work at multiple bars and restaurants. One profile, many venues. Like the gig economy, but for hospitality — without the fees.' },
                { icon: FaHeart, title: 'Follow & Get Notified', desc: 'Customers follow their favorite bartenders. When they pick up a shift, followers get notified. Free marketing for your bar.' },
                { icon: FaGlassCheers, title: 'Pre-Order Before Arriving', desc: 'Customer sees Mike is working tonight? They reserve a table, request Mike, and pre-order their Old Fashioned — ready when they sit down.' },
                { icon: FaCalendarAlt, title: 'Shift Scheduling & Swaps', desc: 'Post shifts, staff claim them. Need a last-minute replacement? The platform finds qualified bartenders instantly. Cross-venue swaps with owner approval.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex gap-4 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                    <item.icon className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-black mb-1">{item.title}</h4>
                    <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}

              <div className="flex flex-wrap gap-3 pt-4">
                <Link href="/features/staff-marketplace" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-full font-bold text-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all">
                  Learn More <FaArrowRight className="text-xs" />
                </Link>
                <Link href="/signup/bartender" className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-zinc-200 text-black rounded-full font-bold text-sm hover:border-black transition-all">
                  Join as Staff
                </Link>
              </div>
            </div>

            {/* Right — Staff cards mockup */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">Tonight at The Copper Tap</p>
              {[
                {
                  name: 'Mike Reeves',
                  role: 'Head Bartender',
                  specialty: 'Craft Cocktails • Mixology',
                  rating: '4.9',
                  reviews: 127,
                  followers: 342,
                  shift: '6 PM — 2 AM',
                  avatar: 'M',
                  featured: true,
                  certs: ['TABC', 'TIPS'],
                },
                {
                  name: 'Sarah Lin',
                  role: 'Bartender',
                  specialty: 'Wine • Tiki & Tropical',
                  rating: '4.8',
                  reviews: 89,
                  followers: 198,
                  shift: '7 PM — Close',
                  avatar: 'S',
                  featured: false,
                  certs: ['TABC'],
                },
                {
                  name: 'James Kowalski',
                  role: 'Server',
                  specialty: 'Fine Dining Service',
                  rating: '4.7',
                  reviews: 56,
                  followers: 104,
                  shift: '5 PM — 11 PM',
                  avatar: 'J',
                  featured: false,
                  certs: ['ServSafe'],
                },
              ].map((staff, i) => (
                <motion.div
                  key={i}
                  className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-lg ${
                    staff.featured ? 'border-purple-200 shadow-md' : 'border-zinc-100'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg ${
                      staff.featured ? 'bg-gradient-to-br from-purple-500 to-violet-600 shadow-purple-500/20' : 'bg-zinc-800'
                    }`}>
                      {staff.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-black">{staff.name}</span>
                        {staff.featured && <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-black rounded-full">POPULAR</span>}
                      </div>
                      <p className="text-zinc-400 text-xs font-medium">{staff.role} • {staff.specialty}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                        <span className="flex items-center gap-1 text-amber-500 font-bold">⭐ {staff.rating} <span className="text-zinc-400 font-normal">({staff.reviews})</span></span>
                        <span className="flex items-center gap-1"><FaHeart className="text-red-400 text-[10px]" /> {staff.followers}</span>
                        <span className="flex items-center gap-1"><FaClock className="text-[10px]" /> {staff.shift}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        {staff.certs.map(c => (
                          <span key={c} className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100">{c}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors">
                        Reserve + Pre-Order
                      </button>
                      <button className="px-3 py-1.5 bg-zinc-100 text-zinc-600 rounded-lg text-xs font-bold hover:bg-zinc-200 transition-colors flex items-center gap-1 justify-center">
                        <FaHeart className="text-[10px]" /> Follow
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PAYMENT METHODS SHOWCASE
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-zinc-950 text-white rounded-[3rem] mx-4 mb-6 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-violet-600/10 blur-[150px] rounded-full" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <span className="text-purple-400 font-black uppercase tracking-widest text-xs mb-3 block">Payment Methods</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Every way to pay<span className="text-purple-400">.</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Your customers choose how they pay. You get the money. No middleman taking a cut.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: FaCreditCard, title: 'Credit & Debit Cards', desc: 'Visa, Mastercard, Amex via Stripe. Apple Pay & Google Pay. Direct to your bank.', accent: 'bg-blue-500' },
              { icon: FaBitcoin, title: '8 Cryptocurrencies', desc: 'BTC, ETH, USDT, SOL, USDC, LTC, DOGE, TRX. QR scan and instant confirmation.', accent: 'bg-orange-500' },
              { icon: FaMobileAlt, title: 'Cash App Bitcoin', desc: 'Customers scan a QR from Cash App and pay with Bitcoin. The bar crypto experience.', accent: 'bg-green-500' },
              { icon: FaDollarSign, title: 'Cash on Arrival', desc: 'For customers who prefer cash. Tab tracked digitally, payment at the bar.', accent: 'bg-emerald-500' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-zinc-900/60 p-7 rounded-3xl border border-zinc-800 hover:border-zinc-700 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`w-12 h-12 ${item.accent} rounded-xl flex items-center justify-center mb-5 shadow-lg`}>
                  <item.icon className="text-white text-xl" />
                </div>
                <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          OWNER DASHBOARD PREVIEW
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 relative overflow-hidden">
        <FloatingStoreIcons storeType="bar" count={8} position="absolute" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-black uppercase tracking-widest text-xs mb-3 block">Owner Tools</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-black">
              Your Command Center<span className="text-purple-500">.</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Everything you need to run your bar from any device — phone, tablet, or laptop.</p>
          </div>

          {/* Dashboard mockup */}
          <motion.div
            className="bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-800 shadow-2xl max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <FaGlassCheers className="text-white text-sm" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">The Copper Tap</h3>
                  <p className="text-zinc-500 text-xs">Owner Dashboard</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-400 text-xs font-bold">Live</span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Tonight\'s Orders', value: '47', trend: '+12%' },
                { label: 'Revenue', value: '$2,340', trend: '+8%' },
                { label: 'Active Tables', value: '12', trend: '' },
                { label: 'Reservations', value: '8', trend: '' },
              ].map((stat, i) => (
                <div key={i} className="bg-zinc-800/60 rounded-xl p-4">
                  <p className="text-zinc-500 text-xs font-bold mb-1">{stat.label}</p>
                  <div className="flex items-end gap-2">
                    <span className="text-white font-black text-xl">{stat.value}</span>
                    {stat.trend && <span className="text-green-400 text-xs font-bold">{stat.trend}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3">Recent Orders</p>
              <div className="space-y-2">
                {[
                  { table: 'Table 7', items: '2x Old Fashioned, 1x Burger', total: '$42.00', status: 'Preparing', statusColor: 'text-amber-400 bg-amber-400/10' },
                  { table: 'Bar 3', items: '3x Craft IPA, 1x Wings', total: '$38.50', status: 'Ready', statusColor: 'text-green-400 bg-green-400/10' },
                  { table: 'Table 12', items: '1x Espresso Martini, 1x Charcuterie', total: '$31.00', status: 'Served', statusColor: 'text-blue-400 bg-blue-400/10' },
                ].map((order, i) => (
                  <div key={i} className="bg-zinc-800/40 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <span className="text-purple-400 text-xs font-black">{order.table.split(' ')[1]}</span>
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{order.table}</p>
                        <p className="text-zinc-500 text-xs">{order.items}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold text-sm">{order.total}</span>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          COMPARISON — Why MohnMenu
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-zinc-50/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-black uppercase tracking-widest text-xs mb-3 block">The Real Math</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-black">
              What You Keep<span className="text-purple-500">.</span>
            </h2>
          </div>

          <motion.div
            className="bg-white rounded-3xl border border-zinc-100 shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-3 bg-zinc-50 px-6 py-4 border-b border-zinc-100">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-400">On a $50 Tab</span>
              <span className="text-xs font-black uppercase tracking-wider text-zinc-400 text-center">Toast / Square</span>
              <span className="text-xs font-black uppercase tracking-wider text-purple-600 text-center">MohnMenu</span>
            </div>
            {[
              { feature: 'Commission', them: '$1.25 – $1.75', us: '$0.00' },
              { feature: 'Monthly Software', them: '$69 – $399/mo', us: '$0/mo (free plan)' },
              { feature: 'Per-diner reservation fee', them: '$1.00 – $1.50', us: '$0.00' },
              { feature: 'Hardware required', them: '$500 – $2,000', us: 'Your phone or tablet' },
              { feature: 'Crypto payments', them: 'Not supported', us: '8 coins' },
              { feature: 'Customer data', them: 'Shared/restricted', us: '100% yours' },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-3 px-6 py-4 ${i < 5 ? 'border-b border-zinc-50' : ''}`}>
                <span className="text-sm font-bold text-black">{row.feature}</span>
                <span className="text-sm text-red-500 text-center font-medium">{row.them}</span>
                <span className="text-sm text-green-600 font-bold text-center">{row.us}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW TO GET STARTED
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-zinc-50 rounded-[3rem] mx-4 mb-6 relative overflow-hidden">
        <FloatingStoreIcons storeType="bar" count={10} position="absolute" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-black uppercase tracking-widest text-xs mb-3 block">Getting Started</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-black">
              Live Before Happy Hour<span className="text-purple-500">.</span>
            </h2>
            <p className="text-zinc-400 text-lg">Set up your bar&apos;s ordering system in under 10 minutes.</p>
          </div>
          <div className="space-y-8">
            {[
              { n: '1', t: 'Create your bar profile', d: 'Sign up free. Enter your bar name, upload your logo, set your hours. Your branded ordering page and reservation system generate instantly.' },
              { n: '2', t: 'Build your menu', d: 'Add cocktails, beer, wine, and food with photos, prices, and descriptions. Create happy hour menus and bottle service packages.' },
              { n: '3', t: 'Connect payments', d: 'Link your Stripe account (5 minutes). Enable crypto payments with one toggle. Cash option is on by default.' },
              { n: '4', t: 'Print QR codes', d: 'Auto-generated QR codes for every table, the bar top, entrance, and bathrooms. Customers scan and order — no app download ever needed.' },
              { n: '5', t: 'Start serving', d: 'Orders appear on your screen with audio alerts. Manage reservations, track what sells, and grow your business with real data.' },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="flex gap-6 items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                  {step.n}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-black mb-1">{step.t}</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">{step.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl bg-gradient-to-br from-purple-600 via-purple-700 to-violet-800 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl text-center relative overflow-hidden">
          <div className="relative z-10">
            <FaGlassCheers className="text-5xl text-white/20 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Your bar. Zero commission.<br />Full control.
            </h2>
            <p className="text-purple-200 text-lg mb-10 max-w-xl mx-auto">
              Start free tonight. No credit card. No contract. No per-diner fees. Just a better way to run your bar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-purple-700 rounded-full font-bold text-lg hover:bg-purple-50 transition-all shadow-xl">
                Get Started Free <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/pricing" className="px-10 py-5 border-2 border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                View Pricing
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-violet-900/30 to-transparent pointer-events-none" />
          <div className="absolute top-10 left-10 w-48 h-48 bg-purple-400/10 blur-[80px] rounded-full" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-violet-400/10 blur-[80px] rounded-full" />
        </div>
      </section>
    </div>
  );
}
