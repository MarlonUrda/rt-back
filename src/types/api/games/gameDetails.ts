import { count } from "console";
import { z } from "zod";
import {
  platformDetails,
  parentPlatform,
  screenShot,
  developers,
  genres,
  esrbRating,
} from "./generics";

export const gameDetails = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  tba: z.boolean(),
  metacritic: z.number().nullable(),
  playtime: z.number().nullable(),
  released: z.string().catch("Not released"),
  description_raw: z.string(),
  background_image: z
    .string()
    .catch("https://art.pixilart.com/sr2508e39df1caws3.png"),
  rating: z.number(),
  esrb_rating: esrbRating,
  platforms: z.array(platformDetails),
  parent_platforms: z.array(parentPlatform),
  genres: z.array(genres),
  mt_rating_user: z.number().optional(),
  mt_rating_user_count: z.number().optional(),
  mt_rating_critic: z.number().optional(),
  mt_rating_critic_count: z.number().optional(),
  added: z.number(),
  developers: z.array(developers),
});

export const gameScreenshots = z.object({
  count: z.number(),
  results: z.array(screenShot),
});
