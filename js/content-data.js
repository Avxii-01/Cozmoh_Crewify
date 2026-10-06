/**
 * content-data.js - Centralized Data Store for CREWiiFY Dedicated Content Landing Page
 * 
 * Strict isolation: All data models for the 14 Content sections are configured here.
 * Prepares content schemas for:
 * 01. Content Hero
 * 02. Trusted Agencies + Stats
 * 03. Content Results (Social, Carousel, Video, Creative)
 * 04. Agency Testimonials
 * 05. Selected Work / Creative Showcase
 * 06. Free Sample Edit CTA
 * 07. Want To Go Beyond? / Content Packages (Starter, Growth, Scale)
 * 08. Agency Economics / Margins
 * 09. How It Works (4-Step Workflow: Shoot -> Send -> SOP -> Final 24-48h)
 * 10. Included With Every Plan (Onboarding & Setup)
 * 11. Content Transformation Showcase (Raw -> Edit -> Final)
 * 12. FAQ (Content & Video Delivery)
 * 13. Final CTA & Calendly Configuration
 */

// ============================================================================
// 13. CALENDLY CONFIGURATION
// ============================================================================
export const calendlyConfig = {
  url: 'https://calendly.com/sociiofy/30min',
  title: 'Book a White-Label Content Discovery Call',
  embedContainerId: 'contentCalendlyInlineWidget',
  prefill: {},
  utmParams: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
};

// ============================================================================
// 01. CONTENT HERO CONFIGURATION
// ============================================================================
export const contentHeroData = {
  eyebrow: 'WHITE-LABEL CONTENT FOR AGENCIES',
  title: 'Scale content delivery',
  titleGradient: 'without building a bigger team.',
  description: 'CREWiiFY delivers 100% white-label social posts, carousel graphics, reel editing, and creative production behind the scenes—giving your agency unlimited fulfillment capacity without hiring in-house staff.',
  primaryCta: {
    label: 'GET A FREE SAMPLE EDIT',
    href: '#content-sample',
    arrow: '→'
  },
  secondaryCta: {
    label: 'BOOK A CALL',
    href: '#contentCalendlyModal',
    arrow: '→'
  }
};

// ============================================================================
// 02. TRUSTED AGENCIES + PROOF STATS
// ============================================================================
export const contentTrustData = {
  eyebrow: 'TRUSTED BY AGENCIES WORLDWIDE TO DELIVER BEHIND THE SCENES',
  proof: {
    projectsDelivered: '400+',
    whiteLabelRate: '100%',
    averageRating: '4.9/5'
  },
  logos: [
    { name: 'Acktive Vision', src: 'assets/logos/seo/acktive-vision.webp', width: 183, height: 48 },
    { name: 'Celebrity Cruises', src: 'assets/logos/seo/celebrity-cruises.webp', width: 48, height: 48, invert: true },
    { name: 'Your V Care', src: 'assets/logos/seo/your-v-care.webp', width: 141, height: 48 },
    { name: 'SRM Jeevan Healthcare', src: 'assets/logos/seo/srmjeevan.webp', width: 49, height: 48 },
    { name: 'KIMS Hospital', src: 'assets/logos/seo/kimshospitals.webp', width: 108, height: 48 },
    { name: 'Paladium', src: 'assets/logos/seo/paladium.webp', width: 253, height: 48 },
    { name: 'Maheshwari', src: 'assets/logos/seo/maishwari.webp', width: 60, height: 48 },
    { name: 'Dr. Ramkishan Nag', src: 'assets/logos/seo/drramkishan.webp', width: 179, height: 48 },
    { name: 'Royal Caribbean', src: 'assets/logos/seo/royal-caribbean.webp', width: 176, height: 48, invert: true },
    { name: 'Travezy', src: 'assets/logos/seo/travezy.webp', width: 207, height: 48 },
    { name: 'Wockhardt', src: 'assets/logos/wockhardtlogo.webp', width: 270, height: 48 }
  ]
};

