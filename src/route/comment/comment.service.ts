import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { CreateCommentBodyDTO } from './dto/create-comment-body.dto';
import { uuidv7 } from 'uuidv7';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';

@Injectable()
export class CommentService {
  constructor (
    private prismaService: PrismaService,
    private postService: PostService,
    private userService: UserService
  ) {}

  async create({ postId, message, userId}: CreateCommentBodyDTO) {
    const user = await this.userService.findById(userId)

    const post = await this.postService.getFirstById(postId)
    
    return await this.prismaService.comments.create({ 
      data: {
        id: uuidv7(),
        postId: post.id,
        message,
        userId: user.id
      }
    })
  }

  async getCommentsByPost(postId: string) {
    const post = await this.postService.getFirstById(postId)
    
    return await this.prismaService.comments.findMany({
      where: { postId: post.id },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }
}
