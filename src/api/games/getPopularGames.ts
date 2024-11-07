import { Request, Response } from "express";
import { fetchRawg } from "../../helpers/fetchExternal";
import { RAWGPaths } from "../../helpers/RawgPaths";
import { standardGameResponse } from "../../types/api/games/standardGameResponse";

export const getPopularGames = async (_req: Request, res: Response) => {
  const [response, error] = await fetchRawg({
    path: RAWGPaths.popular(1),
    method: "GET",
    responseSchema: standardGameResponse,
  });

  if (error || !response) {
    res.status(500).json({ error: "Error al obtener peliculas" });
    return;
  }

  res.status(200).json(response);
};
