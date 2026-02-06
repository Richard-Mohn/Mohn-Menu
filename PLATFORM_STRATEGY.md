# OrderFlow - B2B Ordering Platform Strategy

## Executive Summary
Transform from a single-restaurant app into **OrderFlow**: A white-label SaaS ordering platform for independent restaurants and convenience stores. Compete on cost, simplicity, and developer-friendly architecture vs enterprise solutions like DoorDash, Uber Eats, GrubHub, and Slice.

---

## Competitive Analysis: Commission Rates

### Current Market Rates (2026)
| Platform | Commission | Payment Processing | Extras | Total Cost | Notes |
|----------|------------|-------------------|--------|-----------|-------|
| **DoorDash** | 30% | 3.5% + $0.30 | Marketing (optional) | 33.5%+ | Most expensive |
| **Uber Eats** | 25-30% | 3% + fees | Promotions | 28-33%+ | Variable by metro |
| **GrubHub** | 15-33% | 3% + fees | Marketing | 18-36% | High variance |
| **Slice** | 15% | 2.5% + $0.50 | Optional premium | 17.5%+ | Pizza-focused, lower |
| **Seamless** | 25-35% | 3.5% | Marketing | 28.5-38.5% | High end |
| **Toast** | 5% + $300/month | 2.8% + $0.30 | Support (premium) | Higher monthly | Enterprise tier |

### **OrderFlow Model**
- **One-time setup fee**: $299-$999 (customization, menu import, staff setup, training)
- **Monthly support tiers**:
  - **Free**: Self-service (access to docs, community)
  - **Basic**: $99/month (email support, bug fixes)
  - **Pro**: $299/month (phone support, monthly updates, advanced analytics)
  - **Enterprise**: $999/month (dedicated account manager, custom integrations, priority support)
- **Per-order commission**: $0 (Zero commission) + Payment processor fees (2.9% + $0.30)
- **Average restaurant saves**: $30-50 per 100 orders vs DoorDash

**Example: Pizza Place doing 400 orders/month**
- DoorDash: 133 orders × $15 avg = $1,995 → 30% = **$598.50/month**
- OrderFlow: Setup $500 one-time, then ~$47/month in payment fees only = **$47/month ongoing**
- **Monthly savings**: $551/month per location

---

## Target Markets (Phase 1: Virginia)

### Primary Segments
1. **Independent Restaurants** (50-200 employees)
   - Pizza shops
   - Ethnic cuisine (Chinese, Mexican, Thai, Italian)
   - Casual dining
   - QSR (Quick Service)

2. **Convenience Stores** (5-30 employees)
   - Grab-and-go sandwiches
   - Hot food sections
   - Snacks & beverages
   - Delivery integration

3. **Ghostkitchens** (Delivery-only, no storefront)

### Geographic Targeting
- **Phase 1**: Virginia (all cities and towns)
- **Phase 2**: East Coast (NC, SC, GA)
- **Phase 3**: National expansion

---

## Website Architecture

### Core Pages
```
/                          → Main homepage (for businesses)
/for-restaurants           → Restaurant landing page
/for-convenience-stores    → Convenience store landing page
/for-ghost-kitchens        → Delivery-only kitchen page
/pricing                   → Detailed pricing & support tiers
/features                  → Feature showcase (dispatch, staff mgmt, tracking)
/comparison                → Vs DoorDash, Uber Eats, GrubHub
/about                     → Company story, mission
/contact                   → Demo request form
/blog                      → SEO content (tips, case studies, news)
/locations/virginia        → State landing page
/locations/virginia/[city] → City-specific pages (Richmond, Alexandria, etc.)
/terms                     → Legal
/privacy                   → Legal
```

### Separate Portals (to build next phase)
```
/dashboard                 → Owner/admin portal
/customer                  → Customer ordering (for demo)
```

---

## Design System & Modern Aesthetic

