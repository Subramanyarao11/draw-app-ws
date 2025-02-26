import { create } from 'zustand'
import { ToolTypes } from '../constants';

export interface Element {
  id: string;
  type: ToolTypes;
  [key: string]: any;
}

interface WhiteboardState {
  tool: ToolTypes | null;
  elements: Element[];
  setToolType: (tool: ToolTypes | null) => void;
  updateElement: (element: Element) => void;
  setElements: (elements: Element[]) => void;
}

const useWhiteboardStore = create<WhiteboardState>((set) => ({
  tool: null,
  elements: [],

  setToolType: (tool) => set({ tool }),

  updateElement: (element) => set((state) => {
    const index = state.elements.findIndex((el) => el.id === element.id);

    if (index === -1) {
      return { elements: [...state.elements, element] };
    } else {
      const newElements = [...state.elements];
      newElements[index] = element;
      return { elements: newElements };
    }
  }),

  setElements: (elements) => set({ elements }),
}));

export default useWhiteboardStore;
