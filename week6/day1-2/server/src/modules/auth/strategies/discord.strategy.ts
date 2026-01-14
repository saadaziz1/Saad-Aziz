import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
    constructor(configService: ConfigService) {
        super({
            clientID: configService.getOrThrow<string>('DISCORD_CLIENT_ID'),
            clientSecret: configService.getOrThrow<string>('DISCORD_CLIENT_SECRET'),
            callbackURL: `${configService.getOrThrow<string>('BACKEND_URL')}/api/auth/discord/callback`,
            scope: ['identify', 'email'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any,
    ): Promise<any> {
        const { username, email, avatar, id } = profile;
        const avatarUrl = avatar
            ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`
            : null;

        const user = {
            email: email,
            name: username,
            avatar: avatarUrl,
            provider: 'discord',
            providerId: id,
        };
        done(null, user);
    }
}
