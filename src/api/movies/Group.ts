import { popular } from "./Popular";
import e from "express";
import type { RouterGroup } from "../../types/server/RouterGroup";
import { token } from "../middleware/token";

class SMoviesGroup implements RouterGroup {
  public path = "/movies";
  public router = e.Router();

  getRouter(): e.Router {
    this.router.use(token);
    this.router.get("/popular", popular);
    return this.router;
  }
}

export default SMoviesGroup;
