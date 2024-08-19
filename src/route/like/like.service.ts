import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { PostService } from '../post/post.service';
import { CreateLikeBodyDTO } from './dto/create-like-body.dto';
import { UserService } from '../user/user.service';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class LikeService {
  constructor (
    private prismaService: PrismaService,
    private postService: PostService,
    private userService: UserService
  ) {}

  async create({ postId, userId }: CreateLikeBodyDTO) {
    const user = await this.userService.findById(userId)
    const post = await this.postService.getFirstById(postId)

    return await this.prismaService.likes.create({
      data: {
        id: uuidv7(),
        userId: user.id,
        postId: post.id
      }
    })
  }

  async getLikesByPost(postId: string) {
    const post = await this.postService.getFirstById(postId)
    return await this.prismaService.likes.findMany({
      where: {
        postId: post.id
      }
    })
  }
}
