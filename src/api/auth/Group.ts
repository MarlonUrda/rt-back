import e from "express";
import type { RouterGroup } from "../../types/server/RouterGroup";
import { login, register, checkEmail } from "./Login";

class AuthGroup implements RouterGroup {
  public path = "/auth";
  public router = e.Router();

  getRouter(): e.Router {
    this.router.post("/login", login);
    this.router.post("/register", register);
    this.router.post("/check-email", checkEmail);
    return this.router;
  }
}

export default AuthGroup;