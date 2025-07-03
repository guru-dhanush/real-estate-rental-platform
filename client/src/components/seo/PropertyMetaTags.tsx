'use client';

import Head from 'next/head';
import { usePathname, useSearchParams } from 'next/navigation';
import { generatePropertyStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo-utils';
import { PropertyTypeEnum } from '@/lib/constants';

interface PropertyMetaTagsProps {
  property: {
    id: string;
    title: string;
    description: string;
    price: number;
    priceCurrency?: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      latitude?: number;
      longitude?: number;
    };
    images: string[];
    amenities: string[];
    availableFrom?: string;
    yearBuilt?: number;
    floorSize?: string;
  };
  userLocation?: {
    city: string;
    state: string;
    country: string;
  };
}

export function PropertyMetaTags({ property, userLocation }: PropertyMetaTagsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  const fullAddress = `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.postalCode}, ${property.address.country}`;
  
  // Generate structured data
  const propertyStructuredData = generatePropertyStructuredData({
    name: property.title,
    description: property.description,
    image: property.images[0] || '/images/property-placeholder.jpg',
    url: currentUrl,
    price: property.price.toString(),
    priceCurrency: property.priceCurrency || 'USD',
    address: {
      streetAddress: property.address.street,
      addressLocality: property.address.city,
      addressRegion: property.address.state,
      postalCode: property.address.postalCode,
      addressCountry: property.address.country,
    },
    ...(property.address.latitude && property.address.longitude ? {
      geo: {
        latitude: property.address.latitude,
        longitude: property.address.longitude,
      },
    } : {}),
    numberOfRooms: property.bedrooms,
    floorSize: property.floorSize || `${property.area} sqft`,
    propertyType: property.propertyType,
    yearBuilt: property.yearBuilt,
    amenities: property.amenities,
    availableFrom: property.availableFrom,
  });

  // Generate breadcrumb structured data
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { 
      name: `${property.address.city} ${PropertyTypeEnum[property.propertyType as keyof typeof PropertyTypeEnum] || 'Properties'}`, 
      url: `/search?location=${encodeURIComponent(property.address.city)}&propertyType=${encodeURIComponent(property.propertyType)}` 
    },
    { name: property.title, url: currentUrl },
  ]);

  // Generate meta description
  const metaDescription = `${property.title} - ${property.bedrooms} bed, ${property.bathrooms} bath ${PropertyTypeEnum[property.propertyType as keyof typeof PropertyTypeEnum] || 'property'} in ${property.address.city}, ${property.address.state}. ${property.description.substring(0, 155)}...`;

  // Generate canonical URL
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/property/${property.id}`;

  return (
    <Head>
      <title>{`${property.title} | ${property.address.city}, ${property.address.state} | Dweltin`}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={`${property.title}, ${property.propertyType} for rent, ${property.address.city} real estate, ${property.bedrooms} bedroom ${property.propertyType}, ${property.address.city} rental properties`} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="property" />
      <meta property="og:title" content={`${property.title} | Dweltin`} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="Dweltin" />
      {property.images.length > 0 && (
        <meta property="og:image" content={property.images[0]} />
      )}
      <meta property="og:locale" content="en_US" />
      <meta property="og:price:amount" content={property.price.toString()} />
      <meta property="og:price:currency" content={property.priceCurrency || 'USD'} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${property.title} | Dweltin`} />
      <meta name="twitter:description" content={metaDescription} />
      {property.images.length > 0 && (
        <meta name="twitter:image" content={property.images[0]} />
      )}
      <meta name="twitter:site" content="@dweltin" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: propertyStructuredData }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbStructuredData }}
      />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="geo.region" content={`${property.address.country}-${property.address.state}`} />
      <meta name="geo.placename" content={`${property.address.city}, ${property.address.state}`} />
      <meta name="ICBM" content={`${property.address.latitude}, ${property.address.longitude}`} />
      
      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
    </Head>
  );
}
