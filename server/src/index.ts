import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import path from "path";
import { authMiddleware } from "./middleware/authMiddleware";
import { initializeSocketService } from "./services/socketService";
import { PrismaClient } from "@prisma/client";

/* ROUTE IMPORT */
import tenantRoutes from "./routes/tenantRoutes";
import managerRoutes from "./routes/managerRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import chatRoutes from "./routes/chatRoutes";
import { errorHandler } from "./middleware/errorMiddleware";
import { testS3Connection } from "./controllers/propertyControllers";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/* CREATE HTTP SERVER */
const server = http.createServer(app);

/* INITIALIZE SOCKET SERVICE */
initializeSocketService(server);

/* ROUTES */
app.get("/", (req, res) => {
  res.send("This is home route");
});

app.use("/properties", propertyRoutes);
app.use("/tenants", authMiddleware(["tenant"]), tenantRoutes);
app.use("/managers", managerRoutes);
app.use("/chats", chatRoutes);
app.get("/test-s3", testS3Connection);

/* ERROR HANDLING MIDDLEWARE */
app.use(errorHandler);

/* SERVER */
const port = Number(process.env.PORT) || 3002;

/* INITIALIZE PRISMA */
const prisma = new PrismaClient();

async function startServer() {
  try {
    // Connect to database
    await prisma.$connect();
    console.log("Connected to database");

    // Start server
    server.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

// Handle cleanup
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
