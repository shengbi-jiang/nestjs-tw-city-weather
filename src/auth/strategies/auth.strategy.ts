import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthStrategyRegistryService } from '../auth-strategy-registry.service';
import { AuthService } from '../auth.service';
import { AuthStrategy as IAuthStrategy } from '../types/auth-strategy';

const AUTHORIZATION_HEADER = 'authorization';
const BEARER_REGEX = /^Bearer /;
const BEARER_PREFIX_LENGTH = 7;

@Injectable()
export class AuthStrategy implements IAuthStrategy {
  constructor(private readonly authService: AuthService, authStrategyRegistryService: AuthStrategyRegistryService) {
    authStrategyRegistryService.register('auth', this);
  }

  async authenticate(context: ExecutionContext): Promise<void> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers[AUTHORIZATION_HEADER] as string;
    if (!BEARER_REGEX.test(authorization)) {
      throw new ForbiddenException();
    }

    const token = authorization.slice(BEARER_PREFIX_LENGTH);
    console.log('TOKEN:', token);
    try {
      // TODO: verify authorization token
      // this.authService.verifyJwtToken(token);
    } catch (err) {
      throw err;
    }
  }
}
