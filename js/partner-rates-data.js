// partner-rates-data.js - White-Label Agency Rate Sheet Data Configuration for CREWiiFY
// Source of truth: Approved 2026 CREWiiFY White-Label Rate Sheet

export const partnerRatesData = [
  {
    id: "seo",
    categoryLabel: "SEARCH ENGINE OPTIMIZATION",
    billingLabel: "Monthly retainer",
    navLabel: "SEO",
    services: [
      {
        name: "SEO Starter",
        description: "On-page + 4 content pieces + 8 backlinks / mo",
        clientBill: "$1,200",
        ourRate: "$395",
        youKeep: "$800",
        note: null
      },
      {
        name: "SEO Growth",
        description: "On-page + 8 content + 15 backlinks + technical / mo",
        clientBill: "$2,000",
        ourRate: "$695",
        youKeep: "$1,300",
        note: null
      },
      {
        name: "SEO Scale",
        description: "Full technical + 12 content + 25 backlinks / mo",
        clientBill: "$3,000",
        ourRate: "$999",
        youKeep: "$2,000",
        note: null
      }
    ]
  },
  {
    id: "local-seo",
    categoryLabel: "LOCAL SEO & GOOGLE BUSINESS PROFILE",
    billingLabel: "Monthly + one-off",
    navLabel: "LOCAL SEO",
    services: [
      {
        name: "GBP Setup & Optimization",
        description: "One-time profile build, categories, posts, citations",
        clientBill: "$450",
        ourRate: "$150",
        youKeep: "$300",
        note: null
      },
      {
        name: "Local SEO Retainer",
        description: "GBP management + local citations + reviews / mo",
        clientBill: "$750",
        ourRate: "$250",
        youKeep: "$500",
        note: null
      },
      {
        name: "Multi-Location Local",
        description: "Up to 5 locations, managed monthly",
        clientBill: "$1,500",
        ourRate: "$500",
        youKeep: "$1,000",
        note: null
      }
    ]
  },
  {
    id: "web-dev",
    categoryLabel: "WEBSITE & LANDING PAGE DEVELOPMENT",
    billingLabel: "Per project",
    navLabel: "WEB",
    services: [
      {
        name: "Landing Page",
        description: "Single high-converting page, responsive, on-brand",
        clientBill: "$600",
        ourRate: "$200",
        youKeep: "$400",
        note: null
      },
      {
        name: "Business Website (5 pages)",
        description: "Design + build, CMS, mobile-optimized (WordPress Based)",
        clientBill: "$1,800",
        ourRate: "$395",
        youKeep: "$1,600",
        note: null
      },
      {
        name: "Premium / E-commerce",
        description: "Custom design, store setup, integrations",
        clientBill: "$4,500",
        ourRate: "$899",
        youKeep: "$3,600",
        note: null
      },
      {
        name: "Website Maintenance",
        description: "Updates, backups, security, edits / mo",
        clientBill: "$300",
        ourRate: "$100",
        youKeep: "$200",
        note: null
      }
    ]
  },
  {
    id: "content-writing",
    categoryLabel: "CONTENT WRITING",
    billingLabel: "Per piece / bundle",
    navLabel: "CONTENT",
    services: [
      {
        name: "SEO Blog Post",
        description: "1,000–1,500 words, keyword-optimized",
        clientBill: "$150",
        ourRate: "$30",
        youKeep: "$120",
        note: null
      },
      {
        name: "Long-Form Article",
        description: "2,000+ words, researched, optimized",
        clientBill: "$270",
        ourRate: "$50",
        youKeep: "$220",
        note: null
      },
      {
        name: "Content Bundle (10 posts)",
        description: "Monthly content pack, ready to publish",
        clientBill: "$1,200",
        ourRate: "$400",
        youKeep: "$800",
        note: null
      }
    ]
  },
  {
    id: "white-label-reporting",
    categoryLabel: "WHITE-LABEL REPORTING",
    billingLabel: "Monthly",
    navLabel: "REPORTING",
    services: [
      {
        name: "Branded Monthly Report (If Custom Required)",
        description: "Your logo, your colors, per client / mo",
        clientBill: "$150",
        ourRate: "$50",
        youKeep: "$100",
        note: null
      }
    ]
  },
  {
    id: "social-media-design",
    categoryLabel: "SOCIAL MEDIA DESIGN",
    billingLabel: "Per pack / monthly",
    navLabel: "SOCIAL",
    services: [
      {
        name: "Design Pack (10 posts)",
        description: "Static + carousel, on-brand templates",
        clientBill: "$750",
        ourRate: "$250",
        youKeep: "$500",
        note: null
      },
      {
        name: "Social Management",
        description: "Content calendar + 15 designs + scheduling / mo",
        clientBill: "$1,200",
        ourRate: "$425",
        youKeep: "$800",
        note: null
      }
    ]
  },
  {
    id: "video-editing",
    categoryLabel: "VIDEO EDITING & PRODUCTION",
    billingLabel: "Per video / bundle",
    navLabel: "VIDEO",
    services: [
      {
        name: "Short-Form Video",
        description: "Reel / TikTok / Short, ≤60s, captions + edit",
        clientBill: "$150",
        ourRate: "$40",
        youKeep: "$110",
        note: null
      },
      {
        name: "Video Pack (8 shorts)",
        description: "Monthly batch, hooks + captions + edits",
        clientBill: "$1,200",
        ourRate: "$300",
        youKeep: "$900",
        note: null
      },
      {
        name: "Long-Form Edit",
        description: "YouTube / promo, up to 10 min, full post",
        clientBill: "$450",
        ourRate: "$150",
        youKeep: "$300",
        note: null
      }
    ]
  },
  {
    id: "paid-media",
    categoryLabel: "PAID MEDIA MANAGEMENT",
    billingLabel: "Monthly (excl. ad spend)",
    navLabel: "PAID MEDIA",
    services: [
      {
        name: "Google Ads Management",
        description: "Setup + optimization + reporting / mo",
        clientBill: "$900",
        ourRate: "$300",
        youKeep: "$600",
        note: "Excludes ad spend."
      },
      {
        name: "Meta Ads Management",
        description: "Campaign build + creative direction + reporting / mo",
        clientBill: "$900",
        ourRate: "$300",
        youKeep: "$600",
        note: "Excludes ad spend."
      },
      {
        name: "Full Paid Stack",
        description: "Google + Meta managed together / mo",
        clientBill: "$1,500",
        ourRate: "$500",
        youKeep: "$1,000",
        note: "Excludes ad spend."
      }
    ]
  }
];

// Global fallback for standard script tag usage
if (typeof window !== 'undefined') {
  window.partnerRatesData = partnerRatesData;
}
