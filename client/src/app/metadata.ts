import { Metadata } from 'next';

const siteUrl = 'https://www.dweltin.com';
const siteName = 'DWELTIN – Real Estate Platform for Smarter, Happier Living';
const description = 'Dweltin is a premium real estate rental platform connecting tenants with verified properties. Find your perfect home, apartment, or commercial space with our AI-powered property search.';
const keywords = [
  'real estate', 'property rental', 'apartments for rent', 'homes for rent',
  'commercial property', 'premium rentals', 'verified properties', 'house hunting',
  'rental platform', 'luxury apartments', 'co-living spaces', 'office space',
  'warehouse rental', 'retail space', 'property management', 'find home'
];

const propertyTypes = [
  'Apartment', 'Villa', 'Townhouse', 'Cottage', 'Studio', 'Loft', 'Condo',
  'Bungalow', 'Cabin', 'Chalet', 'Farmhouse', 'Houseboat', 'RV', 'Camper',
  'MobileHome', 'Duplex', 'Triplex', 'Penthouse', 'Mansion', 'Castle',
  'SharedHouse', 'CoLiving', 'StudentHousing', 'SeniorHousing',
  'ServicedApartment', 'BoutiqueHotel', 'OfficeSpace', 'CoworkingSpace',
  'RetailStore', 'RestaurantSpace', 'Warehouse', 'MedicalOffice',
  'IndustrialFlex', 'DataCenter', 'ColdStorage', 'Showroom', 'GasStation',
  'SelfStorage', 'ParkingLot', 'Hotel', 'Billboard', 'CellTower',
  'AgriculturalLand', 'DarkKitchen', 'LabSpace', 'Cleanroom'
];

export const defaultMetadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: [...keywords, ...propertyTypes],
  authors: [{ name: 'Dweltin Team' }],
  creator: 'Dweltin',
  publisher: 'Dweltin',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: siteName,
    description,
    siteName,
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dweltin - Find Your Perfect Home',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description,
    images: ['/images/twitter-card.jpg'],
    creator: '@dweltin',
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
  verification: {
    google: 'YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE',
    yandex: 'YANDEX_VERIFICATION_CODE',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

// Helper function to generate metadata for property type pages
export const getPropertyTypeMetadata = (propertyType: string): Metadata => ({
  title: `${propertyType} for Rent | Dweltin`,
  description: `Find the best ${propertyType.toLowerCase()} for rent on Dweltin. Browse verified listings, compare prices, and find your perfect ${propertyType.toLowerCase()} today.`,
  openGraph: {
    title: `${propertyType} for Rent | Dweltin`,
    description: `Find and rent the perfect ${propertyType.toLowerCase()} on Dweltin. Verified listings, transparent pricing, and easy booking process.`,
    url: `${siteUrl}/search?propertyType=${encodeURIComponent(propertyType)}`,
  },
});
