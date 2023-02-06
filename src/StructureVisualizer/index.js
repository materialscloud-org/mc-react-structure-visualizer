import React from "react";

import StructureWindow from "./StructureWindow";
import ControlBox from "./ControlBox";

class StructureVisualizer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="structure-visualizer">
        <StructureWindow />
        <ControlBox />
      </div>
    );
  }
}

export default StructureVisualizer;
