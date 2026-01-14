import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(configService: ConfigService) {
        super({
            clientID: configService.getOrThrow<string>('GITHUB_CLIENT_ID'),
            clientSecret: configService.getOrThrow<string>('GITHUB_CLIENT_SECRET'),
            callbackURL: `${configService.getOrThrow<string>('BACKEND_URL')}/api/auth/github/callback`,
            scope: ['user:email'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any,
    ): Promise<any> {
        const { username, emails, photos, id, displayName } = profile;
        const user = {
            email: emails ? emails[0].value : null,
            name: displayName || username,
            avatar: photos ? photos[0].value : null,
            provider: 'github',
            providerId: id.toString(),
        };
        done(null, user);
    }
}
