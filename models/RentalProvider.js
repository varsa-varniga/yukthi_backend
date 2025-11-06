// models/RentalProvider.js
const rentalProviderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Types.ObjectId, 
    ref: "User", 
    index: true, 
    unique: true,
    required: true
  },
  serviceAreas: [{ 
    type: String 
  }],
  kycStatus: { 
    type: String, 
    enum: ["pending", "verified", "rejected"], 
    default: "pending" 
  },
}, { 
  timestamps: true 
});

export const RentalProvider = mongoose.model("RentalProvider", rentalProviderSchema);
