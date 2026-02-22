import { URLMapping } from "../models/model";
import { generateShortCode } from "../utils/generateShortCode";
import {prisma} from "../lib/prisma";

export const createShortUrlService = async (originalUrl: string): Promise<string> => {
  const shortCode = generateShortCode();

  await prisma.url.create({
    data: {
      originalUrl,
      shortCode,
    },
  });

  return shortCode;
};

// Get a URL by its shortcode

export const getUrlService = async (shortCode: string) => {
  return await prisma.url.findUnique({
    where: {shortCode},
  });
};

// Increment clicks
export const incrementClicksService = async (shortCode: string) => {
  await prisma.url.update({
    where: {shortCode},
    data: {
      clicks: {increment: 1},
    },
  });
};
