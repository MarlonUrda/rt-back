import { getPopularGames } from "./getPopularGames";
import e from "express";
import type { RouterGroup } from "../../types/server/RouterGroup";
import { token } from "../middleware/token";
import { getGameDetails, getGameScreenShots } from "./getGame";
import {
  createReview,
  deleteReview,
  getGameReviews,
  updateReview,
} from "./Reviews";

class SGamesGroup implements RouterGroup {
  public path = "/games";
  public router = e.Router();

  getRouter(): e.Router {
    this.router.use(token);
    this.router.get("/popular", getPopularGames);
    this.router.get("/:id", getGameDetails);
    this.router.get("/:id/screenshots", getGameScreenShots);
    this.router.get("/:id/reviews", getGameReviews);
    this.router.post("/:id/reviews", createReview);
    this.router.put("/:id/reviews/:id", updateReview);
    this.router.delete("/:id/reviews/:id", deleteReview);
    return this.router;
  }
}

export default SGamesGroup;
