import { Body, Controller, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageBodyDTO } from './dto/create-message.dto';

@Controller('message')
export class MessageController {
  constructor (
    private messageService: MessageService
  ) {}

  @Post()
  async create(@Body() data: CreateMessageBodyDTO) {
    return await this.messageService.create(data)
  }
}
