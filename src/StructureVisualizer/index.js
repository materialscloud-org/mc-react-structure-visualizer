import React, { useState, useEffect, useRef } from "react";
import ControlBox from "./ControlBox";
import StructureWindow from "./StructureWindow";
import "./index.css";

const StructureVisualizer = (props) => {
  const [viewerParams, setViewerParams] = useState({
    supercell: props.initSupercell || [2, 2, 2],
    bonds: true,
    atomLabels: false,
    packedCell: false,
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

  return (
    <div ref={wrapperRef} className="structure-visualizer">
      <StructureWindow
        visualizerRef={visualizerRef}
        viewerParams={viewerParams}
        cifText={props.cifText}
        mouseEnabled={mouseEnabled}
        setMouseEnabledState={setMouseEnabledState}
      />
      <ControlBox
        viewerParams={viewerParams}
        onViewerParamChange={handleViewerParamChange}
        onViewerEvent={handleViewerEvent}
      />
    </div>
  );
};

export default StructureVisualizer;
