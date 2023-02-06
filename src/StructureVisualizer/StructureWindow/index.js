import React from "react";

import "./index.css";

class StructureWindow extends React.Component {
  constructor(props) {
    super(props);
  }

  updateVisualizationOptions(newOptions) {
    console.log(newOptions);
  }

  render() {
    return <div className="structure-window">Structure window</div>;
  }
}

export default StructureWindow;
