import { Metadata } from 'next';
import { PropertyTypeEnum } from './constants';

type SeoConfig = {
    title: string;
    description: string;
    keywords?: string[];
    image?: string;
    url: string;
    type?: 'website' | 'article' | 'property';
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
    author?: string;
    siteName?: string;
    locale?: string;
};

export function generateSeoMetadata(config: SeoConfig): Metadata {
    const {
        title,
        description,
        keywords = [],
        image = '/images/og-default.jpg',
        url,
        type = 'website',
        publishedTime,
        modifiedTime,
        section,
        tags = [],
        author = 'Dweltin',
        siteName = 'Dweltin – Real Estate Platform',
        locale = 'en_US',
    } = config;

    const fullTitle = title.includes('Dweltin') ? title : `${title} | Dweltin`;
    const fullUrl = url.startsWith('http') ? url : `https://www.dweltin.com${url.startsWith('/') ? '' : '/'}${url}`;
    const imageUrl = image.startsWith('http') ? image : `https://www.dweltin.com${image.startsWith('/') ? '' : '/'}${image}`;

    const metadata: Metadata = {
        title: fullTitle,
        description,
        keywords: [...new Set([...keywords, 'real estate', 'property rental', 'apartments for rent', 'homes for rent', ...Object.values(PropertyTypeEnum)])],
        authors: [{ name: author }],
        creator: author,
        publisher: siteName,
        metadataBase: new URL('https://www.dweltin.com'),
        alternates: {
            canonical: fullUrl,
        },
        openGraph: {
            type: 'website',
            locale,
            url: fullUrl,
            title: fullTitle,
            description,
            siteName,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: fullTitle,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [imageUrl],
            creator: '@dweltin',
            site: '@dweltin',
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        // verification: {
        //   google: 'YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE',
        //   yandex: 'YANDEX_VERIFICATION_CODE',
        // },
        other: {
            'application-name': siteName,
            'msapplication-TileColor': '#ffffff',
            'theme-color': '#ffffff',
            'mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-title': siteName,
            'apple-mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-status-bar-style': 'default',
        },
    };

    return metadata;
}

export function generatePropertyStructuredData(property: {
    name: string;
    description: string;
    image: string;
    url: string;
    price: string;
    priceCurrency: string;
    address: {
        streetAddress: string;
        addressLocality: string;
        addressRegion: string;
        postalCode: string;
        addressCountry: string;
    };
    geo?: {
        latitude: number;
        longitude: number;
    };
    numberOfRooms?: number;
    floorSize?: string;
    propertyType: string;
    yearBuilt?: number;
    amenities?: string[];
    availableFrom?: string;
}) {
    const {
        name,
        description,
        image,
        url,
        price,
        priceCurrency = 'USD',
        address,
        geo,
        numberOfRooms,
        floorSize,
        propertyType,
        yearBuilt,
        amenities = [],
        availableFrom,
    } = property;

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        description,
        image,
        url,
        offers: {
            '@type': 'Offer',
            price,
            priceCurrency,
            availability: 'https://schema.org/InStock',
            url,
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            availabilityStarts: availableFrom || new Date().toISOString().split('T')[0],
        },
        brand: {
            '@type': 'Brand',
            name: 'Dweltin',
        },
        ...(address && {
            address: {
                '@type': 'PostalAddress',
                ...address,
            },
        }),
        ...(geo && {
            geo: {
                '@type': 'GeoCoordinates',
                ...geo,
            },
        }),
        additionalProperty: [
            ...(numberOfRooms ? [{
                '@type': 'PropertyValue',
                name: 'numberOfRooms',
                value: numberOfRooms.toString(),
            }] : []),
            ...(floorSize ? [{
                '@type': 'PropertyValue',
                name: 'floorSize',
                value: floorSize,
            }] : []),
            ...(propertyType ? [{
                '@type': 'PropertyValue',
                name: 'propertyType',
                value: propertyType,
            }] : []),
            ...(yearBuilt ? [{
                '@type': 'PropertyValue',
                name: 'yearBuilt',
                value: yearBuilt.toString(),
            }] : []),
        ],
        ...(amenities.length > 0 && {
            amenityFeature: amenities.map(amenity => ({
                '@type': 'LocationFeatureSpecification',
                name: amenity,
            })),
        }),
    };

    return JSON.stringify(structuredData);
}

export function generateBreadcrumbStructuredData(pages: Array<{ name: string; url: string }>) {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: pages.map((page, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: page.name,
            item: page.url.startsWith('http') ? page.url : `https://www.dweltin.com${page.url.startsWith('/') ? '' : '/'}${page.url}`,
        })),
    };

    return JSON.stringify(structuredData);
}

export function generateWebsiteStructuredData() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Dweltin',
        url: 'https://www.dweltin.com',
        potentialAction: {
            '@type': 'SearchAction',
            target: 'https://www.dweltin.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
        },
    };

    return JSON.stringify(structuredData);
}

export function generateLocalBusinessStructuredData() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        name: 'Dweltin',
        image: 'https://www.dweltin.com/images/logo.png',
        '@id': 'https://www.dweltin.com',
        url: 'https://www.dweltin.com',
        telephone: '+1-XXX-XXX-XXXX',
        address: {
            '@type': 'PostalAddress',
            streetAddress: '123 Main St',
            addressLocality: 'San Francisco',
            addressRegion: 'CA',
            postalCode: '94105',
            addressCountry: 'US',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 37.7749,
            longitude: -122.4194,
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
            ],
            opens: '09:00',
            closes: '18:00',
        },
        sameAs: [
            'https://www.facebook.com/dweltin',
            'https://www.twitter.com/dweltin',
            'https://www.instagram.com/dweltin',
            'https://www.linkedin.com/company/dweltin',
        ],
    };

    return JSON.stringify(structuredData);
}