// ============================================================================
// 03. CONTENT RESULTS (VISUAL CONTENT-FIRST SHOWCASE)
// ============================================================================
export const contentResultsData = {
  eyebrow: 'CONTENT RESULTS',
  title: 'See what our content',
  titleGradient: 'fulfillment can deliver.',
  description: 'Scalable, on-brand creative and video production executed behind the scenes for agency clients.',
  cards: [
    {
      id: 'content-result-01',
      category: 'SHORT-FORM REELS & TIKTOK',
      formatBadge: '9:16 VERTICAL VIDEO',
      aspectRatio: '9/16',
      clientType: 'DTC E-Commerce Agency Client',
      title: 'High-Retention Video Hooks & Kinetic Pacing',
      description: 'Raw iPhone footage transformed into 18 engaging Reels with dynamic subtitles, custom motion graphics, and audio sync.',
      highlights: [
        { label: 'TURNAROUND', value: '24-48h' },
        { label: 'DELIVERY FORMAT', value: '4K 60fps 9:16' },
        { label: 'BRAND SOP', value: '100% Matched' }
      ],
      previewType: 'video-reel'
    },
    {
      id: 'content-result-02',
      category: 'CAROUSEL & SOCIAL GRAPHICS',
      formatBadge: '4:5 MULTI-SLIDE CAROUSEL',
      aspectRatio: '4/5',
      clientType: 'B2B SaaS Founder Client',
      title: 'Executive Thought-Leadership Carousel System',
      description: 'Long-form podcast transcripts turned into 8-slide educational swipe files with custom illustrations and typography hierarchy.',
      highlights: [
        { label: 'CAROUSEL SLIDES', value: '8 Slides / Post' },
        { label: 'BRAND SYSTEM', value: 'Design System Aligned' },
        { label: 'WHITE-LABEL ASSETS', value: 'Figma + PNG' }
      ],
      previewType: 'carousel'
    },
    {
      id: 'content-result-03',
      category: 'PAID SOCIAL AD CREATIVE',
      formatBadge: '1:1 & 9:16 AD VARIATIONS',
      aspectRatio: '1/1',
      clientType: 'Performance Marketing Agency',
      title: 'Conversion-Engine Multi-Angle Ad Creative',
      description: 'Batch-edited UGC creative variations, product callouts, and motion overlays tested across Meta and TikTok ad feeds.',
      highlights: [
        { label: 'CREATIVE VARIATIONS', value: '12 Hooks Tested' },
        { label: 'ASPECT RATIOS', value: '9:16 + 1:1 + 16:9' },
        { label: 'DELIVERY SPRINT', value: '48h Batch Ship' }
      ],
      previewType: 'ad-creative'
    },
    {
      id: 'content-result-04',
      category: 'BRANDED SOCIAL TEMPLATES',
      formatBadge: '4:5 FEED AESTHETICS',
      aspectRatio: '4/5',
      clientType: 'Luxury Real Estate Agency',
      title: 'Architectural Property Showcase & Stories',
      description: 'High-end architectural walkthrough clips refined with cinematic color grades, elegant typography, and brand-consistent lower thirds.',
      highlights: [
        { label: 'COLOR GRADE', value: 'Custom LUT' },
        { label: 'AUDIO LICENSING', value: 'Commercial Safe' },
        { label: 'CLIENT RETENTION', value: 'Ongoing Retainer' }
      ],
      previewType: 'branding'
    },
    {
      id: 'content-result-05',
      category: 'PODCAST SNIPPETS & REELS',
      formatBadge: '9:16 TALKING HEAD',
      aspectRatio: '9/16',
      clientType: 'Executive Personal Brand Client',
      title: 'B-Roll Infused Talking Head Viral Edits',
      description: 'Multi-cam studio recordings cut down to high-impact 45-second soundbites with context B-roll, kinetic zooms, and sound effects.',
      highlights: [
        { label: 'VIRAL HOOKS', value: '3 Angles / Episode' },
        { label: 'CAPTION STYLE', value: 'Karaoke Animated' },
        { label: 'AGENCY MARGIN', value: '65% Retained' }
      ],
      previewType: 'video-reel'
    },
    {
      id: 'content-result-06',
      category: 'EVENT & CAMPAIGN CREATIVE',
      formatBadge: 'MULTI-CHANNEL ASSETS',
      aspectRatio: '16/9',
      clientType: 'Lifestyle & Hospitality Group',
      title: 'Omnichannel Campaign Launch Suite',
      description: 'Synchronized visual campaign rollout spanning Instagram carousels, YouTube Shorts, animated story teasers, and banner graphics.',
      highlights: [
        { label: 'TOTAL ASSETS', value: '36 Deliverables' },
        { label: 'FULFILLMENT TIME', value: '5-Day Sprint' },
        { label: 'IN-HOUSE TEAM NEEDED', value: 'Zero' }
      ],
      previewType: 'campaign'
    }
  ]
};

