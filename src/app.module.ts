import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './service/prisma/prisma.module';
import { UserModule } from './route/user/user.module';
import { TokenModule } from './service/token/token.module';
import { PostModule } from './routes/post/post.module';

@Module({
  imports: [PrismaModule, UserModule, TokenModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
