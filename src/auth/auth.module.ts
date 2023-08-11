import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PassportModule } from '@nestjs/passport';

import { AuthService } from './domain/service/auth.service';
import { AuthController } from './application/controllers/auth.controller';

import { JwtStrategy } from './application/strategies/jwt.strategy';
import { UserRepository } from './infraestructure/repositories/user.repository';
import { User } from './infraestructure/entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, UserRepository]),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    })
  ],
  exports: [
    AuthService,
    TypeOrmModule,
    JwtStrategy,
    PassportModule,
    JwtModule,
  ]
})
export class AuthModule {}
