import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthenticationBodyDTO } from './dto/authentication-body.dto';
import { CreateUserBodyDTO } from './dto/create-user-body.dto';
import { DecodeTokenBodyDTO } from './dto/decode-token-body.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  async login(@Body() body: AuthenticationBodyDTO) {
    return await this.userService.login(body)
  }

  @Post('register')
  async createUser(@Body() body: CreateUserBodyDTO) {
    return await this.userService.createUser(body)
  }

  @Post('follow')
  async follow(@Body() body: { followerUsername: string, username: string }) {
    return await this.userService.follow(body)
  }

  @Post('unfollow')
  async unFollow(@Body() body: { followerUsername: string, username: string }) {
    return await this.userService.unFollow(body)
  }

  @Get('/followers/:id')
  async followers(@Param('id') id: string) {
    return await this.userService.listFollowers(id)
  }

  @Get('/following/:id')
  async following(@Param('id') id: string) {
    return await this.userService.listFollowing(id)
  }

  @Post('verifyemail')
  async isExistEmail(@Body() body: { email: string }) {
    return await this.userService.isExistEmail(body.email)
  }

  @Post('verifyusername')
  async isExistUsername(@Body() body: { username: string }) {
    return await this.userService.isExistUsername(body.username)
  }

  @Post('decodetoken')
  async decodeToken(@Body() body: DecodeTokenBodyDTO) {
    return await this.userService.decodeToken(body)
  }

  @Get('getposts/:id')
  async getPosts(@Param('id') id: string) {
    return await this.userService.getPostsByFollowers(id)
  }

  @Get('getbyusername/:username')
  async getUserByUsername(@Param('username') username: string) {
    return await this.userService.getUserByUsername(username)
  }
}
