'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaArrowRight, FaCheck, FaUsers, FaClock, FaCalendarAlt,
  FaStar, FaGlassCheers, FaIdBadge, FaExchangeAlt, FaMapMarkerAlt,
  FaChartLine, FaShieldAlt, FaHeart, FaDollarSign, FaUserTie,
  FaBell, FaHandshake, FaGlobe, FaUtensils, FaUserFriends
} from 'react-icons/fa';
import FloatingStoreIcons from '@/components/FloatingStoreIcons';

const FEATURES = [
  { icon: FaIdBadge, title: 'Staff Profiles', desc: 'Every bartender and server gets a professional profile with photo, bio, specialties, and ratings. Customers see who\'s working tonight and choose their favorite.' },
  { icon: FaExchangeAlt, title: 'Multi-Venue Work', desc: 'Bartenders and servers can work at multiple bars and restaurants on the platform. One profile, multiple venues — like Uber, but for hospitality staff.' },
  { icon: FaCalendarAlt, title: 'Shift Scheduling', desc: 'Owners post shifts. Staff claim or get assigned. Check-in/check-out timestamps tracked automatically. Full shift history and hours reporting.' },
  { icon: FaHandshake, title: 'Shift Swapping', desc: 'Can\'t make your shift? Post a swap request visible to qualified staff at the same venue (or same cuisine type if the owner allows cross-venue swaps).' },
  { icon: FaHeart, title: 'Follow Your Favorites', desc: 'Customers follow their favorite bartenders and servers. Get notified when they\'re working — then head there, pre-order a drink, and reserve a table.' },
  { icon: FaDollarSign, title: 'Earnings & Tips', desc: 'Track earnings per shift, per venue, and total. Digital tip tracking integrated with the ordering system. Stripe payouts to your bank.' },
  { icon: FaStar, title: 'Ratings & Reviews', desc: 'Customers rate their experience with specific servers. Build your reputation across venues and attract regulars wherever you work.' },
  { icon: FaShieldAlt, title: 'Age Verification', desc: 'Built-in age verification and compliance checks for bartenders serving alcohol. Required certifications tracked per staff member and jurisdiction.' },
  { icon: FaBell, title: 'Pre-Order Before Arriving', desc: 'When customers see their favorite bartender is working, they can reserve a table and pre-order their usual drink — ready when they walk in.' },
];

const HOW_IT_WORKS_STAFF = [
  { n: '1', t: 'Create your staff profile', d: 'Sign up as a bartender or server. Add your photo, experience, certifications, and specialties. Your profile is visible to customers at any venue you work at.' },
  { n: '2', t: 'Apply to venues', d: 'Browse bars and restaurants on the platform. Apply to work at multiple venues. Owners approve you based on your profile and certifications.' },
  { n: '3', t: 'Claim shifts', d: 'When an owner posts open shifts, you see them in your dashboard. Claim shifts that fit your schedule. Check in when you arrive, check out when you leave.' },
  { n: '4', t: 'Build your following', d: 'Deliver great service and customers will follow you. When you\'re working, your followers get notified. More followers = more tips = more shift options.' },
];

const HOW_IT_WORKS_OWNER = [
  { n: '1', t: 'Post shifts in your dashboard', d: 'Set the date, time, role, and requirements. Need a bartender Friday 6-2? Post it. Set whether you allow same-cuisine cross-venue swaps.' },
  { n: '2', t: 'Review & approve staff', d: 'Staff apply or claim open shifts. Review their profiles, ratings, certifications, and past reviews. Approve or decline with one click.' },
  { n: '3', t: 'Track in real-time', d: 'See who\'s checked in, shift hours, and performance. Customers can pre-order when they see their favorite server is working at your venue tonight.' },
  { n: '4', t: 'Grow with marketplace effects', d: 'Popular staff attract customers. When a bartender with 200 followers picks up a shift at your bar, their followers get notified — free marketing.' },
];

const CUSTOMER_FEATURES = [
  { icon: FaUserTie, title: 'See Who\u2019s Working', desc: 'Check which bartenders and servers are on shift tonight at any venue. See their profiles, specialties, and ratings.' },
  { icon: FaHeart, title: 'Follow Your Favorites', desc: 'Follow bartenders you love. Get notified when they pick up shifts, even at new venues. Never miss your favorite bartender again.' },
  { icon: FaGlassCheers, title: 'Pre-Order Your Drink', desc: 'See your bartender is working? Reserve a table and pre-order your go-to cocktail. It\'ll be ready when you sit down.' },
  { icon: FaCalendarAlt, title: 'Reserve + Server Request', desc: 'Book a table and request a specific server or bartender. VIP treatment without the VIP price tag.' },
];

