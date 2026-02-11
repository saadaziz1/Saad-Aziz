import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'super-secret-key',
        });
    }

    async validate(payload: any) {
        const user = await this.userModel.findById(payload.sub);

        if (!user) {
            throw new UnauthorizedException('User no longer exists');
        }

        if (user.isBlocked) {
            throw new UnauthorizedException('Your account has been blocked');
        }

        if (user.role !== payload.role) {
            throw new UnauthorizedException('Your role has been updated. Please log in again.');
        }

        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
            name: payload.name
        };
    }
}
