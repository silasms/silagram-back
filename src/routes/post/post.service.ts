import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor (
    private prismaService: PrismaService
  ) {}


  async getById(id: string) {
    return await this.prismaService.post.findMany({
      where: { id },
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: 10,
    })
  }
}
