import { Measure, Measurement } from "src/common/model/measure";

interface IMeasureService {
  getMeasurements(): Promise<Measurement[]>;
  getMeasurement(measurement: string): Promise<Measurement>;
  saveMeasure(measurement: string, value: number): Promise<void>;
}

export type { IMeasureService };
