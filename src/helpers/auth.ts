import bcrypt from "bcrypt";
import { jwtUser } from "../types/api/jwtPayload";
import jwt from "jsonwebtoken";

export const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
}

export const generateToken = (user: jwtUser) => {
  const secret = process.env.JWT_SECRET ?? "";
  if (!secret) {
    throw new Error("No secret provided");
  }
  return jwt.sign({ user }, secret, { expiresIn: "24h" });
};
