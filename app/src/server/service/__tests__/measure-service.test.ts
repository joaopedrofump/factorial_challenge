import { Measure } from "src/common/model/measure";
import { IMeasureDAO } from "src/server/dao/imeasure-dao";
import { MeasureService } from "../measure-service";

const mockSaveMeasure = jest.fn();
const mockGetMeasurement = jest.fn();
const mockGetMeasurements = jest.fn();
const mockGetMeasurementMean = jest.fn();

const mockedMeasureDAO: IMeasureDAO = {
  saveMeasure: mockSaveMeasure,
  getMeasurements: mockGetMeasurements,
  getMeasurement: mockGetMeasurement,
  getMeasurementMean: mockGetMeasurementMean,
};

jest.mock("@influxdata/influxdb-client", () => ({
  ...jest.requireActual("@influxdata/influxdb-client"),
  InfluxDB: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe("measure service tests", () => {
  describe("when saving measure", () => {
    describe("and mesure is correctly saved", () => {
      it("should call dao function", async () => {
        const measureService = new MeasureService(mockedMeasureDAO);
        await measureService.saveMeasure("temperature", 10);
        expect(mockSaveMeasure).toHaveBeenCalledWith("temperature", 10);
      });
    });
  });

  describe("when getting all measures", () => {
    describe("and there is no error", () => {
      it("should return an object grouped by measurement", async () => {
        mockGetMeasurements.mockReturnValueOnce({
          m0: "mocked-values-m0",
          m1: "mocked-values-m1",
        });
        mockGetMeasurementMean.mockReturnValueOnce("mocked-mean0-0");
        mockGetMeasurementMean.mockReturnValueOnce("mocked-mean0-1");
        mockGetMeasurementMean.mockReturnValueOnce("mocked-mean0-2");

        mockGetMeasurementMean.mockReturnValueOnce("mocked-mean1-0");
        mockGetMeasurementMean.mockReturnValueOnce("mocked-mean1-1");
        mockGetMeasurementMean.mockReturnValueOnce("mocked-mean1-2");

        const measureService = new MeasureService(mockedMeasureDAO);
        const all = await measureService.getMeasurements();

        expect(all).toEqual([
          expect.objectContaining({
            measures: "mocked-values-m0",
            name: "m0",
            mean: {
              lastMin: "mocked-mean0-0",
              lastHour: "mocked-mean0-1",
              lastDay: "mocked-mean0-2",
            },
          }),
          expect.objectContaining({
            measures: "mocked-values-m1",
            name: "m1",
            mean: {
              lastMin: "mocked-mean1-0",
              lastHour: "mocked-mean1-1",
              lastDay: "mocked-mean1-2",
            },
          }),
        ]);
      });
    });
    describe("and there is an error", () => {
      describe("and the error is on getting measures", () => {
        it("should catch the error", async () => {
          mockGetMeasurements.mockRejectedValueOnce("Error");
          const measureService = new MeasureService(mockedMeasureDAO);
          await expect(measureService.getMeasurements()).rejects.toMatch(
            "Error"
          );
        });
      });
      describe("and the error is on getting mean", () => {
        it("should catch the error", async () => {
          mockGetMeasurements.mockResolvedValueOnce("mocked-measures");
          mockGetMeasurementMean.mockRejectedValue("Error");

          const measureService = new MeasureService(mockedMeasureDAO);
          await expect(measureService.getMeasurements()).rejects.toMatch(
            "Error"
          );
        });
      });
    });
  });

  describe("when getting all measures of one measurement", () => {
    describe("and there is no error", () => {
      it("should return an array", async () => {
        mockGetMeasurement.mockReturnValue("values");
        mockGetMeasurementMean.mockReturnValueOnce("mocked-mean0-0");
        mockGetMeasurementMean.mockReturnValueOnce("mocked-mean0-1");
        mockGetMeasurementMean.mockReturnValueOnce("mocked-mean0-2");
        const measureService = new MeasureService(mockedMeasureDAO);
        const measurement = await measureService.getMeasurement(
          "measurement-mocked-name"
        );
        expect(measurement).toEqual(
          expect.objectContaining({
            name: "measurement-mocked-name",
            measures: "values",
            mean: {
              lastMin: "mocked-mean0-0",
              lastHour: "mocked-mean0-1",
              lastDay: "mocked-mean0-2",
            },
          })
        );
      });
    });
    describe("and there is an error", () => {
      describe("and the error is on getting measure", () => {
        it("should catch the error", async () => {
          mockGetMeasurement.mockRejectedValueOnce("Error");
          const measureService = new MeasureService(mockedMeasureDAO);
          await expect(measureService.getMeasurement("")).rejects.toMatch(
            "Error"
          );
        });
      });
      describe("and the error is on getting mean", () => {
        it("should catch the error", async () => {
          mockGetMeasurement.mockResolvedValueOnce("mocked-measure");
          mockGetMeasurementMean.mockRejectedValue("Error");

          const measureService = new MeasureService(mockedMeasureDAO);
          await expect(measureService.getMeasurement("")).rejects.toMatch(
            "Error"
          );
        });
      });
    });
  });
});
