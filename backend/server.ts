import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoute"; 

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON data from requests
app.use(cors({ origin: "http://localhost:3000" })); // Allow frontend requests

// mount rounts
app.use("/api/user", userRoutes);

// MongoDB connection
mongoose
  .connect(process.env.DB_URI as string)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });


