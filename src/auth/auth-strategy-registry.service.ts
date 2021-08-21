import { Injectable } from '@nestjs/common';
import { AuthStrategy } from './types/auth-strategy';

@Injectable()
export class AuthStrategyRegistryService {
  private readonly strategyMap = new Map<string, AuthStrategy>();

  register(name: string, strategy: AuthStrategy) {
    if (this.strategyMap.has(name)) {
      console.warn(`AuthStrategy ${name} has already existed. The new one with the same will replace it.`);
    }
    this.strategyMap.set(name, strategy);
  }

  get(name: string): AuthStrategy {
    if (!this.strategyMap.has(name)) {
      throw new Error(`AuthStrategy ${name} does not exist.`);
    }
    return this.strategyMap.get(name);
  }
}
