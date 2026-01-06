import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JWT Strategy runs automatically for protected routes
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // Extract token from Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Token expiration is respected
      ignoreExpiration: false,

      // Secret used to verify token
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * validate() runs AFTER token is verified
   * Whatever you return here becomes req.user
   */
  async validate(payload: any) {
    return {
      userId: payload.sub,
      role: payload.role,
      email: payload.email,
    };
  }
}
