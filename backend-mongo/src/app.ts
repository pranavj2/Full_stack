import express from "express";
import cors from "cors";
import expenseRoutes from "./routes/expenseRoutes";
import authRoutes from "./routes/authRoutes";
import { authenticateToken } from "./middleware/authenticateToken";

const app = express();

app.use(cors());
app.use(express.json());

// app.get("/health", (_req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Expense Tracker API is running",
//   });
// });

// Public endpoints
app.use("/api/auth", authRoutes);

// Protected endpoints
app.use("/api/expenses", authenticateToken, expenseRoutes);

export default app;
