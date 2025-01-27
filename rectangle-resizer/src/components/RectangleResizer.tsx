import React, { useState, useEffect, useRef } from "react";
import axios from "../services/api";
import { Rectangle } from "../types/Rectangle";
import { Properties } from "csstype";

const handleStyle: Properties<string | number> = {
  position: "absolute",
  width: 10,
  height: 10,
  backgroundColor: "lightblue",
  border: "1px solid grey",
  borderRadius: "50%",
  cursor: "nwse-resize",
};

const inputContainerStyle: Properties<string | number> = {
  display: "flex",
  alignItems: "center",
  marginRight: "10px",
};

const inputStyle: Properties<string | number> = {
  marginLeft: "5px",
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
        const response = await axios.get<Rectangle>(
          "https://localhost:7221/api/rectangle"
        );
        setDimensions(response.data);
      } catch (err) {
        console.error("Error fetching dimensions:", err);
      }
    };

    fetchDimensions();
  }, []);

  // Handle resizing the rectangle
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

      if (direction.includes("right")) {
        newWidth = startWidth + (moveEvent.clientX - startX);
      }
      if (direction.includes("bottom")) {
        newHeight = startHeight + (moveEvent.clientY - startY);
      }
      if (direction.includes("left")) {
        newWidth = startWidth - (moveEvent.clientX - startX);
        newX = startPos.x + (moveEvent.clientX - startX);
      }
      if (direction.includes("top")) {
        newHeight = startHeight - (moveEvent.clientY - startY);
        newY = startPos.y + (moveEvent.clientY - startY);
      }

      setDimensions({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = async () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      setLoading(true);
      setError(null);

      try {
        // Validate dimensions
        await axios.post(
          "https://localhost:7221/api/rectangle/validate",
          dimensions
        );

        // Update dimensions in the backend
        await axios.post(
          "https://localhost:7221/api/rectangle/update",
          dimensions
        );
      } catch (err: any) {
        setError(err.response?.data || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle dragging the rectangle
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

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDimensions((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  return (
    <div>
      <h1>Rectangle Resizer</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div
        ref={rectangleRef}
        onMouseDown={handleDrag}
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          width: dimensions.width,
          height: dimensions.height,
          border: "2px solid blue",
          cursor: "move",
        }}
      >
        <svg width="100%" height="100%" role="img">
          <rect width="100%" height="100%" fill="lightblue" />
        </svg>
        <div
          onMouseDown={(e) => handleMouseDown(e, "top-left")}
          style={{ ...handleStyle, left: -5, top: -5, cursor: "nwse-resize" }}
        />
        <div
          onMouseDown={(e) => handleMouseDown(e, "top-right")}
          style={{ ...handleStyle, right: -5, top: -5, cursor: "nesw-resize" }}
        />
        <div
          onMouseDown={(e) => handleMouseDown(e, "bottom-left")}
          style={{
            ...handleStyle,
            left: -5,
            bottom: -5,
            cursor: "nesw-resize",
          }}
        />
        <div
          onMouseDown={(e) => handleMouseDown(e, "bottom-right")}
          style={{
            ...handleStyle,
            right: -5,
            bottom: -5,
            cursor: "nwse-resize",
          }}
        />
      </div>
      <p>Perimeter: {2 * (dimensions.width + dimensions.height)} px</p>
      {loading && <p>Validating...</p>}
      <div style={{ marginTop: "10px" }}>
        <label style={inputContainerStyle}>
          Width:
          <input
            type="number"
            name="width"
            value={dimensions.width}
            onChange={handleInputChange}
            style={inputStyle}
            data-testid="input-width"
          />{" "}
          px
        </label>
        <label style={inputContainerStyle}>
          Height:
          <input
            type="number"
            name="height"
            value={dimensions.height}
            onChange={handleInputChange}
            style={inputStyle}
            data-testid="input-height"
          />{" "}
          px
        </label>
      </div>
    </div>
  );
};

export default RectangleResizer;
