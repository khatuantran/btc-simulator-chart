import * as tf from "@tensorflow/tfjs";
import { readFile } from "fs/promises";
import path from "path";

export class KerasModel {
  public openModel: tf.LayersModel;
  public highModel: tf.LayersModel;
  public lowModel: tf.LayersModel;
  public closeModel: tf.LayersModel;
  constructor(open, high, low, close) {
    this.openModel = open;
    this.highModel = high;
    this.lowModel = low;
    this.closeModel = close;
  }
}

export const loadKerasModel: () => Promise<KerasModel> = async () => {
  try {
    const [open, high, low, close] = await Promise.all([
      readFile(path.join(__dirname, "xgboost-open.json")),
      readFile(path.join(__dirname, "xgboost-high.json")),
      readFile(path.join(__dirname, "xgboost-low.json")),
      readFile(path.join(__dirname, "xgboost-close.json")),
    ]);

    const kerasModel = new KerasModel(open, high, low, close);
    return kerasModel;
  } catch (error) {
    return Promise.reject(error);
  }
};
