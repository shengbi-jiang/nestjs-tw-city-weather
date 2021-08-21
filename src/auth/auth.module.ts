import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthStrategy } from './strategies/auth.strategy';

@Module({
  providers: [AuthService, AuthStrategy],
  exports: [AuthService],
})
export class AuthModule {}
