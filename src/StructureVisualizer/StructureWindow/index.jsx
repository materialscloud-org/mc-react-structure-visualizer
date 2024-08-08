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

    let mouseNoteText = "Click to interact";
    let mouseNoteClass = "mouse-disabled-note";
    if (this.props.mouseEnabled) {
      mouseNoteClass = "mouse-disabled-note on";
    }
    return (
      <div className="structure-window-outer">
        <div
          className="structure-window-click-handler"
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
