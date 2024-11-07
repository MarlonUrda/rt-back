// json web token
import jwt from "jsonwebtoken";
import e from "express";
import JwtPayloadWithUser from "../../types/api/jwtPayload";
import { isDevMode } from "../../main";

export function token(req: e.Request, res: e.Response, next: e.NextFunction) {
  const token = req.header("Authorization");

  if (isDevMode) {
    res.locals.user = {
      user: {
        email: "tomasymarlon@tm.com",
        role: "user",
      }
    } as JwtPayloadWithUser;
    next();
    return;
  }

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as JwtPayloadWithUser

    res.locals.user = decoded;

    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
}