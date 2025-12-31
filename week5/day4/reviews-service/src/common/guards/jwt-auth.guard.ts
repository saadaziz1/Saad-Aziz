import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const secret = this.configService.get<string>('jwtSecret');
      if (!secret) {
        throw new UnauthorizedException('JWT secret not configured');
      }

      const payload: any = jwt.verify(token, secret);

      // ✅ MATCHES EXPRESS PAYLOAD
      req.user = {
        id: payload.id,
        role: payload.role,
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
