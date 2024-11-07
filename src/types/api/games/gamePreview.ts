import z from "zod";

export const screenShot = z.object({
  id: z.number(),
  image: z.string(),
});

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
  // requirements: z
  //   .object({
  //     minimum: z.string().nullish(),
  //     recommended: z.string().nullish(),
  //   }).nullish(),
  // requirements_en: z
  //   .object({
  //     minimum: z.string(),
  //     recommended: z.string(),
  //   }).nullish()
});

export const gamePreview = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  released: z.string(),
  tba: z.boolean(),
  background_image: z.string(),
  // rating: z.number(),
  // rating_top: z.number(),
  // ratings: z.object({}),
  // ratings_count: z.number(),
  // reviews_text_count: z.string(),
  metacritic: z.number(),
  playtime: z.number(),
  suggestions_count: z.number(),
  updated: z.string(),
  esrb_rating: esrbRating,
  platforms: z.array(platformDetails),
  parent_platforms: z.array(parentPlatform),
  short_screenshots: z.array(screenShot),
});

