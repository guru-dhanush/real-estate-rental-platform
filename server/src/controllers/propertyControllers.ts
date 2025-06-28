import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";
import { DeleteObjectCommand, S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import axios from "axios";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

interface LocationResult {
  id: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export const testS3Connection = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Testing S3 connection...');
    console.log('AWS_REGION:', process.env.AWS_REGION);
    console.log('S3_BUCKET_NAME:', process.env.S3_BUCKET_NAME);

    if (!req.file) {
      res.status(400).json({ message: 'No image file uploaded. Please upload an image as payload with field name "image".' });
      return;
    }

    console.log('req.file received:', req.file);
    console.log("MIME Type:", req.file.mimetype);

    const fileBuffer = req.file.buffer;
    if (!fileBuffer || fileBuffer.length === 0) {
      res.status(400).json({ message: 'Uploaded file is empty.' });
      return;
    }

    const fileKey = `properties/test-image-${Date.now()}-${req.file.originalname}`;

    const putCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: req.file.mimetype
    });

    await s3Client.send(putCommand);

    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    res.json({
      message: 'S3 connection successful',
      testImageUrl: imageUrl
    });

  } catch (error: any) {
    console.error('S3 connection error:', error);
    res.status(500).json({
      message: 'S3 connection failed',
      error: error.message,
      code: error.code
    });
  }
};


export const getProperties = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log(`[getProperties] Request received with query params:`, req.query);
  try {
    const {
      favoriteIds,
      priceMin,
      priceMax,
      beds,
      baths,
      propertyType,
      squareFeetMin,
      squareFeetMax,
      amenities,
      availableFrom,
      latitude,
      longitude,
    } = req.query;

    let whereConditions: string[] = [];

    if (favoriteIds) {
      const favoriteIdsArray = (favoriteIds as string).split(",").map(Number);
      console.log(
        `[getProperties] Filtering by favoriteIds:`,
        favoriteIdsArray
      );
      whereConditions.push(
        `p.id IN (${favoriteIdsArray.map((id) => Number(id)).join(",")})`
      );
    }

    if (priceMin) {
      console.log(`[getProperties] Filtering by priceMin:`, priceMin);
      whereConditions.push(
        `p."pricePerMonth" >= ${Number(priceMin)}`
      );
    }

    if (priceMax) {
      console.log(`[getProperties] Filtering by priceMax:`, priceMax);
      whereConditions.push(
        `p."pricePerMonth" <= ${Number(priceMax)}`
      );
    }

    if (beds && beds !== "any") {
      console.log(`[getProperties] Filtering by beds:`, beds);
      whereConditions.push(`p.beds >= ${Number(beds)}`);
    }

    if (baths && baths !== "any") {
      console.log(`[getProperties] Filtering by baths:`, baths);
      whereConditions.push(`p.baths >= ${Number(baths)}`);
    }

    if (squareFeetMin) {
      console.log(`[getProperties] Filtering by squareFeetMin:`, squareFeetMin);
      whereConditions.push(
        `p."squareFeet" >= ${Number(squareFeetMin)}`
      );
    }

    if (squareFeetMax) {
      console.log(`[getProperties] Filtering by squareFeetMax:`, squareFeetMax);
      whereConditions.push(
        `p."squareFeet" <= ${Number(squareFeetMax)}`
      );
    }

    if (propertyType && propertyType !== "any") {
      console.log(`[getProperties] Filtering by propertyType:`, propertyType);
      whereConditions.push(
        `p."propertyType" = '${propertyType}'`
      );
    }

    if (amenities && amenities !== "any") {
      const amenitiesArray = (amenities as string).split(",");
      console.log(`[getProperties] Filtering by amenities:`, amenitiesArray);
      whereConditions.push(
        `p.amenities @> ARRAY[${amenitiesArray.map((a) => `'${a}'`).join(",")}]::"Amenity"[]`
      );
    }

    if (availableFrom && availableFrom !== "any") {
      const availableFromDate =
        typeof availableFrom === "string" ? availableFrom : null;
      if (availableFromDate) {
        console.log(
          `[getProperties] Filtering by availableFrom:`,
          availableFromDate
        );
        const date = new Date(availableFromDate);
        if (!isNaN(date.getTime())) {
          whereConditions.push(
            `EXISTS (
              SELECT 1 FROM "Lease" l 
              WHERE l."propertyId" = p.id 
              AND l."startDate" <= '${date.toISOString()}'
            )`
          );
        } else {
          console.log(
            `[getProperties] Invalid date format for availableFrom:`,
            availableFromDate
          );
        }
      }
    }

    if (latitude && longitude) {
      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);
      console.log(`[getProperties] Filtering by location:`, {
        latitude: lat,
        longitude: lng,
      });
      const radiusInKilometers = 1000;
      const degrees = radiusInKilometers / 111; // Converts kilometers to degrees

      whereConditions.push(
        `ST_DWithin(
          l.coordinates::geometry,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),
          ${degrees}
        )`
      );
    }

    console.log(
      `[getProperties] Constructed ${whereConditions.length} where conditions`
    );

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const completeQuery = `
      SELECT 
        p.*,
        json_build_object(
          'id', l.id,
          'address', l.address,
          'city', l.city,
          'state', l.state,
          'country', l.country,
          'postalCode', l."postalCode",
          'coordinates', json_build_object(
            'longitude', ST_X(l."coordinates"::geometry),
            'latitude', ST_Y(l."coordinates"::geometry)
          )
        ) as location
      FROM "Property" p
      JOIN "Location" l ON p."locationId" = l.id
      ${whereClause}
    `;

    console.log(`[getProperties] Executing query...`);
    const properties = await prisma.$queryRawUnsafe(completeQuery);
    console.log(
      `[getProperties] Retrieved ${Array.isArray(properties) ? properties.length : 0
      } properties`
    );

    res.json(properties);
  } catch (error: any) {
    console.error(`[getProperties] Error:`, error);
    console.error(`[getProperties] Stack trace:`, error.stack);
    res
      .status(500)
      .json({ message: `Error retrieving properties: ${error.message}` });
  }
};

