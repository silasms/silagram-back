import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TokenModule } from 'src/service/token/token.module';
import { PrismaModule } from 'src/service/prisma/prisma.module';
import { PostModule } from 'src/routes/post/post.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [TokenModule, PrismaModule, PostModule],
})
export class UserModule {}