// ============================================================================
// 04. AGENCY TESTIMONIALS (EDITORIAL LAYOUT)
// ============================================================================
export const contentTestimonialsData = {
  eyebrow: 'WHAT AGENCIES SAY',
  title: 'Built to stay behind the scenes.',
  titleGradient: 'Trusted by the teams we support.',
  description: 'How agency founders and creative directors scale retainer revenue with invisible content fulfillment.',
  items: [
    {
      id: 'testimonial-01',
      quote: "CREWiiFY became our secret weapon. We pitched and signed 7 new video content retainers last month knowing we had zero editing bottlenecks. Our clients think our in-house creative department tripled overnight.",
      person: 'Marcus Vance',
      role: 'Founder & Managing Director',
      agency: 'Vance Media Group',
      badge: 'AGENCY FOUNDER',
      retentionMetric: 'Scaled from 3 to 14 Content Retainers'
    },
    {
      id: 'testimonial-02',
      quote: "The 24–48 hour turnaround on short-form reels is genuine. We drop raw phone clips in Google Drive on Monday and have high-retention client edits ready by Wednesday morning. Their SOP adherence is flawless.",
      person: 'Elena Rostova',
      role: 'Head of Creative Services',
      agency: 'Kinetic Social Studio',
      badge: 'CREATIVE DIRECTOR',
      retentionMetric: '48-Hour Turnaround SLA Maintained'
    },
    {
      id: 'testimonial-03',
      quote: "White-label fulfillment has completely revolutionized our gross margins. We bill $3,500/month per client for organic content, CREWiiFY executes every asset invisibly, and we retain over 60% margin with zero payroll overhead.",
      person: 'David Chen',
      role: 'Partner & VP of Growth',
      agency: 'Nexus Growth Partners',
      badge: 'AGENCY PARTNER',
      retentionMetric: '60%+ Net Margin on Creative Fulfillment'
    }
  ]
};

