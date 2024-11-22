import { Request, Response } from "express";
import { addGameRequestSchema, deleteFromPlaylistRequestSchema } from "../../types/api/playlist";
import JwtPayloadWithUser from "../../types/api/jwtPayload";
import Playlist from "../../database/models/playlist";
import { fetchRawg } from "../../helpers/fetchExternal";
import { RAWGPaths } from "../../helpers/RawgPaths";
import Game from "../../database/models/game";
import { gameDetails } from "../../types/api/games/gameDetails";
import { getSearchField } from "../../helpers/getSearchPath";
import { z } from "zod";

export const getPlaylist = async (_req: Request, res: Response) => {
  const { id } = _req.params;

  try {
    const playlist = await Playlist.findPlaylistByUserId(id)
    if (!playlist) {
      res.status(404).json({ error: "No se ha encontrado la playlist del usuario" });
      return;
    }
    
    res.status(200).json(playlist);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export const addGameToPlaylist = async (req: Request, res: Response) => {
  let newId: string;
  const { success, data, error } = addGameRequestSchema.safeParse(req.body);

  const user = res.locals.user as JwtPayloadWithUser;

  if (!success ||!data) {
    res.status(400).json({ error: error.message?? "Peticion invalida" });
    return;
  }

  if (!data.gameId) {
    res.status(400).json({ error: "No se ha encontrado un id de juego valido" });
    return;
  }

  try {

    const [searchField, castToNumber] = getSearchField(data.gameId);

    const searchValue = castToNumber ? Number(data.gameId) : data.gameId;

    const game = await Game.findOne({
      [searchField]: searchValue,
    });

    if (!game) {
      const [response, error] = await fetchRawg({
        path: RAWGPaths.gameDetails(Number(data.gameId)),
        method: "GET",
        responseSchema: gameDetails,
      }) as [z.infer<typeof gameDetails>, Error]

      if(!response){
        console.error(error);
        res.status(500).json({ error: "Error al buscar el juego en RAWG" });
        return;
      }

      const newGame = new Game({
        external_id: response.id,
        ...response,
        release_date: response.released ? new Date(response.released) : null,
      });

      await newGame.save();

      data.gameId = newGame._id as string;
      console.log(data.gameId)
    }

    if(game){
      data.gameId = game?._id as string;
    }

    const gameInPlaylist = await Playlist.findGame(user.user.id, data.gameId)

    if (gameInPlaylist) {
      console.log("nop")
      res.status(400).json({ error: "El juego ya se encuentra en la playlist" });
      return;
    }

    const add = await Playlist.addGame(user.user.id, data.gameId)

    if (!add) {
      const newPlaylist = new Playlist({
        gameIds: data.gameId,
        userId: user.user.id,
        user: {
          firstName: user.user.firstName,
          lastName: user.user.lastName,
          _id: user.user.id,
        }
      })

      await newPlaylist.save();

      res.status(200).json({ _id: newPlaylist._id });
    }

    if (add) {
      res.status(200).json({ _id: add.id });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al agregar el juego a la lista de reproduccion" });
  }
}

export const deleteGameFromPlaylist = async (_req: Request, res: Response) => {
  const { userId, id } = _req.params;

  if (!userId ||!id) {
    res.status(400).json({ error: "No se ha encontrado un id de usuario o juego valido" });
    return;
  }

  try {
    const deleted = await Playlist.removeGame(userId, id)

    if (!deleted) {
      res.status(404).json({ error: "No se ha encontrado el juego en la lista de reproduccion" });
      return;
    }

    res.status(200).json({ _id: deleted.id });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
}