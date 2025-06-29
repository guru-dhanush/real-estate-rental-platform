

import multer, { FileFilterCallback } from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

// S3 client setup
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        }
        : undefined,
});

// Multer-S3 storage configuration
const storage = multerS3({
    s3: s3Client,
    bucket: process.env.S3_BUCKET_NAME!,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req: Request, file, cb: (error: Error | null, filename: string) => void) => {
        try {
            const timestamp = Date.now();
            const uniqueName = `${timestamp}-${uuidv4()}-${file.originalname}`;
            cb(null, `images/${uniqueName}`);
        } catch (err) {
            cb(err as Error, '');
        }
    },
});

// File filter for images only
const imageFileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// Single file upload middleware
export const uploadSingle = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
    },
}).single('photo');

// Multiple files upload middleware
export const uploadMultiple = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max per file
        files: 10, // max 10 files
    },
}).array('photos', 10);
