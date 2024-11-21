import z from "zod";
import { esrbRating, platformDetails, parentPlatform } from "./generics";


export const gamePreview = z.object({
  _id: z.string(),
  external_id: z.number(),
  slug: z.string(),
  name: z.string(),
  released: z.string(),
  tba: z.boolean(),
  background_image: z.string(),
  metacritic: z.number().nullable(),
  playtime: z.number().nullable(),
  esrb_rating: esrbRating,
  platforms: z.array(platformDetails),
  parent_platforms: z.array(parentPlatform),
  mt_rating_user: z.number().optional(),
  mt_rating_user_count: z.number().optional(),
  mt_rating_critic: z.number().optional(),
  mt_rating_critic_count: z.number().optional(),
});

export const rawgGamePreview = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  released: z.string(),
  tba: z.boolean(),
  background_image: z.string(),
  metacritic: z.number().nullable(),
  playtime: z.number().nullable(),
  esrb_rating: esrbRating,
  platforms: z.array(platformDetails),
  parent_platforms: z.array(parentPlatform),
  
});

export const gamePreviewProjection = {
  _id: 1,
  external_id: 1,
  slug: 1,
  name: 1,
  released: 1,
  tba: 1,
  background_image: 1,
  metacritic: 1,
  playtime: 1,
  esrb_rating: 1,
  platforms: 1,
  parent_platforms: 1,
  added: 1,
  mt_rating_user: 1,
  mt_rating_user_count: 1,
  mt_rating_critic: 1,
  mt_rating_critic_count: 1,

}

