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
const MIN_YEAR = 1975;
const MAX_YEAR = new Date().getFullYear();
const MIN_RATING = 0; 
const MAX_RATING = 5;

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
        next: {...data, page: (data.page ?? 1) + 1},
      };
      res.status(200).json(response);
      return;
    }

    fullGames = localGames;
  }
  
  const [rawgGames, rawgError, hasMore] = await searchRawgGames(data, data.external_page || 1);

  if (rawgError || !rawgGames) {
    res.status(400).json({ error: JSON.stringify(rawgError?.message ?? "Query invalida") });
    return;
  }

  fullGames = removeRawgDuplicates([...fullGames, ...rawgGames]);

  response = {
    count: fullGames.length,
    results: fullGames,
    next: hasMore ? {...data, external_page: (data.external_page || 1) + 1} : undefined,
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

    if (data.genres) {
      let genres: number[] = [];
      try {
        genres = processCommaSeparatedParameters(data.genres, parseNumber);
      } catch (e) {
        
        return [null, new Error("Error processing the genres.")];
      }

      query["genres.id"] = { $in: genres };
    }

    if (data.query) {
      query["$text"] = { $search: `"${data.query}"` };
    }

    if (data.year) {
      query["release_date"] = { 
        $gte: new Date(`${data.year}-01-01T00:00:00.000Z`),
        $lte: new Date(`${data.year}-12-31T23:59:59.999Z`),
       };
    }

    if (data.minYear || data.maxYear) {
      query["release_date"] = {
        $gte: new Date(`${data.minYear
          ? data.minYear
          : MIN_YEAR
        }-01-01T00:00:00.000Z`),
        $lte: new Date(`${data.maxYear
          ? data.maxYear
          : MAX_YEAR

        }-12-31T23:59:59.999Z`),
      };
    }

    if (data.minRating || data.maxRating) {
      query["mt_rating_user"] = {
        $gte: data.minRating
          ? data.minRating
          : MIN_RATING,
        $lte: data.maxRating
          ? data.maxRating
          : MAX_RATING,
      };
    }

    if (data.minCriticsRating || data.maxCriticsRating) {
      query["mt_rating_critic"] = {
        $gte: data.minCriticsRating
          ? data.minCriticsRating
          : MIN_RATING,
        $lte: data.maxCriticsRating
          ? data.maxCriticsRating
          : MAX_RATING,
      };
    }

  return [await Game.find(query)
    .sort({ added: -1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .select(gamePreviewProjection), null];
}

async function searchRawgGames(data: z.infer<typeof searchGameSchema>, page: number)
: Promise<[z.infer<typeof gamePreview>[] | null, Error | null, boolean]>
{
  const rawgQuery: Record<string, string> = {
    page: page.toString(),
  };

  // since external games are not yet rated, if minrating is greater than 0, we will not search for external games

  if (data.minRating && data.minRating > 0) {
    return [[], null, false];
  }

  if (data.minCriticsRating && data.minCriticsRating > 0) {
    return [[], null, false];
  }

  if (data.query) {
    rawgQuery["search"] = data.query;
  }

  if (data.platforms) {
    rawgQuery["platforms"] = data.platforms;
  }

  if (data.genres) {
    rawgQuery["genres"] = data.genres;
  }

  if (data.year) {
    rawgQuery["dates"] = `${data.year}-01-01,${data.year}-12-31`;
  }

  if (data.maxYear && data.minYear) {
    rawgQuery["dates"] = `${data.minYear
    ? data.minYear : MIN_YEAR
    }-01-01,${data.maxYear
    ? data.maxYear : MAX_YEAR
    }-12-31`;
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
    return [null, rawgError, false];
  }

  const convertedGames =
    rawgGames?.results.map(convertRawgGameToGamePreview) ?? [];
  
  const hasMore = rawgGames.next !== null;
  
  return [convertedGames, null, hasMore];
}

