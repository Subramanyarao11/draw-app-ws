import React, { useRef, useLayoutEffect, useState } from "react";
import Menu from "./Menu";
import rough from "roughjs";
import { Actions, ToolTypes } from "../constants";
import { v4 as uuid } from "uuid";
import useWhiteboardStore from "../store/whiteboardStore";
import { useSocket } from "../context/SocketContext";
import { drawElement } from "../utils/drawElement";
import { createElement } from "../utils/createElement";
import { adjustmentRequired } from "../utils/adjustmentrequired";
import { adjustElementCoordinates } from "../utils/adjustElementCoordinates";
import { DrawElementParams, Element, LineElement, RectangleElement } from "../types";

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const elements = useWhiteboardStore((state) => state.elements);
  const toolType = useWhiteboardStore((state) => state.tool);
  const updateElementInStore = useWhiteboardStore((state) => state.updateElement);
  const { updateElement: emitElementUpdate } = useSocket();
  const [action, setAction] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => {
      drawElement({ roughCanvas, context: ctx, element } as DrawElementParams);
    });
  }, [elements]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;

    if (selectedElement && action === Actions.WRITING) {
      return;
    }

    if (!toolType) return;

    const element = createElement({
        x1: clientX,
        y1: clientY,
        x2: clientX + (toolType === ToolTypes.RECTANGLE || toolType === ToolTypes.LINE ? 10 : 0),
        y2: clientY + (toolType === ToolTypes.RECTANGLE || toolType === ToolTypes.LINE ? 10 : 0),
        toolType,
        id: uuid(),
      });


    switch (toolType) {
      case ToolTypes.RECTANGLE:
      case ToolTypes.LINE:
      case ToolTypes.PENCIL: {
        setAction(Actions.DRAWING);
        break;
      }
      case ToolTypes.TEXT: {
        setAction(Actions.WRITING);
        break;
      }
    }

    setSelectedElement(element);
    updateElementInStore(element);
    emitElementUpdate?.(element);
  };

  const handleMouseUp = () => {
    if (!selectedElement) return;

    const selectedElementIndex = elements.findIndex(
      (el) => el.id === selectedElement?.id
    );

    if (selectedElementIndex !== -1) {
      if (action === Actions.DRAWING) {
        if (adjustmentRequired(elements[selectedElementIndex].type)) {
            const element = elements[selectedElementIndex];
            if ('x1' in element && 'y1' in element && 'x2' in element && 'y2' in element) {
              const adjustedCoordinates = adjustElementCoordinates(element as RectangleElement | LineElement);

              if (adjustedCoordinates) {
                const updatedElement = {
                  ...element,
                  x1: adjustedCoordinates.x1,
                  y1: adjustedCoordinates.y1,
                  x2: adjustedCoordinates.x2,
                  y2: adjustedCoordinates.y2,
                };
                updateElementInStore(updatedElement);
                emitElementUpdate?.(updatedElement);
              }
            }
          }
      }
    }

    setAction(null);
    setSelectedElement(null);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;

    if (action === Actions.DRAWING) {
      const index = elements.findIndex((el) => el.id === selectedElement?.id);
      if (index !== -1) {
        const updatedElement = {
          ...elements[index],
          x2: clientX,
          y2: clientY,
        };
        if (updatedElement.type === ToolTypes.RECTANGLE || updatedElement.type === ToolTypes.LINE) {
            const newElement = createElement({
              x1: (updatedElement as RectangleElement | LineElement).x1,
              y1: (updatedElement as RectangleElement | LineElement).y1,
              x2: updatedElement.x2,
              y2: updatedElement.y2,
              toolType: updatedElement.type,
              id: updatedElement.id,
            });
            const updatedElementWithRough = updatedElement as RectangleElement | LineElement;
            updatedElementWithRough.roughElement = (newElement as RectangleElement | LineElement).roughElement;
          }
        updateElementInStore(updatedElement);
        emitElementUpdate?.(updatedElement);
      }
    }
  };

  const handleTextareaBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (!selectedElement) return;
    const updatedElement = {
      ...selectedElement,
      text: event.target.value,
    };
    updateElementInStore(updatedElement);
    emitElementUpdate?.(updatedElement);
    setAction(null);
    setSelectedElement(null);
  };

  return (
    <>
      <Menu />
      {action === Actions.WRITING ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleTextareaBlur}
          style={{
            position: "absolute",
            top: selectedElement && 'y1' in selectedElement ? selectedElement.y1 - 3 : 0,
            left: selectedElement && 'x1' in selectedElement ? selectedElement.x1 : 0,
            font: "24px sans-serif",
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            resize: "none",
            overflow: "hidden",
            whiteSpace: "pre",
            background: "transparent",
          }}
        />
      ) : null}
      <canvas
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        id="canvas"
      />
    </>
  );
};

export default Whiteboard;
