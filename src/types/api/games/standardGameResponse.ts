import z from "zod";
import { gamePreview } from "./gamePreview";

export const standardGameResponse = z.object({
  count: z.number(),
  // next: z.string().nullable(),
  // previous: z.string().nullable(),
  results: z.array(gamePreview),
});
