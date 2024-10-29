import e from "express";

export class Server {
  private app: e.Application;
  private port: number;

  constructor(port: number) {
    this.app = e();
    this.port = port;
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}

