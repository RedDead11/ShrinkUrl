import { Router } from "express";
import {
  createShortUrl,
  getStats,
  redirectShortUrl,
} from "../controllers/controller";

const router = Router();

// health check
router.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Order matters
router.post("/shorten", createShortUrl); // create short URL
router.get("/stats/:shortCode", getStats); // stats
router.get("/:shortCode", redirectShortUrl); // redirect

export default router;
