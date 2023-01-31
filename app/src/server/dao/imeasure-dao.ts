import { Measure } from "src/common/model/measure";

interface IMeasureDAO {
  getMeasurements(): Promise<Record<string, Measure[]>>;
  getMeasurement(measurement: string): Promise<Measure[]>;
  getMeasurementMean(
    measurement: string,
    time: number,
    timeType: "d" | "h" | "m"
  ): Promise<number>;
  saveMeasure(measurement: string, value: number): Promise<void>;
}

export type { IMeasureDAO };
