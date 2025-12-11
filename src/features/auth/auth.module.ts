import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtModuleConfig } from '@core/modules/config/options/jwt.config';
import { UsersModule } from '@features/users/users.module';
import { AuthController } from '@features/auth/auth.controller';
import { AuthService } from '@features/auth/auth.service';
import { SessionSerializer } from '@features/auth/serializer/session.serializer';
import { JwtStrategy } from '@features/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@features/auth/strategies/local.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    JwtModule.registerAsync({
      useClass: JwtModuleConfig
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, SessionSerializer],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
