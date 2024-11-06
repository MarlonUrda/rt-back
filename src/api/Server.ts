import e from "express";
import AuthGroup from "./auth/Group";
import SMoviesGroup from "./movies/Group";

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

    const moviesGroup = new SMoviesGroup();
    this.app.use(moviesGroup.path, moviesGroup.getRouter());

    this.app.get("/", (_, res) => {
      res.send("Hello World");
    });

    this.app.listen(this.port, this.address ?? Server.DEFAULT_ADDRESS, () => {
      console.log(
        `Server listening on ${this.address || Server.DEFAULT_ADDRESS}:${
          this.port
        }`
      );
    });
  }
}
