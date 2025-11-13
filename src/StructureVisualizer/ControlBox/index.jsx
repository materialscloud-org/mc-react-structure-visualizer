import "./index.css";

const ControlBox = ({
  viewerParams,
  onViewerParamChange,
  onViewerEvent,
  hideSupercellButtons,
}) => {
  const handleSupercellChange = (index, value) => {
    let newSupercell = viewerParams.supercell;
    newSupercell[index] = parseInt(value);
    onViewerParamChange("supercell", newSupercell);
  };

  const handleOptionChange = (option) => {
    onViewerParamChange(option, !viewerParams[option]);
  };

  const handleCameraEvent = (orientation) => {
    onViewerEvent("camera", orientation);
  };

  return (
    <div className="control-box">
      <div className="control-box-row">
        {/* Hide supercellflag. */}
        {!hideSupercellButtons && (
          <div className="supercell-container">
            <label>Supercell: </label>
            <div style={{ display: "flex" }}>
              {[0, 1, 2].map((index) => (
                <input
                  key={index}
                  className="supercell-input"
                  type="number"
                  min="1"
                  max="99"
                  value={viewerParams.supercell[index]}
                  onChange={(e) => handleSupercellChange(index, e.target.value)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="camera-controls">
          <label>Camera: </label>
          <button
            className="camera-button"
            onClick={() => handleCameraEvent("x")}
          >
            x
          </button>
          <button
            className="camera-button"
            onClick={() => handleCameraEvent("y")}
          >
            y
          </button>
          <button
            className="camera-button"
            onClick={() => handleCameraEvent("z")}
          >
            z
          </button>
        </div>
      </div>
      <div className="control-box-row" style={{ display: "flex" }}>
        <label className="option-checkbox">
          <input
            className="control-box-input"
            type="checkbox"
            checked={viewerParams.bonds}
            onChange={() => handleOptionChange("bonds")}
          />
          <span>Bonds</span>
        </label>
        <label className="option-checkbox">
          <input
            className="control-box-input"
            type="checkbox"
            checked={viewerParams.packedCell}
            onChange={() => handleOptionChange("packedCell")}
          />
          <span>Packed cell</span>
        </label>
        <label className="option-checkbox">
          <input
            className="control-box-input"
            type="checkbox"
            checked={viewerParams.atomLabels}
            onChange={() => handleOptionChange("atomLabels")}
          />
          <span>Atom labels</span>
        </label>
        <label className="option-checkbox">
          <input
            className="control-box-input"
            type="checkbox"
            checked={viewerParams.spaceFilling}
            onChange={() => handleOptionChange("vdwRadius")}
          />
          <span>vdW radius</span>
        </label>
      </div>
    </div>
  );
};

export default ControlBox;
