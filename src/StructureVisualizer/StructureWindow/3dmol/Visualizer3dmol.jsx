import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

import "3dmol/build/3Dmol-min.js";
const $3Dmol = window.$3Dmol;

import { covalentRadii } from "./bondLengths";
import "./Visualizer3dmol.css";

function mod(n, m) {
  return ((n % m) + m) % m;
}

function latticeMatrixToCellParams(m) {
  // Extract lattice vectors (columns)
  const aVec = [m[0], m[3], m[6]];
  const bVec = [m[1], m[4], m[7]];
  const cVec = [m[2], m[5], m[8]];

  const vecLength = (v) => Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
  const dot = (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
  const angle = (v1, v2) =>
    (Math.acos(dot(v1, v2) / (vecLength(v1) * vecLength(v2))) * 180) / Math.PI;

  const a = vecLength(aVec);
  const b = vecLength(bVec);
  const c = vecLength(cVec);

  const alpha = angle(bVec, cVec); // opposite a
  const beta = angle(aVec, cVec); // opposite b
  const gamma = angle(aVec, bVec); // opposite c

  return { a, b, c, alpha, beta, gamma };
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

const Visualizer3dmol = forwardRef(
  ({ viewerParams, cifText, cubeText }, ref) => {
    const viewerRef = useRef(null);
    const modelRef = useRef(null);
    const divIdRef = useRef(
      "gldiv-" + (Math.random() + 1).toString(36).substring(7),
    );

    // Initialize custom bond lengths once
    useEffect(() => {
      setCustomBondLengths();
    }, []);

    const custom3dmolSetup = () => {
      modelRef.current = viewerRef.current.addModel();

      if (cifText) {
        let loadedCif = $3Dmol.Parsers.CIF(cifText);
        let loadedAtoms = loadedCif[0];
        let cellData = loadedCif["modelData"][0]["cryst"];

        modelRef.current.setCrystData(
          cellData.a,
          cellData.b,
          cellData.c,
          cellData.alpha,
          cellData.beta,
          cellData.gamma,
        );

        let cellMatrix = modelRef.current.modelData.cryst.matrix;
        let fracConversionMatrix = new $3Dmol.Matrix3().getInverse3(cellMatrix);
        let final_atoms = [];

        // in case of packed cell, make sure all the initially specified atoms
        // are folded back to the unit cell
        let atoms = [];
        loadedAtoms.forEach((atom) => {
          let cart = new $3Dmol.Vector3(atom.x, atom.y, atom.z);
          if (viewerParams.packedCell) {
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

        // Build the supercell

        // distance in fractional coordinates to the edge to be
        // considered "on edge" for packed cell option
        let edgeDelta = 0.03;

        let sc = viewerParams.supercell;
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
              if (viewerParams.packedCell) {
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

        modelRef.current.addAtoms(final_atoms);
      }

      if (cubeText) {
        let loadedCube = $3Dmol.Parsers.CUBE(cubeText);
        let loadedAtoms = loadedCube[0];
        let cellData = loadedCube["modelData"][0]["cryst"];

        console.log("cD", cellData);

        const vol = new $3Dmol.VolumeData(cubeText, "cube");

        // construct the unitcell, since 3dmol doesnt store it...

        const cell = latticeMatrixToCellParams(cellData.matrix.elements);

        console.log(cell);

        modelRef.current.setCrystData(
          cell.a * 21,
          cell.b * 22,
          cell.c * 23,
          cell.alpha,
          cell.beta,
          cell.gamma,
        );

        console.log("volData", vol);
        viewerRef.current.addIsosurface(vol, {
          isoval: 0.2,
          color: "red",
          opacity: 0.2,
          smooth: true,
        });
        viewerRef.current.addIsosurface(vol, {
          isoval: -0.2,
          color: "blue",
          opacity: 0.3,
          smooth: false,
        });

        modelRef.current.addAtoms(loadedAtoms);

        // 4. Adjust view
        viewerRef.current.zoomTo();
        viewerRef.current.render();
      }
    };

    const updateView = () => {
      viewerRef.current.removeAllModels();
      custom3dmolSetup();

      let style = {
        sphere: { scale: 0.3, colorscheme: "Jmol" },
      };
      if (viewerParams.vdwRadius) {
        style.sphere.scale = 1.0;
      }
      if (viewerParams.bonds) {
        style.stick = { radius: 0.15, colorscheme: "Jmol" };
      }

      viewerRef.current.setStyle(style);
      viewerRef.current.addUnitCell(modelRef.current);
      modelRef.current.assignBonds();

      viewerRef.current.removeAllLabels();
      if (viewerParams.atomLabels) {
        modelRef.current.atoms.forEach((atom) => {
          viewerRef.current.addLabel(
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

      viewerRef.current.zoomTo();
      viewerRef.current.zoom(1.4);
      viewerRef.current.render();
    };

    const handleEvent = (type, value) => {
      if (type == "camera") {
        if (value == "x") {
          viewerRef.current.setView([
            0.0, 0.0, 0.0, 0.0, -0.5, -0.5, -0.5, 0.5,
          ]);
        }
        if (value == "y") {
          viewerRef.current.setView([0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 0.5, 0.5]);
        }
        if (value == "z") {
          viewerRef.current.setView([0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0]);
        }
        viewerRef.current.zoomTo();
        viewerRef.current.zoom(1.4);
      }
    };

    // Expose handleEvent method to parent via ref
    useImperativeHandle(ref, () => ({
      handleEvent,
    }));

    // Initialize viewer on mount
    useEffect(() => {
      let config = { backgroundColor: "white", orthographic: true };
      viewerRef.current = $3Dmol.createViewer(divIdRef.current, config);
      updateView();
    }, []);

    // Update view when props change
    useEffect(() => {
      if (viewerRef.current) {
        updateView();
      }
    }, [viewerParams, cifText, cubeText]);

    return (
      <div id={divIdRef.current} className="gldiv">
        No data!
      </div>
    );
  },
);

Visualizer3dmol.displayName = "Visualizer3dmol";

export default Visualizer3dmol;
