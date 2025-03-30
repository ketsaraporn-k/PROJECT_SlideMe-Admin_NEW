import express from "express";
import cors from "cors";
import mysql from 'mysql2/promise';
import path from "path";
import { fileURLToPath } from "url";

import usersRouter from "./routers/usersRouter.js";
import providerApproveRouter from "./routers/providerApproveRouter.js";
import providerManagementRouter from "./routers/providerManagementRouter.js";
import userManagement from "./routers/userManagementRouter.js";

// Create a new express app
const app = express();

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ รองรับ Form Data

//routers
app.use("/users", usersRouter);
app.use("/providerApprove", providerApproveRouter);
app.use("/providerManagement", providerManagementRouter);
app.use("/files", express.static(path.join(__dirname, "files")));
app.use("/userManagement", userManagement);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
}); 