// ============================================================================
// 05. SELECTED WORK / CREATIVE SHOWCASE
// ============================================================================
export const contentWorkData = {
  eyebrow: 'SELECTED WORK',
  title: 'Social, content',
  titleGradient: 'and video.',
  description: 'Explore sample creative deliverables produced to strict white-label agency specifications.',
  categories: ['All Creative', 'Short-Form Video', 'Carousels', 'Paid Ad Creative', 'Branded Graphics'],
  items: [
    {
      id: 'work-item-01',
      category: 'Short-Form Video',
      format: '9:16 Reel / Short',
      title: 'High-Paced SaaS Product Walkthrough',
      clientType: 'Tech Startup Client',
      deliverable: '45-second kinetic reel with auto-captions & UI zooms',
      tag: 'VIRAL REEL'
    },
    {
      id: 'work-item-02',
      category: 'Carousels',
      format: '4:5 Swipe Deck',
      title: 'The 7-Figure E-Commerce Scaling Framework',
      clientType: 'Growth Marketing Agency',
      deliverable: '10-slide visual carousel with custom isometric illustrations',
      tag: 'CAROUSEL'
    },
    {
      id: 'work-item-03',
      category: 'Short-Form Video',
      format: '9:16 Podcast Clip',
      title: 'Founder Story: Lessons From Bootstrapping',
      clientType: 'Executive Personal Brand',
      deliverable: 'Multi-cam dynamic cut with b-roll overlays and sound fx',
      tag: 'PODCAST SHORT'
    },
    {
      id: 'work-item-04',
      category: 'Paid Ad Creative',
      format: '1:1 Ad Variation',
      title: 'Consumer Tech Feature Comparison Grid',
      clientType: 'Performance Ad Agency',
      deliverable: 'High-converting social static with split before/after elements',
      tag: 'AD CREATIVE'
    },
    {
      id: 'work-item-05',
      category: 'Branded Graphics',
      format: '4:5 Instagram Feed',
      title: 'Boutique Hospitality Event Announcement',
      clientType: 'Lifestyle PR Agency',
      deliverable: 'Minimalist editorial typography layout with texture overlays',
      tag: 'SOCIAL GRAPHIC'
    },
    {
      id: 'work-item-06',
      category: 'Short-Form Video',
      format: '9:16 TikTok / Reel',
      title: 'Fitness Coaching Micro-Tutorial Routine',
      clientType: 'Wellness Brand Client',
      deliverable: 'Fast-cut exercise guide with form callout indicators',
      tag: 'MOTION EDIT'
    }
  ]
};

// ============================================================================
// 06. FREE SAMPLE EDIT CTA
// ============================================================================
export const contentSampleCtaData = {
  eyebrow: 'PITCHING A CLIENT??',
  title: 'Get Free Sample Edits',
  titleGradient: 'To close them.',
  description: 'Send us your client\'s raw video footage or creative brief. We\'ll produce a complimentary, fully finished sample edit within 24–48 hours that you can present to win the retainer.',
  primaryCta: {
    label: 'GET A FREE SAMPLE EDIT',
    href: '#contentCalendlyModal',
    arrow: '→'
  },
  reassurance: 'Manual edit by senior creative editors • Delivered in 24–48 hours • 100% white-label proof',
  steps: [
    {
      num: '01',
      title: 'Upload Raw Footage',
      desc: 'Send a Drive or Dropbox link with raw phone clips or creative assets.'
    },
    {
      num: '02',
      title: 'We Edit to Your Style',
      desc: 'Our team trims, grades, animates subtitles, and mixes audio in 24-48h.'
    },
    {
      num: '03',
      title: 'Present & Close Retainer',
      desc: 'Show your prospective client the finished piece under your agency brand.'
    }
  ]
};

