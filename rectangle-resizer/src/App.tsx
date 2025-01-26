import React from "react";
import RectangleResizer from "./components/RectangleResizer";

const App: React.FC = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <RectangleResizer />
        </div>
      </div>
    </div>
  );
};

export default App;
