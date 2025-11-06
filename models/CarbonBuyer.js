// models/CarbonBuyer.js
const carbonBuyerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Types.ObjectId, 
    ref: "User", 
    index: true, 
    unique: true,
    required: true
  },
  orgName: { 
    type: String, 
    default: null 
  },
  gstin: { 
    type: String, 
    default: null 
  },
  verified: { 
    type: Boolean, 
    default: false 
  },
}, { 
  timestamps: true 
});
