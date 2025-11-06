// models/Consumer.js
const consumerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Types.ObjectId, 
    ref: "User", 
    index: true, 
    unique: true,
    required: true
  },
  preferences: [{ 
    type: String 
  }],
}, { 
  timestamps: true 
});

export const Consumer = mongoose.model("Consumer", consumerSchema);