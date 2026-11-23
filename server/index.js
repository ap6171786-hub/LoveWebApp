import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 5050;
app.use(cors());
app.use(express.json());

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

app.listen(port, () => {
  console.log(`LoveWeb API running at http://localhost:${port}`);
});
