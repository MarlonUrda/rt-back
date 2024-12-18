import e from 'express'
import type { RouterGroup } from '../../types/server/RouterGroup'
import { deleteUser, updateUser } from './User'
import { token } from '../middleware/token'
import { addGameToPlaylist, deleteGameFromPlaylist, getPlaylist, getSimplePlaylist } from "./Playlist";

class UserGroup implements RouterGroup {
  public path = '/user'
  public router = e.Router()

  getRouter(): e.Router {
    this.router.use(token)
    this.router.put('/:id', updateUser)
    this.router.delete('/:id', deleteUser)
    this.router.get("/:id/playlist", getPlaylist)
    this.router.get("/playlist/simple", getSimplePlaylist)
    this.router.post("/playlist", addGameToPlaylist);
    this.router.delete("/:userId/playlist/:id", deleteGameFromPlaylist);
    return this.router
  }
}

export default UserGroup