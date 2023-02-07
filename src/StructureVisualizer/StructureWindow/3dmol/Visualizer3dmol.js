import React from "react";

import * as $3Dmol from "3dmol";

import "./Visualizer3dmol.css";

class Visualizer3dmol extends React.Component {
  constructor(props) {
    super(props);

    this.viewer = null;
    this.model = null;
    this.cifText = null;
  }

  componentDidMount() {
    // set up the viewer instance
    let config = { backgroundColor: "mintcream", orthographic: true };
    this.viewer = $3Dmol.createViewer("gldiv", config);

    this.loadStructure();
  }

  async loadStructure() {
    const response = await fetch("./mc3d-18552.cif", { method: "get" });
    this.cifText = await response.text();
    this.updateView();
  }

  updateView() {
    this.viewer.removeAllModels();
    this.model = this.viewer.addModel(this.cifText, "cif");

    let style = {
      sphere: { scale: 0.3, colorscheme: "Jmol" },
    };
    if (this.props.viewerParams.vdwRadius) {
      style.sphere.scale = 1.0;
    }
    if (this.props.viewerParams.bonds) {
      style.stick = { radius: 0.2, colorscheme: "Jmol" };
    }

    this.viewer.setStyle(style);

    this.viewer.addUnitCell(this.model);
    let sc = this.props.viewerParams.supercell;
    this.viewer.replicateUnitCell(sc[0], sc[1], sc[2], this.model);
    this.model.assignBonds();
    this.viewer.zoomTo();
    this.viewer.render();
  }

  render() {
    if (this.viewer && this.model) {
      this.updateView();
    }
    return <div id="gldiv">Visualizer3dmol</div>;
  }
}

export default Visualizer3dmol;
