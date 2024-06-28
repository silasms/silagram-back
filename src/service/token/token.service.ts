import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService<T extends string | object | Buffer = any> {
  private readonly logger = new Logger(TokenService.name);
  constructor(private jwtService: JwtService) {}

  async createToken(payload: T, neverExpires?: boolean) {
    const options: {
      secret: string;
      expiresIn?: string;
    } = {
      secret: process.env.SECRET,
    };
    if (!neverExpires) options.expiresIn = '12h';

    return this.jwtService.signAsync(payload as object, options);
  }

  async decodeToken(token: string) {
    return (await this.jwtService
      .verifyAsync(token, { secret: process.env.SECRET })
      .catch((err) => {
        this.logger.error(err.message, err);
        null;
      })) as T;
  }

  async decodeUser(token: string) {
    return (await this.jwtService.decode(token)) as T;
  }
}
