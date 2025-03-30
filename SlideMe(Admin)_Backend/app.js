import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

// Import Routers
import usersRouter from "./routers/usersRouter.js";
import filesRouter from "./routers/FilesBannerUploads.js";
import bannerinfoRouter from "./routers/bannerinfoRouter.js";

// Import Swagger Configuration
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";  // ✅ นำเข้า swaggerSpec

// Create Express App
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/public", express.static("public"));

// Routers
app.use("/users", usersRouter);
app.use("/files", filesRouter);
app.use("/bannerinfo", bannerinfoRouter);

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
