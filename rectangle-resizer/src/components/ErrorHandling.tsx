import React from "react";

interface ErrorHandlingProps {
  error: string | null;
}

const ErrorHandling: React.FC<ErrorHandlingProps> = ({ error }) => {
  if (!error) return null;

  return <p style={{ color: "red" }}>{error}</p>;
};

export default ErrorHandling;
