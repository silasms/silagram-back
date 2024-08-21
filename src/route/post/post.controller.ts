import { Body, Controller, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostBodyDTO } from './dto/create-post-body.dto';

@Controller('post')
export class PostController {
  constructor (
    private postService: PostService
  ) {}

  @Post()
  async create(@Body() data: CreatePostBodyDTO) {
    return await this.postService.create(data)
  }
}
