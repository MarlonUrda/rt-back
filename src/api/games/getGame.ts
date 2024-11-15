import { Request, Response } from "express";
import { gameDetails, screenshots } from "../../types/api/games/gameDetails";
import { RAWGPaths } from "../../helpers/RawgPaths";
import { fetchRawg } from "../../helpers/fetchExternal";

export const getGameDetails = async (_req: Request, res: Response) => {
  console.log("getGameDetails")
  const { id } = _req.params;
  console.log(id);
  if (!id) {
    res.status(400).json({ error: "Debes proporcionar un id de juego" });
    return;
  }
  const [response, error] = await fetchRawg({
    path: RAWGPaths.gameDetails(Number(id)),
    method: "GET",
    responseSchema: gameDetails,
  })

  if(!response){
    res.status(500).json({ error: "Error al obtener detalles del juego" });
    return;
  }

  res.status(200).json(response);
}

export const getGameScreenShots = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  if (!id) {
    res.status(400).json({ error: "Debes proporcionar un id de juego" });
    return;
  }
  const [response, error] = await fetchRawg({
    path: RAWGPaths.gameScreenShots(Number(id)),
    method: "GET",
    responseSchema: screenshots,
  })

  if(!response){
    res.status(500).json({ error: "Error al obtener screenshots del juego" });
    return;
  }

  res.status(200).json(response);
}
