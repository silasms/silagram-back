import { forwardRef, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PrismaModule } from 'src/service/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { PostController } from './post.controller';

@Module({
  providers: [PostService],
  imports: [PrismaModule, forwardRef(() => UserModule)],
  exports: [PostService],
  controllers: [PostController],
})
export class PostModule {}
