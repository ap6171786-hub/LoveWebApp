import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 5050;
app.use(cors());
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../dist");

const mongoUri = process.env.MONGODB_URI;
if (mongoUri) {
  mongoose.connect(mongoUri).catch((error) => {
    console.error(
      "MongoDB unavailable; the website continues with local configuration:",
      error.message,
    );
  });
}

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    mongodb:
      mongoose.connection.readyState === 1
        ? "connected"
        : "optional/not connected",
  });
});

app.use(express.static(distPath));

app.get("/{*splat}", (_request, response) => {
  response.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`LoveWeb API running at http://localhost:${port}`);
});
