import { render } from "@testing-library/react";
import { Charts } from "src/client/ui/components/charts/charts";
import { Measurement } from "src/common/model/measure";

jest.mock("src/client/ui/components/charts/components/chart/chart", () => ({
  Chart: () =>  <div />,
}));

describe("test several shapes of the form", () => {
  describe("when passing empty list of measures", () => {
    it("renders charts with empty chart list", () => {
      const { container } = render(
        <Charts updateMeasures={jest.fn()} measurementsList={[]} />
      );
      expect(container).toMatchSnapshot();
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

      const { container } = render(
        <Charts updateMeasures={jest.fn()} measurementsList={mockedMeasures} />
      );
      expect(container).toMatchSnapshot();
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

      const { container } = render(
        <Charts updateMeasures={jest.fn()} measurementsList={mockedMeasures} />
      );
      expect(container).toMatchSnapshot();
    });
  });
});
