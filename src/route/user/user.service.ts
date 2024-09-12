import { forwardRef, Inject, Injectable, PreconditionFailedException, UnauthorizedException } from '@nestjs/common';
import { TokenService } from 'src/service/token/token.service';
import { AuthenticationBodyDTO } from './dto/authentication-body.dto';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { CreateUserBodyDTO } from './dto/create-user-body.dto';
import { uuidv7 } from 'uuidv7'
import { hash, verify } from 'argon2';
import { PostService } from 'src/route/post/post.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private tokenService: TokenService,
    @Inject(forwardRef(() => PostService))
    private postService: PostService
  ) {}

  async login({ user, password }: AuthenticationBodyDTO) {
    const userDb = await this.prismaService.user.findFirst({
      where: {
        OR: [ { email: user }, { username: user } ]
      }
    })
    if (!userDb) throw new UnauthorizedException('Invalid email or password.')
    
    const { password: hash, ...userData} = userDb
    if(await verify(hash, password)) 
      return this.tokenService.createToken(userData)
    
    throw new UnauthorizedException('Invalid email or password.')
  }

  async decodeToken({ token }: { token: string }) {
    return await this.tokenService.decodeUser(token)
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

  async follow({ followerUsername, username }: { followerUsername: string, username: string }) {
    if (followerUsername === username ) throw new PreconditionFailedException('Command is failed.')

    const user = await this.prismaService.user.findFirst({ where: { username }, select: { followers: true, id: true } })
    if (!user) throw new PreconditionFailedException('User do not exists.')

    const followUser = await this.prismaService.user.findFirst({ where: { username: followerUsername }, select: { following: true, id: true } })
    if (!followUser) throw new PreconditionFailedException('Follower do not exists.')

    await this.prismaService.follows.create({
      data: {
        id: uuidv7(),
        followerId: user.id,
        followingId: followUser.id
      }
    })
  }

  async unFollow({ followerUsername, username }: { followerUsername: string, username: string }) {
    if (followerUsername === username ) throw new PreconditionFailedException('Command is failed.')

    const user = await this.prismaService.user.findFirst({ where: { username }, select: { followers: true, id: true } })
    if (!user) throw new PreconditionFailedException('User do not exists.')

    const followUser = await this.prismaService.user.findFirst({ where: { username: followerUsername }, select: { following: true, id: true } })
    if (!followUser) throw new PreconditionFailedException('User do not exists.')

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        followers: {
          set: [ ...user.followers.filter(({ id }) => id !== followUser.id) ]
        }
      }
    })
    await this.prismaService.user.update({
      where: { id: followUser.id },
      data: {
        following: {
          set: [ ...followUser.following.filter(({ id }) => id !== followUser.id) ]
        }
      }
    })
  }

  async listFollowers(id: string) {
    const { followers } = await this.prismaService.user.findFirst({
      where: { id },
      select: { followers: true },
      orderBy: { createdAt: 'desc' }
    })
    if (!followers) throw new PreconditionFailedException('User do not exists.')
    return followers
  }

  async listFollowing(id: string) {
    const user = await this.prismaService.user.findFirst({ where: { id }, select: { following: true }})
    if (!user) throw new PreconditionFailedException('User do not exists.')
    return user
  } 

  async isExistEmail(email: string) {
    const user = await this.prismaService.user.findFirst({ where: { email } })
    if (user) return true
    return false
  }

  async isExistUsername(username: string) {
    const user = await this.prismaService.user.findFirst({ where: { username } })
    if (user) return true
    return false
  }

  async getPostsByFollowers(id: string) {
    const followers = await this.listFollowers(id)

    const posts = await Promise.all(followers.map(async ({ id }) => {
      return await this.postService.getById(id)
    }))
    
    const postMe = await this.postService.getById(id)
    posts.push(postMe)

    const orderedPosts = posts.flat().sort((a, b) => {
      return b.id.localeCompare(a.id);
    })
    return orderedPosts
  }

  async findById(id: string) {
    const user = await this.prismaService.user.findFirst({ where: { id } })
    if (!user) throw new PreconditionFailedException('User do not exists.')
    return user
  }

  async getUserByUsername(username: string) {
    const user = await this.prismaService.user.findFirst({
      where: { username },
      select: {
        username: true,
        name: true,
        posts: true,
        followers: true,
        following: true,
        image: true
      }
    })
    if (!user) throw new PreconditionFailedException('User do not exists.')
    return user
  }
}
