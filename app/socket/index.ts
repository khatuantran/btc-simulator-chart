import "dotenv/config";
import { Server, Socket } from "socket.io";
import { WebSocket } from "ws";
export enum TradingStep {
  Second = "1s",
  Minute = "1m",
  Hour = "1h",
  Day = "1d",
}

export type DataTradingView = {
  step: TradingStep;
};

export const onConnection = (clientIO: Server, socket: Socket) => {
  console.log("Client connect");
  socket.on("trade", async (data: DataTradingView, callBack: any) => {
    try {
      const binanceIO = new WebSocket(`${process.env.BINANCE_BASE_END_POINT}/ws/btcusdt@kline_5m`);
      binanceIO.onmessage = ({ data }) => {
        socket.emit("new-data", { data });
      };
    } catch (error) {
      console.log(error);
    }
  });
};
