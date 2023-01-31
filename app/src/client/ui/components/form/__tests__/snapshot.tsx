import { render } from "@testing-library/react";
import { Form } from "src/client/ui/components/form/form";

jest.mock("src/client/ui/components/charts/charts", () => ({
  Charts: jest.fn(),
}));

describe("test several shapes of the form", () => {
  describe("when passing default measure", () => {
    it("renders form without name input", () => {
      const { container } = render(
        <Form updateMeasures={jest.fn()} hcMeasurement="hc" key={1} />
      );
      expect(container).toMatchSnapshot();
    });
  });
  describe("when not passing default measure", () => {
    it("renders form without name input", () => {
      const { container } = render(
        <Form updateMeasures={jest.fn()} elevated title="New meeasurment" key={1} />
      );
      expect(container).toMatchSnapshot();
    });
  });
});
