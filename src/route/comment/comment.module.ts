import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaModule } from 'src/service/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';

@Module({
  providers: [CommentService],
  controllers: [CommentController],
  imports: [PrismaModule, UserModule, PostModule]
})
export class CommentModule {}
