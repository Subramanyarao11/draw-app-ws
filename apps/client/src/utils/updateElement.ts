import { ToolTypes } from "../constants";
import { useSocket } from "../context/SocketContext";
import useWhiteboardStore from "../store/whiteboardStore";
import { Element, PencilElement, UpdateElementParams } from "../types";
import { createElement } from "./createElement";

export const updateElement = (
  { id, x1, x2, y1, y2, type, index, text }: UpdateElementParams,
  elements: Element[]
) => {
  const { setElements } = useWhiteboardStore.getState();
  const { updateElement } = useSocket?.() || {};

  const elementsCopy = [...elements];

  switch (type) {
    case ToolTypes.LINE:
    case ToolTypes.RECTANGLE:
      const updatedElement = createElement({
        id,
        x1,
        y1,
        x2,
        y2,
        toolType: type,
      });

      elementsCopy[index] = updatedElement;
      setElements(elementsCopy);
      updateElement?.(updatedElement);
      break;
      case ToolTypes.PENCIL:
        if (elementsCopy[index].type === ToolTypes.PENCIL) {
          const pencilElement = elementsCopy[index] as PencilElement;
          elementsCopy[index] = {
            ...pencilElement,
            points: [
              ...(pencilElement.points || []),
              {
                x: x2,
                y: y2,
              },
            ],
          };

          const updatedPencilElement = elementsCopy[index];
          setElements(elementsCopy);
          updateElement?.(updatedPencilElement);
        }
        break;
    case ToolTypes.TEXT:
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      if (!canvas) throw new Error("Canvas element not found");

      const context = canvas.getContext("2d");
      if (!context) throw new Error("Could not get canvas context");

      const textWidth = context.measureText(text || "").width;
      const textHeight = 24;

      elementsCopy[index] = {
        ...createElement({
          id,
          x1,
          y1,
          x2: x1 + textWidth,
          y2: y1 + textHeight,
          toolType: type,
          text,
        }),
      };

      const updatedTextElement = elementsCopy[index];
      setElements(elementsCopy);
      updateElement?.(updatedTextElement);
      break;
    default:
      throw new Error("Something went wrong when updating element");
  }
};
