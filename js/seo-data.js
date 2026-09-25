/**
 * seo-data.js - Centralized Data Store for CREWiiFY Dedicated SEO Landing Page
 * 
 * Strict isolation: All data models for the 12 SEO sections are configured here.
 * Prepares content schemas for:
 * 01. SEO Hero
 * 02. Trusted Brands + Stats
 * 03. SEO Results / Case Studies
 * 04. Selected Work / SEO-Optimized Websites
 * 05. Free SEO Audit CTA
 * 06. SEO Pricing
 * 07. Agency Economics / Margins
 * 08. How It Works (Process)
 * 09. Onboarding Timeline
 * 10. Free SEO Audit Showcase
 * 11. FAQ (Agency-Focused)
 * 12. Final CTA & Calendly Configuration
 */

// ============================================================================
// 12. CALENDLY CONFIGURATION
// ============================================================================
export const calendlyConfig = {
  url: 'https://calendly.com/sociiofy/30min',
  title: 'Book a White-Label SEO Discovery Call',
  embedContainerId: 'seoCalendlyInlineWidget',
  prefill: {},
  utmParams: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
};

// ============================================================================
// 01. SEO HERO CONFIGURATION
// ============================================================================
export const seoHeroData = {
  eyebrow: 'WHITE-LABEL SEO FOR AGENCIES',
  title: 'Scale Your SEO Delivery',
  titleGradient: 'Without Building a Bigger Team.',
  description: 'White-label SEO fulfillment that helps agencies deliver stronger search visibility, local SEO and AI search optimization — without building the delivery team in-house.',
  primaryCta: {
    label: 'GET YOUR FREE SEO AUDIT',
    href: '#seo-audit-cta',
    arrow: '→'
  },
  secondaryCta: {
    label: 'SEE OUR SEO RESULTS',
    href: '#seo-results',
    arrow: '↓'
  }
};

// ============================================================================
// 02. TRUSTED BRANDS + PROOF STATS
// ============================================================================
export const seoTrustData = {
  eyebrow: 'TRUSTED BY AGENCIES WORLDWIDE TO DELIVER BEHIND THE SCENES',
  proof: {
    projectsDelivered: '400+',
    whiteLabelRate: '100%',
    averageRating: '4.9/5'
  }
};

// ============================================================================
// 03. SEO RESULTS / SEE OUR WORK (6 VERIFIED OUTCOMES)
// ============================================================================
export const seoResultsData = {
  eyebrow: 'SEO RESULTS',
  title: 'See What SEO Can Deliver.',
  description: "Real search and local SEO results from campaigns we've delivered behind the scenes.",
  cards: [
    {
      id: 'seo-card-palladium',
      project: 'Palladium Janseva Hospital',
      category: 'LOCAL SEO / GOOGLE BUSINESS PROFILE',
      primaryResult: '700 Calls',
      primaryLabel: 'CALLS FROM BUSINESS PROFILE',
      description: 'Google Business Profile calls generated from June–September 2026.',
      image: 'assets/images/seo-results/seo-result-palladium-700-calls.png'
    },
    {
      id: 'seo-card-hospital',
      project: 'A Leading Multispeciality Hospital',
      category: 'SEO / ORGANIC VISIBILITY',
      primaryResult: '53K Active Users',
      primaryLabel: 'LAST 30 DAYS PERFORMANCE',
      description: 'Consistent organic search visibility driving continuous patient acquisition.',
      image: 'assets/images/seo-results/seo-result-hospital-53k-users.png',
      secondaryMetrics: [
        { value: '331K', label: 'Events' },
        { value: '108K', label: 'Key Events' },
        { value: '52K', label: 'New Users' }
      ]
    },
    {
      id: 'seo-card-cruise',
      project: 'A Leading Cruise Line',
      category: 'SEO / ORGANIC VISIBILITY',
      primaryResult: '87K Active Users',
      primaryLabel: 'ACTIVE USERS',
      description: 'Organic discovery and passenger engagement across international travel queries.',
      image: 'assets/images/seo-results/seo-result-cruise-87k-users.png',
      secondaryMetrics: [
        { value: '84K', label: 'New Users' }
      ]
    },
    {
      id: 'seo-card-interactions',
      project: 'Local Search Growth',
      category: 'LOCAL SEO',
      primaryResult: '5,896',
      primaryLabel: 'BUSINESS PROFILE INTERACTIONS',
      description: 'Scaled local map pack visibility and customer engagement across high-intent searches.',
      image: 'assets/images/seo-results/seo-result-local-interactions-5896.png'
    },
    {
      id: 'seo-card-local-calls',
      project: 'Local Search Calls',
      category: 'LOCAL SEO',
      primaryResult: '224 Calls',
      primaryLabel: 'CALLS FROM BUSINESS PROFILE',
      description: 'Calls made from the Business Profile.',
      image: 'assets/images/seo-results/seo-result-local-calls-224.png'
    },
    {
      id: 'seo-card-directions',
      project: 'Local Search Discovery',
      category: 'LOCAL SEO',
      primaryResult: '1,443 Requests',
      primaryLabel: 'DIRECTION REQUESTS',
      description: 'Direction requests made from the Business Profile.',
      image: 'assets/images/seo-results/seo-result-local-directions-1443.png'
    }
  ]
};

