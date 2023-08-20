import "dotenv/config";
import { Server, Socket } from "socket.io";
import { CandleByDuration } from "../server";
export enum TradingStep {
  Second = "1s",
  Minute = "1m",
  Hour = "1h",
  Day = "1d",
}

export const onConnection = (clientIO: Server, socket: Socket) => {
  console.log("New client connected");
  socket.on("trade-by-second", async (callBack: any) => {
    try {
      setInterval(() => {
        // console.log(CandleByDuration[TradingStep.Second][99]);
        clientIO.emit("trade-by-second", { data: CandleByDuration[TradingStep.Second] });
        callBack("start trading");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("trade-by-minute", async (callBack: any) => {
    try {
      setInterval(() => {
        clientIO.emit("trade-by-minute", { data: CandleByDuration[TradingStep.Minute] });
      }, 1000);
      callBack("start trading");
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("trade-by-hour", async (callBack: any) => {
    try {
      setInterval(() => {
        clientIO.emit("trade-by-hour", { data: CandleByDuration[TradingStep.Hour] });
      }, 5000);
      callBack("start trading");
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("trade-by-day", async (callBack: any) => {
    try {
      setInterval(() => {
        clientIO.emit("trade-by-day", { data: CandleByDuration[TradingStep.Day] });
      }, 5000);
      callBack("start trading");
    } catch (error) {
      console.log(error);
    }
  });
};
