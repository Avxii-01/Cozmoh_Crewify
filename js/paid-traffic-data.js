/**
 * paid-traffic-data.js - Configurable Data Architecture for CREWiiFY Paid-Traffic Landing Page
 * 
 * Reuses existing verified case-study data from js/case-studies-data.js as single source of truth.
 * Centralizes proofConfig, workShowcaseItems, landingRatePreview, and landingSurveyQuestions.
 */

import { caseStudiesData } from './case-studies-data.js';
import { partnerRatesData } from './partner-rates-data.js';

/**
 * Full 2-Column Agency Rates Dataset (All 22 Services Across 8 Categories)
 * Single Source of Truth: js/partner-rates-data.js
 * 
 * Rebalanced for identical visual height and content distribution:
 * Column 1: Organic Growth, Local, Web & Reporting (4 Categories, 11 Services)
 *   - Search Engine Optimization (3 services)
 *   - Local SEO & Google Business Profile (3 services)
 *   - Website & Landing Page Development (4 services)
 *   - White-Label Reporting (1 service)
 * 
 * Column 2: Content, Social, Video & Paid Campaigns (4 Categories, 11 Services)
 *   - Content Writing (3 services)
 *   - Social Media Design (2 services)
 *   - Video Editing & Production (3 services)
 *   - Paid Media Management (3 services)
 */
const col1CategoryIds = ['seo', 'local-seo', 'web-dev', 'white-label-reporting'];
export const agencyRatesCol1 = col1CategoryIds
  .map(id => partnerRatesData.find(cat => cat.id === id))
  .filter(Boolean);

const col2CategoryIds = ['content-writing', 'social-media-design', 'video-editing', 'paid-media'];
export const agencyRatesCol2 = col2CategoryIds
  .map(id => partnerRatesData.find(cat => cat.id === id))
  .filter(Boolean);

/**
 * Global Proof Metrics Configuration
 * Editable in one place to maintain site-wide consistency.
 */
export const proofConfig = {
  projectsDelivered: "400+",
  projectsDeliveredLabel: "Projects Delivered",
  whiteLabelRate: "100%",
  whiteLabelLabel: "White-Label",
  averageRating: "4.9/5",
  averageRatingLabel: "Average Rating"
};

/**
 * Approved Client Logos
 * Matching homepage presentation with authentic brand colors and styling.
 */
export const approvedLogos = [
  { name: "Royal Caribbean", src: "assets/logos/Royal_Caribbean_logo_(2024).svg.png", class: "client-strip__logo--wide", filter: "brightness(0) invert(1)" },
  { name: "Celebrity Cruises", src: "assets/logos/celebrity-cruises.png", class: "client-strip__logo--wide", filter: "brightness(0) invert(1)" },
  { name: "KIMS Hospital", src: "assets/logos/kimshospitals.png", class: "client-strip__logo--wide" },
  { name: "Wockhardt", src: "assets/logos/wockhardtlogo.webp", class: "client-strip__logo--square" },
  { name: "Travezy", src: "assets/logos/travezy.png", class: "client-strip__logo--compact" },
  { name: "Paladium", src: "assets/logos/logo-paladium-1-e1769852477457.png", class: "client-strip__logo--wide" },
  { name: "Acktive Vision", src: "assets/logos/acktive-vision-logo-Final-e1771914753291.png", class: "client-strip__logo--wide" },
  { name: "SRM Jeevan Healthcare", src: "assets/logos/srmjeevan.png", class: "client-strip__logo--wide" },
  { name: "Your V Care", src: "assets/logos/cropped-cropped-Your-V-Care-Logo-1.webp", class: "client-strip__logo--square" },
  { name: "Maheshwari", src: "assets/logos/maishwari.png", class: "client-strip__logo--wide" },
  { name: "Dr. Ramkishan Nag", src: "assets/logos/drramkishan.jpg", class: "client-strip__logo--wide" }
];

/**
 * Derived Case Studies from Single Source of Truth (`js/case-studies-data.js`)
 * Strictly uses verified numbers, titles, categories, and metrics.
 */
const candidateIds = [
  'paladium-janseva',
  'leading-cruise-line-ppc',
  'leading-multispeciality-hospital-ppc',
  'orthopedic-doctor-seo',
  'organic-farm-resort-seo',
  'resort-local-seo'
];

