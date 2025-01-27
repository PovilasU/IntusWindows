import React from "react";

interface ErrorHandlingProps {
  error: string | null;
}

const ErrorHandling: React.FC<ErrorHandlingProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="alert alert-danger" role="alert">
      {error}
    </div>
  );
};

export default ErrorHandling;
