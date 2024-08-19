import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor (
    private prismaService: PrismaService
  ) {}


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
