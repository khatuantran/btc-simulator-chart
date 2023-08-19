import express, { Express } from "express";
import http from "http";
import { Server } from "socket.io";
describe("my awesome project", () => {
  let app: Express = null;
  let server: http.Server = null;
  let clientIO: Server = null;
  beforeAll((done) => {
    app = express();
    server = http.createServer(app);

    app.listen(3000, () => {
      console.log(`Listening on port ${3000}`);
    });

    clientIO = new Server(server, {
      cors: {
        origin: "*",
      },
    });
  });

  afterAll(() => {
    clientIO.close();
    server.close();
  });
});
