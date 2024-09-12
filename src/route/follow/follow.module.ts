import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { PrismaModule } from 'src/service/prisma/prisma.module';

@Module({
  providers: [FollowService],
  exports: [FollowService],
  imports: [PrismaModule]
})
export class FollowModule {}
