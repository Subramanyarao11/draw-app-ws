import React from 'react';
import rectangleIcon from '../assets/rectangle.svg';
import lineIcon from '../assets/line.svg';
import rubberIcon from '../assets/rubber.svg';
import pencilIcon from '../assets/pencil.svg';
import textIcon from '../assets/text.svg';
import { ToolTypes } from '../constants';
import useWhiteboardStore from '../store/whiteboardStore';
import { useSocket } from '../context/SocketContext';

interface IconButtonProps {
  src: string;
  type?: ToolTypes;
  isRubber?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ src, type, isRubber }) => {
  const selectedToolType = useWhiteboardStore((state) => state.tool);
  const setToolType = useWhiteboardStore((state) => state.setToolType);
  const setElements = useWhiteboardStore((state) => state.setElements);

  const { clearWhiteboard } = useSocket();

  const handleToolChange = () => {
    if (type) {
      setToolType(type);
    }
  };

  const handleClearCanvas = () => {
    setElements([]);
    clearWhiteboard();
  };

  return (
    <button
      onClick={isRubber ? handleClearCanvas : handleToolChange}
      className={selectedToolType === type ? 'menu_button_active' : 'menu_button'}
    >
      <img width="80%" height="80%" src={src} alt={type || 'clear'} />
    </button>
  );
};

const Menu: React.FC = () => {
  return (
    <div className="menu_container">
      <IconButton src={rectangleIcon} type={ToolTypes.RECTANGLE} />
      <IconButton src={lineIcon} type={ToolTypes.LINE} />
      <IconButton src={rubberIcon} isRubber />
      <IconButton src={pencilIcon} type={ToolTypes.PENCIL} />
      <IconButton src={textIcon} type={ToolTypes.TEXT} />
    </div>
  );
};

export default Menu;
