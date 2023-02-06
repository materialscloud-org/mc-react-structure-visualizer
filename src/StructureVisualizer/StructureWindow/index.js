import React from "react";

import "./index.css";

import Mol3DVisualizer from "./Mol3DVisualizer";

class StructureWindow extends React.Component {
  constructor(props) {
    super(props);
  }

  updateVisualizationOptions(newOptions) {
    console.log(newOptions);
  }

  render() {
    return (
      <div className="structure-window">
        <Mol3DVisualizer />
      </div>
    );
  }
}

export default StructureWindow;
