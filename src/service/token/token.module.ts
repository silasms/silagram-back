import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [TokenService],
  exports: [TokenService],
  imports: [ConfigModule.forRoot(), JwtModule]
})
export class TokenModule {}
