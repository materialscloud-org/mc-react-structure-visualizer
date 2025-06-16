import React, { useRef, useState, useEffect } from "react";
import tinycolor from "tinycolor2";
import "./ColorBarPicker.css";

const RainbowColorBar = ({ color, onChange, popoutStyle = {} }) => {
  const [show, setShow] = useState(false);
  const barRef = useRef(null);
  const triggerRef = useRef(null);

  const handleClick = (e) => {
    const rect = barRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    console.log(
      "Click X:",
      e.clientX,
      "Bar left:",
      rect.left,
      "x:",
      x,
      "width:",
      rect.width,
    );
    const percent = x / rect.width;
    const hue = percent * 360;
    const selectedHSL = `hsl(${hue}, 100%, 50%)`;
    const selectedColor = tinycolor(selectedHSL).toHexString();
    onChange(selectedColor);
    setShow(false);
  };

  return (
    <div className="rainbow-picker-wrapper">
      <div
        className="color-preview"
        style={{ backgroundColor: color }}
        onClick={() => setShow((s) => !s)}
        ref={triggerRef}
      />
      {show && (
        <div
          className="color-bar-popout"
          ref={barRef}
          style={popoutStyle}
          onClick={handleClick}
        ></div>
      )}
    </div>
  );
};

export default RainbowColorBar;
