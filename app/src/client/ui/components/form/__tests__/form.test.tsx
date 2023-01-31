import { fireEvent, render, waitFor } from "@testing-library/react";
import { Form } from "src/client/ui/components/form/form";

const mockedUpdateMeasurements = jest.fn();
const mockedSaveMeasure = jest.fn();
const mockedGetMeasure = jest.fn();

jest.mock("src/client/service/measure-service", () => ({
  getMeasure: (args: unknown) => mockedGetMeasure(args),
  saveMeasure: (args: unknown) => mockedSaveMeasure(args),
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe("when pressing submit", () => {
  describe("and all fields are filled", () => {
    it("should call the callback", async () => {
      mockedGetMeasure.mockResolvedValue("updated m1");

      const { getByPlaceholderText, getByRole } = render(
        <Form updateMeasures={mockedUpdateMeasurements} />
      );

      const nameInput = getByPlaceholderText("metric*");
      const valueInput = getByPlaceholderText("value*");

      const button = getByRole("button");

      fireEvent.change(nameInput, { target: { value: "m1" } });
      fireEvent.change(valueInput, { target: { value: "10" } });

      fireEvent.click(button);

      await waitFor(() => {
        expect(mockedSaveMeasure).toHaveBeenCalledWith("m1");
        expect(mockedGetMeasure).toHaveBeenCalledWith("m1");
        expect(mockedUpdateMeasurements).toHaveBeenCalledWith("updated m1");
      });
    });
  });

  describe("and value is not filled", () => {
    it("should not call callback", async () => {
      mockedGetMeasure.mockResolvedValue("updated m1");

      const { getByPlaceholderText, getByRole } = render(
        <Form updateMeasures={mockedUpdateMeasurements} />
      );

      const nameInput = getByPlaceholderText("metric*");
      const valueInput = getByPlaceholderText("value*");

      const button = getByRole("button");

      fireEvent.change(valueInput, { target: { value: "10" } });
      fireEvent.change(valueInput, { target: { value: undefined } });

      fireEvent.click(button);

      await waitFor(() => {
        expect(mockedSaveMeasure).not.toHaveBeenCalled();
        expect(mockedGetMeasure).not.toHaveBeenCalled();
        expect(mockedUpdateMeasurements).not.toHaveBeenCalled();
      });
    });
  });

  describe("and measurement is not filled", () => {
    it("should not call callback", async () => {
      mockedGetMeasure.mockResolvedValue("updated m1");

      const { getByPlaceholderText, getByRole } = render(
        <Form updateMeasures={mockedUpdateMeasurements} />
      );

      const nameInput = getByPlaceholderText("metric*");
      const valueInput = getByPlaceholderText("value*");

      const button = getByRole("button");

      fireEvent.change(valueInput, { target: { value: 10 } });

      fireEvent.click(button);
      expect(mockedSaveMeasure).not.toHaveBeenCalled();
      expect(mockedGetMeasure).not.toHaveBeenCalled();
      expect(mockedUpdateMeasurements).not.toHaveBeenCalled();

      await waitFor(() => {
      });
    });
  });
});
