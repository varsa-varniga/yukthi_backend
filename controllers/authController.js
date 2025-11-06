// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { ROLES } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * 🔒 Helper to set auth cookie
 */
const setAuthCookie = (res, token) => {
  res.cookie("agv_auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // use HTTPS in production
    sameSite: "lax", // allow localhost cross-site
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * ✅ GET /auth/me — Check current session
 * Called automatically by the frontend to decide if “Continue as [User]” should appear
 */
export const me = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json({ authenticated: false });
    }

    return res.status(200).json({
      authenticated: true,
      user: {
        _id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        phone: req.user.phone,
        primaryRole: req.user.primaryRole,
        farmTokens: req.user.farmTokens,
        carbonCredits: req.user.carbonCredits,
      },
    });
  } catch (err) {
    console.error("Error in /auth/me:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * ✅ POST /auth/check-email — Check if email exists before login/register
 */
export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).lean();

    if (!user) {
      return res.json({ exists: false });
    }

    // Mask email for UI (e.g., “n*****@bitsathy.ac.in”)
    const masked = email.replace(/^(.{1}).+(@.+)$/, (_, a, b) => a + "*****" + b);

    return res.json({
      exists: true,
      masked,
      primaryRole: user.primaryRole,
      name: user.name || null,
    });
  } catch (err) {
    console.error("checkEmail error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * ✅ POST /auth/register — Register new user
 */
export const register = async (req, res) => {
  try {
    const { email, password, name, phone, primaryRole } = req.body;

    if (!email || !password || !primaryRole) {
      return res
        .status(400)
        .json({ error: "Email, password, and role are required" });
    }

    if (!ROLES.includes(primaryRole)) {
      return res.status(400).json({
        error: "Invalid role",
        validRoles: ROLES,
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      name: name || null,
      phone: phone || null,
      primaryRole,
      status: "active",
    });

    // Create JWT token
    const token = jwt.sign({ uid: user._id }, JWT_SECRET, { expiresIn: "7d" });

    // Set cookie
    setAuthCookie(res, token);

    return res.status(201).json({
      authenticated: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        primaryRole: user.primaryRole,
        farmTokens: user.farmTokens,
        carbonCredits: user.carbonCredits,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Registration failed" });
  }
};

/**
 * ✅ POST /auth/login — Login existing user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({
      email: (email || "").toLowerCase(),
      status: "active",
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    user.lastLoginAt = new Date();
    await user.save();

    // Generate JWT and set cookie
    const token = jwt.sign({ uid: user._id }, JWT_SECRET, { expiresIn: "7d" });
    setAuthCookie(res, token);

    return res.status(200).json({
      authenticated: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        primaryRole: user.primaryRole,
        farmTokens: user.farmTokens,
        carbonCredits: user.carbonCredits,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
};

/**
 * ✅ POST /auth/logout — Clears cookie and ends session
 */
export const logout = async (req, res) => {
  try {
    res.clearCookie("agv_auth", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: "Logout failed" });
  }
};
