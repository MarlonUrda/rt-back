import { Request, Response } from "express";
import {
  gameDetails,
  gameScreenshots,
} from "../../types/api/games/gameDetails";
import { z } from "zod";
import { RAWGPaths } from "../../helpers/RawgPaths";
import { fetchRawg } from "../../helpers/fetchExternal";
import Game from "../../database/models/game";
import { getSearchField } from "../../helpers/getSearchPath";

export const getGameDetails = async (_req: Request, res: Response) => {
  console.log("getGameDetails");
  const { id } = _req.params;
  if (!id) {
    res.status(400).json({ error: "Debes proporcionar un id de juego" });
    return;
  }
  const [searchField, castToNumber] = getSearchField(id);

  const searchValue = castToNumber ? Number(id) : id;

  const game = await Game.findOne({
    [searchField]: searchValue,
  });

  if (game) {
    res.status(200).json(game.toJSON());
    return;
  }


  const [response, error] = await fetchRawg({
    path: RAWGPaths.gameDetails(Number(id)),
    method: "GET",
    responseSchema: gameDetails,
  }) as [z.infer<typeof gameDetails>, Error]
  ;

  if (!response) {
    res.status(500).json({ error: "Error getting game details." });
    return;
  }



  const newGame = new Game({
    external_id: response.id,
    ...response,
    release_date: response.released !== "Not released" ? new Date(response.released) : null,
  });
  res.status(200).json(newGame.toJSON());

  console.log("saving game to db");

  await newGame.save();
};

export const getGameScreenShots = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  if (!id) {
    res.status(400).json({ error: "You must provide a game id" });
    return;
  }
  const [response, error] = await fetchRawg({
    path: RAWGPaths.gameScreenShots(Number(id)),
    method: "GET",
    responseSchema: gameScreenshots,
  });

  if (!response) {
    res.status(500).json({ error: "Error getting screenshots of the game." });
    return;
  }

  res.status(200).json(response);
};

