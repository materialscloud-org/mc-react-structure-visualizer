import React from "react";

import "./index.css";

import Visualizer3dmol from "./3dmol/Visualizer3dmol";

class StructureWindow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="structure-window">
        <Visualizer3dmol viewerParams={this.props.viewerParams} />
      </div>
    );
  }
}

export default StructureWindow;
