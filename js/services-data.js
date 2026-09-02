// services-data.js - Reusable Services & Pricing Packages Data Configuration for CREWiiFY

export const servicesData = {
  seo: {
    id: "seo",
    number: "01",
    name: "SEO",
    title: "SEO solutions",
    cardDescription: "Improve rankings and drive sustainable organic growth.",
    badgeText: "Organic Growth",
    packageSubheading: "Scalable search strategies designed to dominate high-intent keywords and build sustainable authority.",
    packages: [
      {
        id: "seo-starter",
        tier: "01 / Basic",
        name: "SEO Starter",
        tagline: "On-page optimization, 4 content pieces, and 8 backlinks per month.",
        price: "$395",
        period: "/ month",
        isPopular: false,
        badge: "Essential",
        ctaText: "Get Started →",
        ctaLink: "/contact",
        features: [
          "On-Page Optimization",
          "4 Content Pieces / mo",
          "8 Quality Backlinks / mo",
          "Technical SEO Audit & Setup",
          "Google Search Console & GA4 Setup",
          "Monthly Performance & Ranking Report"
        ]
      },
      {
        id: "seo-growth",
        tier: "02 / Growth",
        name: "SEO Growth",
        tagline: "On-page optimization, 8 content pieces, 15 backlinks, and technical SEO per month.",
        price: "$695",
        period: "/ month",
        isPopular: true,
        badge: "Most Popular",
        ctaText: "Get Started →",
        ctaLink: "/contact",
        features: [
          "On-Page Optimization",
          "8 Content Pieces / mo",
          "15 Quality Backlinks / mo",
          "Advanced Technical SEO & Schema",
          "Competitor Keyword Gap Analysis",
          "Monthly Performance & Ranking Report",
          "Dedicated SEO Account Manager"
        ]
      },
      {
        id: "seo-scale",
        tier: "03 / Scale",
        name: "SEO Scale",
        tagline: "Full technical SEO, 12 content pieces, and 25 backlinks per month.",
        price: "$999",
        period: "/ month",
        isPopular: false,
        badge: "Enterprise",
        ctaText: "Get Started →",
        ctaLink: "/contact",
        features: [
          "Full Technical SEO & Architecture",
          "12 Content Pieces / mo",
          "25 High-Authority Backlinks / mo",
          "On-Page Optimization & Content Hubs",
          "Tier-1 Digital PR & Authority Links",
          "Real-Time Analytics & Custom Dashboard",
          "24/7 Priority Support & Weekly Sprints"
        ]
      }
    ]
  },
  "web-development": {
    id: "web-development",
    number: "02",
    name: "Web Development",
    title: "Web Development solutions",
    cardDescription: "Custom websites and web apps built for performance and scale.",
    badgeText: "Engineering",
    packageSubheading: "Modern web architecture crafted with speed, conversion, and scalability at its core.",
    packages: [
      {
        id: "landing-page",
        tier: "01 / Basic",
        name: "Landing Page",
        tagline: "Single high-converting page, responsive, and on-brand.",
        price: "$200",
        period: "/ project",
        isPopular: false,
        badge: "Starter",
        ctaText: "Start Building →",
        ctaLink: "/contact",
        features: [
          "Single High-Converting Page Build",
          "Responsive & Mobile-Optimized Design",
          "On-Brand Custom Visual Styling",
          "Lead Capture & Contact Form Setup",
          "Fast Loading Speed Optimization",
          "QA Tested & Launch-Ready"
        ]
      },
      {
        id: "business-website",
        tier: "02 / Growth",
        name: "Business Website (5 pages)",
        tagline: "Design + build, CMS, mobile-optimized (WordPress based).",
        price: "$395",
        period: "/ project",
        isPopular: true,
        badge: "Most Popular",
        ctaText: "Start Building →",
        ctaLink: "/contact",
        features: [
          "Up to 5 Custom-Designed Pages",
          "Design + Build with CMS Integration",
          "WordPress-Based Architecture",
          "Mobile-First Responsive Layout",
          "SEO-Ready Structure & Schema",
          "Contact & Lead Capture Setup",
          "30 Days Post-Launch Support"
        ]
      },
      {
        id: "premium-ecommerce",
        tier: "03 / Premium",
        name: "Premium / E-commerce",
        tagline: "Custom design, store setup, and advanced integrations.",
        price: "$899",
        period: "/ project",
        isPopular: false,
        badge: "Custom",
        ctaText: "Start Building →",
        ctaLink: "/contact",
        features: [
          "Custom Bespoke Design & Build",
          "Full E-Commerce & Store Setup",
          "Payment Gateway & Webhook Integrations",
          "Product Catalog & Category Configuration",
          "Third-Party API & Tool Integrations",
          "High-Performance Speed Optimization",
          "60 Days Dedicated Launch Support"
        ]
      }
    ]
  },
  ppc: {
    id: "ppc",
    number: "03",
    name: "PPC Management & Growth",
    title: "PPC Management & Growth",
    cardDescription: "High-converting paid campaigns that generate quality leads and sales.",
    badgeText: "Performance Ads",
    packageSubheading: "Data-backed paid media funnels engineered for maximized ROAS and rapid pipeline generation.",
    packages: [
      {
        id: "google-ads",
        tier: "01 / Google Ads",
        name: "Google Ads Management",
        tagline: "Setup, continuous optimization, and reporting per month (excludes ad spend).",
        price: "$300",
        period: "/ month",
        isPopular: false,
        badge: "Search & PMax",
        ctaText: "Launch Campaigns →",
        ctaLink: "/contact",
        features: [
          "Google Search & Performance Max Setup",
          "Comprehensive Keyword & Competitor Research",
          "Ad Copywriting & Asset Extensions",
          "Conversion Tracking & GA4 Setup",
          "Continuous Campaign Optimization",
          "Monthly Performance Reporting",
          "Excludes Ad Spend"
        ]
      },
      {
        id: "meta-ads",
        tier: "02 / Meta Ads",
        name: "Meta Ads Management",
        tagline: "Campaign build, creative direction, and reporting per month (excludes ad spend).",
        price: "$300",
        period: "/ month",
        isPopular: false,
        badge: "Social Ads",
        ctaText: "Launch Campaigns →",
        ctaLink: "/contact",
        features: [
          "Campaign Build (Facebook & Instagram)",
          "Audience Targeting & Lookalikes",
          "Creative Direction & Ad Copywriting",
          "Pixel & Conversion API Tracking",
          "Continuous Optimization & A/B Testing",
          "Monthly Performance Reporting",
          "Excludes Ad Spend"
        ]
      },
      {
        id: "full-paid-stack",
        tier: "03 / Growth Stack",
        name: "Full Paid Stack",
        tagline: "Google and Meta managed together for full-funnel paid media scale (excludes ad spend).",
        price: "$500",
        period: "/ month",
        isPopular: true,
        badge: "Most Popular",
        ctaText: "Launch Campaigns →",
        ctaLink: "/contact",
        features: [
          "Google Ads + Meta Ads Managed Together",
          "Full-Funnel Acquisition & Retargeting",
          "Cross-Platform Conversion Tracking",
          "Continuous Creative Direction & Copy",
          "Weekly Optimization & Budget Pacing",
          "Unified Monthly Reporting & Strategy",
          "Excludes Ad Spend"
        ]
      }
    ]
  },
  whatsapp: {
    id: "whatsapp",
    number: "04",
    name: "WhatsApp Automation",
    title: "WhatsApp Automation",
    cardDescription: "Automate chats, follow-ups and workflows to boost engagement and sales.",
    badgeText: "Automation",
    packageSubheading: "Automated conversational funnels that engage leads instantly and drive effortless conversions.",
    packages: [
      {
        id: "wa-starter",
        tier: "01 / Basic",
        name: "Smart Broadcast & Chat",
        tagline: "Essential WhatsApp Business API setup and automated customer greeting flows.",
        price: "$199",
        period: "/ month",
        isPopular: false,
        badge: "Essential",
        ctaText: "Get Started →",
        ctaLink: "/contact",
        features: [
          "Official WhatsApp Business API Setup",
          "Green Tick Verification Assistance",
          "Welcome & Out-of-Office Auto-Replies",
          "Up to 5 Automated Keyword Triggers",
          "Broadcast Campaign Management",
          "Basic Lead Capture & Tagging"
        ]
      },
      {
        id: "wa-growth",
        tier: "02 / Growth",
        name: "Conversational Flow Engine",
        tagline: "Interactive chatbot workflows, CRM integrations, and abandoned cart recoveries.",
        price: "$299",
        period: "/ month",
        isPopular: true,
        badge: "Most Popular",
        ctaText: "Get Started →",
        ctaLink: "/contact",
        features: [
          "Interactive Multi-Step Chatbot Workflows",
          "E-Commerce Cart Recovery & Order Updates",
          "CRM Integration (HubSpot, Zoho, LeadSquared)",
          "Automated Drip Follow-Up Sequences",
          "Payment Gateway Integration within WhatsApp",
          "Shared Multi-Agent Team Inbox",
          "Detailed Conversation & Funnel Analytics",
          "Monthly Flow Optimization Support"
        ]
      },
      {
        id: "wa-enterprise",
        tier: "03 / Enterprise",
        name: "Enterprise AI Bot & Systems",
        tagline: "Full AI conversational agent with custom ERP sync and bespoke business logic.",
        price: "$499",
        period: "/ month",
        isPopular: false,
        badge: "Enterprise",
        ctaText: "Get Started →",
        ctaLink: "/contact",
        features: [
          "Custom ChatGPT / Claude AI Agent Integration",
          "Complex Two-Way API & Database Sync",
          "Multi-Department Ticket Routing & Escalations",
          "Automated Appointment Booking & Reminders",
          "Custom Webhook Pipelines & Data Webhooks",
          "Unlimited Chatbot Flows & Campaigns",
          "Dedicated Automation Engineer",
          "24/7 System Health Monitoring & SLA"
        ]
      }
    ]
  }
};

// Global fallback for standard script tag usage
if (typeof window !== 'undefined') {
  window.servicesData = servicesData;
}
