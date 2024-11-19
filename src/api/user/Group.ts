import e from 'express'
import type { RouterGroup } from '../../types/server/RouterGroup'

class UserGroup implements RouterGroup {
  public path = '/user'
  public router = e.Router()

  getRouter(): e.Router {
    this.router.put('/:id')
    this.router.delete('/:id')
    return this.router
  }
}