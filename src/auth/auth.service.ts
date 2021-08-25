import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../app-config/app-config.service';
import { JwtTokenPayloadDto } from './dtos/jwt-token-payload.dto';
import { LoginPayloadDto } from './dtos/login-payload.dto';

@Injectable()
export class AuthService {
  constructor(private readonly appConfigService: AppConfigService, private readonly jwtService: JwtService) {}

  async login(data: LoginPayloadDto) {
    const { username, password } = data;
    const { apiUsername, apiPassword } = this.appConfigService;
    const isUsernameIdentical = username === apiUsername;
    const isPasswordIdentical = password === apiPassword;
    if (!isUsernameIdentical || !isPasswordIdentical) {
      throw new UnauthorizedException();
    }
  }

  createJwtToken(): string {
    const payload: JwtTokenPayloadDto = { role: 'api-user' };
    return this.jwtService.sign(payload);
  }

  verifyJwtToken(token: string) {
    try {
      this.jwtService.verify<JwtTokenPayloadDto>(token);
    } catch (err) {
      throw new ForbiddenException(err.message);
    }
  }
}
