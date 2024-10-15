import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor (
    private chatService: ChatService
  ) {}

  @Post()
  async createChat(@Body() data: any) {
    return await this.chatService.createChat(data)
  }

  @Get(':id')
  async getChat(@Param('id') id: string) {
    return await this.chatService.getChat(id)
  }

  @Post('/chatsuser')
  async getChatByUser(@Body() data: any) {
    return await this.chatService.getChatByUsers(data)
  }
}
