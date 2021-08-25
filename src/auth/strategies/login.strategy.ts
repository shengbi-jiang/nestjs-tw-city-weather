import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthStrategyRegistryService } from '../auth-strategy-registry.service';
import { AuthService } from '../auth.service';
import { LoginPayloadDto } from '../dtos/login-payload.dto';
import { AuthStrategy } from '../types/auth-strategy';

@Injectable()
export class LoginStrategy implements AuthStrategy {
  constructor(private readonly authService: AuthService, authStrategyRegistryService: AuthStrategyRegistryService) {
    authStrategyRegistryService.register('login', this);
  }

  private async transformRequestBody(context: ExecutionContext): Promise<LoginPayloadDto> {
    const request = context.switchToHttp().getRequest<Request>();
    const body = plainToClass(LoginPayloadDto, request.body);
    const errs = await validate(body);
    if (errs.length > 0) {
      throw new BadRequestException(errs[0].toString());
    }
    return body;
  }

  async authenticate(context: ExecutionContext): Promise<void> {
    const data = await this.transformRequestBody(context);
    await this.authService.login(data);
  }
}
