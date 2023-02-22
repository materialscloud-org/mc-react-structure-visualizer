import React from "react";

import * as $3Dmol from "3dmol";

import "./Visualizer3dmol.css";
import { isLabelWithInternallyDisabledControl } from "@testing-library/user-event/dist/utils";

class Visualizer3dmol extends React.Component {
  constructor(props) {
    super(props);

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
            fontColor: atom.color,
            fontSize: 18,
            showBackground: false,
            backgroundOpacity: 0.5,
            inFront: false,
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
