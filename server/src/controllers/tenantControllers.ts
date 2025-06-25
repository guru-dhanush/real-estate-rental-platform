import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

export const getTenant = async (req: Request, res: Response): Promise<void> => {
  console.log(`[getTenant] Function called with params:`, req.params);
  try {
    const { cognitoId } = req.params;
    console.log(
      `[getTenant] Searching for tenant with cognitoId: ${cognitoId}`
    );

    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId },
      include: {
        favorites: true,
      },
    });

    if (tenant) {
      console.log(`[getTenant] Tenant found: ${tenant.name}`);
      res.json(tenant);
    } else {
      console.log(`[getTenant] Tenant not found for cognitoId: ${cognitoId}`);
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (error: any) {
    console.error(
      `[getTenant] Error fetching tenant for cognitoId ${req.params.cognitoId}:`,
      error
    );
    res
      .status(500)
      .json({ message: `Error retrieving tenant: ${error.message}` });
  }
};

export const createTenant = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log(`[createTenant] Function called with body:`, req.body);
  try {
    const { cognitoId, name, email, phoneNumber } = req.body;
    console.log(
      `[createTenant] Creating tenant with cognitoId: ${cognitoId}, name: ${name}`
    );

    const tenant = await prisma.tenant.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
      },
    });

    console.log(`[createTenant] Tenant created successfully:`, tenant);
    res.status(201).json(tenant);
  } catch (error: any) {
    console.error(`[createTenant] Error:`, error);
    res
      .status(500)
      .json({ message: `Error creating tenant: ${error.message}` });
  }
};

export const updateTenant = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log(`[updateTenant] Function called with params:`, req.params);
  console.log(`[updateTenant] Update data:`, req.body);
  try {
    const { cognitoId } = req.params;
    const { name, email, phoneNumber } = req.body;

    console.log(`[updateTenant] Updating tenant with cognitoId: ${cognitoId}`);
    const updateTenant = await prisma.tenant.update({
      where: { cognitoId },
      data: {
        name,
        email,
        phoneNumber,
      },
    });

    console.log(`[updateTenant] Tenant updated successfully:`, updateTenant);
    res.json(updateTenant);
  } catch (error: any) {
    console.error(`[updateTenant] Error:`, error);
    res
      .status(500)
      .json({ message: `Error updating tenant: ${error.message}` });
  }
};

export const getCurrentResidences = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log(
    `[getCurrentResidences] Function called with params:`,
    req.params
  );
  try {
    const { cognitoId } = req.params;
    console.log(
      `[getCurrentResidences] Finding properties for tenant with cognitoId: ${cognitoId}`
    );

    const properties = await prisma.property.findMany({
      where: { tenants: { some: { cognitoId } } },
      include: {
        location: true,
      },
    });

    console.log(`[getCurrentResidences] Found ${properties.length} properties`);

    console.log(
      `[getCurrentResidences] Processing location coordinates for each property`
    );
    const residencesWithFormattedLocation = await Promise.all(
      properties.map(async (property: any) => {
        console.log(
          `[getCurrentResidences] Processing property ID: ${property.id}`
        );
        const coordinates: { coordinates: string }[] =
          await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

        console.log(
          `[getCurrentResidences] Raw coordinates for location ${property.location.id}:`,
          coordinates[0]?.coordinates
        );
        const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
        const longitude = geoJSON.coordinates[0];
        const latitude = geoJSON.coordinates[1];

        console.log(
          `[getCurrentResidences] Converted coordinates - longitude: ${longitude}, latitude: ${latitude}`
        );
        return {
          ...property,
          location: {
            ...property.location,
            coordinates: {
              longitude,
              latitude,
            },
          },
        };
      })
    );

    console.log(
      `[getCurrentResidences] Returning ${residencesWithFormattedLocation.length} formatted properties`
    );
    res.json(residencesWithFormattedLocation);
  } catch (err: any) {
    console.error(`[getCurrentResidences] Error:`, err);
    res
      .status(500)
      .json({ message: `Error retrieving manager properties: ${err.message}` });
  }
};

export const addFavoriteProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log(`[addFavoriteProperty] Function called with params:`, req.params);
  try {
    const { cognitoId, propertyId } = req.params;
    console.log(
      `[addFavoriteProperty] Adding property ${propertyId} as favorite for tenant ${cognitoId}`
    );

    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId },
      include: { favorites: true },
    });

    console.log(`[addFavoriteProperty] Tenant found:`, tenant ? "Yes" : "No");

    if (!tenant) {
      console.log(
        `[addFavoriteProperty] Tenant not found with cognitoId: ${cognitoId}`
      );
      res.status(404).json({ message: "Tenant not found" });
      return;
    }

    const propertyIdNumber = Number(propertyId);
    const existingFavorites = tenant.favorites || [];
    console.log(
      `[addFavoriteProperty] Tenant has ${existingFavorites.length} existing favorites`
    );

    if (!existingFavorites.some((fav: any) => fav.id === propertyIdNumber)) {
      console.log(
        `[addFavoriteProperty] Adding new favorite property with ID: ${propertyIdNumber}`
      );
      const updatedTenant = await prisma.tenant.update({
        where: { cognitoId },
        data: {
          favorites: {
            connect: { id: propertyIdNumber },
          },
        },
        include: { favorites: true },
      });
      console.log(
        `[addFavoriteProperty] Favorite added successfully. New favorites count: ${updatedTenant.favorites.length}`
      );
      res.json(updatedTenant);
    } else {
      console.log(
        `[addFavoriteProperty] Property ${propertyId} is already a favorite`
      );
      res.status(409).json({ message: "Property already added as favorite" });
    }
  } catch (error: any) {
    console.error(`[addFavoriteProperty] Error:`, error);
    res
      .status(500)
      .json({ message: `Error adding favorite property: ${error.message}` });
  }
};

export const removeFavoriteProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log(
    `[removeFavoriteProperty] Function called with params:`,
    req.params
  );
  try {
    const { cognitoId, propertyId } = req.params;
    const propertyIdNumber = Number(propertyId);
    console.log(
      `[removeFavoriteProperty] Removing property ${propertyIdNumber} from favorites for tenant ${cognitoId}`
    );

    const updatedTenant = await prisma.tenant.update({
      where: { cognitoId },
      data: {
        favorites: {
          disconnect: { id: propertyIdNumber },
        },
      },
      include: { favorites: true },
    });

    console.log(
      `[removeFavoriteProperty] Favorite removed successfully. New favorites count: ${updatedTenant.favorites.length}`
    );
    res.json(updatedTenant);
  } catch (err: any) {
    console.error(`[removeFavoriteProperty] Error:`, err);
    res
      .status(500)
      .json({ message: `Error removing favorite property: ${err.message}` });
  }
};