export const getProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  console.log(`[getProperty] Request received for property id: ${id}`);

  try {
    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
      include: {
        location: true,
      },
    });

    if (!property) {
      console.log(`[getProperty] Property with id ${id} not found`);
      res.status(404).json({ message: `Property with id ${id} not found` });
      return;
    }

    // console.log(`[getProperty] Found property:`, {
    //   id: property.id,
    //   title: property.title,
    //   locationId: property.locationId,
    // });

    const coordinates: { coordinates: string }[] =
      await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

    console.log(
      `[getProperty] Raw coordinates:`,
      coordinates[0]?.coordinates || "No coordinates found"
    );

    const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
    const longitude = geoJSON.coordinates[0];
    const latitude = geoJSON.coordinates[1];

    console.log(`[getProperty] Parsed coordinates:`, { longitude, latitude });

    const propertyWithCoordinates = {
      ...property,
      location: {
        ...property.location,
        coordinates: {
          longitude,
          latitude,
        },
      },
    };

    res.json(propertyWithCoordinates);
  } catch (err: any) {
    console.error(
      `[getProperty] Error retrieving property with id ${id}:`,
      err
    );
    console.error(`[getProperty] Stack trace:`, err.stack);
    res
      .status(500)
      .json({ message: `Error retrieving property: ${err.message}` });
  }
};

