import React from "react";

import Visualizer3dmol from "./3dmol/Visualizer3dmol";

import "./index.css";

class StructureWindow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let swClassName = "structure-window";
    if (!this.props.mouseEnabled) swClassName += " disable-mouse";
    return (
      <div
        className="structure-window-outer"
        onClick={() => this.props.setMouseEnabled()}
      >
        <div className={swClassName}>
          <Visualizer3dmol
            ref={this.props.visualizerRef}
            viewerParams={this.props.viewerParams}
            cifText={this.props.cifText}
          />
        </div>
        {!this.props.mouseEnabled && (
          <div className="mouse-disabled-note">Click to interact!</div>
        )}
      </div>
    );
  }
}

export default StructureWindow;
