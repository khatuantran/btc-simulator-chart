import axios from "axios";
import "dotenv/config";
import moment from "moment-timezone";
import { CandleByDuration } from "../server";
import { TradingStep } from "../socket";

const { BINANCE_REST_END_POINT } = process.env;

export const enum KeyData {
  OpenTime = 0,
  OpenPrice = 1,
  HighPrice = 2,
  LowPrice = 3,
  ClosePrice = 4,
  CloseTime = 6,
}

export type CustomClientResponseData = {
  interval: TradingStep;
  high: number;
  low: number;
  close: number;
  open: number;
  start: string;
  end: string;
};

function mapClientData(data: Array<unknown[]>): Array<CustomClientResponseData> {
  return data.map(
    (d) =>
      ({
        interval: TradingStep.Second,
        high: d[KeyData.HighPrice],
        low: d[KeyData.LowPrice],
        close: d[KeyData.ClosePrice],
        open: d[KeyData.OpenPrice],
        start: moment(d[KeyData.OpenTime]).toISOString(),
        end: moment(d[KeyData.CloseTime]).toISOString(),
      }) as CustomClientResponseData,
  );
}

export const configGlobalBtcByDuration = async () => {
  try {
    const sURL = `${BINANCE_REST_END_POINT}/api/v3/klines?symbol=BTCUSDT&limit=100&interval=1s`;
    const mURL = `${BINANCE_REST_END_POINT}/api/v3/klines?symbol=BTCUSDT&limit=100&interval=1m`;
    const hURL = `${BINANCE_REST_END_POINT}/api/v3/klines?symbol=BTCUSDT&limit=100&interval=1h`;
    const dURL = `${BINANCE_REST_END_POINT}/api/v3/klines?symbol=BTCUSDT&limit=100&interval=1d`;

    const resp = await Promise.all([
      axios.get<unknown, { data: Array<unknown[]> }>(sURL),
      axios.get<unknown, { data: Array<unknown[]> }>(mURL),
      axios.get<unknown, { data: Array<unknown[]> }>(hURL),
      axios.get<unknown, { data: Array<unknown[]> }>(dURL),
    ]);

    CandleByDuration[TradingStep.Second] = mapClientData(resp[0].data);
    CandleByDuration[TradingStep.Minute] = mapClientData(resp[1].data);
    CandleByDuration[TradingStep.Hour] = mapClientData(resp[2].data);
    CandleByDuration[TradingStep.Day] = mapClientData(resp[3].data);

    return CandleByDuration;
  } catch (error) {
    console.log("error");
    return Promise.reject(error);
  }
};
