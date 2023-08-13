import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import moment from "moment-timezone";
import path from "path";
import { KerasModel, loadKerasModel } from "./model";

const app: Express = express();
let kerasModel: KerasModel = null;

app.use(cors());
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
      date: today,
      high: 10000,
      low: 9900,
      close: 9956,
      open: 9800,
    });
  } catch (error) {
    return next(error);
  }
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
    kerasModel = await loadKerasModel();
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

connectDBAndStartServer();
