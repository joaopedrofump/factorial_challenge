import { singletonHttpService } from "src/client/service/http-service";
import { Measurement } from "src/common/model/measure";

const saveMeasure: (
  measurement: string,
  value: number
) => Promise<string> = async (measure: string, value: number) => {
  try {
    await singletonHttpService.post(`measurement/${measure}`, {
      measure,
      value,
    });
    return Promise.resolve("success");
  } catch (err) {
    return Promise.reject(err);
  }
};

const getAllMeasures = async (): Promise<Measurement[]> => {
  try {
    const allData = await singletonHttpService.get("measurement");
    return allData;
  } catch (err) {
    return Promise.reject(err);
  }
};

const getMeasure = async (measurement: string): Promise<Measurement> => {

  try {
    const allData = await singletonHttpService.get(`measurement/${measurement}` );
    return allData;
  } catch (err) {
    return Promise.reject(err);
  }

}

export { saveMeasure, getAllMeasures, getMeasure };
