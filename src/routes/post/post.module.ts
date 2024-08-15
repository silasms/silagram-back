import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PrismaModule } from 'src/service/prisma/prisma.module';

@Module({
  providers: [PostService],
  imports: [PrismaModule],
  exports: [PostService]
})
export class PostModule {}
