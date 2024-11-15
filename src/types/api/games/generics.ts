import { z } from "zod";

export const esrbRating = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
});
export const platform = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
});
export const parentPlatform = z.object({
  platform: platform,
});
export const platformDetails = z.object({
  platform: platform,
  released_at: z.string(),
});

export const screenShot = z.object({
  id: z.number(),
  image: z.string(),
});
export const genres = z.object({
  id: z.number(),
  name: z.string(),
});
export const developers = z.object({
  id: z.number(),
  name: z.string(),
});