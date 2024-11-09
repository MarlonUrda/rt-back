import { z } from "zod";

export const screenShot = z.object({
  id: z.number(),
  image: z.string(),
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

export const genres = z.object({
  id: z.number(),
  name: z.string(),
})

export const developers = z.object({
  id: z.number(),
  name: z.string(),
})

export const gameDetails = z.object({
  id: z.number(),
  name: z.string(),
  released: z.string(),
  description_raw: z.string(),
  background_image: z.string(),
  playtime: z.number(),
  rating: z.number(),
  platforms: z.array(platformDetails),
  parent_platforms: z.array(parentPlatform),
  genres: z.array(genres),
  developers: z.array(developers)
})
