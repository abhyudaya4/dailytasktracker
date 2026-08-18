import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must contain at least 6 characters." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const exists = await User.findOne({ email: normalizedEmail });

    if (exists) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    res.status(201).json({
      token: signToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to create account." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase().trim() });

    if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json({
      token: signToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to login." });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select("-passwordHash");

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  res.json({ user: publicUser(user) });
});



export default router;
