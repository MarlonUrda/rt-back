import { Server } from "./api/Server";
import mongoose from "mongoose";
import 'module-alias/register';
import { IUser } from "./database/models/user";
import "dotenv/config";

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI!);
  const server = new Server(process.env.PORT ? parseInt(process.env.PORT) : 3000, process.env.ADDRESS);
  server.start();
}
start();

