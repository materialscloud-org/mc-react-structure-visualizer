import React from "react";

import ControlBox from "./ControlBox";

import StructureWindow from "./StructureWindow";

import "./index.css";

class StructureVisualizer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewerParams: {
        supercell: [2, 2, 2],
        bonds: true,
        atomLabels: false,
        packedCell: false,
        vdwRadius: false,
      },
      mouseEnabled: false,
    };

    // use Ref to send events to the visualizer backend
    this.visualizerRef = React.createRef();

    // Ref to detect click outside
    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.handleViewerParamChange = this.handleViewerParamChange.bind(this);
    this.handleViewerEvent = this.handleViewerEvent.bind(this);
    this.setMouseEnabledState = this.setMouseEnabledState.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.setState({ mouseEnabled: false });
    }
  }

  setMouseEnabledState(state) {
    this.setState({ mouseEnabled: state });
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
      <div ref={this.wrapperRef} className="structure-visualizer">
        <StructureWindow
          visualizerRef={this.visualizerRef}
          viewerParams={this.state.viewerParams}
          cifText={this.props.cifText}
          mouseEnabled={this.state.mouseEnabled}
          setMouseEnabledState={this.setMouseEnabledState}
        />
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
