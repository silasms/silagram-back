import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { CreatePostBodyDTO } from './dto/create-post-body.dto';
import { UserService } from '../user/user.service';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class PostService {
  constructor (
    private prismaService: PrismaService,
    private userService: UserService
  ) {}

  async create({ authorId, image }: CreatePostBodyDTO) {
    const user = await this.userService.findById(authorId)
    return await this.prismaService.posts.create({
      data: {
        id: uuidv7(),
        authorId: user.id,
        image
      }
    })
  }

  async getById(id: string) {
    return await this.prismaService.posts.findMany({
      where: { id },
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: 10,
    })
  }

  async getFirstById(id: string) {
    const post = await this.prismaService.user.findFirst({ where: { id } })
    if (!post) throw new PreconditionFailedException('Post do not exists.')
    return post
  }
}
