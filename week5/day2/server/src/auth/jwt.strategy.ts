import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-super-secret-jwt-key-here',
    });
  }

  async validate(payload: any) {
    console.log('JWT Strategy - validating payload:', payload);
    
    if (!payload || !payload.userId) {
      console.log('Invalid payload structure');
      throw new UnauthorizedException('Invalid token payload');
    }
    
    const user = await this.authService.validateUser(payload.userId);
    console.log('JWT Strategy - user found:', !!user);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    return user;
  }
}