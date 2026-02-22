import { Request, Response } from "express";
import {
  createShortUrlService,
  getUrlService,
  incrementClicksService,
} from "../services/service";

// POST /shorten
export const createShortUrl = async (req: Request, res: Response) => {
  const origUrl = req.body.url;

  if (!origUrl.startsWith("http"))
    return res.status(400).json({ error: "Invalid URL Format" });

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
  const { shortCode } = req.params;
  if (!shortCode || Array.isArray(shortCode)) {
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
