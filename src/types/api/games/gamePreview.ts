import z from "zod";
import { esrbRating, platformDetails, parentPlatform } from "./generics";


export const gamePreview = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  released: z.string(),
  tba: z.boolean(),
  background_image: z.string(),
  metacritic: z.number(),
  playtime: z.number(),
  esrb_rating: esrbRating,
  platforms: z.array(platformDetails),
  parent_platforms: z.array(parentPlatform),
  added: z.number(),
  mt_rating_user: z.number().optional(),
  mt_rating_user_count: z.number().optional(),
  mt_rating_critic: z.number().optional(),
  mt_rating_critic_count: z.number().optional(),
});

