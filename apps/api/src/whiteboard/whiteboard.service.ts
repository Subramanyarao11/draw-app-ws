import { Injectable } from '@nestjs/common';

interface ElementData {
  id: string;
  [key: string]: any;
}

@Injectable()
export class WhiteboardService {
  private elements: ElementData[] = [];

  getElements(): ElementData[] {
    return this.elements;
  }

  updateElement(elementData: ElementData): void {
    const index = this.elements.findIndex(
      (element) => element.id === elementData.id,
    );

    if (index === -1) {
      this.elements.push(elementData);
    } else {
      this.elements[index] = elementData;
    }
  }

  clearElements(): void {
    this.elements = [];
  }
}
