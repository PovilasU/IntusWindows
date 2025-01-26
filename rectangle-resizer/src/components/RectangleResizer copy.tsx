import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "../services/api";
import { Rectangle } from "../types/Rectangle";
import { Properties } from "csstype";
import "bootstrap/dist/css/bootstrap.min.css";
import "./RectangleResizer.css"; // Import custom CSS

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
  const [error, setError] = useState<string>(""); // Initialize with an empty string
  const rectangleRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Fetch initial dimensions from the API
  useEffect(() => {
    const fetchDimensions = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get<Rectangle>("/rectangle");
        setDimensions(response.data);
      } catch (err) {
        setError(
          "Failed to load initial rectangle dimensions. Please try again."
        );
        console.error("Error fetching dimensions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDimensions();
  }, []);

  // Function to handle API updates with error handling
  const updateDimensions = async (newDimensions: Rectangle) => {
    setLoading(true);
    setError("");
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
      console.error("Error updating dimensions:", err);
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
    <div className="rectangle-resizer-container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
          Rectangle Resizer
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="#">
                Home <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Features
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Pricing
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#" aria-disabled="true">
                Disabled
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container mt-5">
        <div className="card border-0">
          <div className="card-body">
            <h1 id="rectangle-resizer-header" className="card-title">
              Rectangle Resizer
            </h1>
            <p className="card-text">
              Resize and move the rectangle using the handles or input fields
              below.
            </p>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <div className="form-inline">
              <label className="mr-2">
                Width:
                <input
                  type="number"
                  name="width"
                  value={dimensions.width}
                  onChange={handleInputChange}
                  data-testid="input-width"
                  className="form-control d-inline-block ml-2"
                  style={{ width: "100px" }}
                  title="Enter the width of the rectangle"
                />{" "}
                <span className="d-inline">px</span>
              </label>
              <label className="ml-4">
                Height:
                <input
                  type="number"
                  name="height"
                  value={dimensions.height}
                  onChange={handleInputChange}
                  data-testid="input-height"
                  className="form-control d-inline-block ml-2"
                  style={{ width: "100px" }}
                  title="Enter the height of the rectangle"
                />{" "}
                <span className="d-inline">px</span>
              </label>
            </div>
            <p data-testid="perimeter">
              Perimeter: {2 * (dimensions.width + dimensions.height)} px
            </p>
            <div
              ref={rectangleRef}
              onMouseDown={handleDrag}
              data-testid="rectangle"
              className="position-relative"
              style={{
                left: position.x,
                top: position.y,
                width: dimensions.width,
                height: dimensions.height,
                backgroundColor: error ? "lightcoral" : "lightblue",
                cursor: "move",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", // Add shadow for visual cue
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
                title="Resize from top-left"
              />
              <div
                onMouseDown={(e) => handleMouseDown(e, "top-right")}
                style={{ ...handleStyle, right: -5, top: -5 }}
                title="Resize from top-right"
              />
              <div
                onMouseDown={(e) => handleMouseDown(e, "bottom-left")}
                style={{ ...handleStyle, left: -5, bottom: -5 }}
                title="Resize from bottom-left"
              />
              <div
                onMouseDown={(e) => handleMouseDown(e, "bottom-right")}
                style={{ ...handleStyle, right: -5, bottom: -5 }}
                title="Resize from bottom-right"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RectangleResizer;
