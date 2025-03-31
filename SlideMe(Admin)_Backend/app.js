import express from "express";
import cors from "cors";
import mysql from 'mysql2/promise';
import path from "path";
import { fileURLToPath } from "url";

// Import Routers
import usersRouter from "./routers/usersRouter.js";
import filesRouter from "./routers/FilesBannerUploads.js";
import bannerinfoRouter from "./routers/bannerinfoRouter.js";



// Import Swagger Configuration
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";  // ✅ นำเข้า swaggerSpec
import providerApproveRouter from "./routers/providerApproveRouter.js";
import providerManagementRouter from "./routers/providerManagementRouter.js";
import userManagement from "./routers/userManagementRouter.js";
import orderRoutes from "./routers/orderRoutes.js";
import adminRoutes from "./routers/adminRoutes.js";

// Import Swagger Configuration
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger-67183473.js";  // ✅ นำเข้า swaggerSpec


// Create Express App
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ รองรับ Form Data
app.use("/public", express.static("public"));

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Routers
app.use("/users", usersRouter);
app.use("/files", filesRouter);
app.use("/bannerinfo", bannerinfoRouter);
app.use("/providerApprove", providerApproveRouter);
app.use("/providerManagement", providerManagementRouter);
app.use("/files", express.static(path.join(__dirname, "files")));
app.use("/userManagement", userManagement);
app.use("/api/orders", orderRoutes);
app.use("/api/admins", adminRoutes);

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
