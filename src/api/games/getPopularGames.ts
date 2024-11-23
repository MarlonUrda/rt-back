import { Request, Response } from "express";
import { fetchRawg } from "../../helpers/fetchExternal";
import { RAWGPaths } from "../../helpers/RawgPaths";
import { standardGameResponse } from "../../types/api/games/standardGameResponse";
import Game from "../../database/models/game";
import { gamePreviewProjection, gamePreview } from "../../types/api/games/gamePreview";
import { z } from "zod";

export const getPopularGames = async (_req: Request, res: Response) => {
  const games = await Game.find().sort({ added: -1 }).limit(10).select(gamePreviewProjection) as z.infer<typeof gamePreview>[];


  const response: z.infer<typeof standardGameResponse> = {
    count: games.length,
    results: games,
  };

  res.status(200).json(response);
};

export const getNewGames = async (_req: Request, res: Response) => {
  const games = await Game.find().sort({ release_date: -1 }).limit(10).select(gamePreviewProjection) as z.infer<typeof gamePreview>[];


  const response: z.infer<typeof standardGameResponse> = {
    count: games.length,
    results: games,
  };

  res.status(200).json(response);
}

export const getHighestRatedGames = async (_req: Request, res: Response) => {
  const games = await Game.find().sort({ mt_rating_user: -1 }).limit(10).select(gamePreviewProjection) as z.infer<typeof gamePreview>[];

  const response: z.infer<typeof standardGameResponse> = {
    count: games.length,
    results: games,
  };

  res.status(200).json(response);
}
