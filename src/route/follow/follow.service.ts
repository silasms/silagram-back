import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor (
    private prismaService: PrismaService
  ) {}

  async deleteByIds(followingId: string, followerId: string) {
    return await this.prismaService.follows.deleteMany({
      where: {
        followingId,
        followerId
      }
    })
  }
}
