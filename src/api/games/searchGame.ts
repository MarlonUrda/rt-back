import { standardGameResponse, standardRawgGameResponse } from "../../types/api/games/standardGameResponse";
import z from "zod";
import Game from "../../database/models/game";
import {
  gamePreviewProjection,
  gamePreview,
} from "../../types/api/games/gamePreview";
import { Request, Response } from "express";
import { platform } from "os";
import { parseNumber } from "../../helpers/typeParsers";
import { fetchRawg } from "../../helpers/fetchExternal";
import { convertRawgGameToGamePreview, removeRawgDuplicates } from "../../helpers/previewConverter";

const searchGameSchema = z.object({
  query: z.string().max(100).optional(),
  page: z.number().int().positive().default(1),
  platforms: z.string().optional(),
});

export const searchGames = async (req: Request, res: Response) => {
  const { success, data, error } = searchGameSchema.safeParse(req.query);

  if (!success || !data) {
    res.status(400).json({ error: error.message ?? "Peticion invalida" });
    return;
  }

  const query: Record<string, any> = {};

  if (data.platforms) {
    let platforms: number[] = [];
    try {
      platforms = processCommaSeparatedParameters(data.platforms, parseNumber);
    } catch (e) {
      res.status(400).json({ error: "Invalid platform" });
      return;
    }

    query["platforms.platform.id"] = { $in: platforms };
  }

  if (data.query) {
    query["$text"] = { $search: data.query };
  }

  const games = (await Game.find(query)
    .sort({ added: -1 })
    .skip((data.page - 1) * 20)
    .limit(20)
    .select(gamePreviewProjection)) as z.infer<typeof gamePreview>[];



  // also fetch from RAWG

  const rawgQuery: Record<string, string> = {
    page: data.page.toString(),
  }

  if (data.query) {
    rawgQuery["search"] = data.query;
  }

  if (data.platforms) {
    rawgQuery["platforms"] = data.platforms;
  }

  const [rawgGames, rawgError] = await fetchRawg({
    path: `games`,
    params: rawgQuery,
    method: "GET",
    responseSchema: standardRawgGameResponse,
  });

  if (rawgError) {
    res.status(500).json({ error: JSON.stringify(rawgError.message) });
    return;
  }

  const convertedGames = rawgGames?.results.map(convertRawgGameToGamePreview) ?? [];

  const fullGames = removeRawgDuplicates([...games, ...convertedGames]);

    const response: z.infer<typeof standardGameResponse> = {
      count: fullGames.length,
      results: fullGames,
    };


  
  res.status(200).json(response);
};

export function processCommaSeparatedParameters<ReturnType>(
  param: string | undefined,
  constructor: (value: string) => ReturnType
): ReturnType[] {
  if (!param) return [];

  return param.split(",").map(constructor);
}
