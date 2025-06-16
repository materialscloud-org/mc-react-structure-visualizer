import React from "react";
import { Form, Button } from "react-bootstrap";
import "./index.css";
import RainbowColorBar from "./ColorPicker";

const N = 20;

function generateNonLinearSteps(N, max, curveFn = (t) => t ** 6) {
  return Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    return curveFn(t) * max;
  });
}

class ControlBox extends React.Component {
  handleSupercellChange = (index, value) => {
    let newSupercell = [...this.props.viewerParams.supercell];
    newSupercell[index] = parseInt(value);
    this.props.onViewerParamChange("supercell", newSupercell);
  };

  handleOptionChange = (option) => {
    this.props.onViewerParamChange(option, !this.props.viewerParams[option]);
  };

  handleCameraEvent = (orientation) => {
    this.props.onViewerEvent("camera", orientation);
  };

  handleColorChange = (channel, newColor) => {
    const currentColors = this.props.viewerParams.isovalueColors || {
      pos: "#ff0000",
      neg: "#0000ff",
    };
    const newColors = {
      ...currentColors,
      [channel]: newColor,
    };
    this.props.onViewerParamChange("isovalueColors", newColors);
  };

  handleIsovalueChange = (channel, newValue) => {
    const currentIsovalues = this.props.viewerParams.isovalues || {
      pos: 0.0,
      neg: -0.0,
    };

    const newIsovalues = {
      ...currentIsovalues,
      [channel]: parseFloat(newValue),
    };

    this.props.onViewerParamChange("isovalues", newIsovalues);
  };

  render() {
    const min = this.props.viewerParams.cubeRange.min;
    const max = this.props.viewerParams.cubeRange.max;

    let PosIsoSteps;
    let NegIsoSteps;
    if (max < 0) {
      // No positive density
      PosIsoSteps = new Array(N).fill(0);
    } else {
      PosIsoSteps = generateNonLinearSteps(N, max);
    }

    if (min > 0) {
      // No negative density
      NegIsoSteps = new Array(N).fill(0);
    } else {
      NegIsoSteps = generateNonLinearSteps(N, min);
    }

    const { isovalueColors = {} } = this.props.viewerParams;
    const color1 = isovalueColors.pos || "#ff0000";
    const color2 = isovalueColors.neg || "#0000ff";

    const { isovalues = {} } = this.props.viewerParams;
    const posIso = isovalues.pos ?? 0.0;
    const negIso = isovalues.neg ?? -0.0;

    return (
      <div className="control-box">
        <div className="control-box-row" style={{ alignItems: "center" }}>
          <RainbowColorBar
            color={color1}
            onChange={(c) => this.handleColorChange("pos", c)}
          />
          <Form.Label
            style={{
              width: "70px",
              display: "inline-block",
              textAlign: "right",
            }}
          >
            +{posIso.toFixed(4)}
          </Form.Label>
          <Form.Range
            style={{ height: "8px", width: "50px" }}
            min={0}
            max={PosIsoSteps.length - 1}
            step={1}
            value={PosIsoSteps.findIndex((v) => v >= posIso)}
            onChange={(e) => {
              const stepIndex = e.target.value;
              const newValue = PosIsoSteps[stepIndex];

              this.handleIsovalueChange("pos", newValue);
            }}
          />
          <div style={{ width: "90px" }}></div>

          <Form.Label
            style={{
              width: "70px",
              display: "inline-block",
              textAlign: "right",
            }}
          >
            {negIso.toFixed(6)}
          </Form.Label>
          <Form.Range
            style={{ height: "8px", width: "50px" }}
            min={0}
            max={NegIsoSteps.length - 1}
            step={1}
            value={NegIsoSteps.findIndex((v) => v >= negIso)}
            onChange={(e) => {
              const stepIndex = e.target.value;
              const newValue = NegIsoSteps[stepIndex];

              this.handleIsovalueChange("neg", newValue);
            }}
          />
          <RainbowColorBar
            popoutStyle={{ left: "-70px" }}
            color={color2}
            onChange={(c) => this.handleColorChange("neg", c)}
          />
        </div>

        <div className="control-box-row" style={{ display: "flex" }}>
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
            checked={this.props.viewerParams.vdwRadius}
            onChange={() => this.handleOptionChange("vdwRadius")}
            label="vdW radius"
          />
        </div>
      </div>
    );
  }
}

export default ControlBox;
