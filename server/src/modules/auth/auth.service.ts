import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user || !user.isActive) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.signToken(user._id.toString(), user.email);
        return {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
            ...token
        };
    }

    private signToken(userId: string, email: string) {
        const payload = { sub: userId, email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
