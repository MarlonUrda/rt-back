import e from "express";
import type { RouterGroup } from "../../types/server/RouterGroup";
import { login, register, checkEmail } from "./Login";
import { SendResetEmail, updatePassword, verifyResetCodes } from "./ResetPassword";

class AuthGroup implements RouterGroup {
  public path = "/auth";
  public router = e.Router();

  getRouter(): e.Router {
    this.router.post("/login", login);
    this.router.post("/register", register);
    this.router.post("/check-email", checkEmail);
    this.router.post("/send-reset-email", SendResetEmail);
    this.router.post("/verify-reset-code", verifyResetCodes);
    this.router.post("/reset-password", updatePassword)
    return this.router;
  }
}

export default AuthGroup;