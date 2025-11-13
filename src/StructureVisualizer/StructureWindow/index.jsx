import Visualizer3dmol from "./3dmol/Visualizer3dmol";
import "./index.css";

const StructureWindow = ({
  mouseEnabled,
  setMouseEnabledState,
  visualizerRef,
  viewerParams,
  cifText,
  cubeText,
}) => {
  let swClassName = "structure-window";
  if (!mouseEnabled) swClassName += " disable-mouse";

  let mouseNoteText = "Click to interact";
  let mouseNoteClass = "mouse-disabled-note";
  if (mouseEnabled) {
    mouseNoteClass = "mouse-disabled-note on";
  }

  return (
    <div className="structure-window-outer">
      <div
        className="structure-window-click-handler"
        onClick={() => setMouseEnabledState(true)}
      >
        <div className={swClassName}>
          <Visualizer3dmol
            ref={visualizerRef}
            viewerParams={viewerParams}
            cifText={cifText}
            cubeText={cubeText}
          />
        </div>
      </div>
      <div
        className={mouseNoteClass}
        onClick={() => setMouseEnabledState(!mouseEnabled)}
      >
        {mouseNoteText}
      </div>
    </div>
  );
};

export default StructureWindow;