### Visual Direction (2026 Style)
- **Animated floating elements**: Food items, store items, delivery vehicles
- **Modern color palette**: 
  - Primary: Indigo/Purple (trust, tech-forward)
  - Accent: Emerald (savings, growth)
  - Neutral: Zinc/Slate (clean, professional)
- **Typography**: Bold, large headers (hero-scale)
- **Micro-interactions**: Smooth scrolls, hover effects, animated counters
- **Photography**: High-quality food & convenience store imagery
- **Gradients**: Modern linear/radial gradients, not flat colors

### Key Components
- Animated hero section with floating food/items
- Sticky navigation with role detection
- Comparison table animations
- Pricing calculator
- Testimonial carousel
- Case study deep-dives

---

## Technical Implementation

### Architecture Shift: ISR + Dynamic Routes
```typescript
// Current: Static export
// New: ISR + Dynamic for location pages

export const revalidate = 3600; // Revalidate every hour

// app/locations/virginia/page.tsx → Aggregated data
// app/locations/virginia/[city]/page.tsx → Dynamic city pages
```

### SEO Architecture
1. **Schema Markup**:
   - `Organization` (company info)
   - `LocalBusiness` (for city pages)
   - `SoftwareApplication` (product info)
   - `BreadcrumbList` (navigation)
   - `FAQPage` (Q&A sections)

2. **Meta Tags**:
   - Dynamic titles: "OrderFlow for Pizza Restaurants in Richmond, VA"
   - Unique descriptions per page
   - OG tags for social sharing

3. **Sitemap Generation**: Dynamic XML sitemap with all city/town pages

4. **Robots.txt**: Proper crawling rules

5. **Internal Linking**: Strategic links between related content

### Performance Optimization
- ISR for static pages that need updates
- Image optimization (Next.js Image with WebP)
- Code splitting per route
- CSS-in-JS or Tailwind purging
- Font optimization (variable fonts)
- Lazy loading for below-fold content

---

## Content Strategy

### Homepage
- **Hero**: "Stop Paying 30% Fees. Meet OrderFlow"
- **Value Prop**: 3 core benefits with icons
- **Comparison Table**: vs competitors
- **How It Works**: 3-step process
- **Features**: 6-8 key differentiators
- **Pricing Preview**: Support tiers at a glance
- **Testimonials**: From early beta users
- **CTA**: "Get a Demo" / "Start Free Trial"

### Restaurant Landing Page
- **Hero**: Restaurant-specific pain points
- **Problem/Solution**: DoorDash fees eating margins
- **OrderFlow Solution**: How it fixes their business
- **Features for Restaurants**: 
  - Order management
  - Delivery tracking
  - Staff management
  - Custom branding
  - Payment handling
- **Pricing**: Restaurant-specific costs
- **Case Study**: Example pizza shop savings
- **FAQ**: Common restaurant questions
- **CTA**: "Book Demo" / "Get Started"

### Convenience Store Landing Page
- **Hero**: Different from restaurants
- **Problem/Solution**: Same fee issues, different use case
- **OrderFlow Solution**: Optimized for convenience
- **Features for Convenience Stores**:
  - Quick checkout
  - QR code ordering
  - Grab-and-go integration
  - Hot food tracking
  - Impulse buy optimization
- **Pricing**: Same model
- **Case Study**: Example convenience store
- **CTA**: "Book Demo"

### Comparison Page
- **DoorDash vs OrderFlow**: Side-by-side (30% vs $47/month)
- **Uber Eats vs OrderFlow**: Feature comparison
- **GrubHub vs OrderFlow**: Simplicity angle
- **Slice vs OrderFlow**: Customization angle
- **Visual**: Animated chart showing savings over time

### Pricing Page
- **Setup Fee**: Tiered by customization
  - Starter ($299): Basic setup
  - Professional ($699): Custom branding, advanced training
  - Enterprise ($1,499): Full customization, integration support
- **Monthly Support Tiers**: Free, Basic, Pro, Enterprise
- **Toggle**: Show monthly vs annual savings vs DoorDash
- **FAQ**: Comprehensive pricing Q&A

