import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = Router();

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
}

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const password =
      typeof req.body.password === "string" ? req.body.password : "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ message: "Enter a valid email address" });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({
        message: "Password must contain at least 8 characters",
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await User.create({ email, passwordHash });

    res.status(201).json({
      message: "Registration successful",
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      res.status(409).json({
        message: "Email is already registered",
      });
      return;
    }

    console.error("Registration failed:", error);
    res.status(500).json({ message: "Unable to register user" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const password =
      typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
      });
      return;
    }

    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const expiresIn = process.env.JWT_EXPIRES_IN ?? "120s";

    const accessToken = jwt.sign({ sub: user._id.toString() }, getJwtSecret(), {
      expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      tokenType: "Bearer",
      expiresIn,
    });
  } catch (error: unknown) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Unable to log in" });
  }
});

export default router;
