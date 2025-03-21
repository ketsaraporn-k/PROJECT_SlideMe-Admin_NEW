import express from "express";
import cors from "cors";
import mysql from 'mysql2/promise';

import usersRouter from "./routers/usersRouter.js";


// Create a new express app
const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//routers
app.use("/users", usersRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
}); 