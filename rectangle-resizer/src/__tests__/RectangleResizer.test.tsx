import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import RectangleResizer from "../components/RectangleResizer";

describe("RectangleResizer Component", () => {
  it("renders RectangleResizer component", () => {
    render(<RectangleResizer />);
    expect(screen.getByTestId("rectangle-resizer")).toBeInTheDocument();
  });

  it("displays initial dimensions", () => {
    render(<RectangleResizer />);
    expect(screen.getByTestId("input-width")).toHaveValue(100);
    expect(screen.getByTestId("input-height")).toHaveValue(50);
  });

  it("updates dimensions on input change", () => {
    render(<RectangleResizer />);
    const widthInput = screen.getByTestId("input-width");
    const heightInput = screen.getByTestId("input-height");

    fireEvent.change(widthInput, { target: { value: "150" } });
    fireEvent.change(heightInput, { target: { value: "75" } });

    expect(widthInput).toHaveValue(150);
    expect(heightInput).toHaveValue(75);
  });

  it("calculates the perimeter correctly", () => {
    render(<RectangleResizer />);
    const widthInput = screen.getByTestId("input-width");
    const heightInput = screen.getByTestId("input-height");

    fireEvent.change(widthInput, { target: { value: "200" } });
    fireEvent.change(heightInput, { target: { value: "100" } });

    expect(screen.getByText("Perimeter: 600 px")).toBeInTheDocument();
  });
});
