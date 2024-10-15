import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class ChatService {
  constructor (
    private userService: UserService,
    private prismaService: PrismaService
  ) {}

  async createChat({ user1, user2 }) {
    const exist = !!(await this.getChatByUsers({ user1, user2 }))
    if(exist) return

    const user1Db = await this.userService.getUserByUsername(user1)
    const user2Db = await this.userService.getUserByUsername(user2)

    return await this.prismaService.chats.create({
      data: {
        id: uuidv7(),
        user1Id: user1Db.id,
        user2Id: user2Db.id,
        messages: ``
      }
    })
  }

  async updateChat({ user1, user2, messages }) {
    const chat = await this.getChatByUsers({user1, user2})

    return await this.prismaService.chats.update({
      where: {
        id: chat.id
      },
      data: {
        messages
      }
    })
  }
 
  async getChatByUsers({ user1, user2 }) {
    const dbUser1 = await this.userService.getUserByUsername(user1)
    const dbUser2 = await this.userService.getUserByUsername(user2)

    return await this.prismaService.chats.findFirst({
      where: {
        OR: [
          {user1Id: dbUser1.id, user2Id: dbUser2.id},
          {user2Id: dbUser1.id, user1Id: dbUser2.id}
        ]
      }
    })
  }

  async getChat(userId: string) {
    return await this.prismaService.chats.findMany({
      where: {
        OR: [
          {user1Id: userId},
          {user2Id: userId}
        ]
      },
      include: {
        user1: true,
        user2: true
      }
    })
  }
}
