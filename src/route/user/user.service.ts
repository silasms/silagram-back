import { Injectable, PreconditionFailedException, UnauthorizedException } from '@nestjs/common';
import { TokenService } from 'src/service/token/token.service';
import { AuthenticationBodyDTO } from './dto/authentication-body.dto';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { CreateUserBodyDTO } from './dto/create-user-body.dto';
import { uuidv7 } from 'uuidv7'
import { hash, verify } from 'argon2';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private tokenService: TokenService,
  ) {}

  async login({ email, password }: AuthenticationBodyDTO) {
    const user = await this.prismaService.user.findFirst({ where: { email }})
    if (!user) throw new UnauthorizedException('Invalid email or password.')
    
    const { password: hash, ...userData} = user
    if(await verify(hash, password)) 
      return this.tokenService.createToken(userData)
    
    throw new UnauthorizedException('Invalid email or password.')
  }

  async createUser({ name, email, password, username }: CreateUserBodyDTO) {
    const userDb = await this.prismaService.user.findFirst({
      where: {
        OR: [ { email }, { username } ]
      }
    })
    if (userDb) throw new PreconditionFailedException('Email or Username already exists.')
    const user = await this.prismaService.user.create({
      data: {
        id: uuidv7(),
        name,
        email,
        password: String(await hash(password)),
        username,
      }
    })
    return user
  }

  async follow({ follower, id }: { follower: string, id: string }) {
    if (follower === id ) throw new PreconditionFailedException('Command is failed.')

    const user = await this.prismaService.user.findFirst({ where: { id }, select: { followers: true } })
    if (!user) throw new PreconditionFailedException('User do not exists.')

    const followUser = await this.prismaService.user.findFirst({ where: { id: follower }, select: { following: true } })
    if (!followUser) throw new PreconditionFailedException('User do not exists.')

    await this.prismaService.user.update({
      where: { id },
      data: {
        followers: {
          set: [...user.followers, follower ]
        }
      }
    })
    
    await this.prismaService.user.update({
      where: { id: follower },
      data: {
        following: {
          set: [ ...followUser.following, id ]
        }
      }
    })
  }

  async unFollow({ follower, id }: { follower: string, id: string }) {
    if (follower === id ) throw new PreconditionFailedException('Command is failed.')

    const user = await this.prismaService.user.findFirst({ where: { id }, select: { followers: true } })
    if (!user) throw new PreconditionFailedException('User do not exists.')

    const followUser = await this.prismaService.user.findFirst({ where: { id: follower }, select: { following: true } })
    if (!followUser) throw new PreconditionFailedException('User do not exists.')

    await this.prismaService.user.update({
      where: { id },
      data: {
        followers: {
          set: [ ...user.followers.filter(idFollow => idFollow !== follower) ]
        }
      }
    })
    await this.prismaService.user.update({
      where: { id: follower },
      data: {
        following: {
          set: [ ...followUser.following.filter(idUser => idUser !== id) ]
        }
      }
    })
  }

  async followers(id: string) {
    const user = await this.prismaService.user.findFirst({ where: { id }, select: { followers: true }})
    if (!user) throw new PreconditionFailedException('User do not exists.')
    return user
  }

  async listFollowing(id: string) {
    const user = await this.prismaService.user.findFirst({ where: { id }, select: { following: true }})
    if (!user) throw new PreconditionFailedException('User do not exists.')
    return user
  }
}