export const landingCaseStudies = candidateIds.map(id => {
  const cs = caseStudiesData.find(item => item.id === id);
  if (!cs) return null;

  // Build secondary metrics list combining verified values from the case study
  const verifiedSecondary = [];

  if (cs.results?.secondary && Array.isArray(cs.results.secondary)) {
    cs.results.secondary.forEach(s => {
      verifiedSecondary.push({
        value: s.value,
        label: s.label
      });
    });
  } else if (cs.metrics && Array.isArray(cs.metrics)) {
    cs.metrics.forEach(m => {
      verifiedSecondary.push({
        value: m.value,
        label: m.label
      });
    });
  }

  return {
    id: cs.id,
    title: cs.title,
    client: cs.client?.name || cs.title,
    category: cs.category,
    image: cs.image || (cs.hero && cs.hero.coverImage) || '',
    primaryValue: cs.result || (cs.results && cs.results.primary ? cs.results.primary.value : ''),
    primaryLabel: cs.resultLabel || (cs.results && cs.results.primary ? cs.results.primary.label : ''),
    description: cs.description || (cs.overview) || '',
    metrics: verifiedSecondary
  };
}).filter(Boolean);

/**
 * Our Work Showcase Items (Continuous Horizontal Auto-scrolling Reel)
 * Large image-first panels representing high-craft deliverables.
 */
export const workShowcaseItems = [
  {
    id: "work-cozmoh-trust",
    name: "Cozmoh Shree Bhatiawadi Trust",
    url: "https://avxii-01.github.io/Cozmoh-Shree-Bhatiawadi-trust-/",
    category: "WEBSITE DEVELOPMENT",
    status: "UNDER DEVELOPMENT"
  },
  {
    id: "work-crewiify",
    name: "CREWiiFY",
    url: "https://www.crewiify.com/",
    category: "WEBSITE DEVELOPMENT"
  },
  {
    id: "work-palladium-janseva",
    name: "Palladium Janseva",
    url: "https://palladiumjanseva.com/",
    category: "WEBSITE DEVELOPMENT"
  },
  {
    id: "work-a-real-estate-media",
    name: "A Real Estate Media",
    url: "https://arealestatemedia.com/",
    category: "WEBSITE DEVELOPMENT"
  },
  {
    id: "work-krishna-sportz",
    name: "Krishna Sportz",
    url: "https://krishnasportz.com/",
    category: "E-COMMERCE / WEBSITE DEVELOPMENT",
    embedBlocked: true // Enforces X-Frame-Options: DENY and frame-ancestors 'none'
  },
  {
    id: "work-wearwulf",
    name: "WearWulf",
    url: "https://wearwulf.in/",
    category: "E-COMMERCE / WEBSITE DEVELOPMENT"
  },
  {
    id: "work-falcon-tourism",
    name: "Falcon Tourism",
    url: "https://falcontourism.ae/en/",
    category: "WEBSITE DEVELOPMENT"
  },
  {
    id: "work-cozmoh",
    name: "Cozmoh",
    url: "https://cozmoh.com/",
    category: "WEBSITE DEVELOPMENT"
  },
  {
    id: "work-joy-water-purifier",
    name: "Joy Water Purifier",
    url: "https://joywaterpurifier.com/",
    category: "WEBSITE DEVELOPMENT"
  },
  {
    id: "work-acktiv-ortho",
    name: "Acktiv Ortho",
    url: "https://acktivortho.com/",
    category: "WEBSITE DEVELOPMENT"
  },
  {
    id: "work-glowtech-power",
    name: "Glowtech Power",
    url: "https://glowtechpower.in/",
    category: "WEBSITE DEVELOPMENT"
  },
  {
    id: "work-healthcare-jeevan",
    name: "Healthcare Jeevan",
    url: "https://healthcarejeevan.in/",
    category: "WEBSITE DEVELOPMENT"
  },
  {
    id: "work-greenwich-afri",
    name: "Greenwich Afri",
    url: "https://greenwichafri.com/",
    category: "WEBSITE DEVELOPMENT"
  },
  {
    id: "work-skyline-hostels",
    name: "Skyline Hostels",
    url: "https://skylinehostels.in/",
    category: "WEBSITE DEVELOPMENT"
  }
];

