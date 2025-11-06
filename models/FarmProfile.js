// models/FarmProfile.js
import mongoose from "mongoose";

const farmProfileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Types.ObjectId, 
    ref: "User", 
    index: true, 
    unique: true,
    required: true
  },
  farmName: { 
    type: String, 
    default: null 
  },
  location: { 
    lat: Number, 
    lng: Number 
  },
  iotInstalled: { 
    type: Boolean, 
    default: false 
  },
}, { 
  timestamps: true 
});

export default mongoose.model("FarmProfile", farmProfileSchema);