import e from 'express'
import type { RouterGroup } from '../../types/server/RouterGroup'
import { deleteUser, updateUser } from './User'
import { token } from '../middleware/token'

class UserGroup implements RouterGroup {
  public path = '/user'
  public router = e.Router()

  getRouter(): e.Router {
    this.router.use(token)
    this.router.put('/:id', updateUser)
    this.router.delete('/:id', deleteUser)
    return this.router
  }
}

export default UserGroup