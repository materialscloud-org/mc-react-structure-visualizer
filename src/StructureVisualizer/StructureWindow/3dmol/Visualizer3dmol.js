import React from "react";

import * as $3Dmol from "3dmol";

import "./Visualizer3dmol.css";

async function loadStructure() {
  const response = await fetch("./mc3d-18552.cif", { method: "get" });
  const text = await response.text();

  let config = { backgroundColor: "mintcream", orthographic: true };
  let viewer = $3Dmol.createViewer("gldiv", config);
  let m = viewer.addModel(text, "cif");
  viewer.addUnitCell(m);
  viewer.replicateUnitCell(2, 2, 2, m);
  viewer.setStyle({
    sphere: { scale: 0.3, colorscheme: "Jmol" },
    stick: { radius: 0.2, colorscheme: "Jmol" },
  });
  viewer.zoomTo();
  viewer.render();
}

class Visualizer3dmol extends React.Component {
  componentDidMount() {
    loadStructure();
  }

  render() {
    return <div id="gldiv">Visualizer3dmol</div>;
  }
}

export default Visualizer3dmol;
