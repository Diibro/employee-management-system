import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWtStrategy } from './strategies/jwt.strategy';
import { JwtConstants } from './jwtConstants';

@Module({
  imports: [
    UserModule, PassportModule,ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRY') || '1h' },
      }),
      inject: [ConfigService],
    })
  ],
  providers: [AuthService, LocalStrategy, JWtStrategy, JwtConstants],
  controllers: [AuthController],
  exports: [AuthService]
})

export class AuthModule {}