const FAQS = [
  {
    q: 'How does multi-venue work for bartenders?',
    a: 'Bartenders create one profile and apply to work at multiple bars and restaurants on MohnMenu. Each venue approves them independently. When they pick up a shift, it shows on their profile and their followers get notified.',
  },
  {
    q: 'Can bartenders swap shifts across different bars?',
    a: 'If the owner enables cross-venue swaps (and both venues are the same cuisine type or bar style), staff can post swap requests visible to qualified staff at other venues. The receiving venue owner must approve. Same-venue swaps are always available.',
  },
  {
    q: 'Do customers need an account to see who\'s working?',
    a: 'No — the "Who\'s Working Tonight" section is visible to everyone on the venue\'s page. But to follow a bartender and get notifications, they\'ll need to create a free account.',
  },
  {
    q: 'How does pre-ordering work?',
    a: 'When a customer sees their favorite bartender is working, they can tap "Reserve & Pre-Order." They pick their table, time, and add drinks to a cart. The order is submitted when they check in at the venue — the bartender has it ready.',
  },
  {
    q: 'Is there age verification for bartenders?',
    a: 'Yes. Staff profiles track required certifications like TABC, TIPS, or state-specific alcohol server permits. Owners can require these before approving a staff member. Compliance is tracked per jurisdiction.',
  },
  {
    q: 'What does this cost for bar owners?',
    a: 'The staff marketplace is included in MohnMenu at no additional cost. Zero monthly fee for listings, zero per-shift charge. Bartenders and servers earn their normal pay plus tips — MohnMenu takes nothing.',
  },
];

