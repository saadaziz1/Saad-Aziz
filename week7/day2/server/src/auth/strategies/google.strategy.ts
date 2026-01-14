import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private configService: ConfigService) {
        const clientId = configService.get<string>('auth.google.clientId');
        const clientSecret = configService.get<string>('auth.google.clientSecret');

        if (!clientId || !clientSecret) {
            throw new Error('Google Client ID and Client Secret must be provided in environment variables.');
        }

        super({
            clientID: clientId,
            clientSecret: clientSecret,
            callbackURL: configService.get<string>('auth.google.callbackUrl'),
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken,
        };
        done(null, user);
    }
}
