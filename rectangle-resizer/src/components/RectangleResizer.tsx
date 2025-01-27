import React, { useState, useEffect, useRef } from "react";
import axios from "../services/api";
import { Rectangle } from "../types/Rectangle";
import RectangleComponent from "./RectangleComponent";
import ErrorHandling from "./ErrorHandling";
import {
  Container,
  FormContainer,
  FormGroup,
  Perimeter,
} from "./RectangleResizerStyles";

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
        setError("Failed to fetch dimensions.");
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
      console.error("Error validating/updating dimensions:", err);
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
    <div data-testid="rectangle-resizer">
      <Container>
        {loading && (
          <div className="alert alert-info" role="alert">
            Validating...
          </div>
        )}
        <ErrorHandling error={error} />
        <FormContainer>
          <FormGroup>
            <Perimeter>
              Perimeter: {2 * (dimensions.width + dimensions.height)} px
            </Perimeter>
            <label htmlFor="widthInput">Width (px):</label>
            <input
              type="number"
              className="form-control"
              id="widthInput"
              name="width"
              value={dimensions.width}
              onChange={handleInputChange}
              data-testid="input-width"
              style={{ width: "100%" }}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="heightInput">Height (px):</label>
            <input
              type="number"
              className="form-control"
              id="heightInput"
              name="height"
              value={dimensions.height}
              onChange={handleInputChange}
              data-testid="input-height"
              style={{ width: "100%" }}
            />
          </FormGroup>
        </FormContainer>
      </Container>
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
