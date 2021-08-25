import { UseGuards } from '@nestjs/common';
import { createGuardType } from './guard-type-factory';

export const AuthGuard = createGuardType('auth');

export function UseAuthGuard() {
  return UseGuards(AuthGuard);
}
