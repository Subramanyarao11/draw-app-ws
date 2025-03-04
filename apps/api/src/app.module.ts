import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhiteboardModule } from './whiteboard/whiteboard.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'),
    }),
    WhiteboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