// ============================================================================
// 04. SELECTED WORK / SEO-OPTIMIZED WEBSITES
// ============================================================================
export const seoWorkData = {
  eyebrow: 'SELECTED WORK',
  title: 'Built to Look Good.',
  titleGradient: 'Built to Be Found.',
  description: 'Websites designed for real users and built with the technical foundations search engines need.',
  websites: [
    {
      id: 'work-palladium-janseva',
      name: 'Palladium Janseva',
      domain: 'palladiumjanseva.com',
      url: 'https://palladiumjanseva.com/',
      category: 'WEBSITE DEVELOPMENT',
      description: 'Responsive website development with SEO-ready foundations.'
    },
    {
      id: 'work-falcon-tourism',
      name: 'Falcon Tourism',
      domain: 'falcontourism.ae',
      url: 'https://falcontourism.ae/en/',
      category: 'WEBSITE DEVELOPMENT',
      description: 'Digital experience and website development designed for users and search.'
    },
    {
      id: 'work-a-real-estate-media',
      name: 'A Real Estate Media',
      domain: 'arealestatemedia.com',
      url: 'https://arealestatemedia.com/',
      category: 'WEBSITE DEVELOPMENT',
      description: 'High-performance media agency website built with modern web architecture.'
    },
    {
      id: 'work-wearwulf',
      name: 'WearWulf',
      domain: 'wearwulf.in',
      url: 'https://wearwulf.in/',
      category: 'E-COMMERCE / WEBSITE DEVELOPMENT',
      description: 'E-commerce website design and development with fast load times and clean code.'
    },
    {
      id: 'work-acktiv-ortho',
      name: 'Acktiv Ortho',
      domain: 'acktivortho.com',
      url: 'https://acktivortho.com/',
      category: 'WEBSITE DEVELOPMENT',
      description: 'Responsive medical clinic website built for local visibility and user clarity.'
    },
    {
      id: 'work-crewiify',
      name: 'CREWiiFY',
      domain: 'crewiify.com',
      url: 'https://www.crewiify.com/',
      category: 'WEBSITE DEVELOPMENT',
      description: 'Agency infrastructure and platform development built with search visibility in mind.'
    }
  ]
};

// ============================================================================
// 05. FREE SEO AUDIT CTA
// ============================================================================
export const seoAuditCtaData = {
  eyebrow: 'LEADERSHIP & PERFORMANCE',
  title: "Find out what's holding",
  titleGradient: 'your SEO back.',
  description: 'Get a practical look at the technical, on-page and visibility opportunities that could be limiting your search performance.',
  features: [
    {
      title: 'Technical Foundation Health',
      description: 'Indexability, crawl budget, Core Web Vitals, and architecture issues hurting search bots.'
    },
    {
      title: 'On-Page & Content Intent',
      description: 'Keyword mapping, topic clusters, meta signals, and user intent alignment across revenue pages.'
    },
    {
      title: 'Competitive Visibility Gaps',
      description: 'Actionable identification of search terms where competitors are winning valuable commercial traffic.'
    }
  ],
  ctaText: 'Get My Free SEO Audit',
  ctaHref: '#seo-final-cta',
  reassuranceNote: 'Performed manually by senior search strategists. No automated fluff.'
};

