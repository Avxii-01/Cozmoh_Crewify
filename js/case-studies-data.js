// case-studies-data.js - Real Case Study Repository for CREWiiFY

/**
 * Category Configuration Table
 * Future categories are preserved with enabled: false for seamless launch control.
 */
export const CASE_STUDY_CATEGORIES = [
  { id: 'all', label: 'All Work', enabled: true },
  { id: 'SEO', label: 'SEO', enabled: true },
  { id: 'PPC Management & Growth', label: 'PPC Management & Growth', enabled: true },
  { id: 'Web Development', label: 'Web Development', enabled: false },
  { id: 'WhatsApp Automation', label: 'WhatsApp Automation', enabled: false },
  { id: 'WordPress', label: 'WordPress', enabled: false },
  { id: 'Shopify', label: 'Shopify', enabled: false }
];

/**
 * The 6 Real Client Case Studies
 */
export const caseStudiesData = [
  {
    id: "orthopedic-doctor-seo",
    title: "Orthopedic Doctor",
    subtitle: "Local SEO & Google Business Profile Optimization",
    category: "SEO",
    client: "Orthopedic Clinic",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
    imagePosition: "center 22%",
    cardSpan: "tall",
    description: "Optimized local SEO and Google Business Profile to capture patient searches, climbing clinic calls from 60 to 345 in four months.",
    result: "345",
    resultLabel: "Monthly Calls",
    metrics: [
      { value: "345", label: "Monthly Calls" },
      { value: "60 → 345", label: "4-Month Growth" }
    ],
    overview: "A digital agency brought us an orthopedic clinic struggling to get the phone to ring. We optimized their local SEO and Google Business Profile to rank for the searches patients were actually making. In just four months, monthly calls to the clinic climbed from 60 to 345, delivered entirely behind the scenes, under the agency's own brand.",
    services: ["Local SEO", "Google Business Profile Optimization"]
  },
  {
    id: "multispeciality-hospital-seo",
    title: "Multispeciality Hospital",
    subtitle: "High-Intent Local Search & GMB Optimization",
    category: "SEO",
    client: "Multispeciality Hospital",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
    imagePosition: "center center",
    cardSpan: "medium",
    description: "Improved local SEO and GMB ranking to surface high-intent searches, pulling in over 4,500 qualified calls per month.",
    result: "4,500+",
    resultLabel: "Calls / Month",
    metrics: [
      { value: "4,500+", label: "Calls / Month" },
      { value: "High-Intent", label: "GMB Search Rankings" }
    ],
    overview: "A digital agency brought us Multispeciality Hospital, buried under low-intent, irrelevant inquiries. We improved their local SEO and GMB ranking to surface them for the searches that actually mattered, pulling in higher-quality, high-intent traffic. The result: 4,500+ calls per month, delivered entirely behind the scenes, under the agency's own brand.",
    services: ["Local SEO", "Google Business Profile (GMB) Optimization"]
  },
  {
    id: "organic-farm-resort-seo",
    title: "Organic Farm Resort",
    subtitle: "On-Page Restructuring & First-Page Keyword Rankings",
    category: "SEO",
    client: "Organic Farm & Education Resort",
    image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=800&q=80",
    imagePosition: "center center",
    cardSpan: "tall",
    description: "Rebuilt on-page structure and ran sustained off-page SEO, securing 16 first-page Google rankings with several holding #1–2 spots for over a year.",
    result: "16",
    resultLabel: "First-Page Keywords",
    metrics: [
      { value: "16", label: "First-Page Keywords" },
      { value: "#1–2 Spots", label: "Held For Over A Year" }
    ],
    overview: "A digital agency brought us an organic-farming education client with weak search visibility across their key Maharashtra markets. We rebuilt their on-page structure, ran sustained off-page work, and locked in consistent keyword tracking. The result: 16 keywords ranking on Google's first page, several holding the #1–2 spots for over a year, with organic search now the primary driver of traffic, delivered entirely behind the scenes, under the agency's own brand.",
    services: ["On-Page SEO Structure", "Off-Page SEO", "Keyword Tracking"]
  },
  {
    id: "resort-local-seo",
    title: "Resort",
    subtitle: "Competitive Local SEO & Keyword Targeting",
    category: "SEO",
    client: "Regional Hospitality Resort",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    imagePosition: "center 45%",
    cardSpan: "medium",
    description: "Built out local SEO and off-page signals from a standing start, breaking into top-20 positions for competitive getaway searches.",
    result: "Top 20",
    resultLabel: "Local Search Rankings",
    metrics: [
      { value: "Top 20", label: "Local Search Rankings" },
      { value: "Dense Market", label: "Getaway Terms" }
    ],
    overview: "A digital agency brought us a resort competing for high-intent local searches across the Bhivpuri, Badlapur, and Ambernath belt. We built out local SEO, keyword targeting, and off-page signals from a standing start. Within months the resort broke into top-20 positions for competitive couple-and-getaway search terms in a dense local market, delivered entirely behind the scenes, under the agency's own brand.",
    services: ["Local SEO", "Keyword Targeting", "Off-Page Signals"]
  },
  {
    id: "leading-cruise-line-ppc",
    title: "A Leading Cruise Line",
    subtitle: "High-Performance PPC Campaign Restructuring & Conversion Tracking",
    category: "PPC Management & Growth",
    client: "Global Cruise Travel Brand",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=800&q=80",
    imagePosition: "center center",
    cardSpan: "tall",
    description: "Rebuilt conversion tracking and restructured intent signals to drive cabin bookings, achieving a 9x ROAS and $550K in monthly PPC revenue.",
    result: "9x",
    resultLabel: "ROAS",
    metrics: [
      { value: "9x", label: "Return on Ad Spend" },
      { value: "$550K", label: "Monthly PPC Revenue" }
    ],
    overview: "A digital agency came to us with a high-value client, one of the biggest names in cruise travel, that was bleeding conversions through broken tracking and misread buying signals. We rebuilt the conversion tracking from the ground up, isolated the purchase intent signals that actually drove cabin bookings, and restructured the campaigns around them. The result: a 9x return on ad spend and $550K in monthly revenue generated through PPC, delivered entirely behind the scenes, under the agency's own brand.",
    services: ["Conversion Tracking Overhaul", "PPC Campaign Restructuring", "Purchase Intent Optimization"]
  },
  {
    id: "leading-multispeciality-hospital-ppc",
    title: "A Leading Multispeciality Hospital",
    subtitle: "PPC Funnel Rebuild & Conversion Tracking",
    category: "PPC Management & Growth",
    client: "Leading Multispeciality Hospital",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80",
    imagePosition: "center 30%",
    cardSpan: "medium",
    description: "Fixed tracking, rebuilt the conversion funnel, and refocused spend on high-converting searches, achieving 7x ROAS and $255K in monthly revenue.",
    result: "7x",
    resultLabel: "ROAS",
    metrics: [
      { value: "7x", label: "Return on Ad Spend" },
      { value: "$255K", label: "Monthly PPC Revenue" }
    ],
    overview: "A digital agency brought us a leading multispeciality hospital running unstructured campaigns with no reliable conversion tracking. We fixed the tracking, rebuilt the funnel, and refocused spend on what actually converted. The result: 7x ROAS and $255K in monthly PPC revenue, delivered entirely behind the scenes, under the agency's own brand.",
    services: ["Conversion Tracking Setup", "PPC Funnel Rebuild", "Targeted Ad Spend Optimization"]
  }
];
