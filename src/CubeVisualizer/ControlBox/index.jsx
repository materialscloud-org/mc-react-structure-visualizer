import React from "react";
import { Form, Button } from "react-bootstrap";
import "./index.css";

class ControlBox extends React.Component {
  handleOptionChange = (option) => {
    this.props.onViewerParamChange(option, !this.props.viewerParams[option]);
  };

  handleCameraEvent = (orientation) => {
    this.props.onViewerEvent("camera", orientation);
  };

  render() {
    return (
      <div className="control-box">
        <div className="control-box-row">

          <div className="camera-controls">
            <Form.Label>Camera: </Form.Label>
            <Button
              className="camera-button"
              onClick={() => this.handleCameraEvent("x")}
            >
              x
            </Button>
            <Button
              className="camera-button"
              onClick={() => this.handleCameraEvent("y")}
            >
              y
            </Button>
            <Button
              className="camera-button"
              onClick={() => this.handleCameraEvent("z")}
            >
              z
            </Button>
          </div>
        </div>
        <div className="control-box-row" style={{ display: "flex" }}>
          <Form.Check
            className="option-checkbox"
            type="checkbox"
            checked={this.props.viewerParams.bonds}
            onChange={() => this.handleOptionChange("bonds")}
            label="Bonds"
          />
          <Form.Check
            className="option-checkbox"
            type="checkbox"
            checked={this.props.viewerParams.packedCell}
            onChange={() => this.handleOptionChange("packedCell")}
            label="Packed cell"
          />
          <Form.Check
            className="option-checkbox"
            type="checkbox"
            checked={this.props.viewerParams.atomLabels}
            onChange={() => this.handleOptionChange("atomLabels")}
            label="Atom labels"
          />
          <Form.Check
            className="option-checkbox"
            type="checkbox"
            checked={this.props.viewerParams.spaceFilling}
            onChange={() => this.handleOptionChange("vdwRadius")}
            label="vdW radius"
          />
        </div>
      </div>
    );
  }
}

export default ControlBox;
