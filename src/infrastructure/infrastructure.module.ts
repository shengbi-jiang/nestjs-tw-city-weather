import { Global, Module } from '@nestjs/common';
import { AuthStrategyRegistryService } from '../auth/auth-strategy-registry.service';

@Global()
@Module({
  providers: [AuthStrategyRegistryService],
  exports: [AuthStrategyRegistryService],
})
export class InfrastructureModule {}
