import { getPopularGames, getNewGames, getHighestRatedGames } from "./getPopularGames";
import e from "express";
import type { RouterGroup } from "../../types/server/RouterGroup";

class PublicGamesGroup implements RouterGroup {
  public path = "/public/games";
  public router = e.Router();

  getRouter(): e.Router {
    this.router.get("/popular", getPopularGames);
    this.router.get("/new", getNewGames);
    this.router.get("/highest-rated", getHighestRatedGames);
    return this.router;
  }
}

export default PublicGamesGroup;
