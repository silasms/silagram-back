import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { PrismaModule } from 'src/service/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';

@Module({
  providers: [LikeService],
  controllers: [LikeController],
  imports: [PrismaModule, UserModule, PostModule]
})
export class LikeModule {}
