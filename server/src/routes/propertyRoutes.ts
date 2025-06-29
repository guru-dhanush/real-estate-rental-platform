import express from 'express';
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  testUpload,
} from '../controllers/propertyControllers';
import { authMiddleware } from '../middleware/authMiddleware';
import { uploadMultiple } from '../services/S3Service';

const router = express.Router();

router.get("/", getProperties);
router.get("/:id", getProperty);
router.post(
  "/", uploadMultiple,
  authMiddleware(["manager"]),
  createProperty
);
router.put(
  "/:id",
  uploadMultiple,
  authMiddleware(["manager"]),
  updateProperty
);

router.post("/test-upload", uploadMultiple, testUpload);

router.delete("/:id", authMiddleware(["manager"]), deleteProperty);
export default router;
