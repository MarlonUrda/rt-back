import z from "zod";
import { esrbRating, platformDetails, parentPlatform } from "./generics";


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
  esrb_rating: esrbRating,
  platforms: z.array(platformDetails),
  parent_platforms: z.array(parentPlatform),
  added: z.number(),
});

