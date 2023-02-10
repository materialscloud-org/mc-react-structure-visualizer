import React from "react";

import "./index.css";

class ControlBox extends React.Component {
  constructor(props) {
    super(props);
  }

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
          <label>Supercell: </label>
          {[0, 1, 2].map((index) => (
            <input
              key={index}
              className="supercell-input"
              type="number"
              value={this.props.viewerParams.supercell[index]}
              onChange={(e) =>
                this.handleSupercellChange(index, e.target.value)
              }
            />
          ))}
        </div>
        <div className="control-box-row">
          <label>Camera: </label>
          <button onClick={() => this.handleCameraEvent("x")}>x</button>
          <button onClick={() => this.handleCameraEvent("y")}>y</button>
          <button onClick={() => this.handleCameraEvent("z")}>z</button>
        </div>
        <div className="control-box-row">
          <label>
            <input
              type="checkbox"
              checked={this.props.viewerParams.bonds}
              onChange={() => this.handleOptionChange("bonds")}
            />
            Bonds
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.props.viewerParams.atomLabels}
              onChange={() => this.handleOptionChange("atomLabels")}
              disabled={true}
            />
            Atom Labels
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.props.viewerParams.packedCell}
              onChange={() => this.handleOptionChange("packedCell")}
              disabled={true}
            />
            Packed Cell
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.props.viewerParams.spaceFilling}
              onChange={() => this.handleOptionChange("vdwRadius")}
            />
            vdW radius
          </label>
        </div>
      </div>
    );
  }
}

export default ControlBox;
