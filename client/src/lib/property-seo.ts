import { generateSeoMetadata } from './seo-utils';
import { PropertyTypeEnum } from './constants';

const propertyTypeKeywords: Record<string, string[]> = {
  [PropertyTypeEnum.Rooms]: ['room for rent', 'shared room', 'private room', 'roommate finder', 'affordable room'],
  [PropertyTypeEnum.Apartment]: ['apartment for rent', 'luxury apartment', 'studio apartment', '1 bedroom apartment', 'pet friendly apartment'],
  [PropertyTypeEnum.Villa]: ['luxury villa', 'villa for rent', 'beachfront villa', 'private villa', 'vacation villa'],
  [PropertyTypeEnum.Townhouse]: ['townhouse for rent', 'townhome', 'townhouse community', 'modern townhouse', 'family townhouse'],
  [PropertyTypeEnum.Studio]: ['studio apartment', 'efficiency apartment', 'small apartment', 'bachelor apartment', 'studio flat'],
  [PropertyTypeEnum.Loft]: ['loft apartment', 'industrial loft', 'open concept loft', 'downtown loft', 'modern loft'],
  [PropertyTypeEnum.Condo]: ['condo for rent', 'luxury condo', 'downtown condo', 'waterfront condo', 'high-rise condo'],
  [PropertyTypeEnum.CoLiving]: ['coliving space', 'shared living', 'coliving community', 'furnished rooms', 'all-inclusive living'],
  [PropertyTypeEnum.OfficeSpace]: ['office space for rent', 'coworking space', 'private office', 'commercial real estate', 'business space'],
  [PropertyTypeEnum.RetailStore]: ['retail space for rent', 'storefront', 'retail shop', 'commercial space', 'high street retail'],
  [PropertyTypeEnum.Warehouse]: ['warehouse space', 'industrial space', 'storage facility', 'distribution center', 'logistics property'],
  [PropertyTypeEnum.Hotel]: ['hotel rooms', 'boutique hotel', 'luxury hotel', 'extended stay', 'resort accommodation'],
};

const locationKeywords = [
  'downtown', 'uptown', 'suburban', 'urban', 'rural', 'waterfront', 
  'city center', 'business district', 'residential area', 'gated community'
];

const propertyFeatures = [
  'furnished', 'unfurnished', 'pet friendly', 'utilities included', 'parking available',
  'in-unit laundry', 'gym access', 'swimming pool', 'doorman', 'elevator', 'balcony',
  'hardwood floors', 'central AC', 'fireplace', 'walk-in closet', 'renovated', 'modern',
  'luxury', 'affordable', 'spacious', 'cozy', 'quiet', 'bright', 'sunny', 'private'
];

export function generatePropertySeoMetadata(
  propertyType: string,
  location: string,
  price: string,
  bedrooms: number,
  bathrooms: number,
  area: string,
  amenities: string[] = [],
  images: string[] = []
) {
  // Format location for display
  const formattedLocation = location
    .split(',')
    .map(part => part.trim())
    .join(', ');

  // Create title and description templates based on property type
  const propertyTypeName = propertyType.replace(/([A-Z])/g, ' $1').trim();
  
  // Generate a dynamic title
  const title = `${propertyTypeName} for Rent in ${formattedLocation} | ${price}/month`;
  
  // Generate a detailed description
  const description = `Find your perfect ${propertyTypeName.toLowerCase()} in ${formattedLocation}. ${bedrooms} bed, ${bathrooms} bath, ${area} sqft. ${amenities.length > 0 ? `Amenities include: ${amenities.slice(0, 5).join(', ')}. ` : ''}View photos, virtual tours & contact the property manager today!`;
  
  // Generate keywords
  const baseKeywords = [
    `${propertyTypeName} for rent`,
    `${propertyTypeName.toLowerCase()} in ${formattedLocation.split(',')[0]}`,
    `rent ${propertyTypeName.toLowerCase()}`,
    `${formattedLocation} ${propertyTypeName.toLowerCase()} for rent`,
  ];
  
  const typeSpecificKeywords = propertyTypeKeywords[propertyType] || [];
  const featureKeywords = amenities
    .filter(amenity => propertyFeatures.includes(amenity.toLowerCase()))
    .map(amenity => `${amenity} ${propertyTypeName.toLowerCase()}`);
  
  const allKeywords = [
    ...new Set([
      ...baseKeywords,
      ...typeSpecificKeywords,
      ...featureKeywords,
      'real estate',
      'property for rent',
      'apartments for rent',
      'homes for rent',
      'rental properties',
      'find a place to rent',
      'affordable housing',
      'luxury rentals',
      'pet friendly rentals',
      'furnished apartments',
      'short term rentals',
      'long term rentals',
    ])
  ];

  // Generate OpenGraph and Twitter card data
  const imageUrl = images.length > 0 ? images[0] : '/images/property-placeholder.jpg';
  const url = `/search?propertyType=${encodeURIComponent(propertyType)}&location=${encodeURIComponent(location)}`;

  return generateSeoMetadata({
    title,
    description,
    keywords: allKeywords,
    image: imageUrl,
    url,
    type: 'website',
  });
}

export function generatePropertyTypeSeoMetadata(propertyType: string) {
  const propertyTypeName = propertyType.replace(/([A-Z])/g, ' $1').trim();
  const title = `${propertyTypeName}s for Rent | Find Your Perfect ${propertyTypeName} | Dweltin`;
  const description = `Browse our selection of ${propertyTypeName.toLowerCase()}s for rent. Find your perfect ${propertyTypeName.toLowerCase()} with detailed listings, photos, and virtual tours.`;
  
  return generateSeoMetadata({
    title,
    description,
    keywords: [
      `${propertyTypeName} for rent`,
      `rent ${propertyTypeName.toLowerCase()}`,
      `find ${propertyTypeName.toLowerCase()}`,
      `${propertyTypeName} listings`,
      `best ${propertyTypeName.toLowerCase()}s`,
      'real estate',
      'property for rent',
      'apartments for rent',
      'homes for rent',
      'rental properties',
    ],
    url: `/search?propertyType=${encodeURIComponent(propertyType)}`,
    type: 'website',
  });
}

export function generateLocationSeoMetadata(location: string) {
  const title = `Homes for Rent in ${location} | Dweltin`;
  const description = `Find your perfect home in ${location}. Browse houses, apartments, and condos for rent with detailed listings, photos, and virtual tours.`;
  
  return generateSeoMetadata({
    title,
    description,
    keywords: [
      `homes for rent in ${location}`,
      `apartments in ${location}`,
      `rental properties in ${location}`,
      `houses for rent in ${location}`,
      `condos for rent in ${location}`,
      'real estate',
      'property for rent',
      'apartments for rent',
      'homes for rent',
      'rental properties',
    ],
    url: `/search?location=${encodeURIComponent(location)}`,
    type: 'website',
  });
}
