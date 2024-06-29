import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './service/prisma/prisma.module';
import { UserModule } from './route/user/user.module';
import { TokenModule } from './service/token/token.module';

@Module({
  imports: [PrismaModule, UserModule, TokenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
