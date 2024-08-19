import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateLikeBodyDTO } from './dto/create-like-body.dto';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
  constructor (
    private likeService: LikeService
  ) {}

  @Post()
  async create(@Body() body: CreateLikeBodyDTO) {
    return await this.likeService.create(body)
  }

  @Get('getlikesbypost/:postId')
  async getLikesByPost(@Param('postId') postId: string) {
    return await this.likeService.getLikesByPost(postId)
  }
}
