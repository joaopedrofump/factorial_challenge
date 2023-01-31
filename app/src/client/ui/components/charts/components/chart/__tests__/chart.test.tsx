import { render } from "@testing-library/react";
import { Chart } from "src/client/ui/components/charts/components/chart/chart";

const mockedForm = jest.fn();

jest.mock("src/client/ui/components/form/form", () => ({
  Form: (args: unknown) => mockedForm(args),
}));

jest.mock("recharts", () => ({
  Area: (args: unknown) => <div />,
  AreaChart: (args: unknown) => <div />,
  ResponsiveContainer: (args: unknown) => <div />,
  Tooltip: (args: unknown) => <div />,
}));

it("renders a chart", () => {
  const measurement = {
    name: "m1",
    mean: { lastDay: 11, lastHour: 12, lastMin: 7 },
    measures: [
      { measurement: "m1", value: 12, timestamp: "t1" },
      { measurement: "m1", value: 12, timestamp: "t2" },
      { measurement: "m1", value: 12, timestamp: "t3" },
      { measurement: "m1", value: 12, timestamp: "t4" },
    ],
  };
  render(
    <Chart index={0} measurement={measurement} updateMeasures={jest.fn()} />
  );
  expect(mockedForm).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      hcMeasurement: "m1",
    })
  );
  const measurement2 = {
    name: "m2",
    mean: { lastDay: 11, lastHour: 12, lastMin: 7 },
    measures: [
      { measurement: "m2", value: 12, timestamp: "t1" },
      { measurement: "m2", value: 12, timestamp: "t2" },
      { measurement: "m2", value: 12, timestamp: "t3" },
      { measurement: "m2", value: 12, timestamp: "t4" },
    ],
  };

  render(
    <Chart index={1} measurement={measurement2} updateMeasures={jest.fn()} />
  );

  expect(mockedForm).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      hcMeasurement: "m2",
    })
  );
});
