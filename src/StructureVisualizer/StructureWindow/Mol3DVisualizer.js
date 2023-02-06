import React from "react";

import * as $3Dmol from "3dmol";

import "./Mol3DVisualizer.css";

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

class Mol3DVisualizer extends React.Component {
  componentDidMount() {
    loadStructure();
  }

  render() {
    return <div id="gldiv">Mol3DVisualizer</div>;
  }
}

export default Mol3DVisualizer;
