// import { useState } from "react";

// export default function Toolbar({ onToolChange }) {
//   const [selectedTool, setSelectedTool] = useState("draw");

//   const handleToolChange = (tool) => {
//     setSelectedTool(tool);
//     onToolChange(tool);
//   };

//   return (
//     <div className="absolute flex justify-center items-center gap-5 fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white p-2 rounded-lg shadow-lg px-5 pointer-events-auto">
//       <button
//         className={`p-1 rounded ${selectedTool === "draw" ? "bg-gray-700" : ""}`}
//         onClick={() => handleToolChange("draw")}
//       >
//         ✏️ Draw
//       </button>
//       <button
//         className={`p-1 rounded ${selectedTool === "eraser" ? "bg-gray-700" : ""}`}
//         onClick={() => handleToolChange("eraser")}
//       >
//         🧽 Eraser
//       </button>
//       <button
//         className={`p-1 rounded ${selectedTool === "remove" ? "bg-gray-700" : ""}`}
//         onClick={() => handleToolChange("remove")}
//       >
//         🗑️ Delete Objects
//       </button>
//     </div>
//   );
// }