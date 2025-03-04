import { getStroke } from "perfect-freehand";
import { ToolTypes } from "../constants";
import { getSvgPathFromStroke } from "./getSvgPathFromStroke";
import { DrawElementParams, LineElement, PencilElement, RectangleElement, TextElement } from "../types";

const drawPencilElement = (context: CanvasRenderingContext2D, element: PencilElement): void => {
  const myStroke = getStroke(element.points, {
    size: 10,
  });

  const pathData = getSvgPathFromStroke(myStroke);

  const myPath = new Path2D(pathData);
  context.fill(myPath);
};

const drawTextElement = (context: CanvasRenderingContext2D, element: TextElement): void => {
  context.textBaseline = "top";
  context.font = "24px sans-serif";
  context.fillText(element.text, element.x1, element.y1);
};

export const drawElement = ({ roughCanvas, context, element }: DrawElementParams): void => {
  switch (element.type) {
    case ToolTypes.RECTANGLE:
    case ToolTypes.LINE:
        if ((element as RectangleElement | LineElement).roughElement) {
          roughCanvas.draw((element as RectangleElement | LineElement).roughElement);
        } else {
          console.error("No roughElement found on element:", element);
        }
        break;
    case ToolTypes.PENCIL:
      drawPencilElement(context, element as PencilElement);
      break;
    case ToolTypes.TEXT:
      drawTextElement(context, element as TextElement);
      break;
    default:
      throw new Error("Something went wrong when drawing element");
  }
};
