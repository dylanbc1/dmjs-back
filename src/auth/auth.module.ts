import { Global, Module, forwardRef } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guard/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleStrategy } from './strategies/auth.google.strategy';
import { AuthGoogleController } from './controllers/auth_google.controller';
import { AuthGoogleService } from './services/auth_google.service';
import { GoogleOauthGuard } from './guard/auth.google.guard';
import { User } from '../users/entities/user.entity';
import { RolesGuard } from './guard/roles.guard';
import { MAILER_OPTIONS, MailerModule, MailerService } from '@nestjs-modules/mailer';

@Global()
@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [
        ConfigModule,
        TypeOrmModule.forFeature([User])
      ],
      
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),

  ],
  controllers: [AuthController, AuthGoogleController],
  providers: [AuthService, AuthGuard,GoogleStrategy, AuthGoogleService, GoogleOauthGuard, RolesGuard],
  exports:[AuthModule, AuthGuard, JwtModule]
})
export class AuthModule {}
