import React from "react";

import "./index.css";

class ControlBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewerParams: {
        supercell: [2, 2, 2],
        orientation: "x",
        bonds: false,
        atomLabels: false,
        packedCell: false,
        spaceFilling: false,
      },
    };

    this.handleSupercellChange = this.handleSupercellChange.bind(this);
  }

  handleSupercellChange = (index, value) => {
    let newSupercell = this.state.viewerParams.supercell;
    newSupercell[index] = parseInt(value);
    this.setState({
      viewerParams: {
        ...this.state.viewerParams,
        supercell: newSupercell,
      },
    });
  };

  handleOrientationChange = (e) => {
    this.setState({
      viewerParams: { ...this.state.viewerParams, orientation: e.target.value },
    });
  };

  handleOptionChange = (option) => {
    this.setState({
      viewerParams: {
        ...this.state.viewerParams,
        [option]: !this.state.viewerParams[option],
      },
    });
  };

  render() {
    console.log(this.state.viewerParams);
    return (
      <div className="control-box">
        <div>
          <label>Supercell: </label>
          {[0, 1, 2].map((index) => (
            <input
              key={index}
              className="supercell-input"
              type="number"
              value={this.state.viewerParams.supercell[index]}
              onChange={(e) =>
                this.handleSupercellChange(index, e.target.value)
              }
            />
          ))}
        </div>
        <div>
          <label>Camera: </label>

          <select
            onChange={this.handleOrientationChange}
            value={this.state.viewerParams.orientation}
          >
            <option value="x">x</option>
            <option value="y">y</option>
            <option value="z">z</option>
          </select>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={this.state.viewerParams.bonds}
              onChange={() => this.handleOptionChange("bonds")}
            />
            Bonds
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.state.viewerParams.atomLabels}
              onChange={() => this.handleOptionChange("atomLabels")}
            />
            Atom Labels
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.state.viewerParams.packedCell}
              onChange={() => this.handleOptionChange("packedCell")}
            />
            Packed Cell
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.state.viewerParams.spaceFilling}
              onChange={() => this.handleOptionChange("spaceFilling")}
            />
            Space-filling
          </label>
        </div>
      </div>
    );
  }
}

export default ControlBox;
