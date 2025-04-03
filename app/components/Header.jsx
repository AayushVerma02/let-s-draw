"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

// Dummy implementations for file operations and canvas actions
// In a real app, these functions should be replaced with actual logic
const openFile = () => {
  console.log("Open file operation triggered.");
  // Dummy code: open a file dialog, load content, etc.
};

const saveFile = () => {
  console.log("Save file operation triggered.");
  // Dummy code: convert canvas to JSON or image, and save to disk
};

const exportImage = () => {
  console.log("Export image operation triggered.");
  // Dummy code: export the canvas as PNG/JPEG and download it
};

const deleteSelected = () => {
  console.log("Delete selected object(s) triggered.");
  // Dummy code: remove currently selected objects from the canvas
};

const undoAction = () => {
  console.log("Undo action triggered.");
  // Dummy code: revert the last canvas operation
};

const redoAction = () => {
  console.log("Redo action triggered.");
  // Dummy code: reapply the last undone canvas operation
};

const changeCanvasBackground = (color) => {
  console.log("Canvas background changed to:", color);
  // Dummy code: update canvas background color accordingly
};

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("English");
  const menuRef = useRef(null);

  // State for storing canvas actions for undo/redo (dummy)
  const [actionStack, setActionStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle theme and update document class
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      return newTheme;
    });
  };

  // File operation handlers
  const handleOpenFile = useCallback(() => {
    openFile();
    setActionStack((prev) => [...prev, "open"]);
  }, []);

  const handleSaveFile = useCallback(() => {
    saveFile();
    setActionStack((prev) => [...prev, "save"]);
  }, []);

  const handleExportImage = useCallback(() => {
    exportImage();
    setActionStack((prev) => [...prev, "export"]);
  }, []);

  // Delete handler
  const handleDelete = useCallback(() => {
    deleteSelected();
    setActionStack((prev) => [...prev, "delete"]);
  }, []);

  // Undo handler
  const handleUndo = useCallback(() => {
    if (actionStack.length > 0) {
      const lastAction = actionStack[actionStack.length - 1];
      setRedoStack((prev) => [...prev, lastAction]);
      setActionStack((prev) => prev.slice(0, prev.length - 1));
      undoAction();
    }
  }, [actionStack]);

  // Redo handler
  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const lastRedo = redoStack[redoStack.length - 1];
      setActionStack((prev) => [...prev, lastRedo]);
      setRedoStack((prev) => prev.slice(0, prev.length - 1));
      redoAction();
    }
  }, [redoStack]);

  // Handle background color change
  const handleBackgroundChange = (color) => {
    changeCanvasBackground(color);
  };

  // Keyboard shortcuts for Delete, Undo, Redo
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Delete") {
        handleDelete();
      } else if (event.ctrlKey && event.key.toLowerCase() === "z") {
        if (event.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleDelete, handleUndo, handleRedo]);

  // Simulated collaboration toggle (dummy)
  const [collaborate, setCollaborate] = useState(false);
  const toggleCollaboration = () => {
    setCollaborate((prev) => !prev);
    console.log("Collaboration mode:", !collaborate);
    setActionStack((prev) => [...prev, "collaborate"]);
  };

  // Simulate command palette trigger (dummy)
  const triggerCommandPalette = () => {
    console.log("Command palette triggered.");
    setActionStack((prev) => [...prev, "commandPalette"]);
  };

  // Simulated reset canvas action (dummy)
  const resetCanvas = () => {
    console.log("Canvas reset.");
    setActionStack((prev) => [...prev, "reset"]);
  };

  // Render the header menu with all features
  return (
    <div className="absolute top-5 left-5">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-2 rounded-md bg-gray-700 text-white"
      >
        {menuOpen ? "✖" : "☰"}
      </button>
      {menuOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-12 left-0 w-64 bg-gray-900 text-white rounded-md shadow-lg z-50 p-4 space-y-2"
        >
          <button
            onClick={handleOpenFile}
            className="flex items-center w-full text-left hover:bg-gray-700 p-2 rounded"
          >
            📂 Open
          </button>
          <button
            onClick={handleSaveFile}
            className="flex items-center w-full text-left hover:bg-gray-700 p-2 rounded"
          >
            💾 Save to...
          </button>
          <button
            onClick={handleExportImage}
            className="flex items-center w-full text-left hover:bg-gray-700 p-2 rounded"
          >
            📤 Export Image
          </button>
          <button
            onClick={toggleCollaboration}
            className="flex items-center w-full text-left hover:bg-gray-700 p-2 rounded"
          >
            {collaborate ? "🔴 Stop Collaboration" : "🌍 Live Collaboration"}
          </button>
          <button
            onClick={triggerCommandPalette}
            className="flex items-center w-full text-left hover:bg-gray-700 p-2 rounded"
          >
            🎨 Command Palette
          </button>
          <hr className="border-gray-600" />
          <button
            onClick={resetCanvas}
            className="flex items-center w-full text-left hover:bg-gray-700 p-2 rounded"
          >
            🔄 Reset Canvas
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center w-full text-left hover:bg-red-700 p-2 rounded text-red-400"
          >
            🗑 Delete (Del)
          </button>
          <button
            onClick={handleUndo}
            className="flex items-center w-full text-left hover:bg-gray-700 p-2 rounded"
          >
            ⏪ Undo (Ctrl + Z)
          </button>
          <button
            onClick={handleRedo}
            className="flex items-center w-full text-left hover:bg-gray-700 p-2 rounded"
          >
            ⏩ Redo (Ctrl + Shift + Z)
          </button>
          <hr className="border-gray-600" />
          <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
            <span>Theme</span>
            <button onClick={toggleTheme} className="p-1 rounded-md">
              {theme === "dark" ? "🌙" : "☀"}
            </button>
          </div>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded-md"
          >
            <option>English</option>
            <option>हिन्दी</option>
            <option>Español</option>
          </select>
          <div className="flex space-x-2 mt-2">
            {["#000", "#222", "#444", "#666", "#888"].map((color, index) => (
              <button
                key={index}
                onClick={() => handleBackgroundChange(color)}
                className="w-6 h-6 rounded border border-gray-500"
                style={{ backgroundColor: color }}
              ></button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Header;