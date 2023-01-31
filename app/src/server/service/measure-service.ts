import { Measure, Measurement } from "src/common/model/measure";
import { MeasureDAO } from "src/server/dao/measures-dao";
import { IMeasureDAO } from "../dao/imeasure-dao";
import { IMeasureService } from "./imeasure-service";

class MeasureService implements IMeasureService {
  measureDAO: IMeasureDAO;

  constructor(measureDAO: IMeasureDAO) {
    this.measureDAO = measureDAO;
  }

  async makeMean(measurement: string) {
    try {
      const meanLastMinute = this.measureDAO.getMeasurementMean(
        measurement,
        1,
        "m"
      );
      const meanLastHour = this.measureDAO.getMeasurementMean(
        measurement,
        1,
        "h"
      );
      const meanLastDay = this.measureDAO.getMeasurementMean(
        measurement,
        1,
        "d"
      );

      const means = await Promise.all([
        meanLastMinute,
        meanLastHour,
        meanLastDay,
      ]);

      const mean = {
        lastMin: means[0],
        lastHour: means[1],
        lastDay: means[2],
      };

      return mean;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getMeasurements(): Promise<Measurement[]> {
    try {
      const allMeasures = await this.measureDAO.getMeasurements();

      const result: Measurement[] = Object.keys(allMeasures).map((key) => {
        const measurement: Measurement = {
          name: key,
          measures: allMeasures[key],
        };
        return measurement;
      });

      const meanPromises = result.map(({ name }) => {
        return this.makeMean(name);
      });

      const allMeans = await Promise.all(meanPromises.flat());

      result.forEach((measurement, index) => {
        measurement.mean = allMeans[index];
      });

      return result;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getMeasurement(measurement: string): Promise<Measurement> {
    try {
      const measures = await this.measureDAO.getMeasurement(measurement);

      const result: Measurement = {
        name: measurement,
        measures,
      };

      const mean = await this.makeMean(measurement);
      result.mean = mean;

      return result;
    } catch (err) {
      return Promise.reject(err);
    }
  }
  saveMeasure(measurement: string, value: number): Promise<void> {
    return this.measureDAO.saveMeasure(measurement, value);
  }
}

const singletonMeasureService = new MeasureService(new MeasureDAO());

export { MeasureService, singletonMeasureService };
