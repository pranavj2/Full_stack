import "dotenv/config";
import mongoose from "mongoose";
import app from "./app";

async function startServer(): Promise<void> {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB Atlas connected successfully");

    const port = Number(process.env.PORT) || 4000;

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown startup error";

    console.error("Startup failed:", message);
    process.exitCode = 1;
  }
}

void startServer();
