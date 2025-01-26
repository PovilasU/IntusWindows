import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "../services/api";
import { Rectangle } from "../types/Rectangle";
import { Properties } from "csstype";

// Styles for resizing handles
const handleStyle: Properties<string | number> = {
  position: "absolute",
  width: 10,
  height: 10,
  backgroundColor: "lightblue",
  border: "1px solid grey",
  borderRadius: "50%",
  cursor: "nwse-resize",
};

// Debounce utility
const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const RectangleResizer: React.FC = () => {
  const [dimensions, setDimensions] = useState<Rectangle>({
    width: 100,
    height: 50,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rectangleRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Fetch initial dimensions from the API
  useEffect(() => {
    const fetchDimensions = async () => {
      try {
        const response = await axios.get<Rectangle>("/rectangle");
        setDimensions(response.data);
      } catch (err) {
        setError(
          "Failed to load initial rectangle dimensions. Please try again."
        );
      }
    };
    fetchDimensions();
  }, []);

  // Function to handle API updates with error handling
  const updateDimensions = async (newDimensions: Rectangle) => {
    setLoading(true);
    setError(null);
    try {
      // Validate dimensions
      await axios.post("/rectangle/validate", newDimensions);

      // Update dimensions in the backend
      await axios.post("/rectangle/update", newDimensions);

      setDimensions(newDimensions);
    } catch (err: any) {
      setError(
        err.response?.data || "An error occurred while updating dimensions."
      );
    } finally {
      setLoading(false);
    }
  };

  const debouncedUpdateDimensions = useCallback(
    debounce(updateDimensions, 500),
    []
  );

  // Handle rectangle resizing
  const handleMouseDown = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;
    const startPos = { x: position.x, y: position.y };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPos.x;
      let newY = startPos.y;

      if (direction.includes("right"))
        newWidth = startWidth + (moveEvent.clientX - startX);
      if (direction.includes("bottom"))
        newHeight = startHeight + (moveEvent.clientY - startY);
      if (direction.includes("left")) {
        newWidth = startWidth - (moveEvent.clientX - startX);
        newX = startPos.x + (moveEvent.clientX - startX);
      }
      if (direction.includes("top")) {
        newHeight = startHeight - (moveEvent.clientY - startY);
        newY = startPos.y + (moveEvent.clientY - startY);
      }

      setDimensions({
        width: Math.max(10, newWidth),
        height: Math.max(10, newHeight),
      });
      setPosition({ x: newX, y: newY });
      debouncedUpdateDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle rectangle dragging
  const handleDrag = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { x: position.x, y: position.y };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newX = startPos.x + (moveEvent.clientX - startX);
      const newY = startPos.y + (moveEvent.clientY - startY);
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle direct input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newDimensions = {
      ...dimensions,
      [name]: Math.max(10, Number(value)),
    };
    setDimensions(newDimensions);
    debouncedUpdateDimensions(newDimensions);
  };

  return (
    <div
      data-testid="rectangle-resizer"
      aria-labelledby="rectangle-resizer-header"
    >
      <h1 id="rectangle-resizer-header">Rectangle Resizer</h1>
      {error && (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      )}
      <div
        ref={rectangleRef}
        onMouseDown={handleDrag}
        data-testid="rectangle"
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          width: dimensions.width,
          height: dimensions.height,
          border: `2px solid ${error ? "red" : "blue"}`,
          backgroundColor: error ? "lightcoral" : "lightblue",
          cursor: "move",
        }}
        role="region"
        aria-label={`Rectangle at ${position.x}, ${position.y} with width ${dimensions.width}px and height ${dimensions.height}px`}
      >
        <svg
          width="100%"
          height="100%"
          role="img"
          aria-label="Resizable rectangle"
        >
          <rect width="100%" height="100%" fill="transparent" />
        </svg>
        <div
          onMouseDown={(e) => handleMouseDown(e, "top-left")}
          style={{ ...handleStyle, left: -5, top: -5 }}
        />
        <div
          onMouseDown={(e) => handleMouseDown(e, "top-right")}
          style={{ ...handleStyle, right: -5, top: -5 }}
        />
        <div
          onMouseDown={(e) => handleMouseDown(e, "bottom-left")}
          style={{ ...handleStyle, left: -5, bottom: -5 }}
        />
        <div
          onMouseDown={(e) => handleMouseDown(e, "bottom-right")}
          style={{ ...handleStyle, right: -5, bottom: -5 }}
        />
      </div>
      <p data-testid="perimeter">
        Perimeter: {2 * (dimensions.width + dimensions.height)} px
      </p>
      {loading && <p>Validating...</p>}
      <div style={{ marginTop: "10px" }}>
        <label>
          Width:
          <input
            type="number"
            name="width"
            value={dimensions.width}
            onChange={handleInputChange}
            data-testid="input-width"
          />
        </label>
        <label>
          Height:
          <input
            type="number"
            name="height"
            value={dimensions.height}
            onChange={handleInputChange}
            data-testid="input-height"
          />
        </label>
      </div>
    </div>
  );
};

export default RectangleResizer;
