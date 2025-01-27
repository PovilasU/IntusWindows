import React, { useState, useEffect, useRef } from "react";
import axios from "../services/api";
import { Rectangle } from "../types/Rectangle";
import { Properties } from "csstype";

const RectangleResizer: React.FC = () => {
  const [dimensions, setDimensions] = useState<Rectangle>({
    width: 100,
    height: 50,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const dimensionsRef = useRef(dimensions);
  const positionRef = useRef(position);

  useEffect(() => {
    const fetchDimensions = async () => {
      try {
        const response = await axios.get<Rectangle>("/rectangle");
        setDimensions(response.data);
        dimensionsRef.current = response.data; // Update ref
      } catch (err) {
        console.error("Error fetching dimensions:", err);
      }
    };

    fetchDimensions();
  }, []);

  // Sync state to refs
  useEffect(() => {
    dimensionsRef.current = dimensions;
  }, [dimensions]);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  const validateAndUpdateDimensions = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use refs to ensure the latest values are sent
      await axios.post("/rectangle/validate", dimensionsRef.current);
      await axios.post("/rectangle/update", dimensionsRef.current);
    } catch (err: any) {
      setError(err.response?.data || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setDragging(true);
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

    const handleMouseUp = () => {
      setDragging(false);
      validateAndUpdateDimensions(); // Use the latest state from refs
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

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
      setDragging(false);
      validateAndUpdateDimensions(); // Use the latest state from refs
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedDimensions = {
      ...dimensions,
      [name]: Number(value),
    };
    setDimensions(updatedDimensions);
    dimensionsRef.current = updatedDimensions; // Update ref immediately
  };

  return (
    <div>
      <h1>Rectangle Resizer</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ marginBottom: "20px" }}>
        <p>Perimeter: {2 * (dimensions.width + dimensions.height)} px</p>
        {loading && <p>Validating...</p>}
        <div style={{ marginTop: "10px" }}>
          <label>
            Width:
            <input
              type="number"
              name="width"
              value={dimensions.width}
              onChange={handleInputChange}
            />{" "}
            px
          </label>
          <label>
            Height:
            <input
              type="number"
              name="height"
              value={dimensions.height}
              onChange={handleInputChange}
            />{" "}
            px
          </label>
        </div>
      </div>
      <div style={{ position: "relative", width: "100%", height: "400px" }}>
        <div
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
          {/* Rectangle Resizing Handles */}
          <div
            onMouseDown={(e) => handleMouseDown(e, "top-left")}
            style={{
              position: "absolute",
              width: 10,
              height: 10,
              backgroundColor: "lightblue",
              border: "1px solid grey",
              borderRadius: "50%",
              left: -5,
              top: -5,
              cursor: "nwse-resize",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RectangleResizer;
