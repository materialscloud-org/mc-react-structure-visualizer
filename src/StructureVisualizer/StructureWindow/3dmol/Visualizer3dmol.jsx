import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";

import "3dmol/build/3Dmol-min.js";
const $3Dmol = window.$3Dmol;

import { parameters } from "matsci-parse";
import "./Visualizer3dmol.css";

import { covalentRadii, symbols } from "mc-periodic-table";

function mod(n, m) {
  return ((n % m) + m) % m;
}


function setCustomBondLengths() {
    // 3dmol adds 0.25 to the total bond length as a "fudge_factor"
    // to correct for this, one could here subtract 0.125 from each atom's
    // bond length but it seems it's better to keep the "fudge factor".
  covalentRadii.forEach((radius, i) => {
    if (radius === "N/A") return;
    const bondLength = 1.05 * radius;
    $3Dmol.setBondLength(symbols[i], bondLength);
  });
}

const Visualizer3dmol = forwardRef(
  ({ viewerParams, structure }, ref) => {
    const [error, setError] = useState(null);

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

      if (!structure) {
        return;
      }

      const [a, b, c, alpha, beta, gamma] = parameters(structure.lattice);

      modelRef.current.setCrystData(a, b, c, alpha, beta, gamma);

      const cellMatrix = modelRef.current.modelData.cryst.matrix;
      const fracConversionMatrix = new $3Dmol.Matrix3().getInverse3(cellMatrix);

      // Fold all input atoms into the unit cell if requested.
      const atoms = structure.sites.map((site) => {
        let frac = new $3Dmol.Vector3(
          site.frac[0],
          site.frac[1],
          site.frac[2],
        );

        if (viewerParams.packedCell) {
          frac = new $3Dmol.Vector3(
            mod(frac.x, 1),
            mod(frac.y, 1),
            mod(frac.z, 1),
          );
        }

        const cart = frac.clone().applyMatrix3(cellMatrix);

        return {
          elem: site.species.symbol,
          x: cart.x,
          y: cart.y,
          z: cart.z,
        };
      });

      const finalAtoms = [];

      // distance in fractional coordinates to the edge to be
      // considered "on edge" for packed cell option
      const edgeDelta = 0.03;
      const [nx, ny, nz] = viewerParams.supercell;

      for (let i = -1; i <= nx; i++) {
        for (let j = -1; j <= ny; j++) {
          for (let k = -1; k <= nz; k++) {
            // determine if outside
            const outside =
              i === -1 ||
              i === nx ||
              j === -1 ||
              j === ny ||
              k === -1 ||
              k === nz;

            const offset = new $3Dmol.Vector3(i, j, k).applyMatrix3(cellMatrix);

              // in case of packed cell, add all atoms from the 
              // neighboring cells that are exactly on edges
            if (outside) {
              if (!viewerParams.packedCell) {
                continue;
              }

              atoms.forEach((atom) => {
                const cart = new $3Dmol.Vector3(
                  atom.x + offset.x,
                  atom.y + offset.y,
                  atom.z + offset.z,
                );

                const frac = cart
                  .clone()
                  .applyMatrix3(fracConversionMatrix);

                if (
                  frac.x > -edgeDelta &&
                  frac.x < nx + edgeDelta &&
                  frac.y > -edgeDelta &&
                  frac.y < ny + edgeDelta &&
                  frac.z > -edgeDelta &&
                  frac.z < nz + edgeDelta
                ) {
                  finalAtoms.push({
                    elem: atom.elem,
                    x: cart.x,
                    y: cart.y,
                    z: cart.z,
                  });
                }
              });
            } else {
              atoms.forEach((atom) => {
                finalAtoms.push({
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

      modelRef.current.addAtoms(finalAtoms);
    };

    const updateView = () => {
      if (!viewerRef.current) {
        return;
      }

      viewerRef.current.removeAllModels();
      viewerRef.current.removeAllShapes();

      custom3dmolSetup();

      const style = {
        sphere: {
          scale: viewerParams.vdwRadius ? 1.0 : 0.3,
          colorscheme: "Jmol",
        },
      };

      if (viewerParams.bonds) {
        style.stick = {
          radius: 0.15,
          colorscheme: "Jmol",
        };
      }

      viewerRef.current.setStyle(style);

      if (modelRef.current) {
        viewerRef.current.addUnitCell(modelRef.current);
        modelRef.current.assignBonds();
      }

      viewerRef.current.removeAllLabels();

      if (viewerParams.atomLabels && modelRef.current) {
        modelRef.current.atoms.forEach((atom) => {
          viewerRef.current.addLabel(
            atom.elem,
            {
              position: {
                x: atom.x,
                y: atom.y,
                z: atom.z,
              },
              fontColor: "black",
              bold: true,
              fontSize: 18,
              showBackground: false,
              backgroundOpacity: 1,
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
      if (type !== "camera") {
        return;
      }

      if (value === "x") {
        viewerRef.current.setView([
          0.0, 0.0, 0.0, 0.0,
          -0.5, -0.5, -0.5, 0.5,
        ]);
      }

      if (value === "y") {
        viewerRef.current.setView([
          0.0, 0.0, 0.0, 0.0,
          0.5, 0.5, 0.5, 0.5,
        ]);
      }

      if (value === "z") {
        viewerRef.current.setView([
          0.0, 0.0, 0.0, 0.0,
          0.0, 0.0, 0.0, 1.0,
        ]);
      }

      viewerRef.current.zoomTo();
      viewerRef.current.zoom(1.4);
      viewerRef.current.render();
    };

    useImperativeHandle(ref, () => ({
      handleEvent,
    }));

    useEffect(() => {
      try {
        viewerRef.current = $3Dmol.createViewer(divIdRef.current, {
          backgroundColor: "white",
          orthographic: true,
        });

        updateView();
      } catch (e) {
        console.error(e);

        setError(
          "Structure visualizer failed to initialize. Try enabling hardware acceleration in your browser.",
        );
      }
    }, []);

    // Update view when props change
    useEffect(() => {
      if (viewerRef.current) {
        updateView();
      }
    }, [viewerParams, structure]);

    if (error) {
      return (
        <div
          className="gldiv error"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            textAlign: "center",
            padding: "10px",
            color: "red",
            fontSize: "20px",
          }}
        >
          {error}
        </div>
      );
    }

    return (
      <div id={divIdRef.current} className="gldiv">
        No data!
      </div>
    );
  },
);

Visualizer3dmol.displayName = "Visualizer3dmol";

export default Visualizer3dmol;