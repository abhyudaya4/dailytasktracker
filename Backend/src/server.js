import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({
  origin: allowedOrigin,
  credentials: false,
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "DailyTracker API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected.");
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
