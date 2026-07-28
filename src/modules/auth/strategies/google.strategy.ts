import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { TokensDto } from '../dtos/tokens.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { emails, photos, name } = profile;
    const user = {
      email: emails[0].value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      picture: photos[0].value,
      accessToken,
    };
    const jwt = await this.authService.validateOAuthUser({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      picture: user.picture,
      provider: 'google',
      accessToken: user.accessToken,
    });
    // Return JWT tokens as the payload
    const payload: TokensDto = {
      access_token: jwt.access_token,
      refresh_token: jwt.refresh_token,
    };
    done(null, payload);
  }
}
