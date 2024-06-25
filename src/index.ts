import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import chapterRoutes from "./routes/chapter";
import storyRoutes from "./routes/story";
import choiceRoutes from "./routes/choice";
import userProgressRouts from "./routes/userProgress";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = 3001;

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chapter", chapterRoutes);
app.use("/api/story", storyRoutes);
app.use("/api/choice", choiceRoutes);
app.use("/api/progress", userProgressRouts);

app.listen(PORT, () => {
  console.log("Server started at port: " + PORT);
});
