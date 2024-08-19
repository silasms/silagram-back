import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentBodyDTO } from './dto/create-comment-body.dto';

@Controller('comment')
export class CommentController {
  constructor (
    private commentService: CommentService
  ) {}

  @Post()
  async create(@Body() body: CreateCommentBodyDTO) {
    return this.commentService.create(body)
  }

  @Get('commentsByPost/:id')
  async getCommentsByPost(@Param('id') id: string) {
    return this.commentService.getCommentsByPost(id)
  }
}
