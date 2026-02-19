import { Request, Response } from "express";
import {
  createShortUrlService,
  getUrlService,
  incrementClicksService,
} from "../services/service";

// POST /shorten
export const createShortUrl = (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const shortCode = createShortUrlService(url);

  res.status(201).json({ shortCode });
};

// GET /:shortCode
export const redirectShortUrl = (req: Request, res: Response) => {
  const shortCodeParam = req.params.shortCode;
  if (!shortCodeParam || Array.isArray(shortCodeParam)) {
    return res.status(400).send("Invalid short code");
  }

  const shortCode = shortCodeParam;
  const urlData = getUrlService(shortCode);

  if (!urlData) {
    return res.status(404).send("URL not found");
  }

  incrementClicksService(shortCode);

  res.redirect(urlData.originalUrl);
};
