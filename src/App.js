import React, { useState, useEffect } from "react";

// Note: Bootstrap is not really used.
// Just the default css is loaded to test how the component works with bootstrap.
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import StructureVisualizer from "./StructureVisualizer";

async function fetchCif3D() {
  // Fetch a cif file from the Materials Cloud AiiDA rest api
  const aiidaRestEndpoint = "https://aiida.materialscloud.org/mc3d/api/v4";
  const uuid = "85260507-9cb4-4849-a10d-703f32697dd7";
  //const uuid = "07e48338-e639-485c-bed0-5f23bf6cfae2"; // Ag
  //const uuid = "e36f52ac-0f64-47eb-86eb-550608c8672c"; // BN mc3d-66325/pbe
  //const uuid = "aaea1e0f-337c-453f-a23a-acc06ddc93c9"; // BaTiO3 mc3d-46554/pbe
  //const uuid = "a490b0ff-012a-44c8-a48a-f734dc634b3c"; // EuI4La mc3d-34858/pbe

  const responseAiiDACif = await fetch(
    `${aiidaRestEndpoint}/nodes/${uuid}/download?download_format=cif&download=false`
  );
  const jsonAiiDACif = await responseAiiDACif.json();

  return jsonAiiDACif.data.download.data;
}

async function fetchCif2D() {
  // Fetch a cif file from the Materials Cloud AiiDA rest api
  const aiidaRestEndpoint = "https://aiida.materialscloud.org/mc2d/api/v4";
  const uuid = "42744ae7-0c30-43df-8136-ab625b4f8425"; // graphene

  const responseAiiDACif = await fetch(
    `${aiidaRestEndpoint}/nodes/${uuid}/download?download_format=cif&download=false`
  );
  const jsonAiiDACif = await responseAiiDACif.json();

  return jsonAiiDACif.data.download.data;
}

function App() {
  const [cifText3D, setCifText3D] = useState(null);
  const [cifText2D, setCifText2D] = useState(null);

  // componentDidMount equivalent
  useEffect(() => {
    fetchCif3D().then((cifText) => {
      setCifText3D(cifText);
    });
    fetchCif2D().then((cifText) => {
      setCifText2D(cifText);
    });
  });

  return (
    <div className="App">
      <StructureVisualizer cifText={cifText3D} />
      <div style={{margin: "10px"}}></div>
      <StructureVisualizer cifText={cifText2D} initSupercell={[3, 3, 1]} />
    </div>
  );
}

export default App;