// ============================================================================
// 06. SEO PRICING TIERS (SEO PACKAGES)
// ============================================================================
export const seoPricingData = {
  eyebrow: 'PRICING PLAN',
  title: 'Transparent pricing for proven',
  titleGradient: 'SEO solutions',
  description: 'Scalable search strategies designed to dominate high-intent keywords and build sustainable authority.',
  packages: [
    {
      id: 'seo-starter',
      tier: '01 / Basic',
      name: 'SEO Starter',
      tagline: 'On-page optimization, 4 content pieces, and 8 backlinks per month.',
      price: '$1,200',
      period: '/ month',
      isPopular: false,
      badge: 'Essential',
      billingNote: 'Transparent scope • Dedicated delivery',
      ctaText: 'Get Started →',
      ctaHref: '#seo-final-cta',
      features: [
        'On-Page Optimization',
        '4 Content Pieces / mo',
        '8 Quality Backlinks / mo',
        'Technical SEO Audit & Setup',
        'Google Search Console & GA4 Setup',
        'Local SEO Domination',
        'Monthly Performance & Ranking Report'
      ]
    },
    {
      id: 'seo-growth',
      tier: '02 / Growth',
      name: 'SEO Growth',
      tagline: 'On-page optimization, 8 content pieces, 15 backlinks, and technical SEO per month.',
      price: '$2,000',
      period: '/ month',
      isPopular: true,
      badge: 'Most Popular',
      billingNote: 'Transparent scope • Dedicated delivery',
      ctaText: 'Get Started →',
      ctaHref: '#seo-final-cta',
      features: [
        'On-Page Optimization',
        '8 Content Pieces / mo',
        '15 Quality Backlinks / mo',
        'Advanced Technical SEO & Schema',
        'Competitor Keyword Gap Analysis',
        'Local SEO Domination',
        'AI SEO (AEO & GEO)',
        'Monthly Performance & Ranking Report',
        'Dedicated SEO Account Manager'
      ]
    },
    {
      id: 'seo-scale',
      tier: '03 / Scale',
      name: 'SEO Scale',
      tagline: 'Full technical SEO, 12 content pieces, and 25 backlinks per month.',
      price: '$3,000',
      period: '/ month',
      isPopular: false,
      badge: 'Enterprise',
      billingNote: 'Transparent scope • Dedicated delivery',
      ctaText: 'Get Started →',
      ctaHref: '#seo-final-cta',
      features: [
        'Full Technical SEO & Architecture',
        '12 Content Pieces / mo',
        '25 High-Authority Backlinks / mo',
        'On-Page Optimization & Content Hubs',
        'Tier-1 Digital PR & Authority Links',
        'Local SEO Domination',
        'AI SEO (AEO & GEO)',
        'Real-Time Analytics & Custom Dashboard',
        '24/7 Priority Support & Weekly Sprints'
      ]
    }
  ]
};

// ============================================================================
// 07. AGENCY ECONOMICS / MARGINS
// ============================================================================
export const seoEconomicsData = {
  eyebrow: 'AGENCY ECONOMICS / MARGINS',
  title: 'SEO Delivery That Leaves Room',
  titleGradient: 'for Your Margin.',
  description: 'Sell SEO at your own client-facing rates while CREWiiFY handles technical fulfillment. Scale recurring agency revenue with predictable wholesale costs.',
  microcopy: 'Sell under your brand. Outsource the delivery. Keep the difference.',
  packages: [
    {
      id: 'seo-starter',
      tier: '01 / Starter',
      name: 'SEO Starter',
      clientBill: '$1,200',
      crewiifyRate: '$395',
      youKeep: '$800'
    },
    {
      id: 'seo-growth',
      tier: '02 / Growth',
      name: 'SEO Growth',
      clientBill: '$2,000',
      crewiifyRate: '$695',
      youKeep: '$1,300'
    },
    {
      id: 'seo-scale',
      tier: '03 / Scale',
      name: 'SEO Scale',
      clientBill: '$3,000',
      crewiifyRate: '$999',
      youKeep: '$2,000'
    }
  ]
};

