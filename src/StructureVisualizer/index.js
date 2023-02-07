import React from "react";

import StructureWindow from "./StructureWindow";
import ControlBox from "./ControlBox";

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

    this.handleViewerParamChange = this.handleViewerParamChange.bind(this);
  }

  handleViewerParamChange(param, value) {
    this.setState({
      viewerParams: {
        ...this.state.viewerParams,
        [param]: value,
      },
    });
  }

  render() {
    return (
      <div className="structure-visualizer">
        <StructureWindow viewerParams={this.state.viewerParams} />
        <ControlBox
          viewerParams={this.state.viewerParams}
          onViewerParamChange={this.handleViewerParamChange}
        />
      </div>
    );
  }
}

export default StructureVisualizer;
