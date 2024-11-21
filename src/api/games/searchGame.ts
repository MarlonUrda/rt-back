import {
  standardGameResponse,
  standardRawgGameResponse,
} from "../../types/api/games/standardGameResponse";
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
import {
  convertRawgGameToGamePreview,
  removeRawgDuplicates,
} from "../../helpers/previewConverter";

const searchGameSchema = z.object({
  query: z.string().max(100).optional(),
  page: z.number({ coerce: true }).int().positive().default(1),
  external_page: z.number({ coerce: true }).int().optional().default(1),
  platforms: z.string().optional(),
});

const PAGE_SIZE = 20;

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

  const localGames = (await Game.find(query)
    .sort({ added: -1 })
    .skip((data.page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .select(gamePreviewProjection)) as z.infer<typeof gamePreview>[];

  let response: z.infer<typeof standardGameResponse> = {
    count: 0,
    results: [],
  };

  if (localGames.length >= PAGE_SIZE) {
    response = {
      count: localGames.length,
      results: localGames,
      next_page: data.page + 1,
    };
    res.status(200).json(response);
    return;
  }

  const rawgQuery: Record<string, string> = {
    page: data.external_page.toString(),
  };

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

  const convertedGames =
    rawgGames?.results.map(convertRawgGameToGamePreview) ?? [];

  const fullGames = removeRawgDuplicates([...localGames, ...convertedGames]);

  response = {
    count: fullGames.length,
    results: fullGames,
    next_external_page: data.external_page + 1,
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
