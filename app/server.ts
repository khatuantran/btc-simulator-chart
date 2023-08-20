import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import http from "http";
import moment from "moment-timezone";
import path from "path";
import { Server } from "socket.io";
import { KerasModel } from "./model";
import { TradingStep, createSocketBinance, onConnection } from "./socket";
import { CustomClientResponseData, configGlobalBtcByDuration } from "./util";

const app: Express = express();
const server = http.createServer(app);

export const CandleByDuration: Record<TradingStep, Array<CustomClientResponseData>> = {
  [TradingStep.Second]: [],
  [TradingStep.Minute]: [],
  [TradingStep.Hour]: [],
  [TradingStep.Day]: [],
};

const clientIO = new Server(server, {
  cors: {
    origin: "*",
  },
});

let kerasModel: KerasModel = null;
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/next-candle-xgboost", async (req, res, next) => {
  try {
    // kerasModel.closeModel.predict()
    // const today = await
    const today = moment().tz("Asia/Ho_Chi_Minh");
    return res.status(200).json({
      step: today,
      high: 10000,
      low: 9900,
      close: 9956,
      open: 9800,
    });
  } catch (error) {
    return next(error);
  }
});

app.get("/test-socket", async (req, res, next) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.use((req, res) => {
  return res.status(404).json({
    error: {
      status: 404,
      message: "Not found",
    },
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err.message });
});

const connectDBAndStartServer = async () => {
  const port = process.env.PORT || 3000;
  try {
    const tradingData = await configGlobalBtcByDuration();
    createSocketBinance(tradingData);
    server.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
    clientIO.on("connection", (socket) => onConnection(clientIO, socket));
  } catch (err) {
    console.log(err);
  }
};

connectDBAndStartServer();
