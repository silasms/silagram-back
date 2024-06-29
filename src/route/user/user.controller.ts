import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthenticationBodyDTO } from './dto/authentication-body.dto';
import { CreateUserBodyDTO } from './dto/create-user-body.dto';

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
  async follow(@Body() body: { follower: string, id: string }) {
    return await this.userService.follow(body)
  }

  @Post('unfollow')
  async unFollow(@Body() body: { follower: string, id: string }) {
    return await this.userService.unFollow(body)
  }
}
