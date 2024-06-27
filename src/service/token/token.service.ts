import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { hash, verify } from 'argon2';

@Injectable()
export class TokenService {
  async createToken(password: string) {
    try {
      const token = await hash(password);
      return token
    } catch(err) {
      Logger.error(err)
    }
  }

  async verifyToken(token: string, password: string) {
    try {
      if (await verify(token, password)) {
        return token
      } else {
        throw new UnauthorizedException('Password is invalid')
      }
    } catch(err) {
      Logger.error(err)
    }
  }
}
