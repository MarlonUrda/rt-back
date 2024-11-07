import { getPopularGames } from "./getPopularGames";
import e from "express";
import type { RouterGroup } from "../../types/server/RouterGroup";
import { token } from "../middleware/token";

class SGamesGroup implements RouterGroup {
  public path = "/games";
  public router = e.Router();

  getRouter(): e.Router {
    this.router.use(token);
    this.router.get("/popular", getPopularGames);
    return this.router;
  }
}

export default SGamesGroup;
