import { Request, Response } from "express";
import {
  gameDetails,
  gameScreenshots,
} from "../../types/api/games/gameDetails";
import { RAWGPaths } from "../../helpers/RawgPaths";
import { fetchRawg } from "../../helpers/fetchExternal";
import Game from "../../database/models/game";

export const getGameDetails = async (_req: Request, res: Response) => {
  console.log("getGameDetails");
  const { id } = _req.params;
  if (!id) {
    res.status(400).json({ error: "Debes proporcionar un id de juego" });
    return;
  }
  const game = await Game.findByExternalId(Number(id));

  console.log("`game", game);

  if (game) {
    res.status(200).json(game.toJSON());
    return;
  }


  const [response, error] = await fetchRawg({
    path: RAWGPaths.gameDetails(Number(id)),
    method: "GET",
    responseSchema: gameDetails,
  });

  if (!response) {
    res.status(500).json({ error: "Error al obtener detalles del juego" });
    return;
  }

  const newGame = new Game({
    external_id: response.id,
    ...response,
  });
  res.status(200).json(newGame.toJSON());

  console.log("saving game to db");

  await newGame.save();
};

export const getGameScreenShots = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  if (!id) {
    res.status(400).json({ error: "Debes proporcionar un id de juego" });
    return;
  }
  const [response, error] = await fetchRawg({
    path: RAWGPaths.gameScreenShots(Number(id)),
    method: "GET",
    responseSchema: gameScreenshots,
  });

  if (!response) {
    res.status(500).json({ error: "Error al obtener screenshots del juego" });
    return;
  }

  res.status(200).json(response);
};
