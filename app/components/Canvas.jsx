"use client";

import React, { useEffect, useRef, useState } from "react";
let eraserCursorGlobal = null;
import * as fabric from "fabric";
import Toolbar from "./Toolbar";
import Header from "./Header";

export default function Canvas() {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [selectedTool, setSelectedTool] = useState("draw");

  const startPoint = useRef(null);
  const currentObject = useRef(null);

  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const isErasing = useRef(false);

  useEffect(() => {
    const canvas = new fabric.Canvas("drawing-canvas", {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "transparent",
      selection: false,
    });
    fabricCanvasRef.current = canvas;

    // Default tool: Free drawing
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = "white";
    canvas.freeDrawingBrush.width = 3;
    canvas.defaultCursor = "crosshair";

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    updateTool(selectedTool);
  }, [selectedTool]);
  const updateTool = (tool) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");
    canvas.isDrawingMode = false;
    canvas.selection = false;
    canvas.defaultCursor = "default";
    currentObject.current = null;
    startPoint.current = null;

    // FREE DRAWING (brush)
    if (tool === "draw") {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.color = "white";
      canvas.freeDrawingBrush.width = 3;
      canvas.defaultCursor = "crosshair";

      // HAND (pan)
    } else if (tool === "hand") {
      canvas.defaultCursor = "grab";
      canvas.on("mouse:down", (opt) => {
        isPanning.current = true;
        lastPos.current = { x: opt.e.clientX, y: opt.e.clientY };
        canvas.defaultCursor = "grabbing";
      });
      canvas.on("mouse:move", (opt) => {
        if (!isPanning.current) return;
        const e = opt.e;
        const vpt = canvas.viewportTransform;
        vpt[4] += e.clientX - lastPos.current.x;
        vpt[5] += e.clientY - lastPos.current.y;
        canvas.requestRenderAll();
        lastPos.current = { x: e.clientX, y: e.clientY };
      });
      canvas.on("mouse:up", () => {
        isPanning.current = false;
        canvas.defaultCursor = "grab";
      });

      // CURSOR / ARROW (selection)
    } else if (tool === "cursor") {
      canvas.selection = true;
      canvas.defaultCursor = "default";
      // RECTANGLE: Two-point rectangle (like MS Paint)
    } else if (tool === "arrow") {
      canvas.defaultCursor = "crosshair";

      let isDrawing = false;
      let startX, startY;
      let arrowLine = null;
      let arrowHead = null;

      canvas.on("mouse:down", function (event) {
        isDrawing = true;

        const pointer = canvas.getPointer(event.e);
        startX = pointer.x;
        startY = pointer.y;

        // Create line
        arrowLine = new fabric.Line([startX, startY, startX, startY], {
          stroke: "white",
          strokeWidth: 2,
          selectable: false,
          evented: false,
        });

        canvas.add(arrowLine);
      });

      canvas.on("mouse:move", function (event) {
        if (!isDrawing || !arrowLine) return;

        const pointer = canvas.getPointer(event.e);
        arrowLine.set({
          x2: pointer.x,
          y2: pointer.y,
        });

        canvas.renderAll();
      });

      canvas.on("mouse:up", function (event) {
        if (!isDrawing) return;
        isDrawing = false;

        const pointer = canvas.getPointer(event.e);
        const endX = pointer.x;
        const endY = pointer.y;

        // Calculate angle for arrowhead
        const angle =
          Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
        const arrowSize = 10;

        const arrowPoints = [
          { x: -arrowSize, y: arrowSize / 2 },
          { x: 0, y: 0 },
          { x: -arrowSize, y: -arrowSize / 2 },
        ];

        // Create arrowhead for this specific line
        arrowHead = new fabric.Polygon(arrowPoints, {
          fill: "white",
          left: endX,
          top: endY,
          angle: angle,
          originX: "center",
          originY: "center",
          selectable: false,
          evented: false,
        });

        canvas.add(arrowHead);
        canvas.renderAll();
      });
    } else if (tool === "rectangle") {
      canvas.defaultCursor = "crosshair";
      canvas.on("mouse:down", (opt) => {
        const pointer = canvas.getPointer(opt.e);
        startPoint.current = { x: pointer.x, y: pointer.y };
        currentObject.current = new fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          width: 0,
          height: 0,
          fill: "",
          stroke: "white",
          strokeWidth: 2,
          selectable: false,
        });
        canvas.add(currentObject.current);
      });
      canvas.on("mouse:move", (opt) => {
        if (!currentObject.current || !startPoint.current) return;
        const pointer = canvas.getPointer(opt.e);
        const left = Math.min(startPoint.current.x, pointer.x);
        const top = Math.min(startPoint.current.y, pointer.y);
        const width = Math.abs(pointer.x - startPoint.current.x);
        const height = Math.abs(pointer.y - startPoint.current.y);
        currentObject.current.set({ left, top, width, height });
        canvas.renderAll();
      });
      canvas.on("mouse:up", () => {
        currentObject.current = null;
      });
    } else if (tool === "rhombus") {
      canvas.defaultCursor = "crosshair";
      canvas.on("mouse:down", (opt) => {
        const pointer = canvas.getPointer(opt.e);
        startPoint.current = { x: pointer.x, y: pointer.y };
        currentObject.current = new fabric.Polygon(
          [
            { x: pointer.x, y: pointer.y },
            { x: pointer.x, y: pointer.y },
            { x: pointer.x, y: pointer.y },
            { x: pointer.x, y: pointer.y },
          ],
          {
            fill: "",
            stroke: "white",
            strokeWidth: 2,
            selectable: false,
          }
        );
        canvas.add(currentObject.current);
      });
      canvas.on("mouse:move", (opt) => {
        if (!currentObject.current || !startPoint.current) return;
        const pointer = canvas.getPointer(opt.e);
        const x1 = startPoint.current.x;
        const y1 = startPoint.current.y;
        const x2 = pointer.x;
        const y2 = pointer.y;
        const left = Math.min(x1, x2);
        const right = Math.max(x1, x2);
        const top = Math.min(y1, y2);
        const bottom = Math.max(y1, y2);
        const midX = (left + right) / 2;
        const midY = (top + bottom) / 2;
        const points = [
          { x: midX, y: top },
          { x: right, y: midY },
          { x: midX, y: bottom },
          { x: left, y: midY },
        ];
        currentObject.current.set({ points });
        canvas.renderAll();
      });
      canvas.on("mouse:up", () => {
        currentObject.current = null;
      });

    } else if (tool === "circle") {
      canvas.defaultCursor = "crosshair";
      canvas.on("mouse:down", (opt) => {
        const pointer = canvas.getPointer(opt.e);
        startPoint.current = { x: pointer.x, y: pointer.y };
        currentObject.current = new fabric.Ellipse({
          left: pointer.x,
          top: pointer.y,
          rx: 0,
          ry: 0,
          fill: "",
          stroke: "white",
          strokeWidth: 2,
          originX: "center",
          originY: "center",
          selectable: false,
        });
        canvas.add(currentObject.current);
      });
      canvas.on("mouse:move", (opt) => {
        if (!currentObject.current || !startPoint.current) return;
        const pointer = canvas.getPointer(opt.e);
        const rx = Math.abs(pointer.x - startPoint.current.x) / 2;
        const ry = Math.abs(pointer.y - startPoint.current.y) / 2;
        const centerX = (startPoint.current.x + pointer.x) / 2;
        const centerY = (startPoint.current.y + pointer.y) / 2;
        currentObject.current.set({ rx, ry, left: centerX, top: centerY });
        canvas.renderAll();
      });
      canvas.on("mouse:up", () => {
        currentObject.current = null;
      });

    } else if (tool === "line") {
      canvas.defaultCursor = "crosshair";
      canvas.on("mouse:down", (opt) => {
        const pointer = canvas.getPointer(opt.e);
        startPoint.current = { x: pointer.x, y: pointer.y };
        currentObject.current = new fabric.Line(
          [pointer.x, pointer.y, pointer.x, pointer.y],
          { stroke: "white", strokeWidth: 2, selectable: false }
        );
        canvas.add(currentObject.current);
      });
      canvas.on("mouse:move", (opt) => {
        if (!currentObject.current) return;
        const pointer = canvas.getPointer(opt.e);
        currentObject.current.set({ x2: pointer.x, y2: pointer.y });
        canvas.renderAll();
      });
      canvas.on("mouse:up", () => {
        currentObject.current = null;
      });
    } else if (tool === "text") {
      canvas.defaultCursor = "text";
  
      const textCreationHandler = function (event) {
        const pointer = canvas.getPointer(event.e);
    
        const textbox = new fabric.Textbox("", {
          left: pointer.x,
          top: pointer.y,
          width: 150, 
          fontSize: 20,
          fontFamily: `"Cedarville Cursive", cursive`,
          fill: "white",
          borderColor: "#cbd5e0",         
          editingBorderColor: "#cbd5e0",    
          hasControls: true,
          selectable: true,
          editable: true,
          splitByGrapheme: true,
        });
    
        canvas.add(textbox);
        canvas.setActiveObject(textbox);
        textbox.enterEditing();
        textbox.on("changed", function () {
          const maxWidth = 700;
          const padding = 20;
          const tempText = new fabric.Text(textbox.text || " ", {
            fontSize: textbox.fontSize,
            fontFamily: textbox.fontFamily,
          });
          const newWidth = Math.min(tempText.width + padding, maxWidth);
          textbox.set("width", newWidth);
    
          canvas.renderAll();
        });
        textbox.on("keydown", function (e) {
          if (e.key === "Enter" && !e.shiftKey) {
            textbox.exitEditing();
            canvas.renderAll();
            e.preventDefault();
          }
        });
        const outsideClickHandler = function (e) {
          if (textbox.isEditing && e.target !== textbox) {
            textbox.exitEditing();
            canvas.renderAll();
            canvas.off("mouse:down", outsideClickHandler);
          }
        };
        canvas.on("mouse:down", outsideClickHandler);
      };
      canvas.on("mouse:down", textCreationHandler);
    } if (tool !== "eraser") {
      if (eraserCursorGlobal && fabricCanvasRef.current) {
        fabricCanvasRef.current.remove(eraserCursorGlobal);
        eraserCursorGlobal = null;
        fabricCanvasRef.current.renderAll();
      }
    } else if (tool === "eraser") {
      const canvas = fabricCanvasRef.current;
      canvas.isDrawingMode = false;
      canvas.selection = false;
      canvas.defaultCursor = "none";
    
      const eraserSize = 15;
      eraserCursorGlobal = new fabric.Circle({
        radius: eraserSize / 2,
        stroke: "white",
        strokeWidth: 2,
        fill: "transparent",
        originX: "center",
        originY: "center",
        selectable: false,
        evented: false,
      });
      canvas.add(eraserCursorGlobal);
    
      let isErasing = false;
    
      function updateEraser(event) {
        if (!eraserCursorGlobal) return;
        const pointer = canvas.getPointer(event.e);
        eraserCursorGlobal.set({ left: pointer.x, top: pointer.y });
        // To keep the cursor on top, remove and re-add it
        canvas.remove(eraserCursorGlobal);
        canvas.add(eraserCursorGlobal);
        canvas.renderAll();
        if (isErasing) {
          eraseAt(pointer);
        }
      }
    
      canvas.on("mouse:move", updateEraser);
    
      canvas.on("mouse:down", function (event) {
        isErasing = true;
        updateEraser(event);
      });
    
      canvas.on("mouse:up", function () {
        isErasing = false;
        setTimeout(() => {
          if (eraserCursorGlobal) {
            canvas.remove(eraserCursorGlobal);
            eraserCursorGlobal = null;
            canvas.renderAll();
          }
        }, 100);
      });
    
      function eraseAt(pointer) {
        canvas.forEachObject((obj) => {
          if (obj === eraserCursorGlobal) return;
          if (obj.type === "path") {
            const bounds = obj.getBoundingRect();
            if (
              pointer.x >= bounds.left &&
              pointer.x <= bounds.left + bounds.width &&
              pointer.y >= bounds.top &&
              pointer.y <= bounds.top + bounds.height
            ) {
              canvas.remove(obj);
            }
          }
        });
        canvas.renderAll();
      }
    
      document.addEventListener("mousemove", function (event) {
        const rect = canvas.wrapperEl.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        ) {
          if (eraserCursorGlobal) {
            canvas.remove(eraserCursorGlobal);
            eraserCursorGlobal = null;
            canvas.renderAll();
          }
        } else {
          if (!eraserCursorGlobal && tool === "eraser") {
            eraserCursorGlobal = new fabric.Circle({
              radius: eraserSize / 2,
              stroke: "white",
              strokeWidth: 2,
              fill: "transparent",
              originX: "center",
              originY: "center",
              selectable: false,
              evented: false,
            });
            canvas.add(eraserCursorGlobal);
            canvas.renderAll();
          }
        }
      });
    }    
  }
  const handleToolChange = (tool) => {
    setSelectedTool(tool);
  };

  return (
    <div
      className="relative w-screen h-screen bg-black"
      style={{
        backgroundImage:
          "linear-gradient(rgba(136,136,136,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(136,136,136,0.2) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      <Header />
      <Toolbar onToolChange={handleToolChange} />
      <canvas
        id="drawing-canvas"
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-auto"
      ></canvas>
    </div>
  );
}