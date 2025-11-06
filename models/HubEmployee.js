// models/HubEmployee.js
const hubEmployeeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Types.ObjectId, 
    ref: "User", 
    index: true, 
    unique: true,
    required: true
  },
  region: { 
    type: String, 
    default: null 
  },
  role: { 
    type: String, 
    default: "field_associate" 
  },
}, { 
  timestamps: true 
});

export const HubEmployee = mongoose.model("HubEmployee", hubEmployeeSchema);