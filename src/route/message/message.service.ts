import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';
import { CreateMessageBodyDTO } from './dto/create-message.dto';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class MessageService {
  constructor(
    private prismaService: PrismaService,
    private chatService: ChatService
  ) {}

  async create({ chatId, userId, message }: CreateMessageBodyDTO) {
    await this.prismaService.messages.create({
      data: {
        id: uuidv7(),
        chatId,
        userId,
        message
      }
    })
    await this.chatService.updateChat(chatId)
  }
}
