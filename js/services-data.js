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
        name: "Starter Growth",
        tagline: "Ideal for emerging brands and local businesses establishing organic visibility.",
        price: "$199",
        period: "/ month",
        isPopular: false,
        badge: "Essential",
        ctaText: "Get Started →",
        ctaLink: "contact.html",
        features: [
          "Up to 20 Target Keywords",
          "Comprehensive Technical SEO Audit",
          "On-Page Optimization (10 Pages)",
          "Google Search Console & GA4 Setup",
          "Monthly Performance & Ranking Report",
          "Core Web Vitals Optimization"
        ]
      },
      {
        id: "seo-growth",
        tier: "02 / Growth",
        name: "Scale Accelerator",
        tagline: "Designed for competitive industries seeking aggressive organic traffic acquisition.",
        price: "$349",
        period: "/ month",
        isPopular: true,
        badge: "Most Popular",
        ctaText: "Get Started →",
        ctaLink: "contact.html",
        features: [
          "Up to 50 Target Keywords",
          "Advanced Technical & Schema SEO",
          "On-Page Optimization (25 Pages)",
          "Content Strategy & 4 Authority Blogs / mo",
          "High-Authority Backlink Acquisition",
          "Competitor Keyword Gap Analysis",
          "Bi-Weekly Strategy & Reporting Calls",
          "Dedicated SEO Account Manager"
        ]
      },
      {
        id: "seo-enterprise",
        tier: "03 / Enterprise",
        name: "Market Dominator",
        tagline: "Tailored for large organizations, multi-location brands, and e-commerce giants.",
        price: "$599",
        period: "/ month",
        isPopular: false,
        badge: "Enterprise",
        ctaText: "Get Started →",
        ctaLink: "contact.html",
        features: [
          "Unlimited / 100+ Target Keywords",
          "Enterprise Programmatic SEO Architecture",
          "Full Site Optimization & Custom Hubs",
          "8 Authority Content Assets / mo",
          "Tier-1 Digital PR & Authority Links",
          "International / Multi-Location Setup",
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
        id: "web-starter",
        tier: "01 / Basic",
        name: "Standard Web Presence",
        tagline: "Clean, responsive landing page or brochure site built for immediate credibility.",
        price: "$395",
        period: "/ project",
        isPopular: false,
        badge: "Starter",
        ctaText: "Start Building →",
        ctaLink: "contact.html",
        features: [
          "Custom 5-Page Responsive Website",
          "Mobile-First Clean Codebase",
          "SEO-Ready Architecture & Schema",
          "Contact & Lead Capture Forms",
          "Sub-1.2s Load Speed Optimization",
          "30 Days Post-Launch Support"
        ]
      },
      {
        id: "web-growth",
        tier: "02 / Growth",
        name: "Performance Platform",
        tagline: "High-converting bespoke website or web app designed for scaling brands.",
        price: "$495",
        period: "/ project",
        isPopular: true,
        badge: "Most Popular",
        ctaText: "Start Building →",
        ctaLink: "contact.html",
        features: [
          "Custom 10–15 Page Bespoke Architecture",
          "CMS Integration (WordPress / Next.js / Headless)",
          "Advanced Interactive UI Animations",
          "E-Commerce / Custom Checkout Flow",
          "Sub-0.8s Global CDN Optimization",
          "CRM & Third-Party API Integrations",
          "60 Days Dedicated Support & Training",
          "Conversion Rate Optimized UX"
        ]
      },
      {
        id: "web-enterprise",
        tier: "03 / Enterprise",
        name: "Custom Web Application",
        tagline: "Full-scale custom SaaS platform, portals, or complex headless ecosystems.",
        price: "$799",
        period: "/ project",
        isPopular: false,
        badge: "Enterprise",
        ctaText: "Get Started →",
        ctaLink: "contact.html",
        features: [
          "Fully Custom Web Application / SaaS",
          "Full-Stack Database & Authentication",
          "Scalable Microservices Architecture",
          "Complex Multi-Role User Workflows",
          "Payment Gateway & Webhook Pipelines",
          "Automated Testing & CI/CD Deployment",
          "90 Days Dedicated Engineering Retainer",
          "SLA & Infrastructure Maintenance"
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
        id: "ppc-starter",
        tier: "01 / Basic",
        name: "Campaign Launch",
        tagline: "Optimized paid ad management for single-channel lead generation or sales.",
        price: "$245",
        period: "/ month",
        isPopular: false,
        badge: "Starter",
        ctaText: "Launch Campaigns →",
        ctaLink: "contact.html",
        features: [
          "Google Ads OR Meta Ads Management",
          "Up to $5,000 Monthly Ad Spend Scope",
          "Audience & Keyword Research",
          "Ad Copywriting & Static Creatives",
          "Conversion Tracking & Pixel Setup",
          "Bi-Weekly Optimization & Monthly Report"
        ]
      },
      {
        id: "ppc-growth",
        tier: "02 / Growth",
        name: "Omnichannel Scale",
        tagline: "Multi-channel advertising engine built to maximize return on ad spend.",
        price: "$399",
        period: "/ month",
        isPopular: true,
        badge: "Most Popular",
        ctaText: "Launch Campaigns →",
        ctaLink: "contact.html",
        features: [
          "Google Search, Performance Max & Meta Ads",
          "Up to $15,000 Monthly Ad Spend Scope",
          "Full Funnel Retargeting & Lookalikes",
          "High-Converting Landing Page Reviews",
          "Custom Motion & Video Ad Creatives",
          "A/B Split Testing (Copy & Visuals)",
          "Weekly Optimization & Strategy Calls",
          "Real-Time Client Dashboard Access"
        ]
      },
      {
        id: "ppc-enterprise",
        tier: "03 / Enterprise",
        name: "Performance Dominance",
        tagline: "High-volume media buying, omnichannel attribution, and aggressive scaling.",
        price: "$599",
        period: "/ month",
        isPopular: false,
        badge: "Enterprise",
        ctaText: "Launch Campaigns →",
        ctaLink: "contact.html",
        features: [
          "Omnichannel (Google, Meta, LinkedIn, YouTube)",
          "Unlimited Ad Spend Management",
          "Advanced Offline & CRM Conversion Tracking",
          "Custom High-Converting Landing Page Builds",
          "Continuous Creative Iteration Pipeline",
          "Competitor Bidding & Defense Tactics",
          "Dedicated Senior Media Buyer",
          "Daily Pacing & Real-Time Slack Support"
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
        ctaLink: "contact.html",
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
        ctaLink: "contact.html",
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
        ctaLink: "contact.html",
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
