import { MeasureDAO } from "src/server/dao/measures-dao";

const mockQueryRows = jest.fn<void, [string, any]>();
const mockWritePoint = jest.fn();
const mockFlush = jest.fn();
const mockClose = jest.fn();

const mockTransform = {
  toObject: (row: string[]) => {
    return {
      _measurement: row[0],
      _value: row[1],
      _time: row[2],
    };
  },
};

jest.mock("@influxdata/influxdb-client", () => ({
  ...jest.requireActual("@influxdata/influxdb-client"),
  InfluxDB: jest.fn().mockImplementation(() => ({
    getQueryApi: () => ({
      queryRows: mockQueryRows,
    }),
    getWriteApi: () => ({
      writePoint: mockWritePoint,
      flush: mockFlush,
      close: mockClose,
    }),
  })),
}));

beforeEach(() => {
  mockQueryRows.mockReset();
});

describe("Measure DAO tests", () => {
  describe("when saving data", () => {
    it("should call correct functions of api", async () => {
      const measureDAO = new MeasureDAO();

      await measureDAO.saveMeasure("temperature", 10);
      expect(mockWritePoint).toHaveBeenCalledWith(
        expect.objectContaining({
          fields: expect.objectContaining({
            value: "10",
          }),
          name: "temperature",
        })
      );
      expect(mockFlush).toHaveBeenCalledTimes(1);
      expect(mockClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("when getting data", () => {
    describe("and data is returend succssfully", () => {
      it("should return an array of Measurements", async () => {
        mockQueryRows.mockImplementationOnce((_, { next, complete }) => {
          next(
            ["temperature", 10, "2022-12-28T11:02:21.919950839Z"],
            mockTransform
          );
          next(
            ["temperature", 11, "2022-12-28T11:05:21.919950839Z"],
            mockTransform
          );
          next(
            ["temperature", 12, "2022-12-28T11:10:21.919950839Z"],
            mockTransform
          );
          complete();
        });

        const meaureDAO = new MeasureDAO();

        const data = await meaureDAO.getFromDB("");

        expect(data).toHaveLength(3);

        expect(data[0]).toEqual(
          expect.objectContaining({
            value: 10,
            measurement: "temperature",
          })
        );

        expect(new Date(data[0].timestamp).toISOString()).toBe(
          "2022-12-28T11:02:21.919Z"
        );

        expect(data[1]).toEqual(
          expect.objectContaining({
            value: 11,
            measurement: "temperature",
          })
        );

        expect(new Date(data[1].timestamp).toISOString()).toBe(
          "2022-12-28T11:05:21.919Z"
        );

        expect(data[2]).toEqual(
          expect.objectContaining({
            value: 12,
            measurement: "temperature",
          })
        );

        expect(new Date(data[2].timestamp).toISOString()).toBe(
          "2022-12-28T11:10:21.919Z"
        );
      });
    });

    describe("and  there is an error", () => {
      it("promise should reject with the error", async () => {
        mockQueryRows.mockImplementationOnce((_, { error }) => {
          error("Error fetching data");
        });

        const measureDAO = new MeasureDAO();

        await expect(measureDAO.getFromDB("")).rejects.toMatch(
          "Error fetching data"
        );
      });
    });
  });

  describe("when getting all measures", () => {
    describe("and there is no error", () => {
      it("should return an object grouped by measurement", async () => {
        mockQueryRows.mockImplementationOnce((_, { next, complete }) => {
          next(
            ["temperature", 10, "2022-12-28T11:02:21.919950839Z"],
            mockTransform
          );
          next(
            ["temperature", 12, "2022-12-28T11:03:21.919950839Z"],
            mockTransform
          );
          next(
            ["humidity", 60, "2022-12-28T11:02:21.919950839Z"],
            mockTransform
          );
          next(
            ["humidity", 70, "2022-12-28T11:03:21.919950839Z"],
            mockTransform
          );
          next(
            ["humidity", 80, "2022-12-28T11:04:21.919950839Z"],
            mockTransform
          );
          complete();
        });

        const measureDAO = new MeasureDAO();

        const all = await measureDAO.getMeasurements();

        expect(all).toEqual(
          expect.objectContaining({
            temperature: [
              expect.objectContaining({
                measurement: "temperature",
                value: 10,
              }),
              expect.objectContaining({
                measurement: "temperature",
                value: 12,
              }),
            ],
            humidity: [
              expect.objectContaining({
                measurement: "humidity",
                value: 60,
              }),
              expect.objectContaining({
                measurement: "humidity",
                value: 70,
              }),
              expect.objectContaining({
                measurement: "humidity",
                value: 80,
              }),
            ],
          })
        );
      });
    });

    describe("and there is an error", () => {
      it("should reject with error", async () => {
        mockQueryRows.mockImplementationOnce((_, { error }) => {
          error("Error");
        });
        const measureDAO = new MeasureDAO();
        await expect(measureDAO.getMeasurements()).rejects.toMatch("Error");
      });
    });
  });

  describe("when getting all measures of one measurement", () => {
    describe("and there is no error", () => {
      it("should return an array", async () => {
        mockQueryRows.mockImplementationOnce((_, { next, complete }) => {
          next(
            ["humidity", 60, "2022-12-28T11:02:21.919950839Z"],
            mockTransform
          );
          next(
            ["humidity", 70, "2022-12-28T11:03:21.919950839Z"],
            mockTransform
          );
          next(
            ["humidity", 80, "2022-12-28T11:04:21.919950839Z"],
            mockTransform
          );
          complete();
        });

        const measureDAO = new MeasureDAO();

        const all = await measureDAO.getMeasurement("");

        expect(all).toEqual([
          expect.objectContaining({
            measurement: "humidity",
            value: 60,
          }),
          expect.objectContaining({
            measurement: "humidity",
            value: 70,
          }),
          expect.objectContaining({
            measurement: "humidity",
            value: 80,
          }),
        ]);
      });
    });

    describe("and there is an error", () => {
      it("should reject with error", async () => {
        mockQueryRows.mockImplementationOnce((_, { error }) => {
          error("Error getting measurement");
        });
        const measureDAO = new MeasureDAO();
        await expect(measureDAO.getMeasurement("")).rejects.toMatch(
          "Error getting measurement"
        );
      });
    });
  });
});
