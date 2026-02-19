import { Router } from "express";
import { createShortUrl, redirectShortUrl } from "../controllers/controller";

const router = Router();

// create short URL
router.post("/shorten", createShortUrl);

// redirect
router.get("/:shortCode", redirectShortUrl);

export default router;