export const createProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log(`[createProperty] Request received`);
  console.log(`[createProperty] Body:`, req.body);
  console.log(
    `[createProperty] Files:`,
    req.files
      ? `${(req.files as Express.Multer.File[]).length} files received`
      : "No files received"
  );

  try {
    const files = req.files as Express.Multer.File[];
    const {
      address,
      city,
      state,
      country,
      postalCode,
      managerCognitoId,
      ...propertyData
    } = req.body;

    console.log(`[createProperty] Processing location data:`, {
      address,
      city,
      state,
      country,
      postalCode,
    });
    console.log(`[createProperty] Processing manager data:`, {
      managerCognitoId,
    });

    // Initialize photoUrls array
    let photoUrls: string[] = [];

    // Handle photo uploads if files are provided
    if (files && files.length > 0) {
      console.log(`[createProperty] Uploading ${files.length} photos to S3...`);
      const uploadPromises = files.map((file, idx) => {
        if (!file.buffer || file.buffer.length === 0) {
          return Promise.reject(new Error(`File ${file.originalname} is empty or corrupted`));
        }
        const key = `properties/${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalname}`;
        const uploadParams = {
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        return new Upload({ client: s3Client, params: uploadParams })
          .done()
          .then(() => {
            const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
            return url;
          });
      });
      const uploadResults = await Promise.allSettled(uploadPromises);
      const failed = uploadResults.filter(r => r.status === 'rejected');
      const succeeded = uploadResults.filter(r => r.status === 'fulfilled').map(r => (r as PromiseFulfilledResult<string>).value);
      if (failed.length > 0) {
        // Clean up any successful uploads
        await Promise.allSettled(succeeded.map(async (url) => {
          const key = url.split('/').slice(-2).join('/');
          try {
            await s3Client.send(new DeleteObjectCommand({
              Bucket: process.env.S3_BUCKET_NAME!,
              Key: key,
            }));
            console.log(`[createProperty] Cleaned up uploaded file: ${url}`);
          } catch (e) {
            console.error(`[createProperty] Error cleaning up file ${url}:`, e);
          }
        }));
        throw new Error(`Failed to upload all images. ${failed.length} failed.`);
      }
      photoUrls = succeeded;
      console.log(`[createProperty] All photos uploaded successfully:`, photoUrls);
    } else {
      console.log(`[createProperty] No files to upload`);
    }

    console.log(`[createProperty] Geocoding address...`);

    // Try full address first for more accurate coordinates
    const fullAddress = `${address}, ${city}, ${state}, ${country}`;
    let geocodingUrl = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
      q: fullAddress,
      format: "json",
      limit: "1",
    }).toString()}`;

    console.log(`[createProperty] Geocoding URL (full address):`, geocodingUrl);

    let geocodingResponse = await axios.get(geocodingUrl, {
      headers: {
        "User-Agent": "RealEstateApp (justsomedummyemail@gmail.com)",
      },
    });

    // Fallback to structured address if full address doesn't return results
    if (!geocodingResponse.data || geocodingResponse.data.length === 0) {
      console.log(`[createProperty] Full address geocoding failed, trying structured address...`);

      geocodingUrl = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
        street: address,
        city: city,
        state: state,
        country: country,
        postalcode: postalCode,
        format: "json",
        limit: "1",
      }).toString()}`;

      console.log(`[createProperty] Geocoding URL (structured):`, geocodingUrl);

      geocodingResponse = await axios.get(geocodingUrl, {
        headers: {
          "User-Agent": "RealEstateApp (justsomedummyemail@gmail.com)",
        },
      });
    }

    // Final fallback to postal code only if structured address fails
    if (!geocodingResponse.data || geocodingResponse.data.length === 0) {
      console.log(`[createProperty] Structured address geocoding failed, trying postal code only...`);

      geocodingUrl = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
        postalcode: postalCode,
        city: city,
        state: state,
        country: country,
        format: "json",
        limit: "1",
      }).toString()}`;

      console.log(`[createProperty] Geocoding URL (postal code):`, geocodingUrl);

      geocodingResponse = await axios.get(geocodingUrl, {
        headers: {
          "User-Agent": "RealEstateApp (justsomedummyemail@gmail.com)",
        },
      });
    }

    console.log(
      `[createProperty] Geocoding response:`,
      geocodingResponse.data && geocodingResponse.data.length > 0
        ? {
          display_name: geocodingResponse.data[0]?.display_name,
          lon: geocodingResponse.data[0]?.lon,
          lat: geocodingResponse.data[0]?.lat,
        }
        : "No geocoding results found"
    );

    let [longitude, latitude] =
      geocodingResponse.data[0]?.lon && geocodingResponse.data[0]?.lat
        ? [
          parseFloat(geocodingResponse.data[0]?.lon),
          parseFloat(geocodingResponse.data[0]?.lat),
        ]
        : [0, 0];

    // Check if coordinates already exist and add small offset if needed
    if (longitude !== 0 && latitude !== 0) {
      try {
        const existingCoords = await prisma.$queryRaw<[{ count: number }]>`
          SELECT COUNT(*)::integer as count FROM "Location" 
          WHERE ABS(ST_X(coordinates::geometry) - ${longitude}) < 0.0001 
          AND ABS(ST_Y(coordinates::geometry) - ${latitude}) < 0.0001
        `;

        if (existingCoords[0]?.count > 0) {
          console.log(`[createProperty] Similar coordinates already exist, adding small offset`);
          // Add small random offset (±0.001 degrees ≈ ±100 meters)
          longitude += (Math.random() - 0.5) * 0.002;
          latitude += (Math.random() - 0.5) * 0.002;
          console.log(`[createProperty] Applied offset - new coordinates:`, { longitude, latitude });
        }
      } catch (coordCheckError) {
        console.warn(`[createProperty] Could not check existing coordinates:`, coordCheckError);
        // Continue with original coordinates if check fails
      }
    }

    // Add rate limiting delay to respect Nominatim usage policy
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`[createProperty] Final coordinates:`, { longitude, latitude });

    // Create location with parameterized query to prevent SQL injection
    console.log(`[createProperty] Creating location record...`);
    const locationResult = await prisma.$queryRaw<LocationResult[]>`
      INSERT INTO "Location" (address, city, state, country, "postalCode", coordinates)
      VALUES (${address}, ${city}, ${state}, ${country}, ${postalCode}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326))
      RETURNING id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates;
    `;
    const location = Array.isArray(locationResult) ? locationResult[0] : locationResult;

    console.log(`[createProperty] Location created:`, {
      id: location.id,
      address: location.address,
    });

    // Process property data
    console.log(
      `[createProperty] Processing property data before database insertion`
    );
    const amenitiesArray =
      typeof propertyData.amenities === "string"
        ? propertyData.amenities.split(",").filter(Boolean)
        : [];

    const highlightsArray =
      typeof propertyData.highlights === "string"
        ? propertyData.highlights.split(",").filter(Boolean)
        : [];

    console.log(`[createProperty] Processed amenities:`, amenitiesArray);
    console.log(`[createProperty] Processed highlights:`, highlightsArray);

    // Create property
    console.log(`[createProperty] Creating property record...`);
    const newProperty = await prisma.property.create({
      data: {
        ...propertyData,
        photoUrls, // This should now be a properly typed string array
        locationId: location.id,
        managerCognitoId,
        amenities: amenitiesArray,
        highlights: highlightsArray,
        isPetsAllowed: propertyData.isPetsAllowed === "true",
        isParkingIncluded: propertyData.isParkingIncluded === "true",
        pricePerMonth: parseFloat(propertyData.pricePerMonth) || 0,
        securityDeposit: parseFloat(propertyData.securityDeposit) || 0,
        applicationFee: parseFloat(propertyData.applicationFee) || 0,
        beds: parseInt(propertyData.beds) || 0,
        baths: parseFloat(propertyData.baths) || 0,
        squareFeet: parseInt(propertyData.squareFeet) || 0,
      },
      include: {
        location: true,
        manager: true,
      },
    });

    console.log(
      `[createProperty] Property created successfully with id: ${newProperty.id}`
    );
    res.status(201).json(newProperty);
  } catch (err: any) {
    console.error(`[createProperty] Error:`, err);
    console.error(`[createProperty] Stack trace:`, err.stack);
    res
      .status(500)
      .json({ message: `Error creating property: ${err.message}` });
  }
};

export const updateProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const files = req.files as Express.Multer.File[];
  const {
    address,
    city,
    state,
    country,
    postalCode,
    existingPhotoUrls,
    deletedPhotoUrls,
    ...propertyData
  } = req.body;
  console.log("req.body", req.body);

  try {
    // Get existing property first
    const existingProperty = await prisma.property.findUnique({
      where: { id: Number(id) },
      include: { location: true },
    });

    if (!existingProperty) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    // Parse the photo URLs from the request and ensure they're all strings
    let photosToKeep: string[] = [];
    if (existingPhotoUrls) {
      try {
        const parsed = JSON.parse(existingPhotoUrls);
        if (Array.isArray(parsed)) {
          photosToKeep = parsed.filter(
            (url: unknown): url is string =>
              typeof url === "string" && url !== undefined && url !== null
          );
        }
      } catch (e) {
        console.error("Error parsing existingPhotoUrls:", e);
      }
    } else if (Array.isArray(existingProperty.photoUrls)) {
      photosToKeep = existingProperty.photoUrls.filter(
        (url: unknown): url is string =>
          typeof url === "string" && url !== undefined && url !== null
      );
    }

    // Parse the deleted photo URLs
    let photosToDelete: string[] = [];
    if (deletedPhotoUrls) {
      try {
        const parsed = JSON.parse(deletedPhotoUrls);
        if (Array.isArray(parsed)) {
          photosToDelete = parsed.filter(
            (url: unknown): url is string =>
              typeof url === "string" && url !== undefined && url !== null
          );
        }
      } catch (e) {
        console.error("Error parsing deletedPhotoUrls:", e);
      }
    }

    // Handle photo uploads if new files are provided
    const newPhotoUrls: string[] = [];
    if (files && files.length > 0) {
      const uploadPromises = files.map((file) => {
        if (!file.buffer || file.buffer.length === 0) {
          return Promise.reject(new Error(`File ${file.originalname} is empty or corrupted`));
        }
        const key = `properties/${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalname}`;
        const uploadParams = {
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        return new Upload({ client: s3Client, params: uploadParams })
          .done()
          .then(() => {
            const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
            return url;
          });
      });
      const uploadResults = await Promise.allSettled(uploadPromises);
      const failed = uploadResults.filter(r => r.status === 'rejected');
      const succeeded = uploadResults.filter(r => r.status === 'fulfilled').map(r => (r as PromiseFulfilledResult<string>).value);
      if (failed.length > 0) {
        // Clean up any successful uploads
        await Promise.allSettled(succeeded.map(async (url) => {
          const key = url.split('/').slice(-2).join('/');
          try {
            await s3Client.send(new DeleteObjectCommand({
              Bucket: process.env.S3_BUCKET_NAME!,
              Key: key,
            }));
            console.log(`[updateProperty] Cleaned up uploaded file: ${url}`);
          } catch (e) {
            console.error(`[updateProperty] Error cleaning up file ${url}:`, e);
          }
        }));
        throw new Error(`Failed to upload all images. ${failed.length} failed.`);
      }
      newPhotoUrls.push(...succeeded);
    }

    // Delete removed images from S3
    if (photosToDelete.length > 0) {
      for (const url of photosToDelete) {
        try {
          const key = url.split("/").pop();
          if (key) {
            await s3Client.send(
              new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME!,
                Key: `properties/${key}`,
              })
            );
            console.log(`Deleted image from S3: ${url}`);
          }
        } catch (err) {
          console.error(`Error deleting image ${url}:`, err);
        }
      }
    }

    // Combine kept and new photo URLs - ensure all values are strings
    const allPhotoUrls: string[] = [
      ...photosToKeep.filter((url) => !photosToDelete.includes(url)),
      ...newPhotoUrls,
    ];

    // Update location if address details changed
    let locationId = existingProperty.locationId;
    if (address || city || state || country || postalCode) {
      const [location] = await prisma.$queryRaw<LocationResult[]>`
        UPDATE "Location"
        SET 
          address = COALESCE(${address}, address),
          city = COALESCE(${city}, city),
          state = COALESCE(${state}, state),
          country = COALESCE(${country}, country),
          "postalCode" = COALESCE(${postalCode}, "postalCode")
        WHERE id = ${existingProperty.locationId}
        RETURNING id;
      `;
      locationId = location.id;
    }

    // Process property data with proper type safety
    const amenitiesArray: string[] = propertyData.amenities
      ? typeof propertyData.amenities === "string"
        ? propertyData.amenities.split(",").filter(Boolean)
        : Array.isArray(propertyData.amenities)
          ? propertyData.amenities.filter(
            (item: any): item is string =>
              typeof item === "string" && Boolean(item)
          )
          : existingProperty.amenities || []
      : existingProperty.amenities || [];

    const highlightsArray: string[] = propertyData.highlights
      ? typeof propertyData.highlights === "string"
        ? propertyData.highlights.split(",").filter(Boolean)
        : Array.isArray(propertyData.highlights)
          ? propertyData.highlights.filter(
            (item: any): item is string =>
              typeof item === "string" && Boolean(item)
          )
          : existingProperty.highlights || []
      : existingProperty.highlights || [];

    // Update property with strict typing
    const updatedProperty = await prisma.property.update({
      where: { id: Number(id) },
      data: {
        ...propertyData,
        photoUrls: allPhotoUrls as string[], // Explicitly cast to string[]
        locationId,
        amenities: amenitiesArray as any[], // Cast to any[] for Prisma enum array
        highlights: highlightsArray as any[], // Cast to any[] for Prisma enum array
        isPetsAllowed: propertyData.isPetsAllowed === "true",
        isParkingIncluded: propertyData.isParkingIncluded === "true",
        pricePerMonth: parseFloat(propertyData.pricePerMonth) || 0,
        securityDeposit: parseFloat(propertyData.securityDeposit) || 0,
        applicationFee: parseFloat(propertyData.applicationFee) || 0,
        beds: parseInt(propertyData.beds) || 0,
        baths: parseFloat(propertyData.baths) || 0,
        squareFeet: parseInt(propertyData.squareFeet) || 0,
      },
      include: {
        location: true,
        manager: true,
      },
    });

    res.json(updatedProperty);
  } catch (err: any) {
    console.error("Error updating property:", err);
    res.status(500).json({
      message: `Error updating property: ${err.message}`,
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

export const deleteProperty = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    // First get the property to access locationId
    const property = await prisma.property.findUnique({
      where: { id: Number(id) },
    });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    // Delete the property (this will cascade to related records)
    await prisma.property.delete({
      where: { id: Number(id) },
    });

    // Delete the location (if no other properties reference it)
    await prisma.location.deleteMany({
      where: {
        id: property.locationId,
        properties: { none: {} },
      },
    });

    res.status(204).send();
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error deleting property: ${err.message}` });
  }
};
