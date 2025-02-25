import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

interface Element {
    id: string;
    type: string;
    points: { x: number; y: number }[];
    color: string;
  }

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [elements, setElements] = useState<Element[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState<Element | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL || window.location.origin);
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('whiteboard-state', (elements) => {
      setElements(elements);
    });

    socket.on('element-update', (elementData) => {
      setElements(prevElements => {
        const index = prevElements.findIndex(element => element.id === elementData.id);
        if (index === -1) {
          return [...prevElements, elementData];
        } else {
          const newElements = [...prevElements];
          newElements[index] = elementData;
          return newElements;
        }
      });
    });

    socket.on('whiteboard-clear', () => {
      setElements([]);
    });

    return () => {
      socket.off('whiteboard-state');
      socket.off('element-update');
      socket.off('whiteboard-clear');
    };
  }, [socket]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }


    elements.forEach(element => {
      if (element.type === 'line' && context) {
        drawLine(context, element.points, element.color);
      }
    });

    if (drawing && currentElement && context) {
      drawLine(context, currentElement.points, currentElement.color);
    }
  }, [elements, drawing, currentElement]);

  const drawLine = (context: CanvasRenderingContext2D, points: { x: number; y: number }[], color: string) => {
    if (!points || points.length < 2) return;

    context.strokeStyle = color || '#000';
    context.lineWidth = 3;
    context.lineJoin = 'round';
    context.lineCap = 'round';

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }

    context.stroke();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { offsetX, offsetY } = e.nativeEvent;

    const newElement = {
      id: uuidv4(),
      type: 'line',
      points: [{ x: offsetX, y: offsetY }],
      color: getRandomColor(),
    };

    setCurrentElement(newElement);
    setDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!drawing || !currentElement) return;

    const { offsetX, offsetY } = e.nativeEvent;

    setCurrentElement(prevElement => {
        if (!prevElement) return null;
        const updatedElement: Element = {
          ...prevElement,
          points: [...prevElement.points, { x: offsetX, y: offsetY }]
        };

        return updatedElement;
      });
  };

  const handleMouseUp = () => {
    if (!drawing || !currentElement) return;
    setElements(prevElements => [...prevElements, currentElement]);
    if (socket) {
      socket.emit('element-update', currentElement);
    }

    setDrawing(false);
    setCurrentElement(null);
  };

  const handleClearCanvas = () => {
    setElements([]);
    if (socket) {
      socket.emit('whiteboard-clear');
    }
  };

  const getRandomColor = () => {
    const colors = ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Collaborative Whiteboard</h1>
        <button onClick={handleClearCanvas}>Clear Whiteboard</button>
      </header>
      <main>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ border: '1px solid #000', backgroundColor: '#fff' }}
        />
      </main>
    </div>
  );
}

export default App;