### City Landing Pages
- Example: `/locations/virginia/richmond`
- **Hero**: "OrderFlow for Restaurants in Richmond"
- **Local Testimonials**: From Richmond businesses
- **Local Market Data**: How many restaurants in Richmond, etc.
- **List of Features**: Tailored for local audience
- **Local Success Stories**: Case studies from the area
- **FAQ**: City-specific questions
- **CTA**: "Get Demo" with pre-filled city

---

## SEO Strategy

### Keyword Targeting
**Primary**:
- "Food delivery platform for restaurants"
- "Alternative to DoorDash for restaurants"
- "Affordable restaurant ordering system"
- "Restaurant POS with delivery"

**Secondary** (Location-based):
- "Food delivery in Richmond, VA"
- "Restaurant ordering system in Alexandria, VA"
- "Convenience store software in Virginia"

**Long-tail** (Content-driven):
- "How much does DoorDash cost restaurants"
- "Best POS system for pizza shops"
- "Free QR code ordering for restaurants"
- "Restaurant staff management software"

### Content Pillars
1. **Cost Comparisons**: Blog posts, guides, calculators
2. **How-To Guides**: Setting up OrderFlow, training staff, etc.
3. **Case Studies**: Real restaurants saving money
4. **Industry News**: Trends, competitor updates
5. **Location Guides**: Richmond, Alexandria, other VA cities

### Metrics to Track
- Organic traffic by landing page
- Click-through rate (CTR) in search results
- Average time on page
- Bounce rate
- Conversion rate (demo requests)
- Rankings for target keywords

---

## Development Roadmap

### Phase 1: Website (Weeks 1-4)
- [x] Homepage redesign with modern aesthetic
- [ ] Professional header with role-based nav
- [ ] Restaurant landing page
- [ ] Convenience store landing page
- [ ] Pricing page
- [ ] Comparison page
- [ ] Set up ISR architecture
- [ ] Implement dynamic city pages
- [ ] SEO framework (schema, sitemap, robots.txt)

### Phase 2: Content (Weeks 5-8)
- [ ] Blog launch
- [ ] Case studies
- [ ] Video content
- [ ] Location pages for all VA cities
- [ ] FAQ pages

### Phase 3: Lead Generation (Weeks 9-12)
- [ ] Demo request form
- [ ] Email automation
- [ ] Lead tracking
- [ ] Analytics dashboard

### Phase 4: Platform Enhancements (Weeks 13+)
- [ ] Owner dispatch dashboard
- [ ] Staff management
- [ ] QR code scanning
- [ ] Advanced analytics

---

## Branding Guidelines

### Logo & Wordmark
- "OrderFlow" - modern, friendly, tech-forward
- Consider: O with circular flow motion
- Color: Indigo or gradient

### Voice & Tone
- Professional but approachable
- Data-driven (use numbers, comparisons)
- Empathetic to restaurant struggles
- Action-oriented CTAs

### Visual Language
- Modern, bold typography
- Generous whitespace
- Animated micro-interactions
- High-quality imagery
- Gradient accents

---

## Success Metrics

### Year 1 Goals
- 50 restaurants using OrderFlow in Virginia
- 20 convenience stores using OrderFlow
- 10,000+ monthly organic visitors
- $25K MRR (recurring revenue) from support tiers
- Average 6-month payback period for customers

### KPIs to Track
- Demo request conversion rate (target: 15%)
- Demo-to-signup conversion rate (target: 30%)
- Monthly churn rate (target: <5%)
- Customer acquisition cost (target: <$100)
- Lifetime customer value (target: >$5,000)

---

## Next Steps
1. Design modern homepage with animations
2. Build professional header navigation
3. Create restaurant/convenience store landing pages
4. Set up ISR + dynamic routing
5. Implement SEO framework
6. Create location pages for all VA cities
7. Launch comparison content
8. Build demo request system

