import { Drawable } from "roughjs/bin/core";
import { RoughCanvas } from "roughjs/bin/canvas";
import { ToolTypes } from "../constants";

export interface Coordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface BaseElement {
  id: string;
  type: ToolTypes;
}

export interface RectangleElement extends BaseElement, Coordinates {
  roughElement: Drawable;
}

export interface LineElement extends BaseElement, Coordinates {
  roughElement: Drawable;
}

export interface PencilElement extends BaseElement {
  points: { x: number; y: number }[];
}

export interface TextElement extends BaseElement {
  x1: number;
  y1: number;
  text: string;
}

export type Element = RectangleElement | LineElement | PencilElement | TextElement;

export interface CreateElementParams extends Coordinates {
  toolType: ToolTypes;
  id: string;
  text?: string;
}

export interface DrawElementParams {
  roughCanvas: RoughCanvas;
  context: CanvasRenderingContext2D;
  element: Element;
}

export interface UpdateElementParams {
  id: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  type: ToolTypes;
  index: number;
  text?: string;
}

export interface ElementCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
