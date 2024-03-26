import { useState, useEffect } from "react";

import "./App.css";
import StructureVisualizer from "./StructureVisualizer";

async function fetchCif3D() {
  // Fetch a cif file from the Materials Cloud AiiDA rest api
  const aiidaRestEndpoint = "https://aiida.materialscloud.org/mc3d/api/v4";
  let uuid = "85260507-9cb4-4849-a10d-703f32697dd7";

  // potentially problematic cases w.r.t. bond lengths
  // uuid = "07e48338-e639-485c-bed0-5f23bf6cfae2"; // Ag
  // uuid = "e36f52ac-0f64-47eb-86eb-550608c8672c"; // BN mc3d-66325/pbe
  // uuid = "aaea1e0f-337c-453f-a23a-acc06ddc93c9"; // BaTiO3 mc3d-46554/pbe
  // uuid = "a490b0ff-012a-44c8-a48a-f734dc634b3c"; // EuI4La mc3d-34858/pbe
  // uuid = "74046bff-82f1-4ced-b33e-54c09db90b78"; // "bizarre" graphite mc3d-19759/pbe
  // uuid = "f5e7395f-ecad-4227-9789-21e7e4d21124"; // Al2H4Li2O14Si4 (water molecule) mc3d-12502/pbe

  const responseAiiDACif = await fetch(
    `${aiidaRestEndpoint}/nodes/${uuid}/download?download_format=cif&download=false`,
  );
  const jsonAiiDACif = await responseAiiDACif.json();

  return jsonAiiDACif.data.download.data;
}

async function fetchCif2D() {
  // Fetch a cif file from the Materials Cloud AiiDA rest api
  const aiidaRestEndpoint = "https://aiida.materialscloud.org/mc2d/api/v4";

  let uuid = "42744ae7-0c30-43df-8136-ab625b4f8425"; // graphene

  // potentially problematic cases w.r.t. bond lengths
  uuid = "89a8e9ec-d89b-47bb-a85e-8f1b6734a69c"; // Bi

  const responseAiiDACif = await fetch(
    `${aiidaRestEndpoint}/nodes/${uuid}/download?download_format=cif&download=false`,
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
      <div style={{ margin: "10px" }}></div>
      <StructureVisualizer cifText={cifText2D} initSupercell={[3, 3, 1]} />
    </div>
  );
}

export default App;
