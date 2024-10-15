import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UserModule } from '../user/user.module';
import { PrismaModule } from 'src/service/prisma/prisma.module';

@Module({
  providers: [ChatService],
  controllers: [ChatController],
  imports: [UserModule, PrismaModule]
})
export class ChatModule {}
