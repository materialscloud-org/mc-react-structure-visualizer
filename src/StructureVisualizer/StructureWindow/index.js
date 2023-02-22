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

    let mouseNoteText = "Interaction off";
    let mouseNoteClass = "mouse-disabled-note";
    if (this.props.mouseEnabled) {
      mouseNoteText = "Interaction on";
      mouseNoteClass = "mouse-disabled-note on";
    }
    return (
      <div>
        <div
          className="structure-window-outer"
          onClick={() => this.props.setMouseEnabledState(true)}
        >
          <div className={swClassName}>
            <Visualizer3dmol
              ref={this.props.visualizerRef}
              viewerParams={this.props.viewerParams}
              cifText={this.props.cifText}
            />
          </div>
        </div>
        <div
          className={mouseNoteClass}
          onClick={() =>
            this.props.setMouseEnabledState(!this.props.mouseEnabled)
          }
        >
          {mouseNoteText}
        </div>
      </div>
    );
  }
}

export default StructureWindow;