// ============================================================================
// 08. HOW IT WORKS (THE 4-STEP PROCESS)
// ============================================================================
export const seoProcessData = {
  eyebrow: 'HOW IT WORKS',
  title: 'From first audit to',
  titleGradient: 'monthly rhythm.',
  description: 'A simple four-step white-label delivery engine built for operational clarity and recurring retention.',
  steps: [
    {
      number: '01',
      title: 'Free SEO audit',
      desc: 'Send us any site. We return a prioritised fix list in ~48 hours — no obligation.'
    },
    {
      number: '02',
      title: 'Onboarding & setup',
      desc: 'A one-time technical foundation: audit fixes, tracking and baseline research.'
    },
    {
      number: '03',
      title: 'Monthly deliverables',
      desc: 'Countable units every 30-day cycle — content, links, on-page and keyword work.'
    },
    {
      number: '04',
      title: 'White-label reporting',
      desc: 'Branded reports on your cadence — weekly, bi-weekly or monthly by tier.'
    }
  ]
};

// ============================================================================
// 09. ONBOARDING (INCLUDED TECHNICAL FOUNDATION)
// ============================================================================
export const seoOnboardingData = {
  eyebrow: 'INCLUDED WITH EVERY PLAN',
  title: 'Onboarding is',
  titleGradient: 'on us.',
  description: "Every plan starts with a one-time technical foundation — no extra charge. It's the groundwork that makes the monthly deliverables actually compound.",
  items: [
    { number: '01', title: 'Full technical audit & fix list' },
    { number: '02', title: 'Schema markup implementation' },
    { number: '03', title: 'Canonical tags setup' },
    { number: '04', title: 'Robots.txt optimization' },
    { number: '05', title: 'XML sitemap & submission' },
    { number: '06', title: 'Google Search Console setup' },
    { number: '07', title: 'Google Analytics setup' },
    { number: '08', title: 'Baseline keyword & competitor research' }
  ]
};

// ============================================================================
// 10. FREE SEO AUDIT SHOWCASE (EXACT STRATEGIC BLUEPRINT DELIVERABLE)
// ============================================================================
export const seoAuditShowcaseData = {
  eyebrow: 'SEE WHAT YOU GET',
  title: 'Your free audit goes',
  titleGradient: 'beyond a traffic report.',
  description: 'We look at the technical foundation, search opportunities, local visibility, conversion gaps and the roadmap to turn them into growth.',
  deckLabel: 'A LOOK INSIDE A CREWiiFY SEO AUDIT',
  disclaimer: 'Example deliverable. Audit findings and recommendations are tailored to each website.',
  ctaText: 'GET MY FREE SEO AUDIT',
  ctaHref: '#seo-final-cta',
  slides: [
    {
      id: 'audit-slide-cover',
      tag: 'STRATEGIC DELIVERABLE',
      title: "Leon's Express Cleaning LLC — Strategic Growth Blueprint",
      frameTitle: "LEON'S EXPRESS CLEANING LLC • STRATEGIC GROWTH BLUEPRINT",
      desc: 'A data-driven strategy to dominate organic search, capture commercial construction cleaning contracts & elevate local market authority.',
      imagePng: 'assets/images/seo-audit-showcase/audit-cover.png',
      imageWebp: 'assets/images/seo-audit-showcase/audit-cover.webp',
      alt: "Leon's Express Cleaning LLC Strategic Growth Blueprint Cover"
    },
    {
      id: 'audit-slide-status',
      tag: '01 / CURRENT STATUS AUDIT',
      title: 'Brand Strengths & Critical Gaps Analysis',
      frameTitle: "LEON'S EXPRESS CLEANING LLC • CURRENT STATUS AUDIT",
      desc: 'Identifies established builder relationships, commercial revenue leaks, and indexation bottlenecks.',
      imagePng: 'assets/images/seo-audit-showcase/audit-current-status.png',
      imageWebp: 'assets/images/seo-audit-showcase/audit-current-status.webp',
      alt: 'Current Status Audit and Critical Gaps'
    },
    {
      id: 'audit-slide-keywords',
      tag: '02 / KEYWORD STRATEGY',
      title: 'High-Intent Commercial Keyword Silos',
      frameTitle: "LEON'S EXPRESS CLEANING LLC • SEARCH STRATEGY",
      desc: 'Commercial search volume mapped to high purchase intent queries and targeted destination URLs.',
      imagePng: 'assets/images/seo-audit-showcase/audit-keyword-strategy.png',
      imageWebp: 'assets/images/seo-audit-showcase/audit-keyword-strategy.webp',
      alt: 'Search Strategy and Target Keywords'
    },
    {
      id: 'audit-slide-technical',
      tag: '03 / TECHNICAL SEO',
      title: 'Core Web Vitals & Speed Index Audit',
      frameTitle: "LEON'S EXPRESS CLEANING LLC • PERFORMANCE AUDIT",
      desc: 'Page speed diagnostics (>3.8s to <1.6s), 95+ mobile health target, and JSON-LD structured schema.',
      imagePng: 'assets/images/seo-audit-showcase/audit-technical-seo.png',
      imageWebp: 'assets/images/seo-audit-showcase/audit-technical-seo.webp',
      alt: 'Performance Audit and Technical SEO Architecture'
    },
    {
      id: 'audit-slide-local',
      tag: '04 / LOCAL SEO ENGINE',
      title: 'Google Maps Pack & NAP Consistency',
      frameTitle: "LEON'S EXPRESS CLEANING LLC • LOCAL SEO ENGINE",
      desc: '100% NAP cross-directory verification, automated 5-star review engine, and geo-grid rank targeting.',
      imagePng: 'assets/images/seo-audit-showcase/audit-local-seo.png',
      imageWebp: 'assets/images/seo-audit-showcase/audit-local-seo.webp',
      alt: 'Local SEO Engine and Google Maps Pack'
    },
    {
      id: 'audit-slide-roadmap',
      tag: '05 / IMPLEMENTATION ROADMAP',
      title: '12-Week Phased SEO Action Roadmap',
      frameTitle: "LEON'S EXPRESS CLEANING LLC • IMPLEMENTATION PLAN",
      desc: 'Clear 3-phase execution from technical foundation (Weeks 1-4) through city silos to recurring authority scaling.',
      imagePng: 'assets/images/seo-audit-showcase/audit-implementation-roadmap.png',
      imageWebp: 'assets/images/seo-audit-showcase/audit-implementation-roadmap.webp',
      alt: 'Phased Implementation Plan and SEO Roadmap'
    }
  ]
};

