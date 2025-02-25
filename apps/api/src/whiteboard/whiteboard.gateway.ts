import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WhiteboardService } from './whiteboard.service';

interface ElementData {
  id: string;
  [key: string]: any;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class WhiteboardGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private whiteboardService: WhiteboardService) {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log('user connected');
    client.emit('whiteboard-state', this.whiteboardService.getElements());
  }

  handleDisconnect() {
    console.log('user disconnected');
  }

  @SubscribeMessage('element-update')
  handleElementUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() elementData: ElementData,
  ) {
    this.whiteboardService.updateElement(elementData);
    client.broadcast.emit('element-update', elementData);
  }

  @SubscribeMessage('whiteboard-clear')
  handleWhiteboardClear(@ConnectedSocket() client: Socket) {
    this.whiteboardService.clearElements();
    client.broadcast.emit('whiteboard-clear');
  }
}
