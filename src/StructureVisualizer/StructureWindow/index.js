import React from "react";

import "./index.css";

import Visualizer3dmol from "./3dmol/Visualizer3dmol";

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
        <Visualizer3dmol />
      </div>
    );
  }
}

export default StructureWindow;
