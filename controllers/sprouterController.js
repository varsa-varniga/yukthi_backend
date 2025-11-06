// controllers/sprouterController.js
import FarmProfile from "../models/FarmProfile.js";

// GET /sprouter/home - Get sprouter dashboard data
export const getSprouterHome = async (req, res) => {
  try {
    // Ensure user has sprouter role (already checked by middleware)
    if (req.user.primaryRole !== "sprouter") {
      return res.status(403).json({ error: "Forbidden" });
    }
    
    // Lazy-create farm profile if it doesn't exist
    let profile = await FarmProfile.findOne({ userId: req.user._id });
    
    if (!profile) {
      profile = await FarmProfile.create({ 
        userId: req.user._id 
      });
    }
    
    return res.json({
      user: {
        name: req.user.name,
        email: req.user.email,
        farmTokens: req.user.farmTokens,
        carbonCredits: req.user.carbonCredits,
      },
      profile: {
        _id: profile._id,
        farmName: profile.farmName,
        location: profile.location,
        iotInstalled: profile.iotInstalled,
      }
    });
  } catch (err) {
    console.error("Sprouter home error:", err);
    return res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

// PUT /sprouter/profile - Update farm profile
export const updateFarmProfile = async (req, res) => {
  try {
    const { farmName, location } = req.body;
    
    let profile = await FarmProfile.findOne({ userId: req.user._id });
    
    if (!profile) {
      profile = await FarmProfile.create({ 
        userId: req.user._id,
        farmName,
        location
      });
    } else {
      if (farmName !== undefined) profile.farmName = farmName;
      if (location !== undefined) profile.location = location;
      await profile.save();
    }
    
    return res.json({ profile });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ error: "Failed to update profile" });
  }
};