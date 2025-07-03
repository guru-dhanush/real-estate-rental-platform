import { MetadataRoute } from 'next';
import { PropertyTypeEnum } from '@/lib/constants';

const siteUrl = 'https://www.dweltin.com';
const currentDate = new Date();

// Core pages with specific priorities
const corePages = [
  { path: '', priority: 1.0, changeFreq: 'daily' },
  { path: 'search', priority: 0.9, changeFreq: 'hourly' },
  { path: 'about-us', priority: 0.8, changeFreq: 'weekly' },
  { path: 'contact', priority: 0.8, changeFreq: 'monthly' },
];

// Support pages with lower priority
const supportPages = [
  'privacy-policy',
  'terms-of-service',
  'faq',
  'blog',
  'agents',
  'pricing',
  'how-it-works',
];

// Property types with dynamic URL generation
const propertyTypes = Object.values(PropertyTypeEnum);

// Popular locations (you can expand this list)
const popularLocations = [
  'new-york',
  'los-angeles',
  'chicago',
  'houston',
  'phoenix',
  'philadelphia',
  'san-antonio',
  'san-diego',
  'dallas',
  'san-jose',
];

// Generate location-based property pages
function generateLocationPropertyPages() {
  const pages: MetadataRoute.Sitemap = [];
  
  popularLocations.forEach(location => {
    propertyTypes.forEach(type => {
      pages.push({
        url: `${siteUrl}/${location}/search?propertyType=${encodeURIComponent(type)}`,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 0.85,
      });
    });
  });
  
  return pages;
}

// Generate property type pages with location variations
function generatePropertyTypePages() {
  const pages: MetadataRoute.Sitemap = [];
  
  propertyTypes.forEach(type => {
    // Main property type page
    pages.push({
      url: `${siteUrl}/search?propertyType=${encodeURIComponent(type)}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    });
    
    // Location-based variations
    popularLocations.forEach(location => {
      pages.push({
        url: `${siteUrl}/${location}/search?propertyType=${encodeURIComponent(type)}`,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 0.85,
      });
    });
  });
  
  return pages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Core pages
  const staticPages = corePages.map(page => ({
    url: page.path ? `${siteUrl}/${page.path}` : siteUrl,
    lastModified: currentDate,
    changeFrequency: page.changeFreq as 'daily' | 'hourly' | 'weekly' | 'monthly',
    priority: page.priority,
  }));

  // Support pages
  const supportPagesList = supportPages.map(path => ({
    url: `${siteUrl}/${path}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // Location pages
  const locationPages = popularLocations.map(location => ({
    url: `${siteUrl}/${location}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));

  // Combine all sitemap entries
  return [
    ...staticPages,
    ...supportPagesList,
    ...locationPages,
    ...generatePropertyTypePages(),
    ...generateLocationPropertyPages(),
  ];
}

// Generate sitemap index for large sites (uncomment if needed)
// export function GET() {
//   // This would be used for large sites with multiple sitemaps
//   return new Response(
//     `<?xml version="1.0" encoding="UTF-8"?>
//     <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//       <sitemap>
//         <loc>${siteUrl}/sitemap-pages.xml</loc>
//         <lastmod>${currentDate.toISOString()}</lastmod>
//       </sitemap>
//       <sitemap>
//         <loc>${siteUrl}/sitemap-properties.xml</loc>
//         <lastmod>${currentDate.toISOString()}</lastmod>
//       </sitemap>
//     </sitemapindex>`,
//     {
//       headers: {
//         'Content-Type': 'application/xml',
//       },
//     }
//   );
// }
