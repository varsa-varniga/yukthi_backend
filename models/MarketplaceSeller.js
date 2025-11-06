// models/MarketplaceSeller.js
import mongoose from "mongoose";

const marketplaceSellerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Types.ObjectId, 
    ref: "User", 
    index: true, 
    unique: true,
    required: true
  },
  storeName: { 
    type: String, 
    default: null 
  },
  kycStatus: { 
    type: String, 
    enum: ["pending", "verified", "rejected"], 
    default: "pending" 
  },
}, { 
  timestamps: true 
});

export const MarketplaceSeller = mongoose.model("MarketplaceSeller", marketplaceSellerSchema);