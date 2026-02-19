import { URLMapping } from "../models/model";
import { generateShortCode } from "../utils/generateShortCode";

// temporary in-memory database
const urlDatabase = new Map<string, URLMapping>();

export const createShortUrlService = (originalUrl: string): string => {
  const shortCode = generateShortCode();

  const urlData: URLMapping = {
    originalUrl,
    shortCode,
    clicks: 0,
    createdAt: new Date(),
  };

  urlDatabase.set(shortCode, urlData);
  return shortCode;
};

export const getUrlService = (shortCode: string): URLMapping | undefined => {
  return urlDatabase.get(shortCode);
};

export const incrementClicksService = (shortCode: string): void => {
  const urlData = urlDatabase.get(shortCode);
  if (urlData) {
    urlData.clicks += 1;
    urlDatabase.set(shortCode, urlData);
  }
};
