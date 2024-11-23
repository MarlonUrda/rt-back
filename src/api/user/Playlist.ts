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
      res.status(404).json({ error: "User playlist not found." });
      return;
    }
    
    res.status(200).json(playlist);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export const getSimplePlaylist = async (req: Request, res: Response) => {
  // only returns the game ids
  const user = res.locals.user as JwtPayloadWithUser;

  try {
    const playlist = await Playlist.simpleFindPlaylistByUserId(
      user.user.id
    )
    if (!playlist) {
      res.status(404).json({ error: "User playlist not found." });
      return;
    }

    res.status(200).json(playlist);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export const addGameToPlaylist = async (req: Request, res: Response) => {
  let newId: string;
  const { success, data, error } = addGameRequestSchema.safeParse(req.body);

  const user = res.locals.user as JwtPayloadWithUser;

  if (!success ||!data) {
    res.status(400).json({ error: error.message?? "Invalid Request." });
    return;
  }

  if (!data.gameId) {
    res.status(400).json({ error: "Game id invalid." });
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
        res.status(500).json({ error: "Error searching game." });
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
      res.status(400).json({ error: "The game its already in the playlist" });
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
    res.status(500).json({ error: "Error adding game to the playlist" });
  }
}

export const deleteGameFromPlaylist = async (_req: Request, res: Response) => {
  const { userId, id } = _req.params;

  if (!userId ||!id) {
    res.status(400).json({ error: "Either user id or game id are not valid." });
    return;
  }

  try {
    const deleted = await Playlist.removeGame(userId, id)

    if (!deleted) {
      res.status(404).json({ error: "Game not found in your playlist." });
      return;
    }

    res.status(200).json({ _id: deleted.id });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Internal server error." })
  }
}