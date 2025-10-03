import React from "react";
import "./index.css";

class ControlBox extends React.Component {
  handleSupercellChange = (index, value) => {
    let newSupercell = this.props.viewerParams.supercell;
    newSupercell[index] = parseInt(value);
    this.props.onViewerParamChange("supercell", newSupercell);
  };

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
          <div className="supercell-container">
            <label>Supercell: </label>
            <div style={{ display: "flex" }}>
              {[0, 1, 2].map((index) => (
                <input
                  key={index}
                  className="supercell-input"
                  type="number"
                  min="1"
                  max="99"
                  value={this.props.viewerParams.supercell[index]}
                  onChange={(e) =>
                    this.handleSupercellChange(index, e.target.value)
                  }
                />
              ))}
            </div>
          </div>

          <div className="camera-controls">
            <label>Camera: </label>
            <button
              className="camera-button"
              onClick={() => this.handleCameraEvent("x")}
            >
              x
            </button>
            <button
              className="camera-button"
              onClick={() => this.handleCameraEvent("y")}
            >
              y
            </button>
            <button
              className="camera-button"
              onClick={() => this.handleCameraEvent("z")}
            >
              z
            </button>
          </div>
        </div>
        <div className="control-box-row" style={{ display: "flex" }}>
          <label className="option-checkbox">
            <input
              type="checkbox"
              checked={this.props.viewerParams.bonds}
              onChange={() => this.handleOptionChange("bonds")}
            />
            <span>Bonds</span>
          </label>
          <label className="option-checkbox">
            <input
              type="checkbox"
              checked={this.props.viewerParams.packedCell}
              onChange={() => this.handleOptionChange("packedCell")}
            />
            <span>Packed cell</span>
          </label>
          <label className="option-checkbox">
            <input
              type="checkbox"
              checked={this.props.viewerParams.atomLabels}
              onChange={() => this.handleOptionChange("atomLabels")}
            />
            <span>Atom labels</span>
          </label>
          <label className="option-checkbox">
            <input
              type="checkbox"
              checked={this.props.viewerParams.spaceFilling}
              onChange={() => this.handleOptionChange("vdwRadius")}
            />
            <span>vdW radius</span>
          </label>
        </div>
      </div>
    );
  }
}

export default ControlBox;
