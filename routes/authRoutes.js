// routes/authRoutes.js
import express from "express";
import {
  checkEmail,
  register,
  login,
  logout,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/**
 * ✅ Check current session (used by frontend to show "Continue as Neha?")
 * GET /auth/me
 */
router.get("/me", requireAuth, async (req, res) => {
  try {
    // If no user is logged in
    if (!req.user) {
      return res.json({ authenticated: false });
    }

    // If user is logged in and active
    return res.json({
      authenticated: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        primaryRole: req.user.primaryRole,
      },
    });
  } catch (err) {
    console.error("Error checking session:", err);
    return res
      .status(500)
      .json({ authenticated: false, error: "Server error" });
  }
});

/**
 * ✅ Check if email exists before signup/login
 * POST /auth/check-email
 */
router.post("/check-email", checkEmail);

/**
 * ✅ Register a new user
 * POST /auth/register
 */
router.post("/register", register);

/**
 * ✅ Login existing user
 * POST /auth/login
 */
router.post("/login", login);

/**
 * ✅ Logout user
 * POST /auth/logout
 */
router.post("/logout", logout);

export default router;
