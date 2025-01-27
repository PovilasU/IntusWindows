import React, { useRef } from "react";
import { Rectangle } from "../types/Rectangle";

interface RectangleComponentProps {
  dimensions: Rectangle;
  setDimensions: React.Dispatch<React.SetStateAction<Rectangle>>;
  position: { x: number; y: number };
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  validateAndUpdateDimensions: () => void;
}

const RectangleComponent: React.FC<RectangleComponentProps> = ({
  dimensions,
  setDimensions,
  position,
  setPosition,
  validateAndUpdateDimensions,
}) => {
  const rectangleRef = useRef<HTMLDivElement>(null);

  // Handle resizing the rectangle.
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

    const handleMouseUp = () => {
      validateAndUpdateDimensions(); // Use the latest state from refs
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
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
      validateAndUpdateDimensions(); // Use the latest state from refs
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "400px" }}>
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
  );
};

export default RectangleComponent;
