import { Measure } from "src/common/model/measure";

import { InfluxDB, Point } from "@influxdata/influxdb-client";

import { IMeasureDAO } from "./imeasure-dao";

const URL = process.env.INFLUXDB_URL ?? "";
const TOKEN = process.env.DOCKER_INFLUXDB_INIT_ADMIN_TOKEN;
const ORG = process.env.DOCKER_INFLUXDB_INIT_ORG ?? "";
const BUCKET = process.env.DOCKER_INFLUXDB_INIT_BUCKET ?? "";

class MeasureDAO implements IMeasureDAO {
 
  influxDB = new InfluxDB({
    url: URL,
    token: TOKEN,
  });

  async getMeasurements(): Promise<Record<string, Measure[]>> {
    const fluxQuery = `
    from(bucket: "factorial")
      |> range(start: -30d)    
  `;

    try {
      const allFlat = await this.getFromDB(fluxQuery);

      const grouped = allFlat.reduce(
        (accumulator: Record<string, Measure[]>, current: Measure) => {
          if (current.measurement in accumulator) {
            accumulator[current.measurement].push(current);
          } else {
            accumulator[current.measurement] = [current];
          }

          return accumulator;
        },
        {}
      );

      return grouped;
    } catch (err) {
      return Promise.reject(err);
    }
  }
  async getMeasurement(measurement: string): Promise<Measure[]> {
    const fluxQuery = `
      from(bucket: "factorial")
        |> range(start: -30d)
        |> filter(fn: (r) => r["_measurement"] == "${measurement}")  
    `;

    try {
      return await this.getFromDB(fluxQuery);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getMeasurementMean(
    measurement: string,
    time: number,
    granularity: "d" | "h" | "m"
  ): Promise<number> {
    try {
      const query = `from(bucket: "factorial")
        |> range(start: -${`${time}${granularity}`})
        |> filter(fn: (r) => r["_measurement"] == "${measurement}")
        |> aggregateWindow(every: ${`${time}${granularity}`}, fn: mean, createEmpty: false)
        |> yield(name: "mean")`;

      const result = await this.getFromDB(query);

      return result?.[0]?.value;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  getFromDB(query: string): Promise<Measure[]> {
    const queryAPI = this.influxDB.getQueryApi(
      process.env.DOCKER_INFLUXDB_INIT_ORG ?? ""
    );

    const result: Measure[] = [];

    return new Promise((res, rej) => {
      const next = (row: string[], tableMeta: any) => {
        const raw = tableMeta.toObject(row);
        result.push(new Measure(raw));
      };

      const error = (error: Error) => {
        rej(error);
      };

      const complete = () => {
        res(result);
      };

      queryAPI.queryRows(query, { next, error, complete });
    });
  }

  async saveMeasure(measurement: string, value: number) {
    const writeAPI = this.influxDB.getWriteApi(ORG, BUCKET);

    const point: Point = new Point(measurement).floatField("value", value);

    writeAPI.writePoint(point);

    await writeAPI.flush();
    writeAPI.close();
  }

}

export { MeasureDAO };
