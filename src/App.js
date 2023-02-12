import React, { useState, useEffect } from "react";

import "./App.css";
import StructureVisualizer from "./StructureVisualizer";

async function fetchCif() {
  // Fetch a cif file from the Materials Cloud AiiDA rest api
  const aiidaRestEndpoint = "https://aiida.materialscloud.org/mc3d/api/v4";
  const uuid = "85260507-9cb4-4849-a10d-703f32697dd7";

  const responseAiiDACif = await fetch(
    `${aiidaRestEndpoint}/nodes/${uuid}/download?download_format=cif&download=false`
  );
  const jsonAiiDACif = await responseAiiDACif.json();

  console.log(jsonAiiDACif);

  return jsonAiiDACif.data.download.data;
}

function App() {
  const [cifText, setCifText] = useState(null);

  // componentDidMount equivalent
  useEffect(() => {
    fetchCif().then((cifText) => {
      setCifText(cifText);
    });
  });

  return (
    <div className="App">
      <StructureVisualizer cifText={cifText} />
    </div>
  );
}

export default App;
