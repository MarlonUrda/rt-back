import z from "zod";
import { gamePreview, rawgGamePreview } from "./gamePreview";


export const searchGameSchema = z.object({
  query: z.string().max(100).optional(),
  page: z.number({ coerce: true }).int().min(0).optional(),
  external_page: z.number({ coerce: true }).int().min(0).optional(),
  platforms: z.string().optional(),
  year: z.number().optional(),
  minYear: z.number().optional(),
  maxYear: z.number().optional(),
});

export const standardGameResponse = z.object({
  count: z.number(),
  results: z.array(gamePreview),
  next: searchGameSchema.optional(),
});

export const standardRawgGameResponse = z.object({
  count: z.number(),
  results: z.array(rawgGamePreview),
})
