import React from "react";

import * as $3Dmol from "3dmol";

import { covalentRadii } from "./bondLengths";

import "./Visualizer3dmol.css";

function mod(n, m) {
  return ((n % m) + m) % m;
}

function tryToCenterStructureInVacuum(atoms, fracConversionMatrix, cellMatrix) {
  // convert atoms to fractional coordinates
  // and choose the most central one as reference
  let fatoms = []
  let refAtomFrac = null
  let bestDist = null
  atoms.forEach((atom) => {
    let cart = new $3Dmol.Vector3(atom.x, atom.y, atom.z);
    let frac = cart.clone().applyMatrix3(fracConversionMatrix);
    fatoms.push({
      elem: atom.elem,
      frac: frac
    });
    let centDist = frac.clone().sub(new $3Dmol.Vector3(0.5, 0.5, 0.5))
    if (bestDist) {
      if (centDist < bestDist) {
        refAtomFrac = frac
        bestDist = centDist
      }
    } else {
      refAtomFrac = frac
      bestDist = centDist
    }
  });

  // Choose periodic replicas closest to the reference atom
  // also calculate the geometric center in fractional coordinates
  let fracGeometricCenter = new $3Dmol.Vector3(0.0, 0.0, 0.0);
  fatoms.forEach((fatom) => {
    let deltaFrac = new $3Dmol.Vector3(0.0, 0.0, 0.0);
    deltaFrac.subVectors(refAtomFrac, fatom.frac);
    if (deltaFrac.x >  0.5) fatom.frac.x += 1.0;
    if (deltaFrac.x < -0.5) fatom.frac.x -= 1.0;
    if (deltaFrac.y >  0.5) fatom.frac.y += 1.0;
    if (deltaFrac.y < -0.5) fatom.frac.y -= 1.0;
    if (deltaFrac.z >  0.5) fatom.frac.z += 1.0;
    if (deltaFrac.z < -0.5) fatom.frac.z -= 1.0;
    fracGeometricCenter.add(fatom.frac)
  });

  fracGeometricCenter.divideScalar(fatoms.length);
  // shift each atom such that the geometric center matches cell center
  let fracShift = new $3Dmol.Vector3(0.0, 0.0, 0.0);
  let cellCenter = new $3Dmol.Vector3(0.5, 0.5, 0.5);
  fracShift.subVectors(fracGeometricCenter, cellCenter);

  console.log(fracShift);

  let finalAtoms = []
  fatoms.forEach((fatom) => {
    let newFrac = new $3Dmol.Vector3(0.0, 0.0, 0.0);
    newFrac.subVectors(fatom.frac, fracShift);
    // convert back to cartesian
    let cart = newFrac.applyMatrix3(cellMatrix);
    finalAtoms.push({
      elem: fatom.elem,
      x: cart.x,
      y: cart.y,
      z: cart.z
    })
  });
  return finalAtoms;
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
      prevProps.cifText != this.props.cifText
    ) {
      this.updateView();
    }
  }

  custom3dmolSetup() {
    this.model = this.viewer.addModel();

    if (this.props.cifText) {
      let loadedCif = $3Dmol.Parsers.CIF(this.props.cifText);
      let loadedAtoms = loadedCif[0];
      let cellData = loadedCif["modelData"][0]["cryst"];

      this.model.setCrystData(
        cellData.a,
        cellData.b,
        cellData.c,
        cellData.alpha,
        cellData.beta,
        cellData.gamma,
      );

      let cellMatrix = this.model.modelData.cryst.matrix;

      let fracConversionMatrix = new $3Dmol.Matrix3().getInverse3(cellMatrix);

      let final_atoms = [];

      // in case of packed cell, make sure all the initially specified atoms
      // are folded back to the unit cell
      let atoms = [];
      loadedAtoms.forEach((atom) => {
        let cart = new $3Dmol.Vector3(atom.x, atom.y, atom.z);
        if (this.props.viewerParams.packedCell) {
          let frac = cart.clone().applyMatrix3(fracConversionMatrix);
          let folded_frac = new $3Dmol.Vector3(
            mod(frac.x, 1),
            mod(frac.y, 1),
            mod(frac.z, 1),
          );
          // convert back to cartesian
          cart = folded_frac.applyMatrix3(cellMatrix);
        }
        atoms.push({
          elem: atom.elem,
          x: cart.x,
          y: cart.y,
          z: cart.z,
        });
      });

      let tryCenterVacuum = true
      if (tryCenterVacuum) {
        atoms = tryToCenterStructureInVacuum(atoms, fracConversionMatrix, cellMatrix)
      }

      // Build the supercell

      // distance in fractional coordinates to the edge to be
      // considered "on edge" for packed cell option
      let edgeDelta = 0.03;

      let sc = this.props.viewerParams.supercell;
      for (let i = -1; i < sc[0] + 1; i++) {
        for (let j = -1; j < sc[1] + 1; j++) {
          for (let k = -1; k < sc[2] + 1; k++) {
            let offset = new $3Dmol.Vector3(i, j, k);
            offset.applyMatrix3(cellMatrix);

            // prettier-ignore
            if (
              i == -1 || i == sc[0] ||
              j == -1 || j == sc[1] ||
              k == -1 || k == sc[2]
            ) {
              // we are outside the specified supercell.
              // in case of packed cell, add all atoms from the 
              // neighboring cells that are exactly on edges
              if (this.props.viewerParams.packedCell) {
                atoms.forEach((atom) => {
                  let cart = new $3Dmol.Vector3(atom.x, atom.y, atom.z);
                  cart.add(offset);
                  let frac = cart.clone().applyMatrix3(fracConversionMatrix);
  
                  // prettier-ignore
                  if (
                    frac.x > -edgeDelta && frac.x < sc[0] + edgeDelta &&
                    frac.y > -edgeDelta && frac.y < sc[1] + edgeDelta &&
                    frac.z > -edgeDelta && frac.z < sc[2] + edgeDelta
                  ) {
                    final_atoms.push({
                      elem: atom.elem,
                      x: cart.x,
                      y: cart.y,
                      z: cart.z,
                    });
                  }
                });
              } else {
                // in "non-packed" case, skip these edge cells
                continue
              }
            } else {
              atoms.forEach((atom) => {
                final_atoms.push({
                  elem: atom.elem,
                  x: atom.x + offset.x,
                  y: atom.y + offset.y,
                  z: atom.z + offset.z,
                });
              });
            }
          }
        }
      }

      this.model.addAtoms(final_atoms);
    }
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
