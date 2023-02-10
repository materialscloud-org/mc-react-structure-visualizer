import React from "react";

import ControlBox from "./ControlBox";

import Visualizer3dmol from "./3dmol/Visualizer3dmol";

import "./index.css";

class StructureVisualizer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewerParams: {
        supercell: [2, 2, 2],
        orientation: "x",
        bonds: true,
        atomLabels: false,
        packedCell: false,
        vdwRadius: false,
      },
    };

    // use Ref to send events to the visualizer backend
    this.visualizerRef = React.createRef();

    this.handleViewerParamChange = this.handleViewerParamChange.bind(this);
    this.handleViewerEvent = this.handleViewerEvent.bind(this);
  }

  handleViewerParamChange(param, value) {
    this.setState({
      viewerParams: {
        ...this.state.viewerParams,
        [param]: value,
      },
    });
  }

  handleViewerEvent(param, value) {
    this.visualizerRef.current.handleEvent(param, value);
  }

  render() {
    return (
      <div className="structure-visualizer">
        <div className="structure-window">
          <Visualizer3dmol
            ref={this.visualizerRef}
            viewerParams={this.state.viewerParams}
          />
        </div>
        <ControlBox
          viewerParams={this.state.viewerParams}
          onViewerParamChange={this.handleViewerParamChange}
          onViewerEvent={this.handleViewerEvent}
        />
      </div>
    );
  }
}

export default StructureVisualizer;
