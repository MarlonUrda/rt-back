import { Request, Response } from "express";
import { standardMovieResponse } from "../../types/api/tmdb/standardMovieResponse";
import { fetchTMDB } from "../../helpers/fetchExternal";
import { TMDBPaths } from "../../helpers/TMDBPaths";

export const popular = async (_: Request, res: Response) => {
  const [response, error] = await fetchTMDB({
    path: TMDBPaths.popular,
    method: "GET",
    responseSchema: standardMovieResponse,
  });

  if (error || !response) {
    res.status(500).json({ error: "Error al obtener peliculas" });
    return;
  }

  res.status(200).json(response);
  
};