// ============================================================================
// 07. WANT TO GO BEYOND? + PACKAGES (STARTER, GROWTH, SCALE)
// ============================================================================
export const contentPackagesData = {
  eyebrow: 'WANT TO GO BEYOND?',
  title: 'We can help you save',
  titleGradient: '80 hours of monthly time in managing your clients.',
  description: 'Predictable monthly content fulfillment tiers built specifically for agency margins and reliable turnaround.',
  packages: [
    {
      id: 'pkg-content-starter',
      tier: '01 / Starter',
      name: 'Content Starter',
      tagline: 'Essential social creative and short-form editing for boutique agencies.',
      price: 'PRICE TBD',
      period: '/ month',
      note: 'Transparent scope • Dedicated delivery',
      ctaText: 'Get Started →',
      isPopular: false,
      deliverables: [
        '12 Custom Social Posts / mo',
        '6 Edited Reels & Short-Form Videos / mo',
        'Custom Motion Graphics & Captions',
        'Brand Asset & Template Alignment',
        '24–48 Hour Standard Turnaround',
        'Unlimited Minor Revisions',
        '100% White-Label Google Drive Delivery',
        'Dedicated Content Producer'
      ]
    },
    {
      id: 'pkg-content-growth',
      tier: '02 / Growth',
      name: 'Content Growth',
      tagline: 'High-volume content production for growing agencies managing multiple retainers.',
      badge: 'Most Popular',
      price: 'PRICE TBD',
      period: '/ month',
      note: 'Transparent scope • Dedicated delivery',
      ctaText: 'Get Started →',
      isPopular: true,
      deliverables: [
        '24 Custom Social Posts / mo',
        '16 Edited Reels & Short-Form Videos / mo',
        '4 In-Depth Multi-Slide Carousels / mo',
        'Hook Optimization & Dynamic Subtitles',
        'Sound Design & Trending Audio Selection',
        'Priority 24-Hour Turnaround',
        'Unlimited Revisions',
        'White-Label Client Review Portal',
        'Dedicated Senior Creative Lead'
      ]
    },
    {
      id: 'pkg-content-scale',
      tier: '03 / Scale',
      name: 'Content Scale',
      tagline: 'Complete content engine for agencies scaling 10+ active brand retainers.',
      price: 'PRICE TBD',
      period: '/ month',
      note: 'Transparent scope • Dedicated delivery',
      ctaText: 'Get Started →',
      isPopular: false,
      deliverables: [
        '40+ Custom Social Posts / mo',
        '30 Edited Reels & Short-Form Videos / mo',
        '8 In-Depth Multi-Slide Carousels / mo',
        'Paid Ad Creative & Hook Variations',
        'Multi-Platform Reformatting (9:16, 4:5, 1:1, 16:9)',
        'Same-Day / 24-Hour Rush Turnaround',
        'Dedicated Slack Channel & Real-Time Comms',
        'Monthly Creative Direction & Strategy Review',
        'Dedicated Senior Art Director'
      ]
    }
  ]
};

// ============================================================================
// 08. AGENCY ECONOMICS / MARGINS
// ============================================================================
export const contentEconomicsData = {
  eyebrow: 'AGENCY ECONOMICS',
  title: 'Content Delivery That Leaves Room',
  titleGradient: 'For Your Margin.',
  description: 'Price your content retainers at market value while CREWiiFY executes at predictable wholesale rates. Keep the healthy recurring profit.',
  footerNote: 'Sell under your brand. Outsource the delivery. Keep the difference.',
  cards: [
    {
      id: 'econ-content-starter',
      tier: '01 / Starter',
      name: 'Content Starter',
      youCharge: '$1,500',
      ourRate: 'PRICE TBD',
      youKeep: 'MARGIN TBD'
    },
    {
      id: 'econ-content-growth',
      tier: '02 / Growth',
      name: 'Content Growth',
      isPopular: true,
      youCharge: '$3,000',
      ourRate: 'PRICE TBD',
      youKeep: 'MARGIN TBD'
    },
    {
      id: 'econ-content-scale',
      tier: '03 / Scale',
      name: 'Content Scale',
      youCharge: '$5,500',
      ourRate: 'PRICE TBD',
      youKeep: 'MARGIN TBD'
    }
  ]
};

// ============================================================================
// 09. HOW IT WORKS (EXACT CLIENT WORKFLOW)
// ============================================================================
export const contentProcessData = {
  eyebrow: 'HOW IT WORKS',
  title: 'From raw footage to',
  titleGradient: 'ready-to-deliver content.',
  description: 'A streamlined four-step white-label delivery engine built for operational clarity and fast agency turnaround.',
  steps: [
    {
      num: '01',
      title: 'YOU SHOOT / FILM',
      desc: 'You or your client captures the raw footage and content.'
    },
    {
      num: '02',
      title: 'SEND US THE RAW CONTENT',
      desc: 'Upload the raw content through Google Drive, Dropbox or your preferred file-sharing system.'
    },
    {
      num: '03',
      title: 'GIVE US YOUR SOP',
      desc: 'Share your editing preferences, brand guidelines and instructions for how you want the content delivered.'
    },
    {
      num: '04',
      title: 'GET THE FINAL CONTENT',
      desc: 'Finished content is delivered within 24–48 hours.',
      highlight: '24–48 hours'
    }
  ]
};

