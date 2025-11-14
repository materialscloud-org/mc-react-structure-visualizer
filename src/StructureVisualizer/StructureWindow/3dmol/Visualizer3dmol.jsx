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

import { parseCube } from "./cubeParser";
import { cam } from "./utils";

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

/**
Utility that builds a supercell from the atoms, matrix, fracConversion and some other params.
 */
function buildSupercell(
  atoms,
  cellMatrix,
  supercell = [1, 1, 1],
  packedCell = false,
  edgeDelta = 0.03,
) {
  const finalAtoms = [];

  const fracConversionMatrix = new $3Dmol.Matrix3().getInverse3(cellMatrix);

  for (let i = -1; i < supercell[0] + 1; i++) {
    for (let j = -1; j < supercell[1] + 1; j++) {
      for (let k = -1; k < supercell[2] + 1; k++) {
        const offset = new $3Dmol.Vector3(i, j, k).applyMatrix3(cellMatrix);

        const isEdge =
          i === -1 ||
          i === supercell[0] ||
          j === -1 ||
          j === supercell[1] ||
          k === -1 ||
          k === supercell[2];

        if (isEdge) {
          if (!packedCell) continue;

          // Edge atoms: include those that overlap due to fractional wrapping
          atoms.forEach((atom) => {
            const cart = new $3Dmol.Vector3(atom.x, atom.y, atom.z).add(offset);
            const frac = cart.clone().applyMatrix3(fracConversionMatrix);

            if (
              frac.x > -edgeDelta &&
              frac.x < supercell[0] + edgeDelta &&
              frac.y > -edgeDelta &&
              frac.y < supercell[1] + edgeDelta &&
              frac.z > -edgeDelta &&
              frac.z < supercell[2] + edgeDelta
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
          // Normal cell replication
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

  return finalAtoms;
}

const Visualizer3dmol = forwardRef(
  ({ viewerParams, cifText, cubeText }, ref) => {
    const initializedRef = useRef(false);
    const viewerRef = useRef(null);
    const modelRef = useRef(null);
    const divIdRef = useRef(
      "gldiv-" + (Math.random() + 1).toString(36).substring(7),
    );

    // Initialize custom bond lengths once
    useEffect(() => {
      setCustomBondLengths();
    }, []);

    const loadedCifRef = useRef(null);
    const loadedCubeRef = useRef(null);
    const volDataRef = useRef(null);
    const cubeParamsRef = useRef(null);

    const custom3dmolSetup = () => {
      modelRef.current = viewerRef.current.addModel();

      if (cifText) {
        // Check if we already parsed it
        let loadedCif;
        if (loadedCifRef.current) {
          console.log("Using cached CIF data");
          loadedCif = loadedCifRef.current;
        } else {
          console.log("Parsing CIF text");
          loadedCif = $3Dmol.Parsers.CIF(cifText);
          loadedCifRef.current = loadedCif; // cache it
        }

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

        const final_atoms = buildSupercell(
          loadedAtoms,
          cellMatrix,
          viewerParams.supercell,
          viewerParams.packedCell,
        );

        modelRef.current.addAtoms(final_atoms);
      }

      if (cubeText) {
        let params;
        if (cubeParamsRef.current) {
          params = cubeParamsRef.current;
        } else {
          console.log("Parsing cube parameters");
          params = parseCube(cubeText);
          cubeParamsRef.current = params; // cache it
        }

        let vol;
        if (volDataRef.current) {
          vol = volDataRef.current;
        } else {
          console.log("Creating new volumetric data");
          vol = new $3Dmol.VolumeData(params.shiftedCif, "cube");
          volDataRef.current = vol; // cache it
        }

        let loadedCube;
        if (loadedCubeRef.current) {
          loadedCube = loadedCubeRef.current;
        } else {
          console.log("Parsing cube atoms");
          loadedCube = $3Dmol.Parsers.CUBE(params.shiftedCif);
          loadedCubeRef.current = loadedCube; // cache it
        }

        let loadedAtoms = loadedCube[0];

        modelRef.current.setCrystData(
          params.a,
          params.b,
          params.c,
          params.alpha,
          params.beta,
          params.gamma,
        );

        // Render isosurfaces based on viewerParams.surfaces
        if (viewerParams.surfaces?.length) {
          viewerParams.surfaces.forEach((s) => {
            viewerRef.current.addIsosurface(vol, {
              isoval: s.isoval,
              color: s.color,
              opacity: s.opacity ?? 0.4,
              smooth: s.smooth ?? true,
            });
          });
        }

        const cellMatrix = modelRef.current.modelData.cryst.matrix;
        const final_atoms = buildSupercell(
          loadedAtoms,
          cellMatrix,
          viewerParams.supercell,
          viewerParams.packedCell,
        );

        modelRef.current.addAtoms(final_atoms);
      }
    };

    const updateView = () => {
      viewerRef.current.removeAllModels();
      viewerRef.current.removeAllShapes();

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
    };

    const handleEvent = (type, value) => {
      if (type == "camera") {
        if (value == "x") {
          viewerRef.current.setView(cam.x);
        }
        if (value == "y") {
          viewerRef.current.setView(cam.y);
        }
        if (value == "z") {
          viewerRef.current.setView(cam.z);
        }
        viewerRef.current.zoomTo();
        viewerRef.current.zoom(1.4);
      }
    };

    // Expose handleEvent method to parent via ref
    useImperativeHandle(ref, () => ({
      handleEvent,
    }));

    function zoomIn() {
      // we only zoom once the atoms have been loaded.
      const atomsExist =
        Array.isArray(modelRef.current.atoms) &&
        modelRef.current.atoms.length > 0;

      // we only zoom once the atoms have been loaded.
      if (atomsExist) {
        viewerRef.current.zoomTo();
        viewerRef.current.zoom(1.4);
      }
      viewerRef.current.render();
    }

    // Initialize viewer on mount
    useEffect(() => {
      let config = { backgroundColor: "white", orthographic: true };
      viewerRef.current = $3Dmol.createViewer(divIdRef.current, config);
      updateView();
      zoomIn();
    }, []);

    // Update view when props change
    useEffect(() => {
      if (viewerRef.current) {
        updateView();
        viewerRef.current.render();
      }
    }, [viewerParams, cifText, cubeText]);

    // apply the zoom reset only on large data load or supercell change.
    useEffect(() => {
      if (viewerRef.current) {
        updateView();
        zoomIn();
      }
    }, [viewerParams.supercell, cifText, cubeText]);

    return (
      <div id={divIdRef.current} className="gldiv">
        No data!
      </div>
    );
  },
);

Visualizer3dmol.displayName = "Visualizer3dmol";

export default Visualizer3dmol;
