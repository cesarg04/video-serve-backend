import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from './strategies/jwt.strategy';



@Module({
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  
  JwtModule.registerAsync({
    imports: [ ConfigModule ],
    inject: [ ConfigService ],
    useFactory: ( ConfigService: ConfigService ) => {
      // console.log('JWT-SECRET', ConfigService.get('JWT_SECRET') )
      return {
        secret: ConfigService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '2h'
        }
      }
    }
  }),
  ConfigModule
  ],
  exports: [TypeOrmModule, AuthService, JWTStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
