import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TokenModule } from 'src/service/token/token.module';
import { PrismaModule } from 'src/service/prisma/prisma.module';
import { PostModule } from 'src/route/post/post.module';
import { FollowModule } from '../follow/follow.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [TokenModule, PrismaModule, forwardRef(() =>PostModule), FollowModule],
  exports: [UserService]
})
export class UserModule {}
