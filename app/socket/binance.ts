import moment from "moment-timezone";
import { WebSocket } from "ws";
import { TradingStep } from ".";
import { CustomClientResponseData } from "../util";

let sIO: WebSocket = null;
let mIO: WebSocket = null;
let hIO: WebSocket = null;
let dIO: WebSocket = null;

export const createSocketBinance = (tradingData: Record<TradingStep, Array<CustomClientResponseData>>) => {
  try {
    console.log("chay vo da");
    sIO = new WebSocket(`${process.env.BINANCE_BASE_END_POINT}/ws/btcusdt@kline_1s`);
    mIO = new WebSocket(`${process.env.BINANCE_BASE_END_POINT}/ws/btcusdt@kline_1m`);
    hIO = new WebSocket(`${process.env.BINANCE_BASE_END_POINT}/ws/btcusdt@kline_1h`);
    dIO = new WebSocket(`${process.env.BINANCE_BASE_END_POINT}/ws/btcusdt@kline_1d`);

    sIO.onmessage = ({ data }) => {
      try {
        const jsonData = JSON.parse(data as string);
        const oldData = tradingData[TradingStep.Second];
        oldData.shift();
        const length = tradingData[TradingStep.Second].length;
        const newTime = moment(oldData[length - 1].end).add(1, "second");
        oldData.push({
          interval: TradingStep.Second,
          high: jsonData.k.h,
          low: jsonData.k.l,
          close: jsonData.k.c,
          open: jsonData.k.o,
          start: newTime.startOf("second").toISOString(),
          end: newTime.endOf("second").toISOString(),
        } as CustomClientResponseData);
      } catch (error) {
        console.log(error);
      }
    };

    mIO.onmessage = ({ data }) => {
      try {
        const jsonData = JSON.parse(data as string);
        const now = moment();
        const lastEndTime = moment(jsonData.k.T);
        const isAfterInterval = lastEndTime.isBefore(now);

        if (isAfterInterval) {
          const oldData = tradingData[TradingStep.Minute];
          oldData.shift();
          const length = tradingData[TradingStep.Minute].length;
          const newTime = moment(oldData[length - 1].end).add(1, "minute");
          oldData.push({
            interval: TradingStep.Minute,
            high: jsonData.k.h,
            low: jsonData.k.l,
            close: jsonData.k.c,
            open: jsonData.k.o,
            start: newTime.startOf("minute").toISOString(),
            end: newTime.endOf("minute").toISOString(),
          } as CustomClientResponseData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    hIO.onmessage = ({ data }) => {
      try {
        const jsonData = JSON.parse(data as string);
        const now = moment();
        const lastEndTime = moment(jsonData.k.T);
        const isAfterInterval = lastEndTime.isBefore(now);

        if (isAfterInterval) {
          const oldData = tradingData[TradingStep.Hour];
          oldData.shift();
          const length = tradingData[TradingStep.Hour].length;
          const newTime = moment(oldData[length - 1].end).add(1, "hour");
          oldData.push({
            interval: TradingStep.Hour,
            high: jsonData.k.h,
            low: jsonData.k.l,
            close: jsonData.k.c,
            open: jsonData.k.o,
            start: newTime.startOf("hour").toISOString(),
            end: newTime.endOf("hour").toISOString(),
          } as CustomClientResponseData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    dIO.onmessage = ({ data }) => {
      try {
        const jsonData = JSON.parse(data as string);
        const now = moment();
        const lastEndTime = moment(jsonData.k.T);
        const isAfterInterval = lastEndTime.isBefore(now);

        if (isAfterInterval) {
          const oldData = tradingData[TradingStep.Day];
          oldData.shift();
          const length = tradingData[TradingStep.Day].length;
          const newTime = moment(oldData[length - 1].end).add(1, "second");
          oldData.push({
            interval: TradingStep.Day,
            high: jsonData.k.h,
            low: jsonData.k.l,
            close: jsonData.k.c,
            open: jsonData.k.o,
            start: newTime.startOf("date").toISOString(),
            end: newTime.endOf("date").toISOString(),
          } as CustomClientResponseData);
        }
      } catch (error) {
        console.log(error);
      }
    };
  } catch (error) {
    throw error;
  }
};
