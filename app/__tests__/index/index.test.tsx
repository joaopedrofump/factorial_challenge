import Home from "@/pages/index";
import { render, waitFor } from "@testing-library/react";
import { Measurement } from "src/common/model/measure";

const mockedCharts = jest.fn();
const mockedForm = jest.fn();
const mockedGetAllMeasures = jest.fn();

jest.mock("src/client/ui/components/charts/charts", () => ({
  Charts: (args: unknown) => mockedCharts(args),
}));

jest.mock("src/client/ui/components/form/form", () => ({
  Form: (args: unknown) => mockedForm(args),
}));

jest.mock("src/client/service/measure-service", () => ({
  getAllMeasures: () => mockedGetAllMeasures(),
}));

describe("Home", () => {
  it("renders form and charts", async () => {
    const measurementList: Measurement[] = [
      {
        mean: { lastMin: 0, lastDay: 0, lastHour: 0 },
        name: "m1",
        measures: [{ measurement: "m1", timestamp: "ts1", value: 2 }],
      },
      {
        mean: { lastMin: 0, lastDay: 0, lastHour: 0 },
        name: "m2",
        measures: [{ measurement: "m2", timestamp: "ts1", value: 2 }],
      },
    ];

    mockedGetAllMeasures.mockResolvedValue(measurementList);

    render(<Home />);

    await waitFor(() => {
      expect(mockedForm).toHaveBeenCalledWith(
        expect.objectContaining({ title: "New Measure" })
      );
      expect(mockedCharts).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          measurementsList: measurementList,
        })
      );
    });
  });
});