// ============================================================================
// 11. FREQUENTLY ASKED QUESTIONS (AGENCY SPECIFIC)
// ============================================================================
export const seoFaqData = {
  eyebrow: 'COMMON QUESTIONS',
  title: 'Everything You Need To Know About',
  titleGradient: 'Our White-Label SEO',
  faqs: [
    {
      q: 'Will my client ever know CREWiiFY is doing the work?',
      a: 'Never. We are 100% invisible. All reports, deliverables, audits, and communication artifacts carry your agency’s branding, fonts, and colors. We never interact with your clients directly unless you explicitly invite our team to a strategy call under your agency email address.'
    },
    {
      q: 'Are there any contracts or long-term commitments?',
      a: 'No. All our white-label SEO plans run month-to-month. You can scale up, pause, or cancel any client retainer with 14 days’ notice before the next billing cycle.'
    },
    {
      q: 'How do you acquire backlinks?',
      a: 'We strictly follow white-hat, editorial outreach standards. We secure real contextual mentions on high-authority niche blogs, industry publications, and established digital press. We never use PBNs, automated spam links, or black-hat tactics that risk Google penalties.'
    },
    {
      q: 'What kind of reporting do you provide?',
      a: 'Every month you receive an unbranded, presentation-ready PDF slide deck detailing keyword movement, organic traffic growth, completed technical fixes, published content, and acquired backlinks. You can drop in your agency logo and email it directly to your client.'
    },
    {
      q: 'How fast can we onboard our first client?',
      a: 'Within 24 to 48 hours. Once you submit the onboarding questionnaire and grant necessary analytics or CMS credentials, our sprint starts immediately.'
    },
    {
      q: 'Can we try a free audit before signing up?',
      a: 'Yes! Send us any prospect or client URL, and we will generate a complimentary 100% white-label SEO audit for you to evaluate our diagnostic depth and presentation quality.'
    }
  ]
};

// ============================================================================
// 12. FINAL CONVERSION SECTION
// ============================================================================
export const seoFinalCtaData = {
  eyebrow: 'START SCALING YOUR AGENCY',
  title: 'Ready To Add High-Margin SEO',
  titleGradient: 'To Your Agency Roster?',
  description: 'Schedule a confidential 20-minute white-label partnership briefing. We’ll review your agency goals, show you sample reports, and explain how to add $10k–$30k/mo in recurring search revenue.',
  calendlyUrl: calendlyConfig.url,
  reassurance: 'No pressure. No commitment. Just a practical conversation about your fulfillment needs.'
};
