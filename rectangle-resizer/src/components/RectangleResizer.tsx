import React, { useState, useEffect, useRef } from "react";
import axios from "../services/api";
import { Rectangle } from "../types/Rectangle";
import RectangleComponent from "./RectangleComponent";
import ErrorHandling from "./ErrorHandling.tsx";

const RectangleResizer: React.FC = () => {
  const [dimensions, setDimensions] = useState<Rectangle>({
    width: 100,
    height: 50,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

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
      <ErrorHandling error={error} />
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
      <RectangleComponent
        dimensions={dimensions}
        setDimensions={setDimensions}
        position={position}
        setPosition={setPosition}
        validateAndUpdateDimensions={validateAndUpdateDimensions}
      />
    </div>
  );
};

export default RectangleResizer;
