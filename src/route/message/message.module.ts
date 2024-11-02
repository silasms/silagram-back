import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaModule } from 'src/service/prisma/prisma.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  providers: [MessageService],
  controllers: [MessageController],
  imports: [PrismaModule, ChatModule],
  exports: [MessageService]
})
export class MessageModule {}
