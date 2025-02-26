import { ToolTypes } from "../constants";

export const adjustmentRequired = (type: ToolTypes): boolean =>
  [ToolTypes.RECTANGLE, ToolTypes.LINE].includes(type);
