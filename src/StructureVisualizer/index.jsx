import React, { useState, useEffect, useRef } from "react";
import ControlBox from "./ControlBox";
import StructureWindow from "./StructureWindow";
import "./index.css";

const StructureVisualizer = (props) => {
  const [viewerParams, setViewerParams] = useState({
    supercell: props.initSupercell || [2, 2, 2],
    bonds: true,
    packedCell: true,
    atomLabels: false,
    vdwRadius: false,
  });
  const [mouseEnabled, setMouseEnabled] = useState(false);
  const visualizerRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef && !wrapperRef.current.contains(event.target)) {
        setMouseEnabled(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const setMouseEnabledState = (state) => {
    setMouseEnabled(state);
  };

  const handleViewerParamChange = (param, value) => {
    setViewerParams((prevParams) => ({
      ...prevParams,
      [param]: value,
    }));
  };

  const handleViewerEvent = (param, value) => {
    visualizerRef.current.handleEvent(param, value);
  };

  // it doesnt make sense to render supercells for cubeData.
  let hideSuperCellButtons = false;
  if (props.cubeText) {
    hideSuperCellButtons = true;
  }

  return (
    <div ref={wrapperRef} className="structure-visualizer">
      <StructureWindow
        visualizerRef={visualizerRef}
        viewerParams={viewerParams}
        cifText={props.cifText}
        cubeText={props.cubeText}
        mouseEnabled={mouseEnabled}
        setMouseEnabledState={setMouseEnabledState}
      />
      <ControlBox
        viewerParams={viewerParams}
        onViewerParamChange={handleViewerParamChange}
        onViewerEvent={handleViewerEvent}
        hideSupercellButtons
      />
    </div>
  );
};

export default StructureVisualizer;
