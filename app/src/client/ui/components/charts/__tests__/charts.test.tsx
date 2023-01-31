import { render } from "@testing-library/react";
import { Charts } from "src/client/ui/components/charts/charts";
import { Measurement } from "src/common/model/measure";

const mockedUpdateMeasurements = jest.fn();
const mockedChart = jest.fn();

jest.mock("src/client/ui/components/charts/components/chart/chart", () => ({
  Chart: (args: unknown) => mockedChart(args),
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe("test several shapes of the charts", () => {
  describe("when passing empty list of measures", () => {
    it("renders charts with empty chart list", () => {
      render(<Charts updateMeasures={jest.fn()} measurementsList={[]} />);
      expect(mockedChart).not.toHaveBeenCalled();
    });
  });
  describe("when passing one measures", () => {
    it("renders charts with one chart", () => {
      const mockedMeasures: Measurement[] = [
        {
          name: "m1",
          mean: { lastDay: 11, lastHour: 12, lastMin: 7 },
          measures: [
            { measurement: "m1", value: 12, timestamp: "t1" },
            { measurement: "m1", value: 12, timestamp: "t2" },
            { measurement: "m1", value: 12, timestamp: "t3" },
            { measurement: "m1", value: 12, timestamp: "t4" },
          ],
        },
      ];

      render(
        <Charts
          updateMeasures={mockedUpdateMeasurements}
          measurementsList={mockedMeasures}
        />
      );
      expect(mockedChart).toHaveBeenCalledWith(
        expect.objectContaining({
          index: 0,
          measurement: mockedMeasures[0],
        })
      );
    });
  });
  describe("when passing several measures", () => {
    it("renders charts with several charts", () => {
      const mockedMeasures: Measurement[] = [
        {
          name: "m1",
          mean: { lastDay: 11, lastHour: 12, lastMin: 7 },
          measures: [
            { measurement: "m1", value: 12, timestamp: "t1" },
            { measurement: "m1", value: 12, timestamp: "t2" },
            { measurement: "m1", value: 12, timestamp: "t3" },
            { measurement: "m1", value: 12, timestamp: "t4" },
          ],
        },
        {
          name: "m2",
          mean: { lastDay: 11, lastHour: 12, lastMin: 7 },
          measures: [
            { measurement: "m2", value: 12, timestamp: "t1" },
            { measurement: "m2", value: 12, timestamp: "t2" },
            { measurement: "m2", value: 12, timestamp: "t3" },
            { measurement: "m2", value: 12, timestamp: "t4" },
          ],
        },
        {
          name: "m3",
          mean: { lastDay: 11, lastHour: 12, lastMin: 7 },
          measures: [
            { measurement: "m3", value: 12, timestamp: "t1" },
            { measurement: "m3", value: 12, timestamp: "t2" },
            { measurement: "m3", value: 12, timestamp: "t3" },
            { measurement: "m3", value: 12, timestamp: "t4" },
          ],
        },
        {
          name: "m4",
          mean: { lastDay: 11, lastHour: 12, lastMin: 7 },
          measures: [
            { measurement: "m4", value: 12, timestamp: "t1" },
            { measurement: "m4", value: 12, timestamp: "t2" },
            { measurement: "m4", value: 12, timestamp: "t3" },
            { measurement: "m4", value: 12, timestamp: "t4" },
          ],
        },
        {
          name: "m5",
          mean: { lastDay: 11, lastHour: 12, lastMin: 7 },
          measures: [
            { measurement: "m5", value: 12, timestamp: "t1" },
            { measurement: "m5", value: 12, timestamp: "t2" },
            { measurement: "m5", value: 12, timestamp: "t3" },
            { measurement: "m5", value: 12, timestamp: "t4" },
          ],
        },
      ];

      render(
        <Charts updateMeasures={jest.fn()} measurementsList={mockedMeasures} />
      );

      mockedMeasures.forEach((m, i) => {
        expect(mockedChart).toHaveBeenNthCalledWith(
          i+1,
          expect.objectContaining({
            index: i,
            measurement: mockedMeasures[i],
          })
        );
      });
    });
  });
});
