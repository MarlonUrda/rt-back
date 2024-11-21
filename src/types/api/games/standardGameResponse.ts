import z from "zod";
import { gamePreview, rawgGamePreview } from "./gamePreview";

export const standardGameResponse = z.object({
  count: z.number(),
  // next: z.string().nullable(),
  // previous: z.string().nullable(),
  results: z.array(gamePreview),
});

export const standardRawgGameResponse = z.object({
  count: z.number(),
  results: z.array(rawgGamePreview),
})
