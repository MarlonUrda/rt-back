import { getPopularGames } from "./getPopularGames";
import e from "express";
import type { RouterGroup } from "../../types/server/RouterGroup";
import { token } from "../middleware/token";
import { getGameDetails } from "./getGame";
import { addComment, getComment } from "./Comments";

class SGamesGroup implements RouterGroup {
  public path = "/games";
  public router = e.Router();

  getRouter(): e.Router {
    this.router.use(token);
    this.router.get("/popular", getPopularGames);
    this.router.get("/:id", getGameDetails)
    this.router.get("/:id/comments", getComment)
    this.router.post("/:id/comments", addComment)
    return this.router;
  }
}

export default SGamesGroup;
