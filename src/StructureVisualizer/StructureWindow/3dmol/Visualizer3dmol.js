import React from "react";

import * as $3Dmol from "3dmol";

import { covalentRadii } from "./bondLengths";

import "./Visualizer3dmol.css";

// override the covalent bond detection based on examples in MC3D
const overrideBondLengths = {
  // uuid = "aaea1e0f-337c-453f-a23a-acc06ddc93c9"; // BaTiO3 mc3d-46554/pbe
  Ba: 0.92 * covalentRadii["Ba"],
  Ti: 0.94 * covalentRadii["Ti"],
  // uuid = "a490b0ff-012a-44c8-a48a-f734dc634b3c"; // EuI4La mc3d-34858/pbe
  I: 1.05 * covalentRadii["I"],
  Eu: 1.05 * covalentRadii["Eu"],
};

function setCustomBondLengths() {
  function setCustomBondLength(elem, len) {
    // 3dmol adds 0.25 to the total bond length as a "fudge_factor"
    let fudgeCorrection = 0.125;
    $3Dmol.setBondLength(elem, len - fudgeCorrection);
  }

  // override the default bond lengths with covalentRadii
  Object.keys(covalentRadii).forEach((elem) => {
    setCustomBondLength(elem, covalentRadii[elem]);
  });

  // override further based on custom-defined lengths
  Object.keys(overrideBondLengths).forEach((elem) => {
    setCustomBondLength(elem, overrideBondLengths[elem]);
  });
}

class Visualizer3dmol extends React.Component {
  constructor(props) {
    super(props);

    setCustomBondLengths();

    this.viewer = null;
    this.model = null;

    // Assign random id to prevent multiple 'gldiv' from clashing
    this.divId = "gldiv-" + (Math.random() + 1).toString(36).substring(7);
  }

  componentDidMount() {
    // set up the viewer instance
    let config = { backgroundColor: "white", orthographic: true };
    this.viewer = $3Dmol.createViewer(this.divId, config);

    this.updateView();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.viewerParams != this.props.viewerParams ||
      prevProps.cifText != this.props.cifText
    ) {
      this.updateView();
    }
  }

  updateView() {
    this.viewer.removeAllModels();
    this.model = this.viewer.addModel(this.props.cifText, "cif");

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

    this.viewer.removeAllLabels();
    if (this.props.viewerParams.atomLabels) {
      this.model.atoms.forEach((atom) => {
        this.viewer.addLabel(
          atom.elem,
          {
            position: { x: atom.x, y: atom.y, z: atom.z },
            fontColor: "black",
            bold: true,
            fontSize: 18,
            showBackground: false,
            backgroundOpacity: 1.0,
            inFront: true,
          },
          null,
          true
        );
      });
    }

    this.viewer.zoomTo();
    this.viewer.zoom(1.4);
    this.viewer.render();
  }

  handleEvent(type, value) {
    if (type == "camera") {
      // console.log(this.viewer.getView());
      if (value == "x") {
        this.viewer.setView([0.0, 0.0, 0.0, 0.0, -0.5, -0.5, -0.5, 0.5]);
      }
      if (value == "y") {
        this.viewer.setView([0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 0.5, 0.5]);
      }
      if (value == "z") {
        this.viewer.setView([0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0]);
      }
      this.viewer.zoomTo();
      this.viewer.zoom(1.4);
    }
  }

  render() {
    return (
      <div id={this.divId} className="gldiv">
        No data!
      </div>
    );
  }
}

export default Visualizer3dmol;
