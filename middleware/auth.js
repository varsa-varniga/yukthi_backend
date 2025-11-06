// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.agv_auth;
    if (!token) {
      return next();
    }
    
    const { uid } = jwt.verify(token, JWT_SECRET);
    if (!uid) {
      return next();
    }
    
    const user = await User.findById(uid);
    if (user && user.status === "active") {
      req.user = user;
    }
    
    return next();
  } catch (err) {
    return next();
  }
};

export const mustBeAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};