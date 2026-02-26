import { Request, Response } from "express";
import {
  createShortUrlService,
  getStatsService,
  getUrlService,
  incrementClicksService,
} from "../services/service";

// POST /shorten
export const createShortUrl = async (req: Request, res: Response) => {
  const origUrl = req.body.url;

  // Check if its a string and not empty
  if (!origUrl || typeof origUrl !== "string") {
    return res.status(400).json({ error: "URL is required" });
  }

  // Parsing (make sure URLs have correct structure)
  let parsed: URL;
  try {
    parsed = new URL(origUrl);
  } catch {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  // Only allow http and https
  if (parsed.protocol !== "http:" && parsed.protocol != "https:") {
    return res
      .status(400)
      .json({ error: "Only http and https URLs are allowed" });
  }

  // Must have real hostname (blocks "http://" or "http://x")
  if (!parsed.hostname || parsed.hostname.length < 3) {
    return res.status(400).json({ error: "URL must have a valid domain" });
  }

  try {
    const shortCode = await createShortUrlService(origUrl);
    res.status(201).json({ shortCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /:shortCode
export const redirectShortUrl = async (req: Request, res: Response) => {
  const shortCode = req.params.shortCode as string;
  if (!shortCode) {
    return res.status(400).send("Invalid short code");
  }

  try {
    const urlData = await getUrlService(shortCode);
    if (!urlData) return res.status(404).send("URL not found");

    // removing await so database update happens in background
    incrementClicksService(shortCode).catch((err) => {
      console.error("Failed to increment clicks:", err);
    });

    // redirect immediately
    return res.redirect(urlData.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const getStats = async (req: Request, res: Response) => {
  const shortCode = req.params.shortCode as string;

  try {
    const stats = await getStatsService(shortCode);
    if (!stats) return res.status(404).json({ error: "Short code not found" });
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};
