-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Amenity" ADD VALUE 'Balcony';
ALTER TYPE "Amenity" ADD VALUE 'Garden';
ALTER TYPE "Amenity" ADD VALUE 'Terrace';
ALTER TYPE "Amenity" ADD VALUE 'Fireplace';
ALTER TYPE "Amenity" ADD VALUE 'Elevator';
ALTER TYPE "Amenity" ADD VALUE 'Doorman';
ALTER TYPE "Amenity" ADD VALUE 'SecuritySystem';
ALTER TYPE "Amenity" ADD VALUE 'SmartHome';
ALTER TYPE "Amenity" ADD VALUE 'Furnished';
ALTER TYPE "Amenity" ADD VALUE 'WheelchairAccess';
ALTER TYPE "Amenity" ADD VALUE 'BikeStorage';
ALTER TYPE "Amenity" ADD VALUE 'EVCharging';
ALTER TYPE "Amenity" ADD VALUE 'LaundryRoom';
ALTER TYPE "Amenity" ADD VALUE 'Storage';
ALTER TYPE "Amenity" ADD VALUE 'CentralHeating';
ALTER TYPE "Amenity" ADD VALUE 'SolarPanels';
ALTER TYPE "Amenity" ADD VALUE 'GreenSpace';
ALTER TYPE "Amenity" ADD VALUE 'Concierge';
ALTER TYPE "Amenity" ADD VALUE 'BreakfastIncluded';
ALTER TYPE "Amenity" ADD VALUE 'CleaningService';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Highlight" ADD VALUE 'Waterfront';
ALTER TYPE "Highlight" ADD VALUE 'MountainView';
ALTER TYPE "Highlight" ADD VALUE 'CityView';
ALTER TYPE "Highlight" ADD VALUE 'HistoricBuilding';
ALTER TYPE "Highlight" ADD VALUE 'NewConstruction';
ALTER TYPE "Highlight" ADD VALUE 'EnergyEfficient';
ALTER TYPE "Highlight" ADD VALUE 'SmartTechnology';
ALTER TYPE "Highlight" ADD VALUE 'PetFriendly';
ALTER TYPE "Highlight" ADD VALUE 'ChildFriendly';
ALTER TYPE "Highlight" ADD VALUE 'SeniorFriendly';
ALTER TYPE "Highlight" ADD VALUE 'LuxuryFinishes';
ALTER TYPE "Highlight" ADD VALUE 'OpenConcept';
ALTER TYPE "Highlight" ADD VALUE 'HighCeilings';
ALTER TYPE "Highlight" ADD VALUE 'NaturalLight';
ALTER TYPE "Highlight" ADD VALUE 'PrivateOutdoorSpace';
ALTER TYPE "Highlight" ADD VALUE 'WalkableArea';
ALTER TYPE "Highlight" ADD VALUE 'BikeFriendly';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PropertyType" ADD VALUE 'Loft';
ALTER TYPE "PropertyType" ADD VALUE 'Condo';
ALTER TYPE "PropertyType" ADD VALUE 'Bungalow';
ALTER TYPE "PropertyType" ADD VALUE 'Cabin';
ALTER TYPE "PropertyType" ADD VALUE 'Chalet';
ALTER TYPE "PropertyType" ADD VALUE 'Farmhouse';
ALTER TYPE "PropertyType" ADD VALUE 'Houseboat';
ALTER TYPE "PropertyType" ADD VALUE 'RV';
ALTER TYPE "PropertyType" ADD VALUE 'Camper';
ALTER TYPE "PropertyType" ADD VALUE 'MobileHome';
ALTER TYPE "PropertyType" ADD VALUE 'Duplex';
ALTER TYPE "PropertyType" ADD VALUE 'Triplex';
ALTER TYPE "PropertyType" ADD VALUE 'Penthouse';
ALTER TYPE "PropertyType" ADD VALUE 'Mansion';
ALTER TYPE "PropertyType" ADD VALUE 'Castle';
ALTER TYPE "PropertyType" ADD VALUE 'SharedHouse';
ALTER TYPE "PropertyType" ADD VALUE 'CoLiving';
ALTER TYPE "PropertyType" ADD VALUE 'StudentHousing';
ALTER TYPE "PropertyType" ADD VALUE 'SeniorHousing';
ALTER TYPE "PropertyType" ADD VALUE 'ServicedApartment';
ALTER TYPE "PropertyType" ADD VALUE 'BoutiqueHotel';
ALTER TYPE "PropertyType" ADD VALUE 'OfficeSpace';
ALTER TYPE "PropertyType" ADD VALUE 'CoworkingSpace';
ALTER TYPE "PropertyType" ADD VALUE 'RetailStore';
ALTER TYPE "PropertyType" ADD VALUE 'RestaurantSpace';
ALTER TYPE "PropertyType" ADD VALUE 'Warehouse';
ALTER TYPE "PropertyType" ADD VALUE 'MedicalOffice';
ALTER TYPE "PropertyType" ADD VALUE 'IndustrialFlex';
ALTER TYPE "PropertyType" ADD VALUE 'DataCenter';
ALTER TYPE "PropertyType" ADD VALUE 'ColdStorage';
ALTER TYPE "PropertyType" ADD VALUE 'Showroom';
ALTER TYPE "PropertyType" ADD VALUE 'GasStation';
ALTER TYPE "PropertyType" ADD VALUE 'SelfStorage';
ALTER TYPE "PropertyType" ADD VALUE 'ParkingLot';
ALTER TYPE "PropertyType" ADD VALUE 'Hotel';
ALTER TYPE "PropertyType" ADD VALUE 'Billboard';
ALTER TYPE "PropertyType" ADD VALUE 'CellTower';
ALTER TYPE "PropertyType" ADD VALUE 'AgriculturalLand';
ALTER TYPE "PropertyType" ADD VALUE 'DarkKitchen';
ALTER TYPE "PropertyType" ADD VALUE 'LabSpace';
ALTER TYPE "PropertyType" ADD VALUE 'Cleanroom';
