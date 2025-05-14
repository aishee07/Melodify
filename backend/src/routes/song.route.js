import { Router } from "express";
import { 
  getAllSongs, 
  getFeaturedSongs, 
  getMadeForYouSongs, 
  getTrendingSongs,
  searchSongs 
} from "../controller/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all song routes except featured/trending (for preview)
router.get("/", protectRoute, requireAdmin, getAllSongs);
router.get("/featured", getFeaturedSongs); // Public
router.get("/made-for-you", protectRoute, getMadeForYouSongs); // Protected
router.get("/trending", getTrendingSongs); // Public
router.get("/search", protectRoute, searchSongs); // Protected

export default router;