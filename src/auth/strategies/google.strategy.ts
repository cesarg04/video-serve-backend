import { Inject, Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { User } from '../entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    
    @Inject(ConfigService) readonly configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(AuthService) private readonly authService: AuthService
  ) {
    super({
      clientID: configService.get(`GOOGLE_CLIENT_ID`),
      clientSecret: configService.get('GOOGLE_SECRET_CLIENT'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    // const { id, name, emails, photos } = profile;

    console.log(_accessToken);
    console.log(_refreshToken);
    console.log(profile);

    const existUser = await this.authService.validateGoogleUser(profile.id)



    // const user = {
    //   provider: 'google',
    //   providerId: id,
    //   email: emails[0].value,
    //   name: `${name.givenName} ${name.familyName}`,
    //   picture: photos[0].value,
    // };

    // done(null, user);
  }
}