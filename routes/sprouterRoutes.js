// routes/sprouterRoutes.js
import express from "express";
import { 
  getSprouterHome, 
  updateFarmProfile 
} from "../controllers/sprouterController.js";
import { requireAuth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";

const router = express.Router();

// All routes require sprouter role
router.use(requireAuth);
router.use(allowRoles("sprouter"));

// Get dashboard data
router.get("/home", getSprouterHome);

// Update farm profile
router.put("/profile", updateFarmProfile);

export default router;