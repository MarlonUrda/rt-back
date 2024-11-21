import z from "zod";
import { gamePreview, rawgGamePreview } from "./gamePreview";

export const standardGameResponse = z.object({
  count: z.number(),
  results: z.array(gamePreview),
  next_external_page: z.number().int().optional(),
  next_page: z.number().int().optional(),
});

export const standardRawgGameResponse = z.object({
  count: z.number(),
  results: z.array(rawgGamePreview),
})