/**
 * Approved Representative Rate Preview
 * Exact approved values — DO NOT recalculate 'You Keep' from other columns.
 */
export const landingRatePreview = [
  {
    service: "SEO Starter",
    scope: "On-page + 4 content pieces + 8 backlinks / mo",
    clientBill: "$1,200",
    ourRate: "$395",
    youKeep: "$800"
  },
  {
    service: "Landing Page",
    scope: "Single high-converting page, responsive, on-brand",
    clientBill: "$600",
    ourRate: "$200",
    youKeep: "$400"
  },
  {
    service: "Business Website (5 pages)",
    scope: "Design + build, CMS, mobile-optimized (WordPress Based)",
    clientBill: "$1,800",
    ourRate: "$395",
    youKeep: "$1,600"
  },
  {
    service: "SEO Blog Post",
    scope: "1,200–1,500 words, keyword-optimized, formatted",
    clientBill: "$150",
    ourRate: "$30",
    youKeep: "$120"
  },
  {
    service: "Short-Form Video",
    scope: "Reels / TikTok / Shorts, script + edit + captions",
    clientBill: "$150",
    ourRate: "$40",
    youKeep: "$110"
  },
  {
    service: "Google Ads Management",
    scope: "Up to $3,000 ad spend, setup + monthly management",
    clientBill: "$900",
    ourRate: "$300",
    youKeep: "$600"
  }
];

/**
 * 5-Step Agency Survey Questions
 */
export const landingSurveyQuestions = [
  {
    step: 1,
    id: "agencyType",
    question: "What type of agency are you?",
    description: "Select the description that best fits your agency model.",
    isMulti: false,
    options: [
      { value: "Digital / Marketing Agency", label: "Digital / Marketing Agency" },
      { value: "SEO Agency", label: "SEO Agency" },
      { value: "Web / Development Agency", label: "Web / Development Agency" },
      { value: "Creative / Social Media Agency", label: "Creative / Social Media Agency" },
      { value: "Full-Service Agency", label: "Full-Service Agency" },
      { value: "Other", label: "Other Agency Model" }
    ]
  },
  {
    step: 2,
    id: "activeClients",
    question: "How many active clients do you currently manage?",
    description: "This helps us gauge monthly delivery capacity requirements.",
    isMulti: false,
    options: [
      { value: "1–5", label: "1–5 Clients" },
      { value: "6–15", label: "6–15 Clients" },
      { value: "16–30", label: "16–30 Clients" },
      { value: "30+", label: "30+ Clients" }
    ]
  },
  {
    step: 3,
    id: "servicesNeeded",
    question: "What would you like to outsource?",
    description: "Select all services you'd like CREWiiFY to handle behind the scenes.",
    isMulti: true,
    options: [
      { value: "SEO", label: "SEO & Local Search" },
      { value: "Websites / Landing Pages", label: "Websites & Landing Pages" },
      { value: "Content", label: "Content Writing" },
      { value: "Social Media", label: "Social Media Management" },
      { value: "Video", label: "Short-Form Video" },
      { value: "Paid Media", label: "Google Ads / PPC" },
      { value: "Multiple Services", label: "Multiple Services" }
    ]
  },
  {
    step: 4,
    id: "outsourcingReason",
    question: "What's driving the need for outsourcing?",
    description: "Select the primary operational priority for your agency.",
    isMulti: false,
    options: [
      { value: "Too much work for our current team", label: "Too much work for our current team" },
      { value: "Need specialist expertise", label: "Need specialist expertise" },
      { value: "Want faster turnaround", label: "Want faster turnaround" },
      { value: "Want to improve delivery margins", label: "Want to improve delivery margins" },
      { value: "Want to take on more clients", label: "Want to take on more clients" },
      { value: "Don't want to hire internally", label: "Don't want to hire internally" }
    ]
  },
  {
    step: 5,
    id: "startTimeline",
    question: "When are you looking to start?",
    description: "Tell us about your timeline so we can plan team capacity.",
    isMulti: false,
    options: [
      { value: "Immediately", label: "Immediately" },
      { value: "Within 30 days", label: "Within 30 days" },
      { value: "Within 1–3 months", label: "Within 1–3 months" },
      { value: "Just exploring options", label: "Just exploring options" }
    ]
  }
];
