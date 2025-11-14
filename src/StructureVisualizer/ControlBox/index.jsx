import "./index.css";

const ControlBox = ({ viewerParams, onViewerParamChange, onViewerEvent }) => {
  const handleSupercellChange = (index, value) => {
    const newSupercell = [...viewerParams.supercell];
    newSupercell[index] = parseInt(value);
    onViewerParamChange("supercell", newSupercell);
  };

  const handleOptionChange = (option) => {
    onViewerParamChange(option, !viewerParams[option]);
  };

  const handleCameraEvent = (orientation) => {
    onViewerEvent("camera", orientation);
  };

  const handleIsoValueChange = (value) => {
    const pos = value;
    const neg = -value;

    const newSurfaces = [
      { ...viewerParams.surfaces[0], isoval: pos + 1e-6 },
      { ...viewerParams.surfaces[1], isoval: neg - 1e-6 },
    ];

    onViewerParamChange("surfaces", newSurfaces);
  };

  return (
    <div className="control-box">
      <div className="control-box-row">
        {/* Supercell controls */}
        {viewerParams.showSupercellButtons && (
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

        {/* Surfaces controls */}
        {viewerParams.surfaces?.length === 2 && (
          <div className="surface-control">
            <label>Isosurface value: </label>
            <input
              type="number"
              step="0.1"
              min="0.0"
              value={Math.abs(viewerParams.surfaces[0].isoval).toFixed(2)}
              onChange={(e) => handleIsoValueChange(parseFloat(e.target.value))}
              style={{ width: "60px", marginRight: "8px" }}
            />
          </div>
        )}
        {/* Camera controls */}
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

      {/* Options */}
      <div className="control-box-row" style={{ display: "flex" }}>
        <label className="option-checkbox">
          <input
            type="checkbox"
            checked={viewerParams.bonds}
            onChange={() => handleOptionChange("bonds")}
          />
          <span>Bonds</span>
        </label>
        <label className="option-checkbox">
          <input
            type="checkbox"
            checked={viewerParams.packedCell}
            onChange={() => handleOptionChange("packedCell")}
          />
          <span>Packed cell</span>
        </label>
        <label className="option-checkbox">
          <input
            type="checkbox"
            checked={viewerParams.atomLabels}
            onChange={() => handleOptionChange("atomLabels")}
          />
          <span>Atom labels</span>
        </label>
        <label className="option-checkbox">
          <input
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
