import {
  standardGameResponse,
  standardRawgGameResponse,
  searchGameSchema,
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



const PAGE_SIZE = 20;

export const searchGames = async (req: Request, res: Response) => {
  const { success, data, error } = searchGameSchema.safeParse(req.query);

  if (!success || !data) {
    res.status(400).json({ error: error.message ?? "Invalid request" });
    return;
  }
  console.log("fetching page", data.page);

  let response: z.infer<typeof standardGameResponse> = {
    count: 0,
    results: [],
  };

  let fullGames: z.infer<typeof gamePreview>[] = [];

  if (!data.external_page) {

    const [localGames, localError] = await searchLocalGames(data, data.page ?? 1);
  
    if (localError || !localGames) {
      res.status(400).json({ error: JSON.stringify(localError?.message ?? "Query invalida") });
      return;
    }

    if (localGames.length >= PAGE_SIZE) {
      response = {
        count: localGames.length,
        results: localGames,
        next: {...data, page: data.page ?? 1 + 1},
      };
      res.status(200).json(response);
      return;
    }

    fullGames = localGames;
  }
  
  const [rawgGames, rawgError] = await searchRawgGames(data, data.external_page || 1);

  if (rawgError || !rawgGames) {
    res.status(400).json({ error: JSON.stringify(rawgError?.message ?? "Query invalida") });
    return;
  }

  fullGames = removeRawgDuplicates([...fullGames, ...rawgGames]);

  response = {
    count: fullGames.length,
    results: fullGames,
    next: fullGames.length > 0 ? {...data, external_page: (data.external_page || 1) + 1} : undefined,
  };

  if (response.next && response.next.page) {
    delete response.next.page;
  }

  res.status(200).json(response);
};

export function processCommaSeparatedParameters<ReturnType>(
  param: string | undefined,
  constructor: (value: string) => ReturnType
): ReturnType[] {
  if (!param) return [];

  return param.split(",").map(constructor);
}

async function searchLocalGames(data: z.infer<typeof searchGameSchema>, page: number)
: Promise<[z.infer<typeof gamePreview>[] | null, Error | null]>
{
    const query: Record<string, any> = {};

    

    if (data.platforms) {
      let platforms: number[] = [];
      try {
        platforms = processCommaSeparatedParameters(
          data.platforms,
          parseNumber
        );
      } catch (e) {
        
        return [null, new Error("Error processing the platforms.")];
      }

      query["platforms.platform.id"] = { $in: platforms };
    }

    if (data.query) {
      query["$text"] = { $search: data.query };
    }

    if (data.year) {
      query["release_date"] = { 
        $gte: new Date(`${data.year}-01-01T00:00:00.000Z`),
        $lte: new Date(`${data.year}-12-31T23:59:59.999Z`),
       };
    }

  return [await Game.find(query)
    .sort({ added: -1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .select(gamePreviewProjection), null];
}

async function searchRawgGames(data: z.infer<typeof searchGameSchema>, page: number)
: Promise<[z.infer<typeof gamePreview>[] | null, Error | null]>
{
  const rawgQuery: Record<string, string> = {
    page: page.toString(),
  };

  if (data.query) {
    rawgQuery["search"] = data.query;
  }

  if (data.platforms) {
    rawgQuery["platforms"] = data.platforms;
  }

  if (data.year) {
    rawgQuery["dates"] = `${data.year}-01-01,${data.year}-12-31`;
  }

  const [rawgGames, rawgError] = await fetchRawg<
    z.infer<typeof searchGameSchema>,
    z.infer<typeof standardRawgGameResponse>
  >({
    path: `games`,
    params: rawgQuery,
    method: "GET",
    // @ts-ignore
    responseSchema: standardRawgGameResponse,
  });

  if (rawgError || !rawgGames) {
    return [null, rawgError];
  }

  const convertedGames =
    rawgGames?.results.map(convertRawgGameToGamePreview) ?? [];
  
  return [convertedGames, null];
}

