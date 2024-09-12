import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';

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

  async create(followerId: string, followingId: string) {
    return await this.prismaService.follows.create({
      data: {
        id: uuidv7(),
        followerId,
        followingId
      }
    })
  }
}
