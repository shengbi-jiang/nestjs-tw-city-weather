import { CanActivate, ExecutionContext, mixin, Optional, Type } from '@nestjs/common';
import { AuthStrategyRegistryService } from '../auth-strategy-registry.service';

export function createGuardType(strategyName: string): Type<CanActivate> {
  class MixinGuard implements CanActivate {
    constructor(
      @Optional()
      private readonly authStrategyRegistryService: AuthStrategyRegistryService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const authenticator = this.authStrategyRegistryService.get(strategyName);
      await authenticator.authenticate(context);
      return true;
    }
  }

  return mixin(MixinGuard);
}
