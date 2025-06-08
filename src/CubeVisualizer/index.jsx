import React, { useState, useEffect, useRef } from "react";
import ControlBox from "./ControlBox";
import CubeWindow from "./CubeWindow";
import "./index.css";

const CubeVisualizer = (props) => {
  const [viewerParams, setViewerParams] = useState({
    supercell: props.initSupercell || [1, 1, 1],
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

  return (
    <div ref={wrapperRef} className="cube-visualizer">
      <CubeWindow
        visualizerRef={visualizerRef}
        viewerParams={viewerParams}
        cubeText={props.cubeText}
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

export default CubeVisualizer;
