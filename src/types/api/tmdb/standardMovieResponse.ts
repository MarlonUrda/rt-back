import z from "zod";
import { moviePreview } from "./moviePreview";

export const standardMovieResponse = z.object({
  page: z.number(),
  total_results: z.number(),
  total_pages: z.number(),
  results: z.array(moviePreview),
});
