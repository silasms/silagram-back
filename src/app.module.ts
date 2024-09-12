import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './service/prisma/prisma.module';
import { UserModule } from './route/user/user.module';
import { TokenModule } from './service/token/token.module';
import { PostModule } from './route/post/post.module';
import { CommentModule } from './route/comment/comment.module';
import { LikeModule } from './route/like/like.module';
import { FollowModule } from './route/follow/follow.module';

@Module({
  imports: [PrismaModule, UserModule, TokenModule, PostModule, CommentModule, LikeModule, FollowModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
