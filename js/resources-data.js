/**
 * resources-data.js - Central Data Store for CREWiiFY Free Resources
 * 
 * Modular architecture allows seamless addition, removal, or replacement of resources.
 * Adding resources with new categories will automatically expose them in the filter rail.
 */

export const resourcesData = [
  {
    id: 'seo-growth-playbook',
    title: 'SEO Growth Playbook',
    category: 'SEO',
    type: 'Playbook',
    badge: 'PLAYBOOK',
    isFeatured: true,
    description: 'A practical framework covering the fundamentals of SEO, from technical foundations and on-page optimization to local visibility, content architecture and measurement.',
    file: 'resources/seo-growth-playbook.pdf',
    ctaText: 'Download Playbook',
    meta: 'PDF Guide • Practical Framework'
  },
  {
    id: 'local-seo-checklist',
    title: 'Local SEO Checklist',
    category: 'SEO',
    type: 'Checklist',
    badge: 'CHECKLIST',
    isFeatured: false,
    description: 'A practical checklist for improving local search visibility, Google Business Profile presence and location-based search performance.',
    file: 'resources/local-seo-checklist.pdf',
    ctaText: 'Download Checklist',
    meta: 'Actionable Checklist • Local Search'
  },
  {
    id: 'ppc-campaign-checklist',
    title: 'PPC Campaign Launch Checklist',
    category: 'PPC',
    type: 'Checklist',
    badge: 'CHECKLIST',
    isFeatured: false,
    description: 'A practical checklist covering campaign structure, targeting, tracking, landing pages and the essentials to review before launching a PPC campaign.',
    file: 'resources/ppc-campaign-launch-checklist.pdf',
    ctaText: 'Download Checklist',
    meta: 'Launch & QA • Google Ads / PPC'
  }
];
