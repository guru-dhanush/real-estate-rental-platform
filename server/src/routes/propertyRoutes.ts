import express from "express";
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  testS3Connection,
} from "../controllers/propertyControllers";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware";
import { S3Client } from "@aws-sdk/client-s3";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", getProperties);
router.get("/:id", getProperty);
router.post(
  "/",
  authMiddleware(["manager"]),
  upload.array("photos"),
  createProperty
);
router.put(
  "/:id",
  authMiddleware(["manager"]),
  upload.array("photos"),
  updateProperty
);
router.delete("/:id", authMiddleware(["manager"]), deleteProperty);
router.post(
  "/test-s3",
  upload.single("image"),
  testS3Connection
);
export default router;