// ============================================================================
// 10. INCLUDED WITH EVERY PLAN (ONBOARDING)
// ============================================================================
export const contentOnboardingData = {
  eyebrow: 'INCLUDED WITH EVERY PLAN',
  title: 'Everything your team needs',
  titleGradient: 'to get started.',
  description: 'Every plan starts with a comprehensive creative alignment at no extra charge. We adapt completely to your agency\'s production standards.',
  items: [
    { num: '01', title: 'Brand guidelines & typography mapping' },
    { num: '02', title: 'Custom content SOP & style guide integration' },
    { num: '03', title: 'Editing preferences profile & motion templates' },
    { num: '04', title: 'Google Drive or Dropbox file-sharing setup' },
    { num: '05', title: 'Rapid revision workflow & feedback loop' },
    { num: '06', title: '100% white-label delivery & file naming conventions' },
    { num: '07', title: 'Dedicated Slack or async communication channel' },
    { num: '08', title: 'Multi-aspect ratio export presets (9:16, 4:5, 1:1, 16:9)' },
    { num: '09', title: 'And more.' }
  ]
};

// ============================================================================
// 11. CONTENT TRANSFORMATION SHOWCASE (RAW -> EDIT -> FINAL)
// ============================================================================
export const contentTransformationData = {
  eyebrow: 'SEE WHAT YOU GET',
  title: 'From raw content to',
  titleGradient: 'client-ready creative.',
  description: 'Experience how rough client footage and raw briefs transform into polished, high-engagement creative ready for client delivery.',
  tabs: [
    {
      id: 'transform-tab-reel',
      label: 'Short-Form Reel (9:16)',
      type: 'reel',
      stageRaw: {
        tag: 'STAGE 1: RAW FOOTAGE',
        title: 'Uncut Raw Capture',
        points: [
          'Unedited smartphone take with dead pauses',
          'Unbalanced audio & ambient room noise',
          'No visual hook or dynamic framing',
          'Flat standard color profile'
        ],
        badge: 'RAW INPUT'
      },
      stageEdit: {
        tag: 'STAGE 2: CREWiiFY EDIT',
        title: 'Production Engineering',
        points: [
          'Pacing cut removing breaths and filler words',
          'Karaoke-style animated subtitle typography',
          'Color grading, contrast pop & skin smoothing',
          'Sound design, risers, whooshes & licensed music'
        ],
        badge: 'CREWiiFY EDIT'
      },
      stageFinal: {
        tag: 'STAGE 3: FINAL CONTENT',
        title: 'Client-Ready Deliverable',
        points: [
          'Exported in pristine 4K 60fps (9:16)',
          'Engaging cover thumbnail included',
          'Ready-to-post caption copy & hook test',
          'Delivered in 24-48 hours into client folder'
        ],
        badge: 'FINAL DELIVERABLE'
      }
    },
    {
      id: 'transform-tab-carousel',
      label: 'Social Carousel (4:5)',
      type: 'carousel',
      stageRaw: {
        tag: 'STAGE 1: RAW BRIEF',
        title: 'Raw Article / Talking Points',
        points: [
          'Unformatted notes, tweets or podcast transcripts',
          'Dense walls of text with no visual scannability',
          'No consistent branding or slide layout'
        ],
        badge: 'RAW INPUT'
      },
      stageEdit: {
        tag: 'STAGE 2: CREWiiFY EDIT',
        title: 'Design & Visual Hierarchy',
        points: [
          'Information distilled into bite-sized slides',
          'Custom vector diagrams & typography hierarchy',
          'Thumb-stopping hook slide design'
        ],
        badge: 'CREWiiFY EDIT'
      },
      stageFinal: {
        tag: 'STAGE 3: FINAL CONTENT',
        title: 'Swipeable Carousel Deck',
        points: [
          'Complete 8-10 slide multi-asset PNG pack',
          'Figma / master asset source files included',
          'Formatted for Instagram & LinkedIn feeds'
        ],
        badge: 'FINAL DELIVERABLE'
      }
    },
    {
      id: 'transform-tab-ad',
      label: 'Performance Ad (1:1 & 9:16)',
      type: 'ad',
      stageRaw: {
        tag: 'STAGE 1: RAW ASSETS',
        title: 'Static Product & UGC Clips',
        points: [
          'Customer unboxing clips or flat product stills',
          'No marketing hooks or conversion callouts',
          'Single standard dimension'
        ],
        badge: 'RAW INPUT'
      },
      stageEdit: {
        tag: 'STAGE 2: CREWiiFY EDIT',
        title: 'Direct Response Optimization',
        points: [
          'Dynamic text overlays highlighting USPs',
          'First 3-second hook variations for A/B testing',
          'Compelling CTA end-cards with brand assets'
        ],
        badge: 'CREWiiFY EDIT'
      },
      stageFinal: {
        tag: 'STAGE 3: FINAL CONTENT',
        title: 'Multi-Variant Ad Suite',
        points: [
          'Ready-to-upload Meta & TikTok ad exports',
          'Multiple hook variations for immediate testing',
          'Turnaround under 48 hours for fast deployment'
        ],
        badge: 'FINAL DELIVERABLE'
      }
    }
  ]
};

