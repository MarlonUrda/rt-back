import {Request, Response, NextFunction} from "express";
import User from "../../database/models/user";
import { loginRequestSchema, LoginResponse } from "../../types/api/login";
import { registerSchema, checkEmailSchema } from "../../types/api/register";
import { hashPassword, generateToken, comparePassword } from "../../helpers/auth";
import bcrypt from "bcrypt";


export async function login(req: Request, res: Response, next: NextFunction) {
  
  const {success, data} = loginRequestSchema.safeParse(req.body);

  if (!success || !data) {
    res.status(400).json({error: "Peticion invalida"});
    return
  }

  const user = await User.findByEmail(data.email);

  if (!user) {
    res.status(403).json({error: "Usuario o contraseña incorrectos"});
    return
  }

  const isValid = await comparePassword(data.password, user.password);

  if (!isValid) {
    res.status(403).json({error: "Usuario o contraseña incorrectos"});
    return
  }

  const token = generateToken({
    email: user.email,
    role: user.role,
  });

  const response: LoginResponse = {
    token,
    user: user.toJSON(),
  };
  res.status(200).json(response);
}

export async function checkEmail(req: Request, res: Response) {
  const {success, data} = checkEmailSchema.safeParse(req.body);

  if (!success || !data) {
    res.status(400).json({error: "Peticion invalida"});
    return
  }

  const existingUser = await User.findByEmail(data.email);

  if (existingUser) {
    res.status(200).json({available: false});
    return
  }

  res.status(200).json({available: true}); 
}


export async function register(req: Request, res: Response) {
  const {success, data, error} = registerSchema.safeParse(req.body);

  if (!success || !data) {
    res.status(400).json({error: error?.message ?? "Peticion invalida"});
    return
  }

  const existingUser = await User.findByEmail(data.email);

  if (existingUser) {
    res.status(409).json({error: "Usuario ya existe"});
    return
  }

  const hashedPassword = await hashPassword(data.password);

  const newUser = new User({
    email: data.email,
    password: hashedPassword,
    firstName: data.firstName,
    lastName: data.lastName,
  });

  await newUser.save();

  const token = generateToken(newUser);

  res.status(201).json({token, user: newUser.toJSON()});
}