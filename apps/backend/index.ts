import express from "express";
import "dotenv/config";
import cors from "cors";
import { config } from "./config";

// Import routes
import storageRoutes from "./routes/storage.routes";
import modelRoutes from "./routes/model.routes";
import imageRoutes from "./routes/image.routes";
import packRoutes from "./routes/pack.routes";
import aiRoutes from "./routes/ai.routes";
import userRoutes from "./routes/user.routes";
import webhookRoutes from "./routes/webhook.routes";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Health check
app.get("/", (req, res) => {
  res.send("Healthy Server ✨");
});

// API Routes
app.use("/", storageRoutes);
app.use("/models", modelRoutes);
app.use("/images", imageRoutes);
app.use("/image", imageRoutes); // Keep backward compatibility for /image/bulk
app.use("/pack", packRoutes);
app.use("/ai", aiRoutes);
app.use("/user", userRoutes);
app.use("/webhook", webhookRoutes);

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server is running on http://localhost:${config.port}`);
});
