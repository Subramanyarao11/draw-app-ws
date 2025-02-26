import rough from "roughjs";
import { Drawable } from "roughjs/bin/core";
import { ToolTypes } from "../constants";
import { Coordinates, CreateElementParams, Element } from "../types";

const generator = rough.generator();

const generateRectangle = ({ x1, y1, x2, y2 }: Coordinates): Drawable => {
  return generator.rectangle(x1, y1, x2 - x1, y2 - y1);
};

const generateLine = ({ x1, y1, x2, y2 }: Coordinates): Drawable => {
  return generator.line(x1, y1, x2, y2);
};


export const createElement = ({ x1, y1, x2, y2, toolType, id, text }: CreateElementParams): Element => {
  let roughElement: Drawable;

  switch (toolType) {
    case ToolTypes.RECTANGLE:
      roughElement = generateRectangle({ x1, y1, x2, y2 });
      return {
        id: id,
        roughElement,
        type: toolType,
        x1,
        y1,
        x2,
        y2,
      };
    case ToolTypes.LINE:
      roughElement = generateLine({ x1, y1, x2, y2 });
      return {
        id: id,
        roughElement,
        type: toolType,
        x1,
        y1,
        x2,
        y2,
      };
    case ToolTypes.PENCIL:
      return {
        id,
        type: toolType,
        points: [{ x: x1, y: y1 }],
      };
    case ToolTypes.TEXT:
      return { id, type: toolType, x1, y1, text: text || "" };
    default:
      throw new Error("Something went wrong when creating element");
  }
};
