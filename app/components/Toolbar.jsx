import React, { useState } from "react";

export default function Toolbar({ onToolChange }) {
  const [activeTool, setActiveTool] = useState("");

  const handleToolClick = (tool) => {
    setActiveTool(tool);
    onToolChange(tool);
  };

  const buttonClass = (tool) => {
    return `p-2 rounded cursor-pointer transition-all duration-200 ${
      activeTool === tool ? "bg-gray-600 backdrop-blur-md" : ""
    }`;
  };

  return (
    <div
      className="fixed bottom-5 left-1/2 transform -translate-x-1/2 
                 bg-gray-900 text-white p-2 rounded-lg shadow-lg px-5 
                 z-50 pointer-events-auto flex justify-center items-center"
    >
      <button className={buttonClass("lock")} onClick={() => handleToolClick("lock")}>
        <img src="/lock.svg" alt="Lock" className="h-5" />
      </button>
      <div className="border-l h-[50px] border-gray-600"></div>
      <button className={buttonClass("hand")} onClick={() => handleToolClick("hand")}>
        <img src="/hand.png" alt="Hand" className="h-5" />
      </button>
      <button className={buttonClass("cursor")} onClick={() => handleToolClick("cursor")}>
        <img src="/cursor.svg" alt="Cursor" className="h-6" />
      </button>
      <button className={buttonClass("rectangle")} onClick={() => handleToolClick("rectangle")}>
        <img src="/square.png" alt="Rectangle" className="h-5" />
      </button>
      <button className={buttonClass("rhombus")} onClick={() => handleToolClick("rhombus")}>
        <img src="/rhombus.png" alt="Rhombus" className="h-5" />
      </button>
      <button className={buttonClass("circle")} onClick={() => handleToolClick("circle")}>
        <img src="/circle.png" alt="Circle" className="h-5" />
      </button>
      <button className={buttonClass("arrow")} onClick={() => handleToolClick("arrow")}>
        <img src="/right.png" alt="Arrow" className="w-7" />
      </button>
      <button className={buttonClass("line")} onClick={() => handleToolClick("line")}>
        <img src="/line.png" alt="Line" className="h-5" />
      </button>
      <button className={buttonClass("draw")} onClick={() => handleToolClick("draw")}>
        <img src="/draw.png" alt="Draw" className="h-5" />
      </button>
      <button className={buttonClass("text")} onClick={() => handleToolClick("text")}>
        <img src="/text.png" alt="Text" className="h-5" />
      </button>
      <button className={buttonClass("image")} onClick={() => handleToolClick("image")}>
        <img src="/image.png" alt="Image" className="h-5" />
      </button>
      <button className={buttonClass("eraser")} onClick={() => handleToolClick("eraser")}>
        <img src="/eraser.png" alt="Eraser" className="h-5" />
      </button>
    </div>
  );
}