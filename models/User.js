// models/User.js
import mongoose from "mongoose";

export const ROLES = [
  "sprouter",
  "cultivator",
  "consumer",
  "carbon_buyer",
  "hub_employee",
  "rental_provider",
  "seller",
];

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true, 
    lowercase: true, 
    trim: true 
  },
  emailVerified: { 
    type: Boolean, 
    default: false 
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    trim: true 
  },
  phone: { 
    type: String, 
    trim: true 
  },
  primaryRole: { 
    type: String, 
    enum: ROLES, 
    required: true, 
    index: true 
  },
  status: { 
    type: String, 
    enum: ["active", "disabled"], 
    default: "active" 
  },
  farmTokens: { 
    type: Number, 
    default: 0 
  },
  carbonCredits: { 
    type: Number, 
    default: 0 
  },
  lastLoginAt: { 
    type: Date 
  },
  meta: { 
    type: mongoose.Schema.Types.Mixed 
  },
}, { 
  timestamps: true 
});

export default mongoose.model("User", userSchema);