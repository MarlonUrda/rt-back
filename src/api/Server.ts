import e from "express";
import AuthGroup from "./auth/Group";
import SGamesGroup from "./games/Group";
import UserGroup from "./user/Group";
import PublicGamesGroup from "./games/PublicGroup";

export class Server {
  private app: e.Application;
  private port: number;
  private address?: string;
  private static DEFAULT_ADDRESS = "127.0.0.1";

  constructor(port: number, address?: string) {
    this.app = e();
    this.port = port;
    this.address = address;
  }

  public start() {
    this.app.use(e.json());
    // logger
    this.app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });
    const authGroup = new AuthGroup();
    this.app.use(authGroup.path, authGroup.getRouter());

    const userGroup = new UserGroup();
    this.app.use(userGroup.path, userGroup.getRouter());

    const gamesGroup = new SGamesGroup();
    this.app.use(gamesGroup.path, gamesGroup.getRouter());

    const publicGamesGroup = new PublicGamesGroup();
    this.app.use(publicGamesGroup.path, publicGamesGroup.getRouter());

    this.app.get("/", (_, res) => {
      res.send("Hello World");
    });

    this.app.listen(this.port, () => {
      console.log(
        `Server listening on ${this.address || Server.DEFAULT_ADDRESS}:${
          this.port
        }`
      );
    });
  }
}
