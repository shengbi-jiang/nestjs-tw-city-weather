import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UseLoginGuard } from './guards/login.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseLoginGuard()
  @Post('token')
  async createToken() {
    return { token: this.authService.createJwtToken() };
  }
}