// ============================================================================
// 12. FAQ (CONTENT & VIDEO DELIVERY)
// ============================================================================
export const contentFaqData = {
  eyebrow: 'COMMON QUESTIONS',
  title: 'The questions agencies',
  titleGradient: 'ask first.',
  items: [
    {
      id: 'faq-01',
      num: '01',
      question: 'How fast is content delivered?',
      answer: 'Standard turnaround is 24 to 48 hours for short-form edits and social graphics. For urgent campaign deadlines or rush sprints, same-day delivery options are available on higher-tier plans.'
    },
    {
      id: 'faq-02',
      num: '02',
      question: 'Can you follow our SOP and editing preferences?',
      answer: 'Yes, 100%. During onboarding, we map your agency’s creative SOP, client color palettes, font licenses, caption animation presets, and motion styles. Every video and graphic looks like it was created directly by your in-house team.'
    },
    {
      id: 'faq-03',
      num: '03',
      question: 'Can everything be white-labeled?',
      answer: 'Yes. We remain completely invisible. We never contact your clients, and all deliverables, project folders, and review links are branded exclusively under your agency identity. Nothing points back to CREWiiFY.'
    },
    {
      id: 'faq-04',
      num: '04',
      question: 'Can you work with raw client footage?',
      answer: 'Absolutely. You or your client can upload raw iPhone videos, podcast camera recordings, talking-head takes, or B-roll footage into your dedicated Google Drive or Dropbox folder. We take care of all cutting, grading, and sound mixing.'
    },
    {
      id: 'faq-05',
      num: '05',
      question: 'How do revisions work?',
      answer: 'Revisions are fast and hassle-free. Your team can leave time-stamped comments or markups directly in the review link. Minor edits are completed within 24 hours so your client delivery schedules remain on track.'
    },
    {
      id: 'faq-06',
      num: '06',
      question: 'How do we get started?',
      answer: 'Request a free sample edit or schedule a 20-minute discovery briefing. Send us a raw client video or creative brief, and we\'ll produce a finished sample edit to prove our quality before you commit to a monthly plan.'
    }
  ]
};

// ============================================================================
// 13. FINAL CTA CONFIGURATION
// ============================================================================
export const contentFinalCtaData = {
  eyebrow: 'READY TO SCALE YOUR CONTENT DELIVERY?',
  title: 'Let us handle the content',
  titleGradient: 'while you handle the client.',
  description: 'Scale your agency retainers without hiring more video editors or designers. Partner with CREWiiFY for predictable, white-label creative fulfillment that protects your margin.',
  intro: 'Book a discovery briefing and let’s discuss your content delivery pipeline.',
  primaryCta: {
    label: 'BOOK A DISCOVERY CALL',
    arrow: '→'
  },
  reassurance: 'No lock-in contracts • 100% white-label fulfillment • 24–48h delivery guarantee'
};
