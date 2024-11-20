import { Request, Response } from "express";
import { addGameRequestSchema, deleteFromPlaylistRequestSchema } from "../../types/api/playlist";
import JwtPayloadWithUser from "../../types/api/jwtPayload";
import Playlist from "../../database/models/playlist";

export const getPlaylist = async (_req: Request, res: Response) => {
  const { id } = _req.params;
  console.log(id)

  try {
    const playlist = await Playlist.findById(id)
    if (!playlist) {
      res.status(404).json({ error: "No se ha encontrado la playlist del usuario" });
      return;
    }

    res.status(200).json(playlist || []);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export const addGameToPlaylist = async (req: Request, res: Response) => {
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

export const deleteGameFromPlaylist = async (req: Request, res: Response) => {
  const { success, data, error } = deleteFromPlaylistRequestSchema.safeParse(req.body);

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
    const deletedGame = await Playlist.removeGame(user.user.id, data.gameId);

    if (!deletedGame) {
      res.status(404).json({ error: "El juego no se encuentra en la playlist" });
      return;
    }

    res.status(200).json({ _id: deletedGame.id });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al eliminar el juego de la playlist" });
  }
}