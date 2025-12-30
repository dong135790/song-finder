// server.js
import express from "express";
import cors from "cors";
import "dotenv/config";

// Route modules (you create these files)
import shazamRoutes from "./src/routes/shazamRoutes.js";
// import queryRoutes from "./src/routes/query.routes.js";

const app = express();

// ---- middleware ----
app.use(cors());
app.use(express.json());

// ---- health check ----
app.get("/health", (req, res) => res.json({ running: true, message: "Backend is running" }));

// ---- mount routes ----
app.use("/api/shazam", shazamRoutes);

// ---- global error handler (keeps errors JSON, avoids "Unexpected token 'S'") ----
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Server error",
    status,
  });
});

// ---- start server ----
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ API listening on http://localhost:${PORT}`);
});
