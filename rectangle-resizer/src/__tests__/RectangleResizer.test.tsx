import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import RectangleResizer from "../components/RectangleResizer";
import axios from "../services/api";

// Mock axios
vi.mock("../services/api");

describe("RectangleResizer Component", () => {
  it("renders RectangleResizer component", () => {
    render(<RectangleResizer />);
    expect(screen.getByTestId("rectangle-resizer")).toBeInTheDocument();
  });

  it("displays initial dimensions", async () => {
    axios.get = vi
      .fn()
      .mockResolvedValueOnce({ data: { width: 100, height: 50 } });
    render(<RectangleResizer />);
    await waitFor(() => {
      expect(screen.getByTestId("input-width")).toHaveValue(100);
      expect(screen.getByTestId("input-height")).toHaveValue(50);
    });
  });

  it("updates dimensions on input change", async () => {
    axios.post = vi.fn().mockResolvedValueOnce({});
    render(<RectangleResizer />);
    const widthInput = screen.getByTestId("input-width");
    const heightInput = screen.getByTestId("input-height");

    fireEvent.change(widthInput, { target: { value: "150" } });
    fireEvent.change(heightInput, { target: { value: "75" } });

    await waitFor(() => {
      expect(widthInput).toHaveValue(150);
      expect(heightInput).toHaveValue(75);
    });
  });

  it("calculates the perimeter correctly", async () => {
    axios.post = vi.fn().mockResolvedValueOnce({});
    render(<RectangleResizer />);
    const widthInput = screen.getByTestId("input-width");
    const heightInput = screen.getByTestId("input-height");

    fireEvent.change(widthInput, { target: { value: "200" } });
    fireEvent.change(heightInput, { target: { value: "100" } });

    await waitFor(() => {
      expect(screen.getByText("Perimeter: 600 px")).toBeInTheDocument();
    });
  });

  it("shows error and changes styles on validation error", async () => {
    axios.post = vi
      .fn()
      .mockRejectedValueOnce({ response: { data: "Validation error" } });
    render(<RectangleResizer />);
    const widthInput = screen.getByTestId("input-width");
    const heightInput = screen.getByTestId("input-height");

    fireEvent.change(widthInput, { target: { value: "300" } });
    fireEvent.change(heightInput, { target: { value: "150" } });

    await waitFor(() => {
      expect(screen.getByText("Validation error")).toBeInTheDocument();
      expect(screen.getByTestId("rectangle")).toHaveStyle(
        "border: 2px solid red"
      );
      expect(screen.getByTestId("rectangle")).toHaveStyle(
        "background-color: rgb(240, 128, 128)"
      );
    });
  });
});
