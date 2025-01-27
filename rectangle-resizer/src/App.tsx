import React from "react";
import Layout from "./components/Layout";
import RectangleResizer from "./components/RectangleResizer";

const App: React.FC = () => {
  return (
    <Layout>
      <RectangleResizer />
    </Layout>
  );
};

export default App;