export default function StaffMarketplaceFeature() {
  return (
    <div className="min-h-screen bg-white/90">
      <FloatingStoreIcons storeType="bar" count={15} />

      {/* ═══ HERO ═══ */}
      <section className="pt-36 pb-20 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-purple-50 border border-purple-100 text-xs font-black uppercase tracking-widest text-purple-600"
          >Feature</motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-zinc-900 text-balance"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          >
            Staff Marketplace<span className="text-purple-600">.</span>
          </motion.h1>
          <motion.p
            className="text-xl text-zinc-500 leading-relaxed font-medium max-w-3xl mx-auto mb-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            Bartenders and servers work across multiple venues. Customers follow their favorites and
            pre-order before they even walk in. Shift scheduling, swapping, profiles, and ratings — all
            built into MohnMenu for free.
          </motion.p>
          <motion.p
            className="text-lg text-zinc-400 font-medium max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          >
            Think of it as the gig economy for hospitality — without the gig economy fees.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/signup/bartender" className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-full font-bold text-lg flex items-center gap-3 hover:shadow-xl hover:shadow-purple-500/20 transition-all">
              Join as Staff <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/register" className="px-8 py-4 bg-white text-black border-2 border-zinc-200 rounded-full font-bold text-lg hover:border-black transition-all">
              I&apos;m an Owner
            </Link>
          </motion.div>
        </div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-100 rounded-full blur-[120px] opacity-30" />
      </section>

      {/* ═══ THREE PERSPECTIVES ═══ */}
      <section className="py-20 px-4 bg-zinc-950 text-white rounded-[3rem] mx-4 mb-6 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <span className="text-purple-400 font-black uppercase tracking-widest text-xs mb-3 block">Three Perspectives</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Everyone wins<span className="text-purple-400">.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: FaUserTie,
                title: 'For Staff',
                points: ['Work at multiple venues', 'Build a personal following', 'Swap shifts easily', 'Track earnings & tips', 'Professional profile & ratings'],
                accent: 'from-purple-500 to-violet-600',
              },
              {
                icon: FaGlassCheers,
                title: 'For Owners',
                points: ['Fill shifts from a pool of pros', 'Staff attract their followers', 'Post shifts, review, approve', 'Track check-in/check-out', 'Zero cost — included free'],
                accent: 'from-orange-500 to-red-600',
              },
              {
                icon: FaHeart,
                title: 'For Customers',
                points: ['Follow favorite bartenders', 'See who\'s working tonight', 'Pre-order drinks & reserve', 'Rate and review servers', 'Never miss your bartender'],
                accent: 'from-blue-500 to-indigo-600',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                className="bg-zinc-900/60 rounded-3xl border border-zinc-800 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`bg-gradient-to-br ${card.accent} p-6 flex items-center gap-3`}>
                  <card.icon className="text-white text-2xl" />
                  <h3 className="text-white font-black text-xl">{card.title}</h3>
                </div>
                <div className="p-6 space-y-3">
                  {card.points.map((point, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <FaCheck className="text-green-400 text-xs shrink-0" />
                      <span className="text-zinc-300 text-sm font-medium">{point}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FULL FEATURES ═══ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-black text-black mb-12 tracking-tight text-center">
            What&apos;s Included<span className="text-purple-500">.</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={i} className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 group hover:border-purple-200 hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-violet-600 group-hover:text-white transition-all shadow-sm">
                  <f.icon className="text-xl" />
                </div>
                <h4 className="text-lg font-bold text-black mb-2">{f.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS — STAFF ═══ */}
      <section className="py-20 px-4 bg-zinc-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-purple-600 font-black uppercase tracking-widest text-xs mb-3 block">For Bartenders & Servers</span>
            <h2 className="text-3xl font-black text-black tracking-tight">
              How It Works for Staff<span className="text-purple-500">.</span>
            </h2>
          </div>
          <div className="space-y-8">
            {HOW_IT_WORKS_STAFF.map((step, i) => (
              <motion.div key={i} className="flex gap-6 items-start" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">{step.n}</div>
                <div>
                  <h4 className="text-lg font-bold text-black mb-1">{step.t}</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">{step.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS — OWNERS ═══ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-orange-600 font-black uppercase tracking-widest text-xs mb-3 block">For Bar & Restaurant Owners</span>
            <h2 className="text-3xl font-black text-black tracking-tight">
              How It Works for Owners<span className="text-orange-500">.</span>
            </h2>
          </div>
          <div className="space-y-8">
            {HOW_IT_WORKS_OWNER.map((step, i) => (
              <motion.div key={i} className="flex gap-6 items-start" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">{step.n}</div>
                <div>
                  <h4 className="text-lg font-bold text-black mb-1">{step.t}</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">{step.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CUSTOMER EXPERIENCE ═══ */}
      <section className="py-20 px-4 bg-zinc-50 rounded-[3rem] mx-4 mb-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-blue-600 font-black uppercase tracking-widest text-xs mb-3 block">For Customers</span>
            <h2 className="text-4xl font-black tracking-tight mb-4 text-black">
              Your night, your way<span className="text-blue-500">.</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              See who&apos;s pouring tonight. Follow your favorite bartender across venues. Pre-order your drink before you walk in.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CUSTOMER_FEATURES.map((f, i) => (
              <motion.div key={i} className="bg-white p-7 rounded-3xl border border-zinc-100 shadow-sm"
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              >
                <f.icon className="text-2xl text-blue-500 mb-4" />
                <h4 className="text-lg font-bold text-black mb-2">{f.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SHIFT SWAPPING DEEP DIVE ═══ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-purple-600 font-black uppercase tracking-widest text-xs mb-3 block">Shift Management</span>
              <h2 className="text-4xl font-black tracking-tight mb-6 text-black">
                Smart Shift Swapping<span className="text-purple-500">.</span>
              </h2>
              <p className="text-zinc-500 text-lg mb-8 leading-relaxed">
                Life happens. When a bartender can&apos;t make their shift, the platform finds qualified replacements
                instantly — from the same venue or (with owner permission) from other venues with the same cuisine or bar type.
              </p>

              <div className="space-y-4">
                {[
                  'Same-venue swaps — always available',
                  'Cross-venue swaps — owner enables per venue',
                  'Same cuisine/bar type matching for cross-venue',
                  'Owner approval required for all swaps',
                  'Certification checks (age verification, TABC, etc.)',
                  'Swap history tracked for reliability scoring',
                  'Push notifications to qualified staff',
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
            </div>

            {/* Visual mockup */}
            <motion.div
              className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-bold text-sm">Shift Swap Request</h3>
                <span className="px-3 py-1 bg-amber-400/10 text-amber-400 rounded-full text-xs font-bold">Pending</span>
              </div>
              <div className="space-y-3">
                <div className="bg-zinc-800/60 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                      <FaUserTie className="text-red-400 text-sm" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Sarah M. (dropping)</p>
                      <p className="text-zinc-500 text-xs">Friday 6pm - 2am • The Copper Tap</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <FaExchangeAlt className="text-purple-400 text-lg" />
                </div>
                <div className="bg-zinc-800/60 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                      <FaUserTie className="text-green-400 text-sm" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">James K. (picking up)</p>
                      <p className="text-zinc-500 text-xs">⭐ 4.9 rating • TABC certified • 2 venues</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <FaCheck /> Approve
                </button>
                <button className="flex-1 py-3 bg-zinc-800 text-zinc-400 rounded-xl font-bold text-sm">
                  Decline
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-20 px-4 bg-zinc-50">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-black text-black mb-12 tracking-tight text-center">
            Questions & Answers<span className="text-purple-500">.</span>
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <motion.details key={i} className="group bg-white rounded-2xl border border-zinc-100 overflow-hidden"
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              >
                <summary className="px-6 py-5 cursor-pointer font-bold text-black flex items-center justify-between hover:bg-zinc-50 transition-colors">
                  {faq.q}
                  <span className="text-purple-500 text-xl ml-4 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-5 text-sm text-zinc-500 leading-relaxed">{faq.a}</div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl bg-gradient-to-br from-purple-600 via-purple-700 to-violet-800 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              The hospitality marketplace<br />is here.
            </h2>
            <p className="text-purple-200 text-lg mb-10 max-w-xl mx-auto">
              Whether you&apos;re a bartender looking for shifts, an owner needing staff, or a customer who wants the best
              experience — it all starts here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup/bartender" className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-purple-700 rounded-full font-bold text-lg hover:bg-purple-50 transition-all shadow-xl">
                Join as Staff <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/register" className="px-10 py-5 border-2 border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                I&apos;m an Owner
              </Link>
            </div>
          </div>
          <div className="absolute top-10 left-10 w-48 h-48 bg-purple-400/10 blur-[80px] rounded-full" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-violet-400/10 blur-[80px] rounded-full" />
        </div>
      </section>
    </div>
  );
}
