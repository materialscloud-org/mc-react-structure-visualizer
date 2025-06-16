import React from "react";

import * as $3Dmol from "3dmol";

import { covalentRadii } from "./bondLengths";

import "./Visualizer3dmol.css";

function mod(n, m) {
  return ((n % m) + m) % m;
}

function setCustomBondLengths() {
  function setCustomBondLength(elem, len) {
    // 3dmol adds 0.25 to the total bond length as a "fudge_factor"
    // to correct for this, one could here subtract 0.125 from each atom's
    // bond length but it seems it's better to keep the "fudge factor".
    $3Dmol.setBondLength(elem, len);
  }
  // override the default bond lengths with covalentRadii
  Object.keys(covalentRadii).forEach((elem) => {
    setCustomBondLength(elem, 1.05 * covalentRadii[elem]);
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
      prevProps.cubeText != this.props.cubeText
    ) {
      this.updateView();
    }
  }

  // Parse CUBE file
  custom3dmolSetup() {
    this.model = this.viewer.addModel();

    if (this.props.cubeText) {
      // 3dMol CUBE PARSER get crystal and atoms
      // 3dMol VolData gets the volumetric data
      // I dont believe there is a method that does both
      // Im too lazy to write my own parser.
      // So we read the file twice.

      // we remove all shapes on init;
      // This stops shape duplication
      this.viewer.removeAllShapes();

      const parsedCube = $3Dmol.Parsers.CUBE(this.props.cubeText);
      console.log(parsedCube);
      const volData = new $3Dmol.VolumeData(this.props.cubeText, "cube");

      // First array is atoms list
      const loadedAtoms = parsedCube[0] || [];

      const modelData = parsedCube.modelData || [];
      const cellData = modelData.length > 0 ? modelData[0].cryst : null;

      if (cellData) {
        // If crystal cell parameters exist, set them on the model
        this.model.setCrystData(
          cellData.a || 0,
          cellData.b || 0,
          cellData.c || 0,
          cellData.alpha || 90,
          cellData.beta || 90,
          cellData.gamma || 90,
        );
      }

      // Prepare atoms for adding
      const finalAtoms = loadedAtoms.map((atom) => ({
        elem: atom.elem,
        x: atom.x,
        y: atom.y,
        z: atom.z,
        hetflag: atom.hetflag || true, // preserve flags if any
        bonds: atom.bonds || [],
        bondOrder: atom.bondOrder || [],
        properties: atom.properties || {},
      }));

      console.log(this.viewerParams);

      const colors = this.props.viewerParams.isovalueColors || {};
      const posColor = colors.pos || "red";
      const negColor = colors.neg || "blue";
      const isos = this.props.viewerParams.isovalues || {};

      const posIso = isos.pos;
      const negIso = isos.neg;

      console.log(posIso);

      this.viewer.addVolumetricData(this.props.cubeText, "cube", {
        isoval: posIso,
        color: posColor,
        opacity: 0.5,
        id: "pos",
      });

      this.viewer.addVolumetricData(this.props.cubeText, "cube", {
        isoval: negIso,
        color: negColor,
        opacity: 0.5,
        id: "neg",
      });

      // Add atoms to the model
      this.model.addAtoms(finalAtoms);
    }
    this.viewer.zoomTo(); // adjusts camera to fit content
    this.viewer.render();
  }

  updateView() {
    this.viewer.removeAllModels();
    // this.model = this.viewer.addModel(this.props.cifText, "cif");
    this.custom3dmolSetup();

    let style = {
      sphere: { scale: 0.3, colorscheme: "Jmol" },
    };
    if (this.props.viewerParams.vdwRadius) {
      style.sphere.scale = 1.0;
    }
    if (this.props.viewerParams.bonds) {
      style.stick = { radius: 0.15, colorscheme: "Jmol" };
    }

    this.viewer.setStyle(style);

    this.viewer.addUnitCell(this.model);
    //let sc = this.props.viewerParams.supercell;
    //this.viewer.replicateUnitCell(sc[0], sc[1], sc[2], this.model);

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
          true,
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
